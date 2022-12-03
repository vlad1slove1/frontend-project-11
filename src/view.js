import onChange from 'on-change';

const renderErrors = (elements, error) => {
  const { form, feedback, input } = elements;

  feedback.textContent = '';
  input.classList.add('is-invalid');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  feedback.textContent = error;

  form.reset();
  input.focus();
};

const renderFeeds = (elements, i18n) => {
  const { form, feedback, input } = elements;

  input.classList.remove('is-invalid');
  feedback.textContent = '';
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = i18n.t('successed.rssLoaded');

  form.reset();
  input.focus();
};

const render = (elements, i18n) => (path, value) => {
  switch (path) {
    case 'form.valid':
      break;

    case 'form.error':
      renderErrors(elements, value);
      break;

    case 'form.url':
      break;

    case 'feeds':
      renderFeeds(elements, i18n);
      break;

    default:
      throw new Error(`unknown path ${path}`);
  }
};

export default (state, elements, language) => onChange(state, render(elements, language));
