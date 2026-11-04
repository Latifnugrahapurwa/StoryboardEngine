const $=id=>document.getElementById(id);
let rows=[];

let seen=0,busy=false,curTab="look";
const TRN={id:"Indonesia",en:"Inggris",es:"Spanyol",fr:"Prancis",de:"Jerman",pt:"Portugis",ja:"Jepang",ko:"Korea",zh:"Mandarin",ar:"Arab"};
function trName(){return TRN[S.trLang||"id"]||S.trLang}
const DEF={theme:"system",accent:"#f0b81f",ui:15,fs:14,density:"normal",side:360,radius:"medium",anim:true,glow:true,fill:true,c3:true,c4:true,c5:true,c6:true,temp:"",maxTok:"",chunk:1800,retry:2,delay:0,lang:"auto",envMin:5,envMax:15,hmax:30,trLang:"id",trAuto:false,trShow:true,view:"table"};
let S=Object.assign({},DEF);
try{const sv=JSON.parse(localStorage.getItem("sb_settings_v1")||"{}");Object.assign(S,sv);if(!("trAuto" in sv)&&sv.trLang)S.trAuto=true}catch(e){}
const mq=matchMedia("(prefers-color-scheme: dark)"),SYNC=[];
function inkFor(x){const n=parseInt(String(x).slice(1),16),r=n>>16,g=n>>8&255,b=n&255;return(0.299*r+0.587*g+0.114*b)>150?"#14161c":"#ffffff"}
function mixHex(a,b,t){const p=x=>[1,3,5].map(i=>parseInt(x.slice(i,i+2),16)),A=p(a),B=p(b);return"#"+A.map((v,i)=>Math.round(v*(1-t)+B[i]*t).toString(16).padStart(2,"0")).join("")}
function setFav(){
  const a=S.accent,b=mixHex(a,"#ff5a3c",.55),ink=inkFor(a);
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#g)"/><g transform="translate(14 14) scale(1.5)" fill="none" stroke="'+ink+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M3 8l3-5h4L7 8M10 8l3-5h4l-3 5M17 8l3-5"/></g></svg>';
  const l=document.getElementById("fav");if(l)l.href="data:image/svg+xml,"+encodeURIComponent(svg);
  const m=document.querySelector('meta[name="theme-color"]');if(m)m.content=a;
}
function trCap(){const c=document.getElementById("trcap");if(c)c.textContent="Bahasa tujuan: "+trName()+" · ubah di Pengaturan"}
function syncSeg(){const a=document.getElementById("vTable"),b=document.getElementById("vScript");if(!a||!b)return;const sc=S.view==="script";a.classList.toggle("on",!sc);b.classList.toggle("on",sc);a.setAttribute("aria-pressed",!sc);b.setAttribute("aria-pressed",sc)}
function setView(v){S.view=v;saveS();syncSeg();render()}
function applyS(){
  const R=document.documentElement,st=R.style;
  R.dataset.eff=S.theme==="system"?(mq.matches?"dark":"light"):S.theme;
  st.setProperty("--acc",S.accent);st.setProperty("--acc-ink",inkFor(S.accent));
  st.setProperty("--ui",S.ui+"px");st.setProperty("--fs",S.fs+"px");
  st.setProperty("--padv",{compact:"3px",normal:"8px",comfy:"14px"}[S.density]||"8px");
  st.setProperty("--side",S.side+"px");st.setProperty("--rad",{sharp:"4px",medium:"12px",round:"20px"}[S.radius]||"12px");
  R.classList.toggle("noanim",!S.anim);R.classList.toggle("noglow",!S.glow);R.classList.toggle("fill",!!S.fill);
  [3,4,5,6].forEach(n=>R.classList.toggle("hc"+n,!S["c"+n]));
  setFav();
  trCap();
  syncSeg();
}
function saveS(){try{localStorage.setItem("sb_settings_v1",JSON.stringify(S))}catch(e){}}
if(mq.addEventListener)mq.addEventListener("change",()=>{if(S.theme==="system")applyS()});
const BYK={};
function bindS(){
  document.querySelectorAll("[data-k]").forEach(el=>{
    const k=el.dataset.k,cb=el.type==="checkbox",nm=el.type==="range"||el.type==="number"||el.dataset.num==="1";
    const o=()=>{const x=document.getElementById("o-"+k);if(x)x.textContent=el.value};
    const set=()=>{if(cb)el.checked=!!S[k];else el.value=S[k];o()};
    SYNC.push(set);(BYK[k]=BYK[k]||[]).push([el,set]);set();
    el.addEventListener("input",()=>{let v=cb?el.checked:el.value;if(nm&&v!=="")v=+v;S[k]=v;saveS();applyS();o();(BYK[k]||[]).forEach(([e2,f])=>{if(e2!==el)f()});if(k==="chunk"||k==="envMin"||k==="envMax")sc()});
  });
}
const SW=["#f0b81f","#4f8cff","#22c55e","#a855f7","#ec4899","#f97316","#14b8a6"];
function markSw(){[...$("swatches").children].forEach(b=>b.classList.toggle("on",b.title.toLowerCase()===String(S.accent).toLowerCase()))}
function buildSw(){
  const box=$("swatches");box.replaceChildren();
  SW.forEach(c=>{const b=h("button","sw");b.type="button";b.style.background=c;b.title=c;b.setAttribute("aria-label","Warna aksen "+c);b.onclick=()=>{S.accent=c;saveS();applyS();$("s-accent-c").value=c;markSw()};box.append(b)});
  $("s-accent-c").value=S.accent;markSw();
}
$("s-accent-c").oninput=e=>{S.accent=e.target.value;saveS();applyS();markSw()};
function syncS(){SYNC.forEach(f=>f());buildSw()}
function pill(){
  const p=$("prov").value,n={gemini:"Gemini",openai:"ChatGPT",claude:"Claude",manual:"Salin-tempel"}[p]||p;
  $("engpill").textContent=p==="manual"?"Engine: Salin-tempel":"Engine: "+n+" · "+($("model").value||"-")+(p==="gemini"&&gsOn()?" · 🔎":"");
}
function sc(){
  const t=$("script").value.trim(),w=t?t.split(/\s+/).length:0,ch=Math.max(400,+S.chunk||1800),n=t?Math.ceil(t.length/ch):0,sp=Math.max(+$("wps").value||2.6,.5);
  $("scount").textContent=w+" kata · ±"+n+" bagian · ±"+(Math.round(w/sp/6)/10)+" menit";
}
const SAMPLE="Hey guys, today we're comparing NordVPN and ExpressVPN. Both apps let you connect to a server in a single click. NordVPN also includes Meshnet, which lets you link your own devices together. ExpressVPN offers Lightway, its own fast and lightweight protocol. We'll put links to everything in the description.";
function loadSample(){$("script").value=SAMPLE;sc();$("status").className="status";$("status").textContent="Contoh skrip dimuat. Tekan Buat footage guide (Ctrl+Enter)."}
function emptyView(){
  if(busy){const w=h("div","skwrap");for(let i=0;i<5;i++){const r=h("div","sk");r.style.animationDelay=i*120+"ms";w.append(r)}return w}
  const d=h("div","empty");
  d.innerHTML='<svg viewBox="0 0 120 80" width="120" height="80" aria-hidden="true"><rect x="8" y="14" width="104" height="52" rx="8" fill="none" stroke="currentColor" stroke-width="3"/><path d="M8 28h104M8 52h104M22 14v14M40 14v14M58 14v14M76 14v14M94 14v14M22 52v14M40 52v14M58 52v14M76 52v14M94 52v14" stroke="currentColor" stroke-width="3"/><path d="M54 33l16 7-16 7z" fill="var(--acc)"/></svg><h2>Mulai dari skrip Anda</h2><p>Tempel skrip final di panel kiri, atur engine di Pengaturan, lalu buat footage guide yang siap dipakai editor.</p>';
  const b=h("button","go","Coba contoh skrip");b.type="button";b.onclick=loadSample;d.append(b);return d;
}

