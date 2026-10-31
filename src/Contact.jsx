import React,{useState,useEffect,useRef} from 'react';
import {ArrowRightIcon} from '@primer/octicons-react';
import {Intro} from './Site.jsx';
import {sendContact} from './contactApi.js';

const ENDPOINT=import.meta.env.VITE_CONTACT_ENDPOINT;

export function Contact({t}){
  const [data,setData]=useState({name:'',email:'',message:'',website:''}),[errors,setErrors]=useState({});
  const [view,setView]=useState('form'),[sending,setSending]=useState(false),[failure,setFailure]=useState('');
  const previousView=useRef('form');
  // A retry of the same text reuses the id, so the server can recognise it. Edited text is a new request.
  const submissionId=useRef(null);

  useEffect(()=>{
    if(view!=='form')document.getElementById('contact-result')?.focus();
    else if(previousView.current!=='form')document.getElementById('contact-name')?.focus();
    previousView.current=view;
  },[view]);
  useEffect(()=>{if(failure)document.getElementById('contact-failure')?.focus();},[failure]);

  const update=(field,value)=>{submissionId.current=null;setData({...data,[field]:value});};
  const messages={
    email:t('Укажите корректный email.','Enter a valid email.'),
    message:t('Расскажите о задаче (от 10 символов).','Tell me about your task (at least 10 characters).'),
    name:t('Сократите имя и уберите переносы строк.','Shorten the name and remove line breaks.'),
  };
  function showErrors(fields){
    const shown=Object.fromEntries(fields.filter(field=>messages[field]).map(field=>[field,messages[field]]));
    setErrors(shown);
    const first=['name','email','message'].find(field=>shown[field]);
    if(first)document.getElementById(`contact-${first}`).focus();
    return !!first;
  }

  async function submit(e){
    e.preventDefault();
    if(sending)return;
    setFailure('');
    const fields=[];
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))fields.push('email');
    if(data.message.trim().length<10)fields.push('message');
    if(showErrors(fields))return;
    if(!ENDPOINT){setView('preview');return;}

    submissionId.current??=crypto.randomUUID();
    setSending(true);
    const result=await sendContact(ENDPOINT,{...data,id:submissionId.current});
    setSending(false);
    if(result.status==='sent')setView('sent');
    else if(result.status==='rate-limited')setFailure(t('Слишком много обращений подряд. Попробуйте позже: ваш текст сохранён на этой странице.','Too many requests in a row. Please try again later: your text is still on this page.'));
    else if(result.status==='invalid'&&showErrors(result.fields))return;
    else setFailure(t('Не удалось отправить обращение. Ваш текст остался в форме, попробуйте ещё раз.','The request could not be sent. Your text is still in the form, please try again.'));
  }

  const details=<dl className="preview-details"><dt>{t('Имя','Name')}</dt><dd>{data.name||t('Не указано','Not provided')}</dd><dt>Email</dt><dd>{data.email}</dd><dt>{t('Задача','Task')}</dt><dd className="preserve-lines">{data.message}</dd></dl>;

  return <div className="container page-content">
    <Intro eyebrow={t('Связаться','Get in touch')} title={t('Есть похожая задача?','Working on a similar challenge?')}>{t('Расскажите, с какой системой вы работаете и что хотите изменить. Для начала достаточно нескольких предложений.','Tell me which system you work with and what you would like to change. A few sentences are enough to start.')}</Intro>
    <div className="contact-layout">
      <div className="contact-panel">
        {view==='sent'&&<>
          <span className="tag">{t('Обращение получено','Request received')}</span>
          <h2 id="contact-result" tabIndex={-1}>{t('Спасибо, обращение получено','Thank you, your request was received')}</h2>
          {details}
          <p className="callout-text">{t('Ответ придёт на указанный email.','The reply will come to the email you provided.')}</p>
        </>}
        {view==='preview'&&<>
          <span className="tag">{t('Предпросмотр заявки','Request preview')}</span>
          <h2 id="contact-result" tabIndex={-1}>{t('Так будет выглядеть ваша заявка','This is how your request will look')}</h2>
          {details}
          <p className="callout-text">{t('Это прототип формы. Заявка не отправлена. Для рабочего сайта мы подключим отправку на Gmail автора.','This is a form prototype. Nothing was sent. The live site will deliver requests to the author’s Gmail.')}</p>
          <button className="button secondary" onClick={()=>setView('form')}>{t('Изменить текст','Edit request')}</button>
        </>}
        {view==='form'&&<form onSubmit={submit} noValidate aria-busy={sending}>
          <label htmlFor="contact-name">{t('Как к вам обращаться','Your name')} <span className="optional">{t('(необязательно)','(optional)')}</span></label>
          <input id="contact-name" autoComplete="name" maxLength={120} value={data.name} aria-invalid={!!errors.name} aria-describedby={errors.name?'name-error':undefined} onChange={e=>update('name',e.target.value)}/>
          {errors.name&&<p id="name-error" role="alert" className="error-text">{errors.name}</p>}
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" type="email" autoComplete="email" maxLength={254} required value={data.email} aria-invalid={!!errors.email} aria-describedby={errors.email?'email-error':undefined} onChange={e=>update('email',e.target.value)}/>
          {errors.email&&<p id="email-error" role="alert" className="error-text">{errors.email}</p>}
          <label htmlFor="contact-message">{t('О чем хотите поговорить','What would you like to discuss?')}</label>
          <textarea className="resize-none" id="contact-message" rows={5} maxLength={4000} required value={data.message} aria-invalid={!!errors.message} aria-describedby={errors.message?'message-error':undefined} onChange={e=>update('message',e.target.value)}/>
          {errors.message&&<p id="message-error" role="alert" className="error-text">{errors.message}</p>}
          {ENDPOINT&&<div className="contact-trap" aria-hidden="true"><label htmlFor="contact-website">Website</label><input id="contact-website" tabIndex={-1} autoComplete="off" value={data.website} onChange={e=>update('website',e.target.value)}/></div>}
          {ENDPOINT
            ?<p className="field-hint">{t('Обращение сохранится на сервере сайта и придёт автору на почту.','Your request is stored on the site’s server and delivered to the author by email.')}</p>
            :<p className="field-hint">{t('В прототипе данные никуда не отправляются и не сохраняются после закрытия страницы.','In this prototype, data is not sent anywhere and is not saved after you close the page.')}</p>}
          {failure&&<p id="contact-failure" role="alert" tabIndex={-1} className="error-text">{failure}</p>}
          <button className="button" type="submit" disabled={sending}>{ENDPOINT?(sending?t('Отправляем…','Sending…'):t('Отправить','Send')):t('Посмотреть заявку','Preview request')}<ArrowRightIcon size={18}/></button>
        </form>}
      </div>
      <aside className="contact-aside">
        <h3>{t('О чем можно написать','Good reasons to get in touch')}</h3>
        <ul><li>{t('Обсудить похожий процесс в вашей ELMA','Discuss a similar process in your ELMA system')}</li><li>{t('Посмотреть решение на ваших задачах','Explore the approach for your tasks')}</li><li>{t('Обменяться опытом внедрения ИИ','Compare experiences using AI')}</li></ul>
        <p>{t('Без презентации на сорок слайдов. Сначала поймем, есть ли общая задача.','No forty-slide pitch. First, let’s see whether there is a shared problem to solve.')}</p>
        <a className="text-link" href="https://mamrukov.com" target="_blank" rel="noreferrer">{t('Личный сайт автора','Author’s personal website')}<ArrowRightIcon size={16}/></a>
      </aside>
    </div>
  </div>;
}
