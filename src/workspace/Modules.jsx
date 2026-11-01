import React, { useEffect, useState } from 'react';
import { ArrowRightIcon, ChevronRightIcon } from '@primer/octicons-react';
import { MODULES, findModule, findModulePlace } from './modules-data.mjs';
import { STAGES, text } from './model.mjs';
import './modules.css';

const words = (value, lang) => text(value, (ru, en) => lang === 'en' ? en : ru);
const readQuery = (query, key) => typeof query?.get === 'function' ? query.get(key) : query?.[key];
const openRequests = requests => (requests || []).filter(row => row.stage !== 'done');
const moduleHref = (id, params = {}) => `#modules/${encodeURIComponent(id)}${Object.values(params).some(Boolean) ? `?${new URLSearchParams(Object.entries(params).filter(([, value]) => value))}` : ''}`;
const requestHref = id => `#requests/${encodeURIComponent(id)}`;
const newRequestHref = (moduleId, placeId) => `#requests/new?${new URLSearchParams({ module: moduleId, ...(placeId ? { place: placeId } : {}) })}`;
const Stage = ({ stage, lang }) => <span className="tag">{words((STAGES[stage] || STAGES.analysis).label, lang)}</span>;

function RequestRows({ rows, lang, t, href, activeId }) {
  return rows.length ? <ul className="wm-request-list">{rows.map(row => <li key={row.id}><a href={href ? href(row) : requestHref(row.id)} className={row.id === activeId ? 'wm-active' : undefined} aria-current={row.id === activeId ? 'true' : undefined}><span className="wm-request-title"><small>{row.id}</small><strong>{words(row.title, lang)}</strong></span><span className="wm-request-meta"><Stage stage={row.stage} lang={lang}/><span>{words(row.place?.label, lang) || t('Модуль целиком', 'Whole module')}</span></span></a></li>)}</ul> : <p className="quiet wm-empty">{t('Открытых заявок здесь пока нет. Выберите элемент и предложите изменение.', 'There are no open requests here yet. Choose an element and propose a change.')}</p>;
}

export function ModuleList({ t, lang, requests = [] }) {
  const active = openRequests(requests);
  return <div className="page-content wm-page">
    <div className="page-intro"><p className="eyebrow">{t('Учебное рабочее пространство', 'Sample workspace')}</p><h1>{t('Модули', 'Modules')}</h1><p className="lede">{t('Выберите модуль: в нем карточки, процессы и заявки на конкретные элементы. Все примеры вымышлены.', 'Choose a module to explore its forms, processes and requests about specific elements. All examples are synthetic.')}</p></div>
    <div className="wm-module-list">{MODULES.map(module => {
      const count = active.filter(row => row.moduleId === module.id).length;
      return <article key={module.id}><a className="wm-module-open" href={moduleHref(module.id)}><h2>{words(module.name, lang)}</h2><p>{words(module.description, lang)}</p><span>{t('Открыть модуль', 'Open module')}<ArrowRightIcon size={17}/></span></a><a className="wm-module-count" href={`#requests?${new URLSearchParams({ module: module.id })}`} aria-label={`${t('Заявки модуля', 'Module requests')}: ${words(module.name, lang)}`}><strong>{count}</strong><span>{t('открытых заявок', 'open requests')}</span></a></article>;
    })}</div>
    <p className="wm-sample-note">{t('Здесь показан принцип работы Wiki. Формы и процессы составлены для знакомства с продуктом и не воспроизводят рабочую конфигурацию.', 'This illustrates how Wiki works. The forms and processes were created for this sample and do not reproduce a live configuration.')}</p>
  </div>;
}

