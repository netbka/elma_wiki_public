import React from 'react';
import { ArrowRightIcon, CheckCircleFillIcon } from '@primer/octicons-react';
import './story.css';

const A = ({to, children, secondary=false}) => <a className={`button ${secondary?'secondary':''}`} href={`#${to}`}>{children}<ArrowRightIcon size={17}/></a>;

export function HomeExpansion({t}) {
  const questions = [
    [t('Где начинается проблема?','Where does the problem start?'),t('В конкретном поле, форме или шаге процесса. Откройте это место и опишите, что должно измениться.','At a particular field, form or process step. Open that place and describe what should change.')],
    [t('Все одинаково поняли задачу?','Does everyone understand the same task?'),t('Вопросы, ответы и согласованные требования остаются рядом с заявкой. Следующий участник видит, о чем договорились.','Questions, answers and agreed requirements stay with the request. The next person can see what was decided.')],
    [t('Что мы на самом деле принимаем?','What are we actually accepting?'),t('Конкретный результат с перечнем изменений и проверок. После новой правки нужно проверить затронутый результат снова.','A specific result with its changes and checks. A new edit means the affected result needs another review.')]
  ];
  return <>
    <section className="container story-section" aria-labelledby="questions-heading">
      <div className="section-heading"><p className="eyebrow">{t('Знакомые рабочие вопросы','Familiar questions at work')}</p><h2 id="questions-heading">{t('«Поменяйте согласование» - это только начало разговора','“Change the approval flow” starts a conversation')}</h2><p>{t('Дальше нужно разобраться, что имеется в виду, какие правила затронуты и кто подтвердит, что задача решена. ELMA Wiki собирает эту работу вокруг самой системы.','Next, the team needs to understand the intent, the rules involved and who will confirm the result. ELMA Wiki connects this work to the system itself.')}</p></div>
      <div className="question-list">{questions.map(([title,body])=><article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div>
      <a className="text-link" href="#modules">{t('Открыть учебные модули','Explore sample modules')}<ArrowRightIcon size={17}/></a>
    </section>
    <section className="story-section tint"><div className="container story-feature">
      <div><p className="eyebrow">{t('От одной заявки к общей работе','From one request to shared work')}</p><h2>{t('У каждого свой экран. У задачи - одна история.','Different responsibilities. One request history.')}</h2><p className="quiet">{t('Заказчик объясняет задачу. Аналитик уточняет смысл и проверки. Владелец продукта определяет состав работы. Инженер видит подготовленное задание и результат.','The requester explains the need. The analyst clarifies the intent and checks. The product owner chooses the scope. The engineer sees the prepared task and its result.')}</p><A to="team" secondary>{t('Как работает команда','See the team workflow')}</A></div>
      <div className="handoff-sample"><span className="tag">{t('Учебная заявка','Sample request')}</span><h3>{t('Согласование крупных договоров','Approval for high-value contracts')}</h3><dl><div><dt>{t('О чем договорились','Agreed requirement')}</dt><dd>{t('Финансовый директор участвует при сумме выше порога.','The finance director approves contracts above the threshold.')}</dd></div><div><dt>{t('Что нужно проверить','What to check')}</dt><dd>{t('Ниже порога, на границе и выше него.','Below, at and above the threshold.')}</dd></div><div><dt>{t('Чей следующий шаг','Who acts next')}</dt><dd><CheckCircleFillIcon size={17}/> {t('Аналитик и владелец продукта проверяют результат.','The analyst and product owner review the result.')}</dd></div></dl></div>
    </div></section>
    <section className="container story-section"><div className="story-feature"><div className="section-heading"><p className="eyebrow">{t('С чего начать знакомство','A place to start')}</p><h2>{t('Выберите ситуацию, которая похожа на вашу','Start with a situation you recognize')}</h2><p>{t('Добавить согласование, изменить форму или разобраться с доступом. В каждом примере важен весь путь: от слов человека до понятных критериев результата.','Add an approval, change a form or clarify access. Each example follows the whole journey from a person’s words to clear criteria for the result.')}</p></div><A to="examples">{t('Посмотреть сценарии','Explore scenarios')}</A></div></section>
  </>;
}

export function HowPage({t}) {
  const technicalSteps = [
    [t('Выгрузить .e365', 'Export .e365'), t('Получить исходное решение из ELMA: формы, процессы, скрипты и их связи.', 'Capture the source solution from ELMA: forms, processes, scripts and their connections.')],
    [t('Разобрать структуру и смысл', 'Understand structure and purpose'), t('Связать элементы с задачей человека: где работает правило, что оно меняет и от чего зависит.', 'Connect the elements to the person’s task: where a rule runs, what it changes and what it depends on.')],
    [t('Внести изменения в код', 'Make the code changes'), t('Работать с кодом разобранного решения. Требования и ожидаемый результат остаются частью задания.', 'Work in the unpacked solution’s code. Requirements and the expected outcome stay with the task.')],
    [t('Проверить поведение', 'Check the behavior'), t('Выполнить технические проверки. Когда нужно проверить интерфейс, браузер делает реальные клики и оценивает состояние приложения.', 'Run technical checks. When the interface needs checking, the browser performs real clicks and inspects the application’s state.')],
    [t('Упаковать решение', 'Package the solution'), t('Собрать подготовленное изменение в пакет для передачи вместе с контекстом и результатами проверок.', 'Package the prepared change for transfer, with its context and verification results.')],
    [t('Передать на выбранный сервер', 'Transfer to the selected server'), t('Указать конкретный сервер тестирования и проверить результат в этой среде. Затем передать его на приемку аналитика.', 'Select the specific testing server and check the result in that environment. Then hand it to the analyst for acceptance.')],
  ];
  return <div className="container page-content how-page">
    <div className="page-intro">
      <p className="eyebrow">{t('Как мы работаем', 'How we work')}</p>
      <h1>{t('От заявки до выпуска в прод', 'From request to production')}</h1>
      <p className="lede">{t('Понимание задачи, выполнение и приемка связаны одной историей. Видно, что предложил ИИ, какие решения приняли люди и какой результат дошел до рабочей системы.', 'Understanding, delivery and acceptance share one history. You can see what AI proposed, which decisions people made and what reached the live system.')}</p>
    </div>

    <section className="how-section" aria-labelledby="how-decisions-heading">
      <div className="section-heading">
        <p className="eyebrow">{t('Решения людей', 'Human decisions')}</p>
        <h2 id="how-decisions-heading">{t('У каждого перехода есть основание', 'Every handoff has a reason')}</h2>
        <p>{t('ИИ готовит предложение. Аналитик и владелец продукта решают, какую работу выполнять и какой результат принять.', 'AI prepares a proposal. The analyst and product owner decide what work should proceed and which result to accept.')}</p>
      </div>
      <ol className="how-decisions">
        <li>
          <div className="how-actor"><span className="how-step-index" aria-hidden="true">1</span><span>{t('ИИ-аналитик', 'AI analyst')}</span></div>
          <div className="how-decision-body"><h3>{t('Понять и предложить решение', 'Understand and propose a solution')}</h3><p>{t('ИИ изучает заявку и контекст, объясняет, как предлагает решить задачу и что должно получиться.', 'AI examines the request and context, explains how it proposes to solve the task and describes the expected result.')}</p><div className="how-return"><span>{t('Если не хватает понимания', 'When more understanding is needed')}</span><p>{t('Заявка возвращается на уточнение или доработку с конкретными вопросами. Ответы остаются в ее истории.', 'The request returns for clarification or revision with specific questions. Answers remain in its history.')}</p></div></div>
        </li>
        <li>
          <div className="how-actor"><span className="how-step-index" aria-hidden="true">2</span><span>{t('Аналитик и владелец продукта', 'Analyst and product owner')}</span></div>
          <div className="how-decision-body"><h3>{t('Дать два допуска в разработку', 'Give both approvals to start development')}</h3><div className="how-approval-pair"><div><strong>{t('Аналитик', 'Analyst')}</strong><p>{t('Согласен с пониманием задачи, способом решения и ожидаемым результатом.', 'Agrees with the task understanding, proposed solution and expected result.')}</p></div><div><strong>{t('Владелец продукта', 'Product owner')}</strong><p>{t('Подтверждает, что эту работу нужно выполнять.', 'Confirms that this work is needed.')}</p></div></div><p className="how-required">{t('Разработка начинается после обоих решений.', 'Development starts after both decisions.')}</p></div>
        </li>
        <li>
          <div className="how-actor"><span className="how-step-index" aria-hidden="true">3</span><span>{t('Ферма AIWorks', 'AIWorks farm')}</span></div>
          <div className="how-decision-body"><h3>{t('Выполнить работу и подготовить проверку', 'Do the work and prepare verification')}</h3><p>{t('Согласованное задание поступает исполнителям. Они меняют код, выполняют проверки и готовят результат со сценарием проверки для аналитика.', 'The approved task goes to the workers. They change the code, run checks and prepare the result with a verification scenario for the analyst.')}</p></div>
        </li>
        <li>
          <div className="how-actor"><span className="how-step-index" aria-hidden="true">4</span><span>{t('Живой аналитик', 'Human analyst')}</span></div>
          <div className="how-decision-body"><h3>{t('Принять конкретный результат', 'Accept the specific result')}</h3><p>{t('Аналитик проверяет результат по сценарию, который подготовил ИИ, и сопоставляет его с согласованной задачей. Замечания возвращают работу на доработку.', 'The analyst checks the result using the AI-prepared scenario and compares it with the agreed task. Findings send the work back for revision.')}</p><p className="how-required">{t('Если результат изменился, затронутую часть проверяют снова.', 'If the result changes, the affected part is checked again.')}</p></div>
        </li>
        <li>
          <div className="how-actor"><span className="how-step-index" aria-hidden="true">5</span><span>{t('Владелец продукта', 'Product owner')}</span></div>
          <div className="how-decision-body"><h3>{t('Утвердить передачу в прод', 'Approve transfer to production')}</h3><p>{t('После приемки владелец продукта утверждает передачу принятого результата в рабочую систему. Решение о выпуске остается в общей истории.', 'After acceptance, the product owner approves transferring the accepted result to the live system. The release decision stays in the shared history.')}</p><div className="how-release"><CheckCircleFillIcon size={19}/><span>{t('Выпуск изменения в рабочую систему', 'Release the change to the live system')}</span></div></div>
        </li>
      </ol>
    </section>

    <section className="how-section how-technical" aria-labelledby="how-technical-heading">
      <div className="section-heading">
        <p className="eyebrow">{t('Техническое выполнение', 'Technical delivery')}</p>
        <h2 id="how-technical-heading">{t('Как меняется само решение', 'How the solution itself changes')}</h2>
        <p>{t('Файл .e365 становится понятной структурой. Изменения проходят работу с кодом, проверку поведения и передачу в выбранную среду.', 'The .e365 file becomes an understandable structure. Changes move through code work, behavior checks and transfer to the selected environment.')}</p>
      </div>
      <div className="how-farm">
        <div><span className="how-farm-label">AIWorks</span><h3>{t('Отдельная ферма выполнения и проверок', 'A separate execution and verification farm')}</h3></div>
        <p>{t('Рабочее пространство передает задания и сохраняет историю. Ферма выполняет работу с кодом, запускает браузерных исполнителей и возвращает результаты и независимые проверки.', 'The workspace sends tasks and keeps their history. The farm performs code work, runs browser workers and returns results with independent verification.')}</p>
      </div>
      <ol className="how-technical-steps">{technicalSteps.map(([title,body],i)=><li key={title}><span className="how-step-index" aria-hidden="true">{i+1}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
      <div className="how-target-note"><strong>{t('Сервер проверки выбирается явно', 'The testing server is selected explicitly')}</strong><p>{t('Упаковка и передача на тестирование идут до финального разрешения выпуска. Целевая среда определяется для конкретного изменения.', 'Packaging and transfer for testing come before final release approval. The target environment is chosen for the specific change.')}</p></div>
      <details className="how-components"><summary>{t('Где хранятся контекст, работа и результат', 'Where context, work and results belong')}</summary><dl><div><dt>{t('Рабочее пространство', 'Workspace')}</dt><dd>{t('Модули и элементы системы, заявки, согласованное решение, доказательства и решения людей.', 'System modules and elements, requests, agreed solutions, evidence and human decisions.')}</dd></div><div><dt>{t('Ферма AIWorks', 'AIWorks farm')}</dt><dd>{t('Исполнители для кода и браузера, распределение заданий и независимая проверка.', 'Code and browser workers, task distribution and independent verification.')}</dd></div><div><dt>{t('ELMA и связанные системы', 'ELMA and connected systems')}</dt><dd>{t('Бизнес-процессы и данные, конкретные серверы проверки и рабочая система после выпуска.', 'Business processes and data, specific testing servers and the live system after release.')}</dd></div></dl></details>
    </section>

    <div className="bottom-cta how-cta"><div><h2>{t('Начнем с одной вашей задачи', 'Start with one of your tasks')}</h2><p className="quiet">{t('Разберем, как работает сейчас, что мешает и какой результат нужен.', 'Let’s understand how it works today, what gets in the way and what result you need.')}</p><a className="text-link" href="#demo">{t('Учебный пример приемки', 'Sample acceptance walkthrough')}<ArrowRightIcon size={16}/></a><span className="how-demo-note">{t('На вымышленных данных', 'With synthetic data')}</span></div><A to="contact">{t('Разобрать задачу', 'Discuss a task')}</A></div>
  </div>;
}
