/* Labs for experiments 5-6 (binary search tree, graph traversal). */

/* ===================================================== E5 */
LABS.e5=function(root){
  let rt=null,id=0,view='tree',sel=null,busy=false,marks={};
  const mk=v=>({v,l:null,r:null,a:hex(0x4000+(id++)*24)});
  const ins=(n,v)=>{if(!n)return mk(v);if(v<n.v)n.l=ins(n.l,v);else if(v>n.v)n.r=ins(n.r,v);return n};
  [50,30,70,20,40,60,80].forEach(v=>rt=ins(rt,v));
  const count=n=>n?1+count(n.l)+count(n.r):0,height=n=>n?1+Math.max(height(n.l),height(n.r)):0;
  const inord=(n,o=[])=>{if(n){inord(n.l,o);o.push(n);inord(n.r,o)}return o};
  const MAXN=15;
  root.innerHTML=`<div class="ctl">${fld('e5-v','value',45)}${btn('e5-i','Insert','acc')}${btn('e5-d','Delete')}${btn('e5-s','Search')}${btn('e5-rnd','Random tree','sm')}${btn('e5-clr','Clear','sm')}</div>
  <div class="ctl">${btn('e5-in','Inorder','sm')}${btn('e5-pre','Preorder','sm')}${btn('e5-post','Postorder','sm')}<span style="flex:1"></span><div id="e5-view"></div></div>
  <div class="stage"><div class="svgwrap" id="e5-svg"></div></div>
  <div class="stats" id="e5-st"></div>
  <div class="labgrid"><div><div class="msg" id="e5-msg"></div><div class="log" id="e5-log" style="margin-top:10px"></div></div><div><div class="eyebrow" style="margin-bottom:6px">Selected node (click a node)</div><div class="pcode" id="e5-node">struct node {\n    struct node *prev;   /* left child */\n    int data;\n    struct node *next;   /* right child */\n};</div></div></div>`;
  seg($('#e5-view'),[['tree','Tree view'],['dll','Inorder DLL view']],'tree',v=>{view=v;paint()});
  let lines=[];const L=t=>{lines.push(t);logTo($('#e5-log'),lines,lines.length-1)};
  const M=(t,k)=>say($('#e5-msg'),t,k);
  function paint(){
    const st=$('#e5-svg');
    if(view=='dll'){
      const o=inord(rt);
      st.innerHTML=o.length?`<div class="chain"><span class="null">NULL</span>`+o.map(n=>`<span class="arrow">⇄</span><div class="nd ${marks[n.v]||''}"><div class="box"><span style="color:var(--link);min-width:30px">◂</span><span style="border-left:1.5px solid var(--ink2)">${n.v}</span><span>▸</span></div><div class="ad">${n.a}</div></div>`).join('')+`<span class="arrow">⇄</span><span class="null">NULL</span></div><p class="cap" style="font-size:12.5px;color:var(--muted);margin-top:8px">Each node's prev and next now point to its inorder neighbours. A BST built from DLL-shaped nodes can be flattened into this sorted list in O(n).</p>`:'<span class="null">empty tree</span>';
    }else if(!rt){st.innerHTML='<span class="null">root = NULL (empty tree)</span>'}
    else{
      const pos=new Map();let i=0,md=0;
      (function go(n,d){if(!n)return;go(n.l,d+1);pos.set(n,{x:30+i*48,y:34+d*62});i++;md=Math.max(md,d);go(n.r,d+1)})(rt,0);
      const W=Math.max(i*48+30,300),H=md*62+70;let e='',nd='';
      pos.forEach((p,n)=>{[n.l,n.r].forEach(c=>{if(c){const q=pos.get(c);e+=`<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke="var(--ink2)" stroke-width="1.5"/>`}});});
      pos.forEach((p,n)=>{const m=marks[n.v]||'',f=m=='hi'?'var(--hi-soft)':m=='ok'?'var(--accent-soft)':m=='bad'?'var(--danger-soft)':m=='vis'?'var(--link-soft)':'var(--surface)',s=m=='hi'?'var(--hi)':m=='ok'?'var(--accent)':m=='bad'?'var(--danger)':m=='vis'?'var(--link)':'var(--ink2)';
        nd+=`<g class="gn" data-v="${n.v}" tabindex="0" role="button" aria-label="Node ${n.v}"><circle cx="${p.x}" cy="${p.y}" r="19" fill="${f}" stroke="${sel==n.v?'var(--ink)':s}" stroke-width="${sel==n.v?3:1.8}"/><text class="tb" x="${p.x}" y="${p.y+5}" text-anchor="middle">${n.v}</text></g>`});
      st.innerHTML=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Binary search tree">${e}${nd}</svg>`;
    }
    const o=inord(rt);
    $('#e5-st').innerHTML=`<div class="stat">nodes<b>${count(rt)}</b></div><div class="stat">height<b>${height(rt)}</b></div><div class="stat">min<b>${o.length?o[0].v:'—'}</b></div><div class="stat">max<b>${o.length?o[o.length-1].v:'—'}</b></div><div class="stat">root<b>${rt?rt.v:'NULL'}</b></div>`;
    nodeInfo();
  }
  function nodeInfo(){
    const n=sel!=null&&inord(rt).find(x=>x.v===sel);
    if(!n){return}
    $('#e5-node').textContent=`node ${n.v} at ${n.a}\n  prev (left)  = ${n.l?n.l.a+'  → '+n.l.v:'NULL'}\n  data         = ${n.v}\n  next (right) = ${n.r?n.r.a+'  → '+n.r.v:'NULL'}`;
  }
  $('#e5-svg').addEventListener('click',e=>{const g=e.target.closest('.gn');if(!g)return;sel=+g.dataset.v;paint()});
  const val=()=>{const v=parseInt($('#e5-v').value,10);return isNaN(v)?null:v};
  const lock=fn=>async()=>{if(busy)return;busy=true;marks={};lines=[];try{await fn()}finally{busy=false}};
  async function walk(v,stopAtNull=true){
    let n=rt,last=null;
    while(n){marks={[n.v]:'hi'};paint();await sleep(450);
      if(v===n.v){L(`${v} == ${n.v} → found`);return{n,parent:last}}
      L(`${v} ${v<n.v?'<':'>'} ${n.v} → go ${v<n.v?'left (prev)':'right (next)'}`);last=n;n=v<n.v?n.l:n.r}
    L(`reached NULL after ${last?'following '+last.v:'root'}`);return{n:null,parent:last}}
  $('#e5-i').onclick=lock(async()=>{const v=val();if(v==null){M('Enter a value','err');return}
    if(count(rt)>=MAXN){M('Diagram limit of 15 nodes reached','err');return}
    if(rt){const r=await walk(v);if(r.n){M(`${v} already exists. BST keys are unique.`,'err');marks={};paint();return}}
    rt=ins(rt,v);marks={[v]:'ok'};sel=v;paint();M(`Inserted ${v} at the first NULL link on its search path.`,'ok')});
  $('#e5-s').onclick=lock(async()=>{const v=val();if(v==null){M('Enter a value','err');return}
    const r=await walk(v);if(r.n){marks={[v]:'ok'};paint();M(`${v} found.`,'ok')}else{marks={};paint();M(`${v} not found.`,'err')}});
  $('#e5-d').onclick=lock(async()=>{const v=val();if(v==null){M('Enter a value','err');return}
    const r=await walk(v);if(!r.n){marks={};paint();M(`${v} not found. Nothing deleted.`,'err');return}
    const n=r.n;let how;
    marks={[v]:'bad'};paint();await sleep(450);
    if(!n.l&&!n.r)how='leaf: unlink it';
    else if(!n.l||!n.r)how='one child: replace the node by its child';
    else{const o=inord(n.r)[0];how=`two children: copy inorder successor ${o.v} (smallest in right subtree), then delete ${o.v} from the right subtree`;marks={[v]:'bad',[o.v]:'hi'};paint();L(`successor = ${o.v}`);await sleep(700)}
    const del=(t,x)=>{if(!t)return null;if(x<t.v)t.l=del(t.l,x);else if(x>t.v)t.r=del(t.r,x);else{if(!t.l)return t.r;if(!t.r)return t.l;let s=t.r;while(s.l)s=s.l;t.v=s.v;t.r=del(t.r,s.v)}return t};
    rt=del(rt,v);marks={};if(sel===v)sel=null;paint();M(`Deleted ${v}. Case: ${how}.`,'ok')});
  $('#e5-rnd').onclick=lock(async()=>{const R=Math.random;rt=null;id=0;const s=new Set();while(s.size<9)s.add(10+Math.floor(R()*80));[...s].forEach(v=>rt=ins(rt,v));sel=null;paint();M('Random tree built from 9 keys inserted in random order.','info')});
  $('#e5-clr').onclick=lock(async()=>{rt=null;id=0;sel=null;paint();M('Tree cleared (root = NULL).','info')});
  const trav=(kind)=>lock(async()=>{
    if(!rt){M('Tree is empty','err');return}
    const out=[];const go=n=>{if(!n)return;if(kind=='pre')out.push(n);go(n.l);if(kind=='in')out.push(n);go(n.r);if(kind=='post')out.push(n)};go(rt);
    const done=[];for(const n of out){marks={};done.forEach(d=>marks[d]='vis');marks[n.v]='hi';paint();done.push(n.v);L(`visit ${n.v}`);await sleep(520)}
    marks={};done.forEach(d=>marks[d]='vis');paint();
    M(`${{in:'Inorder (left, root, right)',pre:'Preorder (root, left, right)',post:'Postorder (left, right, root)'}[kind]}: ${done.join(' ')}`,'ok')});
  $('#e5-in').onclick=trav('in');$('#e5-pre').onclick=trav('pre');$('#e5-post').onclick=trav('post');
  paint();M('Insert keys and watch the path. Click a node to see its prev / data / next fields.','info');
};

