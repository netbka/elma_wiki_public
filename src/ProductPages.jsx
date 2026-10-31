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
      [t('Проверка результата на DEV2', 'Review the result on DEV2'), t('Что сделано, что проверить и кому дать подтверждение', 'What changed, what to check and who needs to confirm'), t('Проверить вместе', 'Review together')],
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
    <NextStep title={t('Посмотрим, как это выглядит на конкретной задаче', 'Explore a concrete task')} to="examples">{t('Разобрать сценарии', 'Explore scenarios')}</NextStep>
  </div>;
}

function Examples({ t }) {
  const [selected, setSelected] = useState('approval');
  const examples = [
    {
      id: 'approval', label: t('Согласование', 'Approval'), title: t('Крупному договору нужна еще одна проверка', 'A high-value contract needs an extra review'),
      before: t('Сейчас все договоры идут одним маршрутом. Бизнес хочет подключать финансового директора только при превышении суммы.', 'Every contract currently follows the same route. The business wants finance approval only above a value threshold.'),
      request: t('После юридической проверки добавьте финансового директора, если сумма договора больше миллиона рублей.', 'After legal review, add finance approval when the contract value exceeds one million rubles.'),
      clarify: t('Что делать ровно на пороге? Меняется ли правило для действующих договоров? Кто замещает финансового директора?', 'What happens exactly at the threshold? Does the rule apply to existing contracts? Who substitutes for the finance director?'),
      affects: t('Условие по сумме и переход после юридической проверки. Основной маршрут договоров ниже порога нужно сохранить.', 'The value condition and the transition after legal review. The standard route below the threshold must be preserved.'),
      checks: [t('Ниже порога маршрут остается прежним.', 'Below the threshold, the existing route stays.'), t('Ровно на пороге дополнительный шаг не появляется.', 'At the threshold, there is no extra step.'), t('Выше порога появляется финансовое согласование.', 'Above the threshold, finance approval is added.')],
      result: t('Участники видят разницу маршрутов и проверяют правило на граничных суммах. Этот пример можно пройти в интерактивном демо.', 'Participants see the route difference and check boundary values. You can walk through this case in the interactive demo.'),
    },
    {
      id: 'attachment', label: t('Форма документа', 'Document form'), title: t('Договор ушел на согласование без приложения', 'A contract was submitted without its attachment'),
      before: t('Приложение запрашивают в переписке уже после отправки. Инициатор возвращается к документу, а согласующие ждут.', 'The attachment is requested in a conversation after submission. The requester returns to the document while reviewers wait.'),
      request: t('При отправке договора на согласование проверяйте наличие приложения и объясняйте, чего не хватает.', 'When submitting a contract for approval, check for the attachment and explain what is missing.'),
      clarify: t('Для всех ли видов договора оно обязательно? Можно ли сохранить черновик без файла? Какое сообщение поможет человеку исправить ситуацию?', 'Is it mandatory for every contract type? Can a draft be saved without a file? What message will help the person fix the problem?'),
      affects: t('Поле приложения, действие отправки и сообщение на форме. Требование к отправке не должно случайно мешать работе с черновиком.', 'The attachment field, submit action and form message. A submission rule should not accidentally prevent work on a draft.'),
      checks: [t('Без файла отправка объясняет, что нужно добавить.', 'Without a file, submission explains what to add.'), t('С файлом договор проходит дальше.', 'With a file, the contract proceeds.'), t('Черновик и исключения работают по согласованному правилу.', 'Drafts and exceptions follow the agreed rule.')],
      result: t('Приемка проверяет и бизнес-ограничение, и понятность сообщения. Здесь показан разбор; работающая форма этого сценария в демо пока не реализована.', 'Review checks both the business rule and the clarity of the message. This is a case breakdown; its form is not implemented in the demo yet.'),
    },
    {
      id: 'access', label: t('Действия участников', 'Participant actions'), title: t('Кто должен видеть действие в карточке?', 'Who should see an action on a record?'),
      before: t('Человек не находит нужную кнопку. Причина может быть в этапе процесса, назначении задачи или правах. Просьбы «добавьте всем доступ» недостаточно.', 'Someone cannot find a button. The reason may be the process stage, task assignment or permissions. “Give everyone access” does not define a solution.'),
      request: t('Помогите разобраться, кто и на каком этапе должен отправлять документ на повторную проверку.', 'Help establish who should send the document for another review, and at which stage.'),
      clarify: t('Кто выполняет действие? В каких состояниях? Что должен видеть другой участник? Вопрос может потребовать объяснения, а не изменения прав.', 'Who performs the action? In which states? What should another participant see? The question may need an explanation rather than a permission change.'),
      affects: t('Конкретное действие, его условия и роли участников. Сначала проверяем текущее поведение и ожидаемый порядок работы.', 'The specific action, its conditions and participant roles. First check the current behavior and the intended workflow.'),
      checks: [t('Нужный участник может выполнить действие на нужном этапе.', 'The intended participant can act at the appropriate stage.'), t('Другой участник не получает лишних возможностей.', 'Another participant does not gain unnecessary permissions.'), t('Вопрос закрывается понятным ответом или отдельным изменением.', 'The question ends in a clear answer or a separate change.')],
      result: t('Команда получает объяснение правила или точную заявку на его изменение. Это иллюстрация подхода, без проверки реальных прав посетителя.', 'The team receives an explanation of the rule or a precise request to change it. This illustrates the approach without checking a visitor’s real permissions.'),
    },
  ];
  const example = examples.find(item => item.id === selected);
  return <div className="container page-content product-pages">
    <PageIntro eyebrow={t('Сценарии', 'Scenarios')} title={t('Начинается с обычного рабочего вопроса', 'It starts with an everyday work question')}>{t('Три вымышленных примера показывают, зачем связывать запрос с конкретным местом системы и заранее договариваться о проверке.', 'Three synthetic examples show why a request needs a specific place in the system and an agreed way to check the outcome.')}</PageIntro>
    <div className="pp-case-picker" role="group" aria-label={t('Выбрать рабочую ситуацию', 'Choose a work scenario')}>{examples.map(item => <button type="button" key={item.id} aria-pressed={selected === item.id} aria-controls="scenario-content" onClick={() => setSelected(item.id)}>{item.label}</button>)}</div>
    <article id="scenario-content" className="pp-case" aria-live="polite"><span className="tag">{t('Учебный разбор', 'Illustrative case')}</span><h2>{example.title}</h2><p className="pp-case-before">{example.before}</p><blockquote>{example.request}</blockquote><div className="pp-case-columns"><section><h3>{t('Сначала уточним', 'Clarify first')}</h3><p>{example.clarify}</p><h3>{t('Где искать изменение', 'Where the change belongs')}</h3><p>{example.affects}</p></section><section className="pp-checklist"><h3>{t('По чему принимать результат', 'How to review the result')}</h3><ul>{example.checks.map(check => <li key={check}><CheckIcon size={17}/><span>{check}</span></li>)}</ul></section></div><p className="pp-case-result">{example.result}</p><a className="button" href={selected === 'approval' ? '#demo' : '#contact'}>{selected === 'approval' ? t('Пройти этот пример', 'Try this example') : t('Обсудить похожую задачу', 'Discuss a similar task')}<ArrowRightIcon size={18}/></a></article>
    <NextStep title={t('За каждым шагом есть человек, который решает', 'Each step has a person who decides')} to="team">{t('Как работает команда', 'How the team works')}</NextStep>
  </div>;
}

