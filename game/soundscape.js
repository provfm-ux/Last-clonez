"use strict";

const Soundscape = (() => {
  const buffers = new WeakMap(), playing = new WeakMap(), sampleRate = 16000, tau = 2 * Math.PI;
  const recordings = new WeakMap(), zombieBanks = new WeakMap();
  const maxVoices = 10;
  const zombieGains = {idle:.19,notice:.29,chase:.22,attack:.37,hit:.33,death:.40};
  const configs = {
    distant:{seconds:2.4,gain:.27,cut:560}, near:{seconds:1.28,gain:.34,cut:1800},
    horde:{seconds:3.2,gain:.43,cut:990}, twig:{seconds:.57,gain:.37,cut:2500},
    tin:{seconds:1.34,gain:.31,cut:2250}, fungus:{seconds:1.38,gain:.36,cut:1300},
    crib:{seconds:1.45,gain:.24,cut:1700}, alarm:{seconds:1.9,gain:.32,cut:2200},
    wings:{seconds:.65,gain:.3,cut:2600}, heartbeat:{seconds:.8,gain:.36,cut:340},
    footsteps:{seconds:.85,gain:.29,cut:1250}, glass:{seconds:.65,gain:.24,cut:3000},
    stone:{seconds:1.65,gain:.25,cut:1400}
  };

  const tone = (hz,t) => Math.sin(tau*hz*t);
  const tap = (t,at,decay) => t < at ? 0 : Math.exp(-(t-at)*decay);
  const breath = (t,length,rate) => Math.sin(Math.PI*Math.min(1,t/length)) ** 1.5 * (.69+.31*Math.sin(rate*t)**2);

  function makeBuffer(ctx, kind) {
    const config = configs[kind], buffer = ctx.createBuffer(1,Math.ceil(config.seconds*sampleRate),sampleRate);
    const output = buffer.getChannelData(0);
    const rng = Level.seeded(kind.length * 137 + config.cut);
    let grain = 0;
    for (let i = 0; i < output.length; i++) {
      const t = i/sampleRate, fuzz = 2*rng()-1;
      grain += (fuzz-grain)*.18;
      const voice = .55*tone(63+9*Math.sin(t*4),t) + .16*tone(130+11*Math.cos(t*4),t) + .13*tone(197,t);
      let sample = 0;
      switch (kind) {
        case "distant":
        case "near":
          sample = (voice*.5+grain*.7) * breath(t,config.seconds,9); break;
        case "horde": {
          const foot = Math.exp(-28*((t+.035)% .43)) + .54*Math.exp(-23*((t+.19)% .57));
          sample = ((grain*.72+.21*tone(77,t))*foot + .30*voice*breath(t,config.seconds,7)) * Math.min(1,t*5); break;
        }
        case "twig":
          sample = (.75*fuzz+.29*grain)*(.66*tap(t,.018,52)+.38*tap(t,.143,36)+.22*tap(t,.222,44)); break;
        case "tin": {
          const hit = tap(t,.01,13) + .47*tap(t,.21,14)+.37*tap(t,.40,15)+.23*tap(t,.57,18)+.16*tap(t,.72,20)+.10*tap(t,.85,22);
          sample = (.28*tone(666,t)+.18*tone(927,t)+.13*tone(1463,t)+.22*fuzz)*hit; break;
        }
        case "wings":
          sample = fuzz*.45*(tap(t,.04,16)+.7*tap(t,.25,16)+.5*tap(t,.43,18)); break;
        case "heartbeat":
          sample = tone(58,t)*(.8*tap(t,.04,22)+.55*tap(t,.22,25)); break;
        case "footsteps":
          sample = (.55*grain+.2*tone(94,t))*(tap(t,.04,17)+.75*tap(t,.41,19)); break;
        case "glass":
          sample = (.38*tone(1294,t)+.23*tone(2325,t))*(tap(t,.02,15)+.48*tap(t,.17,21)); break;
        case "stone": {
          const impact = tap(t,.03,23)+.55*tap(t,.19,18)+.37*tap(t,.37,16)+.2*tap(t,.63,13)+.12*tap(t,.87,13);
          sample = (.56*grain+.36*tone(224,t)+.14*tone(317,t))*impact; break;
        }
        case "fungus":
          sample = (.5*grain+.35*tone(43,t))*(.55*tap(t,.06,5)+.45*tap(t,.55,7)+.27*tap(t,.87,10)); break;
        case "crib":
          sample = (.4*tone(313+27*Math.sin(5*t),t)+.2*tone(681,t)+.29*grain)*breath(t,config.seconds,11); break;
        case "alarm":
          sample = .5*(tone(910,t)+.4*tone(1710,t))*Number(t% .46 < .17)*Math.min(1,(config.seconds-t)*12); break;
      }
      const fade = Math.max(0,Math.min(1,(config.seconds-t)*24));
      output[i] = sample*fade;
    }
    return buffer;
  }

  async function decodeRecording(ctx, path) {
    if (path.startsWith("data:audio/")) {
      const bytes = Uint8Array.from(atob(path.split(",",2)[1]), c => c.charCodeAt(0));
      return ctx.decodeAudioData(bytes.buffer);
    }
    const response = await fetch(path);
    if (!response.ok) throw new Error("Recording unavailable");
    return ctx.decodeAudioData(await response.arrayBuffer());
  }

  async function preload(ctx) {
    if (!ctx) return;
    bankFor(ctx);
    if (!recordings.has(ctx)) {
      const clips = new Map();
      const ready = Promise.all(Object.entries(Recordings).filter(([id]) => Object.hasOwn(configs,id)).map(async ([id,path]) => {
        try { clips.set(id,await decodeRecording(ctx,path)); } catch { /* Keep the current synth for this cue. */ }
      }));
      recordings.set(ctx,{clips,ready});
    }
    await recordings.get(ctx).ready;
  }

  function bankFor(ctx) {
    if (!zombieBanks.has(ctx)) {
      const embedded = typeof ZombieEventFiles === "undefined" ? null : ZombieEventFiles;
      const events = embedded ? Promise.resolve(embedded) : Promise.resolve().then(async () => {
        const response = await fetch("catalogo/eventos.json");
        if (!response.ok) return {};
        return (await response.json()).events ?? {};
      }).catch(() => ({}));
      zombieBanks.set(ctx,{events,clips:new Map(),picks:new Map(),pending:0,generation:0});
    }
    return zombieBanks.get(ctx);
  }

  function zombieClip(ctx,bank,paths) {
    const key = paths[0];
    if (!bank.clips.has(key)) bank.clips.set(key,(async () => {
      for (const path of paths) {
        try { return await decodeRecording(ctx,path); } catch { /* Try the next codec. */ }
      }
      return null;
    })());
    return bank.clips.get(key);
  }

  async function playZombie(ctx,cue,listener,role) {
    const range = Math.hypot(cue.x-listener.x,cue.y-listener.y);
    const limit = role === "idle" || role === "chase" ? maxVoices-3 : maxVoices;
    if (range > 20 || (playing.get(ctx)?.size ?? 0) >= limit) return;
    const bank = bankFor(ctx), generation = bank.generation;
    if (bank.pending >= (limit === maxVoices ? 3 : 2)) return;
    bank.pending++;
    const started = performance.now();
    try {
      const entry = (await bank.events)[cue.kind];
      if (!entry?.files_ogg?.length || generation !== bank.generation) return;
      const previous = bank.picks.get(cue.entity);
      const candidates = entry.files_ogg.map((path,index) => ({path,index})).filter(option => option.path !== previous);
      const pool = candidates.length ? candidates : [{path:entry.files_ogg[0],index:0}];
      const {path,index} = pool[Math.floor(Math.random()*pool.length)];
      bank.picks.delete(cue.entity);
      if (bank.picks.size >= 256) bank.picks.delete(bank.picks.keys().next().value);
      bank.picks.set(cue.entity,path);
      const sample = await zombieClip(ctx,bank,[path,entry.files_mp3?.[index]].filter(Boolean));
      if (sample && generation === bank.generation && performance.now()-started < 900 &&
          ctx.state === "running" && (playing.get(ctx)?.size ?? 0) < limit) {
        output(ctx,cue,listener,sample,{cut:6800,gain:zombieGains[role]},.96+Math.random()*.08,true);
      }
    } catch { /* Audio is optional. */ }
    finally { bank.pending--; }
  }

  function play(ctx, cue, listener) {
    if (!ctx || ctx.state !== "running") return;
    if (cue.kind.startsWith("zombie.common.")) {
      const role = cue.kind.slice(14);
      if (Object.hasOwn(zombieGains,role)) return playZombie(ctx,cue,listener,role);
      return;
    }
    const config = Object.hasOwn(configs,cue.kind) ? configs[cue.kind] : null;
    if (!config || (playing.get(ctx)?.size ?? 0) >= maxVoices) return;
    try {
      let library = buffers.get(ctx);
      if (!library) { library = new Map(); buffers.set(ctx,library); }
      const recording = recordings.get(ctx)?.clips.get(cue.kind);
      if (!recording && !library.has(cue.kind)) library.set(cue.kind,makeBuffer(ctx,cue.kind));
      output(ctx,cue,listener,recording ?? library.get(cue.kind),config);
    } catch { /* The on-screen cue remains available without audio. */ }
  }

  function output(ctx,cue,listener,buffer,config,pitch = 1,zombie = false) {
    const source = ctx.createBufferSource(), volume = ctx.createGain(), filter = ctx.createBiquadFilter();
    const dx = cue.x-listener.x, dy = cue.y-listener.y, distance = Math.hypot(dx,dy);
    source.buffer = buffer;
    if (source.playbackRate) source.playbackRate.value = pitch;
    filter.type = "lowpass";
    filter.frequency.value = cue.muffled ? zombie ? 850 : config.cut*.52 : config.cut;
    const attenuation = cue.kind === "horde" ? .8 : 1 / (1 + distance*(zombie ? .20 : .06));
    volume.gain.value = config.gain * attenuation;
    source.connect(filter).connect(volume);
    if (ctx.createStereoPanner) {
      const pan = ctx.createStereoPanner();
      pan.pan.value = Math.min(.88,Math.max(-.88,(dx-dy)/Math.max(5,distance*1.3)));
      volume.connect(pan).connect(ctx.destination);
    } else volume.connect(ctx.destination);
    let sources = playing.get(ctx);
    if (!sources) { sources = new Set(); playing.set(ctx,sources); }
    sources.add(source);
    source.onended = () => sources.delete(source);
    source.start();
  }

  function stop(ctx) {
    const bank = zombieBanks.get(ctx);
    if (bank) bank.generation++;
    const sources = playing.get(ctx);
    if (!sources) return;
    for (const source of sources) {
      try { source.stop(); } catch { /* A cue may already have finished. */ }
    }
    sources.clear();
  }

  return {preload,play,stop};
})();
