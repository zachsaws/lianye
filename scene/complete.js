'use strict';
(()=>{
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
let paused=motionPreference.matches;
const toggle=$('#motion-toggle');
function setPaused(value){paused=value;document.documentElement.dataset.motion=paused?'paused':'playing';toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'播放动态 ▷':'暂停动态 Ⅱ';document.documentElement.classList.toggle('motion-enabled',!paused);}
toggle.addEventListener('click',()=>setPaused(!paused));motionPreference.addEventListener('change',e=>setPaused(e.matches));setPaused(paused);

// The glimmer is a brand illustration connecting spaces, never a transaction feed.
const mobileRoutes=matchMedia('(max-width:760px)');
const routes=$$('.hero-routes').map(svg=>({svg,path:svg.querySelector('path'),length:svg.querySelector('path').getTotalLength(),mobile:svg.classList.contains('routes-mobile'),light:svg.querySelector('.route-light')}));
let heroVisible=true,lastFrame=0,elapsed=0;
new IntersectionObserver(([entry])=>{heroVisible=entry.isIntersecting;},{threshold:0}).observe($('.hero'));
const duration=12;
function frame(now){requestAnimationFrame(frame);if(now-lastFrame<33)return;const dt=Math.min((now-lastFrame)/1000,.05);lastFrame=now;if(paused||!heroVisible||document.hidden||$('#channel-dialog').open)return;elapsed+=dt;routes.forEach(({svg,path,length,mobile,light},i)=>{if(mobile!==mobileRoutes.matches)return;const p=path.getPointAtLength(((elapsed/duration+i*.25)%1)*length);light.setAttribute('transform',`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`);});$('.hero').dataset.motionFrame=String(Math.floor(elapsed*10));}
routes.forEach(({path,light})=>{const p=path.getPointAtLength(0);light.setAttribute('transform',`translate(${p.x} ${p.y})`)});requestAnimationFrame(frame);

// A single header continues to provide navigation after the hero.
const header=$('.header'),menu=$('.menu-toggle'),nav=$('#primary-nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');header.classList.remove('menu-open');menu.setAttribute('aria-label','打开导航')}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'关闭导航':'打开导航');header.classList.toggle('menu-open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});document.addEventListener('click',e=>{if(!header.contains(e.target))closeMenu()});
let pendingScroll=false;
addEventListener('scroll',()=>{if(pendingScroll)return;pendingScroll=true;requestAnimationFrame(()=>{header.classList.toggle('is-scrolled',scrollY>120);pendingScroll=false})},{passive:true});
header.classList.toggle('is-scrolled',scrollY>120);

function markScene(path){$$('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scene===path)));$('.hero').dataset.scene=path;}
document.addEventListener('lianye:path',e=>markScene(e.detail.path));markScene($('.path-layout').dataset.selected);

const stages=[
 {label:'先确定值得开始的第一站',title:'让每个入口，都有选择的理由。',fields:[['一起明确','目标买家、优先渠道与进入条件。'],['联野推进','整理适配建议，准备接洽与合作切入点。'],['品牌准备','产品介绍、可体验版本与价格服务信息。']]},
 {label:'围绕一次体验，把安排落实',title:'让人亲自试，也让购买有承接。',fields:[['一起明确','内容实测、社群试用或到店体验的范围。'],['联野推进','协同任务、样机或账号、时间与接待答疑。'],['品牌承接','确认产品事实，负责咨询、成交与履约。']]},
 {label:'把使用反馈，变成下一步',title:'看清哪里有兴趣，哪里有顾虑。',fields:[['一起复盘','使用问题、购买顾虑与后续跟进事项。'],['联野整理','归纳反馈与渠道建议，明确值得继续的方向。'],['品牌判断','结合实际投入与结果，决定调整、继续或结束。']]}
];
function setStage(index){const step=stages[index];$$('[data-step]').filter(x=>x.tagName==='BUTTON').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.step===index)));$('#cooperate-stage').dataset.step=String(index);$('#stage-label').textContent=step.label;$('#stage-title').textContent=step.title;$('#stage-content').replaceChildren(...step.fields.flatMap(([title,copy])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=title;dd.textContent=copy;return[dt,dd]}));if(innerWidth<761)$('#cooperate-stage').scrollIntoView({block:'start',behavior:paused?'instant':'smooth'});}
$$('.cooperate-choices [data-step]').forEach(b=>b.addEventListener('click',()=>setStage(+b.dataset.step)));
function groupNavigation(selector,vertical=false){const list=$$(selector);list.forEach((b,i)=>b.addEventListener('keydown',e=>{let next;if(e.key==='Home')next=0;else if(e.key==='End')next=list.length-1;else if(e.key==='ArrowRight'||(vertical&&e.key==='ArrowDown'))next=(i+1)%list.length;else if(e.key==='ArrowLeft'||(vertical&&e.key==='ArrowUp'))next=(i+list.length-1)%list.length;if(next!==undefined){e.preventDefault();list[next].focus();list[next].click()}}));}
groupNavigation('.path-tabs [data-path]');groupNavigation('.cooperate-choices button[data-step]',true);

const outline='联野｜新品合作沟通\n\n1. 产品介绍与当前阶段\n2. 可供体验的样机或软件\n3. 最想解决的销售问题\n4. 价格、交付与服务条件\n5. 联系方式\n\n首次沟通后，一起明确优先场景、合作范围、交付、周期与双方投入。\n联系：zachsaws@gmail.com';
async function copy(text,message){try{await navigator.clipboard.writeText(text);$('#copy-status').textContent=message}catch{$('#copy-status').textContent='可直接复制邮箱，或下载沟通提纲。'}}
$('#copy-email').addEventListener('click',()=>copy('zachsaws@gmail.com','邮箱已复制'));
$('#copy-outline').addEventListener('click',()=>copy(outline,'沟通提纲已复制'));

// Content remains available if scripts fail or reduced motion is preferred.
const revealTargets=$$('.cooperate-heading,.cooperate-layout,.cooperate-terms,.contact-heading,.operator-invite');
revealTargets.forEach(el=>el.classList.add('reveal-block'));
new IntersectionObserver((entries,observer)=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}},{threshold:.08,rootMargin:'0px 0px -30px 0px'}).observe(revealTargets[0]);
const revealObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');revealObserver.unobserve(e.target)}})},{threshold:.08});revealTargets.slice(1).forEach(el=>revealObserver.observe(el));
})();
