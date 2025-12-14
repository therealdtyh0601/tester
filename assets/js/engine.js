
const STATE={occupant:null,bedroom:null,data:null};
const PERSON={boss:'Qian',mom:'Kun',son:'Zhen',daughter:'Xun',self:null};
const DIR={NW:'Qian',N:'Kan',NE:'Gen',W:'Dui',E:'Zhen',SW:'Kun',S:'Li',SE:'Xun'};

async function init(){
  const r=await fetch('assets/data/gua64.json',{cache:'no-store'});
  STATE.data=await r.json();
  document.querySelectorAll('.opt').forEach(o=>o.onclick=()=>STATE.occupant=o.dataset.id);
  document.querySelectorAll('.dir').forEach(d=>d.onclick=()=>STATE.bedroom=d.dataset.id);
  document.getElementById('genBtn').onclick=render;
}

function render(){
  if(!STATE.occupant||!STATE.bedroom){alert('请选择人物与卧房');return;}
  const up=PERSON[STATE.occupant]; if(!up){alert('请选择人物');return;}
  const low=DIR[STATE.bedroom];
  const key=up+'-'+low;
  const h=STATE.data.hexagrams[key];
  document.getElementById('guaName').textContent=h.name_cn;
  document.getElementById('para1').textContent=h.para1||h.tag_cn||'';
  document.getElementById('para2').textContent=h.para2||'';
}
init();
