const root=document.querySelector('#study'),back=document.querySelector('#back'),orientation=document.querySelector('#orientation');const motion=createChannelSceneMotion(root);let mode='hardware';let groups=LIANYE_NETWORK[mode].groups;let navigationEpoch=0;let active=null,scrollBefore=0;let tiles=[];function renderGroups(){root.dataset.mode=mode;root.replaceChildren();tiles=[];groups=LIANYE_NETWORK[mode].groups;groups.forEach((group,i)=>{const tile=document.createElement('button');tile.type='button';tile.className='tile';tile.dataset.sceneKey=group.key;tile.innerHTML=`<span class="number">0${i+1}</span><span class="arrow" aria-hidden="true">↗</span>${LianyeStudyArt(group.key)}<h2>${group.title}</h2><div class="names"></div>`;tile.querySelector('.names').textContent=group.entries.slice(0,3).map(e=>e.name).join(' · ');tile.setAttribute('aria-expanded','false');tile.addEventListener('click',()=>open(group,tile));tiles.push(tile);root.append(tile)});orientation.textContent=mode==='hardware'?'六类经营现场':'四类软件入口';bindArtHandlers();}renderGroups();async function open(group,tile){if(active)return;const epoch=++navigationEpoch;finishSceneEntrance();active=tile;scrollBefore=scrollY;const panel=document.createElement('section');panel.className='details';panel.dataset.sceneKey='details';panel.id='scene-details';const intro=document.createElement('p');intro.textContent=group.note||'从更细的经营方向，找到与你的新品相关的入口。';panel.append(intro);panel.append(createSceneJourney(group,tile));const categories=new Map();group.entries.forEach(e=>{if(!categories.has(e.subcategory))categories.set(e.subcategory,[]);categories.get(e.subcategory).push(e)});for(const [name,items]of categories){const h=document.createElement('h3');h.textContent=name;const ul=document.createElement('ul');items.forEach(e=>{const li=document.createElement('li');li.textContent=e.name;ul.append(li)});panel.append(h,ul)}await motion.transition(()=>{root.dataset.open=group.key;tiles.forEach(t=>t.hidden=t!==tile);tile.setAttribute('aria-expanded','true');tile.setAttribute('aria-controls','scene-details');root.append(panel);back.hidden=false;orientation.textContent=group.title});if(active===tile&&epoch===navigationEpoch){if(innerWidth<=700)document.querySelector('.toolbar').scrollIntoView({block:'start',behavior:'instant'});back.focus({preventScroll:true})}}async function close({restoreFocus=true}={}){if(!active)return;const epoch=++navigationEpoch;const opener=active;active=null;gsap.killTweensOf(root.querySelectorAll('.journey-explanation'));const layers=opener.querySelectorAll('[data-art-layer]');gsap.killTweensOf(layers);gsap.set(layers,{clearProps:'transform,opacity'});await motion.transition(()=>{root.querySelector('.details')?.remove();delete root.dataset.open;tiles.forEach(t=>{t.hidden=false;t.setAttribute('aria-expanded','false');t.removeAttribute('aria-controls')});back.hidden=true;orientation.textContent=mode==='hardware'?'六类经营现场':'四类软件入口'});if(epoch===navigationEpoch&&!active&&restoreFocus){scrollTo({top:scrollBefore,behavior:"instant"});opener.focus({preventScroll:true})}}back.addEventListener('click',close);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&active)close()});
// Scene objects respond to intent on both pointer and keyboard input.
const artReduced=matchMedia('(prefers-reduced-motion: reduce)');
function animateArt(tile,engaged){
 const subject=tile.querySelector('[data-art-layer="subject"]');
 if(!subject||artReduced.matches||active===tile)return;
 gsap.to(subject,{y:engaged?-5:0,duration:engaged?.38:.45,ease:'power2.out',overwrite:true,transformOrigin:'50% 100%'});
}
function bindArtHandlers(){tiles.forEach(tile=>{tile.addEventListener('pointerenter',()=>animateArt(tile,true));tile.addEventListener('pointerleave',()=>animateArt(tile,false));tile.addEventListener('focus',()=>animateArt(tile,true));tile.addEventListener('blur',()=>animateArt(tile,false))});}
artReduced.addEventListener('change',()=>{if(artReduced.matches){const layers=root.querySelectorAll('[data-art-layer]');gsap.killTweensOf(layers);gsap.set(layers,{clearProps:'transform,opacity'});gsap.killTweensOf(root.querySelectorAll('.journey-explanation'));gsap.set(root.querySelectorAll('.journey-explanation'),{clearProps:'transform,opacity'})}});

