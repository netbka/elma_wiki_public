import React, { useState } from 'react';
import { ArrowRightIcon, CheckIcon } from '@primer/octicons-react';
import './product-pages.css';

function PageIntro({ eyebrow, title, children }) {
  return <div className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lede">{children}</p></div>;
}

function NextStep({ title, to, children }) {
  return <div className="bottom-cta"><h2>{title}</h2><a className="button" href={`#${to}`}>{children}<ArrowRightIcon size={18}/></a></div>;
}

function WorkspaceSample({ t }) {
  const [view, setView] = useState('modules');
  const views = [
    ['modules', t('Модули', 'Modules')],
    ['requests', t('Заявки', 'Requests')],
    ['packages', t('Пакеты', 'Packages')],
  ];
  const rows = {
    modules: [
      [t('Управление договорами', 'Contract management'), t('Форма договора, маршрут согласования, действия участников', 'Contract form, approval route and participant actions'), t('Понять устройство', 'Understand the structure')],
      [t('Контрагенты', 'Counterparties'), t('Карточка организации и ее связь с договорами', 'Company details and their connection to contracts'), t('Увидеть связи', 'Explore connections')],
    ],
    requests: [
      [t('Добавить финансовое согласование', 'Add finance approval'), t('Договоры / Процесс согласования / После юридической проверки', 'Contracts / Approval process / After legal review'), t('Уточнить правило', 'Clarify the rule')],
      [t('Обязательное приложение к договору', 'Require a contract attachment'), t('Договоры / Форма отправки на согласование', 'Contracts / Submit for approval form'), t('Описать ожидание', 'Describe the expectation')],
    ],
    packages: [
      [t('Правила согласования договоров', 'Contract approval rules'), t('Связанные заявки, общий результат и список проверок', 'Related requests, a shared result and a review checklist'), t('Подготовить к работе', 'Prepare for work')],
      [t('Проверка на выбранном сервере', 'Review on the selected server'), t('Что сделано, что проверить и кому дать подтверждение', 'What changed, what to check and who needs to confirm'), t('Проверить вместе', 'Review together')],
    ],
  };
  return <section className="pp-workspace" aria-labelledby="workspace-title">
    <div className="pp-workspace-heading"><div><p className="eyebrow">{t('Три взгляда на одну работу', 'Three views of the same work')}</p><h2 id="workspace-title">{t('Система. Запрос. Результат.', 'System. Request. Result.')}</h2></div><span className="tag">{t('Учебная иллюстрация', 'Illustrative sample')}</span></div>
    <div className="pp-view-switch" role="group" aria-label={t('Выбрать раздел примера', 'Choose a sample section')}>
      {views.map(([id, label]) => <button key={id} type="button" aria-pressed={view === id} aria-controls="workspace-sample-content" onClick={() => setView(id)}>{label}</button>)}
    </div>
    <div id="workspace-sample-content" className="pp-workspace-rows" aria-live="polite">
      {rows[view].map(([title, description, next]) => <article className="pp-workspace-row" key={title}><div><h3>{title}</h3><p>{description}</p></div><span className="pp-next-label">{next}</span></article>)}
    </div>
    <div className="pp-workspace-open"><a className="button secondary" href="#modules">{t('Открыть модули и заявки','Open modules and requests')}<ArrowRightIcon size={17}/></a></div><p className="pp-sample-note">{t('Переключайте разделы, чтобы увидеть принцип организации. Это упрощенные примеры экранов, данные в рабочую систему не отправляются.', 'Switch sections to explore the organization. These are simplified screen examples; nothing is sent to a working system.')}</p>
  </section>;
}

