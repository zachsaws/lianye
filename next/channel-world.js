/* A single editorial field of real names. No outbound channel actions. */
(() => {
  const sheets=document.querySelector('#world-sheets');
  const field=document.querySelector('#channel-network');
  const controls=[...document.querySelectorAll('[data-network]')];
  const modal=document.querySelector('#channel-chapter');
  const body=document.querySelector('#chapter-content');
  const close=document.querySelector('#chapter-close');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let mode='hardware', opener=null, frame=null, scrollBefore=0;
  const colors={stroke:'#82916e',green:'#dce5cc',paper:'#f8f7ec',sand:'#e8d4b4',orange:'#c47b51'};
  const drawings={
    experience:`<path d="M24 105V38h172v67" fill="#faf9f0"/><path d="M24 38h172v18H24Z" fill="#70855a"/><path d="M24 97h172M146 56v49"/><rect x="43" y="81" width="42" height="24" fill="#dce5cc"/><rect x="97" y="86" width="33" height="19" fill="#e8d4b4"/><rect x="54" y="66" width="21" height="16" rx="2" fill="#f8f7ec"/><circle cx="65" cy="74" r="5"/><path d="M60 65v-4h8v4"/><path d="M164 105V76q0-8 8-8t8 8v29" fill="#dce5cc"/><circle cx="175" cy="88" r="1" fill="#82916e"/><path d="M18 107h184"/>`,
    professional:`<ellipse cx="112" cy="113" rx="75" ry="7" fill="#e4e8d9" stroke="none"/><path d="M50 52h110v51H50Z" fill="#f8f7ec"/><rect x="68" y="41" width="30" height="13" rx="3" fill="#dce5cc"/><circle cx="118" cy="78" r="29" fill="#dce5cc"/><circle cx="118" cy="78" r="20" fill="#f8f7ec"/><circle cx="118" cy="78" r="12" fill="#ccd8b9"/><path d="M167 70V54q0-18 17-18t17 18v26" fill="none"/><rect x="164" y="65" width="9" height="25" rx="4" fill="#e8d4b4"/><rect x="195" y="65" width="9" height="25" rx="4" fill="#e8d4b4"/><path d="M61 64h15"/>`,
    family:`<ellipse cx="110" cy="115" rx="82" ry="6" fill="#e4e8d9" stroke="none"/><path d="m35 72 28-15 29 15-29 16Z" fill="#e8d4b4"/><path d="M35 72v32l28 15V88Z" fill="#f1e4cd"/><path d="M92 72v32l-29 15V88Z" fill="#d7bd97"/><path d="m87 62 29-17 29 17-29 17Z" fill="#dce5cc"/><path d="M87 62v31l29 17V79Z" fill="#c4d2ae"/><path d="M145 62v31l-29 17V79Z" fill="#e8eddf"/><path d="m152 47 26-11v65l-26 11Z" fill="#f8f7ec"/><path d="m178 36 25 11v65l-25-11Z" fill="#e8d4b4"/><path d="m158 58 13-5m-13 17 13-5m14-11 12 5m-12 7 12 5"/>`,
    living:`<ellipse cx="110" cy="115" rx="84" ry="6" fill="#e4e8d9" stroke="none"/><path d="M34 80V64q0-10 10-10h75q10 0 10 10v16" fill="#dce5cc"/><rect x="27" y="77" width="110" height="28" rx="6" fill="#e7ebdc"/><path d="M34 105v10m96-10v10M39 81h44m0-24v39m0-15h42"/><path d="M172 105V42m-25 63h50"/><path d="m148 42 24-27 25 27Z" fill="#e8d4b4"/><path d="M172 15v-6"/><circle cx="172" cy="54" r="2" fill="#c47b51"/>`,
    people:`<rect x="34" y="28" width="99" height="80" rx="5" fill="#f8f7ec"/><path d="M46 44h66m-66 12h49m-49 13h61m-61 14h32m-32 12h44" stroke="#b0bf99"/><rect x="140" y="31" width="30" height="57" rx="14" fill="#dce5cc"/><path d="M132 68v6q0 23 23 23t23-23v-6M155 97v15m-17 0h34M148 44v23m8-26v29m7-24v19"/><path d="M184 47q10 12 0 24m9-30q17 18 0 36" fill="none" stroke="#c7aa83"/>`,
    business:`<path d="M29 103V31h165v72Z" fill="#f8f7ec"/><path d="M29 47h165"/><circle cx="39" cy="39" r="1.5" fill="#c47b51"/><circle cx="46" cy="39" r="1.5" fill="#bcc8a8"/><circle cx="53" cy="39" r="1.5" fill="#bcc8a8"/><rect x="43" y="61" width="31" height="28" rx="3" fill="#dce5cc"/><rect x="86" y="61" width="31" height="28" rx="3" fill="#e8d4b4"/><rect x="129" y="61" width="31" height="28" rx="3" fill="#e4dfed"/><path d="M20 110h183m-113-7v7m41-7v7"/>`,
    office:`<path d="M38 105V31h57v74m13 0V46h60v59" fill="#f8f7ec"/><path d="M31 107h152M48 43h11m13 0h11M48 58h11m13 0h11M48 73h11m13 0h11m32-14h12m14 0h12m-38 15h12m14 0h12"/><rect x="54" y="87" width="25" height="18" fill="#dce5cc"/><rect x="122" y="87" width="31" height="18" fill="#e8d4b4"/><path d="M184 105V70m-10 13 10-20 10 20" fill="#dce5cc"/>`
  };
  function icon(key){
    const alias={ecosystem:'business',community:'people',creation:'professional',enterprise:'office'};
    return `<svg viewBox="0 0 220 140" aria-hidden="true"><g fill="none" stroke="${colors.stroke}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">${drawings[alias[key]||key]||drawings.business}</g></svg>`;
  }
  const short={ 'AI与创新产品体验':'新品体验','专业体验与验配':'专业验配','数码与影像零售':'影像数码','音乐与专业创作':'音乐与创作','亲子与潮玩经营':'亲子与潮玩','教育与机构服务':'教育服务','运动与户外经营':'运动户外','家居与影音空间':'家居与影音','宠物与垂直经营':'宠物生活','文化与生活方式':'文化生活','企业采购与专业分销':'企业采购','软件与应用生态':'应用生态','会员与兴趣社群':'兴趣社群','科技与数码内容':'科技内容','数码与生活方式':'数码生活','科技与产业内容':'产业内容','AI与专业技术':'AI技术','设计与影像创作':'影像创作','设计与创作社区':'创作社区','产品与经营社区':'产品社区','开发者与开源':'开发社区','AI与数据社区':'AI社区','创客与硬件社区':'创客社区','创客与硬件内容':'硬件内容','创业与会员社群':'创业社群','直播与内容经营':'内容经营'};
  function nameNode(entry,detailed=false){
    const item=document.createElement('li');item.className='world-name'+(entry.name.length>12?' is-long':'');
    const name=document.createElement('strong');name.textContent=entry.name;
    const tag=document.createElement('span');tag.className='world-name-context';tag.textContent=short[entry.subcategory]||entry.subcategory;
    item.append(name,tag);
    if(entry.related?.length){const related=document.createElement('small');related.className='world-related';related.textContent=entry.related.map(x=>x.name.replace('少数派会员社区','会员社区')).join(' · ');item.append(related);}
    return item;
  }
  function openChapter(group,button){
    opener=button;document.querySelector('#chapter-title').textContent=group.title;document.querySelector('#chapter-intro').textContent=group.note;
    body.replaceChildren();
    const sections=new Map();for(const entry of group.entries){if(!sections.has(entry.subcategory))sections.set(entry.subcategory,[]);sections.get(entry.subcategory).push(entry);}
    for(const [title,entries] of sections){const section=document.createElement('section');section.className='chapter-section';const heading=document.createElement('h3');heading.textContent=title;const list=document.createElement('ul');list.className='chapter-name-list';for(const entry of entries)list.append(nameNode(entry,true));section.append(heading,list);body.append(section);}
    scrollBefore=window.scrollY;document.documentElement.classList.add('chapter-open');
    modal.showModal();modal.scrollTop=0;close.focus();
  }
  function render(){
    const data=window.LIANYE_NETWORK[mode];controls.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.network===mode)));
    field.dataset.mode=mode;sheets.style.setProperty('--sheet-count',data.groups.length);document.querySelector('#network-caption').textContent=data.audience;
    sheets.replaceChildren();
    data.groups.forEach((group,i)=>{
      const sheet=document.createElement('section');sheet.className='world-sheet';sheet.style.setProperty('--sheet-index',i);sheet.style.setProperty('--sheet-tilt',[-.6,.4,-.35,.6,-.4,.3][i]+'deg');
      const button=document.createElement('button');button.type='button';button.className='world-chapter-button';button.setAttribute('aria-label','展开'+group.title+'，查看'+group.entries.slice(0,3).map(e=>e.name).join('、')+'等具体入口');
      const art=document.createElement('div');art.className='world-chapter-art';art.innerHTML=icon(group.key);
      const title=document.createElement('h3');title.textContent=group.title;const sign=document.createElement('span');sign.className='chapter-expand';sign.textContent='+';sign.setAttribute('aria-hidden','true');button.append(art,title,sign);button.addEventListener('click',()=>openChapter(group,button));
      const window=document.createElement('div');window.className='world-name-window';window.setAttribute('aria-hidden','true');const list=document.createElement('ul');list.className='world-name-list';for(const entry of group.entries)list.append(nameNode(entry));window.append(list);sheet.append(button,window);sheets.append(sheet);
    });
    schedule();
  }
  function parallax(){
    frame=null;const columns=[...sheets.children];const tops=columns.map(column=>column.getBoundingClientRect().top);
    columns.forEach((column,i)=>{const offset=reduced.matches?0:Math.min(100,Math.max(0,(100-tops[i])*(.16+(i%3)*.04)));column.querySelector('.world-name-list').style.transform=`translateY(${-offset.toFixed(1)}px)`;});
  }
  function schedule(){if(frame===null)frame=requestAnimationFrame(parallax);}
  controls.forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.network;render();}));
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});reduced.addEventListener('change',schedule);
  close.addEventListener('click',()=>modal.close());document.querySelector('#chapter-return').addEventListener('click',()=>modal.close());
  modal.addEventListener('close',()=>{document.documentElement.classList.remove('chapter-open');window.scrollTo(0,scrollBefore);if(opener?.isConnected)opener.focus({preventScroll:true});});
  modal.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const last=document.querySelector('#chapter-return');if(event.shiftKey&&document.activeElement===close){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();close.focus();}});
  modal.addEventListener('click',event=>{if(event.target!==modal)return;const rect=modal.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)modal.close();});
  render();
})();
