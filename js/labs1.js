/* Labs for experiments 1-4 (arrays, linked list, stack, queue). */
const LABS={};

/* ===================================================== E1 */
LABS.e1=function(root){
  const MAXA=8,BASE=0x1000;
  let arr=[12,7,25,3,18,null,null,null],n=5,p=0,busy=false;
  const recs=[{roll:101,name:'Asha',marks:88.5},{roll:102,name:'Ravi',marks:76},{roll:103,name:'Meera',marks:91.25}];
  let sp=0;
  let tgt='x',X=10,Y=99;
  root.innerHTML=`<div class="ctl"><div id="e1-tab"></div></div><div id="e1-body"></div>`;
  seg($('#e1-tab'),[['arr','Array and pointer'],['st','Array of structures'],['pt','Pointers']],'arr',v=>draw(v));
  let tab='arr';
  function draw(t){tab=t||tab;({arr:drawArr,st:drawSt,pt:drawPt})[tab]()}

  function drawArr(){
    const b=$('#e1-body');
    b.innerHTML=`<div class="ctl">${fld('e1-pos','position',2)}${fld('e1-val','value',40)}${btn('e1-ins','Insert','acc')}${btn('e1-del','Delete')}${btn('e1-pp','p++','sm')}${btn('e1-pm','p--','sm')}${btn('e1-rs','Reset','sm')}</div>
    <div class="stage"><div class="cells" id="e1-cells"></div></div><div class="msg" id="e1-msg"></div>
    <div class="pcode" id="e1-c">int a[8];   int *p = a;      /* p = &a[0] */</div>`;
    paintArr([]);
    $('#e1-ins').onclick=insert;$('#e1-del').onclick=del;
    $('#e1-pp').onclick=()=>{if(p<n){p++;paintArr([]);info()}else say($('#e1-msg'),'p already points one past the last element','err')};
    $('#e1-pm').onclick=()=>{if(p>0){p--;paintArr([]);info()}};
    $('#e1-rs').onclick=()=>{p=0;paintArr([]);info()};
    info();
  }
  function paintArr(hi){
    $('#e1-cells').innerHTML=arr.map((v,i)=>`<div class="cell ${v==null?'empty':''} ${hi.includes(i)?'hi':''}"><div class="mk">${i==p?'<span>p</span>':''}</div><div class="ix">a[${i}]</div><div class="bx">${v==null?'':v}</div><div class="ad">${hex(BASE+4*i)}</div></div>`).join('');
  }
  function info(){
    const m=$('#e1-msg');
    if(p<n){say(m,`p = ${hex(BASE+4*p)}   *p = ${arr[p]}   *(p+1) = ${p+1<n?arr[p+1]:'(out of range)'}   (p+1 is ${hex(BASE+4*(p+1))}: +4 bytes, one int)`,'info');$('#e1-c').textContent=`int *p = a + ${p};          /* p = ${hex(BASE+4*p)} */\nprintf("%d", *p);        /* prints ${arr[p]} */`}
    else{say(m,`p = ${hex(BASE+4*p)}   one past the last element. Dereferencing here is undefined behaviour.`,'err')}
  }
  async function insert(){
    if(busy)return;const pos=+$('#e1-pos').value,val=+$('#e1-val').value,m=$('#e1-msg');
    if(!Number.isInteger(pos)||pos<0||pos>n){say(m,`Invalid position. Use 0 to ${n}.`,'err');return}
    if(n===MAXA){say(m,'Array is full (overflow)','err');return}
    busy=true;
    for(let i=n;i>pos;i--){arr[i]=arr[i-1];paintArr([i,i-1]);say(m,`shift: a[${i}] = a[${i-1}]`,'info');await sleep(280)}
    arr[pos]=val;n++;paintArr([pos]);busy=false;
    say(m,`Inserted ${val} at a[${pos}]. ${n-pos-1} element(s) were shifted right.`,'ok');
    $('#e1-c').textContent=`for (i = n; i > pos; i--)\n    a[i] = a[i - 1];     /* shift right */\na[${pos}] = ${val};  n++;`;
  }
  async function del(){
    if(busy)return;const pos=+$('#e1-pos').value,m=$('#e1-msg');
    if(n===0){say(m,'Array is empty (underflow)','err');return}
    if(!Number.isInteger(pos)||pos<0||pos>=n){say(m,`Invalid position. Use 0 to ${n-1}.`,'err');return}
    busy=true;const gone=arr[pos];
    for(let i=pos;i<n-1;i++){arr[i]=arr[i+1];paintArr([i,i+1]);say(m,`shift: a[${i}] = a[${i+1}]`,'info');await sleep(280)}
    arr[n-1]=null;n--;if(p>n)p=n;paintArr([]);busy=false;
    say(m,`Deleted ${gone} from a[${pos}]. ${n-pos} element(s) were shifted left.`,'ok');
    $('#e1-c').textContent=`for (i = pos; i < n - 1; i++)\n    a[i] = a[i + 1];     /* shift left */\nn--;`;
  }

  function drawSt(){
    const SZ=28,B=0x2000;
    $('#e1-body').innerHTML=`<div class="ctl">${fld('e1-r','roll',104)}${fld('e1-n','name','Kiran')}${fld('e1-m','marks',67.5)}${btn('e1-add','Add student','acc')}${btn('e1-sp','sp++','sm')}${btn('e1-sm','sp--','sm')}</div>
    <div class="stage" id="e1-recs"></div><div class="msg" id="e1-msg"></div>
    <div class="pcode">struct Student { int roll; char name[20]; float marks; };   /* offsets 0, 4, 24 · sizeof = 28 */</div>`;
    const paint=()=>{
      $('#e1-recs').innerHTML=recs.map((r,i)=>`<div style="display:grid;grid-template-columns:110px minmax(0,1fr);gap:10px;align-items:center;margin-bottom:8px">
        <div class="mono" style="font-size:12px;color:var(--muted)">${i==sp?'<b style="color:var(--link)">sp →</b> ':''}s[${i}]<br>${hex(B+SZ*i)}</div>
        <div style="display:grid;grid-template-columns:4fr 20fr 4fr;border:1.5px solid ${i==sp?'var(--link)':'var(--ink2)'};border-radius:6px;overflow:hidden;background:${i==sp?'var(--link-soft)':'var(--surface)'};min-width:280px;font:400 13px var(--mono)">
          <div style="padding:8px;text-align:center">${r.roll}<br><small style="color:var(--muted)">int · 4B</small></div>
          <div style="padding:8px;text-align:center;border-left:1.5px solid var(--ink2);border-right:1.5px solid var(--ink2)">"${esc(r.name)}"<br><small style="color:var(--muted)">char[20] · 20B</small></div>
          <div style="padding:8px;text-align:center">${r.marks}<br><small style="color:var(--muted)">float · 4B</small></div></div></div>`).join('');
      const r=recs[sp];
      say($('#e1-msg'),r?`sp = ${hex(B+SZ*sp)}   sp->roll = ${r.roll}   sp->name = "${r.name}"   sp->marks = ${r.marks}   (sp+1 = ${hex(B+SZ*(sp+1))}, +28 bytes)`:'No records','info');
    };
    paint();
    $('#e1-add').onclick=()=>{if(recs.length>=5){say($('#e1-msg'),'Array of 5 structures is full','err');return}
      const roll=+$('#e1-r').value,name=$('#e1-n').value.trim().slice(0,19),marks=+$('#e1-m').value;
      if(!roll||!name||isNaN(marks)){say($('#e1-msg'),'Enter roll, name and marks','err');return}
      recs.push({roll,name,marks});sp=recs.length-1;paint()};
    $('#e1-sp').onclick=()=>{if(sp<recs.length-1){sp++;paint()}};
    $('#e1-sm').onclick=()=>{if(sp>0){sp--;paint()}};
  }

  function drawPt(){
    $('#e1-body').innerHTML=`<div class="ctl">${fld('e1-v','value',25)}${btn('e1-a','*p = value','acc')}${btn('e1-b','**pp = value')}${btn('e1-c1','p = &amp;x','sm')}${btn('e1-c2','p = &amp;y','sm')}</div>
    <div class="stage"><div class="svgwrap" id="e1-svg"></div></div><div class="msg" id="e1-msg"></div><div class="pcode" id="e1-c">int x = 10, y = 99;\nint *p = &x;\nint **pp = &p;</div>`;
    const paint=()=>{
      const bx={y:{x:20,n:'y',a:'0x7FE8',v:Y},x:{x:190,n:'x',a:'0x7FF0',v:X},p:{x:360,n:'p',a:'0x7FF8',v:tgt=='x'?'0x7FF0':'0x7FE8'},pp:{x:530,n:'pp',a:'0x8000',v:'0x7FF8'}};
      let s='';
      Object.values(bx).forEach(b=>{s+=`<rect x="${b.x}" y="70" width="130" height="58" rx="6" fill="var(--surface)" stroke="var(--ink2)" stroke-width="1.5"/><text class="tb" x="${b.x+65}" y="104" text-anchor="middle">${b.v}</text><text class="t" x="${b.x+8}" y="86">${b.n}</text><text class="t" x="${b.x+65}" y="144" text-anchor="middle">${b.a}</text>`});
      const ar=(x1,x2,up)=>`<path d="M${x1} 70 V${up} H${x2} V68" fill="none" stroke="var(--link)" stroke-width="2" marker-end="url(#ah)"/>`;
      s+=ar(bx.p.x+65,bx[tgt].x+65,tgt=='x'?40:24);s+=ar(bx.pp.x+65,bx.p.x+40,tgt=='x'?14:8);
      $('#e1-svg').innerHTML=`<svg viewBox="0 0 690 160" width="690" height="160" role="img" aria-label="Pointer diagram"><defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--link)"/></marker></defs>${s}</svg>`;
      say($('#e1-msg'),`x = ${X}   y = ${Y}   p → ${tgt}   *p = ${tgt=='x'?X:Y}   **pp = ${tgt=='x'?X:Y}`,'info');
    };
    paint();
    const set=(code,fn)=>{fn();$('#e1-c').textContent=code;paint()};
    $('#e1-a').onclick=()=>{const v=+$('#e1-v').value;set(`*p = ${v};        /* writes ${v} into ${tgt} */`,()=>{tgt=='x'?X=v:Y=v})};
    $('#e1-b').onclick=()=>{const v=+$('#e1-v').value;set(`**pp = ${v};      /* follows pp, then p, writes into ${tgt} */`,()=>{tgt=='x'?X=v:Y=v})};
    $('#e1-c1').onclick=()=>set('p = &x;          /* p now holds 0x7FF0 */',()=>{tgt='x'});
    $('#e1-c2').onclick=()=>set('p = &y;          /* p now holds 0x7FE8, pp still points to p */',()=>{tgt='y'});
  }
  draw('arr');
};