function Team({ t }) {
  const roles = [
    [t('Заказчик', 'Requester'), t('Объясняет проблему и отвечает на вопросы', 'Explains the problem and answers questions'), t('Видит собственную заявку, уточнения и ход работы. Может описать ожидаемый результат на языке своей задачи.', 'Sees their request, clarifications and progress. Describes the desired result in the language of their work.')],
    [t('Аналитик', 'Analyst'), t('Проверяет, что команда одинаково поняла задачу', 'Checks that the team shares the same understanding'), t('Связывает запрос с системой, уточняет условия и проверяет результат по согласованным требованиям.', 'Connects the request to the system, clarifies conditions and checks the result against agreed requirements.')],
    [t('Владелец продукта', 'Product owner'), t('Собирает работу в осмысленный результат', 'Brings the work into a meaningful outcome'), t('Определяет состав пакета и подтверждает, что результат подходит продукту. Его приемка дополняет проверку аналитика.', 'Determines the package scope and confirms the result fits the product. Their acceptance complements the analyst’s review.')],
    [t('Инженер', 'Engineer'), t('Готовит изменение и его техническую проверку', 'Prepares the change and its technical verification'), t('Работает с версиями, условиями выполнения и результатом разработки. Фиксирует сделанное и то, что предстоит проверить людям.', 'Works with versions, execution conditions and development results. Records the work and what people need to check.')],
    [t('Администратор', 'Administrator'), t('Организует доступ участников', 'Organizes participant access'), t('Назначает роли участникам и организует доступ к рабочему пространству. Подключением сред занимается инженер или оператор. Бизнес-решения остаются у ответственных за них людей.', 'Assigns participant roles and organizes workspace access. An engineer or operator connects the environments. Business decisions stay with the people responsible for them.')],
  ];
  const questions = [
    [t('Почему Wiki, если здесь есть работа над изменениями?', 'Why “Wiki” if it also manages changes?'), t('Проект начался с желания разобраться в сложной системе. Постепенно к этому контексту добавились заявки, обсуждения и проверка результата. Название осталось, а рабочий путь стал шире.', 'The project began with understanding a complex system. Requests, discussions and result verification grew around that context. The name stayed while the working journey expanded.')],
    [t('Нужно заменить ELMA365 или ее дизайнер?', 'Does this replace ELMA365 or its designer?'), t('Рабочие процессы продолжают выполняться в ELMA365. Wiki помогает команде понимать конфигурацию и организовывать изменения; существующие средства платформы остаются частью работы.', 'Business processes continue to run in ELMA365. Wiki helps the team understand configuration and organize changes; the platform’s existing tools remain part of the work.')],
    [t('Что происходит с задачами из Redmine?', 'What happens to Redmine tasks?'), t('Redmine остается источником собственных задач. Wiki читает их и помогает вести связанную работу. Запись изменений обратно в Redmine сейчас не выполняется.', 'Redmine remains the source of its own tasks. Wiki reads them and helps manage related work. It does not currently write changes back to Redmine.')],
    [t('ИИ сам меняет рабочую систему?', 'Does AI change the live system on its own?'), t('Анализ читает рабочую систему без изменений. Разработка выполняется в отдельной среде DEV2 и проходит проверку. Приемку дают аналитик и владелец продукта, два разных человека. Перенос в рабочую среду выполняет партнер. Полный цикл, включая выпуск в прод, уже работает.', 'Analysis reads the live system without changes. Development runs in the separate DEV2 environment and is reviewed. Two different people, the analyst and product owner, give acceptance. A partner transfers changes to production. The full workflow, including production releases, is already operational.')],
    [t('Что я могу попробовать на этом сайте?', 'What can I try on this website?'), t('Учебный маршрут согласования: изменить порог суммы, сравнить поведение и пройти приемку. Прогресс сохраняется в этом браузере. Сайт не подключается к вашей ELMA, не запускает AIWorks и не предлагает вход в рабочую систему.', 'A sample approval journey: change the threshold, compare behavior and complete acceptance. Progress is saved in this browser. The site does not connect to your ELMA, run AIWorks or provide access to a working system.')],
    [t('С чего начать разговор о похожем решении?', 'Where should a conversation about a similar solution start?'), t('С одного процесса и одного повторяющегося затруднения. Например: заявки теряют контекст, требования приходится объяснять заново или непонятно, как принимать результат. Этого достаточно, чтобы обсудить подход.', 'Start with one process and one recurring difficulty: requests lose context, requirements need explaining again, or nobody knows how to accept the result. That is enough to discuss the approach.')],
  ];
  return <div className="container page-content product-pages">
    <PageIntro eyebrow={t('Для команды', 'For the team')} title={t('Одна задача. Разные вопросы к ней.', 'One task. Different questions about it.')}>{t('Заказчику важно, чтобы проблема решилась. Аналитику нужно проверить требования. Инженеру нужен точный контекст. Продукт связывает эти взгляды вокруг одной работы.', 'The requester wants a problem solved. The analyst needs to check requirements. The engineer needs precise context. The product connects these perspectives around the same work.')}</PageIntro>
    <section className="pp-role-list" aria-label={t('Участники работы', 'Participants')}>{roles.map(([name, action, description]) => <article key={name}><p className="eyebrow">{name}</p><div><h2>{action}</h2><p>{description}</p></div></article>)}</section>
    <section className="pp-human-rule"><h2>{t('ИИ помогает подготовить решение. Люди принимают результат.', 'AI helps prepare a solution. People accept the result.')}</h2><p>{t('Важно сохранить не только ответ модели, но и вопрос человека, основания решения и условия проверки. Тогда следующий участник видит, почему работа идет именно так.', 'Keep the person’s question, the reasons for the decision and the review conditions alongside the model’s answer. The next participant can then understand why the work follows this path.')}</p></section>
    <section className="pp-section pp-faq" aria-labelledby="faq-title"><div className="pp-section-intro"><p className="eyebrow">{t('Перед первым разговором', 'Before a first conversation')}</p><h2 id="faq-title">{t('Что еще стоит знать', 'A few useful details')}</h2></div>{questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
    <NextStep title={t('Есть процесс, в котором вы узнаете свою ситуацию?', 'Recognize a process from your own work?')} to="contact">{t('Рассказать о задаче', 'Describe your task')}</NextStep>
  </div>;
}

export function ProductPages({ page, t }) {
  if (page === 'capabilities') return <Capabilities t={t}/>;
  if (page === 'examples') return <Examples t={t}/>;
  if (page === 'team') return <Team t={t}/>;
  return null;
}
