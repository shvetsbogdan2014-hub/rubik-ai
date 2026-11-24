const names=['U','R','F','D','L','B'];
const colors=[{id:'W',name:'Белый',hex:'#f2f2e9',rgb:[242,242,233]},{id:'Y',name:'Жёлтый',hex:'#f4d21f',rgb:[244,210,31]},{id:'R',name:'Красный',hex:'#d92732',rgb:[217,39,50]},{id:'O',name:'Оранжевый',hex:'#f28b22',rgb:[242,139,34]},{id:'B',name:'Синий',hex:'#2465d8',rgb:[36,101,216]},{id:'G',name:'Зелёный',hex:'#169b58',rgb:[22,155,88]}];
let face='U',selected=4,faces=JSON.parse(localStorage.getItem('rubikFaces')||'{}'),stream=null;
for(const n of names)if(!faces[n])faces[n]=Array(9).fill(null);
const $=id=>document.getElementById(id);
function save(){localStorage.setItem('rubikFaces',JSON.stringify(faces));render()}
function render(){
 $('faces').innerHTML=names.map(n=>`<button class="face ${n===face?'active':''}" data-face="${n}">${n}<br><small>${faces[n].filter(Boolean).length}/9</small></button>`).join('');
 $('faces').querySelectorAll('button').forEach(b=>b.onclick=()=>{face=b.dataset.face;selected=4;render()});
 $('cubeGrid').innerHTML=faces[face].map((c,i)=>`<button class="sticker" data-i="${i}" style="background:${colors.find(x=>x.id===c)?.hex||'#343b48'}">${c||'+'}</button>`).join('');
 $('cubeGrid').querySelectorAll('button').forEach(b=>b.onclick=()=>{selected=+b.dataset.i;render();});
 $('swatches').innerHTML=colors.map(c=>`<button class="swatch" title="${c.name}" data-color="${c.id}" style="background:${c.hex}"></button>`).join('');
 $('swatches').querySelectorAll('button').forEach(b=>b.onclick=()=>{faces[face][selected]=b.dataset.color;save()});
 let html=colors.map(c=>{let count=names.reduce((a,n)=>a+faces[n].filter(x=>x===c.id).length,0);return `<div class="countrow"><span>${c.name}</span><b>${count}/9</b></div>`}).join('');
 $('counts').innerHTML=html;
}
function classify(rgb){return colors.map(c=>({id:c.id,d:Math.hypot(...rgb.map((v,i)=>v-c.rgb[i]))})).sort((a,b)=>a.d-b.d)[0].id}
function scan(img){
 const w=img.naturalWidth||img.videoWidth,h=img.naturalHeight||img.videoHeight;
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,w,h);
 const out=[];
 for(let r=0;r<3;r++)for(let c=0;c<3;c++){
   const x=Math.floor(w*(.22+c*.28)),y=Math.floor(h*(.22+r*.28));
   const d=ctx.getImageData(x,y,1,1).data;out.push(classify([d[0],d[1],d[2]]));
 }
 faces[face]=out;save();$('result').textContent=`Сторона ${face} распознана. Проверьте цвета: классификация пока основана на RGB-эталонах.`;
}
$('photo').onchange=e=>{const f=e.target.files[0];if(!f)return;const im=new Image();im.onload=()=>scan(im);im.src=URL.createObjectURL(f);e.target.value=''};
$('cameraBtn').onclick=async()=>{try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false});$('video').srcObject=stream;$('cameraBox').classList.add('show')}catch(e){$('result').textContent='Не удалось открыть камеру. Разрешите доступ или используйте фото.'}};
$('snap').onclick=()=>scan($('video'));
$('stop').onclick=()=>{stream?.getTracks().forEach(t=>t.stop());stream=null;$('cameraBox').classList.remove('show')};
$('solve').onclick=()=>{
 const complete=names.every(n=>faces[n].every(Boolean));
 const counts=colors.map(c=>names.reduce((a,n)=>a+faces[n].filter(x=>x===c.id).length,0));
 if(!complete){$('result').textContent='Заполните все 54 клетки на шести сторонах.';return}
 if(counts.some(n=>n!==9)){$('result').textContent='Некорректное состояние: каждого цвета должно быть ровно 9. Исправьте клетки.';return}
 $('result').textContent='Цвета распределены по 9 штук. Это ещё не проверка физической достижимости кубика: модуль Kociemba пока не подключён, поэтому ходы не генерируются.';
};
render();