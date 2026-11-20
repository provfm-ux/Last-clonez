"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

async function run() {
  const sources = [], fetched = [], decoded = [];
  const node = () => ({connect: next => next, frequency:{value:0}, gain:{value:0}, pan:{value:0}});
  const ctx = {
    state:"running", destination:{},
    async decodeAudioData(bytes) { decoded.push(bytes.byteLength); return {recorded:bytes.byteLength}; },
    createBuffer(channel,length) { return {getChannelData:() => new Float32Array(length)}; },
    createBufferSource() {
      const source = {...node(),start() { sources.push(this); },stop() { this.stopped = true; }};
      return source;
    },
    createGain:node,createBiquadFilter:node,createStereoPanner:node
  };
  const sandbox = vm.createContext({
    Recordings:{near:"audio/near.wav",tin:"audio/missing.wav",glass:"data:audio/wav;base64,AQID"},
    Level:{seeded:() => () => .5}, atob,
    async fetch(url) {
      fetched.push(url);
      return {ok:!url.endsWith("missing.wav"),async arrayBuffer() { return new ArrayBuffer(4); }};
    }
  });
  const script = fs.readFileSync(path.join(__dirname,"../game/soundscape.js"),"utf8");
  const audio = vm.runInContext(script+"\nSoundscape",sandbox);
  await Promise.all([audio.preload(ctx),audio.preload(ctx)]);
  assert.deepEqual(fetched,["audio/near.wav","audio/missing.wav"]);
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
  console.log("Recorded cues, offline decoding, fallback and mute OK");
}

run().catch(error => { console.error(error); process.exitCode = 1; });
