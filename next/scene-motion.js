/* Original scene transition controller. GSAP 3.13.0 is loaded by the scene prototype. */
window.createChannelSceneMotion = function createChannelSceneMotion(root) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let timeline = null;
  let settle = null;
  let destroyed = false;
  const nodes = () => [...root.querySelectorAll('[data-scene-key]')];
  const visible = node => node.getClientRects().length > 0;
  function finish() {
    timeline?.progress(1).kill();
    timeline = null;
    root.removeAttribute('aria-busy');
    const resolve = settle;
    settle = null;
    resolve?.();
  }
  function transition(changeLayout) {
    if (destroyed) throw new Error('Scene motion controller has been destroyed');
    finish();
    const before = new Map(nodes().filter(visible).map(node => [node.dataset.sceneKey, node.getBoundingClientRect()]));
    const artBefore = new Map(nodes().filter(visible).filter(node=>node.querySelector('svg')).map(node=>[node.dataset.sceneKey,node.querySelector('svg').getBoundingClientRect()]));
    changeLayout();
    if (reduced.matches || !window.gsap) return Promise.resolve();
    root.setAttribute('aria-busy', 'true');
    return new Promise(resolve => {
      settle = resolve;
      timeline = gsap.timeline({defaults: {duration: .62, ease: 'power3.inOut'}, onComplete: () => {
        root.removeAttribute('aria-busy');
        const done = settle;
        settle = null;
        timeline = null;
        done?.();
      }});
      nodes().filter(visible).forEach((node, index) => {
        const old = before.get(node.dataset.sceneKey);
        const next = node.getBoundingClientRect();
        if (old && next.width && next.height) {
          const dx=old.left-next.left,dy=old.top-next.top;
          const svg=node.querySelector('svg'),oldArt=artBefore.get(node.dataset.sceneKey),nextArt=svg?.getBoundingClientRect();
          timeline.fromTo(node, {x:dx,y:dy}, {x:0,y:0,clearProps:'transform'},0);
          if(svg&&oldArt&&nextArt.width&&nextArt.height)timeline.fromTo(svg,{x:oldArt.left-nextArt.left-dx,y:oldArt.top-nextArt.top-dy,scaleX:oldArt.width/nextArt.width,scaleY:oldArt.height/nextArt.height,transformOrigin:'0 0'},{x:0,y:0,scaleX:1,scaleY:1,clearProps:'transform,transformOrigin'},0);
        } else {
          timeline.fromTo(node, {opacity: 0, y: 12}, {opacity: 1, y: 0, duration: .36, clearProps: 'opacity,transform'}, Math.min(index*.035, .16));
        }
      });
      if (!timeline.duration()) finish();
    });
  }
  const onPreference = () => { if (reduced.matches) finish(); };
  reduced.addEventListener('change', onPreference);
  return {transition, finish, destroy() {finish(); destroyed = true; reduced.removeEventListener('change', onPreference);}};
};