function Capabilities({ t }) {
  const modules = [
    [t('Договоры', 'Contracts'), t('Как подготовить, согласовать и изменить договор.', 'How a contract is prepared, approved and changed.')],
    [t('Контрагенты', 'Counterparties'), t('Какие сведения об организации нужны в связанных процессах.', 'Which company details are used by related processes.')],
    [t('Корреспонденция', 'Correspondence'), t('Как документ попадает к нужному участнику.', 'How a document reaches the right participant.')],
    [t('Доверенности', 'Powers of attorney'), t('Как связаны полномочия, документы и действия.', 'How authority, documents and actions connect.')],
    [t('Облигации', 'Bonds'), t('Как устроены объекты и процессы этого направления.', 'How this area’s objects and processes are organized.')],
  ];
  const abilities = [
    [t('Увидеть систему в знакомых местах', 'Recognize the system you work in'), t('Модули, формы и шаги процесса помогают найти место вопроса. Вместо просьбы «посмотрите договоры» появляется конкретная форма, поле или действие.', 'Modules, forms and process steps help locate a question. “Please look at contracts” becomes a specific form, field or action.')],
    [t('Сохранить смысл изменения', 'Keep the meaning of a change'), t('В заявке остаются исходная проблема, ожидаемое поведение, обсуждение и ответы заказчика. Следующему участнику не приходится восстанавливать договоренность по переписке.', 'A request keeps the original problem, expected behavior, discussion and requester’s answers. The next participant can follow the agreement without reconstructing a conversation.')],
    [t('Дать ИИ рабочий контекст', 'Give AI the context of the work'), t('ИИ-аналитик рассматривает запрос рядом с устройством системы, ищет недостающие условия и задает вопросы. Ответ человека становится частью дальнейшей проверки.', 'The AI analyst considers the request alongside the system, identifies missing conditions and asks questions. A person’s answer becomes part of the next review.')],
    [t('Собрать связанные изменения', 'Bring related changes together'), t('Пакет объединяет несколько заявок с общим результатом. В нем видно, что понятно, что еще требует ответа и с чем можно переходить к разработке.', 'A package brings together requests with a shared result. It shows what is understood, what still needs an answer and what is ready for development.')],
    [t('Различать версии и результат', 'Tell versions and results apart'), t('Исходная конфигурация, подготовленное изменение и проверенная установка имеют разный смысл. История помогает понять, что сравнивали и какой результат действительно проверили.', 'The source configuration, a prepared change and a verified installation mean different things. History helps show what was compared and which result was actually checked.')],
    [t('Принять работу по понятным условиям', 'Accept work against clear conditions'), t('Рядом с результатом есть описание сделанного и список проверок. Аналитик и владелец продукта подтверждают его со своих сторон; замечание возвращает работу на доработку.', 'The result includes a description of the work and a checklist. The analyst and product owner confirm it from their perspectives; a finding sends it back for revision.')],
  ];
  return <div className="container page-content product-pages">
    <PageIntro eyebrow={t('Возможности', 'Capabilities')} title={t('Чтобы за каждым изменением был понятен смысл', 'Make the meaning behind each change clear')}>{t('ELMA Wiki связывает устройство системы, вопросы людей и работу над изменениями. Начать можно с одного процесса, в котором команда регулярно теряет контекст.', 'ELMA Wiki connects the system’s structure, people’s questions and the work of making changes. Start with one process where the team repeatedly loses context.')}</PageIntro>
    <WorkspaceSample t={t}/>
    <section className="pp-section" aria-labelledby="abilities-title"><div className="pp-section-intro"><p className="eyebrow">{t('Что это дает в работе', 'What this helps with')}</p><h2 id="abilities-title">{t('От «где это находится?» до «что проверять?»', 'From “where is it?” to “what should we check?”')}</h2></div><div className="pp-ability-grid">{abilities.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section className="pp-section" aria-labelledby="modules-title"><div className="pp-section-intro"><p className="eyebrow">{t('Предметная область', 'The working context')}</p><h2 id="modules-title">{t('Сейчас в фокусе пять направлений', 'Five areas in the current scope')}</h2><p>{t('Продукт вырос из внутренней работы с этими модулями ELMA365. Связи между ними помогают разбирать изменения в контексте всей задачи.', 'The product grew from internal work with these ELMA365 modules. Their connections help teams consider a change in the context of the whole task.')}</p></div><div className="pp-module-grid">{modules.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <NextStep title={t('Посмотрим, как это выглядит на конкретной задаче', 'Explore a concrete task')} to="examples">{t('Посмотреть кейсы', 'Explore cases')}</NextStep>
  </div>;
}

function Examples({ t }) {
  const documentSteps = [
    [t('Файл договора', 'Contract file'), t('Текст документа, PDF или скан становится входом для внутреннего сервиса.', 'A document, PDF or scan becomes the input for the internal service.')],
    [t('Предложения с источником', 'Suggestions with a source'), t('Сервис готовит значения полей и показывает, на какой фрагмент документа они опираются.', 'The service prepares field values and shows the document passage behind each suggestion.')],
    [t('Проверка и применение', 'Review and apply'), t('Человек выбирает нужные предложения и переносит их в форму. Применение можно отменить.', 'A person selects the suggestions they need and applies them to the form. They can undo the application.')],
  ];
  const implementation = [
    [t('Сервис распознавания', 'Extraction service'), t('Извлечение текста из документов и сканов, подготовка значений для полей договора.', 'Text extraction from documents and scans, with values prepared for contract fields.')],
    [t('Помощник в форме', 'In-form assistant'), t('Предложения находятся рядом с работой сотрудника: их можно просмотреть, выбрать и применить к незаписанной форме.', 'Suggestions stay next to the person’s work: they can review, select and apply them to the unsaved form.')],
    [t('Правила проверки', 'Validation rules'), t('Контрагент сопоставляется со справочником с учетом прав пользователя. Неоднозначные значения остаются на проверку человеку.', 'The counterparty is matched against the directory using the user’s permissions. Ambiguous values are left for a person to check.')],
  ];
  return <div className="container page-content product-pages pp-real-cases">
    <PageIntro eyebrow={t('Реальные задачи', 'Real project work')} title={t('Что меняется в работе человека', 'What changes in a person’s work')}>{t('Два примера из разработки ELMA: устранение повторного согласования и подготовка данных из документа. В каждом важен конкретный рабочий результат.', 'Two examples from ELMA development: removing repeated approval and preparing data from a document. Each is about a concrete change in everyday work.')}</PageIntro>

    <article className="pp-project-case pp-project-case-compact" aria-labelledby="approval-case-title">
      <header className="pp-project-case-heading">
        <p className="eyebrow">{t('Управление договорами · Маршрут согласования', 'Contract management · Approval workflow')}</p>
        <h2 id="approval-case-title">{t('Не принимать то же решение повторно', 'Avoid making the same decision again')}</h2>
        <p>{t('Если один человек встречается на нескольких этапах, система учитывает уже принятое им решение по той же неизмененной версии документа. Это изменение выпущено в рабочую систему.', 'When the same person appears at several stages, the system carries forward the decision they have already made on the same unchanged document version. This change has been released to the live system.')}</p>
      </header>
      <div className="pp-work-change">
        <section aria-labelledby="approval-before-title"><p className="pp-case-label" id="approval-before-title">{t('Раньше', 'Before')}</p><h3>{t('Тот же договор возвращается на согласование', 'The same contract returns for approval')}</h3><p>{t('Участник попадает в несколько частей маршрута и снова получает задачу согласовать уже проверенный документ.', 'A participant appears in several parts of the workflow and receives another approval task for a document they have already reviewed.')}</p></section>
        <section className="pp-work-change-after" aria-labelledby="approval-after-title"><p className="pp-case-label" id="approval-after-title">{t('Теперь', 'After')}</p><h3>{t('Предыдущее решение учитывается дальше', 'The earlier decision carries forward')}</h3><p>{t('Повторный шаг для того же человека и неизмененной версии пропускается. При замещении учитывается тот, кто действительно выполнил согласование.', 'The repeated step is skipped for the same person and unchanged version. When someone acts as a substitute, the person who actually approved is recorded.')}</p></section>
      </div>
      <div className="pp-case-rule"><h3>{t('Изменился документ - нужна новая проверка', 'A changed document needs a new review')}</h3><p>{t('Согласование относится к конкретной версии. Изменение или восстановление файла требует новой проверки, поэтому прежнее решение не скрывает новый смысл документа.', 'Approval belongs to a specific version. Changing or restoring the file requires a new review, so an earlier decision cannot conceal a change to the document.')}</p></div>
    </article>

    <article className="pp-project-case" aria-labelledby="document-case-title">
      <header className="pp-project-case-heading">
        <p className="eyebrow">{t('Управление договорами · Внутренний сервис', 'Contract management · Internal service')}</p>
        <h2 id="document-case-title">{t('Из файла договора - в предложения для карточки', 'From a contract file to suggestions for the record')}</h2>
        <p>{t('Вместо переноса реквизитов по одному сотрудник получает подготовленные предложения и проверяет их в форме договора. Сейчас решение проходит проверку на тестовом сервере и в рабочую систему еще не выпущено.', 'Instead of transferring details one by one, a person receives prepared suggestions and checks them in the contract form. The solution is now being checked on a test server and has not yet been released to the live system.')}</p>
      </header>

      <div className="pp-work-change">
        <section aria-labelledby="document-before-title"><p className="pp-case-label" id="document-before-title">{t('Без помощника', 'Without the assistant')}</p><h3>{t('Найти и перенести вручную', 'Find and enter by hand')}</h3><p>{t('Открыть документ, найти реквизиты, перенести значения в карточку и сверить их с исходным файлом.', 'Open the document, find its details, enter the values into the record and compare them with the source file.')}</p></section>
        <section className="pp-work-change-after" aria-labelledby="document-after-title"><p className="pp-case-label" id="document-after-title">{t('С помощником', 'With the assistant')}</p><h3>{t('Проверить и применить предложения', 'Review and apply suggestions')}</h3><p>{t('Открыть помощник в форме, увидеть подготовленные значения с фрагментами источника, выбрать нужное и применить.', 'Open the assistant in the form, see prepared values with source passages, select what is needed and apply it.')}</p></section>
      </div>

      <section className="pp-case-path-section" aria-labelledby="document-path-title">
        <h3 id="document-path-title">{t('Как работает помощник', 'How the assistant works')}</h3>
        <ol className="pp-case-path">{documentSteps.map(([title, description]) => <li key={title}><h4>{title}</h4><p>{description}</p></li>)}</ol>
      </section>

      <section className="pp-case-build" aria-labelledby="document-build-title">
        <div><p className="eyebrow">{t('Что было разработано', 'What was built')}</p><h3 id="document-build-title">{t('Сервис и форма работают вместе', 'The service and form work together')}</h3><p>{t('За понятным действием в карточке стоят обработка разных форматов, сопоставление данных и правила работы с неоднозначным ответом.', 'Behind the simple action in the form are file handling, data matching and rules for ambiguous answers.')}</p></div>
        <dl>{implementation.map(([title, description]) => <div key={title}><dt>{title}</dt><dd>{description}</dd></div>)}</dl>
      </section>
      <p className="pp-case-outcome"><CheckIcon size={20}/><span>{t('Что это дает сотруднику: работать с подготовленными данными в привычной форме и сохранять решение о том, что применить.', 'What this gives the person: work with prepared data in the familiar form and keep control over what to apply.')}</span></p>
    </article>

    <section className="pp-case-bridge" aria-labelledby="case-method-title"><div><p className="eyebrow">{t('От отдельной задачи к способу работы', 'From one task to a way of working')}</p><h2 id="case-method-title">{t('Связать просьбу, изменение и проверенный результат', 'Connect the request, the change and the verified result')}</h2><p>{t('Важен весь путь: понять задачу, согласовать решение с аналитиком и владельцем продукта, выполнить работу, проверить и выпустить изменение.', 'The whole journey matters: understand the task, agree on a solution with the analyst and product owner, carry out the work, verify it and release the change.')}</p></div><a className="button secondary" href="#how">{t('Как проходит изменение', 'How a change moves through')}<ArrowRightIcon size={18}/></a></section>
    <NextStep title={t('Начнем с одной задачи в вашей ELMA', 'Start with one task in your ELMA')} to="contact">{t('Разобрать задачу', 'Discuss a task')}</NextStep>
  </div>;
}

function Team({ t }) {
  const roles = [
    [t('Заказчик', 'Requester'), t('Объясняет проблему и отвечает на вопросы', 'Explains the problem and answers questions'), t('Видит собственную заявку, уточнения и ход работы. Может описать ожидаемый результат на языке своей задачи.', 'Sees their request, clarifications and progress. Describes the desired result in the language of their work.')],
    [t('Аналитик', 'Analyst'), t('Проверяет, что команда одинаково поняла задачу', 'Checks that the team shares the same understanding'), t('Связывает запрос с системой, уточняет условия и проверяет результат по согласованным требованиям.', 'Connects the request to the system, clarifies conditions and checks the result against agreed requirements.')],
    [t('Владелец продукта', 'Product owner'), t('Собирает работу в осмысленный результат', 'Brings the work into a meaningful outcome'), t('До разработки подтверждает необходимость работы. После приемки аналитиком утверждает передачу результата в прод.', 'Confirms that the work is needed before development. After the analyst accepts the result, approves its transfer to production.')],
    [t('Инженер', 'Engineer'), t('Готовит изменение и его техническую проверку', 'Prepares the change and its technical verification'), t('Работает с версиями, условиями выполнения и результатом разработки. Фиксирует сделанное и то, что предстоит проверить людям.', 'Works with versions, execution conditions and development results. Records the work and what people need to check.')],
    [t('Администратор', 'Administrator'), t('Организует доступ участников', 'Organizes participant access'), t('Назначает роли участникам и организует доступ к рабочему пространству. Подключением сред занимается инженер или оператор. Бизнес-решения остаются у ответственных за них людей.', 'Assigns participant roles and organizes workspace access. An engineer or operator connects the environments. Business decisions stay with the people responsible for them.')],
  ];
  const questions = [
    [t('Почему Wiki, если здесь есть работа над изменениями?', 'Why “Wiki” if it also manages changes?'), t('Проект начался с желания разобраться в сложной системе. Постепенно к этому контексту добавились заявки, обсуждения и проверка результата. Название осталось, а рабочий путь стал шире.', 'The project began with understanding a complex system. Requests, discussions and result verification grew around that context. The name stayed while the working journey expanded.')],
    [t('Нужно заменить ELMA365 или ее дизайнер?', 'Does this replace ELMA365 or its designer?'), t('Рабочие процессы продолжают выполняться в ELMA365. Wiki помогает команде понимать конфигурацию и организовывать изменения; существующие средства платформы остаются частью работы.', 'Business processes continue to run in ELMA365. Wiki helps the team understand configuration and organize changes; the platform’s existing tools remain part of the work.')],
    [t('Что происходит с задачами из Redmine?', 'What happens to Redmine tasks?'), t('Redmine остается источником собственных задач. Wiki читает их и помогает вести связанную работу. Запись изменений обратно в Redmine сейчас не выполняется.', 'Redmine remains the source of its own tasks. Wiki reads them and helps manage related work. It does not currently write changes back to Redmine.')],
    [t('ИИ сам меняет рабочую систему?', 'Does AI change the live system on its own?'), t('ИИ сначала предлагает решение и ожидаемый результат. Разработку допускают живой аналитик и владелец продукта. Подготовленное изменение проверяется на выбранном сервере. Аналитик принимает результат по сценарию ИИ, затем владелец утверждает передачу в прод. Полный рабочий цикл уже действует.', 'AI first proposes a solution and expected result. A human analyst and product owner authorize development. The prepared change is checked on the selected server. The analyst accepts it using the AI-prepared scenario, then the owner approves its transfer to production. The full workflow is already operational.')],
    [t('Что я могу попробовать на этом сайте?', 'What can I try on this website?'), t('Учебный маршрут согласования: изменить порог суммы, сравнить поведение и пройти приемку. Прогресс сохраняется в этом браузере. Сайт не подключается к вашей ELMA, не запускает AIWorks и не предлагает вход в рабочую систему.', 'A sample approval journey: change the threshold, compare behavior and complete acceptance. Progress is saved in this browser. The site does not connect to your ELMA, run AIWorks or provide access to a working system.')],
    [t('С чего начать разговор о похожем решении?', 'Where should a conversation about a similar solution start?'), t('С одного процесса и одного повторяющегося затруднения. Например: заявки теряют контекст, требования приходится объяснять заново или непонятно, как принимать результат. Этого достаточно, чтобы обсудить подход.', 'Start with one process and one recurring difficulty: requests lose context, requirements need explaining again, or nobody knows how to accept the result. That is enough to discuss the approach.')],
  ];
  return <div className="container page-content product-pages">
    <PageIntro eyebrow={t('Для команды', 'For the team')} title={t('Одна задача. Разные вопросы к ней.', 'One task. Different questions about it.')}>{t('Заказчику важно, чтобы проблема решилась. Аналитику нужно проверить требования. Инженеру нужен точный контекст. Продукт связывает эти взгляды вокруг одной работы.', 'The requester wants a problem solved. The analyst needs to check requirements. The engineer needs precise context. The product connects these perspectives around the same work.')}</PageIntro>
    <section className="pp-role-list" aria-label={t('Участники работы', 'Participants')}>{roles.map(([name, action, description]) => <article key={name}><p className="eyebrow">{name}</p><div><h2>{action}</h2><p>{description}</p></div></article>)}</section>
    <section className="pp-human-rule"><h2>{t('ИИ помогает подготовить решение. Люди принимают результат.', 'AI helps prepare a solution. People accept the result.')}</h2><p>{t('Важно сохранить не только ответ модели, но и вопрос человека, основания решения и условия проверки. Тогда следующий участник видит, почему работа идет именно так.', 'Keep the person’s question, the reasons for the decision and the review conditions alongside the model’s answer. The next participant can then understand why the work follows this path.')}</p></section>
    <section className="pp-section pp-faq" aria-labelledby="faq-title"><div className="pp-section-intro"><p className="eyebrow">{t('Перед первым разговором', 'Before a first conversation')}</p><h2 id="faq-title">{t('Что еще стоит знать', 'A few useful details')}</h2></div>{questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
    <NextStep title={t('Есть процесс, в котором вы узнаете свою ситуацию?', 'Recognize a process from your own work?')} to="contact">{t('Разобрать задачу', 'Discuss a task')}</NextStep>
  </div>;
}

export function ProductPages({ page, t }) {
  if (page === 'capabilities') return <Capabilities t={t}/>;
  if (page === 'examples') return <Examples t={t}/>;
  if (page === 'team') return <Team t={t}/>;
  return null;
}
