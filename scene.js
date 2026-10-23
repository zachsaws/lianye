import * as THREE from 'three';
import {RoundedBoxGeometry} from './vendor/RoundedBoxGeometry.js';
const canvas=document.querySelector('#stage'),host=document.querySelector('#hero-scene'),hero=document.querySelector('#top');
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch(e){host.hidden=true;hero.dataset.render='fallback';}
if(renderer){
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-5,5,3,-3,.1,70);camera.position.set(5.5,4.1,9);camera.lookAt(0,1.3,0);
scene.add(new THREE.HemisphereLight(0xffffff,0xc6b3a0,1.9));const sun=new THREE.DirectionalLight(0xfff7e8,3);sun.position.set(-3,8,7);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-8;sun.shadow.camera.right=8;sun.shadow.camera.top=7;sun.shadow.camera.bottom=-6;sun.shadow.normalBias=.025;sun.shadow.radius=4;scene.add(sun);const fill=new THREE.DirectionalLight(0xd9e4ff,1.2);fill.position.set(5,3,-4);scene.add(fill);
const mat=(color,roughness=.72)=>new THREE.MeshStandardMaterial({color,roughness,metalness:0});
const orange=mat('#f25b32',.42),ivory=mat('#ffefcd',.58),cream=mat('#f6f1e8'),blue=mat('#315bdf',.68),yellow=mat('#f5d66a'),lilac=mat('#c7b8f0'),black=mat('#202722');
function box(w,h,d,r,m,x=0,y=0,z=0,parent=scene){const o=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,5,r),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function cylinder(radius,height,m,x,y,z,parent=scene){const o=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,height,64),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
box(14,.18,10,.08,cream,0,-.45,0);box(9,.36,4.3,.17,yellow,0,-.14,0);cylinder(1.95,.27,blue,-1.6,.17,.2);
// A folded display backdrop, not a transport line.
box(7.7,3.5,.18,.3,blue,.2,1.55,-1.65);const curve=new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.15,3.5,64,1,true,0,Math.PI),blue);curve.rotation.z=Math.PI/2;curve.rotation.x=Math.PI/2;curve.position.set(-3.85,.9,-.7);curve.castShadow=true;scene.add(curve);
const portal=new THREE.Group();portal.position.set(2.25,1.3,-.48);scene.add(portal);const arch=new THREE.Shape();arch.moveTo(-1.45,-1.4);arch.lineTo(1.45,-1.4);arch.lineTo(1.45,1.4);arch.lineTo(-1.45,1.4);arch.closePath();const hole=new THREE.Path();hole.absarc(0,0,1.06,0,Math.PI*2,true);arch.holes.push(hole);const portalMesh=new THREE.Mesh(new THREE.ExtrudeGeometry(arch,{depth:.24,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.1,bevelThickness:.08,curveSegments:60}),ivory);portalMesh.castShadow=true;portalMesh.receiveShadow=true;portal.add(portalMesh);
const device=new THREE.Group();device.position.set(-1.65,1.67,.27);device.rotation.y=.14;scene.add(device);box(2.45,2.5,1.04,.29,orange,0,0,0,device);const face=cylinder(.94,.07,ivory,0,.08,.565,device);face.rotation.x=Math.PI/2;
const eyeMat=new THREE.MeshStandardMaterial({color:'#315bdf',emissive:'#315bdf',emissiveIntensity:.12,roughness:.6});const eyes=new THREE.Group();device.add(eyes);box(.12,.2,.045,.055,eyeMat,-.22,.16,.62,eyes);box(.12,.2,.045,.055,eyeMat,.22,.16,.62,eyes);const smile=new THREE.Mesh(new THREE.TorusGeometry(.22,.025,12,50,Math.PI),eyeMat);smile.rotation.z=Math.PI;smile.position.set(0,-.03,.62);eyes.add(smile);eyes.scale.setScalar(.001);
const knob=cylinder(.2,.12,ivory,.81,-.82,.58,device);knob.rotation.x=Math.PI/2;
for(let i=0;i<3;i++)box(.15,.06,.02,.02,black,-.87,.68-i*.13,.539,device);
const hand=new THREE.Group();scene.add(hand);box(.63,.5,.3,.18,ivory,.18,0,0,hand);box(.98,.17,.21,.08,ivory,-.48,.13,0,hand);for(let i=0;i<3;i++)box(.35,.145,.22,.065,ivory,.16,-.05-i*.13,.02,hand);box(.4,.6,.4,.12,lilac,.68,-.01,-.01,hand);box(1.05,.44,.33,.15,lilac,1.22,-.01,-.01,hand);hand.rotation.z=-.2;
const card=new THREE.Group();card.position.set(2.05,1.35,1.03);card.rotation.y=-.16;card.rotation.z=-.06;scene.add(card);box(2.1,2.55,.09,.07,cream,0,0,0,card);const sheetCanvas=document.createElement('canvas');sheetCanvas.width=640;sheetCanvas.height=800;const ctx=sheetCanvas.getContext('2d'),texture=new THREE.CanvasTexture(sheetCanvas);texture.colorSpace=THREE.SRGBColorSpace;const sheet=new THREE.Mesh(new THREE.PlaneGeometry(1.98,2.45),new THREE.MeshBasicMaterial({map:texture}));sheet.position.z=.052;card.add(sheet);
const flap=box(2.18,.65,.06,.04,blue,2.1,.03,1.38);flap.rotation.z=-.06;box(2.22,.12,.5,.06,blue,2.1,-.36,1.22);
let drawn=-1;function drawSheet(beat){if(drawn===beat)return;drawn=beat;const rows=[['看见价值','谁会需要它','解决什么问题','从哪里认识它'],['亲手试过','用自己的任务','感受实际效果','找到适合的用法'],['找到品牌','购买咨询与价格','交付时间与服务','把兴趣接到生意里']][beat];ctx.fillStyle='#fffcf2';ctx.fillRect(0,0,640,800);ctx.fillStyle='#315bdf';ctx.fillRect(40,40,65,10);ctx.font='500 20px sans-serif';ctx.fillStyle='#73796e';ctx.fillText('联野  /  新品进入市场',40,110);ctx.font='600 64px sans-serif';ctx.fillStyle='#202722';ctx.fillText(rows[0],40,225);ctx.fillStyle='#20272240';ctx.fillRect(40,265,560,2);ctx.font='400 30px sans-serif';rows.slice(1).forEach((s,i)=>{ctx.fillStyle=beat===2?'#315bdf':'#ef5a35';ctx.fillRect(40,340+i*100,10,10);ctx.fillStyle='#202722';ctx.fillText(s,76,355+i*100);});ctx.fillStyle='#73796e';ctx.font='400 20px sans-serif';ctx.fillText('被看见  →  被体验  →  走向购买',40,738);texture.needsUpdate=true;}
// A physical response follows a touch; a question sheet becomes the brand's intake.
let visible=true,oldBeat=-1,lastTime=performance.now(),lastDraw=0,frames=0,blend=0,resizeDirty=true;const observer=new IntersectionObserver(es=>visible=es[0].isIntersecting,{threshold:.01});observer.observe(host);
function resize(){const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);const h=innerWidth<761?6.2:5.45,aspect=width/height;camera.left=-h*aspect/2;camera.right=h*aspect/2;camera.top=h/2;camera.bottom=-h/2;camera.updateProjectionMatrix();resizeDirty=true;}
new ResizeObserver(resize).observe(host);resize();drawSheet(0);hero.classList.add('webgl-ready');hero.dataset.render='webgl';
canvas.addEventListener('click',()=>{const n=(Number(hero.dataset.beat)+1)%3;document.querySelector(`[data-hero="${n}"]`).click();});
const pose={hand:0,eyes:0,card:0,rot:.14};function render(now){requestAnimationFrame(render);const dt=Math.max(0,Math.min((now-lastTime)/1000,.1));lastTime=now;const motion=window.LianyeMotion||{hero:0,heroProgress:0,paused:true},beat=motion.hero||0;const paused=motion.paused||document.hidden;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.body.classList.contains('motion-override');
if(!visible||document.hidden)return;
if(beat!==oldBeat){oldBeat=beat;blend=0;drawSheet(beat);}blend=Math.min(1,blend+dt*2.5);
const response=beat===1?1:0,receipt=beat===2?1:0;const factor=reduced||paused?1:Math.min(1,dt*4.5);pose.hand+=(response-pose.hand)*factor;pose.eyes+=(1-pose.eyes)*factor;pose.card+=(receipt-pose.card)*factor;pose.rot+=((beat===0?.14:beat===1?-.08:.09)-pose.rot)*factor;
hand.position.set(2.8-pose.hand*2.7,2.35-pose.hand*1.7,1.65-pose.hand*.9);hand.visible=pose.hand>.01;knob.position.z=.58-pose.hand*.075;eyes.scale.setScalar(Math.max(.001,pose.eyes));eyeMat.emissiveIntensity=.12+pose.eyes*.55;device.rotation.y=pose.rot;card.position.y=1.12+pose.card*.38;card.rotation.z=-.06+pose.card*.1;flap.rotation.x=pose.card*-.5;
if(beat===1&&!paused&&!reduced){const blink=Math.sin(now*.002)> .97?.16:1;eyes.scale.y=Math.max(.001,pose.eyes*blink);}
const unsettled=Math.abs(response-pose.hand)+Math.abs(receipt-pose.card)>.001;
if(now-lastDraw>32&&(!paused||unsettled||resizeDirty||frames<2||reduced&&beat!==Number(canvas.dataset.lastBeat))){renderer.render(scene,camera);frames++;lastDraw=now;resizeDirty=false;canvas.dataset.lastBeat=beat;if(frames%30===0||frames<3)canvas.dataset.renderFrames=frames;}
}
requestAnimationFrame(render);
window.addEventListener('pagehide',()=>{observer.disconnect();renderer.dispose();},{once:true});
}