/* ===================================================== E2 */
LABS.e2=function(root){
  const R=rng(5);let used=new Set();
  const addr=()=>{let a;do{a=0x5A00+16*Math.floor(R()*60)}while(used.has(a));used.add(a);return hex(a)};
  let list=[10,20,30].map(v=>({v,a:addr()})),busy=false;
  const MAXN=9;
  root.innerHTML=`<div class="ctl">${fld('e2-v','value',25)}${fld('e2-p','position',2)}</div>
   <div class="ctl">${btn('e2-ib','Insert begin','acc')}${btn('e2-ie','Insert end','acc')}${btn('e2-ip','Insert at position','acc')}${btn('e2-db','Delete begin')}${btn('e2-de','Delete end')}${btn('e2-dv','Delete value')}${btn('e2-s','Search')}${btn('e2-r','Reverse')}${btn('e2-t','Traverse','sm')}</div>
   <div class="stage" id="e2-stage"></div><div class="stats" id="e2-st"></div>
   <div class="labgrid"><div class="msg" id="e2-msg"></div><div class="pcode" id="e2-c">struct node *head = NULL;</div></div>`;
  function paint(cls={},lab={}){
    const st=$('#e2-stage');
    if(!list.length){st.innerHTML=`<div class="chain"><span class="ptrtag">head</span><span class="null">NULL</span></div>`}
    else st.innerHTML=`<div class="chain"><span class="ptrtag">head</span><span class="arrow">→</span>`+list.map((n,i)=>`<div class="nd ${cls[i]||''}"><div class="lb">${lab[i]||''}</div><div class="box"><span>${n.v}</span><span>•</span></div><div class="ad">${n.a}</div></div><span class="arrow">${i<list.length-1?'→':'→'}</span>`).join('')+`<span class="null">NULL</span></div>`;
    $('#e2-st').innerHTML=`<div class="stat">length<b>${list.length}</b></div><div class="stat">head<b>${list.length?list[0].a:'NULL'}</b></div><div class="stat">last node<b>${list.length?list[list.length-1].v:'—'}</b></div>`;
  }
  const code=(s)=>$('#e2-c').textContent=s;
  const m=(t,k)=>say($('#e2-msg'),t,k);
  const val=()=>{const v=parseInt($('#e2-v').value,10);return isNaN(v)?null:v};
  const lock=async fn=>{if(busy)return;busy=true;try{await fn()}finally{busy=false}};
  async function walk(to,lbl='t'){for(let i=0;i<=to;i++){paint({[i]:'hi'},{[i]:lbl});await sleep(300)}}
  function full(){if(list.length>=MAXN){m('List limit of 9 nodes reached for the diagram','err');return true}}
  $('#e2-ib').onclick=()=>lock(async()=>{const v=val();if(v==null||full()){if(v==null)m('Enter a value','err');return}
    list.unshift({v,a:addr()});paint({0:'ok'},{0:'head'});
    code('n = createNode(x);\nn->next = head;     /* new node points to old first */\nhead = n;           /* head moves to the new node */');m(`Inserted ${v} at the beginning. Two pointer changes, O(1).`,'ok')});
  $('#e2-ie').onclick=()=>lock(async()=>{const v=val();if(v==null||full()){if(v==null)m('Enter a value','err');return}
    if(list.length)await walk(list.length-1);list.push({v,a:addr()});paint({[list.length-1]:'ok'});
    code('n = createNode(x);\nt = head;\nwhile (t->next != NULL)   /* walk to the last node */\n    t = t->next;\nt->next = n;');m(`Inserted ${v} at the end after walking ${Math.max(list.length-1,0)} link(s). O(n).`,'ok')});
  $('#e2-ip').onclick=()=>lock(async()=>{const v=val(),pos=parseInt($('#e2-p').value,10);if(v==null||full()){if(v==null)m('Enter a value','err');return}
    if(!(pos>=1&&pos<=list.length+1)){m(`Position must be 1 to ${list.length+1}`,'err');return}
    if(pos>1)await walk(pos-2);
    list.splice(pos-1,0,{v,a:addr()});paint({[pos-1]:'ok'});
    code(`t = node at position ${pos-1};\nn = createNode(x);\nn->next = t->next;   /* link new node to the rest first */\nt->next = n;         /* then link previous node to it */`);m(`Inserted ${v} at position ${pos}.`,'ok')});
  $('#e2-db').onclick=()=>lock(async()=>{if(!list.length){m('List is empty (underflow)','err');return}
    paint({0:'bad'},{0:'t'});const g=list[0].v;await sleep(450);list.shift();paint();
    code('t = head;\nhead = head->next;\nfree(t);');m(`Deleted ${g} from the beginning. O(1).`,'ok')});
  $('#e2-de').onclick=()=>lock(async()=>{if(!list.length){m('List is empty (underflow)','err');return}
    if(list.length>1)await walk(list.length-2,'prev');paint({[list.length-1]:'bad'},{[list.length-1]:'t'});await sleep(450);
    const g=list.pop().v;paint();
    code('while (t->next != NULL) { prev = t; t = t->next; }\nprev->next = NULL;   /* detach last node */\nfree(t);');m(`Deleted ${g} from the end.`,'ok')});
  $('#e2-dv').onclick=()=>lock(async()=>{const v=val();if(v==null){m('Enter a value','err');return}
    const idx=list.findIndex(n=>n.v===v);
    for(let i=0;i<(idx<0?list.length:idx);i++){paint({[i]:'hi'},{[i]:'t'});await sleep(300)}
    if(idx<0){paint();m(`${v} not found. Nothing deleted.`,'err');return}
    paint({[idx]:'bad'},{[idx]:'t'});await sleep(450);list.splice(idx,1);paint();
    code('while (t != NULL && t->data != x) { prev = t; t = t->next; }\nif (prev == NULL) head = t->next;\nelse              prev->next = t->next;   /* bypass */\nfree(t);');m(`Deleted ${v} (position ${idx+1}).`,'ok')});
  $('#e2-s').onclick=()=>lock(async()=>{const v=val();if(v==null){m('Enter a value','err');return}
    for(let i=0;i<list.length;i++){paint({[i]:'hi'},{[i]:'t'});await sleep(320);
      if(list[i].v===v){paint({[i]:'ok'},{[i]:'found'});code('while (t != NULL) {\n    if (t->data == x) return pos;\n    t = t->next; pos++;\n}');m(`${v} found at position ${i+1} after ${i+1} comparison(s).`,'ok');return}}
    paint();m(`${v} not found after ${list.length} comparison(s).`,'err')});
  $('#e2-r').onclick=()=>lock(async()=>{if(list.length<2){m('Need at least 2 nodes','info');return}
    const steps=[];for(let i=0;i<list.length;i++){await sleep(260);paint({[i]:'hi'},{[i]:'curr'})}
    list.reverse();paint({0:'ok'},{0:'new head'});
    code('while (curr != NULL) {\n    next = curr->next;\n    curr->next = prev;   /* flip the link */\n    prev = curr;\n    curr = next;\n}\nhead = prev;');m('List reversed in one pass using three pointers. O(n) time, O(1) space.','ok')});
  $('#e2-t').onclick=()=>lock(async()=>{for(let i=0;i<list.length;i++){paint({[i]:'hi'},{[i]:'t'});await sleep(300)}paint();code('for (t = head; t != NULL; t = t->next)\n    printf("%d -> ", t->data);');m(list.length?list.map(n=>n.v).join(' → ')+' → NULL':'List is empty','info')});
  paint();m('Try inserting a value, then watch the pointers being rewired.','info');
};

