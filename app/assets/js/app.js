/* Lumi Tianji Toolbox - Free Tier
   Plain-language results only.
   No lineage/method disclosure.
*/

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- Tabs ----------
  const tabs = $$('.tab');
  const panels = $$('.panel');

  function activateTab(key) {
    tabs.forEach((t) => {
      const on = t.dataset.tab === key;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach((p) => p.classList.toggle('is-active', p.id === `panel-${key}`));
  }

  tabs.forEach((t) => t.addEventListener('click', () => activateTab(t.dataset.tab)));

  // ---------- Engine (Free: plain language) ----------
  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function makeList(items) {
    return `<ul>${items.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  }

  function renderResult(containerId, titleTag, headline, bullets, note) {
    const el = document.getElementById(containerId);
    const tags = titleTag.map((t) => `<span class="k">${t}</span>`).join('');
    el.classList.remove('empty');
    el.innerHTML = `
      <div>${tags}</div>
      <p><strong>${headline}</strong></p>
      ${makeList(bullets)}
      <p class="hint" style="margin-top:10px">${note}</p>
    `;
  }

  // Celestial: rhythm + friction (no jargon)
  function engineCelestial({ vibe, energy, focus }) {
    const base = {
      flow: {
        tag: ['Celestial', 'Rhythm'],
        headline: 'You do best when you keep a steady pace — and protect your focus.',
        bullets: [
          'Say “no” early: your energy is precious, don’t spend it on random urgencies.',
          'Work in blocks: one clear target at a time beats multitasking.',
          'When stuck, change the environment first (light, seat, sound) before forcing effort.'
        ]
      },
      push: {
        tag: ['Celestial', 'Momentum'],
        headline: 'You move best by starting small — then letting momentum build.',
        bullets: [
          'Start with the smallest action you can finish in 10 minutes.',
          'Avoid long planning when energy is high — do, then adjust.',
          'If impatience rises, switch to “finish mode”: close one loop, then rest.'
        ]
      },
      quiet: {
        tag: ['Celestial', 'Incubation'],
        headline: 'Your clarity arrives after a quiet build-up — don’t rush it.',
        bullets: [
          'Give yourself a buffer: decisions land better after a pause or a walk.',
          'Don’t mistake “not ready yet” for “not capable”.',
          'Write it down: your mind sorts itself when it sees the pieces outside.'
        ]
      }
    };

    const pick = vibe || 'flow';
    let energyTip = '';
    if (energy === 'low') energyTip = 'Today is a “reduce load” day: fewer tasks, clearer boundaries.';
    if (energy === 'mid') energyTip = 'You have enough fuel: focus on one meaningful thing, not five small ones.';
    if (energy === 'high') energyTip = 'High fuel day: do the hardest thing first, then simplify everything else.';

    let focusTip = '';
    if (focus === 'scattered') focusTip = 'If your focus is scattered, your next move is to reduce inputs (noise, tabs, chats).';
    if (focus === 'ok') focusTip = 'If focus is okay, keep the pace — small wins compound.';
    if (focus === 'sharp') focusTip = 'Sharp focus: protect it with a single priority window.';

    const pack = base[pick] || base.flow;
    return {
      tag: pack.tag,
      headline: pack.headline,
      bullets: [...pack.bullets, energyTip, focusTip].filter(Boolean),
      note: 'Plain-language reflection. For deeper structure and tools, Pro adds more guidance.'
    };
  }

  // Terra: environment signals (no geomancy terms)
  function engineTerra({ placeType, seatFacing, feel }) {
    const tags = ['Terra', 'Environment'];

    const placeMap = {
      home: 'Home affects recovery. Small changes create big shifts.',
      work: 'Workspaces amplify stress patterns — setup matters more than motivation.',
      cafe: 'Public spaces can boost momentum but drain sensitivity faster.',
      travel: 'On the move: your system needs steadier routines, not more stimulation.'
    };

    const facingMap = {
      north: 'North-facing setups often feel quieter — good for deep focus.',
      east: 'East-facing setups often feel “start-mode” — good for initiating tasks.',
      south: 'South-facing setups can feel intense — great for action, but watch agitation.',
      west: 'West-facing setups can feel reflective — good for review and planning.'
    };

    const feelMap = {
      drained: [
        'Reduce visual clutter around your eyes (desk and wall in front of you).',
        'Put your back against something solid (wall/chair support).',
        'Add one calm cue (soft light / plant / clean surface) and remove one noisy cue.'
      ],
      restless: [
        'Do a 2-minute reset: stand, stretch, breathe slower than usual.',
        'If possible, shift your seat angle slightly — your nervous system notices.',
        'Keep one “anchor object” nearby: water bottle, notebook, or a simple token.'
      ],
      stuck: [
        'Change one physical variable: light, sound, or seating position.',
        'Open a “clear path” in front of you (desk surface, floor line of sight).',
        'Switch task style: from heavy thinking → simple execution (or vice versa).' 
      ],
      supported: [
        'Keep this setup consistent for a week — stability builds results.',
        'Capture what works: time, light, seat position, and your best output.',
        'Don’t over-optimize: protect the conditions that already support you.'
      ]
    };

    const headline = placeMap[placeType] || 'Your environment is part of the equation.';
    const bullets = [
      facingMap[seatFacing] || 'Your seat direction changes your mental “mode” more than you think.',
      ...(feelMap[feel] || feelMap.stuck)
    ];

    return {
      tag: tags,
      headline,
      bullets,
      note: 'Free tier stays at practical environment adjustments. Pro adds more structured mapping.'
    };
  }

  // Persona: body/emotion signals (no medical claims)
  function enginePersona({ temp, main, mind }) {
    const tags = ['Persona', 'Signals'];

    const tempHeadline = {
      warm: 'You may be running “hot” right now — reduce friction and stimulation.',
      cool: 'You may be running “cool” right now — support warmth and steady movement.',
      mixed: 'Your system looks mixed — aim for balance, not extremes.'
    };

    const mainMap = {
      head: {
        bullets: [
          'Lower sensory load: dim brightness, reduce scrolling, take 3 slow breaths.',
          'Try a short cool-down routine: wash face, sip warm water slowly, pause.',
          'Avoid heavy decisions when pressure is high — write options first.'
        ]
      },
      gut: {
        bullets: [
          'Eat simpler for the next meal: fewer mixes, smaller portion.',
          'After meals: 8–12 minutes of gentle walking helps your system settle.',
          'If you feel sleepy after eating, reduce sugar spikes and rushing.'
        ]
      },
      chest: {
        bullets: [
          'If tight: extend your exhale a bit longer than inhale for 1 minute.',
          'Loosen posture: drop shoulders, soften jaw, unclench hands.',
          'Name the feeling in one sentence — it often reduces pressure.'
        ]
      },
      limbs: {
        bullets: [
          'If cold hands/feet: add gentle warmth and light movement.',
          'Don’t force intense exercise when energy is low — do “small circulation”.',
          'Keep your sleep schedule steady for 3 nights; your body loves consistency.'
        ]
      }
    };

    const mindAdd = {
      clear: 'Mind is relatively clear: lock one priority and finish it calmly.',
      anxious: 'Anxious mind: reduce inputs and shorten your planning horizon (next 2 hours only).',
      irritable: 'Irritable mind: lower intensity. Choose soft tasks, postpone conflict.',
      sleepy: 'Sleepy after meals: lighten food load next time and take a short walk.'
    };

    const headline = tempHeadline[temp] || 'Your body signals are worth listening to.';
    const bullets = [...(mainMap[main]?.bullets || mainMap.head.bullets), mindAdd[mind] || mindAdd.clear];

    return {
      tag: tags,
      headline,
      bullets,
      note: 'This is not medical advice. It’s a reflection prompt to help you notice patterns.'
    };
  }

  // ---------- Wire forms ----------
  function wireForm(formId, outId, engineFn, fields) {
    const form = document.getElementById(formId);
    const out = document.getElementById(outId);

    const resetBtn = $('[data-reset]', form);

    resetBtn?.addEventListener('click', () => {
      form.reset();
      out.classList.add('empty');
      out.textContent = 'Fill the form and hit Generate.';
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const payload = {};
      fields.forEach((name) => (payload[name] = (form.elements[name]?.value || '').trim()));

      // basic guard
      const missing = fields.filter((k) => !payload[k]);
      if (missing.length) {
        out.classList.remove('empty');
        out.innerHTML = `<p><strong>Missing:</strong> ${missing.join(', ')}</p><p class="hint">Pick the closest option — you can always adjust and re-generate.</p>`;
        return;
      }

      const res = engineFn(payload);
      renderResult(outId, res.tag, res.headline, res.bullets, res.note);
    });
  }

  wireForm('form-celestial', 'out-celestial', engineCelestial, ['vibe', 'energy', 'focus']);
  wireForm('form-terra', 'out-terra', engineTerra, ['placeType', 'seatFacing', 'feel']);
  wireForm('form-persona', 'out-persona', enginePersona, ['temp', 'main', 'mind']);

})();
