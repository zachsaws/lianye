'use strict';
(() => {
  const byId=id=>document.getElementById(id);
  const sceneText={
    content:{type:'口袋相机 / 内容实测',captions:['01 / 新品进入一次真实拍摄','02 / 拍摄过程与效果一起呈现','03 / 把具体购买问题交给品牌'],source:'看完实测，买家继续问',question:'“支持边走边拍吗？原片在哪里看？”'},
    community:{type:'AI 剪辑工具 / 社群试用',captions:['01 / 成员带上自己的素材','02 / 从素材到预览，完成一次任务','03 / 根据真实使用，判断是否继续'],source:'试过之后，成员继续问',question:'“能导出原画质吗？怎样接进原来的流程？”'},
    retail:{type:'陪伴设备 / 门店体验',captions:['01 / 顾客在门店看见新品','02 / 转动旋钮，感受一次互动','03 / 有兴趣，也找得到购买入口'],source:'亲手体验，买家继续问',question:'“离线能用吗？日常使用需要订阅吗？”'}
  };
  function syncScene(){const host=byId('paths'),p=sceneText[host.dataset.path],beat=Number(host.dataset.beat)||0;byId('scene-type').textContent=p.type;byId('scene-caption').textContent=p.captions[beat];byId('buyer-source').textContent=p.source;byId('buyer-message').textContent=p.question;const path=host.dataset.path;for(const [selector,visible] of [['.camera-record',path==='content'&&beat!==2],['.clip-proof',path==='content'&&beat===1],['.software-demo',path==='community'],['.voice-response',path==='retail'&&beat===1],['.buyer-message',beat===2]])document.querySelector(selector).setAttribute('aria-hidden',String(!visible));}
  window.addEventListener('lianye:scene',syncScene);syncScene();
  const deliveries=[
    {number:'01 / 渠道优先建议',title:'先找愿意上手的人，\n再谈更大的铺货。',footer:'先验证体验能否引出真实购买问题',rows:[['先试','AI 产品体验空间','互动价值需要亲手感受；先确认样机、讲解与购买入口。'],['再看','亲子与生活方式门店','关注日常使用，先确认到店人群、适龄条件与接待方式。'],['暂缓','大范围铺货','供货、售后与需求尚未准备好时，先把小范围体验做扎实。']]},
    {number:'02 / 体验执行安排',title:'每个关键动作，\n都有人接着推进。',footer:'样机、人员和购买入口，启动前一起确认',rows:[['开始前','品牌 × 联野','对齐产品事实、适用人群、体验边界和样机安排。'],['体验中','经营者 × 品牌','经营者组织接待与演示；品牌确认答疑人和咨询入口。'],['结束后','联野 × 品牌','整理使用问题与跟进事项，明确谁继续联系、怎样承接。']]},
    {number:'03 / 买家反馈与复盘',title:'听见买家怎么问，\n再决定下一步怎么走。',footer:'关注真实兴趣、购买障碍和后续承接',rows:[['兴趣','是否愿意继续了解','区分围观和实际使用意愿，记录买家关心的用途。'],['障碍','什么问题挡住购买','例如交互、适龄、订阅与售后；把共性问题带回品牌。'],['下一步','继续、调整，或暂缓','若兴趣明确且承接顺畅，再讨论扩大；若顾虑集中，先调整说明或产品。']]}
  ];
  function setDelivery(index){const d=deliveries[index],paper=byId('delivery-paper');byId('delivery-number').textContent=d.number;byId('delivery-title').replaceChildren(...d.title.split('\n').flatMap((t,i)=>i?[document.createElement('br'),document.createTextNode(t)]:[document.createTextNode(t)]));byId('delivery-footer').textContent=d.footer;byId('delivery-content').replaceChildren(...d.rows.map(([label,title,text])=>{const row=document.createElement('div');row.className='delivery-row';const tag=document.createElement('span');tag.textContent=label;const body=document.createElement('div'),h=document.createElement('h4'),p=document.createElement('p');h.textContent=title;p.textContent=text;body.append(h,p);row.append(tag,body);return row;}));paper.dataset.delivery=index;document.querySelectorAll('[data-delivery]').forEach(b=>{b.setAttribute('aria-pressed',String(Number(b.dataset.delivery)===index));b.setAttribute('aria-controls','delivery-paper');});}
  document.querySelectorAll('[data-delivery]').forEach(b=>b.addEventListener('click',()=>{setDelivery(Number(b.dataset.delivery));if(innerWidth<=760)byId('delivery-paper').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}));setDelivery(0);
  const group=document.querySelector('.deliverable-choices');group.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowDown','Home','End'].includes(e.key))return;const buttons=[...group.querySelectorAll('button')],i=buttons.indexOf(document.activeElement);if(i<0)return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;buttons[n].click();buttons[n].focus({preventScroll:true});});
  byId('copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('zachsaws@gmail.com');byId('email-status').textContent='邮箱已复制';}catch{byId('email-status').textContent='可长按或选中上方邮箱复制';}});
  window.addEventListener('pageshow',()=>document.body.classList.add('page-ready'),{once:true});
})();
