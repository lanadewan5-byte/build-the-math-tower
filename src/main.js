import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const $=id=>document.getElementById(id);
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9bdcf4);scene.fog=new THREE.Fog(0x9bdcf4,38,115);
const camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,220);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;document.body.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xdff6ff,0x66805c,2));
const sun=new THREE.DirectionalLight(0xfff2d2,3.1);sun.position.set(-22,35,18);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-42;sun.shadow.camera.right=42;sun.shadow.camera.top=42;sun.shadow.camera.bottom=-42;scene.add(sun);
const mat=(color,roughness=.78)=>new THREE.MeshStandardMaterial({color,roughness});
const mats={grass:mat(0x65bd75),road:mat(0x39495c),line:mat(0xf8d46b),concrete:mat(0xb9c7d2),blue:mat(0x2f80c9),orange:mat(0xff9f43),yellow:mat(0xffd34e),red:mat(0xef6470),green:mat(0x36c9a0),white:mat(0xf5f8fc),dark:mat(0x243b53),glass: new THREE.MeshStandardMaterial({color:0x83d5ef,metalness:.25,roughness:.2})};
function box(w,h,d,material,x,y,z,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function cylinder(rt,rb,h,material,x,y,z,parent=scene){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,16),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
const ground=box(180,.5,180,mats.grass,0,-.35,0);ground.receiveShadow=true;
box(180,.12,9,mats.road,0,-.04,7);box(9,.12,180,mats.road,-13,-.04,0);
for(let i=-85;i<90;i+=9){box(3,.025,.18,mats.line,i,.03,7);box(.18,.025,3,mats.line,-13,.03,i)}
// sidewalk, site and fences
box(24,.35,22,mats.concrete,0,.02,-7);box(20,.2,18,mat(0xd5e0e6),0,.3,-7);
for(let x=-11;x<=11;x+=2)for(let z=-16;z<=2;z+=2)box(.13,1.1,.13,mats.orange,x,.95,z);
for(const [x,z,w,d] of [[-11,-7,.15,18],[11,-7,.15,18], [0,-16,22,.15]])box(w,1.1,d,mats.orange,x,.95,z);
// buildings around town
const buildingColors=[0xffc46b,0x7cc8df,0x9c9be8,0xf18d9a,0x9bd6b3];
for(let i=0;i<16;i++){const side=i%2===0?-1:1;const x=side*(23+(i%4)*8),z=-35+Math.floor(i/2)*12,h=8+(i%5)*3,w=7+(i%3)*2;box(w,h,7,mat(buildingColors[i%5]),x,h/2-.1,z);for(let y=2;y<h-1;y+=2.6)for(let xx=-w/2+1;xx<w/2;xx+=2){box(.9,1.2,.08,mats.glass,x+xx,y,z+3.54)}box(w+.5,.4,7.5,mats.white,x,h,z)}
// trees
for(let i=0;i<18;i++){const x=(i%2?1:-1)*(18+(i%4)*7),z=-30+Math.floor(i/2)*8;cylinder(.22,.32,1.8,mat(0x805a3a),x,.9,z);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.5,1),mat(0x2ca66b));crown.position.set(x,2.7,z);crown.castShadow=true;scene.add(crown)}
// tower foundation and building blocks
const towerBase= new THREE.Group();scene.add(towerBase);box(7,.6,7,mat(0x566b7a),0,.72,-7,towerBase);box(5.8,.25,5.8,mats.yellow,0,1.12,-7,towerBase);
const towerBlocks=[];const blockMaterials=[mats.blue,mats.orange,mats.green,mats.red,mats.yellow];
function addTowerBlock(index,label){const g=new THREE.Group();const body=box(5.5,1.25,5.5,blockMaterials[index%5],0,0,0,g);body.material=body.material.clone();body.material.roughness=.52;const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(5.5,1.25,5.5)),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.55}));g.add(edge);g.position.set(0,1.85+index*1.28,-7);g.scale.set(.01,.01,.01);scene.add(g);towerBlocks.push(g);return g}
// crane
const crane=new THREE.Group();crane.position.set(-7,0,-8);scene.add(crane);
box(1.2,.8,1.2,mats.dark,0,.7,0,crane);box(.5,12,.5,mats.yellow,0,6.8,0,crane);box(13,.45,.55,mats.orange,5,12.6,0,crane);box(3,.65,.7,mats.dark,-1.7,12.2,0,crane);box(4,.35,.4,mats.blue,8.5,12.25,0,crane);
const cable=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,1,8),mats.dark);cable.position.set(9,11.5,0);crane.add(cable);
const hook=new THREE.Group();hook.position.set(9,11,0);crane.add(hook);cylinder(.12,.12,.5,mats.dark,0,-.25,0,hook);const hookTip=new THREE.Mesh(new THREE.TorusGeometry(.22,.07,8,16,Math.PI*1.5),mats.yellow);hookTip.rotation.z=Math.PI;hookTip.position.y=-.55;hook.add(hookTip);
const clouds=[];for(let i=0;i<8;i++){const g=new THREE.Group();for(let j=0;j<4;j++){const c=new THREE.Mesh(new THREE.SphereGeometry(1.6-j*.12,12,10),new THREE.MeshStandardMaterial({color:0xffffff,roughness:1}));c.position.set(j*1.4,Math.sin(j)*.3,0);g.add(c)}g.position.set(-50+i*17,23+(i%3)*5,-45-(i%2)*25);scene.add(g);clouds.push(g)}
// player blocky avatar
const player=new THREE.Group();scene.add(player);player.position.set(0,0,15);
const skin=mat(0xffd1a6),shirt=mat(0x2878d0),pants=mat(0x243c67),hair=mat(0x49352d);
const torso=box(1.05,1.15,.55,shirt,0,1.55,0,player);box(.7,.7,.65,skin,0,2.5,0,player);box(.72,.2,.67,hair,0,2.83,-.02,player);
const armL=box(.34,1,.36,shirt,-.72,1.6,0,player),armR=box(.34,1,.36,shirt,.72,1.6,0,player);
const legL=box(.42,.9,.45,pants,-.28,.48,0,player),legR=box(.42,.9,.45,pants,.28,.48,0,player);
for(const x of [-.16,.16]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.045,8,8),mats.dark);eye.position.set(x,2.54,.34);player.add(eye)}
// station sign
const sign=box(5,2.1,.25,mats.dark,0,4.2,-17);const signCanvas=document.createElement('canvas');signCanvas.width=512;signCanvas.height=180;const ctx=signCanvas.getContext('2d');ctx.fillStyle='#173653';ctx.fillRect(0,0,512,180);ctx.fillStyle='#ffd166';ctx.font='bold 48px sans-serif';ctx.textAlign='center';ctx.fillText('BUILD THE MATH TOWER',256,75);ctx.fillStyle='white';ctx.font='bold 34px sans-serif';ctx.fillText('موقع بناء البرج',256,130);const signTex=new THREE.CanvasTexture(signCanvas);const signFace=new THREE.Mesh(new THREE.PlaneGeometry(4.7,1.65),new THREE.MeshBasicMaterial({map:signTex}));signFace.position.set(0,4.2,-16.86);scene.add(signFace);
// controls and camera
const keys={};let jumpV=0,onGround=true,selectedMove={};addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault()});addEventListener('keyup',e=>keys[e.code]=false);
document.querySelectorAll('[data-move]').forEach(b=>{const k=b.dataset.move;b.addEventListener('pointerdown',e=>{e.preventDefault();selectedMove[k]=true});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>selectedMove[k]=false))});$('jump').addEventListener('pointerdown',()=>{if(onGround){jumpV=8;onGround=false}});
let yaw=0;const clock=new THREE.Clock();let nearSite=false,challengeOpen=false,selectedCard=null,levelIndex=Math.max(0,Math.min(6,Number(localStorage.getItem('bmt-level')||0))),stepIndex=0,coins=Number(localStorage.getItem('bmt-coins')||0),stars=Number(localStorage.getItem('bmt-stars')||0),soundOn=true,audioCtx=null,anim=null;
const challenges=[
{title:'البنّاء المبتدئ',expr:'8 + 3 × (6 − 2)',steps:['6 − 2 = 4','3 × 4 = 12','8 + 12 = 20']},
{title:'البنّاء المبتدئ',expr:'5 + 2 × (7 − 3)',steps:['7 − 3 = 4','2 × 4 = 8','5 + 8 = 13']},
{title:'مهندس العمليات',expr:'24 ÷ 6 + 3 × 2',steps:['24 ÷ 6 = 4','3 × 2 = 6','4 + 6 = 10']},
{title:'مهندس العمليات',expr:'18 − 12 ÷ 3 + 2',steps:['12 ÷ 3 = 4','18 − 4 = 14','14 + 2 = 16']},
{title:'مهندس الأبراج',expr:'4 × (9 − 5) + 6 ÷ 2',steps:['9 − 5 = 4','4 × 4 = 16','6 ÷ 2 = 3','16 + 3 = 19']},
{title:'مهندس المدينة',expr:'30 ÷ 5 × 2 − 3',steps:['30 ÷ 5 = 6','6 × 2 = 12','12 − 3 = 9']},
{title:'مهندس القمة',expr:'(16 − 4) ÷ 3 + 2 × 5',steps:['16 − 4 = 12','12 ÷ 3 = 4','2 × 5 = 10','4 + 10 = 14']}
];
function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function playTone(freq=660,duration=.12,type='sine'){if(!soundOn)return;try{audioCtx??=new AudioContext();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.09,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration)}catch{}}
function updateStats(){$('stars').textContent=stars;$('coins').textContent=coins;$('level-label').textContent='المستوى '+Math.min(5,levelIndex+1);localStorage.setItem('bmt-stars',stars);localStorage.setItem('bmt-coins',coins);localStorage.setItem('bmt-level',levelIndex)}
function openChallenge(){if(challengeOpen)return;challengeOpen=true;$('challenge').classList.remove('hidden');$('interaction').classList.add('hidden');loadChallenge()}
function loadChallenge(){const ch=challenges[levelIndex%challenges.length];stepIndex=0;selectedCard=null;$('stage-name').textContent=ch.title;$('expression').textContent=ch.expr;$('feedback').textContent='ابدأ بالخطوة التي لها الأولوية في هذا التعبير.';$('feedback').className='feedback';$('slots').innerHTML='';$('cards').innerHTML='';
ch.steps.forEach((s,i)=>{const slot=document.createElement('button');slot.className='slot';slot.dataset.index=i;slot.innerHTML='<small>الخطوة '+(i+1)+'</small><strong>؟</strong>';slot.addEventListener('click',()=>placeSelected(i));$('slots').append(slot)});
shuffle(ch.steps.map((s,i)=>({s,i}))).forEach(item=>{const c=document.createElement('button');c.className='step-card';c.draggable=true;c.dataset.step=item.i;c.textContent=item.s;c.addEventListener('click',()=>{if(c.classList.contains('used'))return;document.querySelectorAll('.step-card').forEach(x=>x.classList.remove('selected'));selectedCard=c;c.classList.add('selected');$('feedback').textContent='الآن اختر مكان هذه الخطوة في البرج.'});c.addEventListener('dragstart',e=>{selectedCard=c;e.dataTransfer.setData('text/plain',String(item.i))});$('cards').append(c)});
document.querySelectorAll('.slot').forEach(slot=>{slot.addEventListener('dragover',e=>e.preventDefault());slot.addEventListener('drop',e=>{e.preventDefault();placeCard(Number(e.dataTransfer.getData('text/plain')),Number(slot.dataset.index))})});updateProgress()}
function placeSelected(i){if(selectedCard)placeCard(Number(selectedCard.dataset.step),i)}
function placeCard(cardIndex,slotIndex){if(!challengeOpen||slotIndex!==stepIndex)return;if(anim){$('feedback').textContent='انتظر حتى تضع الرافعة القطعة في مكانها يا مهندس!';return;}const ch=challenges[levelIndex%challenges.length];if(cardIndex!==stepIndex){$('feedback').textContent='💡 فكّر مرة أخرى يا مهندس! تذكّر ترتيب أولويات العمليات.';$('feedback').className='feedback bad';playTone(190,.18,'triangle');return}
const card=[...$('cards').children].find(c=>Number(c.dataset.step)===cardIndex);if(!card||card.classList.contains('used'))return;card.classList.add('used');card.classList.remove('selected');selectedCard=null;const slot=$('slots').children[slotIndex];slot.classList.add('filled');slot.querySelector('strong').textContent=ch.steps[stepIndex];slot.querySelector('small').textContent='⭐ تم البناء';stars++;updateStats();$('feedback').textContent='رائع! الرافعة تنقل قطعة البرج الآن.';$('feedback').className='feedback good';playTone(720,.16);animateCrane(ch.steps[stepIndex],stepIndex);stepIndex++;updateProgress();if(stepIndex===ch.steps.length)setTimeout(completeChallenge,2150)}
function updateProgress(){const n=challenges[levelIndex%challenges.length].steps.length;$('progress-text').textContent=stepIndex+' / '+n;$('progress-bar').style.width=(stepIndex/n*100)+'%'}
function animateCrane(label,index){const block=addTowerBlock(index,label);const start=new THREE.Vector3(2,1.5,-7),end=new THREE.Vector3(0,1.85+index*1.28,-7);block.position.copy(start);const duration=2.0;anim={t:0,duration,block,start,end,phase:0};}
function completeChallenge(){challengeOpen=false;$('challenge').classList.add('hidden');coins+=10;updateStats();if(levelIndex===challenges.length-1){$('finish').classList.remove('hidden');for(let i=0;i<18;i++)setTimeout(()=>playTone(450+Math.random()*600,.18,'triangle'),i*90)}else{$('victory-text').textContent='اكتمل البرج! حصلت على 10 عملات ذهبية.';$('victory').classList.remove('hidden');playTone(880,.35)}}
$('open-challenge').onclick=openChallenge;$('close-challenge').onclick=()=>{$('challenge').classList.add('hidden');challengeOpen=false};$('next-level').onclick=()=>{levelIndex++;updateStats();$('victory').classList.add('hidden');if(levelIndex%challenges.length===0)levelIndex=0;openChallenge()};$('play-again').onclick=()=>{levelIndex=0;stars=0;coins=0;towerBlocks.forEach(b=>scene.remove(b));towerBlocks.length=0;updateStats();$('finish').classList.add('hidden');openChallenge()};$('sound-toggle').onclick=()=>{soundOn=!soundOn;$('sound-toggle').textContent=soundOn?'🔊':'🔇';if(soundOn)playTone()};
function updatePlayer(dt){const forward=keys.KeyW||keys.ArrowUp||selectedMove.forward,back=keys.KeyS||keys.ArrowDown||selectedMove.back,left=keys.KeyA||keys.ArrowLeft||selectedMove.left,right=keys.KeyD||keys.ArrowRight||selectedMove.right;let dx=(right?1:0)-(left?1:0),dz=(back?1:0)-(forward?1:0);const len=Math.hypot(dx,dz);if(len){dx/=len;dz/=len;const speed=(keys.ShiftLeft?11:7)*dt;player.position.x+=dx*speed;player.position.z+=dz*speed;yaw=Math.atan2(dx,dz);player.rotation.y=yaw;const swing=Math.sin(performance.now()*.012)*.45;armL.rotation.x=swing;armR.rotation.x=-swing;legL.rotation.x=-swing;legR.rotation.x=swing}else{armL.rotation.x=armR.rotation.x=legL.rotation.x=legR.rotation.x=0}
if((keys.Space||keys.KeyW&&false)&&onGround){jumpV=8;onGround=false;keys.Space=false}if(!onGround){player.position.y+=jumpV*dt;jumpV-=19*dt;if(player.position.y<=0){player.position.y=0;jumpV=0;onGround=true}}
player.position.x=THREE.MathUtils.clamp(player.position.x,-45,45);player.position.z=THREE.MathUtils.clamp(player.position.z,-45,45);
const target=new THREE.Vector3(player.position.x,player.position.y+3.3,player.position.z);const camOffset=new THREE.Vector3(0,7,11).applyAxisAngle(new THREE.Vector3(0,1,0),yaw);camera.position.lerp(target.clone().add(camOffset),1-Math.pow(.001,dt));camera.lookAt(target);
const dist=Math.hypot(player.position.x,player.position.z+7);nearSite=dist<10&&!challengeOpen;$('interaction').classList.toggle('hidden',!nearSite);if(nearSite)$('hint').textContent='اقترب من لوحة البناء وابدأ مهمتك الهندسية!';else $('hint').textContent='W A S D للحركة • Space للقفز • اقترب من موقع البناء'}
function updateCrane(dt){if(!anim)return;anim.t+=dt;const p=Math.min(1,anim.t/anim.duration);const {block,start,end}=anim;let x,y,z;if(p<.22){const q=p/.22;x=2;y=1.5+q*3;z=-7;hook.position.y=11-q*3;cable.scale.y=1+q*3;cable.position.y=11.5-q*1.5}else if(p<.5){const q=(p-.22)/.28;x=2-q*2;y=4.5;z=-7;hook.position.y=8;cable.scale.y=4;cable.position.y=8}else if(p<.78){const q=(p-.5)/.28;x=q*2;y=4.5-q*2.6;z=-7;hook.position.y=8-q*2;cable.scale.y=4-q*2;cable.position.y=8-q}else{x=end.x;y=end.y+Math.sin((p-.78)/.22*Math.PI)*.22;z=end.z;hook.position.y=6;cable.scale.y=2;cable.position.y=9}
block.position.set(x,y,z);const scale=p<.8?THREE.MathUtils.clamp(p*5,.01,1):1;block.scale.setScalar(scale);if(p>=1){block.position.copy(end);block.scale.set(1,1,1);anim=null;playTone(520,.14);hook.position.y=11;cable.scale.y=1;cable.position.y=11.5}}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);updatePlayer(dt);updateCrane(dt);clouds.forEach(c=>{c.position.x+=dt*.45;if(c.position.x>65)c.position.x=-65});renderer.render(scene,camera)}animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
updateStats();camera.position.set(0,8,27);camera.lookAt(0,2,0);
