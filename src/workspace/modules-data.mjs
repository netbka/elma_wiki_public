// Synthetic configuration examples. These are not exports from a customer system.
export const MODULES = [
  {
    id: 'contracts', name: ['Управление договорами', 'Contract management'],
    description: ['Подготовка договоров, согласование условий и проверка результата изменений.', 'Contract preparation, approval rules and review of changes.'],
    forms: [{
      id: 'contract-card', name: ['Договор', 'Contract'],
      fields: [
        { id: 'title', name: ['Название договора', 'Contract title'], type: ['Строка', 'Text'], required: true, description: ['Короткое название помогает найти договор и отличить его от других.', 'A short title helps find and distinguish the contract.'] },
        { id: 'counterparty', name: ['Контрагент', 'Counterparty'], type: ['Выбор из справочника', 'Reference selection'], required: true, description: ['Организация, с которой заключается договор. Сведения о ней связаны с модулем «Контрагенты».', 'The organization signing the contract. Its details belong to the Counterparties module.'] },
        { id: 'amount', name: ['Сумма договора', 'Contract value'], type: ['Сумма', 'Amount'], required: true, description: ['В учебном процессе сумма определяет, нужно ли финансовое согласование.', 'In the sample process, the value determines whether finance approval is required.'] },
        { id: 'owner', name: ['Ответственный', 'Responsible person'], type: ['Пользователь', 'User'], required: true, description: ['Участник, который готовит договор и отвечает на вопросы согласующих.', 'The participant preparing the contract and answering reviewers’ questions.'] },
        { id: 'attachment', name: ['Приложение к договору', 'Contract attachment'], type: ['Файл', 'File'], description: ['Здесь можно предложить правило проверки приложения перед отправкой на согласование.', 'Propose a rule here for checking the attachment before submission for approval.'] },
        { id: 'comment', name: ['Комментарий', 'Comment'], type: ['Текст', 'Long text'], description: ['Дополнительные условия и пояснения к договору.', 'Additional terms and context for the contract.'] },
      ],
      actions: [{ id: 'submit', name: ['Отправить на согласование', 'Submit for approval'], description: ['В учебной конфигурации это действие запускает процесс согласования. Нажатие здесь выбирает действие для заявки.', 'In the sample configuration, this action starts approval. Clicking here selects it as a request location.'] }],
      statuses: [{ id: 'draft', name: ['Черновик', 'Draft'] }, { id: 'approval', name: ['На согласовании', 'In approval'] }, { id: 'approved', name: ['Согласован', 'Approved'] }],
    }],
    processes: [{
      id: 'contract-approval', name: ['Согласование договора', 'Contract approval'],
      steps: [
        { id: 'legal-review', name: ['Юридическая проверка', 'Legal review'], role: ['Юрист', 'Legal reviewer'], description: ['Проверить условия договора. После проверки договор следует по согласованному правилу суммы.', 'Review the contract terms. After review, the contract follows the agreed value rule.'] },
        { id: 'finance', name: ['Финансовое согласование', 'Finance approval'], role: ['Финансовый директор', 'Finance director'], condition: ['Для суммы выше 1 000 000 рублей', 'For values above RUB 1,000,000'], description: ['Учебное условие: финансовый директор участвует только при превышении порога. Условия можно обсудить в заявке.', 'Sample condition: finance approval is required only above the threshold. Discuss the rule in a request.'] },
        { id: 'manager', name: ['Решение руководителя', 'Manager decision'], role: ['Руководитель', 'Manager'], description: ['Руководитель завершает согласование после необходимых проверок.', 'The manager completes approval after the required reviews.'] },
      ],
    }],
  },
  {
    id: 'counterparties', name: ['Контрагенты', 'Counterparties'],
    description: ['Сведения об организациях и их связи с договорами.', 'Company details and their links to contracts.'],
    forms: [{ id: 'company-card', name: ['Организация', 'Company'], fields: [
      { id: 'company-name', name: ['Название организации', 'Company name'], type: ['Строка', 'Text'], required: true },
      { id: 'company-tax-id', name: ['ИНН', 'Tax identifier'], type: ['Строка', 'Text'] },
      { id: 'company-contact', name: ['Контактное лицо', 'Contact person'], type: ['Строка', 'Text'] },
    ] }], processes: [],
  },
  {
    id: 'correspondence', name: ['Корреспонденция', 'Correspondence'],
    description: ['Регистрация писем и передача документов на исполнение.', 'Registering letters and assigning documents for handling.'],
    forms: [{ id: 'letter-card', name: ['Входящее письмо', 'Incoming letter'], fields: [
      { id: 'letter-subject', name: ['Тема письма', 'Letter subject'], type: ['Строка', 'Text'], required: true },
      { id: 'letter-sender', name: ['Отправитель', 'Sender'], type: ['Строка', 'Text'] },
      { id: 'letter-owner', name: ['Исполнитель', 'Assignee'], type: ['Пользователь', 'User'] },
    ] }], processes: [{ id: 'letter-handling', name: ['Обработка письма', 'Letter handling'], steps: [
      { id: 'register-letter', name: ['Зарегистрировать письмо', 'Register the letter'], role: ['Регистратор', 'Registrar'], description: ['Зафиксировать письмо и определить ответственного.', 'Record the letter and choose a responsible person.'] },
      { id: 'handle-letter', name: ['Подготовить ответ', 'Prepare a response'], role: ['Исполнитель', 'Assignee'], description: ['Рассмотреть обращение и подготовить ответ.', 'Review the correspondence and prepare a response.'] },
    ] }],
  },
  {
    id: 'powers', name: ['Доверенности', 'Powers of attorney'],
    description: ['Учет полномочий, сроков и связанных документов.', 'Authority, validity periods and related documents.'],
    forms: [{ id: 'authority-card', name: ['Доверенность', 'Power of attorney'], fields: [
      { id: 'authority-person', name: ['Представитель', 'Representative'], type: ['Пользователь', 'User'], required: true },
      { id: 'authority-until', name: ['Действует до', 'Valid until'], type: ['Дата', 'Date'], required: true },
      { id: 'authority-scope', name: ['Полномочия', 'Authority scope'], type: ['Текст', 'Long text'] },
    ] }], processes: [],
  },
  {
    id: 'bonds', name: ['Облигации', 'Bonds'],
    description: ['Структура выпуска и связанные этапы его подготовки.', 'An issue’s structure and the stages of its preparation.'],
    forms: [{ id: 'bond-card', name: ['Выпуск облигаций', 'Bond issue'], fields: [
      { id: 'bond-name', name: ['Название выпуска', 'Issue name'], type: ['Строка', 'Text'], required: true },
      { id: 'bond-date', name: ['Дата выпуска', 'Issue date'], type: ['Дата', 'Date'] },
      { id: 'bond-owner', name: ['Ответственный', 'Responsible person'], type: ['Пользователь', 'User'] },
    ] }], processes: [],
  },
];

export const findModule = id => MODULES.find(module => module.id === id) || null;

export function findModulePlace(moduleId, placeId) {
  const module = findModule(moduleId);
  if (!module || !placeId) return null;
  for (const form of module.forms) {
    if (form.id === placeId) return { id: form.id, label: form.name, kind: 'form', ownerId: form.id, ownerName: form.name };
    for (const field of form.fields) if (field.id === placeId) return { ...field, label: field.name, kind: 'field', ownerId: form.id, ownerName: form.name };
    for (const action of form.actions || []) if (action.id === placeId) return { ...action, label: action.name, kind: 'action', ownerId: form.id, ownerName: form.name };
  }
  for (const process of module.processes) {
    if (process.id === placeId) return { id: process.id, label: process.name, kind: 'process', ownerId: process.id, ownerName: process.name };
    for (const step of process.steps) if (step.id === placeId) return { ...step, label: step.name, kind: 'step', ownerId: process.id, ownerName: process.name };
  }
  return null;
}
