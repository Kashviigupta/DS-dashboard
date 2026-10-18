/* Shared helpers used by every lab. */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const hex=n=>'0x'+n.toString(16).toUpperCase().padStart(4,'0');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

/* segmented button group */
function seg(host,opts,cur,cb){host.className='seg';
  host.innerHTML=opts.map(o=>`<button type="button" data-v="${o[0]}" aria-pressed="${o[0]==cur}">${o[1]}</button>`).join('');
  host.onclick=e=>{const b=e.target.closest('button');if(!b)return;$$('button',host).forEach(c=>c.setAttribute('aria-pressed',c===b));cb(b.dataset.v)}}
const fld=(id,label,val,extra='')=>`<label class="fld ${extra}" for="${id}">${label}<input id="${id}" value="${val}" autocomplete="off"></label>`;
const btn=(id,label,cls='')=>`<button type="button" class="btn ${cls}" id="${id}">${label}</button>`;
function say(el,text,kind=''){el.className='msg '+kind;el.textContent=text}
function logTo(el,lines,cur=-1){el.innerHTML=lines.map((l,i)=>`<div class="${i===cur?'cur':''}">${esc(l)}</div>`).join('');el.scrollTop=el.scrollHeight}

/* tiny C syntax highlighter (single pass, no nested replacement) */
const KW='auto break case char const continue default do double else enum extern float for goto if int long register return short signed sizeof static struct switch typedef union unsigned void volatile while';
const RE=new RegExp('(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/.*)|("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])\')|(^[ \\t]*#.*$)|\\b('+KW.split(' ').join('|')+')\\b|\\b(NULL|FILE|size_t|EMPTY|DELETED|MAX|SIZE)\\b|\\b(\\d+(?:\\.\\d+)?)\\b|\\b([A-Za-z_]\\w*)(?=\\()','gm');
function highlight(src){let out='',last=0,m;RE.lastIndex=0;
  while((m=RE.exec(src))){out+=esc(src.slice(last,m.index));
    const cls=m[1]?'c':m[2]?'s':m[3]?'p':m[4]?'k':m[5]?'ty':m[6]?'nu':'f';
    out+=`<span class="${cls}">${esc(m[0])}</span>`;last=m.index+m[0].length}
  return out+esc(src.slice(last))}

/* progress persisted per browser */
const Store={
  get(){try{return JSON.parse(localStorage.getItem('dsa-done')||'[]')}catch(e){return[]}},
  toggle(id){const a=Store.get(),i=a.indexOf(id);if(i<0)a.push(id);else a.splice(i,1);try{localStorage.setItem('dsa-done',JSON.stringify(a))}catch(e){}return a}
};

/* little glyphs for the overview cards */
function glyph(id){
  const c='var(--ink2)',a='var(--accent)',l='var(--link)',h='var(--hi)';
  const g={
   e1:`<svg width="150" height="46" viewBox="0 0 150 46"><g fill="none" stroke="${c}" stroke-width="1.5">${[0,1,2,3,4].map(i=>`<rect x="${4+i*28}" y="8" width="26" height="28" rx="3" ${i==2?`fill="${h}" fill-opacity=".35"`:''}/>`).join('')}</g><path d="M70 44v-6" stroke="${l}" stroke-width="2"/><text x="64" y="46" font-size="9" fill="${l}" font-family="monospace">p</text></svg>`,
   e2:`<svg width="150" height="46" viewBox="0 0 150 46"><g fill="none" stroke="${c}" stroke-width="1.5">${[0,1,2].map(i=>`<rect x="${4+i*48}" y="12" width="34" height="22" rx="3"/><path d="M${4+i*48+22} 12v22"/>`).join('')}</g><g stroke="${l}" stroke-width="1.8" fill="none"><path d="M36 23h16M84 23h16"/></g></svg>`,
   e3:`<svg width="150" height="46" viewBox="0 0 150 46"><g fill="none" stroke="${c}" stroke-width="1.5"><rect x="8" y="30" width="50" height="12" rx="2"/><rect x="8" y="16" width="50" height="12" rx="2"/><rect x="8" y="2" width="50" height="12" rx="2" fill="${a}" fill-opacity=".35"/></g><text x="72" y="30" font-size="15" fill="${c}" font-family="monospace">A+B*C</text></svg>`,
   e4:`<svg width="150" height="46" viewBox="0 0 150 46"><g fill="none" stroke="${c}" stroke-width="1.5">${[0,1,2,3,4].map(i=>`<rect x="${6+i*28}" y="12" width="26" height="22" rx="3" ${i>0&&i<4?`fill="${a}" fill-opacity=".3"`:''}/>`).join('')}</g><path d="M32 42v-5M116 42v-5" stroke="${l}" stroke-width="2"/></svg>`,
   e5:`<svg width="150" height="46" viewBox="0 0 150 46"><g stroke="${c}" stroke-width="1.5" fill="none"><path d="M75 10 40 32M75 10l35 22M40 32 22 44M40 32l16 12"/></g><g fill="var(--surface)" stroke="${a}" stroke-width="2"><circle cx="75" cy="10" r="7"/><circle cx="40" cy="32" r="7"/><circle cx="110" cy="32" r="7"/></g></svg>`,
   e6:`<svg width="150" height="46" viewBox="0 0 150 46"><g stroke="${c}" stroke-width="1.5"><path d="M20 12 60 8M20 12l14 28M60 8l40 18M34 40l66-14M100 26l30-14"/></g><g fill="var(--surface)" stroke="${l}" stroke-width="2">${[[20,12],[60,8],[34,40],[100,26],[130,12]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="6"/>`).join('')}</g></svg>`,
   e7:`<svg width="150" height="46" viewBox="0 0 150 46"><g fill="${l}">${[14,26,8,34,20,40,30,18,38,24].map((v,i)=>`<rect x="${6+i*14}" y="${44-v}" width="9" height="${v}" ${i==3?`fill="${h}"`:''}/>`).join('')}</g></svg>`,
   e8:`<svg width="150" height="46" viewBox="0 0 150 46"><g fill="none" stroke="${c}" stroke-width="1.5">${[0,1,2,3].map(i=>`<rect x="6" y="${3+i*11}" width="22" height="9" rx="2"/>`).join('')}</g><g fill="${a}" fill-opacity=".35" stroke="${c}"><rect x="40" y="3" width="22" height="9" rx="2"/><rect x="70" y="3" width="22" height="9" rx="2"/><rect x="40" y="25" width="22" height="9" rx="2"/></g><path d="M28 7h12M62 7h8" stroke="${l}" stroke-width="1.5"/></svg>`};
  return g[id]||''}