export function ModuleDetail({ t, lang, moduleId, query, requests = [] }) {
  const module = findModule(moduleId);
  const [formMode, setFormMode] = useState('view');
  const [showLayer, setShowLayer] = useState(true);
  useEffect(() => { setFormMode('view'); }, [moduleId]);
  if (!module) return <div className="page-content wm-page"><a className="text-link" href="#modules">{t('К списку модулей', 'Back to modules')}</a><h1>{t('Модуль не найден', 'Module not found')}</h1><p>{t('В учебном примере такого модуля нет.', 'This module is not part of the sample.')}</p></div>;
  const rows = openRequests(requests).filter(row => row.moduleId === module.id);
  const view = readQuery(query, 'view') || 'form';
  const asTable = readQuery(query, 'display') === 'table';
  const requestedId = readQuery(query, 'request');
  const focusedRequest = rows.find(row => row.id === requestedId) || null;
  const selectedId = focusedRequest ? focusedRequest.place?.id : readQuery(query, 'selected');
  const selected = findModulePlace(module.id, selectedId);
  const isProcessPlace = selected && ['step', 'process'].includes(selected.kind);
  const process = module.processes.find(row => row.id === (isProcessPlace ? selected.ownerId : readQuery(query, 'process'))) || module.processes[0];
  const form = module.forms.find(row => row.id === (selected && !isProcessPlace ? selected.ownerId : readQuery(query, 'form'))) || module.forms[0];
  const showingProcess = !!process && (view === 'process' || isProcessPlace);
  const owner = showingProcess ? process : form;
  const ownerKind = showingProcess ? 'process' : 'form';
  const currentPlace = selected || findModulePlace(module.id, owner?.id);
  const matchesPlace = id => rows.filter(row => row.place?.id === id);
  const hereRequests = selected ? matchesPlace(selected.id) : rows.filter(row => row.place?.id === owner?.id);
  const selectedHref = id => moduleHref(module.id, { view: showingProcess ? 'process' : 'form', ...(showingProcess ? { process: process.id } : { form: form.id }), selected: selectedId === id ? null : id });
  const focusRequestHref = row => {
    const place = findModulePlace(module.id, row.place?.id);
    return moduleHref(module.id, { view: 'requests', request: row.id, selected: place?.id });
  };
  const displayHref = display => moduleHref(module.id, { view, selected: selectedId, request: requestedId, form: !showingProcess ? form?.id : null, process: showingProcess ? process?.id : null, display: display === 'table' ? 'table' : null });
  const countFor = id => showLayer ? matchesPlace(id).length : 0;
  const mark = id => `${selectedId === id ? ' wm-selected' : ''}${countFor(id) > 1 ? ' wm-overlap' : ''}${focusedRequest && selectedId !== id ? ' wm-dimmed' : ''}`;
  const countBadge = id => countFor(id) > 0 && <span className="wm-pin" aria-label={`${t('Открытых заявок', 'Open requests')}: ${countFor(id)}`}>{countFor(id)}</span>;
  const kindName = kind => ({ field: t('Поле', 'Field'), action: t('Действие', 'Action'), step: t('Шаг', 'Step'), process: t('Процесс', 'Process'), form: t('Карточка', 'Form') })[kind] || '';
  return <div className="page-content wm-page">
    <nav className="wm-breadcrumbs" aria-label={t('Путь к модулю', 'Module path')}><a href="#modules">{t('Модули', 'Modules')}</a><ChevronRightIcon size={14}/><span>{words(module.name, lang)}</span></nav>
    <div className="wm-module-heading"><div><h1>{words(module.name, lang)}</h1><p>{words(module.description, lang)}</p></div><span className="tag">{t('Учебная конфигурация', 'Sample configuration')}</span></div>
    <div className="wm-toolbar"><div className="wm-segments" role="group" aria-label={t('Разделы модуля', 'Module sections')}><a href={moduleHref(module.id, { view: 'form' })} aria-current={view !== 'requests' ? 'page' : undefined}>{t('Состав', 'Contents')}</a><a href={moduleHref(module.id, { view: 'requests', selected: selectedId, request: requestedId })} aria-current={view === 'requests' ? 'page' : undefined}>{t('Заявки', 'Requests')} · {rows.length}</a></div><label className="wm-layer-toggle"><input type="checkbox" checked={showLayer} onChange={event => setShowLayer(event.target.checked)}/><span>{t('Слой заявок', 'Request layer')}</span></label><a className="text-link" href={`#requests?${new URLSearchParams({ module: module.id })}`}>{t('Все заявки модуля', 'All module requests')}<ArrowRightIcon size={16}/></a></div>
    <div className="wm-display-switch wm-segments" role="group" aria-label={t('Как показать модуль','Module display')}><a href={displayHref('picture')} aria-current={!asTable ? 'page' : undefined}>{t('Картинка','Picture')}</a><a href={displayHref('table')} aria-current={asTable ? 'page' : undefined}>{t('Таблица изменений','Change table')} · {rows.length}</a></div>
    {(selectedId && !selected) || (requestedId && !focusedRequest) ? <p className="wm-sample-note" role="status">{t('Это место или заявка больше не доступны в учебном примере.', 'This location or request is no longer available in the sample.')} <a href={moduleHref(module.id)}>{t('Открыть состав', 'Open contents')}</a></p> : null}
    {asTable ? <section className="wm-change-table" aria-label={t('Таблица изменений модуля','Module change table')}><h2>{t('Где меняется модуль','Where the module changes')}</h2>{rows.length ? <div className="wm-table-scroll"><table><thead><tr><th scope="col">{t('Место','Location')}</th><th scope="col">{t('Заявка','Request')}</th><th scope="col">{t('Этап','Stage')}</th></tr></thead><tbody>{rows.map(row=><tr key={row.id}><td><a href={focusRequestHref(row)}>{words(row.place?.label,lang) || t('Модуль целиком','Whole module')}</a></td><td><a href={focusRequestHref(row)}><span className="wm-table-key">{row.id}</span>{words(row.title,lang)}</a></td><td><Stage stage={row.stage} lang={lang}/></td></tr>)}</tbody></table></div> : <div className="wm-table-empty"><p>{t('Открытых заявок в модуле пока нет. Выберите место на картинке или предложите изменение всего модуля.','This module has no open requests yet. Choose a location on the picture or propose a change to the whole module.')}</p><a className="button secondary" href={newRequestHref(module.id)}>{t('Предложить изменение','Propose a change')}</a></div>}</section> : <div className="wm-module-layout">
      <aside className="wm-rail" aria-label={t('Состав и заявки модуля', 'Module contents and requests')}>
        {view === 'requests' ? <><h2>{t('Открытые заявки', 'Open requests')}</h2><RequestRows rows={rows} lang={lang} t={t} activeId={focusedRequest?.id} href={focusRequestHref}/></> : <nav aria-label={t('Карточки и процессы', 'Forms and processes')}><h2>{t('Карточки', 'Forms')}</h2>{module.forms.map(row => <a key={row.id} href={moduleHref(module.id, { view: 'form', form: row.id })} className={!showingProcess && form?.id === row.id ? 'wm-active' : undefined} aria-current={!showingProcess && form?.id === row.id ? 'page' : undefined}>{words(row.name, lang)}</a>)}<h2>{t('Процессы', 'Processes')}</h2>{module.processes.length ? module.processes.map(row => <a key={row.id} href={moduleHref(module.id, { view: 'process', process: row.id })} className={showingProcess && process?.id === row.id ? 'wm-active' : undefined} aria-current={showingProcess && process?.id === row.id ? 'page' : undefined}>{words(row.name, lang)}</a>) : <p className="quiet wm-empty">{t('В этом примере показана только карточка.', 'This sample contains a form only.')}</p>}</nav>}
      </aside>
      <section className="wm-center" aria-label={t('Изображение карточки или процесса', 'Form or process illustration')}>
        <div className="wm-object-heading"><h2>{words(owner?.name, lang)}</h2>{!showingProcess && <div className="wm-segments" role="group" aria-label={t('Как выглядит форма при', 'Form mode')} >{[['create',t('Создании','Create')],['view',t('Просмотре','View')],['edit',t('Редактировании','Edit')]].map(([id,label])=><button key={id} type="button" aria-pressed={formMode === id} onClick={()=>setFormMode(id)}>{label}</button>)}</div>}</div>
        <p className="wm-picture-legend">{showingProcess ? t('Учебный маршрут по участникам. Выберите шаг, чтобы увидеть его описание и заявки.', 'Sample route by participant. Choose a step to inspect its description and requests.') : t('Изображение учебной формы. Поля выбираются для обсуждения, ввод данных здесь не выполняется.', 'Illustration of a sample form. Select fields to discuss them; this is not a data entry form.')}</p>
        {showingProcess ? <ol className="wm-process">{process.steps.map((step,index)=><li key={step.id}><span className="wm-step-role">{words(step.role,lang) || t('Участник','Participant')}</span>{step.condition && <p className="wm-condition">{words(step.condition,lang)}</p>}<a href={selectedHref(step.id)} className={`wm-process-step${mark(step.id)}`} aria-current={selectedId === step.id ? 'true' : undefined}><span className="wm-step-number" aria-hidden="true">{index+1}</span><strong>{words(step.name,lang)}</strong>{countBadge(step.id)}</a>{index<process.steps.length-1 && <ChevronRightIcon className="wm-step-arrow" size={18}/>}</li>)}</ol> : <div className={`wm-form-canvas${mark(form.id)}`}><div className="wm-form-picture"><div className="wm-form-caption"><strong>{formMode === 'create' ? `${t('Новая запись','New record')}: ` : ''}{words(form.name,lang)}</strong><span>{t('Учебный вид','Sample view')}</span>{countBadge(form.id)}</div><div className="wm-fields">{form.fields.map(field=><a key={field.id} href={selectedHref(field.id)} className={`wm-field${['attachment','comment','authority-scope'].includes(field.id)?' wm-wide':''}${mark(field.id)}`} aria-current={selectedId === field.id ? 'true' : undefined}><span className="wm-field-label">{words(field.name,lang)}{field.required && <b aria-label={t('обязательное','required')}> *</b>}</span><span className="wm-field-value">{words(field.type,lang)}</span>{countBadge(field.id)}</a>)}</div>{form.actions?.length > 0 && <div className="wm-form-actions">{form.actions.map(action=><a key={action.id} href={selectedHref(action.id)} className={`wm-form-action${mark(action.id)}`} aria-current={selectedId === action.id ? 'true' : undefined}>{words(action.name,lang)}{countBadge(action.id)}</a>)}</div>}</div></div>}
        {!showingProcess && form.statuses?.length > 0 && <section className="wm-statuses"><h3>{t('Статусы карточки', 'Record statuses')}</h3><ul>{form.statuses.map(status=><li key={status.id}><span className="tag">{words(status.name,lang)}</span></li>)}</ul><p>{t('Порядок списка не задает переходы между статусами.', 'The list order does not define transitions between statuses.')}</p></section>}
        {showLayer && rows.length > 0 && <p className="wm-picture-legend">{t('Число на элементе - открытые заявки к нему. Красная рамка отмечает несколько заявок на одном месте.', 'A number on an element shows its open requests. A red border marks several requests at the same location.')}</p>}
      </section>
      <aside className="wm-details" aria-label={t('Подробности выбранного места', 'Selected location details')}>
        {focusedRequest ? <><div className="wm-detail-top"><span className="eyebrow">{t('Заявка', 'Request')} {focusedRequest.id}</span><a href={moduleHref(module.id,{ view: 'requests' })}>{t('Снять выбор','Clear selection')}</a></div><h2>{words(focusedRequest.title,lang)}</h2><Stage stage={focusedRequest.stage} lang={lang}/><h3>{t('Где меняется','Change location')}</h3><p>{words(module.name,lang)} / {words(focusedRequest.place?.label,lang) || t('Модуль целиком','Whole module')}</p><h3>{t('О чем заявка','Request context')}</h3><p>{words(focusedRequest.problem,lang)}</p>{focusedRequest.expected && <><h3>{t('Ожидаемый результат','Expected result')}</h3><p>{words(focusedRequest.expected,lang)}</p></>}<a className="button secondary" href={requestHref(focusedRequest.id)}>{t('Открыть заявку','Open request')}<ArrowRightIcon size={16}/></a></> : <><span className="eyebrow">{kindName(currentPlace?.kind || ownerKind)}</span><h2>{words(currentPlace?.label || owner?.name,lang)}</h2><p>{words(currentPlace?.description,lang) || t('Выберите конкретное место, чтобы привязать к нему вопрос или изменение.','Choose a specific location to attach a question or change.')}</p>{currentPlace?.type && <p className="wm-type">{words(currentPlace.type,lang)}{currentPlace.required ? ` · ${t('обязательное','required')}` : ''}</p>}<a className="button" href={newRequestHref(module.id,currentPlace?.id)}>{t('Предложить изменение','Propose a change')}<ArrowRightIcon size={16}/></a><h3>{t('Заявки к этому месту','Requests at this location')} · {hereRequests.length}</h3><RequestRows rows={hereRequests} lang={lang} t={t} href={focusRequestHref}/></>}
      </aside>
    </div>}
    <p className="wm-sample-note">{t('Пример показывает конфигурацию и связанные заявки. Он не содержит записей реальной ELMA и не выполняет ее процессы.', 'The sample shows configuration and related requests. It contains no live ELMA records and does not execute its processes.')}</p>
  </div>;
}