/* ===================================================== E6 */
LABS.e6=function(root){
  const G={
   A:{n:7,pos:[[70,150],[190,60],[190,240],[330,60],[330,240],[450,120],[500,230]],ed:[[0,1],[0,2],[1,3],[1,4],[2,4],[3,5],[4,5],[4,6]]},
   B:{n:6,pos:[[80,70],[250,40],[420,70],[80,230],[250,270],[420,230]],ed:[[0,1],[1,2],[0,3],[3,4],[4,5],[2,5],[1,4]]}};
  let gk='A',alg='bfs',start=0,frames=[],fi=0,playing=false;
  root.innerHTML=`<div class="ctl"><div id="e6-alg"></div><div id="e6-g"></div><label class="fld" for="e6-s">start vertex<select id="e6-s"></select></label>${btn('e6-prev','◀','sm')}${btn('e6-step','Step ▶','acc')}${btn('e6-play','Play')}${btn('e6-all','Run all','sm')}${btn('e6-rs','Reset','sm')}</div>
  <div class="labgrid"><div><div class="stage"><div class="svgwrap" id="e6-svg"></div></div><div class="legend" style="margin-top:8px"><span><i style="background:var(--hi)"></i>current</span><span><i style="background:var(--link)"></i>waiting in queue / stack</span><span><i style="background:var(--accent)"></i>visited</span><span><i style="background:var(--line)"></i>unseen</span></div><div class="msg" id="e6-msg" style="margin-top:10px"></div></div>
  <div><div class="eyebrow" id="e6-dn" style="margin-bottom:6px">Queue</div><div class="chain" id="e6-ds" style="min-height:62px"></div><div class="eyebrow" style="margin:10px 0 6px">Visit order</div><div class="pf" id="e6-ord">—</div><div class="eyebrow" style="margin:12px 0 6px">Adjacency matrix</div><div class="scroll"><div id="e6-mx"></div></div></div></div>`;
  seg($('#e6-alg'),[['bfs','BFS · queue'],['dfs','DFS · stack']],'bfs',v=>{alg=v;build()});
  seg($('#e6-g'),[['A','Graph A'],['B','Graph B']],'A',v=>{gk=v;start=0;fillStart();build()});
  const adjOf=()=>{const g=G[gk],a=Array.from({length:g.n},()=>[]);g.ed.forEach(([u,v])=>{a[u].push(v);a[v].push(u)});a.forEach(x=>x.sort((p,q)=>p-q));return a};
  function fillStart(){const g=G[gk];$('#e6-s').innerHTML=Array.from({length:g.n},(_,i)=>`<option value="${i}" ${i==start?'selected':''}>${i}</option>`).join('')}
  function compute(){
    const a=adjOf(),fr=[];let order=[],edges=[];
    const snap=(note,cur,ds,disc)=>fr.push({note,cur,ds:[...ds],order:[...order],edges:edges.map(e=>[...e]),disc:[...disc]});
    if(alg=='bfs'){
      const q=[start],disc=new Set([start]);snap(`Enqueue start vertex ${start} and mark it visited`,-1,q,disc);
      while(q.length){const u=q.shift();order.push(u);snap(`Dequeue ${u}: visit ${u}`,u,q,disc);
        for(const v of a[u]){if(!disc.has(v)){disc.add(v);q.push(v);edges.push([u,v]);snap(`${v} is an unvisited neighbour of ${u}: enqueue it`,u,q,disc)}}
        if(!a[u].some(v=>!order.includes(v)&&!q.includes(v))&&q.length==0)break}
      snap('Queue is empty: BFS complete',-1,[],disc);
    }else{
      const st=[[start,-1]],vis=new Set();const D=()=>new Set(st.map(s=>s[0]));
      snap(`Push start vertex ${start}`,-1,st.map(s=>s[0]),D());
      while(st.length){const[u,p]=st.pop();
        if(vis.has(u)){snap(`Pop ${u}: already visited, skip`,-1,st.map(s=>s[0]),D());continue}
        vis.add(u);order.push(u);if(p>=0)edges.push([p,u]);snap(`Pop ${u}: visit ${u}`,u,st.map(s=>s[0]),D());
        const nb=a[u].filter(v=>!vis.has(v));
        if(nb.length){[...nb].reverse().forEach(v=>st.push([v,u]));snap(`Push unvisited neighbours ${nb.join(', ')} of ${u} (${nb[0]} ends on top)`,u,st.map(s=>s[0]),D())}}
      snap('Stack is empty: DFS complete',-1,[],new Set());
    }
    return fr}
  function build(){frames=compute();fi=0;playing=false;$('#e6-play').textContent='Play';paint();
    const g=G[gk],a=adjOf();
    $('#e6-mx').innerHTML=`<table class="trace" style="width:auto"><tr><th></th>${Array.from({length:g.n},(_,i)=>`<th>${i}</th>`).join('')}</tr>${Array.from({length:g.n},(_,i)=>`<tr><th>${i}</th>${Array.from({length:g.n},(_,j)=>`<td style="${a[i].includes(j)?'background:var(--accent-soft);font-weight:500':'color:var(--muted)'}">${a[i].includes(j)?1:0}</td>`).join('')}</tr>`).join('')}</table>`}
  function paint(){
    const g=G[gk],f=frames[fi];let e='',nd='';
    g.ed.forEach(([u,v])=>{const t=f.edges.some(x=>(x[0]==u&&x[1]==v)||(x[0]==v&&x[1]==u));
      e+=`<line x1="${g.pos[u][0]}" y1="${g.pos[u][1]}" x2="${g.pos[v][0]}" y2="${g.pos[v][1]}" stroke="${t?'var(--accent)':'var(--line)'}" stroke-width="${t?4:2}"/>`});
    g.pos.forEach((p,i)=>{const vis=f.order.includes(i),cur=f.cur==i,wait=f.ds.includes(i);
      const fill=cur?'var(--hi)':vis?'var(--accent)':wait?'var(--link)':'var(--surface)',stroke=cur?'var(--hi)':vis?'var(--accent)':wait?'var(--link)':'var(--ink2)';
      nd+=`<g><circle cx="${p[0]}" cy="${p[1]}" r="22" fill="${fill}" stroke="${stroke}" stroke-width="2"/><text x="${p[0]}" y="${p[1]+5}" text-anchor="middle" style="font:600 15px var(--mono);fill:${cur||vis||wait?'var(--on-accent)':'var(--ink)'}">${i}</text></g>`});
    $('#e6-svg').innerHTML=`<svg viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="Graph traversal">${e}${nd}</svg>`;
    $('#e6-dn').textContent=alg=='bfs'?'Queue (front → rear)':'Stack (top on the left)';
    const ds=alg=='dfs'?[...f.ds].reverse():f.ds;
    $('#e6-ds').innerHTML=ds.length?ds.map(v=>`<div class="nd"><div class="box"><span style="min-width:36px">${v}</span></div></div><span style="width:6px"></span>`).join(''):'<span class="null">empty</span>';
    $('#e6-ord').textContent=f.order.length?f.order.join(' → '):'—';
    say($('#e6-msg'),`Step ${fi+1}/${frames.length}: ${f.note}`,fi==frames.length-1?'ok':'info');
  }
  $('#e6-s').onchange=e=>{start=+e.target.value;build()};
  $('#e6-step').onclick=()=>{if(fi<frames.length-1){fi++;paint()}};
  $('#e6-prev').onclick=()=>{if(fi>0){fi--;paint()}};
  $('#e6-all').onclick=()=>{fi=frames.length-1;paint()};
  $('#e6-rs').onclick=()=>build();
  $('#e6-play').onclick=async()=>{if(playing){playing=false;return}playing=true;$('#e6-play').textContent='Pause';if(fi>=frames.length-1)fi=0;
    while(playing&&fi<frames.length-1){fi++;paint();await sleep(800)}playing=false;$('#e6-play').textContent='Play'};
  fillStart();build();
};
