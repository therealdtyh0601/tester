/* Lumi Toolbox · Free · Yang House Gua Generator
 * No tracking, no storage.
 */
const STATE = {
  lang: 'zh',
  occupant: null,
  bedroom: null,
  intake: null,
  data: null
};

const DIRECTIONS = [
  // 3x3 grid order: NW, N, NE, W, Center, E, SW, S, SE (but we omit center)
  { id:'NW', cn:'西北', en:'NW', trigram:'Qian' },
  { id:'N',  cn:'正北', en:'N',  trigram:'Kan'  },
  { id:'NE', cn:'东北', en:'NE', trigram:'Gen'  },
  { id:'W',  cn:'正西', en:'W',  trigram:'Dui'  },
  { id:'C',  cn:'中宫', en:'Center', trigram:null },
  { id:'E',  cn:'正东', en:'E',  trigram:'Zhen' },
  { id:'SW', cn:'西南', en:'SW', trigram:'Kun'  },
  { id:'S',  cn:'正南', en:'S',  trigram:'Li'   },
  { id:'SE', cn:'东南', en:'SE', trigram:'Xun'  },
];

const OCCUPANTS = [
  { id:'boss', cn:'父 / 老板', en:'Father / Boss', hint_cn:'对应乾位（西北）倾向', hint_en:'Often resonates with Qian (NW)' },
  { id:'mom', cn:'母 / 女主人', en:'Mother / Lady of house', hint_cn:'对应坤位（西南）倾向', hint_en:'Often resonates with Kun (SW)' },
  { id:'son', cn:'长子', en:'Eldest son', hint_cn:'对应震位（正东）倾向', hint_en:'Often resonates with Zhen (E)' },
  { id:'daughter', cn:'长女', en:'Eldest daughter', hint_cn:'对应巽位（东南）倾向', hint_en:'Often resonates with Xun (SE)' },
  { id:'self', cn:'自己（单身/租客）', en:'Me (single/tenant)', hint_cn:'以个人体验为主', hint_en:'Focus on lived experience' },
];

function $(id){ return document.getElementById(id); }

function setYear(){
  $('year').textContent = new Date().getFullYear();
}

async function loadData(){
  const res = await fetch('assets/data/gua64.json', { cache: 'no-store' });
  STATE.data = await res.json();
}

function renderOccupants(){
  const box = $('occupantOpts');
  box.innerHTML = '';
  OCCUPANTS.forEach(o=>{
    const el = document.createElement('div');
    el.className = 'opt';
    el.dataset.id = o.id;
    el.innerHTML = `
      <div>
        <div class="k">${STATE.lang==='zh' ? o.cn : o.en}</div>
        <div class="e">${STATE.lang==='zh' ? o.hint_cn : o.hint_en}</div>
      </div>
      <div class="e">✓</div>
    `;
    el.addEventListener('click', ()=>{
      STATE.occupant = o.id;
      [...box.querySelectorAll('.opt')].forEach(x=>x.classList.remove('active'));
      el.classList.add('active');
      refreshMetaPreview();
    });
    box.appendChild(el);
  });
}

function renderDirs(containerId, onPick){
  const box = $(containerId);
  box.innerHTML = '';
  DIRECTIONS.forEach(d=>{
    const el = document.createElement('div');
    el.className = 'dir' + (d.id==='C' ? ' disabled':'');
    el.dataset.id = d.id;
    el.innerHTML = `
      <div class="sym">${d.trigram ? STATE.data.trigrams[d.trigram].el : '•'}</div>
      <div class="lab">${STATE.lang==='zh' ? d.cn : d.en}</div>
      <div class="sub">${d.trigram ? (STATE.lang==='zh' ? (STATE.data.trigrams[d.trigram].cn+' · '+STATE.data.trigrams[d.trigram].elem_cn) : (STATE.data.trigrams[d.trigram].en+' · '+STATE.data.trigrams[d.trigram].elem_en)) : (STATE.lang==='zh' ? '不可选' : 'N/A')}</div>
    `;
    if(d.id==='C'){
      el.style.opacity = .45;
      el.style.cursor = 'not-allowed';
    }else{
      el.addEventListener('click', ()=>{
        onPick(d.id);
        [...box.querySelectorAll('.dir')].forEach(x=>x.classList.remove('active'));
        el.classList.add('active');
        refreshMetaPreview();
      });
    }
    box.appendChild(el);
  });
}

function getDirById(id){ return DIRECTIONS.find(d=>d.id===id); }
function getOccById(id){ return OCCUPANTS.find(o=>o.id===id); }