const sceneJourneys={
 experience:[['看到新品','经营现场先展示产品用途，让顾客知道它与自己的需求有什么关系。'],['亲手体验','通过样机与讲解，把产品差异变成一次可以理解的体验。'],['继续咨询','体验后的咨询与购买承接，需要品牌和经营者提前约定。']],
 professional:[['专业展示','在具体设备与专业任务中，说明新品的用途。'],['比较体验','通过试听、试拍或专业演示，帮助使用者判断差异。'],['咨询配置','购买、配置和后续支持由合作双方明确分工。']],
 family:[['发现需要','从家庭或教育活动的具体需要进入。'],['一起尝试','在亲子互动或活动中，让新品的价值被直接理解。'],['家长了解','适用人群、使用条件与购买承接需要清楚说明。']],
 living:[['进入日常','先找到产品在家居、户外等日常场景中的位置。'],['实际使用','让使用者在具体任务里感受产品，而不是只看参数。'],['后续承接','体验后的咨询、购买和售后责任需事先约定。']],
 people:[['发现话题','从创作者与社群熟悉的问题出发。'],['展开讨论','用真实使用过程与成员讨论，帮助理解产品价值。'],['承接兴趣','推荐、活动支持与购买入口依合作方式明确。']],
 office:[['识别任务','从企业正在处理的工作任务与采购需求进入。'],['试用评估','明确产品是否适用，以及部署、使用和支持条件。'],['商谈合作','交付、服务与采购条件由相关各方进一步确认。']]
};
function createSceneJourney(group,tile){
 const wrap=document.createElement('section');wrap.className='scene-journey';
 const heading=document.createElement('p');heading.className='journey-label';heading.textContent='一种可能的经营路径 · 示意';
 const choices=document.createElement('div');choices.className='journey-choices';choices.setAttribute('role','group');choices.setAttribute('aria-label','探索场景中的经营路径');
 const explanation=document.createElement('p');explanation.className='journey-explanation';explanation.setAttribute('aria-live','polite');
 const stages=mode==='software'?[['找到任务','从团队或个人正在解决的问题，判断工具是否适用。'],['理解用法','通过具体工作演示、试用与讨论，说明工具能做什么及使用条件。'],['明确承接','订阅、部署与后续支持的安排，依产品和伙伴的合作方式确认。']]:(sceneJourneys[group.key]||sceneJourneys.office);
 stages.forEach(([title,copy],i)=>{const button=document.createElement('button');button.type='button';button.textContent=title;button.setAttribute('aria-pressed',String(i===0));button.addEventListener('click',()=>{
  choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));explanation.textContent=copy;
  const subject=tile.querySelector('[data-art-layer="subject"]'),shelves=tile.querySelector('[data-art-layer="shelves"]');
  if(artReduced.matches)return;
  gsap.to(subject,{scale:i===1?1.09:1,y:i===1?-7:0,opacity:i===0?.72:1,duration:.6,ease:'power3.out',transformOrigin:'50% 70%',overwrite:true});
  gsap.to(shelves,{opacity:i===1?.4:1,duration:.55,ease:'power2.out',overwrite:true});
  gsap.fromTo(explanation,{opacity:0,y:5},{opacity:1,y:0,duration:.28,clearProps:'opacity,transform',overwrite:true});
 });choices.append(button)});
 explanation.textContent=stages[0][1];wrap.append(heading,choices,explanation);return wrap;
}

let sceneEntrance=null;
function finishSceneEntrance(){const entry=sceneEntrance;if(entry){entry.progress(1).kill();sceneEntrance=null}}
const entranceObserver=new IntersectionObserver(entries=>{if(!entries.some(e=>e.isIntersecting))return;entranceObserver.disconnect();if(artReduced.matches||active)return;sceneEntrance=gsap.timeline({defaults:{ease:'power3.out'}});tiles.forEach((tile,i)=>{const shelves=tile.querySelector('[data-art-layer="shelves"]'),subject=tile.querySelector('[data-art-layer="subject"]');const start=i*.055;sceneEntrance.fromTo(shelves,{opacity:0,y:-9},{opacity:1,y:0,duration:.55,clearProps:'opacity,transform'},start);sceneEntrance.fromTo(subject,{opacity:0,y:15},{opacity:1,y:0,duration:.65,clearProps:'opacity,transform'},start+.12)})},{threshold:.15});entranceObserver.observe(root);artReduced.addEventListener('change',()=>{if(artReduced.matches)finishSceneEntrance()});

let modeChange=0;
document.querySelectorAll('[data-study-mode]').forEach(button=>button.addEventListener('click',async()=>{const ticket=++modeChange;finishSceneEntrance();await close({restoreFocus:false});if(ticket!==modeChange)return;motion.finish();mode=button.dataset.studyMode;document.querySelectorAll('[data-study-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderGroups();button.focus({preventScroll:true})}));

window.openLianyeScene=async function(key){const ticket=++modeChange;finishSceneEntrance();await close({restoreFocus:false});if(ticket!==modeChange)return;motion.finish();mode='hardware';document.querySelectorAll('[data-study-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.studyMode===mode)));renderGroups();const tile=tiles.find(t=>t.dataset.sceneKey===key);const group=groups.find(g=>g.key===key);if(tile&&group){document.querySelector('.toolbar').scrollIntoView({block:'start',behavior:'instant'});await open(group,tile)}};
