import React from 'react';
import {ModuleList,ModuleDetail} from './Modules.jsx';
import {RequestList,RequestDetail,RequestEditor} from './Requests.jsx';
import './workspace.css';

export function Workspace({path,t,lang,workspace}) {
  const [pathname,search='']=path.split('?');
  const [area,id]=pathname.split('/');
  const query=new URLSearchParams(search);
  let content;
  if(area==='modules') content=id?<ModuleDetail t={t} lang={lang} moduleId={id} query={query} requests={workspace.state.requests}/>:<ModuleList t={t} lang={lang} requests={workspace.state.requests}/>;
  else if(id==='new') content=<RequestEditor key={`${query.get('module')||''}/${query.get('place')||query.get('selected')||''}`} t={t} lang={lang} query={query} onCreate={values=>{
    const result=workspace.create(values);
    if(result.ok) location.hash=`requests?created=${encodeURIComponent(result.id)}`;
    return result;
  }}/>;
  else if(id) content=<RequestDetail t={t} lang={lang} query={query} request={workspace.state.requests.find(r=>r.id===id)} onComment={value=>workspace.comment(id,value)}/>;
  else content=<RequestList t={t} lang={lang} requests={workspace.state.requests} query={query}/>;
  return <div className="container workspace-root">
    <div className="workspace-banner"><div><strong>{t('Учебное рабочее пространство','Sample workspace')}</strong><p>{t('Вымышленные модули и заявки. Действия сохраняются в этом браузере; ELMA и AIWorks не вызываются.','Synthetic modules and requests. Actions are saved in this browser; ELMA and AIWorks are not called.')}</p></div><a href="#capabilities">{t('О продукте','About the product')}</a></div>
    <nav className="workspace-nav" aria-label={t('Рабочее пространство','Workspace')}><a href="#modules" aria-current={area==='modules'?'page':undefined}>{t('Модули','Modules')}</a><a href="#requests" aria-current={area==='requests'?'page':undefined}>{t('Заявки','Requests')}</a><a href="#demo">{t('Пройти приемку','Try acceptance')}</a></nav>
    {workspace.notice&&<p className="workspace-notice" role="status">{workspace.notice==='storage'?t('Сохранение в браузере недоступно. Можно продолжать, но новые заявки и комментарии исчезнут после обновления.','Browser storage is unavailable. You can continue, but new requests and comments will be lost on refresh.'):workspace.notice==='conflict'?t('Рабочее пространство изменилось в другой вкладке. Обновленные записи загружены. Проверьте их и повторите сохранение; ваш текст остался в форме.','The workspace changed in another tab. Updated records are loaded. Review them and save again; your form text has been preserved.'):t('Сохраненные учебные данные не удалось прочитать. Загружен исходный пример.','Saved sample data could not be read. The original example has been loaded.')}</p>}
    {content}
  </div>;
}
