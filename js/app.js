/* Overview dashboard, experiment pages and router. */
const main=$('#main');let cat='All';

function ringSvg(done,total){const r=24,c=2*Math.PI*r;
  return`<svg width="62" height="62" viewBox="0 0 62 62" role="img" aria-label="${done} of ${total} experiments completed"><circle cx="31" cy="31" r="${r}" fill="none" stroke="var(--line)" stroke-width="6"/><circle cx="31" cy="31" r="${r}" fill="none" stroke="var(--accent)" stroke-width="6" stroke-linecap="round" stroke-dasharray="${c*done/total} ${c}" transform="rotate(-90 31 31)"/></svg>`}

function overview(){
  const done=Store.get();
  const cards=EXPS.filter(e=>cat==='All'||e.cat===cat).map(e=>`<button class="xcard" type="button" data-go="${e.id}">
    <div class="top"><span class="no">EXP ${String(e.no).padStart(2,'0')}</span>${done.includes(e.id)?'<span class="chip done">Done</span>':`<span class="chip">${e.cat}</span>`}</div>
    <div class="glyph">${glyph(e.id)}</div><h3>${e.short}</h3><p>${e.aim.split('.')[0]}.</p><span class="cx">${e.cx}</span></button>`).join('');
  return`<div class="ovhead"><div><span class="eyebrow">Data structures and algorithms</span><h1 style="margin-top:12px">Eight experiments, one dashboard</h1>
   <p>Each experiment has the concept, a live visualizer you can operate, the algorithm steps, and a complete C program.</p></div>
   <div class="ring">${ringSvg(done.length,EXPS.length)}<div><b>${done.length} / ${EXPS.length}</b><small>experiments completed</small></div></div></div>
  <div class="filters"><span class="eyebrow" style="margin-right:6px">Filter</span>${['All','Linear','Non-linear','Algorithms','Hashing'].map(c=>`<button class="btn sm" type="button" data-cat="${c}" aria-pressed="${c===cat}">${c}</button>`).join('')}</div>
  <div class="cards">${cards}</div>
  <div class="panel"><h2>Cost comparison</h2><p class="sub">How the structures from the eight experiments compare.</p><div class="scroll"><table class="tb"><thead><tr><th>Structure</th><th>Access</th><th>Search</th><th>Insert / Delete</th><th>Note</th></tr></thead><tbody>${COMPARE.map(r=>`<tr><td><b>${r[0]}</b></td><td class="m">${r[1]}</td><td class="m">${r[2]}</td><td class="m">${r[3]}</td><td>${r[4]}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="two"><div class="panel"><h2>Compile and run</h2><p class="sub">Every program is a complete menu-driven C file.</p><pre class="pcode" style="margin:0">gcc exp1.c -o exp1 -Wall
./exp1            # Linux / macOS
exp1.exe          # Windows (MinGW)</pre></div>
   <div class="panel"><h2>Before you submit</h2><p class="sub">A short checklist for every experiment.</p><ol class="steps"><li><span>Explain the structure and draw it.</span></li><li><span>State each operation with its time complexity.</span></li><li><span>Handle overflow, underflow and NULL cases.</span></li><li><span>Free any memory you allocate.</span></li></ol></div></div>`}

function expPage(e){
  const done=Store.get().includes(e.id),i=EXPS.indexOf(e);
  return`<div class="xhead"><span class="eyebrow">Experiment ${e.no} of 8 · ${e.cat}</span><h1>${e.title}</h1><p class="aim">${e.aim}</p>
   <div><button class="btn ${done?'acc':''}" type="button" id="markdone">${done?'✓ Marked complete':'Mark as complete'}</button></div></div>
  <nav class="jump" aria-label="Sections"><a href="#" data-sec="concept">Concept</a><a href="#" data-sec="lab">Visualizer</a><a href="#" data-sec="algo">Algorithm</a><a href="#" data-sec="prog">C program</a></nav>
  <section class="sec" id="${e.id}-concept"><h2>Concept <small>what to know</small></h2><div class="cgrid">${e.concepts.map(c=>`<div class="concept"><h3>${c.h}</h3><p>${c.p}</p></div>`).join('')}</div></section>
  <section class="sec" id="${e.id}-lab"><h2>${e.lab} <small>try it</small></h2><div class="lab" id="${e.id}-labroot"></div></section>
  <section class="sec" id="${e.id}-algo"><h2>Algorithm <small>step by step</small></h2><div class="two"><div class="panel"><ol class="steps">${e.steps.map(s=>`<li><span>${s}</span></li>`).join('')}</ol></div>
   <div class="panel scroll"><table class="tb"><thead><tr><th>Operation</th><th>Cost</th><th>Why</th></tr></thead><tbody>${e.cplx.map(r=>`<tr><td>${r[0]}</td><td class="m">${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table></div></div></section>
  <section class="sec" id="${e.id}-prog"><h2>C program <small>complete, menu driven</small></h2>
   <div class="codebox"><div class="codebar"><div class="codetabs" id="${e.id}-tabs">${e.code.map((c,k)=>`<button type="button" data-k="${k}" aria-selected="${k==0}">${c.label}</button>`).join('')}</div><div class="codeact"><button class="btn sm" type="button" id="${e.id}-copy">Copy</button><button class="btn sm" type="button" id="${e.id}-dl">Download .c</button></div></div><pre class="code" id="${e.id}-code" tabindex="0"></pre></div></section>
  <div class="pn">${i>0?`<button class="btn" type="button" data-go="${EXPS[i-1].id}">← Exp ${EXPS[i-1].no}: ${EXPS[i-1].short}</button>`:`<button class="btn" type="button" data-go="overview">← Overview</button>`}${i<EXPS.length-1?`<button class="btn pri" type="button" data-go="${EXPS[i+1].id}">Exp ${EXPS[i+1].no}: ${EXPS[i+1].short} →</button>`:`<button class="btn pri" type="button" data-go="overview">Back to overview</button>`}</div>`}

function wireExp(e){
  const code=$('#'+e.id+'-code');let k=0;
  const show=()=>{code.innerHTML=highlight(e.code[k].src)};show();
  $('#'+e.id+'-tabs').onclick=ev=>{const b=ev.target.closest('button');if(!b)return;k=+b.dataset.k;$$('#'+e.id+'-tabs button').forEach(x=>x.setAttribute('aria-selected',x===b));show()};
  $('#'+e.id+'-copy').onclick=async ev=>{const b=ev.currentTarget;
    try{await navigator.clipboard.writeText(e.code[k].src);b.textContent='Copied'}
    catch(err){const r=document.createRange();r.selectNodeContents(code);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected, press Ctrl+C'}
    setTimeout(()=>b.textContent='Copy',1800)};
  $('#'+e.id+'-dl').onclick=()=>{const a=document.createElement('a'),u=URL.createObjectURL(new Blob([e.code[k].src],{type:'text/plain'}));
    a.href=u;a.download='exp'+e.no+(e.code.length>1?'_'+e.code[k].label.replace(/\s+/g,'_'):'')+'.c';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),500)};
  $('#markdone').onclick=()=>{const d=Store.toggle(e.id).includes(e.id),b=$('#markdone');b.textContent=d?'✓ Marked complete':'Mark as complete';b.classList.toggle('acc',d);navPaint()};
  LABS[e.id]($('#'+e.id+'-labroot'));
}

/* ---------- navigation ---------- */
function navPaint(){
  const done=Store.get(),cur=location.hash.slice(1)||'overview';
  $('#nav').innerHTML=`<li><button class="navi" type="button" data-go="overview" aria-current="${cur=='overview'}"><span class="n">◎</span><span class="t" data-n="◎">Overview<small>All 8 experiments</small></span><span></span></button></li>`+
   EXPS.map(e=>`<li><button class="navi" type="button" data-go="${e.id}" data-done="${done.includes(e.id)}" aria-current="${cur==e.id}"><span class="n">${String(e.no).padStart(2,'0')}</span><span class="t" data-n="${e.no}">${e.short}<small>${e.cat}</small></span><span class="ck"></span></button></li>`).join('')}
function route(){
  const id=location.hash.slice(1)||'overview',e=EXPS.find(x=>x.id===id);
  if(e){main.innerHTML=`<div class="page">${expPage(e)}</div>`;wireExp(e)}
  else{main.innerHTML=`<div class="page">${overview()}</div>`}
  navPaint();window.scrollTo({top:0});document.title=e?`Exp ${e.no} · DSA Lab in C`:'DSA Lab in C';
}
document.addEventListener('click',ev=>{
  const g=ev.target.closest('[data-go]');
  if(g){ev.preventDefault();const id=g.dataset.go;if(location.hash.slice(1)===id||(!location.hash&&id==='overview'))route();else location.hash=id;return}
  const c=ev.target.closest('[data-cat]');
  if(c){cat=c.dataset.cat;main.innerHTML=`<div class="page">${overview()}</div>`;return}
  const s=ev.target.closest('[data-sec]');
  if(s){ev.preventDefault();const id=location.hash.slice(1),t=document.getElementById(id+'-'+s.dataset.sec);if(t)t.scrollIntoView({behavior:'smooth',block:'start'})}
});
window.addEventListener('hashchange',route);
$('#theme').onclick=()=>{const d=document.documentElement,dark=d.dataset.theme?d.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;d.dataset.theme=dark?'light':'dark'};
route();
