/* Labs for experiments 7-8 (sorting and searching, hash table). */

/* ===================================================== E7 */
function recordSort(alg,arr){
  const a=[...arr],n=a.length,F=[];let c=0,s=0;const done=new Set();
  const snap=(cmp=[],swp=[],piv=-1)=>F.push({a:[...a],cmp,swp,piv,done:[...done],c,s});
  const swap=(i,j)=>{[a[i],a[j]]=[a[j],a[i]];s++;snap([],[i,j])};
  snap();
  if(alg=='bubble'){
    for(let i=0;i<n-1;i++){let sw=false;
      for(let j=0;j<n-i-1;j++){c++;snap([j,j+1]);if(a[j]>a[j+1]){swap(j,j+1);sw=true}}
      done.add(n-1-i);snap();if(!sw)break}
  }else if(alg=='selection'){
    for(let i=0;i<n-1;i++){let m=i;
      for(let j=i+1;j<n;j++){c++;snap([m,j]);if(a[j]<a[m])m=j}
      if(m!==i)swap(i,m);done.add(i);snap()}
  }else if(alg=='insertion'){
    done.add(0);
    for(let i=1;i<n;i++){const key=a[i];let j=i-1;
      while(j>=0){c++;snap([j,j+1]);if(a[j]>key){a[j+1]=a[j];s++;snap([],[j,j+1]);j--}else break}
      a[j+1]=key;s++;for(let k=0;k<=i;k++)done.add(k);snap([],[j+1])}
  }else if(alg=='merge'){
    const ms=(lo,hi)=>{if(lo>=hi)return;const mid=(lo+hi)>>1;ms(lo,mid);ms(mid+1,hi);
      const t=[];let i=lo,j=mid+1;
      while(i<=mid&&j<=hi){c++;snap([i,j]);t.push(a[i]<=a[j]?a[i++]:a[j++])}
      while(i<=mid)t.push(a[i++]);while(j<=hi)t.push(a[j++]);
      for(let k=lo;k<=hi;k++){a[k]=t[k-lo];s++;snap([],[k])}};
    ms(0,n-1);
  }else{
    const qs=(lo,hi)=>{if(lo>hi)return;if(lo===hi){done.add(lo);snap();return}
      const p=a[hi];let i=lo-1;
      for(let j=lo;j<hi;j++){c++;snap([j,hi],[],hi);if(a[j]<p){i++;if(i!==j)swap(i,j)}}
      if(i+1!==hi)swap(i+1,hi);done.add(i+1);snap([],[],i+1);qs(lo,i);qs(i+2,hi)};
    qs(0,n-1);
  }
  for(let k=0;k<n;k++)done.add(k);snap();
  return F}

