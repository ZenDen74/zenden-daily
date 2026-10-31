const CH='UC3rDv42RM3kM14iThIjZkyQ',$=id=>document.getElementById(id);let lib=[],off=0;
const dayNum=d=>Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5);
function render(){const d=new Date();d.setDate(d.getDate()+off);const p=lib[((dayNum(d)%lib.length)+lib.length)%lib.length];
 $('date').textContent=d.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'});
 $('theme').textContent=p.theme;$('quote').textContent='“'+p.quote+'”';$('qcite').textContent='— '+p.author+', '+p.source;
 $('verse').textContent='“'+p.verse+'”';$('vcite').textContent='— '+p.ref;$('refl').textContent=p.reflection;}
fetch('library.json').then(r=>r.json()).then(j=>{lib=j;render()});
$('prev').onclick=()=>{off--;render()};$('next').onclick=()=>{off++;render()};$('today').onclick=()=>{off=0;render()};
$('share').onclick=()=>{const t=$('quote').textContent+' '+$('qcite').textContent+'\n'+$('verse').textContent+' '+$('vcite').textContent+'\n'+location.href;navigator.share?navigator.share({title:'ZenDen Daily',text:t}).catch(()=>{}):navigator.clipboard.writeText(t).then(()=>alert('Copied!'))};
const dec=s=>{const t=document.createElement('textarea');t.innerHTML=s;return t.value};
function parseRss(x){return[...x.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(m=>({id:m[1].match(/<yt:videoId>(.*?)</)[1],title:dec(m[1].match(/<title>(.*?)</)[1])}))}
function showVids(v){if(!v||!v.length)return false;$('vids').innerHTML='';v.slice(0,12).forEach(x=>{const a=document.createElement('a');a.href='https://www.youtube.com/watch?v='+x.id;a.target='_blank';a.rel='noopener';
 const i=document.createElement('img');i.loading='lazy';i.alt='';i.src='https://i.ytimg.com/vi/'+x.id+'/mqdefault.jpg';a.append(i,document.createTextNode(dec(x.title)));$('vids').append(a)});return true}
const RSS='https://www.youtube.com/feeds/videos.xml?channel_id='+CH;
const PROXIES=[u=>'https://api.allorigins.win/raw?url='+encodeURIComponent(u),u=>'https://corsproxy.io/?url='+encodeURIComponent(u),u=>'https://api.codetabs.com/v1/proxy?quest='+encodeURIComponent(u)];
async function loadVids(){
 // 1) bundled/auto-built videos.json (instant + offline)
 try{const j=await (await fetch('videos.json',{cache:'no-cache'})).json();showVids(j.videos)}catch(e){}
 // 2) live RSS through free CORS proxies (newest uploads, no server needed)
 for(const p of PROXIES){try{const r=await fetch(p(RSS));if(r.ok){const v=parseRss(await r.text());if(showVids(v)){localStorage.vids=JSON.stringify(v);return}}}catch(e){}}
 // 3) last good live result, else embedded uploads playlist (always current)
 if(localStorage.vids&&showVids(JSON.parse(localStorage.vids)))return;
 if(!$('vids').children.length)$('vids').innerHTML='<iframe style="width:100%;aspect-ratio:16/9;border:0;border-radius:12px;grid-column:1/-1" src="https://www.youtube.com/embed/videoseries?list=UU'+CH.slice(2)+'" allowfullscreen></iframe>';}
loadVids();
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
let dp;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;$('installBtn').hidden=false});
$('installBtn').onclick=()=>{dp&&dp.prompt()};
if(matchMedia('(display-mode: standalone)').matches||navigator.standalone)$('install').hidden=true;
