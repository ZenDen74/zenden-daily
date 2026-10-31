const fs=require('fs');
const kjv=JSON.parse(fs.readFileSync('kjv.json','utf8').replace(/^\uFEFF/,''));
const names={};kjv.forEach(b=>names[b.abbrev]=b.name);
function verse(ab,c,v,v2){const b=kjv.find(x=>x.abbrev===ab);let t=[];for(let i=v;i<=(v2||v);i++)t.push(b.chapters[c-1][i-1].replace(/\{[^}]*\}/g,'').replace(/\s+/g,' ').trim());return{text:t.join(' '),ref:`${b.name} ${c}:${v}${v2?'-'+v2:''}`}}
function body(f,a,b){let s=fs.readFileSync(f,'utf8').split('\n').slice(a,b).join(' ');return s.replace(/\r/g,'').replace(/\[[^\]]*\]/g,'').replace(/\s+/g,' ')}
function sents(f,a,b){const t=body(f,a,b).replace(/\b[XVIL]{1,6} (?=[A-Z])/g,'');const out=[];const re=/(?<=[.!?] )[A-Z][^.!?]{50,200}[.!?](?= [A-Z“]|$)/g;let m;while(m=re.exec(t))out.push(m[0].trim());
 const bad=/[0-9_*“”"‘]|’[A-Z ]|CHAPTER|Footnote|Gutenberg|Cato|Caesar|Pompey|Augustus|Fronto|Antoninus|Verus|Lucilius|Serenus|Paulinus|Gallio|Epicur|Socrates|Athen|Rom|school|divination|bath|supper|diviner|physician|consul|praetor|you ask|you say|I ask|I beg|my mother|my father|of my |I was|I learned|I have learned|me |^(And|But|For|Or|This|That|These|Those|It|He|She|They|His|Her|Then|So|Now|Yet|Secondly|Thirdly|Moreover|Him|Of|To|Which|Where|What|Why|How|Can|Do you|Is|Are)\b/;
 const good=/\b(remember|let|must|do not|never|always|whatsoever|whoever|be |live|within|power|mind|soul|happy|good)\b/i;
 const EX=["Women", "Who’er", "If so be that the souls", "Be not angry neither with him whose", "Doth it like", "Neither can he", "No operation", "Soldiers divide", "You will say", "Will any one care", "Learn, then, since", "I am sure", "Riches encourage", "Therefore, perceiving", "In this are implied", "Add to this", "Will either passengers", "Doth anything by way", "As for those parts", "If to understand", "If reason is general", "On this account the husbandman", "Yes, indeed", "Busy men", "Look upon the universe", "Do not, then, make", "Not in syllogisms", "Think not of these", "Just as much reason", "In eating", "Hence arises", "The mind cannot use", "Consider with thyself how man", "Another how he"];return out.filter(s=>!bad.test(s)&&!EX.some(e=>s.startsWith(e))).map(s=>({s,score:(good.test(s)?2:0)+(s.length<170?1:0)})).sort((x,y)=>y.score-x.score).map(x=>x.s)}
const src={
 'Marcus Aurelius':{s:sents('med.txt',580,5736),cite:'Meditations (tr. Meric Casaubon)'},
 'Epictetus':{s:sents('epi.txt',405,1405),cite:'The Enchiridion (tr. T. W. Higginson)'},
 'Seneca':{s:sents('sen.txt',6452,10055),cite:'Minor Dialogues (tr. Aubrey Stewart)'}};
const themes=[
['Peace of Mind',/\b(tranquil|tranquillity|undisturbed|peace|calm)\b/i,[['fp',4,6,7],['jo',14,27],['is',26,3],['mt',11,28,29],['sl',46,10]],'Calm is not the absence of trouble; it is a mind anchored in what cannot be shaken. Today, breathe slowly and let your peace rest on something deeper than circumstance.'],
['What Is in Our Control',/\b(in our power|within our power|not in our power|in thy power|in your power)\b/i,[['mt',6,34],['pv',16,9],['tg',4,14,15],['pv',3,5,6],['1pe',5,7]],'Sort today into two piles: what is yours to do, and what is not. Do the first with full heart; hand the second over in trust.'],
['Anger and Patience',/\b(anger|angry|wrath|rage|patien)/i,[['tg',1,19,20],['pv',15,1],['ef',4,26],['pv',16,32],['ec',7,9]],'Anger promises strength but delivers chaos. Pause before you answer anyone today, and choose the gentle word.'],
['Death and Time',/\b(death|die|dies|mortal)\b/i,[['sl',90,12],['tg',4,14],['ec',3,1,2],['sl',39,4],['2co',4,18]],'Remembering that our days are numbered is not gloom; it is clarity. Spend today on what will still matter at its end.'],
['The Present Moment',/\b(present|to-day|today|this day)\b/i,[['mt',6,34],['sl',118,24],['2co',6,2],['lm',3,22,23],['hb',3,13]],'The past is gone and the future is not given. All you hold is this hour. Live it fully and kindly.'],
['Virtue and Goodness',/\b(virtue|virtuous|good man|righteous|just)\b/i,[['mq',6,8],['gl',6,9],['fp',4,8],['pv',21,21],['rm',12,21]],'Goodness is not a feeling to wait for but a practice to begin. Do one quietly good thing today that no one will see.'],
['Desire and Contentment',/\b(desire|content|contented|wealth|riches)\b/i,[['fp',4,11,12],['hb',13,5],['1tm',6,6,8],['pv',30,8,9],['ec',5,10]],'Contentment is wealth no one can steal. Notice today what you already have, and let gratitude quiet the craving for more.'],
['Others and Kindness',/\b(neighbour|kindness|kind|benevolen|others|men)\b/i,[['cl',3,12,13],['ef',4,32],['rm',12,18],['lc',6,31],['gl',6,2]],'Everyone you meet carries a burden you cannot see. Meet them with patience, forgive quickly, and serve where you can.'],
['Adversity and Endurance',/\b(misfortune|hardship|pain|suffer|endure|adversity)\b/i,[['tg',1,2,4],['rm',5,3,5],['2co',4,8,9],['is',40,31],['rm',8,28]],'Obstacles are not detours from the path; often they are the path. Meet today\'s difficulty as training for the soul.'],
['Humility and Opinion',/\b(opinion|praise|fame|glory|vain|reputation)\b/i,[['pv',16,18],['fp',2,3],['pv',27,2],['mq',6,8],['tg',4,10]],'Applause fades and opinions change. Seek the quiet approval of a clear conscience rather than the crowd.'],
['The Mind and Thoughts',/\b(mind|thoughts|judgement|reason)\b/i,[['rm',12,2],['pv',4,23],['fp',4,8],['2co',10,5],['pv',23,7]],'Your life takes the color of your thoughts. Guard your mind today; let in what is true, noble and good.'],
['Nature and Providence',/\b(nature|universe|providence|gods|god)\b/i,[['sl',19,1],['mt',6,26],['rm',8,28],['ec',3,11],['jó',12,7,10]],'The same order that turns the seasons holds your life. Step outside today and let creation remind you that you are cared for.'],
];
const used=new Set();const pairs=[];const cnt={};const authors=Object.keys(src);
for(let round=0;round<9;round++)for(const [name,re,vs,refl] of themes)for(const a of authors){
 const q=src[a].s.find(s=>re.test(s)&&!used.has(s));if(!q||pairs.length>=144)continue;used.add(q);
 const v=vs[(pairs.filter(p=>p.theme===name).length)%vs.length];const ve=verse(...v);
 pairs.push({theme:name,quote:q,author:a,source:src[a].cite,verse:ve.text,ref:ve.ref+' (KJV)',reflection:refl});}
// interleave themes
pairs.sort((x,y)=>(themes.findIndex(t=>t[0]===x.theme)*7+pairs.indexOf(x)*13)%41-(themes.findIndex(t=>t[0]===y.theme)*7+pairs.indexOf(y)*13)%41);
fs.writeFileSync('public/library.json',JSON.stringify(pairs,null,1));console.log(pairs.length);console.log(pairs.slice(0,4));
