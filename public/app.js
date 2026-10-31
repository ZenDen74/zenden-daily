const CH='UC3rDv42RM3kM14iThIjZkyQ',$=id=>document.getElementById(id),LS=localStorage;let lib=[],off=0,cur=0;
const dayNum=d=>Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5);
const favs=()=>JSON.parse(LS.favs||'[]');
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1800)}
// theme + text size
function applyPrefs(){document.documentElement.dataset.theme=LS.theme||'auto';document.documentElement.style.setProperty('--fs',LS.fs||1);
 document.querySelectorAll('[data-th]').forEach(b=>b.classList.toggle('on',b.dataset.th===(LS.theme||'auto')));document.querySelectorAll('[data-fs]').forEach(b=>b.classList.toggle('on',b.dataset.fs===(LS.fs||'1')))}
applyPrefs();document.querySelectorAll('[data-th]').forEach(b=>b.onclick=()=>{LS.theme=b.dataset.th;applyPrefs()});
document.querySelectorAll('[data-fs]').forEach(b=>b.onclick=()=>{LS.fs=b.dataset.fs;applyPrefs()});
$('themeBtn').onclick=()=>{const dark=document.documentElement.dataset.theme==='dark'||(LS.theme!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);LS.theme=dark?'light':'dark';applyPrefs()};
// streak
(function(){const t=dayNum(new Date());const l=+LS.last||0;LS.streak=(t===l)?(+LS.streak||1):(t-l===1?(+LS.streak||0)+1:1);LS.last=t;const s=+LS.streak;$('streak').textContent=s>1?'🔥 '+s+' days':''})();
// daily card
function render(dx){const d=new Date();d.setDate(d.getDate()+off);cur=((dayNum(d)%lib.length)+lib.length)%lib.length;const p=lib[cur];
 const go=()=>{$('date').textContent=off===0?'Today · '+d.toLocaleDateString(undefined,{month:'long',day:'numeric'}):d.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});
 $('theme').textContent=p.theme;$('quote').textContent='“'+p.quote+'”';$('qcite').innerHTML='— <b>'+p.author+'</b>, '+p.source;
 $('verse').textContent='“'+p.verse+'”';$('vcite').innerHTML='— <b>'+p.ref.replace(' (KJV)','')+'</b>, KJV';$('refl').textContent=p.reflection;
 const f=favs().includes(cur);$('fav').setAttribute('aria-pressed',f);$('fav').innerHTML=(f?'<span aria-hidden="true">♥</span> Saved':'<span aria-hidden="true">♡</span> Save');$('today').hidden=off===0;$('card').classList.remove('swap')};
 if(dx&&!matchMedia('(prefers-reduced-motion: reduce)').matches){$('card').style.setProperty('--dx',dx+'px');$('card').classList.add('swap');setTimeout(go,180)}else go()}
const step=n=>{off+=n;render(n*-30)};
$('prev').onclick=()=>step(-1);$('next').onclick=()=>step(1);$('today').onclick=()=>{off=0;render()};
let sx=null;$('card').addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});$('card').addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>60)step(dx<0?1:-1);sx=null});
addEventListener('keydown',e=>{if(!$('v-today').classList.contains('active'))return;if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});
let lastTap=0;$('card').addEventListener('click',e=>{if(e.target.closest('button'))return;const n=Date.now();if(n-lastTap<300)toggleFav();lastTap=n});
function toggleFav(){let f=favs();f=f.includes(cur)?f.filter(x=>x!==cur):[cur,...f];LS.favs=JSON.stringify(f);render();renderSaved();toast(f.includes(cur)?'Saved to favorites':'Removed')}
$('fav').onclick=toggleFav;
$('share').onclick=()=>{const p=lib[cur];const t=`“${p.quote}” — ${p.author}\n\n“${p.verse}” — ${p.ref}\n\nZenDen Daily: ${location.href.split('#')[0]}`;
 navigator.share?navigator.share({title:'ZenDen Daily',text:t}).catch(()=>{}):navigator.clipboard.writeText(t).then(()=>toast('Copied to clipboard'))};
function renderSaved(){const f=favs();$('savedEmpty').hidden=f.length>0;$('savedList').innerHTML='';f.forEach(i=>{const p=lib[i];if(!p)return;const b=document.createElement('button');b.className='saved';
 b.innerHTML='<small></small><q></q><small></small>';b.children[0].textContent=p.theme;b.children[1].textContent=p.quote;b.children[2].textContent='— '+p.author+' · '+p.ref;
 b.onclick=()=>{off+=i-cur;render();show('today')};$('savedList').append(b)})}
fetch('library.json').then(r=>r.json()).then(j=>{lib=j;render();renderSaved()});
// tabs
function show(v){document.querySelectorAll('.view').forEach(s=>s.classList.toggle('active',s.id==='v-'+v));document.querySelectorAll('.tabs button').forEach(b=>{const on=b.dataset.v===v;b.classList.toggle('on',on);on?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current')});scrollTo(0,0)}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>show(b.dataset.v));
// videos (self-updating)
const dec=s=>{const t=document.createElement('textarea');t.innerHTML=s;return t.value};
function parseRss(x){return[...x.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(m=>({id:m[1].match(/<yt:videoId>(.*?)</)[1],title:dec(m[1].match(/<title>(.*?)</)[1])}))}
function showVids(v){if(!v||!v.length)return false;$('vids').innerHTML='';v.slice(0,12).forEach(x=>{const a=document.createElement('a');a.href='https://www.youtube.com/watch?v='+x.id;a.target='_blank';a.rel='noopener';
 const i=document.createElement('img');i.loading='lazy';i.alt='';i.src='https://i.ytimg.com/vi/'+x.id+'/mqdefault.jpg';a.append(i,document.createTextNode(dec(x.title)));$('vids').append(a)});
 const l=$('latest'),x=v[0];l.href='https://www.youtube.com/watch?v='+x.id;l.innerHTML='<img alt="" src="https://i.ytimg.com/vi/'+x.id+'/mqdefault.jpg"><div><small>Latest on ZenDen</small><span></span></div>';l.querySelector('span').textContent=dec(x.title);l.hidden=false;return true}
const RSS='https://www.youtube.com/feeds/videos.xml?channel_id='+CH;
const PROXIES=[u=>'https://api.allorigins.win/raw?url='+encodeURIComponent(u),u=>'https://corsproxy.io/?url='+encodeURIComponent(u),u=>'https://api.codetabs.com/v1/proxy?quest='+encodeURIComponent(u)];
async function loadVids(){let ok=false;
 try{const j=await (await fetch('videos.json',{cache:'no-cache'})).json();ok=showVids(j.videos)}catch(e){}
 if(!ok&&LS.vids)ok=showVids(JSON.parse(LS.vids));
 for(const p of PROXIES){try{const r=await fetch(p(RSS));if(r.ok){const v=parseRss(await r.text());if(showVids(v)){LS.vids=JSON.stringify(v);return}}}catch(e){}}
 if(!ok)$('vids').innerHTML='<iframe title="ZenDen uploads" style="width:100%;aspect-ratio:16/9;border:0;border-radius:14px;grid-column:1/-1" src="https://www.youtube.com/embed/videoseries?list=UU'+CH.slice(2)+'" allowfullscreen></iframe>'}
loadVids();
// PWA
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
let dp;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;$('installBtn').hidden=false});$('installBtn').onclick=()=>dp&&dp.prompt();
if(matchMedia('(display-mode: standalone)').matches||navigator.standalone)$('install').hidden=true;