/* ===================================================== E3 */
LABS.e3=function(root){
  root.innerHTML=`<div class="ctl"><div id="e3-tab"></div></div><div id="e3-body"></div>`;
  seg($('#e3-tab'),[['a','(a) Stack using SLL'],['b','(b) Infix to postfix']],'a',v=>v=='a'?partA():partB());
  const R=rng(9);let st=[{v:7,a:'0x6A40'},{v:3,a:'0x6A20'}];
  const ad=()=>hex(0x6000+16*Math.floor(R()*200));
  function partA(){
    $('#e3-body').innerHTML=`<div class="ctl">${fld('e3-v','value',42)}${btn('e3-push','Push','acc')}${btn('e3-pop','Pop')}${btn('e3-peek','Display top')}${btn('e3-dsp','Display all','sm')}${btn('e3-clr','Create / clear','sm')}</div>
    <div class="labgrid"><div class="stage" id="e3-st"></div><div><div class="msg" id="e3-msg"></div><div class="pcode" id="e3-c" style="margin-top:10px">struct node *top = NULL;   /* create stack */</div></div></div>`;
    const paint=(cls={})=>{
      $('#e3-st').innerHTML=!st.length?`<div class="vrow"><span class="ptrtag">top</span><span class="null">NULL</span></div><p class="cap" style="margin-top:10px;color:var(--muted);font-size:12.5px">Stack is empty.</p>`:
      `<div class="vstack">`+st.map((n,i)=>`<div><div class="vrow">${i==0?'<span class="ptrtag">top →</span>':'<span style="width:56px"></span>'}<div class="nd ${cls[i]||''}"><div class="box"><span>${n.v}</span><span>•</span></div><div class="ad">${n.a}</div></div></div><div class="vlink">${i<st.length-1?'↓':'↓ NULL'}</div></div>`).join('')+`</div>`};
    paint();const M=(t,k)=>say($('#e3-msg'),t,k);
    $('#e3-push').onclick=()=>{const v=parseInt($('#e3-v').value,10);if(isNaN(v)){M('Enter a value','err');return}if(st.length>=7){M('Diagram limit of 7 nodes reached','err');return}
      st.unshift({v,a:ad()});paint({0:'ok'});$('#e3-c').textContent='n = (struct node*)malloc(sizeof(struct node));\nn->data = x;\nn->next = top;    /* old top becomes second */\ntop = n;          /* new node is the top */';M(`Pushed ${v}. top now holds the address of the new node.`,'ok')};
    $('#e3-pop').onclick=async()=>{if(!st.length){M('Stack underflow: nothing to pop','err');paint();return}
      paint({0:'bad'});await sleep(400);const g=st.shift().v;paint();$('#e3-c').textContent='t = top;\nx = t->data;\ntop = top->next;   /* move top down */\nfree(t);';M(`Popped ${g}. top moved to the next node.`,'ok')};
    $('#e3-peek').onclick=()=>{if(!st.length){M('Stack is empty','err');return}paint({0:'hi'});$('#e3-c').textContent='printf("Top element = %d", top->data);';M(`Top element = ${st[0].v} (not removed)`,'info')};
    $('#e3-dsp').onclick=async()=>{if(!st.length){M('Stack is empty','err');return}for(let i=0;i<st.length;i++){paint({[i]:'hi'});await sleep(280)}paint();M('TOP → '+st.map(n=>n.v).join(' ')+' ← BOTTOM','info')};
    $('#e3-clr').onclick=()=>{st=[];paint();$('#e3-c').textContent='top = NULL;';M('Empty stack created','ok')};
    M('Push and pop happen at the head of the list. Both are O(1).','info');
  }
  /* ---- part b ---- */
  const prec=c=>c=='^'?3:'*/'.includes(c)?2:'+-'.includes(c)?1:0;
  function convert(expr){
    const stack=[],frames=[];let out='';
    for(const ch of expr.replace(/\s+/g,'')){
      const acts=[];
      if(/[A-Za-z0-9]/.test(ch)){out+=ch;acts.push('operand → append to output')}
      else if(ch=='('){stack.push(ch);acts.push('push (')}
      else if(ch==')'){
        while(stack.length&&stack[stack.length-1]!='('){const o=stack.pop();out+=o;acts.push(`pop ${o} → output`)}
        if(!stack.length)return{error:'Mismatched parentheses: ")" has no matching "("'};
        stack.pop();acts.push('discard ( ')}
      else if('+-*/^'.includes(ch)){
        while(stack.length){const t=stack[stack.length-1];if(t=='(')break;
          if(prec(t)>prec(ch)||(prec(t)==prec(ch)&&ch!='^')){stack.pop();out+=t;acts.push(`${t} ≥ ${ch} in precedence → pop ${t} → output`)}else break}
        stack.push(ch);acts.push(`push ${ch}`)}
      else return{error:`Unsupported symbol "${ch}". Use letters, digits, + - * / ^ and brackets.`};
      frames.push({sym:ch,act:acts.join('; '),stack:[...stack],out})}
    const acts=[];
    while(stack.length){const o=stack.pop();if(o=='(')return{error:'Mismatched parentheses: "(" was never closed'};out+=o;acts.push(`pop ${o} → output`)}
    frames.push({sym:'end',act:acts.length?acts.join('; '):'stack already empty',stack:[],out});
    return{frames,result:out}}
  let fr=null,idx=0,playing=false;
  function partB(){
    $('#e3-body').innerHTML=`<div class="ctl">${fld('e3-ex','infix expression','A+B*(C^D-E)^(F+G*H)-I','w')}${btn('e3-go','Convert','acc')}${btn('e3-prev','◀ Prev','sm')}${btn('e3-next','Next ▶','sm')}${btn('e3-play','Play','sm')}</div>
    <div class="msg" id="e3-msg"></div>
    <div class="labgrid"><div><div class="stage" style="padding:8px"><div class="scroll"><table class="trace"><thead><tr><th>#</th><th>Symbol</th><th>Action</th><th>Stack (bottom→top)</th><th>Output</th></tr></thead><tbody id="e3-tb"></tbody></table></div></div></div>
    <div><div class="eyebrow" style="margin-bottom:6px">Postfix output</div><div class="pf" id="e3-out">—</div><div class="eyebrow" style="margin:14px 0 6px">Stack now</div><div class="chain" id="e3-stk"></div>
    <div class="eyebrow" style="margin:14px 0 6px">Precedence</div><div class="mono" style="font-size:12.5px;line-height:1.8">^ → 3 (right-assoc)<br>* / → 2<br>+ - → 1<br>( → lowest, never popped by an operator</div></div></div>`;
    $('#e3-go').onclick=run;$('#e3-next').onclick=()=>{if(fr&&idx<fr.length-1){idx++;paint()}};$('#e3-prev').onclick=()=>{if(fr&&idx>0){idx--;paint()}};
    $('#e3-play').onclick=async()=>{if(!fr)run();if(!fr)return;if(playing){playing=false;return}playing=true;$('#e3-play').textContent='Pause';if(idx>=fr.length-1)idx=0;
      while(playing&&idx<fr.length-1){idx++;paint();await sleep(750)}playing=false;$('#e3-play').textContent='Play'};
    run();
  }
  function run(){
    const r=convert($('#e3-ex').value);
    if(r.error){fr=null;say($('#e3-msg'),r.error,'err');$('#e3-tb').innerHTML='';$('#e3-out').textContent='—';$('#e3-stk').innerHTML='';return}
    fr=r.frames;idx=0;res=r.result;paint()}
  let res='';
  function paint(){
    $('#e3-tb').innerHTML=fr.map((f,i)=>`<tr class="${i==idx?'cur':i>idx?'fut':''}"><td>${i+1}</td><td><b>${esc(f.sym)}</b></td><td>${esc(f.act)}</td><td>${esc(f.stack.join(' '))||'—'}</td><td>${esc(f.out)||'—'}</td></tr>`).join('');
    const f=fr[idx];$('#e3-out').textContent=f.out||'—';
    $('#e3-stk').innerHTML=f.stack.length?f.stack.map(s=>`<div class="nd"><div class="box"><span>${esc(s)}</span><span>•</span></div></div><span class="arrow" style="width:20px">→</span>`).join('')+'<span class="null">NULL</span>':'<span class="null">empty</span>';
    $('#e3-stk').dataset.rev='';
    say($('#e3-msg'),idx==fr.length-1?`Done. Postfix: ${res}`:`Step ${idx+1} of ${fr.length}: reading "${f.sym}"`,idx==fr.length-1?'ok':'info');
    const cur=$('#e3-tb .cur');if(cur)cur.scrollIntoView({block:'nearest'});
  }
  partA();
};

