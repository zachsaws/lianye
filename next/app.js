const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const stage=document.querySelector('.cooperation-stage');
const stateButtons=[...document.querySelectorAll('[data-deal-state]')];
let dealAnimations=[];
function setDealState(state){
  if(!['apart','together'].includes(state)||stage.dataset.stage===state)return;
  const outcome=document.querySelector('#deal-outcome');
  const oldHeight=outcome.getBoundingClientRect().height;
  dealAnimations.forEach(animation=>animation.cancel());
  dealAnimations=[];
  stage.dataset.stage=state;
  stateButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.dealState===state)));
  const together=state==='together';
  document.querySelector('.deal-result').hidden=!together;
  document.querySelector('.apart-result').hidden=together;
  document.querySelector('#deal-announcement').textContent=together
    ?'合作构想：联野匹配跑团，谈清支持与收益，推进共同试跑；渠道组织，品牌承接购买。'
    :'各自拥有产品与成员，还需要谈清适合谁、各做什么以及合作收益。';
  if(reducedMotion.matches)return;
  const nextHeight=outcome.getBoundingClientRect().height;
  dealAnimations.push(outcome.animate([{height:oldHeight+'px'},{height:nextHeight+'px'}],{duration:420,easing:'cubic-bezier(.2,.7,.2,1)'}));
  const incoming=document.querySelector(together?'.deal-result':'.apart-result');
  dealAnimations.push(incoming.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,delay:together?100:0,fill:'backwards',easing:'ease-out'}));
  if(together){
    const path=document.querySelector('.deal-bridge svg path');
    const length=path?.getTotalLength();
    if(path)dealAnimations.push(path.animate([{strokeDasharray:length,strokeDashoffset:length},{strokeDasharray:length,strokeDashoffset:0}],{duration:460,easing:'ease-out'}));
    const paper=document.querySelector('.partnership-paper');
    if(paper)dealAnimations.push(paper.animate([{opacity:0,transform:'perspective(1200px) rotateY(-8deg)'},{opacity:1,transform:'perspective(1200px) rotateY(0deg)'}],{duration:450,delay:100,fill:'backwards',easing:'ease-out'}));
    const scene=document.querySelector('.event-visual');
    dealAnimations.push(scene.animate([{opacity:0,transform:'translateX(16px)'},{opacity:1,transform:'translateX(0)'}],{duration:400,delay:180,fill:'backwards',easing:'ease-out'}));
  }
}
stateButtons.forEach(button=>button.addEventListener('click',()=>setDealState(button.dataset.dealState)));
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)dealAnimations.forEach(animation=>animation.cancel())});
// Scene and names arrive in reading order; content remains visible when JS or motion is unavailable.
const revealObserver=window.IntersectionObserver?new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(!entry.isIntersecting)continue;
    revealObserver.unobserve(entry.target);
    if(reducedMotion.matches)continue;
    const art=entry.target.querySelector('.scene-art');
    const caption=entry.target.querySelector('.scene-caption');
    const names=entry.target.querySelector('.scene-business');
    art?.animate([{opacity:.55,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.2,.7,.2,1)'});
    for(const [i,node] of [caption,names].entries())node?.animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,delay:90+i*70,fill:'backwards',easing:'ease-out'});
  }
},{threshold:.13}):null;
function observeScenes(){document.querySelectorAll('.scene-item').forEach(node=>revealObserver?.observe(node))}
observeScenes();
document.addEventListener('lianye:scenes-rendered',observeScenes);
const notes=document.querySelector('#design-notes'),notesOpener=document.querySelector('#review-info');let notesScroll=0;
notesOpener.addEventListener('click',()=>{notesScroll=scrollY;document.documentElement.classList.add('chapter-open');notes.showModal();notes.scrollTop=0;document.querySelector('#close-notes').focus()});document.querySelector('#close-notes').addEventListener('click',()=>notes.close());notes.addEventListener('close',()=>{document.documentElement.classList.remove('chapter-open');scrollTo(0,notesScroll);notesOpener.focus({preventScroll:true})});notes.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const focusable=[...notes.querySelectorAll('a[href],button')],first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});notes.addEventListener('click',e=>{if(e.target!==notes)return;const r=notes.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)notes.close()});
const sources=document.querySelector('#source-links'),unique=new Map();for(const data of Object.values(window.LIANYE_NETWORK))for(const group of data.groups)for(const entry of group.entries){unique.set(entry.name,entry);for(const related of entry.related||[])unique.set(related.name,related)}for(const entry of unique.values()){const a=document.createElement('a');a.href=entry.url;a.target='_blank';a.rel='noopener';a.textContent=entry.name;sources.append(a)}
document.querySelector('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('zachsaws@gmail.com');document.querySelector('#copy-result').textContent='已复制'}catch{const r=document.createRange();r.selectNodeContents(document.querySelector('#contact-email'));const s=getSelection();s.removeAllRanges();s.addRange(r);document.querySelector('#copy-result').textContent='请复制已选中的邮箱'}});
