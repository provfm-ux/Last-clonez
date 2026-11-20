"use strict";

const Soundscape = (() => {
  const buffers = new WeakMap(), playing = new WeakMap(), sampleRate = 16000, tau = 2 * Math.PI;
  const recordings = new WeakMap();
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
    if (!recordings.has(ctx)) {
      const clips = new Map();
      const ready = Promise.all(Object.entries(Recordings).filter(([id]) => Object.hasOwn(configs,id)).map(async ([id,path]) => {
        try { clips.set(id,await decodeRecording(ctx,path)); } catch { /* Keep the current synth for this cue. */ }
      }));
      recordings.set(ctx,{clips,ready});
    }
    await recordings.get(ctx).ready;
  }

  function play(ctx, cue, listener) {
    const config = Object.hasOwn(configs,cue.kind) ? configs[cue.kind] : null;
    if (!config || !ctx || ctx.state !== "running") return;
    try {
      let library = buffers.get(ctx);
      if (!library) { library = new Map(); buffers.set(ctx,library); }
      const recording = recordings.get(ctx)?.clips.get(cue.kind);
      if (!recording && !library.has(cue.kind)) library.set(cue.kind,makeBuffer(ctx,cue.kind));
      const source = ctx.createBufferSource(), volume = ctx.createGain(), filter = ctx.createBiquadFilter();
      const dx = cue.x-listener.x, dy = cue.y-listener.y, distance = Math.hypot(dx,dy);
      source.buffer = recording ?? library.get(cue.kind);
      filter.type = "lowpass";
      filter.frequency.value = config.cut * (cue.muffled ? .52 : 1);
      const attenuation = cue.kind === "horde" ? .8 : 1 / (1 + distance*.06);
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
    } catch { /* The on-screen cue remains available without audio. */ }
  }

  function stop(ctx) {
    const sources = playing.get(ctx);
    if (!sources) return;
    for (const source of sources) {
      try { source.stop(); } catch { /* A cue may already have finished. */ }
    }
    sources.clear();
  }

  return {preload,play,stop};
})();
