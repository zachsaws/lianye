const contexts = {
  content: {
    kicker: 'AI 记录工具 × 工作流创作者',
    title: '让懂这群人的创作者，\n愿意认真讲你的新品。',
    body: '联野找到面向目标买家的创作者，推进体验、选题和试用入口。有兴趣的买家，由品牌继续承接。',
    value: '值得深入讲的新选题，以及双方可以商议的合作收益。',
    returned: '面向目标买家的试用入口，以及买家的真实问题。'
  },
  community: {
    kicker: 'AI 记录工具 × 专业社群',
    title: '把一次试用，\n放进大家手上的项目。',
    body: '联野先和运营者确认成员的实际任务，再由品牌提供试用和答疑。让工具接受真实材料、不同习惯的检验。',
    value: '成员带走实际用过的方法，社群有了一次围绕共同问题的交流。',
    returned: '哪些任务确实用得上、哪里卡住，以及成员是否愿意继续使用和付费。'
  },
  business: {
    kicker: 'AI 记录工具 × 企业服务商',
    title: '让一个新工具，\n有条件进入团队工作。',
    body: '联野先核清品牌能交付的版本、许可和支持，再讨论服务商现有客户的需求。合作方式由双方确认后推进。',
    value: '如果现有方案仍有缺口，服务商就多了一项可以向客户提供的能力。',
    returned: '哪些客户值得谈、合作还缺什么，以及品牌该与谁接着推进。'
  }
};

const tabs = [...document.querySelectorAll('[role="tab"]')];
const panel = document.querySelector('#opportunity-panel');
const canvas = document.querySelector('.story-canvas');
const artifact = document.querySelector('#story-artifact');

function selectContext(tab) {
  const context = contexts[tab.dataset.context];
  for (const option of tabs) {
    option.setAttribute('aria-selected', String(option === tab));
    option.tabIndex = option === tab ? 0 : -1;
  }
  panel.setAttribute('aria-labelledby', tab.id);
  canvas.dataset.kind = tab.dataset.context;
  canvas.querySelectorAll('.artifact').forEach(node => { node.hidden = !node.classList.contains('artifact-' + tab.dataset.context); });
  document.querySelector('#story-partner').textContent = {content:'内容伙伴',community:'社群伙伴',business:'企业服务伙伴'}[tab.dataset.context];
  document.querySelector('#story-action').textContent = {content:'伙伴选择、选题与合作安排',community:'任务选择、试用与活动安排',business:'客户任务、引入与支持安排'}[tab.dataset.context];
  artifact.setAttribute('aria-label', {
    content:'合作构想：联野与创作者推进一期AI记录工具实测，内容中连接品牌试用入口',
    community:'合作构想：联野与专业社群组织一次真实项目试用，品牌答疑并承接后续使用',
    business:'合作构想：联野与企业服务商梳理客户任务、试用安排，将品牌接入客户沟通'
  }[tab.dataset.context]);
  const changes = {
    'context-kicker': context.kicker,
    'context-title': context.title,
    'context-body': context.body,
    'context-value': context.value,
    'context-return': context.returned
  };
  for (const [id, value] of Object.entries(changes)) {
    const node = document.getElementById(id);
    node.textContent = value;
    node.style.whiteSpace = 'pre-line';
  }
  panel.classList.remove('is-changing');
  requestAnimationFrame(() => panel.classList.add('is-changing'));
}

for (const [index, tab] of tabs.entries()) {
  tab.addEventListener('click', () => selectContext(tab));
  tab.addEventListener('keydown', event => {
    const next = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    tabs[next].focus();
    selectContext(tabs[next]);
  });
}

selectContext(tabs[0]);

const notes = document.querySelector('#design-notes');
const notesOpener = document.querySelector('#review-info');
notesOpener.addEventListener('click', () => notes.showModal());
document.querySelector('#close-notes').addEventListener('click', () => notes.close());
notes.addEventListener('close', () => notesOpener.focus());
notes.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const focusable = [...notes.querySelectorAll('a[href],button:not([disabled]),[tabindex="0"]')].filter(node => node.getClientRects().length);
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
notes.addEventListener('click', event => {
  if (event.target !== notes) return;
  const rect = notes.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) notes.close();
});
const sources = document.querySelector('#source-links');
const uniqueSources = new Map();
for (const mode of Object.values(window.LIANYE_NETWORK)) for (const group of mode.groups) for (const entry of group.entries) uniqueSources.set(entry.name, entry);
for (const entry of uniqueSources.values()) {
  const link = document.createElement('a');
  link.href = entry.url;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = entry.name;
  sources.append(link);
}

const emailButton = document.querySelector('#copy-email');
const emailResult = document.querySelector('#copy-result');
emailButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('zachsaws@gmail.com');
    emailResult.textContent = '已复制';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('#contact-email'));
    const selection = window.getSelection();
    selection.removeAllRanges(); selection.addRange(range);
    emailResult.textContent = '请复制已选中的邮箱';
  }
});