LABS.e7=function(root){
  const INFO={bubble:['Bubble sort','O(n)','O(n²)','O(n²)','O(1)','Yes'],selection:['Selection sort','O(n²)','O(n²)','O(n²)','O(1)','No'],insertion:['Insertion sort','O(n)','O(n²)','O(n²)','O(1)','Yes'],merge:['Merge sort','O(n log n)','O(n log n)','O(n log n)','O(n)','Yes'],quick:['Quick sort','O(n log n)','O(n log n)','O(n²)','O(log n)','No']};
  let tab='sort',alg='bubble',n=20,base=[],fr=[],fi=0,playing=false,spd=3;
  const shuffle=()=>{base=Array.from({length:n},(_,i)=>5+Math.floor(Math.random()*95));rebuild()};
  root.innerHTML=`<div class="ctl"><div id="e7-tab"></div></div><div id="e7-body"></div>`;
  seg($('#e7-tab'),[['sort','Sorting'],['search','Searching']],'sort',v=>{playing=false;tab=v;v=='sort'?drawSort():drawSearch()});
  function drawSort(){
    $('#e7-body').innerHTML=`<div class="ctl"><div id="e7-alg"></div></div>
    <div class="ctl"><label class="fld" for="e7-n">elements <b id="e7-nv" style="color:var(--ink)">${n}</b><input id="e7-n" type="range" min="6" max="40" value="${n}" style="width:130px"></label><label class="fld" for="e7-sp">speed<input id="e7-sp" type="range" min="1" max="5" value="${spd}" style="width:110px"></label>${btn('e7-sh','Shuffle','sm')}${btn('e7-play','Play','acc')}${btn('e7-step','Step ▶','sm')}${btn('e7-end','Finish','sm')}${btn('e7-rs','Restart','sm')}</div>
    <div class="stage"><div class="bars" id="e7-bars"></div></div>
    <div class="barlg"><span><i style="background:var(--link)"></i>unsorted</span><span><i style="background:var(--hi)"></i>comparing</span><span><i style="background:var(--danger)"></i>swap / write</span><span><i style="background:var(--ink)"></i>pivot</span><span><i style="background:var(--accent)"></i>in final place</span></div>
    <div class="stats" id="e7-st"></div><div class="scroll"><table class="tb" id="e7-info"></table></div>`;
    seg($('#e7-alg'),Object.entries(INFO).map(([k,v])=>[k,v[0].replace(' sort','')]),alg,v=>{alg=v;rebuild()});
    $('#e7-n').oninput=e=>{n=+e.target.value;$('#e7-nv').textContent=n;shuffle()};
    $('#e7-sp').oninput=e=>spd=+e.target.value;
    $('#e7-sh').onclick=shuffle;$('#e7-rs').onclick=rebuild;
    $('#e7-step').onclick=()=>{if(fi<fr.length-1){fi++;paint()}};
    $('#e7-end').onclick=()=>{fi=fr.length-1;paint()};
    $('#e7-play').onclick=async()=>{if(playing){playing=false;return}playing=true;$('#e7-play').textContent='Pause';if(fi>=fr.length-1)fi=0;
      const per=[1,2,4,8,16][spd-1];
      while(playing&&fi<fr.length-1){fi=Math.min(fr.length-1,fi+per);paint();await sleep(45)}
      playing=false;if($('#e7-play'))$('#e7-play').textContent='Play'};
    if(!base.length)shuffle();else rebuild();
  }
  function rebuild(){playing=false;fr=recordSort(alg,base);fi=0;if(tab=='sort'){if($('#e7-play'))$('#e7-play').textContent='Play';paint()}}
  function paint(){
    const f=fr[fi],mx=Math.max(...base);
    $('#e7-bars').innerHTML=f.a.map((v,i)=>`<i class="${f.done.includes(i)?'srt':''} ${f.piv===i?'piv':''} ${f.cmp.includes(i)?'cmp':''} ${f.swp.includes(i)?'swp':''}" style="height:${v/mx*100}%" title="${v}"></i>`).join('');
    $('#e7-st').innerHTML=`<div class="stat">comparisons<b>${f.c}</b></div><div class="stat">swaps / writes<b>${f.s}</b></div><div class="stat">frame<b>${fi+1}/${fr.length}</b></div><div class="stat">state<b>${fi==fr.length-1?'sorted':'running'}</b></div>`;
    const I=INFO[alg];
    $('#e7-info').innerHTML=`<thead><tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Space</th><th>Stable</th></tr></thead><tbody><tr>${I.map((x,i)=>`<td class="${i?'m':''}">${x}</td>`).join('')}</tr></tbody>`;
  }

  /* ---- searching ---- */
  let sa=[],sf=[],si=0,salg='linear',splay=false;
  function newArr(){const s=new Set();while(s.size<15)s.add(3+Math.floor(Math.random()*96));sa=[...s].sort((x,y)=>x-y)}
  function drawSearch(){
    if(!sa.length)newArr();
    $('#e7-body').innerHTML=`<div class="ctl"><div id="e7-salg"></div>${fld('e7-key','search key',sa[9])}${btn('e7-go','Start','acc')}${btn('e7-ss','Step ▶','sm')}${btn('e7-sp2','Play','sm')}${btn('e7-new','New array','sm')}</div>
    <div class="stage"><div class="cells" id="e7-cells"></div></div><div class="stats" id="e7-sst"></div><div class="msg" id="e7-smsg"></div>
    <div class="scroll"><table class="tb"><thead><tr><th>Search</th><th>Needs sorted data</th><th>Best</th><th>Worst</th><th>For 15 elements</th></tr></thead><tbody><tr><td>Linear</td><td>No</td><td class="m">O(1)</td><td class="m">O(n)</td><td class="m">up to 15 comparisons</td></tr><tr><td>Binary</td><td>Yes</td><td class="m">O(1)</td><td class="m">O(log n)</td><td class="m">at most 4 comparisons</td></tr></tbody></table></div>`;
    seg($('#e7-salg'),[['linear','Linear search'],['binary','Binary search']],salg,v=>{salg=v;start()});
    $('#e7-go').onclick=start;$('#e7-new').onclick=()=>{newArr();$('#e7-key').value=sa[Math.floor(Math.random()*15)];start()};
    $('#e7-ss').onclick=()=>{if(si<sf.length-1){si++;sp()}};
    $('#e7-sp2').onclick=async()=>{if(splay){splay=false;return}splay=true;$('#e7-sp2').textContent='Pause';if(si>=sf.length-1)si=0;
      while(splay&&si<sf.length-1){si++;sp();await sleep(850)}splay=false;if($('#e7-sp2'))$('#e7-sp2').textContent='Play'};
    start();
  }
  function start(){
    splay=false;const key=parseInt($('#e7-key').value,10);if($('#e7-sp2'))$('#e7-sp2').textContent='Play';
    sf=[];let c=0;
    if(isNaN(key)){sf=[{note:'Enter a number to search for',lo:-1,hi:-1,mid:-1,c:0,end:true,found:-1}]}
    else if(salg=='linear'){
      let found=-1;for(let i=0;i<sa.length;i++){c++;const eq=sa[i]===key;sf.push({note:`Compare a[${i}] = ${sa[i]} with ${key}: ${eq?'match':'not equal, move on'}`,cur:i,c,lo:0,hi:sa.length-1,mid:-1,found:eq?i:-1,end:eq});if(eq){found=i;break}}
      if(found<0)sf.push({note:`Reached the end: ${key} is not in the array`,c,lo:0,hi:sa.length-1,mid:-1,found:-1,end:true,nf:true})}
    else{
      let lo=0,hi=sa.length-1,found=-1;sf.push({note:`low = 0, high = ${hi}`,lo,hi,mid:-1,c:0,found:-1});
      while(lo<=hi){const mid=(lo+hi)>>1;c++;
        if(sa[mid]===key){sf.push({note:`mid = ${mid}: a[${mid}] = ${sa[mid]} equals ${key}. Found.`,lo,hi,mid,c,found:mid,end:true});found=mid;break}
        if(key<sa[mid]){sf.push({note:`mid = ${mid}: a[${mid}] = ${sa[mid]} is larger than ${key} → high = ${mid-1}`,lo,hi,mid,c,found:-1});hi=mid-1}
        else{sf.push({note:`mid = ${mid}: a[${mid}] = ${sa[mid]} is smaller than ${key} → low = ${mid+1}`,lo,hi,mid,c,found:-1});lo=mid+1}}
      if(found<0)sf.push({note:`low (${lo}) > high (${hi}): ${key} is not in the array`,lo,hi,mid:-1,c,found:-1,end:true,nf:true})}
    si=0;sp()}
  function sp(){
    const f=sf[si],bin=salg=='binary';
    $('#e7-cells').innerHTML=sa.map((v,i)=>{
      const out=bin&&f.lo>=0&&(i<f.lo||i>f.hi),isf=f.found===i,cur=!bin&&f.cur===i||bin&&f.mid===i;
      const mk=bin?(i==f.lo?'<span>L</span>':'')+(i==f.mid?'<span class="r">M</span>':'')+(i==f.hi?'<span>H</span>':''):'';
      return`<div class="cell ${out?'dead':''} ${isf?'ok':cur?'hi':''}" style="width:52px"><div class="mk">${mk}</div><div class="ix">${i}</div><div class="bx">${v}</div></div>`}).join('');
    $('#e7-sst').innerHTML=`<div class="stat">comparisons<b>${f.c||0}</b></div><div class="stat">step<b>${si+1}/${sf.length}</b></div><div class="stat">result<b>${f.found>=0?'found @'+f.found:f.nf?'not found':'…'}</b></div>`;
    say($('#e7-smsg'),f.note,f.found>=0?'ok':f.nf?'err':'info');
  }
  drawSort();
};