function buildHexagram(){
  if(!STATE.bedroom || !STATE.intake) return null;
  const inner = getDirById(STATE.bedroom).trigram;
  const outer = getDirById(STATE.intake).trigram;
  const key = `${outer}-${inner}`; // outer on top, inner at bottom
  return { key, inner, outer, item: STATE.data.hexagrams[key] || null };
}

// I Ching unicode symbols ䷀ (U+4DC0) ... ䷿ (U+4DFF)
function hexSymbolFromNumber(num){
  const base = 0x4DC0;
  // King Wen numbering 1..64 is not the same as unicode ordering (binary order).
  // So we don't attempt perfect mapping; show a stable fallback based on number hash.
  // For UI: we still show a valid hexagram glyph.
  const idx = (num*7 + 13) % 64;
  return String.fromCharCode(base + idx);
}

function refreshMetaPreview(){
  // do nothing for now; could show subtle hint
}

function renderResult(){
  const built = buildHexagram();
  if(!built || !built.item){
    alert(STATE.lang==='zh' ? '请先选：居住者 + 卧室方位 + 纳气口方位' : 'Pick: occupant + bedroom direction + intake direction');
    return;
  }
  const h = built.item;
  $('emptyState').style.display='none';
  $('resultCard').classList.remove('hidden');

  $('guaName').textContent = STATE.lang==='zh' ? h.name_cn : h.name_en;
  $('guaSub').textContent  = `#${h.number} · ${h.name_en}`;
  $('guaSymbol').textContent = hexSymbolFromNumber(h.number);

  $('tagline').textContent = STATE.lang==='zh' ? h.tag_cn : h.tag_en;

  const occ = getOccById(STATE.occupant) || {cn:'—',en:'—'};
  const inner = STATE.data.trigrams[built.inner];
  const outer = STATE.data.trigrams[built.outer];

  $('metaOcc').textContent = STATE.lang==='zh' ? occ.cn : occ.en;
  $('metaInner').textContent = `${inner.el} ${STATE.lang==='zh'?inner.cn:inner.en} · ${STATE.lang==='zh'?inner.elem_cn:inner.elem_en}`;
  $('metaOuter').textContent = `${outer.el} ${STATE.lang==='zh'?outer.cn:outer.en} · ${STATE.lang==='zh'?outer.elem_cn:outer.elem_en}`;

  $('readTitle').textContent = STATE.lang==='zh' ? '怎么读这个结果' : 'How to read this result';

  const list = $('bulletList');
  list.innerHTML = '';
  const bullets = STATE.lang==='zh' ? h.bullets_cn : h.bullets_en;
  bullets.forEach(b=>{
    const li = document.createElement('li');
    li.textContent = b;
    list.appendChild(li);
  });

  $('disclaimer').textContent = STATE.lang==='zh'
    ? '本工具只提供空间趋势提示，不构成任何医学/法律/投资/命运判断。'
    : 'This tool offers spatial tendency hints only. It is not medical/legal/financial/destiny advice.';

  const copyText = buildCopyText(built, h, occ, inner, outer);
  $('copyBtn').onclick = async ()=>{
    try{
      await navigator.clipboard.writeText(copyText);
      $('copyBtn').textContent = STATE.lang==='zh' ? '已复制 ✅' : 'Copied ✅';
      setTimeout(()=> $('copyBtn').textContent = STATE.lang==='zh' ? '复制结果文案' : 'Copy text', 1200);
    }catch(e){
      alert(STATE.lang==='zh' ? '复制失败：请手动复制' : 'Copy failed. Please copy manually.');
    }
  };

  const wa = `https://wa.me/?text=${encodeURIComponent(copyText)}`;
  $('shareBtn').href = wa;
}

function buildCopyText(built, h, occ, inner, outer){
  if(STATE.lang==='zh'){
    return `🧭 Lumi Toolbox · 阳宅卦生成器\n` +
      `卦象：${h.name_cn} (#${h.number})\n` +
      `一句话：${h.tag_cn}\n` +
      `居住者：${occ.cn}\n` +
      `内卦（卧室）：${inner.el}${inner.cn}｜${inner.elem_cn}\n` +
      `外卦（纳气口）：${outer.el}${outer.cn}｜${outer.elem_cn}\n\n` +
      `提示：这是空间趋势，不是吉凶断语。\n` +
      `IG: @lumistudio2025`;
  }
  return `🧭 Lumi Toolbox · Yang-House Gua Generator\n` +
    `Hexagram: ${h.name_en} (#${h.number})\n` +
    `One-liner: ${h.tag_en}\n` +
    `Occupant: ${occ.en}\n` +
    `Inner (bedroom): ${inner.el} ${inner.en} · ${inner.elem_en}\n` +
    `Outer (intake): ${outer.el} ${outer.en} · ${outer.elem_en}\n\n` +
    `Note: spatial tendency, not a fate verdict.\n` +
    `IG: @lumistudio2025`;
}

