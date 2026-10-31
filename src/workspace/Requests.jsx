import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CommentDiscussionIcon, XIcon } from '@primer/octicons-react';
import { MODULES } from './modules-data.mjs';
import { text, STAGES } from './model.mjs';
import './requests.css';

const paramsOf = query => new URLSearchParams(query instanceof URLSearchParams ? query.toString() : query || '');
const show = (value, t) => text(value, t) || t('Не указано', 'Not specified');
const moduleOf = id => MODULES.find(module => module.id === id);
const dateOf = (value, lang, time = false) => {
  const date = new Date(value);
  if (!value || !Number.isFinite(date.getTime())) return '';
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'ru-RU', { day: 'numeric', month: 'short', ...(time ? { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' } : {}) }).format(date);
};
const stageOf = stage => STAGES[stage] || STAGES.analysis;
const contextHref = request => `#modules/${encodeURIComponent(request.moduleId)}?${new URLSearchParams({ view: ['process', 'step'].includes(request.place?.kind) ? 'process' : 'form', ...(request.place?.id ? { selected: request.place.id } : {}) })}`;
const requestHref = (id, list = '') => `#requests/${encodeURIComponent(id)}${list ? `?${new URLSearchParams({ return: list })}` : ''}`;
const listHref = query => `#requests${query.toString() ? `?${query}` : ''}`;

function Stage({ stage, t, withTurn = true }) {
  const value = stageOf(stage);
  return <span className="rq-stage-cell"><span className={`rq-stage rq-stage-${stage}`}>{text(value.label, t)}</span>{withTurn && value.turn && <span className="rq-turn">{t('Ход:', 'Next:')} {text(value.turn, t)}</span>}</span>;
}

export function RequestList({ t, lang, requests = [], query }) {
  const params = paramsOf(query), search = params.get('q') || '', moduleId = params.get('module') || '', stage = params.get('stage') || '';
  const closed = params.get('closed') === '1', sort = params.get('sort') === 'title' ? 'title' : 'updated', ascending = params.get('dir') === 'asc';
  const setQuery = (key, value) => {
    const next = paramsOf(query);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('created');
    window.location.hash = listHref(next);
  };
  const sortBy = key => {
    const next = paramsOf(query); next.set('sort', key); next.set('dir', sort === key && !ascending ? 'asc' : 'desc');
    window.location.hash = listHref(next);
  };
  const terms = search.trim().toLocaleLowerCase(lang).split(/\s+/).filter(Boolean);
  const matches = requests.filter(request => {
    if (!closed && stage !== 'done' && request.stage === 'done') return false;
    if (moduleId && request.moduleId !== moduleId || stage && request.stage !== stage) return false;
    const haystack = [request.id, show(request.title, t), show(request.requester, t), show(request.assignee, t), show(moduleOf(request.moduleId)?.name, t), show(request.place?.label, t)].join(' ').toLocaleLowerCase(lang);
    return terms.every(term => haystack.includes(term));
  }).sort((a, b) => {
    const compared = sort === 'title' ? show(a.title, t).localeCompare(show(b.title, t), lang, { sensitivity: 'base', numeric: true }) : String(a.updatedAt || '').localeCompare(String(b.updatedAt || ''));
    return (ascending ? 1 : -1) * compared;
  });
  const filtered = !!(search || moduleId || stage || closed);
  const sortButton = (key, label) => <button type="button" onClick={() => sortBy(key)}>{label}{sort === key && <span aria-hidden="true"> {ascending ? '↑' : '↓'}</span>}</button>;
  return <div className="rq-view rq-board">
    <header className="rq-page-head"><div><p className="eyebrow">{t('Рабочее пространство', 'Workspace')}</p><h1>{t('Заявки', 'Requests')}</h1><p>{t('Что нужно изменить, где это находится и чей следующий шаг.', 'What should change, where it belongs and who acts next.')}</p></div><a className="button" href="#requests/new">{t('Новая заявка', 'New request')}<ArrowRightIcon size={17}/></a></header>
    <form noValidate className="rq-filters" role="search" aria-label={t('Поиск и фильтры заявок', 'Request search and filters')} onSubmit={event => event.preventDefault()}>
      <div className="rq-search"><label className="rq-sr-only" htmlFor="rq-search">{t('Поиск по заявкам', 'Search requests')}</label><input id="rq-search" type="search" value={search} placeholder={t('Номер, название, заказчик или исполнитель', 'Number, title, requester or assignee')} onChange={event => setQuery('q', event.target.value)}/>{search && <button type="button" aria-label={t('Очистить поиск', 'Clear search')} onClick={() => { setQuery('q', ''); document.getElementById('rq-search')?.focus(); }}><XIcon size={17}/></button>}</div>
      <label className="rq-filter"><span>{t('Модуль', 'Module')}</span><select value={moduleId} onChange={event => setQuery('module', event.target.value)}><option value="">{t('Все модули', 'All modules')}</option>{MODULES.map(module => <option key={module.id} value={module.id}>{show(module.name, t)}</option>)}</select></label>
      <label className="rq-filter"><span>{t('Этап', 'Stage')}</span><select value={stage} onChange={event => setQuery('stage', event.target.value)}><option value="">{t('Все этапы', 'All stages')}</option>{Object.entries(STAGES).map(([key, value]) => <option key={key} value={key}>{text(value.label, t)} · {text(value.turn, t)}</option>)}</select></label>
      <label className="rq-closed"><input type="checkbox" checked={closed} onChange={event => setQuery('closed', event.target.checked ? '1' : '')}/><span>{t('Показать закрытые', 'Show closed')}</span></label>
    </form>
    <div className="rq-list-summary"><p role="status">{t('Показано заявок:', 'Requests shown:')} <strong>{matches.length}</strong>{matches.length !== requests.length && <> {t('из', 'of')} {requests.length}</>}</p>{filtered && <a href="#requests">{t('Сбросить фильтры', 'Reset filters')}</a>}</div>
    {matches.length ? <div className="rq-table-wrap" tabIndex={0} role="region" aria-label={t('Список заявок, на узком экране можно прокрутить', 'Request list, scroll on a narrow screen')}><table className="rq-table"><caption className="rq-sr-only">{t('Заявки учебной компании', 'Sample company requests')}</caption><thead><tr><th scope="col">{t('№', 'No.')}</th><th scope="col" aria-sort={sort === 'title' ? ascending ? 'ascending' : 'descending' : 'none'}>{sortButton('title', t('Заявка', 'Request'))}</th><th scope="col" className="rq-col-module">{t('Модуль', 'Module')}</th><th scope="col">{t('Этап', 'Stage')}</th><th scope="col" className="rq-col-package">{t('Пакет', 'Package')}</th><th scope="col" className="rq-col-assignee">{t('Исполнитель', 'Assignee')}</th><th scope="col" className="rq-col-requester">{t('Заказчик', 'Requester')}</th><th scope="col" className="rq-col-updated" aria-sort={sort === 'updated' ? ascending ? 'ascending' : 'descending' : 'none'}>{sortButton('updated', t('Обновлена', 'Updated'))}</th></tr></thead><tbody>{matches.map(request => <tr key={request.id} className={params.get('created') === request.id ? 'rq-created-row' : undefined}><td><span className="rq-number">{request.id}</span></td><td><a className="rq-request-title" href={requestHref(request.id, params.toString())}>{show(request.title, t)}</a>{request.kind === 'question' && <span className="rq-question-mark">{t('Вопрос', 'Question')}</span>}</td><td className="rq-col-module"><a href={`#modules/${encodeURIComponent(request.moduleId)}`}>{show(moduleOf(request.moduleId)?.name, t)}</a></td><td><Stage stage={request.stage} t={t}/></td><td className="rq-col-package">{request.package ? show(request.package, t) : <span className="quiet">{t('Не в пакете', 'No package')}</span>}</td><td className="rq-col-assignee">{request.assignee ? show(request.assignee, t) : <span className="quiet">{t('Не назначен', 'Unassigned')}</span>}</td><td className="rq-col-requester">{show(request.requester, t)}</td><td className="rq-col-updated"><time dateTime={request.updatedAt}>{dateOf(request.updatedAt, lang)}</time></td></tr>)}</tbody></table></div> : <div className="rq-empty"><h2>{t('Таких заявок нет', 'No matching requests')}</h2><p>{t('Попробуйте другое слово или уберите часть фильтров.', 'Try a different search or remove a filter.')}</p><a className="button secondary" href="#requests">{t('Показать все открытые', 'Show all open requests')}</a></div>}
    <p className="rq-note">{t('Это список на вымышленных данных. Заявка открывается по названию, ее место - по ссылке на модуль.', 'These are synthetic records. Open a request by its title, or follow its module link to see the context.')}</p>
  </div>;
}

export function RequestDetail({ t, lang, request, query, onComment }) {
  const [comment, setComment] = useState(''), [error, setError] = useState(''), [notice, setNotice] = useState(''), [sending, setSending] = useState(false);
  useEffect(() => { setComment(''); setError(''); setNotice(''); }, [request?.id]);
  if (!request) return <div className="rq-view rq-empty"><h1>{t('Заявка не найдена', 'Request not found')}</h1><a href="#requests">{t('К списку заявок', 'Back to requests')}</a></div>;
  const backHref = listHref(new URLSearchParams(paramsOf(query).get('return') || ''));
  const statusLabels = { analysis: ['Новая', 'New'], 'needs-answer': ['Нужно уточнение', 'Clarification needed'], ready: ['Новая', 'New'], development: ['В работе', 'In progress'], review: ['На проверке', 'In review'], done: ['Выполнена', 'Done'] };
  const stage = stageOf(request.stage), module = moduleOf(request.moduleId);
  const submitComment = async event => {
    event.preventDefault(); if (sending) return;
    if (comment.trim().length < 3) { setError(t('Напишите хотя бы несколько слов, минимум 3 символа.', 'Write a short comment of at least 3 characters.')); document.getElementById('rq-comment')?.focus(); return; }
    setSending(true); setError(''); setNotice('');
    try {
      const result = await onComment(comment.trim());
      if (!result?.ok) { setError(t('Комментарий не сохранен. Текст остался в поле, попробуйте еще раз.', 'The comment was not saved. Your text is still here; try again.')); return; }
      setComment(''); setNotice(t('Комментарий добавлен в учебную заявку.', 'Comment added to the sample request.'));
    } catch { setError(t('Не удалось добавить комментарий. Текст сохранен в поле.', 'Could not add the comment. Your text is still in the field.')); }
    finally { setSending(false); }
  };
  const timeline = [...(request.history || []).map(item => ({ ...item, event: true })), ...(request.comments || []).map(item => ({ ...item, event: false }))].sort((a, b) => String(a.at).localeCompare(String(b.at)));
  return <article className="rq-view rq-detail">
    <a className="rq-back" href={backHref}><ArrowLeftIcon size={16}/>{t('Заявки', 'Requests')}</a>
    <header className="rq-detail-head"><h1>{show(request.title, t)}</h1><div className="rq-title-meta"><strong className="rq-number">{request.id}</strong><Stage stage={request.stage} t={t}/></div></header>
    <div className="rq-next-step"><p><strong>{t('Сейчас:', 'Current stage:')} {text(stage.label, t)}</strong></p>{request.question && request.stage === 'needs-answer' && <p>{show(request.question, t)}</p>}<p>{request.stage === 'needs-answer' ? t('Уточнения можно записать комментарием ниже. В этом примере комментарий сохраняется локально и не запускает ИИ.', 'Add a clarification in the comments below. In this sample it is saved locally and does not start an AI check.') : t('Посмотрите ожидаемый результат, место заявки и историю обсуждения. Учебный пример не меняет статус автоматически.', 'Review the expected result, request context and discussion. This sample does not automatically change its stage.')}</p>{request.stage === 'needs-answer' && <a href="#rq-discussion" onClick={event => { event.preventDefault(); document.getElementById('rq-comment')?.focus(); document.getElementById('rq-comment')?.scrollIntoView({ block: 'center' }); }}>{t('Ответить в обсуждении', 'Answer in the discussion')}<ArrowRightIcon size={16}/></a>}</div>
    <div className="rq-detail-layout"><div className="rq-detail-main">
      <section><h2>{t('Что происходит сейчас', 'What happens today')}</h2><p className="rq-prose">{show(request.problem, t)}</p></section>
      {request.expected && <section><h2>{request.kind === 'question' ? t('Что нужно выяснить', 'What needs explaining') : t('Что должно быть', 'Expected behavior')}</h2><p className="rq-prose">{show(request.expected, t)}</p></section>}
      <section><h2>{t('Где', 'Where')}</h2><a className="rq-context-link" href={contextHref(request)}><span>{show(module?.name, t)}</span>{request.place && <><span aria-hidden="true"> / </span><strong>{show(request.place.label, t)}</strong></>}<ArrowRightIcon size={16}/></a><p className="rq-note">{request.place ? t('Ссылка откроет карточку или процесс и выделит место этой заявки.', 'The link opens the form or process and highlights the request’s location.') : t('Точное место еще не выбрано. Ссылка откроет модуль, к которому относится заявка.', 'The exact location has not been chosen. The link opens this request’s module.')}</p></section>
      <section id="rq-discussion" className="rq-discussion"><h2>{t('Комментарии и история', 'Comments and history')}</h2>{timeline.length ? <ol className="rq-timeline">{timeline.map((item, index) => <li key={`${item.event ? 'event' : 'comment'}-${item.id || index}`} className={item.event ? 'rq-timeline-event' : 'rq-timeline-comment'}><div className="rq-timeline-top">{!item.event && <strong>{show(item.author, t)}</strong>}<time dateTime={item.at}>{dateOf(item.at, lang, true)}</time></div><p className="rq-prose">{show(item.text, t)}</p></li>)}</ol> : <p className="quiet">{t('Здесь появятся комментарии к этой учебной заявке.', 'Comments on this sample request will appear here.')}</p>}
        <form className="rq-comment-form" onSubmit={submitComment} noValidate><label htmlFor="rq-comment">{t('Ваш комментарий', 'Your comment')}</label><textarea className="resize-none" id="rq-comment" rows={4} maxLength={2000} value={comment} onChange={event => { setComment(event.target.value); setError(''); setNotice(''); }} aria-invalid={!!error} aria-describedby={error ? 'rq-comment-error rq-comment-help' : 'rq-comment-help'} disabled={sending}/><p id="rq-comment-help" className="rq-note">{t('Не вводите рабочие или персональные данные. Комментарий остается в этом браузере; участникам ничего не отправляется.', 'Use sample text without work or personal data. The comment stays in this browser; no message is sent to participants.')}</p>{error && <p className="error-text" role="alert" id="rq-comment-error">{error}</p>}{notice && <p className="rq-success" role="status">{notice}</p>}<button className="button secondary" type="submit" disabled={sending} aria-busy={sending}><CommentDiscussionIcon size={17}/>{sending ? t('Добавляем…', 'Adding…') : t('Добавить комментарий', 'Add comment')}</button></form>
      </section>
    </div><aside className="rq-metadata" aria-label={t('Сведения о заявке', 'Request details')}><h2>{t('О заявке', 'Request details')}</h2><dl><div><dt>{t('Статус', 'Status')}</dt><dd>{text(statusLabels[request.stage] || statusLabels.analysis, t)}</dd></div><div><dt>{t('Исполнитель', 'Assignee')}</dt><dd>{request.assignee ? show(request.assignee, t) : t('Не назначен', 'Unassigned')}</dd></div><div><dt>{t('Заказчик', 'Requester')}</dt><dd>{show(request.requester, t)}</dd></div><div><dt>{t('Вид', 'Type')}</dt><dd>{request.kind === 'question' ? t('Вопрос', 'Question') : t('Изменение', 'Change')}</dd></div><div><dt>{t('Модуль', 'Module')}</dt><dd><a href={`#modules/${encodeURIComponent(request.moduleId)}`}>{show(module?.name, t)}</a></dd></div><div><dt>{t('Пакет', 'Package')}</dt><dd>{request.package ? show(request.package, t) : t('Не в пакете', 'No package')}</dd></div><div><dt>{t('Обновлена', 'Updated')}</dt><dd><time dateTime={request.updatedAt}>{dateOf(request.updatedAt, lang, true)}</time></dd></div></dl><p className="rq-note">{t('Учебная запись. Работающие подключения к ELMA и AIWorks здесь не используются.', 'Sample record. No live ELMA or AIWorks connection is used here.')}</p></aside></div>
  </article>;
}

function placeOptions(module) {
  if (!module) return [];
  return [...module.forms.flatMap(form => [{ id: form.id, label: form.name, kind: 'form', parent: null }, ...form.fields.map(field => ({ id: field.id, label: field.name, kind: 'field', parent: form.name })), ...(form.actions || []).map(action => ({ id: action.id, label: action.name, kind: 'action', parent: form.name }))]), ...module.processes.flatMap(process => [{ id: process.id, label: process.name, kind: 'process', parent: null }, ...process.steps.map(step => ({ id: step.id, label: step.name, kind: 'step', parent: process.name }))])];
}

const editorDrafts = new Map();

export function RequestEditor({ t, lang, query, onCreate }) {
  const params = paramsOf(query), origin = moduleOf(params.get('module'));
  const initialModule = origin?.id || MODULES[0]?.id || '';
  const suppliedPlace = params.get('place') || params.get('selected') || '';
  const initial = { moduleId: initialModule, placeId: placeOptions(moduleOf(initialModule)).some(place => place.id === suppliedPlace) ? suppliedPlace : '', kind: 'change', title: '', problem: '', expected: '' };
  const draftKey = `${initialModule}/${suppliedPlace}`;
  const restored = useRef(editorDrafts.has(draftKey));
  const [values, setValues] = useState(() => editorDrafts.get(draftKey) || initial), [errors, setErrors] = useState({}), [failure, setFailure] = useState(''), [saving, setSaving] = useState(false);
  const snapshot = useRef(initial), dialog = useRef(null), destination = useRef(''), form = useRef(null);
  const dirty = Object.keys(snapshot.current).some(key => values[key] !== snapshot.current[key]);
  useEffect(() => { if (dirty) editorDrafts.set(draftKey, { ...values }); else editorDrafts.delete(draftKey); }, [draftKey, values, dirty]);
  const cancelHref = origin ? `#modules/${encodeURIComponent(origin.id)}${suppliedPlace ? `?${new URLSearchParams({ selected: suppliedPlace, view: ['process', 'step'].includes(placeOptions(origin).find(place => place.id === suppliedPlace)?.kind) ? 'process' : 'form' })}` : ''}` : '#requests';
  const options = placeOptions(moduleOf(values.moduleId)), selectedPlace = options.find(place => place.id === values.placeId);
  const update = (key, value) => { setValues(current => ({ ...current, [key]: value, ...(key === 'moduleId' ? { placeId: '' } : {}) })); setErrors(current => ({ ...current, [key]: undefined })); setFailure(''); };
  useEffect(() => {
    if (!dirty) return;
    const warn = event => { event.preventDefault(); event.returnValue = ''; };
    const guardLink = event => {
      const link = event.target.closest?.('a[href^="#"]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || link.getAttribute('href') === window.location.hash || link.getAttribute('href') === '#rq-editor') return;
      event.preventDefault(); destination.current = link.getAttribute('href'); dialog.current?.showModal();
    };
    window.addEventListener('beforeunload', warn); document.addEventListener('click', guardLink);
    return () => { window.removeEventListener('beforeunload', warn); document.removeEventListener('click', guardLink); };
  }, [dirty]);
  const submit = async event => {
    event.preventDefault(); if (saving) return;
    const next = {};
    if (!values.moduleId) next.moduleId = t('Выберите модуль.', 'Choose a module.');
    if (!selectedPlace) next.placeId = t('Выберите конкретное место заявки.', 'Choose the request’s location.');
    if (values.title.trim().length < 5) next.title = t('Добавьте понятное название, минимум 5 символов.', 'Add a clear title of at least 5 characters.');
    if (values.problem.trim().length < 10) next.problem = t('Опишите ситуацию, минимум 10 символов.', 'Describe the situation in at least 10 characters.');
    if (values.kind === 'change' && values.expected.trim().length < 10) next.expected = t('Опишите ожидаемый результат, минимум 10 символов.', 'Describe the expected result in at least 10 characters.');
    setErrors(next); setFailure('');
    if (Object.keys(next).length) { requestAnimationFrame(() => document.getElementById(`rq-editor-${Object.keys(next)[0]}`)?.focus()); return; }
    setSaving(true);
    try {
      const result = await onCreate({ kind: values.kind, moduleId: values.moduleId, title: values.title.trim(), problem: values.problem.trim(), expected: values.expected.trim(), place: { id: selectedPlace.id, kind: selectedPlace.kind, label: selectedPlace.label } });
      if (result?.ok) { editorDrafts.delete(draftKey); snapshot.current = { ...values }; }
      if (!result?.ok) {
        setFailure(result?.error === 'limit' ? t('В этом браузере уже много учебных записей. Сохраните нужный текст и начните пример заново.', 'This browser already has many sample records. Keep the text you need and restart the sample.') : t('Не удалось создать заявку. Текст остался в форме, попробуйте еще раз.', 'Could not create the request. Your text is still in the form; try again.'));
        if (result?.fieldErrors) {
          const fieldErrors = Object.fromEntries(Object.keys(result.fieldErrors).map(key => [key === 'place' ? 'placeId' : key, t('Проверьте значение этого поля.', 'Check this field’s value.')]));
          setErrors(fieldErrors); requestAnimationFrame(() => document.getElementById(`rq-editor-${Object.keys(fieldErrors)[0]}`)?.focus());
        }
      }
    } catch { setFailure(t('Не удалось создать заявку. Текст сохранен в форме.', 'Could not create the request. Your text is still in the form.')); }
    finally { setSaving(false); }
  };
  const field = (key, label, control, help) => <div className="rq-editor-field"><label htmlFor={`rq-editor-${key}`}>{label}</label>{control}{help && <p id={`rq-editor-${key}-help`} className="rq-note">{help}</p>}{errors[key] && <p id={`rq-editor-${key}-error`} className="error-text" role="alert">{errors[key]}</p>}</div>;
  const describedBy = key => errors[key] ? `rq-editor-${key}-error` : undefined;
  return <div className="rq-view rq-editor">
    <a className="rq-back" href={cancelHref}><ArrowLeftIcon size={16}/>{origin ? t('К модулю', 'Back to module') : t('К заявкам', 'Back to requests')}</a>
    <header className="rq-page-head"><div><p className="eyebrow">{t('Учебная компания', 'Sample company')}</p><h1>{t('Новая заявка', 'New request')}</h1><p>{t('Опишите проблему своими словами и свяжите ее с местом в системе.', 'Describe the problem in your own words and link it to a place in the system.')}</p></div></header>
    {restored.current && <p className="workspace-notice" role="status">{t('Восстановлен несохраненный черновик этой вкладки.', 'The unsaved draft from this tab has been restored.')}</p>}
    <form id="rq-editor" ref={form} className="rq-editor-form" onSubmit={submit} noValidate>
      <fieldset className="rq-kind"><legend>{t('Что хотите сделать?', 'What would you like to do?')}</legend><label><input type="radio" name="request-kind" value="change" checked={values.kind === 'change'} onChange={() => update('kind', 'change')}/><span>{t('Предложить изменение', 'Suggest a change')}</span></label><label><input type="radio" name="request-kind" value="question" checked={values.kind === 'question'} onChange={() => update('kind', 'question')}/><span>{t('Задать вопрос', 'Ask a question')}</span></label></fieldset>
      <div className="rq-editor-context">{field('moduleId', t('Модуль', 'Module'), <select id="rq-editor-moduleId" value={values.moduleId} onChange={event => update('moduleId', event.target.value)} aria-invalid={!!errors.moduleId} aria-describedby={describedBy('moduleId')} required>{MODULES.map(module => <option key={module.id} value={module.id}>{show(module.name, t)}</option>)}</select>)}
      {field('placeId', t('Где', 'Where'), <select id="rq-editor-placeId" value={values.placeId} onChange={event => update('placeId', event.target.value)} aria-invalid={!!errors.placeId} aria-describedby={describedBy('placeId')} required><option value="">{t('Выберите поле, карточку или шаг', 'Choose a field, form or step')}</option>{options.map(place => <option key={`${place.kind}-${place.id}`} value={place.id}>{place.parent ? `${show(place.parent, t)} / ` : ''}{show(place.label, t)}</option>)}</select>)}</div>
      {selectedPlace && <p className="rq-context-confirmation">{t('Заявка будет связана с:', 'The request will be linked to:')} <strong>{show(moduleOf(values.moduleId)?.name, t)} / {show(selectedPlace.label, t)}</strong></p>}
      {field('title', t('Коротко', 'Title'), <input id="rq-editor-title" type="text" maxLength={160} value={values.title} onChange={event => update('title', event.target.value)} aria-invalid={!!errors.title} aria-describedby={describedBy('title')} required/>)}
      {field('problem', values.kind === 'question' ? t('Что хотите узнать', 'What would you like to know?') : t('Что происходит сейчас', 'What happens today'), <textarea className="resize-none" id="rq-editor-problem" rows={4} maxLength={2000} value={values.problem} onChange={event => update('problem', event.target.value)} aria-invalid={!!errors.problem} aria-describedby={describedBy('problem')} required/>)}
      {field('expected', values.kind === 'question' ? t('Дополнительный контекст - необязательно', 'Additional context - optional') : t('Что должно быть', 'Expected behavior'), <textarea className="resize-none" id="rq-editor-expected" rows={4} maxLength={2000} value={values.expected} onChange={event => update('expected', event.target.value)} aria-invalid={!!errors.expected} aria-describedby={describedBy('expected')} required={values.kind === 'change'}/>)}
      <p className="rq-note">{t('Пишите на вымышленных данных. Заявка сохранится только в этом браузере и появится в списке; в рабочие системы ничего не отправляется.', 'Use synthetic information. The request will be saved in this browser and appear in the list; nothing is sent to a working system.')}</p>
      {failure && <p className="error-text" role="alert">{failure}</p>}
      <div className="button-row"><button className="button" type="submit" disabled={saving} aria-busy={saving}>{saving ? t('Создаем…', 'Creating…') : t('Создать учебную заявку', 'Create sample request')}<ArrowRightIcon size={17}/></button><a className="button secondary" href={cancelHref}>{t('Отмена', 'Cancel')}</a></div>
    </form>
    <dialog ref={dialog} className="rq-leave-dialog" aria-labelledby="rq-leave-title" aria-describedby="rq-leave-description"><h2 id="rq-leave-title">{t('Уйти без сохранения заявки?', 'Leave without saving the request?')}</h2><p id="rq-leave-description">{t('Введенный текст исчезнет. Можно остаться и закончить заявку.', 'Your entered text will be lost. You can stay and finish the request.')}</p><div className="button-row"><button type="button" className="button secondary" onClick={() => dialog.current?.close()}>{t('Остаться', 'Keep editing')}</button><button type="button" className="button" onClick={() => { editorDrafts.delete(draftKey); snapshot.current = { ...values }; dialog.current?.close(); window.location.hash = destination.current || cancelHref; }}>{t('Уйти без сохранения', 'Leave without saving')}</button></div></dialog>
  </div>;
}