/* ===================================================== E8 */
LABS.e8=function(root){
  let m=7,meth='chain',busy=false,collisions=0,chain,slots;
  const reset=()=>{chain=Array.from({length:m},()=>[]);slots=Array(m).fill(null);collisions=0};reset();
  root.innerHTML=`<div class="ctl"><div id="e8-meth"></div><div id="e8-m"></div></div>
  <div class="ctl">${fld('e8-k','key',17)}${btn('e8-ins','Insert','acc')}${btn('e8-sea','Search')}${btn('e8-del','Delete')}${btn('e8-smp','Insert sample keys','sm')}${btn('e8-rnd','Random key','sm')}${btn('e8-clr','Clear','sm')}</div>
  <div class="labgrid"><div><div class="stage" id="e8-tab"></div><div class="stats" id="e8-st" style="margin-top:10px"></div></div><div><div class="msg" id="e8-msg"></div><div class="log" id="e8-log" style="margin-top:10px"></div></div></div>`;
  seg($('#e8-meth'),[['chain','Chaining'],['lin','Linear probing'],['quad','Quadratic probing']],meth,v=>{meth=v;reset();paint();say($('#e8-msg'),{chain:'Each slot holds a linked list of the keys that hash to it.',lin:'Probe sequence: (h + i) mod m.',quad:'Probe sequence: (h + i²) mod m.'}[v],'info');lines([])});
  seg($('#e8-m'),[['7','m = 7'],['11','m = 11']],'7',v=>{m=+v;reset();paint();lines([])});
  const M=(t,k)=>say($('#e8-msg'),t,k);let ll=[];const lines=l=>{ll=l;logTo($('#e8-log'),ll,ll.length-1)};const add=t=>{ll.push(t);logTo($('#e8-log'),ll,ll.length-1)};
  const h=k=>((k%m)+m)%m;
  function paint(mark={}){
    let html='';
    for(let i=0;i<m;i++){
      if(meth=='chain'){
        html+=`<div class="hrow"><span class="hix">[${i}]</span><span class="hslot ${chain[i].length?'':'empty'} ${mark[i]||''}">${chain[i].length?'•':'NULL'}</span>`+chain[i].map(k=>`<span class="harrow">→</span><span class="hslot ${mark[i+':'+k]||''}">${k}</span>`).join('')+(chain[i].length?`<span class="harrow">→</span><span class="null" style="margin:0;padding:6px 8px">NULL</span>`:'')+`</div>`}
      else{const v=slots[i];html+=`<div class="hrow"><span class="hix">[${i}]</span><span class="hslot ${v===null?'empty':v==='D'?'tomb':''} ${mark[i]||''}" style="min-width:90px">${v===null?'empty':v==='D'?'deleted':v}</span></div>`}}
    $('#e8-tab').innerHTML=html;
    const n=meth=='chain'?chain.reduce((s,c)=>s+c.length,0):slots.filter(v=>v!==null&&v!=='D').length;
    $('#e8-st').innerHTML=`<div class="stat">keys n<b>${n}</b></div><div class="stat">load factor α<b>${(n/m).toFixed(2)}</b></div><div class="stat">collisions<b>${collisions}</b></div><div class="stat">hash<b>k mod ${m}</b></div>`}
  const key=()=>{const k=parseInt($('#e8-k').value,10);return isNaN(k)?null:k};
  const lock=fn=>async()=>{if(busy)return;busy=true;try{await fn()}finally{busy=false}};
  const seq=(k,i)=>(h(k)+(meth=='lin'?i:i*i))%m;
  async function probeFind(k,forInsert){
    for(let i=0;i<m;i++){const idx=seq(k,i);paint({[idx]:'hi'});await sleep(520);
      const v=slots[idx];
      if(forInsert){if(v===null||v==='D'){return{idx,i}}add(`slot ${idx} holds ${v}: collision`);collisions++;paint({[idx]:'bad'});await sleep(350);add(`probe ${i+1}: (${h(k)} + ${meth=='lin'?(i+1):(i+1)+'²'}) mod ${m} = ${seq(k,i+1)}`)}
      else{if(v===null){return{idx:-1,i,end:idx}}if(v===k)return{idx,i};if(v!=='D')add(`slot ${idx} holds ${v}, not ${k}: keep probing`);else add(`slot ${idx} is deleted (tombstone): keep probing`)}}
    return{idx:-1,i:m}}
  $('#e8-ins').onclick=lock(async()=>{const k=key();if(k==null){M('Enter an integer key','err');return}lines([`h(${k}) = ${k} mod ${m} = ${h(k)}`]);
    if(meth=='chain'){
      if(chain[h(k)].includes(k)){M(`${k} is already present`,'err');return}
      paint({[h(k)]:'hi'});await sleep(450);
      if(chain[h(k)].length){collisions++;add(`slot ${h(k)} already has ${chain[h(k)].length} key(s): collision, chain it`)}
      chain[h(k)].unshift(k);paint({[h(k)+':'+k]:'ok'});M(`Inserted ${k} at the head of the chain in slot ${h(k)}.`,'ok');return}
    if(slots.includes(k)){M(`${k} is already present`,'err');return}
    const r=await probeFind(k,true);
    if(r.idx<0){M(`Could not place ${k}: no free slot on the probe sequence${meth=='quad'?' (quadratic probing can miss free slots when the table is more than half full)':''}.`,'err');paint();return}
    slots[r.idx]=k;paint({[r.idx]:'ok'});M(`Inserted ${k} in slot ${r.idx} after ${r.i} collision(s).`,'ok')});
  $('#e8-sea').onclick=lock(async()=>{const k=key();if(k==null){M('Enter an integer key','err');return}lines([`h(${k}) = ${h(k)}`]);
    if(meth=='chain'){const c=chain[h(k)];paint({[h(k)]:'hi'});await sleep(450);
      for(const x of c){paint({[h(k)+':'+x]:'hi'});add(`compare ${x} with ${k}`);await sleep(450);if(x===k){paint({[h(k)+':'+x]:'ok'});M(`${k} found in slot ${h(k)}.`,'ok');return}}
      paint({[h(k)]:'bad'});M(`${k} not found (end of chain in slot ${h(k)}).`,'err');return}
    const r=await probeFind(k,false);
    if(r.idx>=0){paint({[r.idx]:'ok'});M(`${k} found in slot ${r.idx} after ${r.i+1} probe(s).`,'ok')}
    else{paint(r.end!=null?{[r.end]:'bad'}:{});M(`${k} not found: probing stopped at ${r.end!=null?'an empty slot':'the end of the sequence'}.`,'err')}});
  $('#e8-del').onclick=lock(async()=>{const k=key();if(k==null){M('Enter an integer key','err');return}lines([`h(${k}) = ${h(k)}`]);
    if(meth=='chain'){const i=chain[h(k)].indexOf(k);paint({[h(k)]:'hi'});await sleep(450);
      if(i<0){M(`${k} not found.`,'err');return}
      paint({[h(k)+':'+k]:'bad'});await sleep(450);chain[h(k)].splice(i,1);paint();M(`Deleted ${k} from the chain in slot ${h(k)}.`,'ok');return}
    const r=await probeFind(k,false);
    if(r.idx<0){paint();M(`${k} not found.`,'err');return}
    paint({[r.idx]:'bad'});await sleep(450);slots[r.idx]='D';paint();M(`Deleted ${k}. Slot ${r.idx} is marked deleted (tombstone) so other probe sequences stay intact.`,'ok')});
  $('#e8-smp').onclick=lock(async()=>{reset();const ks=m==7?[10,17,24,5,12,31]:[10,21,32,5,16,27];
    ks.forEach(k=>{if(meth=='chain'){if(chain[h(k)].length)collisions++;chain[h(k)].unshift(k)}else{for(let i=0;i<m;i++){const idx=seq(k,i);if(slots[idx]===null){slots[idx]=k;break}collisions++}}});
    paint();lines([`Loaded ${ks.join(', ')}. Many of them hash to the same slot, so you can see collisions being resolved.`]);M('Sample keys inserted.','info')});
  $('#e8-rnd').onclick=()=>{$('#e8-k').value=1+Math.floor(Math.random()*99)};
  $('#e8-clr').onclick=lock(async()=>{reset();paint();lines([]);M('Table cleared.','info')});
  paint();M('Insert 10, 17 and 24: all three hash to slot 3 when m = 7.','info');
};