// ===== DATA PEMBUAT (edit di sini; kolom kosong tidak ditampilkan)
const ABOUT={
  name:"Latif Nugraha Purwa",
  nick:"Nugraha",
  donate:true,
  handle:"Latifnugrahapurwa",
  role:"Pembuat & pengembang Footage Guide Generator",
  bio:"",
  avatar:"https://avatars.githubusercontent.com/u/39060395?s=160&v=4",
  email:"Latifnugrahapurwa11@gmail.com",
  whatsapp:"",
  links:[["GitHub","https://github.com/Latifnugrahapurwa"],["Repositori","https://github.com/Latifnugrahapurwa/StoryboardEngine"],["Aplikasi","https://storyboardengine.vercel.app"],["Laporkan masalah","https://github.com/Latifnugrahapurwa/StoryboardEngine/issues"]],
  extra:[["Instagram @elnprw","https://instagram.com/elnprw"]]
};
const QRIS="qris.jpg";
const APP={name:"Footage Guide Generator",version:"1.2.0",year:2026};
function zoomImg(src){const d=h("div","lb"),i=document.createElement("img");i.src=src;i.alt="QRIS";d.append(i);d.onclick=()=>d.remove();document.body.append(d)}
function buildAbout(){
  const box=$("aboutBox");box.replaceChildren();
  const grp=(t,...k)=>{const d=h("div","grp");d.append(h("h4",null,t));k.forEach(x=>{x.style.gridColumn="1/-1";d.append(x)});return d};
  const ul=a=>{const u=h("ul");a.forEach(x=>u.append(h("li",null,x)));return u};
  const nm=ABOUT.name||ABOUT.handle,head=h("div","ab-head"),ini=h("div","ab-ini",(nm.replace(/[^A-Za-z0-9]/g,"").slice(0,2)||"?").toUpperCase());
  if(ABOUT.avatar){const im=document.createElement("img");im.className="ab-av";im.alt="Foto "+nm;im.referrerPolicy="no-referrer";im.onerror=()=>im.replaceWith(ini);im.src=ABOUT.avatar;head.append(im)}else head.append(ini);
  const tx=h("div");tx.append(h("h2",null,nm));
  if(ABOUT.role)tx.append(h("div","dur",ABOUT.role));
  if(ABOUT.nick)tx.append(h("div","dur","Biasa dipanggil "+ABOUT.nick));
  if(ABOUT.name&&ABOUT.handle)tx.append(h("div","dur","GitHub: @"+ABOUT.handle));
  if(ABOUT.bio)tx.append(h("p",null,ABOUT.bio));
  head.append(tx);
  const L=ABOUT.links.concat(ABOUT.extra),links=h("div","links");
  if(ABOUT.email)L.push(["Email","mailto:"+ABOUT.email]);
  if(ABOUT.whatsapp)L.push(["WhatsApp","https://wa.me/"+ABOUT.whatsapp.replace(/\D/g,"")]);
  L.forEach(([t,u])=>{const a=h("a","lk",t);a.href=u;a.target="_blank";a.rel="noopener noreferrer";links.append(a)});
  box.append(grp("Pembuat engine",head,links));
  if(ABOUT.donate&&typeof QRIS==="string"){
    const im=document.createElement("img");im.className="qris";im.src=QRIS;im.alt="QRIS donasi atas nama "+nm;im.title="Klik untuk memperbesar";im.onclick=()=>zoomImg(QRIS);
    const bt=h("div","row2"),dl=h("a","lk","Unduh QRIS");dl.href=QRIS;dl.download="qris-donasi.jpg";bt.append(dl);
    box.append(grp("Dukung pembuat (donasi)",h("p",null,"Jika engine ini membantu pekerjaan Anda, Anda bisa mendukung pengembangannya lewat QRIS. Donasi bersifat sukarela dan berapa pun nominalnya sangat berarti. Scan dengan aplikasi bank atau e-wallet berlogo QRIS, lalu pastikan nama penerima tertulis "+nm+"."),im,bt));
  }
  box.append(grp("Tentang engine",h("p",null,APP.name+" membantu kreator video mengubah skrip final menjadi panduan footage per kalimat: jenis shot, sumber, langkah mendapatkannya, dan prompt AI siap salin, lengkap dengan aturan editing."),ul(["Dua tampilan: tabel 5 kolom, atau skrip utuh dengan blok warna dan kartu footage di samping","Tabel sesuai master prompt yang bisa diedit langsung","Tautan sumber ganda: Envato, Pexels, Pixabay, YouTube, dan halaman terkait","Centang progres, filter, catatan editor, dan evaluasi mutu oleh AI","Ekspor Excel, CSV, JSON, dan penanda EDL","Riwayat di browser, mode terang/gelap, dan pengaturan engine lengkap","Engine Gemini, ChatGPT, atau Claude dengan API key sendiri, atau mode salin-tempel"])));
  box.append(grp("Privasi & penggunaan",ul(["Tidak ada server milik pembuat: skrip, API key, dan riwayat hanya tersimpan di browser Anda.","Skrip dikirim hanya ke penyedia AI yang Anda pilih, tunduk pada ketentuan penyedia itu.","Hasil AI bisa keliru. Periksa URL, nama menu aplikasi, dan klaim sebelum dipakai di video.","Aplikasi hanya membuat tautan ke Envato, Pexels, dan sumber lain, tidak mengunduh footage. Patuhi lisensi masing-masing.","Nama dagang (Envato, Pexels, Pixabay, ChatGPT, Claude, Gemini, dan lainnya) milik pemiliknya; aplikasi ini tidak berafiliasi."])));
  const info=APP.name+" v"+APP.version+" | "+$("engpill").textContent+" | tema "+document.documentElement.dataset.eff+" | "+navigator.userAgent;
  const row=h("div","row2"),cp=h("button",null,"Salin info versi");cp.type="button";
  cp.onclick=async()=>{try{await navigator.clipboard.writeText(info);cp.textContent="Tersalin ✓"}catch(e){cp.textContent="Gagal menyalin"}setTimeout(()=>{cp.textContent="Salin info versi"},1800)};
  row.append(cp);
  box.append(grp("Versi & kredit",h("p",null,"Versi "+APP.version+" · © "+APP.year+" "+nm),h("p","dur","Dikembangkan dengan bantuan Claude (Anthropic)."),row));
}
function showTab(t){curTab=t;if(t==="about")buildAbout();document.querySelectorAll(".tabs button").forEach(b=>b.classList.toggle("on",b.dataset.t===t));document.querySelectorAll(".tp").forEach(p=>{p.hidden=p.dataset.t!==t})}
function stinfo(){let n=0;Object.keys(localStorage).forEach(k=>{if(k.indexOf("sb_")===0)n+=(localStorage.getItem(k)||"").length});$("stinfo").textContent="Data aplikasi di browser ini: ±"+Math.round(n/1024)+" KB (riwayat, pengaturan, key)."}
function openSettings(t){showTab(t||curTab);stinfo();$("modal").classList.add("open");$("modal").setAttribute("aria-hidden","false")}
function closeSettings(){$("modal").classList.remove("open");$("modal").setAttribute("aria-hidden","true")}
applyS();bindS();buildSw();
$("btnSet").onclick=()=>openSettings();$("vTable").onclick=()=>setView("table");$("vScript").onclick=()=>setView("script");$("trcap").onclick=()=>openSettings("engine");$("engpill").onclick=()=>openSettings("engine");
$("mclose").onclick=closeSettings;$("modal").addEventListener("mousedown",e=>{if(e.target===$("modal"))closeSettings()});
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>showTab(b.dataset.t));
$("btnTheme").onclick=()=>{S.theme=document.documentElement.dataset.eff==="dark"?"light":"dark";saveS();applyS();syncS()};
$("btnFocus").onclick=()=>{const on=document.documentElement.classList.toggle("focus");$("btnFocus").setAttribute("aria-pressed",on)};
$("sample").onclick=loadSample;$("clr").onclick=()=>{$("script").value="";sc()};
$("script").addEventListener("input",sc);
$("s-reset").onclick=()=>{if(!confirm("Kembalikan semua pengaturan tampilan dan engine ke bawaan? (API key dan riwayat tidak dihapus)"))return;S=Object.assign({},DEF);saveS();applyS();syncS()};
$("s-wipe").onclick=()=>{if(!confirm("Hapus SEMUA data aplikasi di browser ini (riwayat, pengaturan, API key, sumber tambahan)? Tindakan ini tidak bisa dibatalkan."))return;Object.keys(localStorage).filter(k=>k.indexOf("sb_")===0).forEach(k=>localStorage.removeItem(k));try{sessionStorage.clear()}catch(e){}location.reload()};
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();run()}if(e.key==="Escape"){closeSettings();document.querySelectorAll(".lb").forEach(x=>x.remove())}});
const PRESETS={
"Cepat & energik (edukasi/shorts)":"Tempo: ganti visual tiap 2-4 detik, hook 5 detik pertama sangat dinamis.\nVisual: dominan stock footage dan motion graphic, sisipkan screenshot untuk bukti.\nTeks: kata kunci tebal ukuran besar di tengah bawah, warna kuning, muncul dengan pop. Maksimal 6 kata.\nZoom cepat tiap penekanan. Transisi: hard cut atau whip pan.\nSFX: whoosh tiap transisi, pop tiap teks muncul. Musik upbeat, volume rendah.\nLarangan: footage statis lebih dari 4 detik, teks panjang.",
"Tenang & sinematik (dokumenter)":"Tempo: shot 5-8 detik, ritme tenang.\nVisual: dominan footage sinematik (wide, drone, slow motion), grafik hanya untuk data penting.\nTeks: minimalis, font serif putih, fade in/out lambat, lower third untuk nama dan tempat.\nTransisi: cross dissolve atau fade; zoom sangat pelan (slow push-in).\nSFX: ambience dan tekstur halus, tanpa efek pop. Musik ambient/orkestra.\nLarangan: transisi mencolok, emoji, ikon kartun.",
"Santai ala vlog/storytelling":"Tempo: variatif, ikuti emosi cerita; ganti visual tiap 3-5 detik.\nVisual: B-roll kehidupan sehari-hari, foto pribadi/arsip, sesekali meme atau reaksi singkat.\nTeks: gaya tulisan tangan atau stiker, warna hangat, penekanan lucu seperlunya.\nTransisi: jump cut, zoom spontan. SFX: efek komedi ringan secukupnya.\nLarangan: grafik terlalu korporat.",
"Tutorial / screencast":"Tempo: ikuti langkah demi langkah, satu langkah satu adegan, jeda singkat antar langkah.\nVisual: dominan screen record dengan zoom ke area yang diklik; grafik hanya untuk menjelaskan alasan di balik langkah.\nTeks: nama langkah dan pengaturan penting saja, kotak highlight pada tombol/menu.\nTransisi: cut bersih. SFX: klik halus saja. Musik instrumental tipis.\nLarangan: footage stock saat membahas pengaturan, teks yang menutupi UI.",
"Minimalis (talking head + grafis)":"Tempo: talking head dominan; sisipkan visual pendukung tiap 6-10 detik.\nVisual: grafik bersih, ikon flat, screenshot dengan highlight; sedikit stock footage.\nTeks: sans-serif putih/hitam, satu warna aksen, animasi slide halus. Angka selalu ditampilkan besar.\nTransisi: cut bersih. SFX: nyaris tidak ada. Musik instrumental tipis.\nLarangan: efek berlebihan, footage yang tidak relevan dengan klaim."
};
const PROV={
 gemini:{model:"gemini-3.6-flash",list:["gemini-3.6-flash","gemini-3.5-flash-lite"],help:"https://aistudio.google.com/apikey"},
 openai:{model:"gpt-6.1-sol",list:["gpt-6.1-sol","gpt-6-astra","gpt-6-luna"],help:"https://platform.openai.com/api-keys"},
 claude:{model:"claude-sonnet-5-5",list:["claude-sonnet-5-5","claude-opus-5-5","claude-haiku-5-5","claude-fable-5-1"],help:"https://console.anthropic.com/settings/keys"}
};
PROV.manual={model:"",list:[],help:"#"};
let gsOff=false;
function gsOn(){return $("gsearch").checked&&!gsOff}
function applyProvUI(){const p=$("prov").value;$("apiBox").hidden=p==="manual";$("gbox").hidden=p!=="gemini";$("mbox").hidden=p!=="manual";pill()}
try{$("gsearch").checked=localStorage.getItem("sb_gs")==="1"}catch(e){}
$("gsearch").onchange=()=>{gsOff=false;try{localStorage.setItem("sb_gs",$("gsearch").checked?"1":"0")}catch(e){}};
function loadProv(){
  const p=$("prov").value;let k="",m="",r=false;
  try{const l=localStorage.getItem("sb_key_"+p);r=!!l;k=l||sessionStorage.getItem("sb_key_"+p)||"";m=localStorage.getItem("sb_model3_"+p)||""}catch(e){}
  $("key").value=k;fillList(PROV[p].list,m||PROV[p].model);$("keyhelp").href=PROV[p].help;$("remember").checked=r;applyProvUI();
}
function saveProv(){
  const p=$("prov").value;
  try{
    localStorage.setItem("sb_prov",p);localStorage.setItem("sb_model3_"+p,$("model").value);
    localStorage.removeItem("sb_key_"+p);sessionStorage.removeItem("sb_key_"+p);
    ($("remember").checked?localStorage:sessionStorage).setItem("sb_key_"+p,$("key").value);
  }catch(e){}
}
try{$("prov").value=localStorage.getItem("sb_prov")||"gemini"}catch(e){}
loadProv();
$("prov").onchange=()=>{try{localStorage.setItem("sb_prov",$("prov").value)}catch(e){}loadProv()};
$("key").oninput=saveProv;$("model").onchange=()=>{saveProv();pill()};$("remember").onchange=saveProv;

