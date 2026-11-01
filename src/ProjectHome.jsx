import React from 'react';
import { ArrowRightIcon, ArrowDownIcon, CheckIcon, FileIcon } from '@primer/octicons-react';
import './project-home.css';

export function ProjectHome({ t, Link }) {
  const path = [
    [t('Заявка', 'Request'), t('Что мешает людям и что должно измениться.', 'What gets in people’s way and what needs to change.')],
    [t('Согласованное решение', 'Agreed solution'), t('Аналитик согласен с подходом. Владелец продукта подтверждает работу.', 'The analyst agrees with the approach. The product owner authorizes the work.')],
    [t('Проверенный результат', 'Verified result'), t('Разработка, проверки, приемка и выпуск в рабочую систему.', 'Development, checks, acceptance and release to the live system.')],
  ];

  return <div className="ph-home">
    <section className="container ph-hero" aria-labelledby="ph-title">
      <div className="ph-hero-copy">
        <p className="eyebrow">{t('Автоматизация ELMA и связанных систем', 'Automation for ELMA and connected systems')}</p>
        <h1 id="ph-title">{t(<>От заявки<br />до результата в проде.</>, <>From a request<br />to a production result.</>)}</h1>
        <p className="ph-lede">{t('Берем одну задачу и доводим ее через уточнения, разработку и проверку до выпуска в рабочую систему.', 'We take one task through clarification, development and verification to release in the live system.')}</p>
        <div className="ph-actions"><Link to="contact">{t('Разобрать задачу', 'Discuss a task')}</Link><a className="text-link" href="#examples">{t('Посмотреть реальный кейс', 'Explore a real case')}<ArrowRightIcon size={17} /></a></div>
        <p className="ph-audience">{t('Для тех, кто отвечает за развитие ELMA в компании.', 'For people responsible for developing ELMA in their organization.')}</p>
      </div>
      <aside className="ph-record" aria-labelledby="ph-record-title">
        <p className="ph-record-caption">{t('Одна задача. Вся история.', 'One task. Its complete history.')}</p>
        <h2 id="ph-record-title">{t('Договоренности доходят до результата', 'Agreements become a working result')}</h2>
        <ol className="ph-path">{path.map(([title, text], index) => <li key={title}><span className="ph-path-marker" aria-hidden="true">{index === path.length - 1 ? <CheckIcon size={15} /> : index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
        <p className="ph-record-note">{t('У заявки, изменения и приемки остается общий контекст.', 'The request, the change and its acceptance keep their shared context.')}</p>
      </aside>
    </section>

    <section className="ph-case-section" aria-labelledby="ph-case-title">
      <div className="container">
        <div className="ph-case-heading"><p className="eyebrow">{t('Реальный кейс / Управление договорами', 'Real case / Contract management')}</p><h2 id="ph-case-title">{t('Одна версия договора. Одно согласование.', 'One contract version. One approval.')}</h2><p>{t('Если один человек встречается на нескольких этапах маршрута, система учитывает его решение по той же неизмененной версии документа. Это изменение выпущено в рабочую систему.', 'When the same person appears at several stages of the workflow, the system carries forward their decision on the same unchanged document version. This change has been released to the live system.')}</p></div>
        <figure className="ph-case-artifact">
          <div className="ph-case-before"><span className="ph-artifact-label">{t('Было', 'Before')}</span><h3>{t('Человек согласует повторно', 'A person approves again')}</h3><div className="ph-document"><FileIcon size={26} /><div><strong>{t('Договор на согласовании', 'Contract in approval')}</strong><span>{t('Тот же участник снова получает задачу на ту же версию.', 'The same participant gets another task for the same version.')}</span></div></div><p>{t('Участник попадает в несколько частей маршрута и снова открывает уже проверенный документ.', 'A participant appears in several parts of the workflow and reopens a document they have already reviewed.')}</p></div>
          <div className="ph-case-direction" aria-hidden="true"><ArrowRightIcon size={25} /><ArrowDownIcon size={25} /></div>
          <div className="ph-case-after"><span className="ph-artifact-label">{t('Стало', 'After')}</span><h3>{t('Решение учитывается дальше', 'The decision carries forward')}</h3><dl className="ph-suggestions">{[[t('Тот же человек', 'Same person'), t('Повторный шаг пропускается', 'The repeated step is skipped')], [t('Та же версия', 'Same version'), t('Прежнее решение остается в силе', 'The earlier decision stands')], [t('Документ изменился', 'Document changed'), t('Нужна новая проверка', 'A new review is needed')]].map(([field, value]) => <div key={field}><dt>{field}</dt><dd>{value}</dd></div>)}</dl><p className="ph-human-review"><CheckIcon size={18} /><span>{t('При замещении учитывается тот, кто действительно выполнил согласование.', 'With a substitute, the person who actually approved is recorded.')}</span></p></div>
          <figcaption>{t('Схема работы по реальной реализации. Значения из рабочих документов здесь не показаны.', 'Workflow diagram based on the real implementation. No values from working documents are shown.')}</figcaption>
        </figure>
        <div className="ph-case-foot"><p>{t('За этим результатом - привязка решения к версии файла, учет замещения и новая проверка после изменения или восстановления файла.', 'Behind this result are decisions tied to a file version, substitution handling and a new review after a file is changed or restored.')}</p><Link to="examples" secondary>{t('Как решали эту задачу', 'How we solved this task')}</Link></div>
      </div>
    </section>

    <section className="container ph-system-section" aria-labelledby="ph-system-title">
      <div className="ph-system-intro"><p className="eyebrow">{t('Как доводим до выпуска', 'How work reaches production')}</p><h2 id="ph-system-title">{t('Контекст, выполнение и результат связаны', 'Context, execution and result stay connected')}</h2><p>{t('Когда доработки копятся, требования теряются между людьми, а результат трудно проверить, важна общая история работы. В ней видно, о чем договорились, что сделали и что приняли.', 'When changes pile up, requirements get lost between people and results are hard to verify, a shared work history matters. It shows what was agreed, what was done and what was accepted.')}</p><a className="text-link" href="#how">{t('Посмотреть весь путь изменения', 'See the full change journey')}<ArrowRightIcon size={17} /></a></div>
      <ol className="ph-components">
        <li><span className="ph-component-label">{t('Рабочее пространство', 'Workspace')}</span><p>{t('Модули, заявки и договоренности. Аналитик согласует решение, владелец продукта подтверждает необходимость работы.', 'Modules, requests and agreements. The analyst agrees with the solution; the product owner confirms that the work is needed.')}</p></li>
        <li><span className="ph-component-label">{t('Отдельная ферма AIWorks', 'Separate AIWorks worker farm')}</span><p>{t('Выполнение заданий, работа с кодом и независимые проверки. Браузерные исполнители делают реальные клики и проверяют состояние приложения.', 'Task execution, code changes and independent checks. Browser workers make real clicks and verify the application’s state.')}</p></li>
        <li><span className="ph-component-label">{t('ELMA и связанные системы', 'ELMA and connected systems')}</span><p>{t('Подготовленное решение передается на выбранный сервер проверки. Аналитик принимает результат по сценарию ИИ, владелец утверждает передачу в прод.', 'The prepared solution goes to the chosen test server. The analyst accepts the result using the AI-prepared scenario; the owner approves its transfer to production.')}</p></li>
      </ol>
    </section>

    <section className="ph-contact-section" aria-labelledby="ph-contact-title"><div className="container ph-contact-inner"><div><p className="eyebrow">{t('Следующий шаг', 'Next step')}</p><h2 id="ph-contact-title">{t('Начнем с одной вашей задачи', 'Let’s start with one of your tasks')}</h2><p>{t('Опишите, как работает сейчас, что мешает людям и какой результат нужен. Разберем задачу в ELMA или связанной системе и определим путь до выпуска.', 'Describe how things work now, what gets in people’s way and the result you need. We’ll examine the task in ELMA or a connected system and work out its path to release.')}</p></div><Link to="contact">{t('Разобрать задачу', 'Discuss a task')}</Link></div></section>
  </div>;
}
