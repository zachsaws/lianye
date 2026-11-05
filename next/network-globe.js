/* Original vector network. Links describe discovery directions, not partnerships. */
(() => {
  const host = document.querySelector('#channel-globe');
  const wire = document.querySelector('#globe-wire');
  const labels = document.querySelector('#globe-labels');
  const controls = [...document.querySelectorAll('[data-network]')];
  const nav = document.querySelector('#network-category-nav');
  const list = document.querySelector('#network-entry-list');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const svgNS = 'http://www.w3.org/2000/svg';
  let mode = 'software', groupIndex = 1, nodes = [], angle = -.35, tilt = -.12;
  let start = null, dragged = false, frame = null, visible = false, entered = false;
  let width = 700, height = 620, radius = 215;
  let turning = null, entranceFrame = null;
  function stopViewMotion() {
    entered=true;
    if(entranceFrame!==null)cancelAnimationFrame(entranceFrame);
    if(turning!==null)cancelAnimationFrame(turning);
    entranceFrame=null;turning=null;
  }
  const paths = [];
  const groupPath = document.createElementNS(svgNS, 'path');
  groupPath.classList.add('globe-relationship');
  for (let j = 0; j < 9; j++) {
    const path = document.createElementNS(svgNS, 'path');
    path.classList.add(j < 4 ? 'globe-latitude' : 'globe-longitude');
    wire.append(path); paths.push(path);
  }
  wire.append(groupPath);

  function rotate(p) {
    const x = p[0] * Math.cos(angle) + p[2] * Math.sin(angle);
    const z = -p[0] * Math.sin(angle) + p[2] * Math.cos(angle);
    return [x, p[1] * Math.cos(tilt) - z * Math.sin(tilt), p[1] * Math.sin(tilt) + z * Math.cos(tilt)];
  }
  function project(p) {
    const [x, y, z] = rotate(p), depth = 3.8 / (3.8 - z);
    return {x: width / 2 + x * radius * depth, y: height / 2 + y * radius * depth * .94, z, depth};
  }
  function pointAt(i, n) {
    const gi=Math.floor(i/4), within=i%4;
    const lon=gi / 6 * Math.PI * 2 + (within%2 ? .39 : -.39);
    const lat=[.38,-.04,.4,-.35,.12,-.32][gi]+(within<2 ? -.23 : .23);
    return [Math.cos(lat)*Math.sin(lon), Math.sin(lat), Math.cos(lat)*Math.cos(lon)];
  }
  function turnToGroup(index, immediate=false) {
    if(turning!==null)cancelAnimationFrame(turning);
    const target=-index / 6 * Math.PI * 2;
    let diff=(target-angle)%(Math.PI*2);
    if(diff>Math.PI)diff-=Math.PI*2;if(diff< -Math.PI)diff+=Math.PI*2;
    if(reduced.matches||immediate){angle+=diff;draw();return}
    const from=angle, begin=performance.now();
    function turn(time){
      if(start){turning=null;return}
      const p=Math.min((time-begin)/400,1);angle=from+diff*(1-Math.pow(1-p,3));draw();
      if(p<1)turning=requestAnimationFrame(turn);else turning=null;
    }
    turning=requestAnimationFrame(turn);
  }
  function draw() {
    wire.setAttribute('viewBox', `0 0 ${width} ${height}`);
    paths.forEach((path, i) => {
      const points=[];
      for(let t = 0; t <= 72; t++) {
        const a = t / 72 * Math.PI * 2;
        let p;
        if(i < 4) { const lat = [-.8,-.35,.15,.65][i], r = Math.cos(lat); p=[r*Math.cos(a),Math.sin(lat),r*Math.sin(a)]; }
        else { const lon = (i-4) / 5 * Math.PI; p=[Math.cos(a)*Math.cos(lon),Math.sin(a),Math.cos(a)*Math.sin(lon)]; }
        const v=project(p); points.push(`${t ? 'L':'M'}${v.x.toFixed(1)} ${v.y.toFixed(1)}`);
      }
      path.setAttribute('d',points.join(' '));
    });
    const projected=nodes.map(node => ({...node, ...project(node.point)}));
    const placed=[];
    projected.sort((a,b)=>b.z-a.z).forEach(node => {
      const front=node.z > -.14;
      const scale=.87 + (node.z+1)*.105;
      const rect={x:node.x-node.labelWidth*(width<400?.74:1)*scale/2,y:node.y-21*scale,w:node.labelWidth*(width<400?.74:1)*scale,h:42*scale};
      const collides=placed.some(box=>rect.x < box.x+box.w+7 && rect.x+rect.w+7 > box.x && rect.y < box.y+box.h+5 && rect.y+rect.h+5 > box.y);
      const show=!collides;
      const ghost=!front;
      if(show) placed.push(rect);
      node.button.style.transform=`translate(${node.x.toFixed(2)}px, ${node.y.toFixed(2)}px) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      node.button.style.opacity=show ? (ghost ? '.31' : String(.7+(node.z+1)*.15)) : '0';
      node.button.classList.toggle('is-ghost',ghost);
      node.button.disabled=ghost;
      node.button.style.visibility=show ? 'visible' : 'hidden';
      node.button.style.zIndex=String(Math.round((node.z+1)*100));
      node.button.tabIndex=show && !ghost ? 0 : -1;
      node.button.classList.toggle('is-related',node.groupIndex===groupIndex);
    });
    let relation='';
    projected.filter(p=>p.groupIndex===groupIndex && p.z>-.1).forEach(p=>{
      relation += `M${width/2} ${height/2} Q${(width/2+p.x)/2+18} ${(height/2+p.y)/2-22} ${p.x} ${p.y} `;
    });
    groupPath.setAttribute('d',relation);
  }
  function schedule() {
    if(frame!==null) return;
    frame=requestAnimationFrame(()=>{frame=null;draw()});
  }
  function resize() {
    const rect=host.getBoundingClientRect(); width=rect.width; height=rect.height;
    radius=Math.min(width*.36,height*.385);schedule();
  }
  function chooseGroup(index, rotateView=true, immediate=false) {
    groupIndex=index;
    const group=window.LIANYE_NETWORK[mode].groups[index];
    document.querySelector('#network-group-title').textContent=group.title;
    document.querySelector('#network-group-note').textContent=group.note;
    list.replaceChildren();
    group.entries.forEach(entry=>{
      const link=document.createElement('a');link.href=entry.url;link.target='_blank';link.rel='noopener';
      const name=document.createElement('span');name.textContent=entry.name;
      const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
      link.append(name,arrow);link.setAttribute('aria-label',entry.name+'，查看公开入口，新窗口打开');list.append(link);
    });
    [...nav.children].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
    if(rotateView)turnToGroup(index,immediate);else schedule();
  }
  function selectMode(nextMode) {
    mode=nextMode;const data=window.LIANYE_NETWORK[mode];
    document.querySelector('#channel-network').dataset.mode=mode;
    document.querySelector('#network-product').textContent=data.product;
    document.querySelector('#network-caption').textContent=data.audience;
    controls.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.network===mode)));
    labels.replaceChildren();nav.replaceChildren();nodes=[];
    const entries=data.groups.flatMap((group,gi)=>group.entries.map(entry=>({...entry,groupIndex:gi})));
    entries.forEach((entry,i)=>{
      const button=document.createElement('button');button.type='button';button.className='globe-label';
      const dot=document.createElement('span');dot.className='node-dot';dot.setAttribute('aria-hidden','true');
      const text=document.createElement('span');text.textContent=entry.name;button.append(dot,text);
      button.setAttribute('aria-label',entry.name+'，探索'+data.groups[entry.groupIndex].title+'方向');
      button.addEventListener('click',event=>{if(dragged){event.preventDefault();return}stopViewMotion();chooseGroup(entry.groupIndex)});
      button.addEventListener('focus',()=>{stopViewMotion();chooseGroup(entry.groupIndex,false)});
      labels.append(button);
      nodes.push({...entry,button,point:pointAt(i,entries.length),labelWidth: Math.min(190,38+[...entry.name].reduce((n,c)=>n+(/[\u4e00-\u9fff]/.test(c)?14:7.5),0))});
    });
    data.groups.forEach((group,i)=>{
      const button=document.createElement('button');button.type='button';button.textContent=group.title;
      button.addEventListener('click',()=>{stopViewMotion();chooseGroup(i)});nav.append(button);
    });
    chooseGroup(mode==='software'?1:0,true,true);resize();
  }
  controls.forEach(button=>button.addEventListener('click',()=>{stopViewMotion();selectMode(button.dataset.network)}));
  host.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    stopViewMotion();
    start={x:event.clientX,y:event.clientY,angle,tilt};dragged=false;
  });
  host.addEventListener('pointermove',event=>{
    if(!start)return;
    const dx=event.clientX-start.x,dy=event.clientY-start.y;
    if(Math.abs(dx)>7){dragged=true;host.classList.add('is-dragging');}
    if(!dragged)return;
    if(event.pointerType!=='touch' || Math.abs(dx)>Math.abs(dy)) {
      angle=start.angle+dx*.007;
      if(event.pointerType!=='touch')tilt=Math.max(-.45,Math.min(.45,start.tilt+dy*.004));
      schedule();
    }
  });
  const release=()=>{start=null;host.classList.remove('is-dragging');setTimeout(()=>{dragged=false},0)};
  window.addEventListener('pointerup',release);window.addEventListener('pointercancel',release);
  host.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();angle+=event.key==='ArrowLeft'?-.24:.24;draw();
  });
  new ResizeObserver(resize).observe(host);
  const observer=new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(!visible || entered || reduced.matches)return;
    entered=true;const begin=performance.now(),from=angle;
    function enter(time){
      if(start || !visible || reduced.matches){entranceFrame=null;return}
      const progress=Math.min((time-begin)/1600,1);
      angle=from+.32*(1-Math.pow(1-progress,3));draw();
      if(progress<1)entranceFrame=requestAnimationFrame(enter);else entranceFrame=null;
    }
    entranceFrame=requestAnimationFrame(enter);
  },{threshold:.3});
  observer.observe(host);selectMode(mode);
})();
