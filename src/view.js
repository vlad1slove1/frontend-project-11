import onChange from 'on-change';

const validTextContent = 'RSS успешно загружен';
const invalidTextContent = 'Ресурс не содержит валидный RSS';
const duplicateTextContent = 'RSS уже существует';

const processHandler = (elements, process) => {
  const { form, button, feedback } = elements;

  switch (process) {
    case 'filling':
      button.disabled = false;
      break;

    case 'processing':
      button.disabled = true;
      break;

    case 'processed':
      button.disabled = false;
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = validTextContent;

      form.reset();
      form.focus();
      break;

    default:
      throw new Error(`unknown process: ${process}`);
  }
};

const validFormHandler = (elements, value) => {
  const { feedback } = elements;

  if (value === true) {
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = validTextContent;
  }
};

const errorHandler = (elements, error) => {
  const { button, feedback } = elements;

  button.disabled = false;
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');

  switch (error) {
    case 'url':
      feedback.textContent = invalidTextContent;
      break;

    case 'notOneOf':
      feedback.textContent = duplicateTextContent;
      break;

    default:
      throw new Error(`unknown error: ${error}`);
  }
};

export default (elements, state) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.state':
      processHandler(elements, value);
      break;

    case 'form.valid':
      validFormHandler(elements, value);
      break;

    case 'form.error':
      errorHandler(elements, value);
      break;

    default:
      throw new Error(`unknown path: ${path}`);
  }
});