function resetAll(){
  STATE.occupant = null;
  STATE.bedroom = null;
  STATE.intake = null;
  $('emptyState').style.display='grid';
  $('resultCard').classList.add('hidden');

  // clear actives
  document.querySelectorAll('.opt,.dir').forEach(x=>x.classList.remove('active'));
}

function toggleLang(){
  STATE.lang = (STATE.lang==='zh') ? 'en' : 'zh';
  $('langBtn').textContent = STATE.lang==='zh' ? '中 / EN' : 'EN / 中';
  renderOccupants();
  renderDirs('bedroomDir', (id)=>STATE.bedroom=id);
  renderDirs('intakeDir',  (id)=>STATE.intake=id);

  // Re-apply active highlights if any
  if(STATE.occupant){
    document.querySelectorAll('#occupantOpts .opt').forEach(el=>{
      if(el.dataset.id===STATE.occupant) el.classList.add('active');
    });
  }
  if(STATE.bedroom){
    document.querySelectorAll('#bedroomDir .dir').forEach(el=>{
      if(el.dataset.id===STATE.bedroom) el.classList.add('active');
    });
  }
  if(STATE.intake){
    document.querySelectorAll('#intakeDir .dir').forEach(el=>{
      if(el.dataset.id===STATE.intake) el.classList.add('active');
    });
  }

  // Update explanation text lightly
  const howto = $('howto');
  if(STATE.lang==='en'){
    howto.innerHTML = `
      <ol>
        <li><strong>Who sleeps where first</strong>: bedroom direction = the occupant's “home field”.</li>
        <li><strong>Where qi/people enter next</strong>: door/balcony/window = external triggers.</li>
        <li><strong>Combine</strong>: outer on top + inner at bottom → 64 hexagrams (trend only).</li>
        <li><strong>Make it practical</strong>: start with low-cost tweaks (flow, light, storage, wet/dry), observe 7–21 days, then decide bigger changes.</li>
      </ol>
      <div class="note"><strong>One-line script:</strong> “I’m reading spatial structure: where you sleep + where the home breathes. Trend, not fortune-telling.”</div>
    `;
  }else{
    howto.innerHTML = `
      <ol>
        <li><strong>先看“谁住哪”</strong>：居住者的卧室方位 = 他的“主场气质”。</li>
        <li><strong>再看“气从哪来”</strong>：门/阳台/窗 = 人流与空气入口，代表外部触发。</li>
        <li><strong>上下合卦</strong>：外卦在上、内卦在下，合成 64 卦（只讲趋势）。</li>
        <li><strong>落地建议</strong>：先做低成本微调（动线、照明、收纳、干湿区），观察 7–21 天再决定大改。</li>
      </ol>
      <div class="note"><strong>一句话话术：</strong>“我用的是空间结构语言：你住的方位 + 门/阳台的纳气，合成一个趋势，不是算命。”</div>
    `;
  }

  // Re-render result if already generated
  if(!$('resultCard').classList.contains('hidden')){
    renderResult();
  }
}

function openData(){
  const built = buildHexagram();
  const key = built?.key || '(none)';
  const url = 'assets/data/gua64.json';
  alert((STATE.lang==='zh'
    ? `数据文件：${url}\n当前key：${key}\n\nFree版仅做趋势提示。`
    : `Data file: ${url}\nCurrent key: ${key}\n\nFree version provides trend hints only.`));
}

async function init(){
  setYear();
  await loadData();
  renderOccupants();
  renderDirs('bedroomDir', (id)=>STATE.bedroom=id);
  renderDirs('intakeDir',  (id)=>STATE.intake=id);

  $('genBtn').addEventListener('click', renderResult);
  $('resetBtn').addEventListener('click', resetAll);
  $('langBtn').addEventListener('click', toggleLang);
  $('openData').addEventListener('click', (e)=>{ e.preventDefault(); openData(); });
}

init();


document.addEventListener("DOMContentLoaded", function () {
  fetch("assets/data/gua64.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("all-gua");
      if (!container) return;
      data.forEach(gua => {
        const card = document.createElement("div");
        card.className = "gua-card";
        card.innerHTML = `
          <div class="gua-symbol">${gua.symbol || ""}</div>
          <div class="gua-name">${gua.name || ""}</div>
          <div class="gua-key">${gua.keyline || ""}</div>
          <div class="gua-desc">${gua.description || ""}</div>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => console.error(err));
});