function fillList(arr,cur){const a=arr.slice();if(cur&&!a.includes(cur))a.unshift(cur);$("model").replaceChildren(...a.map(v=>{const o=document.createElement("option");o.value=v;o.textContent=v;return o}));if(cur)$("model").value=cur}
async function loadModels(){
  const p=$("prov").value,key=$("key").value.trim(),st=$("status");
  if(!key){st.className="status err";st.textContent="Isi API key dulu.";return}
  st.className="status";st.textContent="Memuat daftar model...";
  try{
    let url,h={},ids;
    if(p==="gemini"){url="https://generativelanguage.googleapis.com/v1beta/models?pageSize=200";h["x-goog-api-key"]=key}
    else if(p==="openai"){url="https://api.openai.com/v1/models";h.Authorization="Bearer "+key}
    else{url="https://api.anthropic.com/v1/models?limit=100";h["x-api-key"]=key;h["anthropic-version"]="2023-06-01";h["anthropic-dangerous-direct-browser-access"]="true"}
    const r=await fetch(url,{headers:h});
    if(!r.ok)throw new Error(r.status+" "+(await r.text()).slice(0,150));
    const j=await r.json();
    if(p==="gemini"){
      const all=(j.models||[]).filter(m=>(m.supportedGenerationMethods||[]).includes("generateContent")).map(m=>m.name.replace(/^models\//,""));
      ids=PROV.gemini.list.filter(x=>all.includes(x));
    }else if(p==="openai"){
      ids=(j.data||[]).filter(m=>/^gpt-/.test(m.id)&&!/image|audio|realtime|tts|transcribe|embed|moderation|search|instruct|codex/.test(m.id)).sort((a,b)=>(b.created||0)-(a.created||0)).map(m=>m.id).slice(0,12);
    }else{
      ids=(j.data||[]).map(m=>m.id).slice(0,10);
    }
    if(!ids.length){st.className="status err";st.textContent="Model yang dicari tidak tersedia untuk key ini.";return}
    const cur=$("model").value;fillList(ids,ids.includes(cur)?cur:ids[0]);saveProv();
    st.textContent=ids.length+" model tersedia untuk key ini. Pilih di menu versi model.";
  }catch(e){st.className="status err";st.textContent="Gagal memuat daftar model: "+(e.message||"cek key dan koneksi")}
}
$("loadm").onclick=loadModels;

function parseJ(t){
  t=String(t||"").replace(/```json|```/g,"");
  const a=t.search(/\[\s*\{/);
  if(a<0)throw{code:"format",message:"Jawaban AI bukan JSON yang valid, coba lagi."};
  let d=0,str=false,esc=false,end=-1;
  for(let i=a;i<t.length;i++){
    const c=t[i];
    if(str){if(esc)esc=false;else if(c==="\\")esc=true;else if(c==='"')str=false;continue}
    if(c==='"')str=true;else if(c==="[")d++;else if(c==="]"){d--;if(d===0){end=i;break}}
  }
  if(end<0)throw{code:"format",message:"JSON terpotong atau tidak lengkap. Minta AI mengirim ulang array lengkap."};
  return JSON.parse(t.slice(a,end+1));
}
async function callAI(prompt){
  const p=$("prov").value,key=$("key").value.trim(),model=$("model").value.trim()||PROV[p].model;
  let url,headers={"Content-Type":"application/json"},body,pick;
  if(p==="gemini"){
    const gm=model.replace(/^models\//i,"").trim().toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9.\-_]/g,"");
    url="https://generativelanguage.googleapis.com/v1beta/models/"+(gm||PROV.gemini.model)+":generateContent";
    headers["x-goog-api-key"]=key;
    body={contents:[{parts:[{text:prompt}]}]};const gc={};if(S.temp!=="")gc.temperature=+S.temp;if(S.maxTok!=="")gc.maxOutputTokens=+S.maxTok;if(gsOn())body.tools=[{google_search:{}}];else gc.responseMimeType="application/json";if(Object.keys(gc).length)body.generationConfig=gc;
    pick=j=>j.candidates[0].content.parts.map(x=>x.text||"").join("");
  }else if(p==="openai"){
    url="https://api.openai.com/v1/chat/completions";
    headers.Authorization="Bearer "+key;
    body={model,messages:[{role:"user",content:prompt}]};if(S.maxTok!=="")body.max_completion_tokens=+S.maxTok;
    pick=j=>j.choices[0].message.content;
  }else{
    url="https://api.anthropic.com/v1/messages";
    headers["x-api-key"]=key;headers["anthropic-version"]="2023-06-01";headers["anthropic-dangerous-direct-browser-access"]="true";
    body={model,max_tokens:+S.maxTok||8000,messages:[{role:"user",content:prompt}]};if(S.temp!=="")body.temperature=+S.temp;
    pick=j=>j.content.map(x=>x.text||"").join("");
  }
  let res;
  try{res=await fetch(url,{method:"POST",headers,body:JSON.stringify(body)})}
  catch(e){throw{code:"jaringan",message:"Tidak bisa menghubungi penyedia AI. Cek koneksi atau coba penyedia lain."}}
  if(!res.ok){const t=await res.text();throw{code:res.status,message:t.slice(0,200)}}
  return parseJ(pick(await res.json()));
}

const RK="sb_rules_v1";
try{$("rules").value=localStorage.getItem(RK)||""}catch(e){}
Object.keys(PRESETS).forEach(k=>{const o=document.createElement("option");o.textContent=k;o.value=k;$("preset").append(o)});
$("preset").onchange=()=>{const v=PRESETS[$("preset").value];if(v){$("rules").value=v;$("rules").dispatchEvent(new Event("input"))}};
$("rules").oninput=()=>{try{localStorage.setItem(RK,$("rules").value)}catch(e){}};


// MASTER dimuat dari master-prompt.js
const COL5=[["vo","VO / SCRIPT LINE",46],["shot_type","SHOT TYPE",22],["scene","SCENE / SHOW THIS",36],["how_to_get","HOW TO GET IT / EXACT SOURCE",70],["ai_prompt","EXACT AI PROMPT — COPY/PASTE",70]];
const OVERRIDE=`ATURAN TAMBAHAN UNTUK APLIKASI INI (prioritas tertinggi, mengalahkan instruksi di atas jika bertentangan):
- Kamu tidak bisa browsing web dan tidak membuat Excel. Balas HANYA array JSON, satu objek per baris footage guide, berurutan sesuai skrip: {"vo":"kutipan skrip PERSIS sama","shot_type":"salah satu tipe standar","scene":"singkat","how_to_get":"instruksi lengkap; sertakan baris 'PUT TEXT : ...' hanya bila perlu","ai_prompt":"prompt lengkap bila AI VIDEO, selain itu string kosong","source_url":"URL tujuan langsung bila pasti, selain itu string kosong","search_query":"kata kunci pencarian bahasa Inggris untuk menemukan sumber/footage; kosong untuk FULL GRAPHIC dan AI VIDEO","extra_sources":[{"label":"nama sumber alternatif","url":"URL pasti"}],"page_query":"kueri pencarian yang sangat spesifik untuk halaman tujuan (nama produk lengkap + model, atau nama fitur + nama layanan + official)","target_site":"domain situs tujuan, mis. amazon.com atau nordvpn.com, atau kosong"}.
- Jangan pernah mengarang URL. URL yang tidak bisa dipastikan 100% ditulis "URL BELUM TERVERIFIKASI" disertai jalur navigasi persis (menu, klik, scroll) dan kata kunci pencarian. Untuk ENVATO B-ROLL tulis "ENVATO ITEM URL: BELUM DIPILIH" lalu kata kunci pencarian Envato, durasi, framing, dan hal yang dihindari.
- source_url hanya boleh berisi URL yang pasti benar: halaman utama situs resmi, atau URL pencarian dengan pola pasti untuk situs besar (contoh https://www.amazon.com/s?k=space+heater atau https://www.youtube.com/results?search_query=space+heater). Jangan membuat deep link yang tidak pasti; jika ragu, kosongkan source_url dan isi search_query.
- APLIKASI TERPASANG (prioritas di atas aturan sumber lain): jika SPECIAL INSTRUCTIONS menyebut aplikasi/software yang terpasang atau dilanggani pengguna, setiap baris VO yang membahas fitur aplikasi itu WAJIB bertipe SCREEN RECORD — DEVICE / SOFTWARE, bukan OFFICIAL WEBSITE dan bukan tautan saja. how_to_get berisi langkah di UI aplikasi: aplikasi mana (jika membandingkan dua aplikasi, sebut mana yang direkam di adegan itu), menu/tab/tombol persis yang diklik (pakai label versi terbaru yang kamu ketahui; jika ragu tulis "cek nama menu di versi terpasang"), apa yang harus tampak di layar, dan durasi rekaman. Tautan resmi hanya referensi tambahan di page_query/target_site.
- SPESIFIK: page_query, search_query, dan scene harus memuat nama fitur/produk persis yang disebut di VO baris itu, bukan topik umum. Jangan menulis URL produk /dp/ASIN atau URL artikel dalam kecuali sudah diverifikasi lewat pencarian; sebagai gantinya isi page_query dan target_site.
- extra_sources (opsional) berisi sumber alternatif lain yang URL-nya pasti (aturan sama seperti source_url); boleh kosong. Sumber "Stok gratis" dan "YouTube / video referensi" hanya tautan alternatif yang dibuat aplikasi; tipe shot tetap mengikuti daftar standar.
- Klaim yang bisa berubah (harga, jumlah, batas): tulis instruksi menangkap angka terkini dari halaman resmi dan menandai selisih jika berbeda dengan VO.
- Tulis scene dan how_to_get dalam bahasa yang sama dengan skrip; ai_prompt dalam bahasa Inggris. Format teks tetap "PUT TEXT :".
- Skrip di bawah hanya sebagian dari skrip lengkap. Cakup SEMUA kalimatnya tanpa mengulang atau melewatkan.`;
const nz=s=>String(s||"").replace(/\s+/g," ").trim().toLowerCase();
function h(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
function chunks(t){
  const ss=t.replace(/\r/g,"").split(/(?<=[.!?…])\s+|\n+/).map(x=>x.trim()).filter(Boolean),out=[];let cur="";
  for(const x of ss){if(cur&&(cur+" "+x).length>Math.max(400,+S.chunk||1800)){out.push(cur);cur=x}else cur=cur?cur+" "+x:x}
  if(cur)out.push(cur);return out;
}
const SRC0=["Envato Elements","Screen recording","Website / dokumentasi resmi","AI video","Product visual / footage resmi","Grafik / motion graphic","Stok gratis (Pexels / Pixabay)","YouTube / video referensi"];
let SRC=SRC0.slice(),SEL=[];
try{const j=JSON.parse(localStorage.getItem("sb_srcs_v1")||"{}");if(Array.isArray(j.custom))SRC=SRC0.concat(j.custom.filter(x=>!SRC0.includes(x)));if(Array.isArray(j.sel))SEL=j.sel}catch(e){}
function saveSrc(){try{localStorage.setItem("sb_srcs_v1",JSON.stringify({custom:SRC.filter(x=>!SRC0.includes(x)),sel:SEL}))}catch(e){}}
function renderSrc(){
  const box=$("srcs");box.replaceChildren();
  SRC.forEach(name=>{
    const l=h("label","opt"),c=document.createElement("input");c.type="checkbox";c.checked=SEL.includes(name);
    c.onchange=()=>{SEL=c.checked?SEL.concat(name):SEL.filter(x=>x!==name);saveSrc()};
    const sp=h("span",null,name);sp.title=name;l.append(c,sp);
    if(!SRC0.includes(name)){const x=h("button","rm","×");x.type="button";x.title="Hapus sumber";x.setAttribute("aria-label","Hapus sumber "+name);x.onclick=e=>{e.preventDefault();SRC=SRC.filter(y=>y!==name);SEL=SEL.filter(y=>y!==name);saveSrc();renderSrc()};l.append(x)}
    box.append(l);
  });
}
$("srcadd").onclick=()=>{const v=$("srcnew").value.trim();if(!v)return;if(!SRC.includes(v))SRC.push(v);if(!SEL.includes(v))SEL.push(v);$("srcnew").value="";saveSrc();renderSrc()};
$("srcnew").onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();$("srcadd").onclick()}};
function srcText(){return SEL.length?SEL.join(", ")+" (use ONLY these sources, except SCREEN RECORD — DEVICE / SOFTWARE for apps/devices the user owns; do not use any other source)":"Not specified (choose according to the master prompt rules)"}
renderSrc();
function searchOn(){const p=$("prov").value;return p==="manual"||(p==="gemini"&&gsOn())}
function detLang(t){const w=String(t).toLowerCase().match(/[a-z']+/g)||[],en=new Set("the and you your that this with for are is of to in it we our on be can have from or if will".split(" ")),id=new Set("yang dan di ke dari untuk dengan ini itu adalah pada akan kami kita anda tidak juga atau dalam sebagai saya".split(" "));let a=0,b=0;w.forEach(x=>{if(en.has(x))a++;if(id.has(x))b++});return a>b*1.5?"en":b>a*1.5?"id":""}
function ovr(){
  let o=OVERRIDE;
  if(searchOn())o=o.replace("Kamu tidak bisa browsing web dan tidak membuat Excel.","Kamu boleh menelusuri web untuk memverifikasi sumber, dan tidak membuat Excel.")+"\n- Karena kamu bisa menelusuri web: source_url dan extra_sources boleh berisi URL halaman spesifik, tetapi HANYA yang benar-benar sudah kamu temukan dan buka/verifikasi. Jika gagal diverifikasi, tetap tulis URL BELUM TERVERIFIKASI.";
  if($("prov").value==="manual")o+="\n- Bungkus jawaban akhir dalam SATU blok kode ```json berisi array saja.";
  const sl=detLang($("script").value),L=S.trAuto?trName():(S.lang==="id"?"Indonesia":S.lang==="en"?"Inggris":(sl==="en"?"Inggris":sl==="id"?"Indonesia":""));
  if(L)o=o.replace("dalam bahasa yang sama dengan skrip","dalam bahasa "+L+" (wajib, jangan dicampur bahasa lain)");
  o+="\n- Target persentase ENVATO B-ROLL untuk seluruh video: "+S.envMin+"-"+S.envMax+"%.";
  if(S.trAuto){const T=trName();
    o+="\n- TERJEMAHAN VO: tambahkan field \"vo_tr\" pada setiap objek berisi terjemahan natural VO ke bahasa "+T+". Field \"vo\" TETAP kutipan skrip asli persis. Jika VO sudah berbahasa "+T+", isi vo_tr dengan string kosong. Scene dan how_to_get langsung ditulis dalam bahasa "+T+" (satu bahasa, tanpa versi ganda); URL, nama menu/tombol/fitur/merek dipertahankan persis seperti di antarmuka aslinya.";}
  o+="\n- Teks setelah \"PUT TEXT :\" adalah teks yang tampil di video, jadi tulis dalam bahasa yang sama dengan VO (bahasa video), apa pun bahasa penjelasan di kolom lain.";
  return o;
}
function buildPrompt(c,i,n){
  const sp=[$("special").value.trim(),$("rules").value.trim()?"VIDEO EDITING STYLE"+($("preset").value?" ("+$("preset").value+")":"")+":\n"+$("rules").value.trim():""].filter(Boolean).join("\n\n")||"-";
  const inp="VIDEO TYPE:\n"+$("style").value+"\n\nVISUAL MODE:\n"+$("vmode").value+"\n\nPRIMARY SUBJECT:\n"+($("topic").value||"-")+"\n\nAVAILABLE HARDWARE / SOFTWARE / WORKAROUND:\n"+($("special").value.trim()||"None")+"\n(Treat everything above about owned devices, installed apps and subscriptions as AVAILABLE. If it names an installed app, every VO line about that app's features MUST use SCREEN RECORD — DEVICE / SOFTWARE. If nothing is stated, assume NONE is available.)\n\nPREFERRED SOURCES:\n"+srcText()+"\n\nAI VIDEO PLATFORM:\n"+$("aiplat").value+"\n\nSPECIAL INSTRUCTIONS:\n"+sp;
  return masterText()+"\n\n"+ovr()+"\n\nINPUT YANG SUDAH DIISI:\n"+inp+ctxNote()+"\n\nSCRIPT (bagian "+(i+1)+" dari "+n+"):\n"+c;
}
function check(r,n){
  const f=[];
  if(!n.includes(nz(r.vo)))f.push("VO tidak persis sama dengan skrip");
  if($("vmode").value==="AUDIO ONLY"&&/TALKING HEAD/i.test(r.shot_type))f.push("Talking head dilarang di mode AUDIO ONLY");
  if(/AI VIDEO/i.test(r.shot_type)&&!r.ai_prompt.trim())f.push("Baris AI tanpa prompt");
  if(/ENVATO/i.test(r.shot_type)&&!r.envato_url&&!/envato\.com\/\S+/i.test(r.how_to_get))f.push("Isi URL item Envato");
  if(/SCREEN RECORD/i.test(r.shot_type)&&/BELUM TERVERIFIKASI/i.test(r.how_to_get))f.push("Verifikasi URL sumber");
  if(r.how_orig!==undefined){const o=r.how_orig,u=(o.match(/https?:\/\/[^\s)"'<>]+/g)||[]).some(x=>!r.how_to_get.includes(x)),p=(o.match(/PUT TEXT\s*:[^\n]*/gi)||[]).some(l=>!r.how_to_get.includes(l.trim()));if(u||p)f.push("Terjemahan how-to: URL/PUT TEXT tidak identik dengan aslinya")}
  return f;
}
function mix(){const m={};rows.forEach(r=>{const k=(r.shot_type||"-").toUpperCase();m[k]=(m[k]||0)+1});return Object.entries(m).sort((a,b)=>b[1]-a[1])}
function enc(q){return encodeURIComponent(String(q||"").trim()).replace(/%20/g,"+")}
const OKU=u=>/^https?:\/\/\S+$/i.test(u||"");
function allow(n){return !SEL.length||SEL.includes(n)}
function srcLinks(r){
  const out=[],add=(t,u)=>{if(OKU(u)&&!out.some(o=>o[1]===u))out.push([t,u])};
  const q=(r.search_query||"").trim(),st=r.shot_type||"";
  add(r.web===false?"Buka sumber (belum diverifikasi)":"Buka sumber",(r.source_url||"").trim());add("Item Envato",(r.envato_url||"").trim());
  (r.extra_sources||[]).forEach(x=>add(x.label||"Sumber",x.url));
  (r.how_to_get.match(/https?:\/\/[^\s)"'<>]+/g)||[]).map(u=>u.replace(/[.,;]+$/,"")).forEach(u=>add(r.web===false?"Buka link (belum diverifikasi)":"Buka link",u));
  const lq=(r.page_query||"").trim(),ts=(r.target_site||"").trim().toLowerCase().replace(/^https?:\/\//,"").replace(/\/.*$/,"");
  if(lq&&!(r.source_url||"").trim()&&!/ENVATO|AI VIDEO|FULL GRAPHIC/i.test(st)){
    const site=/^[a-z0-9.-]+\.[a-z]{2,}$/.test(ts)?"site:"+ts+" ":"";
    add("Halaman terkait ▸ Google","https://www.google.com/search?btnI=1&q="+enc(site+lq));
    add("Halaman terkait ▸ DuckDuckGo","https://duckduckgo.com/?q="+enc("\\"+site+lq));
  }
  if(q){
    if(/ENVATO/i.test(st)){
      if(allow("Envato Elements"))add("Envato","https://elements.envato.com/stock-video/"+enc(q));
      if(allow("Stok gratis (Pexels / Pixabay)")){add("Pexels","https://www.pexels.com/search/videos/"+encodeURIComponent(q)+"/");add("Pixabay","https://pixabay.com/videos/search/"+encodeURIComponent(q)+"/")}
    }else if(/SCREEN|PRODUCT/i.test(st)){
      if(!out.length)add("Google","https://www.google.com/search?q="+enc(q));
      if(/PRODUCT/i.test(st))add("Google Gambar","https://www.google.com/search?tbm=isch&q="+enc(q));
      if(allow("YouTube / video referensi"))add("YouTube","https://www.youtube.com/results?search_query="+enc(q));
    }
  }
  return out;
}
let flt="all";
function fillCell(td,r,k){
  const d=h("div","cell",r[k]);d.contentEditable="true";d.spellcheck=false;d.oninput=()=>{r[k]=d.innerText;persist()};td.append(d);
      if(k==="vo"){
        if(r.vo_tr&&S.trShow){const tr=h("div","tr",r.vo_tr);tr.contentEditable="true";tr.spellcheck=false;tr.title="Terjemahan VO (bisa diedit)";tr.oninput=()=>{r.vo_tr=tr.innerText;persist()};td.append(tr)}
        if(r.flags.length)td.append(h("div","flag",r.flags.join(" · ")));
        if(r.score)td.append(h("div","sc"+(r.score<=2?" bad":""),"Skor "+r.score+"/5"+(r.tip?" — "+r.tip:"")));
        const nt=document.createElement("input");nt.className="note";nt.placeholder="Catatan editor";nt.value=r.note||"";nt.oninput=()=>{r.note=nt.value;persist()};td.append(nt);
        const rg=h("button","rg","↻ Buat ulang baris");rg.type="button";rg.onclick=()=>regen(r);
        const tl=h("button","rg",(r.vo_tr||r.how_orig!==undefined)?"Terjemahkan ulang":"Terjemahkan");tl.type="button";tl.title="Terjemahan VO tampil di bawah VO asli; Scene dan How to get it diubah ke "+trName()+" (bahasa tujuan diatur di Pengaturan)";
        tl.onclick=async()=>{tl.disabled=true;tl.textContent="Menerjemahkan…";await translateRow(r);tl.disabled=false;tl.textContent="Terjemahkan ulang"};
        const va=h("div","vact");va.append(rg,tl);td.append(va);
      }
      if(k==="how_to_get"){
        const lb=h("div","links"),fill=()=>{lb.replaceChildren();srcLinks(r).forEach(([tx,u])=>{const a=h("a","lk",tx);a.href=u;a.target="_blank";a.rel="noopener noreferrer";lb.append(a)})};
        if(/ENVATO/i.test(r.shot_type)){const eu=document.createElement("input");eu.className="note";eu.placeholder="Tempel URL item Envato yang dipilih";eu.value=r.envato_url||"";eu.oninput=()=>{r.envato_url=eu.value.trim();fill();persist()};td.append(eu)}
        fill();td.append(lb);d.addEventListener("input",fill);
        const tools=h("div","links"),vf=h("button","lk",r.vf?"✓ Terverifikasi":"Tandai terverifikasi");vf.type="button";
        vf.onclick=()=>{r.vf=!r.vf;vf.textContent=r.vf?"✓ Terverifikasi":"Tandai terverifikasi";persist()};tools.append(vf);
        if(r.how_orig!==undefined){const rs=h("button","lk","↩ Kembalikan asli");rs.type="button";rs.title="Kembalikan Scene dan How to get it ke versi sebelum diterjemahkan";rs.onclick=()=>restoreRow(r);tools.append(rs)}
        if(/ENVATO/i.test(r.shot_type)&&r.search_query){const pv=h("button","lk","Pratinjau stok"),bx=h("div","pv");pv.type="button";pv.onclick=()=>pexels(r,bx);tools.append(pv);td.append(tools,bx)}else td.append(tools);
      }
}
// ===== MODE SKRIP =====
const CAT=[["screen","Screen record"],["envato","Envato B-roll"],["ai","AI video"],["graphic","Graphic"],["product","Product visual"],["other","Lainnya"]];
function catOf(t){t=String(t||"").toUpperCase();return/SCREEN/.test(t)?"screen":/ENVATO|B-ROLL/.test(t)?"envato":/AI VIDEO/.test(t)?"ai":/GRAPHIC/.test(t)?"graphic":/PRODUCT/.test(t)?"product":"other"}
let selId="",svTf="all",svQ="",curScript="",curLeft="";
function scr(){return curScript||$("script").value}
function ensureIds(){rows.forEach(r=>{if(!r.id)r.id="r"+Math.random().toString(36).slice(2,9)})}
function svPrep(t,loose){
  let n="",idx=[],ws=false;
  for(let i=0;i<t.length;i++){
    let c=t[i];
    if(c==="\u2018"||c==="\u2019")c="'";else if(c==="\u201c"||c==="\u201d")c='"';else if(c==="\u2013"||c==="\u2014")c="-";
    c=c.toLowerCase();
    if(/\s/.test(c)){if(!ws&&n.length){n+=" ";idx.push(i)}ws=true;continue}
    if(loose&&!/[\p{L}\p{N}]/u.test(c))continue;
    ws=false;n+=c;idx.push(i);
  }
  return{n,idx};
}
function svSearch(S1,needle,from){
  if(!needle)return null;
  const f=S1.idx.findIndex(v=>v>=from);if(f<0)return null;
  const p=S1.n.indexOf(needle,f);if(p<0)return null;
  return[S1.idx[p],S1.idx[p+needle.length-1]+1];
}
function ensureAnchors(){
  const txt=scr();if(!txt||!rows.length)return;
  const tag=txt.length+":"+rows.length;
  if(rows.every(r=>r.aTag===tag))return;
  const A=svPrep(txt,false),B=svPrep(txt,true),used=[];let cur=0;
  rows.forEach(r=>{
    r.start=r.end=null;r.unm=true;r.aTag=tag;
    const n1=svPrep(r.vo||"",false).n.trim(),n2=svPrep(r.vo||"",true).n.trim();
    let h2=svSearch(A,n1,cur)||svSearch(B,n2,cur);
    if(!h2){const g=svSearch(A,n1,0)||svSearch(B,n2,0);if(g&&!used.some(u=>g[0]<u[1]&&g[1]>u[0]))h2=g}
    if(h2){r.start=h2[0];r.end=h2[1];r.unm=false;used.push(h2);if(h2[1]>cur)cur=h2[1]}
  });
  persist();
}
function durOf(r){const w=Math.max(+$("wps").value||2.6,.5);return Math.max(1,Math.round(String(r.vo||"").split(/\s+/).filter(Boolean).length/w))}
function matchF(r){
  if(flt==="todo"&&r.done)return false;if(flt==="done"&&!r.done)return false;
  if(svTf!=="all"&&catOf(r.shot_type)!==svTf)return false;
  if(svQ){const hay=[r.vo,r.vo_tr,r.scene,r.how_to_get,r.note,r.shot_type].join(" ").toLowerCase();if(hay.indexOf(svQ.toLowerCase())<0)return false}
  return true;
}
function svSecs(txt){const out=[],re=/^[ \t]*(\[[^\]\n]{1,60}\])[ \t]*$/gm;let m;while((m=re.exec(txt)))out.push({start:m.index,end:m.index+m[0].length,title:m[1]});return out}
function svSeg(box,txt,a,b){
  const seg=txt.slice(a,b);if(!seg)return;
  if(seg.replace(/\s/g,"").length<12){box.append(document.createTextNode(seg));return}
  const lead=seg.length-seg.trimStart().length,trail=seg.length-seg.trimEnd().length,sp=h("span","gap");
  sp.append(document.createTextNode(seg));
  const bt=h("button","gapadd","＋");bt.type="button";bt.title="Tambah scene untuk bagian ini";bt.setAttribute("aria-label","Tambah scene untuk bagian teks ini");
  bt.onclick=e=>{e.stopPropagation();addSceneFrom(a+lead,b-trail)};sp.append(bt);box.append(sp);
}
function svPlain(box,txt,from,to,secs){
  let pos=from;
  secs.forEach((s,i)=>{
    if(s.start<from||s.start>=to)return;
    let e=s.start;if(e>pos&&txt[e-1]==="\n")e--;
    svSeg(box,txt,pos,e);
    const dv=h("div","sec",s.title);dv.dataset.sec=i;box.append(dv);
    pos=s.end;if(txt[pos]==="\n")pos++;
  });
  if(pos<to)svSeg(box,txt,pos,to);
}
function svCard(r,i){
  const sel=r.id===selId,d=h("div","scn c-"+catOf(r.shot_type)+(sel?" sel":"")+(r.done?" done":""));d.dataset.mid=r.id;
  const hd=h("div","scn-h"),dnb=h("button","dnb"+(r.done?" on":""),"✓");dnb.type="button";dnb.title=r.done?"Batalkan tanda selesai":"Tandai sudah diterapkan";dnb.setAttribute("aria-pressed",!!r.done);
  dnb.onclick=e=>{e.stopPropagation();r.done=!r.done;persist();render()};
  hd.append(dnb,h("i","dot"),h("span","sn",(i+1)+". "+String(r.vo||"").slice(0,70)),h("span","dur","~"+durOf(r)+" dtk"));
  if(r.unm)hd.append(h("span","badge","tak terpetakan"));
  hd.append(h("span","chev",sel?"▾":"▸"));hd.onclick=()=>selectRow(r.id,"card");d.append(hd);
  if(sel){
    const b=h("div","scn-b");
    COL5.forEach(([k,lab])=>{
      const w=h("div","cf"),td=h("div","cfv");fillCell(td,r,k);
      const ce=td.querySelector&&td.querySelector(".cell");
      if(ce&&k==="vo")ce.contentEditable="false";
      if(ce&&k==="shot_type")ce.addEventListener("blur",()=>render());
      w.append(h("label","cl",lab),td);b.append(w);
    });
    if(r.manual){const dl=h("button","del","Hapus scene tambahan");dl.type="button";dl.onclick=()=>{if(!confirm("Hapus scene "+(i+1)+"? Tindakan ini tidak bisa dibatalkan."))return;rows.splice(rows.indexOf(r),1);if(curLeft===r.id)curLeft="";selId="";persist();render()};b.append(dl)}
    d.append(b);
  }
  return d;
}
function svSections(txt,secs){
  const g=secs.map((s,i)=>({i,title:s.title,from:s.end,to:i+1<secs.length?secs[i+1].start:txt.length,rows:[]}));
  const pre={i:-1,title:"(Tanpa seksi)",from:0,to:secs.length?secs[0].start:txt.length,rows:[]};
  rows.forEach(r=>{if(r.unm||r.start==null)return;const x=g.find(y=>r.start>=y.from&&r.start<y.to);(x||pre).rows.push(r)});
  return[pre,...g];
}
function toggleDone(id){const r=rows.find(x=>x.id===id);if(!r)return;r.done=!r.done;persist();render()}
function svGo(dl){
  const v=rows.filter(matchF);if(!v.length)return;
  const c=v.findIndex(r=>r.id===selId),n=c<0?(dl>0?0:v.length-1):Math.min(Math.max(c+dl,0),v.length-1);
  selId=v[n].id;render();focusSel("both");
}
function svKeys(e){
  if(S.view!=="script"||!rows.length||e.ctrlKey||e.metaKey||e.altKey)return;
  if($("modal").classList.contains("open"))return;
  const t=e.target,tag=t&&t.tagName;
  if(tag==="INPUT"||tag==="TEXTAREA"||tag==="SELECT"||(t&&t.isContentEditable))return;
  const k=e.key;
  if(k==="ArrowDown"||k==="j"||k==="J"){e.preventDefault();svGo(1)}
  else if(k==="ArrowUp"||k==="k"||k==="K"){e.preventDefault();svGo(-1)}
  else if((k===" "||k==="d"||k==="D")&&tag!=="BUTTON"&&tag!=="A"&&tag!=="MARK"){if(!selId)return;e.preventDefault();toggleDone(selId)}
  else if(k==="Escape"&&selId&&!document.querySelector(".lb")){selId="";render()}
}
document.addEventListener("keydown",svKeys);
function markLeft(){
  const st=$("status");
  if(!selId){st.className="status err";st.textContent="Pilih scene dulu (klik blok di skrip), lalu tekan Tandai sampai sini.";return}
  curLeft=selId;persist();render();st.className="status";st.textContent="Penanda berhenti disimpan di scene "+(rows.findIndex(r=>r.id===selId)+1)+".";
}
function resumeLeft(){
  const st=$("status"),ix=curLeft?rows.findIndex(r=>r.id===curLeft):-1;
  const t=rows.slice(ix+1).find(r=>!r.done&&matchF(r))||rows.find(r=>!r.done&&matchF(r));
  if(!t){st.className="status";st.textContent="Semua scene yang tampil sudah selesai.";return}
  selId=t.id;render();focusSel("both");st.className="status";st.textContent="Lanjut di scene "+(rows.indexOf(t)+1)+".";
}
function addSceneFrom(a,b){
  const vo=scr().slice(a,b).trim(),st=$("status");if(!vo)return;
  if($("prov").value!=="manual"&&!$("key").value.trim()){st.className="status err";st.textContent="Isi API key dulu untuk membuat scene baru.";openSettings("engine");return}
  const r={id:"r"+Math.random().toString(36).slice(2,9),vo,shot_type:"",scene:"",how_to_get:"",ai_prompt:"",flags:[],extra_sources:[],manual:true,start:a,end:b,unm:false};
  let i=rows.findIndex(x=>!x.unm&&x.start!=null&&x.start>a);if(i<0)i=rows.length;
  rows.splice(i,0,r);selId=r.id;render();persist();return regen(r);
}
function scriptView(){
  ensureIds();ensureAnchors();
  if(selId&&!rows.some(r=>r.id===selId))selId="";
  if(curLeft&&!rows.some(r=>r.id===curLeft))curLeft="";
  const txt=scr(),secs=svSecs(txt),wrap=h("div","sv"),L=h("div","sv-l card"),R=h("div","sv-r"),box=h("div","sv-txt");
  const unm=rows.filter(r=>r.unm||r.start==null),mapped=rows.filter(r=>!r.unm&&r.start!=null).sort((a,b)=>a.start-b.start);
  let pos=0,cov=0;
  mapped.forEach(r=>{
    if(r.start<pos)return;
    if(r.start>pos)svPlain(box,txt,pos,r.start,secs);
    const n=rows.indexOf(r)+1,m=h("mark","mk c-"+catOf(r.shot_type));
    m.dataset.mid=r.id;m.tabIndex=0;m.setAttribute("role","button");
    m.title="Scene "+n+" · "+(r.shot_type||"-")+(r.done?" · selesai":"");
    if(r.done)m.classList.add("done");if(r.id===selId)m.classList.add("sel");if(!matchF(r))m.classList.add("off");
    m.append(document.createTextNode(txt.slice(r.start,r.end)),h("sup","mn",String(n)));
    box.append(m);
    if(r.id===curLeft)box.append(h("span","lo","◂ berhenti di sini"));
    pos=r.end;cov+=txt.slice(r.start,r.end).replace(/\s/g,"").length;
  });
  if(pos<txt.length)svPlain(box,txt,pos,txt.length,secs);
  box.onclick=e=>{const m=e.target&&e.target.closest&&e.target.closest("mark");if(m)selectRow(m.dataset.mid,"mark")};
  box.onkeydown=e=>{if(e.target.tagName!=="MARK")return;if(e.key==="Enter"){e.preventDefault();selectRow(e.target.dataset.mid,"mark")}else if(e.key===" "){e.preventDefault();toggleDone(e.target.dataset.mid)}};
  const tools=h("div","sv-tools"),b1=h("button",null,"Lanjutkan dari terakhir"),b2=h("button",null,"Tandai sampai sini");b1.type="button";b2.type="button";b1.onclick=resumeLeft;b2.onclick=markLeft;
  tools.append(b1,b2,h("span","dur","↑↓ pindah scene · D atau Spasi = selesai · Esc batal pilih · arahkan kursor ke teks tanpa warna untuk menambah scene (＋)"));
  L.append(tools,box);
  const tot=Math.max(txt.replace(/^\s*\[[^\]\n]{1,60}\]\s*$/gm,"").replace(/\s/g,"").length,1),pct=Math.min(100,Math.round(cov/tot*100));
  const bar=h("div","sv-bar"),lgd=h("div","legend"),chips=h("div","chips");
  const lg=(key,label,count)=>{const b=h("button","lg"+(svTf===key?" on":"")+(key!=="all"?" c-"+key:""));b.type="button";b.append(h("i"),document.createTextNode(label+" "+count));b.onclick=()=>{svTf=(svTf===key&&key!=="all")?"all":key;render()};return b};
  lgd.append(lg("all","Semua",rows.length));
  CAT.forEach(([k,l])=>{const c=rows.filter(r=>catOf(r.shot_type)===k).length;if(c)lgd.append(lg(k,l,c))});
  const dn=rows.filter(r=>r.done).length,fc=rows.filter(r=>r.flags&&r.flags.length).length,ev=rows.filter(r=>/ENVATO/i.test(r.shot_type)&&!r.envato_url&&!/envato\.com\/\S+/i.test(r.how_to_get||"")).length;
  [["Diterapkan",dn+"/"+rows.length,""],["Perlu cek",fc,fc?"warn":""],["Menunggu URL Envato",ev,ev?"warn":""],["Cakupan skrip",pct+"%",""]].forEach(([a,b,c])=>chips.append(h("span","chip "+c,a+" "+b)));
  if(unm.length)chips.append(h("span","chip warn","Tidak terpetakan "+unm.length));
  bar.append(lgd,chips);
  const kids=[bar];
  if(secs.length){
    const toc=h("div","toc");
    svSections(txt,secs).forEach(g=>{
      if(g.i<0&&!g.rows.length)return;
      const d=g.rows.filter(r=>r.done).length,n=g.rows.length,all=n>0&&d===n,w=h("div","tocw"),tb=h("button","tocb"),ck=h("button","tocck"+(all?" on":""),"✓");
      tb.type="button";ck.type="button";tb.append(document.createTextNode(g.title.replace(/^\[|\]$/g,"")+" "),h("b",null,d+"/"+n));
      tb.style.setProperty("--p",(n?d/n*100:0)+"%");
      tb.onclick=()=>{const el=g.i>=0?document.querySelector('.sec[data-sec="'+g.i+'"]'):null;if(el)el.scrollIntoView({behavior:"smooth",block:"start"});else if(L.scrollTo)L.scrollTo({top:0,behavior:"smooth"})};
      ck.title=all?"Batalkan tanda selesai untuk semua scene di seksi ini":"Tandai semua scene di seksi ini selesai";ck.disabled=!n;
      ck.onclick=()=>{g.rows.forEach(r=>{r.done=!all});persist();render()};
      w.append(tb,ck);toc.append(w);
    });
    kids.push(toc);
  }
  const inp=document.createElement("input");inp.id="svq";inp.type="search";inp.placeholder="Cari di scene: VO, scene, how-to, catatan…";inp.value=svQ;inp.oninput=()=>{svQ=inp.value;render()};
  const list=h("div","sv-list");let shown=0;
  rows.forEach((r,i)=>{if(!matchF(r))return;shown++;list.append(svCard(r,i))});
  if(!shown)list.append(h("p","status","Tidak ada scene yang cocok dengan filter."));
  R.append(inp,list);wrap.append(...kids,L,R);return wrap;
}
function selectRow(id,from){selId=(selId===id&&from==="card")?"":id;render();focusSel(from)}
function focusSel(from){
  requestAnimationFrame(()=>{
    if(!selId)return;
    const m=document.querySelector('mark[data-mid="'+selId+'"]'),c=document.querySelector('.scn[data-mid="'+selId+'"]');
    if((from==="card"||from==="both")&&m){m.scrollIntoView({block:from==="both"?"nearest":"center",behavior:"smooth"});m.classList.add("pulse");setTimeout(()=>m.classList.remove("pulse"),1200)}
    if((from==="mark"||from==="both")&&c)c.scrollIntoView({block:"nearest",behavior:"smooth"});
  });
}
function updateCount(){const c=$("cnt");if(c)c.textContent=rows.filter(r=>r.done).length+" dari "+rows.length+" sudah diterapkan"}
function render(){
  const out=$("out");const _sl=document.querySelector(".sv-l"),_sr=document.querySelector(".sv-r"),_keep=(_sl&&_sr)?[_sl.scrollTop,_sr.scrollTop]:null,_fq=!!(document.activeElement&&document.activeElement.id==="svq");out.replaceChildren();$("exp").hidden=!rows.length;const SC=nz($("script").value);rows.forEach(r=>{r.flags=check(r,SC)});
  if(!rows.length){seen=0;out.append(emptyView());return}
  const bar=h("div","bar"),sel=document.createElement("select"),cnt=h("span","dur","");cnt.id="cnt";
  [["all","Semua baris"],["todo","Belum diterapkan"],["done","Sudah diterapkan"]].forEach(([v,l])=>{const o=h("option",null,l);o.value=v;sel.append(o)});
  sel.value=flt;sel.setAttribute("aria-label","Filter status penerapan");sel.onchange=()=>{flt=sel.value;render()};
  const pn=pendingTr().length,trb=h("button",null,"Terjemahkan yang belum ("+pn+")");trb.type="button";trb.disabled=!pn;
  trb.title="Terjemahkan VO ke "+trName()+" untuk baris yang belum punya terjemahan"+(S.trAuto?"":" (termasuk Scene dan How to get it)");
  trb.onclick=()=>{const t=pendingTr();if(t.length)bulkTranslate(t,!S.trAuto)};
  bar.append(sel,cnt,h("span","dur",insights()),trb);out.append(bar);
  if(S.view==="script"){out.append(scriptView());updateCount();seen=rows.length;if(_keep){const a=document.querySelector(".sv-l"),b=document.querySelector(".sv-r");if(a&&b){a.scrollTop=_keep[0];b.scrollTop=_keep[1]}}if(_fq){const i=$("svq");if(i){i.focus();try{i.setSelectionRange(i.value.length,i.value.length)}catch(e){}}}return}
  const t=h("table","gt"),hd=h("thead"),hr=h("tr"),th0=h("th",null,"✓");th0.title="Sudah diterapkan di video";hr.append(th0);
  COL5.forEach(c=>hr.append(h("th",null,c[1])));hd.append(hr);t.append(hd);
  const tb=h("tbody");let shown=0;
  rows.forEach(r=>{
    if((flt==="todo"&&r.done)||(flt==="done"&&!r.done))return;shown++;
    const tr=h("tr");if(r.done)tr.className="dn";{const ix=rows.indexOf(r);if(ix>=seen){tr.classList.add("new");tr.style.setProperty("--i",Math.min(ix-seen,10))}}
    const c0=h("td","ck"),cb=document.createElement("input");cb.type="checkbox";cb.checked=!!r.done;cb.setAttribute("aria-label","Sudah diterapkan");
    cb.onchange=()=>{r.done=cb.checked;tr.classList.toggle("dn",cb.checked);updateCount();persist()};
    c0.append(cb);tr.append(c0);
    COL5.forEach(([k])=>{const td=h("td");fillCell(td,r,k);tr.append(td)});
    tb.append(tr)});
  if(!shown){const tr=h("tr"),td=h("td",null,"Tidak ada baris yang cocok dengan filter.");td.colSpan=6;tr.append(td);tb.append(tr)}
  t.append(tb);const w=h("div","tw");w.append(t);out.append(w);updateCount();seen=rows.length;
}
function ingest(res,c,i,warn){
  const arr=Array.isArray(res)?res:(res&&res.rows)||[],n=nz(c);let cov=0;
  arr.forEach(x=>{const r={};COL5.forEach(([k])=>r[k]=String(x[k]==null?"":x[k]));r.source_url=String(x.source_url||"");r.search_query=String(x.search_query||"");r.page_query=String(x.page_query||"");r.target_site=String(x.target_site||"");r.web=searchOn();r.vo_tr=String(x.vo_tr||r.vo_tr||"");r.how_tr=String(x.how_tr||"");r.extra_sources=Array.isArray(x.extra_sources)?x.extra_sources.filter(e=>e&&typeof e.url==="string").map(e=>({label:String(e.label||"Sumber"),url:e.url})):[];r.done=false;r.flags=check(r,n);cov+=nz(r.vo).length;rows.push(r)});
  if(cov<n.length*0.9)warn.push("bagian "+(i+1)+" baru mencakup "+Math.round(cov/Math.max(n.length,1)*100)+"% skrip");
}
function finishMsg(warn){
  const fl=rows.filter(r=>r.flags.length).length,ev=rows.filter(r=>/ENVATO/i.test(r.shot_type)).length;
  $("status").className="status";
  $("status").textContent="Selesai: "+rows.length+" baris, Envato "+Math.round(ev/Math.max(rows.length,1)*100)+"%, "+fl+" baris perlu dicek (tanda merah)."+(warn.length?" Peringatan: "+warn.join("; ")+".":"");
}
let man=null;
function manShow(){
  $("manual").hidden=false;$("mtitle").textContent=man.one?man.one.title:"Bagian "+(man.i+1)+" dari "+man.cs.length;
  $("mpaste").value="";$("mprompt").hidden=true;$("mcopy").textContent=man.one?"Salin prompt":"Salin prompt bagian "+(man.i+1);
  $("manual").scrollIntoView({behavior:"smooth",block:"nearest"});
}
async function manCopy(){
  if(!man)return;
  const t=man.one?man.one.prompt:buildPrompt(man.cs[man.i],man.i,man.cs.length),st=$("status");
  try{await navigator.clipboard.writeText(t);st.className="status";st.textContent="Prompt tersalin. Tempel di ChatGPT atau Claude."}
  catch(e){const a=$("mprompt");a.value=t;a.hidden=false;a.select();st.className="status err";st.textContent="Tidak bisa menyalin otomatis. Salin teks yang tampil di kartu secara manual."}
}
function manApply(){
  if(!man)return;const st=$("status");
  try{
    const res=parseJ($("mpaste").value);
    if(man.one){const o=man.one;man=null;$("manual").hidden=true;const m=o.apply(res);st.className="status";st.textContent=typeof m==="string"?m:o.title+": selesai.";return}
    ingest(res,man.cs[man.i],man.i,man.warn);render();man.i++;
    if(man.i<man.cs.length){manShow();st.className="status";st.textContent="Bagian "+man.i+" masuk. Lanjut ke bagian "+(man.i+1)+" dari "+man.cs.length+"."}
    else{const w=man.warn;man=null;$("manual").hidden=true;finishMsg(w);saveEntry()}
  }catch(e){st.className="status err";st.textContent="Jawaban tidak bisa dibaca: "+((e&&e.message)||"pastikan yang ditempel berupa array JSON")}
}
$("mcopy").onclick=manCopy;$("mapply").onclick=manApply;
$("mcancel").onclick=()=>{man=null;$("manual").hidden=true;if(rows.length)saveEntry();$("status").className="status";$("status").textContent="Mode salin-tempel dibatalkan."};
async function run(){
  const text=$("script").value.trim(),st=$("status");
  if(!text){st.className="status err";st.textContent="Isi skrip dulu.";return}
  if($("prov").value==="manual"){rows=[];curId=null;curScript=text;selId="";curLeft="";render();man={cs:chunks(text),i:0,warn:[]};manShow();st.className="status";st.textContent="Mode salin-tempel: ikuti langkah di kartu di atas tabel.";return}
  if(!$("key").value.trim()){st.className="status err";st.textContent="Isi API key dulu untuk penyedia AI yang dipilih.";openSettings("engine");return}
  const cs=chunks(text),warn=[];rows=[];curId=null;busy=true;curScript=text;selId="";curLeft="";render();$("run").disabled=true;st.className="status";
  try{
    for(let i=0;i<cs.length;i++){
      if(i>0&&(+S.delay||0)>0){st.textContent="Jeda "+S.delay+" detik sebelum bagian "+(i+1)+"...";await new Promise(r=>setTimeout(r,S.delay*1000))}
      $("pbar").style.width=(i/cs.length*100)+"%";st.textContent="Menyusun bagian "+(i+1)+" dari "+cs.length+"...";
      const res=await callRetry(buildPrompt(cs[i],i,cs.length));
      const arr=Array.isArray(res)?res:(res&&res.rows)||[],n=nz(cs[i]);let cov=0;
      arr.forEach(x=>{const r={};COL5.forEach(([k])=>r[k]=String(x[k]==null?"":x[k]));r.source_url=String(x.source_url||"");r.search_query=String(x.search_query||"");r.page_query=String(x.page_query||"");r.target_site=String(x.target_site||"");r.web=searchOn();r.vo_tr=String(x.vo_tr||r.vo_tr||"");r.how_tr=String(x.how_tr||"");r.extra_sources=Array.isArray(x.extra_sources)?x.extra_sources.filter(e=>e&&typeof e.url==="string").map(e=>({label:String(e.label||"Sumber"),url:e.url})):[];r.done=false;r.flags=check(r,n);cov+=nz(r.vo).length;rows.push(r)});
      if(cov<n.length*0.9)warn.push("bagian "+(i+1)+" baru mencakup "+Math.round(cov/n.length*100)+"% skrip");
      render();
    }
    const fl=rows.filter(r=>r.flags.length).length,ev=rows.filter(r=>/ENVATO/i.test(r.shot_type)).length;
    st.textContent="Selesai: "+rows.length+" baris, Envato "+Math.round(ev/Math.max(rows.length,1)*100)+"%, "+fl+" baris perlu dicek (tanda merah)."+(warn.length?" Peringatan: "+warn.join("; ")+".":"");
  }catch(e){
    st.className="status err";st.textContent="Gagal"+(e&&e.code?" ("+e.code+")":"")+": "+((e&&e.message)||"coba lagi")+(rows.length?". Hasil sebagian tetap ditampilkan.":"");
  }
  if(rows.length)saveEntry();
  busy=false;if(!rows.length)render();autoFill();$("pbar").style.width="100%";setTimeout(()=>{$("pbar").style.width="0"},700);
  $("run").disabled=false;
}
function dl(name,blob){const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000)}
async function xlsx(){
  if(!window.ExcelJS){$("status").className="status err";$("status").textContent="Pustaka Excel gagal dimuat. Cek koneksi atau pakai CSV.";return}
  const wb=new ExcelJS.Workbook(),ws=wb.addWorksheet("FOOTAGE GUIDE",{views:[{state:"frozen",ySplit:1}]});
  ws.columns=COL5.map(c=>({header:c[1],key:c[0],width:c[2]})).concat([{header:"LINK 1",key:"l1",width:16},{header:"LINK 2",key:"l2",width:16},{header:"LINK 3",key:"l3",width:16},{header:"DONE",key:"done",width:8},{header:"NOTE",key:"note",width:30}].concat(rows.some(x=>x.vo_tr)?[{header:"VO TRANSLATION",key:"vo_tr",width:46}]:[],rows.some(x=>x.how_tr)?[{header:"HOW TO GET TRANSLATION",key:"how_tr",width:60}]:[]));
  rows.forEach(r=>{const L=srcLinks(r).slice(0,3),row=ws.addRow(COL5.map(c=>r[c[0]]).concat([0,1,2].map(i=>L[i]?{text:L[i][0],hyperlink:L[i][1]}:""),[r.done?"✓":"",r.note||""].concat(rows.some(x=>x.vo_tr)?[r.vo_tr||""]:[],rows.some(x=>x.how_tr)?[r.how_tr||""]:[])));[6,7,8].forEach((c,i)=>{if(L[i])row.getCell(c).font={color:{argb:"FF0563C1"},underline:true}})});
  ws.autoFilter="A1:"+String.fromCharCode(74+(rows.some(x=>x.vo_tr)?1:0)+(rows.some(x=>x.how_tr)?1:0))+"1";
  ws.eachRow((row,i)=>row.eachCell(c=>{c.alignment={wrapText:true,vertical:"top"};if(i===1){c.font={bold:true};c.fill={type:"pattern",pattern:"solid",fgColor:{argb:"FFE5E7EB"}}}}));
  const s2=wb.addWorksheet("SHOT MIX SUMMARY");s2.columns=[{header:"SHOT TYPE",width:40},{header:"NUMBER OF SCENES",width:20},{header:"APPROXIMATE %",width:18}];
  mix().forEach(([k,v])=>s2.addRow([k,v,Math.round(v/rows.length*100)+"%"]));s2.getRow(1).font={bold:true};
  dl("footage-guide.xlsx",new Blob([await wb.xlsx.writeBuffer()],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}));
}
const HK="sb_hist_v1";let curId=null,pt=null;
function loadHist(){try{const a=JSON.parse(localStorage.getItem(HK)||"[]");return Array.isArray(a)?a:[]}catch(e){return[]}}
function storeHist(a){
  if(!a.length){try{localStorage.removeItem(HK)}catch(e){}return true}
  while(a.length){try{localStorage.setItem(HK,JSON.stringify(a));return true}catch(e){a.pop()}}
  return false;
}
function snap(){return{style:$("style").value,vmode:$("vmode").value,topic:$("topic").value,aiplat:$("aiplat").value,special:$("special").value,rules:$("rules").value,preset:$("preset").value,sel:SEL.slice()}}
function saveEntry(){
  if(!rows.length)return;
  const a=loadHist(),data={script:curScript||$("script").value,leftOff:curLeft,set:snap(),rows:rows.map(r=>({...r}))};
  const e=a.find(x=>x.id===curId);
  if(e)Object.assign(e,data);
  else{
    curId=Date.now().toString(36);
    const sc=$("script").value.trim().replace(/\s+/g," ");
    a.unshift({id:curId,t:Date.now(),title:$("topic").value.trim()||sc.slice(0,50)||"Tanpa judul",...data});
  }
  a.splice(+S.hmax||30);
  if(!storeHist(a)){$("status").className="status err";$("status").textContent="Riwayat tidak bisa disimpan: penyimpanan browser penuh. Hapus beberapa riwayat lama."}
  renderHist();
}
function persist(){clearTimeout(pt);pt=setTimeout(()=>{if(curId)saveEntry()},700)}
const fmt=t=>new Date(t).toLocaleString("id-ID",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
function renderHist(){
  const a=loadHist(),box=$("hist");box.replaceChildren();$("histclear").hidden=!a.length;
  if(!a.length){box.append(h("p","status","Belum ada riwayat. Hasil tersimpan otomatis setelah footage guide dibuat."));return}
  a.forEach(e=>{
    const d=h("div","hi"),ac=h("div","acts"),o=h("button",null,"Buka"),x=h("button","del","Hapus");o.type="button";x.type="button";
    d.append(h("b",null,e.title),h("small",null,fmt(e.t)+" · "+e.rows.length+" baris"));
    o.onclick=()=>openEntry(e.id);
    x.onclick=()=>{if(!confirm('Hapus riwayat "'+e.title+'"?'))return;storeHist(loadHist().filter(y=>y.id!==e.id));if(curId===e.id)curId=null;renderHist()};
    ac.append(o,x);d.append(ac);box.append(d);
  });
}
function openEntry(id){
  const e=loadHist().find(x=>x.id===id);if(!e)return;
  $("script").value=e.script||"";curScript=e.script||"";selId="";curLeft=e.leftOff||"";const t=e.set||{};
  ["style","vmode","topic","aiplat","special","rules","preset"].forEach(k=>{if(t[k]!=null)$(k).value=t[k]});
  if(Array.isArray(t.sel)){t.sel.forEach(n=>{if(!SRC.includes(n))SRC.push(n)});SEL=t.sel.slice();saveSrc();renderSrc()}
  rows=e.rows.map(r=>({...r,flags:r.flags||[]}));curId=e.id;seen=0;render();
  $("status").className="status";$("status").textContent='Membuka riwayat "'+e.title+'" ('+fmt(e.t)+'). Perubahan di tabel tersimpan otomatis.';
  $("out").scrollIntoView({behavior:"smooth",block:"start"});
}
$("histclear").onclick=()=>{if(!confirm("Hapus SEMUA riwayat? Tindakan ini tidak bisa dibatalkan."))return;storeHist([]);curId=null;renderHist()};
function masterText(){return $("mpx").value.trim()||MASTER}
function ctxNote(){
  if(!rows.length)return"";
  const ev=rows.filter(r=>/ENVATO/i.test(r.shot_type)).length;
  return "\n\nKONTEKS BAGIAN SEBELUMNYA (jaga variasi shot dan target Envato "+S.envMin+"-"+S.envMax+"% untuk seluruh video): sejauh ini "+rows.length+" baris ("+mix().map(([k,v])=>k+" "+v).join(", ")+"); ENVATO "+Math.round(ev/rows.length*100)+"%. 3 baris terakhir bertipe: "+rows.slice(-3).map(r=>r.shot_type).join(" > ")+".";
}
async function callRetry(p){
  for(let a=1;;a++){
    try{return await callAI(p)}
    catch(e){
      const c=e&&e.code,msg=String((e&&e.message)||""),st=$("status");
      if(c===429&&$("prov").value==="gemini"&&gsOn()){
        gsOff=true;
        p=p.replace("Kamu boleh menelusuri web untuk memverifikasi sumber, dan tidak membuat Excel.","Kamu tidak bisa browsing web dan tidak membuat Excel.").replace(/\n- Karena kamu bisa menelusuri web:[^\n]*/,"");
        st.className="status";st.textContent="Pencarian web Google tidak tersedia di paket Anda (kuota 0). Dilanjutkan tanpa pencarian...";a--;continue;
      }
      if(c===429){
        const m=/retry in ([\d.]+)s/i.exec(msg);
        if(m&&+m[1]<=65&&a<=(+S.retry||0)){st.className="status";st.textContent="Batas per menit tercapai. Menunggu "+Math.ceil(+m[1])+" detik...";await new Promise(r=>setTimeout(r,(+m[1]+1)*1000));continue}
        throw e;
      }
      const ok=c==="format"||c==="jaringan"||c===500||c===503||c===529||e instanceof SyntaxError;
      if(!ok||a>(+S.retry||0))throw e;
      st.className="status";st.textContent="Mencoba ulang ("+a+"/"+(+S.retry||0)+")...";await new Promise(r=>setTimeout(r,1500*a));
    }
  }
}
async function ask(title,prompt,apply){
  const st=$("status");st.className="status";
  if($("prov").value==="manual"){man={cs:[""],i:0,warn:[],one:{title,prompt,apply}};manShow();st.textContent="Ikuti langkah di kartu di atas tabel.";return "manual"}
  st.textContent=title+"...";
  try{const m=apply(await callRetry(prompt));st.textContent=typeof m==="string"?m:title+": selesai.";return true}
  catch(e){st.className="status err";st.textContent="Gagal"+(e&&e.code?" ("+e.code+")":"")+": "+((e&&e.message)||"coba lagi");return false}
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function restoreRow(r){if(r.how_orig===undefined)return;r.how_to_get=r.how_orig;if(r.scene_orig!=null)r.scene=r.scene_orig;delete r.how_orig;delete r.scene_orig;render();persist()}
function applyTr(r,x,full){
  const n2=t=>String(t).replace(/\s+/g," ").trim(),hs=r.how_orig!==undefined?r.how_orig:r.how_to_get,ss=r.scene_orig!==undefined?r.scene_orig:r.scene;
  const nv=String(x.vo_tr||""),nh=full?String(x.how_to_get||"").trim():"",ns=full?String(x.scene||"").trim():"";
  r.trChk=true;
  const diff=full&&((nh&&n2(nh)!==n2(hs))||(ns&&n2(ns)!==n2(ss)));
  if(!nv&&!diff)return "same";
  if(diff&&r.how_orig===undefined){r.how_orig=r.how_to_get;r.scene_orig=r.scene}
  r.vo_tr=nv;if(diff){if(nh)r.how_to_get=nh;if(ns)r.scene=ns}
  return "ok";
}
function bulkPrompt(b,full,T){
  const items=b.map(r=>{const i=rows.indexOf(r)+1,hs=r.how_orig!==undefined?r.how_orig:r.how_to_get,ss=r.scene_orig!==undefined?r.scene_orig:r.scene;return "n="+i+"\nVO: "+r.vo+(full?"\nSCENE: "+ss+"\nHOW TO GET: "+hs:"")}).join("\n---\n");
  return "Terjemahkan ke bahasa "+T+". Balas HANYA array JSON berisi SATU objek untuk SETIAP baris di bawah (jangan ada yang terlewat), urutan sama: [{\"n\":1,\"vo_tr\":\"...\""+(full?",\"scene\":\"...\",\"how_to_get\":\"...\"":"")+"}].\nAturan: (1) vo_tr = terjemahan natural dari VO. "+(full?"(2) scene dan how_to_get = terjemahan SCENE dan HOW TO GET, ditulis seluruhnya dalam bahasa "+T+" tanpa campuran bahasa lain. ":"")+"(3) Pertahankan PERSIS dan jangan diterjemahkan: semua URL, seluruh teks setelah \"PUT TEXT :\" (itu teks yang tampil di video, bahasanya mengikuti VO), serta nama menu, tombol, fitur, dan merek persis seperti di antarmuka aslinya. (4) Pertahankan susunan baris dan penomoran. (5) Jika VO sudah berbahasa "+T+", isi vo_tr dengan string kosong.\n\n"+items;
}
function bulkTranslate(targets,full){
  const T=trName(),size=full?8:20,B=[],tot={ok:0,same:0,miss:0},isMan=$("prov").value==="manual";
  for(let i=0;i<targets.length;i+=size)B.push(targets.slice(i,i+size));
  const msg=()=>"Terjemahan selesai: "+tot.ok+" baris diterjemahkan"+(tot.same?", "+tot.same+" sudah berbahasa "+T:"")+(tot.miss?", "+tot.miss+" tidak dijawab AI (tekan tombol lagi)":"")+".";
  const one=k=>{
    const b=B[k],last=k===B.length-1;
    return ask("Menerjemahkan batch "+(k+1)+" dari "+B.length+" ke "+T,bulkPrompt(b,full,T),res=>{
      const arr=Array.isArray(res)?res:[];
      b.forEach((r,j)=>{const x=arr.find(y=>(y.n|0)===rows.indexOf(r)+1)||arr[j];if(!x){tot.miss++;return}applyTr(r,x,full)==="ok"?tot.ok++:tot.same++});
      render();persist();
      if(isMan&&!last)setTimeout(()=>one(k+1),0);
      return last?msg():"Batch "+(k+1)+" dari "+B.length+" selesai.";
    });
  };
  (async()=>{
    if(isMan){await one(0);return}
    for(let k=0;k<B.length;k++){if(k>0&&(+S.delay||0)>0)await sleep(S.delay*1000);if(await one(k)===false)break}
  })();
}
function pendingTr(){return rows.filter(r=>!r.vo_tr&&!r.trChk)}
function autoFill(){if(!S.trAuto||$("prov").value==="manual")return;const t=pendingTr();if(t.length)bulkTranslate(t,false)}
function translateRow(r){
  const T=trName(),i=rows.indexOf(r);
  return ask("Menerjemahkan baris "+(i+1)+" ke "+T,bulkPrompt([r],true,T),res=>{
    const x=Array.isArray(res)?res[0]:null;if(!x)throw{message:"Jawaban kosong"};
    const o=applyTr(r,x,true);render();persist();
    if(o==="same")return "Baris "+(i+1)+" sudah berbahasa "+T+", tidak ada yang diterjemahkan.";
    if(r.flags&&r.flags.some(f=>f.indexOf("Terjemahan how-to")===0))return "Baris "+(i+1)+" diterjemahkan, tetapi URL atau teks PUT TEXT tidak identik dengan aslinya. Periksa tanda merah.";
  });
}
function regen(r){
  const i=rows.indexOf(r),pv=rows[i-1],nx=rows[i+1];
  const p=buildPrompt(r.vo,0,1)+"\n\nTUGAS KHUSUS: buat ULANG hanya SATU baris footage guide untuk VO di atas (array JSON berisi satu objek, vo harus sama persis). "+(r.shot_type?"Berikan alternatif yang berbeda dari versi lama ("+r.shot_type+": "+r.scene+"). ":"")+"Baris sebelumnya bertipe "+(pv?pv.shot_type:"-")+", berikutnya "+(nx?nx.shot_type:"-")+"; jaga variasi.";
  ask("Membuat ulang baris "+(i+1),p,res=>{
    const x=Array.isArray(res)?res[0]:null;if(!x)throw{message:"Jawaban kosong"};
    COL5.forEach(([k])=>{if(k!=="vo")r[k]=String(x[k]==null?"":x[k])});
    r.source_url=String(x.source_url||"");r.search_query=String(x.search_query||"");r.page_query=String(x.page_query||"");r.target_site=String(x.target_site||"");r.web=searchOn();r.vo_tr=String(x.vo_tr||r.vo_tr||"");r.how_tr=String(x.how_tr||"");
    r.extra_sources=Array.isArray(x.extra_sources)?x.extra_sources.filter(e=>e&&typeof e.url==="string").map(e=>({label:String(e.label||"Sumber"),url:e.url})):[];
    r.score=0;r.tip="";r.envato_url="";r.vf=false;render();persist();
  });
}
function audit(){
  if(!rows.length)return;
  const lst=rows.slice(0,80).map((r,i)=>(i+1)+" | "+r.vo+" | "+r.shot_type+" | "+r.scene+" | "+(r.how_to_get||"").slice(0,120)).join("\n");
  ask("Evaluasi mutu","Kamu editor video senior. Nilai kecocokan tiap baris footage guide berikut (nomor | VO | tipe shot | scene | sumber) terhadap isi VO: skor 1-5 (5 = sangat cocok, sumber realistis dan relevan) dan satu saran perbaikan singkat (maks 15 kata, bahasa Indonesia, kosong jika skor 5). Balas HANYA array JSON: [{\"n\":1,\"score\":4,\"tip\":\"...\"}].\n\n"+lst,
    res=>{(Array.isArray(res)?res:[]).forEach(x=>{const r=rows[(x.n|0)-1];if(r){r.score=+x.score||0;r.tip=String(x.tip||"")}});render();persist()});
}
function insights(){
  const w=Math.max(+$("wps").value||2.6,0.5),words=rows.reduce((a,r)=>a+r.vo.split(/\s+/).filter(Boolean).length,0),sec=Math.round(words/w);
  const ev=Math.round(rows.filter(r=>/ENVATO/i.test(r.shot_type)).length/Math.max(rows.length,1)*100);
  let run=1,best=1,end=0;
  for(let i=1;i<rows.length;i++){if(rows[i].shot_type&&rows[i].shot_type===rows[i-1].shot_type){run++;if(run>best){best=run;end=i}}else run=1}
  const o=["Estimasi durasi ±"+Math.floor(sec/60)+" mnt "+sec%60+" dtk","Envato "+ev+"%"+(ev<S.envMin||ev>S.envMax?" (target "+S.envMin+"–"+S.envMax+"%)":"")];
  if(best>=4)o.push("Ada "+best+" baris berurutan bertipe sama (baris "+(end-best+2)+"–"+(end+1)+")");
  return o.join(" · ");
}
async function pexels(r,box){
  const k=$("pxkey").value.trim();if(!k){box.textContent="Isi Pexels API key di Pengaturan lanjutan.";return}
  box.textContent="Memuat...";
  try{
    const j=await(await fetch("https://api.pexels.com/videos/search?per_page=4&query="+encodeURIComponent(r.search_query),{headers:{Authorization:k}})).json();
    box.replaceChildren();
    (j.videos||[]).forEach(v=>{const a=h("a"),im=document.createElement("img");im.src=v.image;im.alt="";im.loading="lazy";a.href=v.url;a.target="_blank";a.rel="noopener noreferrer";a.title=(v.duration||"?")+" dtk";a.append(im);box.append(a)});
    if(!box.children.length)box.textContent="Tidak ada hasil.";
  }catch(e){box.textContent="Gagal memuat pratinjau (cek key atau pembatasan browser)."}
}
function tc(sec,f){const n=Math.round((sec+3600)*f),z=x=>String(x).padStart(2,"0");return[Math.floor(n/(3600*f)),Math.floor(n/(60*f))%60,Math.floor(n/f)%60,n%f].map(z).join(":")}
function edl(){
  if(!rows.length)return;
  const w=Math.max(+$("wps").value||2.6,0.5),f=30;let t=0,o="TITLE: Footage Guide\nFCM: NON-DROP FRAME\n\n";
  rows.forEach((r,i)=>{
    const d=Math.max(r.vo.split(/\s+/).filter(Boolean).length/w,1),a=tc(t,f);t+=d;const b=tc(t,f);
    o+=String(i+1).padStart(3,"0")+"  001      V     C        "+a+" "+b+" "+a+" "+b+"\n |C:ResolveColorBlue |M:"+((r.shot_type||"-")+" - "+(r.scene||"")).replace(/[|\n]/g," ").slice(0,120)+" |D:1\n\n";
  });
  dl("footage-guide-markers.edl",new Blob([o],{type:"text/plain"}));
}
try{$("mpx").value=localStorage.getItem("sb_master")||MASTER;$("pxkey").value=localStorage.getItem("sb_px")||"";$("wps").value=localStorage.getItem("sb_wps")||"2.6"}catch(e){$("mpx").value=MASTER}
const MPK="sb_mp_presets_v1";let mpAct="";
try{mpAct=localStorage.getItem("sb_mp_active")||""}catch(e){}
function setAct(v){mpAct=v;try{localStorage.setItem("sb_mp_active",v)}catch(e){}}
function mpList(){try{const a=JSON.parse(localStorage.getItem(MPK)||"[]");return Array.isArray(a)?a:[]}catch(e){return[]}}
function mpStore(a){try{localStorage.setItem(MPK,JSON.stringify(a));return true}catch(e){return false}}
function mpMsg(t,err){const m=$("mpmsg");m.textContent=t;m.style.color=err?"var(--red)":""}
function mpState(){
  const t=$("mpx").value,a=mpList(),p=a.find(x=>x.id===mpAct);
  if(p)return{id:p.id,p,dirty:p.text!==t};
  if(t===MASTER)return{id:"__def"};
  const m=a.find(x=>x.text===t);
  if(m){setAct(m.id);return{id:m.id,p:m,dirty:false}}
  return{id:"__cus"};
}
function mpRefresh(){
  const sel=$("mpsel"),st=mpState(),a=mpList();sel.replaceChildren();
  const add=(v,t)=>{const o=document.createElement("option");o.value=v;o.textContent=t;sel.append(o)};
  add("__def","Bawaan (master prompt Anda)");
  a.forEach(p=>add(p.id,p.name+(st.p&&st.p.id===p.id&&st.dirty?" • diubah":"")));
  if(st.id==="__cus")add("__cus","Kustom (belum disimpan)");
  sel.value=st.id;$("mpupd").disabled=!st.p;$("mpdel").disabled=!st.p;
}
$("mpx").oninput=()=>{try{$("mpx").value===MASTER?localStorage.removeItem("sb_master"):localStorage.setItem("sb_master",$("mpx").value)}catch(e){}mpRefresh()};
$("mpsel").onchange=()=>{
  const v=$("mpsel").value;if(v==="__cus")return;
  if(v==="__def"){setAct("");$("mpx").value=MASTER;$("mpx").oninput();mpMsg("Master prompt bawaan dipakai.");return}
  const p=mpList().find(x=>x.id===v);if(!p)return;
  setAct(p.id);$("mpx").value=p.text;$("mpx").oninput();mpMsg('Preset "'+p.name+'" dipakai.');
};
$("mpsave").onclick=()=>{
  const n=$("mpname").value.trim(),a=mpList();
  if(!n){mpMsg("Isi nama preset dulu.",1);return}
  if(a.some(p=>p.name.toLowerCase()===n.toLowerCase())){mpMsg("Nama sudah dipakai. Pakai nama lain, atau pilih preset itu lalu tekan Perbarui.",1);return}
  if(a.length>=20){mpMsg("Maksimal 20 preset. Hapus yang tidak dipakai.",1);return}
  const id=Date.now().toString(36);a.push({id,name:n,text:$("mpx").value});
  if(!mpStore(a)){mpMsg("Gagal menyimpan: penyimpanan browser penuh.",1);return}
  setAct(id);$("mpname").value="";mpRefresh();mpMsg('Preset "'+n+'" disimpan dan dipilih.');
};
$("mpupd").onclick=()=>{
  const a=mpList(),p=a.find(x=>x.id===mpAct);if(!p)return;
  if(!confirm('Timpa preset "'+p.name+'" dengan isi master prompt saat ini?'))return;
  p.text=$("mpx").value;if(!mpStore(a)){mpMsg("Gagal menyimpan: penyimpanan browser penuh.",1);return}
  mpRefresh();mpMsg('Preset "'+p.name+'" diperbarui.');
};
$("mpdel").onclick=()=>{
  const a=mpList(),p=a.find(x=>x.id===mpAct);if(!p)return;
  if(!confirm('Hapus preset "'+p.name+'"? Tindakan ini tidak bisa dibatalkan.'))return;
  mpStore(a.filter(x=>x.id!==p.id));setAct("");mpRefresh();mpMsg('Preset "'+p.name+'" dihapus. Isi master prompt saat ini tidak berubah.');
};
$("mreset").onclick=()=>{setAct("");$("mpx").value=MASTER;$("mpx").oninput();mpMsg("Dikembalikan ke master prompt bawaan.")};
mpRefresh();
$("pxkey").oninput=()=>{try{localStorage.setItem("sb_px",$("pxkey").value)}catch(e){}};
$("wps").oninput=()=>{try{localStorage.setItem("sb_wps",$("wps").value)}catch(e){}};
$("hexp").onclick=()=>dl("footage-guide-riwayat.json",new Blob([JSON.stringify(loadHist(),null,2)],{type:"application/json"}));
$("himp").onclick=()=>$("hfile").click();
$("hfile").onchange=async()=>{
  const f=$("hfile").files[0];if(!f)return;
  try{const a=JSON.parse(await f.text());if(!Array.isArray(a))throw 0;const cur=loadHist(),ids=new Set(cur.map(x=>x.id));
    a.filter(x=>x&&x.id&&Array.isArray(x.rows)&&!ids.has(x.id)).forEach(x=>cur.push(x));cur.sort((p,q)=>q.t-p.t);cur.splice(+S.hmax||30);storeHist(cur);renderHist();
    $("status").className="status";$("status").textContent="Riwayat diimpor."}
  catch(e){$("status").className="status err";$("status").textContent="File riwayat tidak valid."}
  $("hfile").value="";
};
$("edl").onclick=edl;$("audit").onclick=audit;sc();
renderHist();
$("run").onclick=run;$("xlsx").onclick=xlsx;
$("csv").onclick=()=>{const q=v=>'"'+String(v||"").replace(/"/g,'""')+'"';dl("footage-guide.csv",new Blob(["\ufeff"+[COL5.map(c=>q(c[1])).concat(q("LINKS"),q("DONE"),q("VO TRANSLATION"),q("HOW TRANSLATION")).join(","),...rows.map(r=>COL5.map(c=>q(r[c[0]])).concat(q(srcLinks(r).map(x=>x[1]).join(" | ")),q(r.done?"YES":""),q(r.vo_tr||""),q(r.how_tr||"")).join(","))].join("\n")],{type:"text/csv;charset=utf-8"}))};
$("json").onclick=()=>dl("footage-guide.json",new Blob([JSON.stringify(rows.map(r=>{const o={};COL5.forEach(c=>o[c[0]]=r[c[0]]);o.links=srcLinks(r).map(([label,url])=>({label,url}));o.done=!!r.done;o.vo_tr=r.vo_tr||"";o.how_orig=r.how_orig||"";o.scene_orig=r.scene_orig||"";o.note=r.note||"";o.score=r.score||0;o.tip=r.tip||"";o.verified=!!r.vf;o.envato_url=r.envato_url||"";return o}),null,2)],{type:"application/json"}));
