"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

async function run() {
  const sources = [], fetched = [], decoded = [];
  const events = JSON.parse(fs.readFileSync(path.join(__dirname,"../game/catalogo/eventos.json"),"utf8")).events;
  const node = () => ({connect(next) { this.next = next; return next; }, frequency:{value:0}, gain:{value:0}, pan:{value:0}});
  const ctx = {
    state:"running", destination:{},
    async decodeAudioData(bytes) { decoded.push(bytes.byteLength); return {recorded:bytes.byteLength}; },
    createBuffer(channel,length) { const channelData = new Float32Array(length); return {getChannelData:() => channelData}; },
    createBufferSource() {
      const source = {...node(),playbackRate:{value:1},start(when) { this.when = when; sources.push(this); },stop() { this.stopped = true; }};
      return source;
    },
    createGain:node,createBiquadFilter:node,createStereoPanner:node
  };
  const sandbox = vm.createContext({
    Recordings:{near:"audio/near.wav",tin:"audio/missing.wav",glass:"data:audio/wav;base64,AQID"},
    Level:{seeded:seed => () => (seed = seed*16807%2147483647)/2147483647}, atob, performance,
    async fetch(url) {
      fetched.push(url);
      if (url.endsWith("eventos.json")) return {ok:true,async json() { return {events}; }};
      const clip = /_(\d+)\.mp3$/.exec(url);
      return {ok:!url.endsWith("missing.wav") && !url.endsWith(".ogg"),
        async arrayBuffer() { return new ArrayBuffer(clip ? Number(clip[1])+100 : 4); }};
    }
  });
  const script = fs.readFileSync(path.join(__dirname,"../game/soundscape.js"),"utf8");
  const audio = vm.runInContext(script+"\nSoundscape",sandbox);
  await Promise.all([audio.preload(ctx),audio.preload(ctx)]);
  assert.deepEqual(fetched.sort(),["audio/missing.wav","audio/near.wav","catalogo/eventos.json"]);
  assert.deepEqual(decoded.sort(),[3,4]);
  const play = kind => {
    audio.play(ctx,{kind,x:1,y:0},{x:0,y:0});
    return sources.at(-1).buffer;
  };
  assert.equal(play("near").recorded,4);
  assert.equal(play("glass").recorded,3);
  assert.equal(typeof play("tin").getChannelData,"function");
  assert.equal(typeof play("wings").getChannelData,"function");
  audio.stop(ctx);
  assert.ok(sources.every(source => source.stopped));
  const zombie = (role,options) => audio.play(ctx,{
    kind:"zombie.common."+role,entity:"town:1",x:3,y:0,muffled:true,...options
  },{x:0,y:0});
  for (const role of ["idle","notice","chase","attack","hit","death"]) {
    await zombie(role);
    const clip = sources.at(-1);
    assert.ok(events["zombie.common."+role].files_mp3.some(file => clip.buffer.recorded === Number(/_(\d+)\.mp3$/.exec(file)[1])+100));
    assert.equal(clip.next.frequency.value,850);
    assert.ok(clip.next.next.next.pan.value > 0);
    assert.ok(clip.playbackRate.value >= .96 && clip.playbackRate.value <= 1.04);
    clip.onended();
  }
  const attackGain = async (x,muffled = false) => {
    await zombie("attack",{x,muffled});
    const source = sources.at(-1);
    source.onended();
    return source.next.next.gain.value;
  };
  const atFour = await attackGain(4);
  assert.ok(atFour <= .37*.1);
  assert.ok(await attackGain(1) > atFour*4);
  assert.ok(await attackGain(8) < atFour*.6);
  assert.ok(await attackGain(1,true) < await attackGain(1));
  const generated = ["doorOpen","doorClose","windowSlide","glassSmash","pry","hammer","stepSoft","stepHard","strike","shot","crash","idolClick","doorSlam","tension","tapSocial"];
  for (const kind of generated) {
    const samples = play(kind).getChannelData(0);
    const peak = samples.reduce((max,value) => Math.max(max,Math.abs(value)),0);
    assert.ok(peak > .01 && peak < 1,kind);
    assert.equal(samples.at(-1) < .005 && samples.at(-1) > -.005,true,kind);
    sources.at(-1).onended();
  }
  audio.play(ctx,{kind:"doorSlam",x:1,y:0,delay:.5},{x:0,y:0});
  assert.equal(sources.at(-1).when,.5,"delayed cue starts later");
  sources.at(-1).onended();
  audio.play(ctx,{kind:"doorSlam",x:1,y:0},{x:0,y:0});
  assert.equal(sources.at(-1).when,undefined,"cue without delay starts now");
  sources.at(-1).onended();
  await zombie("idle");
  const first = sources.at(-1).buffer;
  await zombie("idle");
  assert.notEqual(sources.at(-1).buffer,first);
  const beforeRange = sources.length;
  await zombie("attack",{x:21});
  assert.equal(sources.length,beforeRange);
  for (let index = 0; index < 10; index++) await zombie("idle");
  assert.equal(sources.length,beforeRange+5);
  for (let index = 0; index < 5; index++) await zombie("attack");
  assert.equal(sources.length,beforeRange+8);
  audio.stop(ctx);
  const pending = zombie("hit");
  audio.stop(ctx);
  await pending;
  assert.equal(sources.length,beforeRange+8);
  console.log("Recorded cues, offline decoding, codec fallback, event mapping, distance mix, generated effects, voice limits and mute OK");
}

run().catch(error => { console.error(error); process.exitCode = 1; });
