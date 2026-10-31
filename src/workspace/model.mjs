export const STORAGE_KEY = 'elma-wiki-public-workspace-v1';
export const text = (value, t) => Array.isArray(value) ? t(value[0], value[1]) : String(value ?? '');
export const STAGES = {
  analysis: { label: ['Разбор', 'Analysis'], turn: ['Аналитик', 'Analyst'] },
  'needs-answer': { label: ['Разбор', 'Analysis'], turn: ['Заказчик', 'Requester'] },
  ready: { label: ['Утверждение', 'Approval'], turn: ['Владелец продукта', 'Product owner'] },
  development: { label: ['Разработка', 'Development'], turn: ['Инженер', 'Engineer'] },
  review: { label: ['Проверка', 'Review'], turn: ['Аналитик и владелец продукта', 'Analyst and product owner'] },
  done: { label: ['Завершена', 'Completed'], turn: ['Работа завершена', 'Work complete'] },
};
const pair = (ru, en) => [ru, en];
const date = '2026-10-31T08:00:00.000Z';
const seed = (id, moduleId, title, place, stage, problem, expected, extra = {}) => ({
  id, moduleId, title, place, stage, kind:'change', problem, expected,
  requester: pair('Заказчик примера', 'Sample requester'), assignee: pair('Аналитик примера', 'Sample analyst'),
  package: '', updatedAt: date, comments: [], history: [{id:'created',text:pair('Создана учебная заявка','Sample request created'),at:date}], ...extra,
});
export function initialWorkspace() {
  return { version:1, revision:0, requests:[
    seed('W-14','contracts',pair('Добавить финансовое согласование','Add finance approval'),{id:'amount',kind:'field',label:pair('Сумма договора','Contract value')},'needs-answer',pair('Крупные договоры проходят тот же маршрут, что и небольшие.','High-value contracts follow the same route as small ones.'),pair('При сумме больше миллиона добавить проверку финансовым директором.','Add finance review above one million.'),{question:pair('Как поступать с договорами ровно на пороге суммы?','What should happen exactly at the threshold?'),package:pair('Согласование договоров','Contract approval')}),
    seed('W-18','contracts',pair('Проверять приложение перед отправкой','Check the attachment before submission'),{id:'attachment',kind:'field',label:pair('Приложение','Attachment')},'ready',pair('Приложение приходится запрашивать уже после отправки.','The attachment has to be requested after submission.'),pair('Для отправки требуется файл, черновик можно сохранить без него.','Require a file for submission but allow a draft without it.'),{package:pair('Согласование договоров','Contract approval')}),
    seed('W-19','contracts',pair('Уточнить действия юриста','Clarify the legal reviewer’s actions'),{id:'legal-review',kind:'step',label:pair('Юридическая проверка','Legal review')},'analysis',pair('Непонятно, кто возвращает документ на повторную проверку.','It is unclear who sends the document for another review.'),'',{kind:'question'}),
    seed('W-20','counterparties',pair('Уточнить обязательные реквизиты','Clarify required company details'),null,'review',pair('Команде нужен единый список обязательных сведений.','The team needs a shared list of required company details.'),pair('Согласовать список и проверить сообщения о пропущенных полях.','Agree the list and check messages for missing fields.')),
    seed('W-21','correspondence',pair('Объяснить порядок регистрации письма','Explain letter registration'),null,'done',pair('Новый сотрудник не понимает очередность действий.','A new colleague does not understand the order of actions.'),'',{kind:'question'}),
  ] };
}
const boundedText = (v, max) => typeof v === 'string' && v.length <= max;
const localized = (v, max) => boundedText(v,max) || (Array.isArray(v) && v.length===2 && v.every(x=>boundedText(x,max)));
const validTime = v => typeof v==='string' && Number.isFinite(Date.parse(v));
const MODULE_IDS = new Set(['contracts','counterparties','correspondence','powers','bonds']);
function validRecord(r) {
  return r && /^W-\d{1,9}$/.test(r.id) && MODULE_IDS.has(r.moduleId) && ['change','question'].includes(r.kind) && Object.hasOwn(STAGES,r.stage)
    && localized(r.title,160) && localized(r.problem,4000) && localized(r.expected,4000) && validTime(r.updatedAt)
    && localized(r.requester,120) && localized(r.assignee,120) && localized(r.package,160)
    && (!r.question || localized(r.question,2000))
    && (!r.place || (boundedText(r.place.id,100) && localized(r.place.label,160) && ['field','form','process','step','action'].includes(r.place.kind)))
    && Array.isArray(r.comments) && r.comments.length<=100 && r.comments.every(c=>boundedText(c.id,100)&&localized(c.author,120)&&boundedText(c.text,2000)&&validTime(c.at))
    && Array.isArray(r.history) && r.history.length<=100 && r.history.every(e=>boundedText(e.id,100)&&localized(e.text,500)&&validTime(e.at));
}
export function decodeWorkspace(raw) {
  if (!raw) return initialWorkspace();
  const state=JSON.parse(raw);
  if (state?.version!==1 || !Number.isSafeInteger(state.revision) || state.revision<0 || !Array.isArray(state.requests) || state.requests.length>200 || !state.requests.every(validRecord) || new Set(state.requests.map(r=>r.id)).size!==state.requests.length) throw new Error('invalid');
  return state;
}
export function loadWorkspace(storage) {
  let raw;
  try { raw=storage.getItem(STORAGE_KEY); } catch { return {state:initialWorkspace(),notice:'storage'}; }
  try { return {state:decodeWorkspace(raw),notice:null}; } catch { return {state:initialWorkspace(),notice:'recovered'}; }
}
export function createRequest(state, values, resolvePlace, now = new Date().toISOString()) {
  if (state.requests.length>=200) return {ok:false,error:'limit'};
  const kind=values.kind;
  const title=typeof values.title==='string'?values.title.trim():'';
  const problem=typeof values.problem==='string'?values.problem.trim():'';
  const expected=typeof values.expected==='string'?values.expected.trim():'';
  const fieldErrors={};
  if (title.length<5||title.length>160) fieldErrors.title='invalid';
  if (problem.length<10||problem.length>4000) fieldErrors.problem='invalid';
  if ((kind==='change'&&expected.length<10)||expected.length>4000) fieldErrors.expected='invalid';
  if (!['change','question'].includes(kind)) fieldErrors.kind='invalid';
  if (!MODULE_IDS.has(values.moduleId)) fieldErrors.moduleId='invalid';
  let place=null;
  if (values.place?.id) place=resolvePlace(values.moduleId,values.place.id);
  if (!place) fieldErrors.place='invalid';
  if (Object.keys(fieldErrors).length) return {ok:false,error:'invalid',fieldErrors};
  const number=Math.max(0,...state.requests.map(r=>Number(r.id.slice(2))))+1;
  const id=`W-${number}`;
  const record=seed(id,values.moduleId,title,place?{id:place.id,label:place.label,kind:place.kind}:null,'analysis',problem,expected,{
    requester:pair('Вы (учебный участник)','You (sample participant)'),assignee:pair('Не назначен','Unassigned'),
    updatedAt:now,history:[{id:`create-${number}`,text:pair('Заявка создана в этом браузере','Request created in this browser'),at:now}],
  });
  return {ok:true,id,state:{...state,revision:state.revision+1,requests:[record,...state.requests]}};
}
export function addComment(state, id, value, now = new Date().toISOString()) {
  const record=state.requests.find(r=>r.id===id), comment=typeof value==='string'?value.trim():'';
  if (!record || !comment || comment.length>2000) return {ok:false,error:'invalid'};
  if (record.comments.length>=100) return {ok:false,error:'limit'};
  const updated={...record,updatedAt:now,comments:[...record.comments,{id:`comment-${record.comments.length+1}`,author:pair('Вы (учебный участник)','You (sample participant)'),text:comment,at:now}]};
  return {ok:true,id,state:{...state,revision:state.revision+1,requests:state.requests.map(r=>r.id===id?updated:r)}};
}
export function saveWorkspace(storage, previous, next) {
  try {
    const raw=storage.getItem(STORAGE_KEY);
    // A changed workspace must be read before a stale tab can write to it.
    if (raw) {
      let current;
      try { current=decodeWorkspace(raw); } catch { current=null; }
      if (current && current.revision!==previous.revision) return {ok:false,error:'conflict',state:current};
    }
    storage.setItem(STORAGE_KEY,JSON.stringify(next));
    return {ok:true,state:next};
  } catch { return {ok:true,state:next,notice:'storage'}; }
}
