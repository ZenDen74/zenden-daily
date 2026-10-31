// Node 18+: writes public/videos.json from the channel RSS (used by optional GitHub Action)
const fs=require('fs');
fetch('https://www.youtube.com/feeds/videos.xml?channel_id=UC3rDv42RM3kM14iThIjZkyQ').then(r=>r.text()).then(x=>{
 const v=[...x.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(m=>({id:m[1].match(/<yt:videoId>(.*?)</)[1],title:m[1].match(/<title>(.*?)</)[1],published:m[1].match(/<published>(.*?)</)[1]}));
 if(v.length){fs.writeFileSync(__dirname+'/public/videos.json',JSON.stringify({updated:new Date().toISOString(),videos:v},null,1));console.log(v.length)}});