/* ===================================================== E4 */
LABS.e4=function(root){
  const MAX=6;let mode='lin',q,front,rear,count,wasted;
  const reset=()=>{q=Array(MAX).fill(null);front=-1;rear=-1;count=0};reset();
  root.innerHTML=`<div class="ctl"><div id="e4-mode"></div>${fld('e4-v','value',15)}${btn('e4-enq','Enqueue','acc')}${btn('e4-deq','Dequeue')}${btn('e4-peek','Peek','sm')}${btn('e4-rs','Reset','sm')}</div>
   <div class="stage"><div class="cells" id="e4-cells"></div></div><div class="stats" id="e4-st"></div>
   <div class="labgrid"><div class="msg" id="e4-msg"></div><div class="pcode" id="e4-c"></div></div>`;
  seg($('#e4-mode'),[['lin','Linear queue'],['cir','Circular queue']],'lin',v=>{mode=v;reset();paint();say($('#e4-msg'),v=='lin'?'Linear queue: rear == MAX-1 means overflow, even if the front has free slots.':'Circular queue: indices wrap with % MAX, so freed slots are reused.','info');$('#e4-c').textContent=''});
  function paint(hi=-1){
    $('#e4-cells').innerHTML=q.map((v,i)=>{
      const dead=mode=='lin'&&front>=0&&i<front&&v!=null;
      const mk=(i==front?'<span class="f">F</span>':'')+(i==rear?'<span class="r">R</span>':'');
      return`<div class="cell ${v==null?'empty':''} ${dead?'dead':''} ${i==hi?'ok':''}"><div class="mk">${mk}</div><div class="ix">q[${i}]</div><div class="bx">${v==null?'':v}</div><div class="ad">${dead?'wasted':''}</div></div>`}).join('');
    const free=q.filter(v=>v==null).length+ (mode=='lin'?0:0);
    $('#e4-st').innerHTML=`<div class="stat">front<b>${front}</b></div><div class="stat">rear<b>${rear}</b></div><div class="stat">size<b>${count}</b></div><div class="stat">status<b>${count==0?'empty':(mode=='lin'?rear==MAX-1:count==MAX)?'full':'ok'}</b></div>`}
  const M=(t,k)=>say($('#e4-msg'),t,k);
  $('#e4-enq').onclick=()=>{const v=parseInt($('#e4-v').value,10);if(isNaN(v)){M('Enter a value','err');return}
    if(mode=='lin'){
      if(rear==MAX-1){const w=front>0?front:0;paint();M(`Queue overflow: rear = ${MAX-1}.`+(w?` ${w} slot(s) at the front are free but cannot be reused. This is the drawback of the linear queue.`:''),'err');return}
      if(front==-1)front=0;rear++;q[rear]=v;count++;paint(rear);
      $('#e4-c').textContent=`if (rear == MAX - 1) overflow;\nif (front == -1) front = 0;\nq[++rear] = ${v};`;M(`Enqueued ${v} at q[${rear}]`,'ok')}
    else{
      if(count==MAX){paint();M('Queue overflow: all 6 slots are occupied','err');return}
      if(front==-1){front=rear=0}else rear=(rear+1)%MAX;q[rear]=v;count++;paint(rear);
      $('#e4-c').textContent=`if ((rear + 1) % MAX == front) overflow;\nrear = (rear + 1) % MAX;\nq[rear] = ${v};`;M(`Enqueued ${v} at q[${rear}]`+(rear<front?' (wrapped around)':''),'ok')}};
  $('#e4-deq').onclick=()=>{
    if(front==-1){M('Queue underflow: the queue is empty','err');return}
    const g=q[front];
    if(mode=='lin'){
      front++;count--;
      if(front>rear){reset();paint();M(`Dequeued ${g}. Queue is now empty, so front and rear are reset to -1.`,'ok')}
      else{paint();M(`Dequeued ${g}. front moved to ${front}; slot q[${front-1}] is now unusable.`,'ok')}
      $('#e4-c').textContent=`x = q[front++];\nif (front > rear) front = rear = -1;`}
    else{
      q[front]=null;count--;
      if(front==rear){front=rear=-1}else front=(front+1)%MAX;
      paint();$('#e4-c').textContent=`x = q[front];\nif (front == rear) front = rear = -1;\nelse front = (front + 1) % MAX;`;M(`Dequeued ${g}.`,'ok')}};
  $('#e4-peek').onclick=()=>{if(front==-1)M('Queue is empty','err');else{paint(front);M(`Front element = ${q[front]}`,'info')}};
  $('#e4-rs').onclick=()=>{reset();paint();M('Queue reset','info')};
  paint();M('Fill the queue, dequeue a few items, then enqueue again in each mode.','info');
};
