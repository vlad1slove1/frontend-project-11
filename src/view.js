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

const renderFeeds = (elements, state, i18n) => {
  const {
    form,
    feeds,
    feedback,
    input,
  } = elements;

  input.classList.remove('is-invalid');
  feedback.textContent = '';
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = i18n.t('successed.rssLoaded');

  form.reset();
  input.focus();

  const container = document.createElement('div');
  container.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.textContent = i18n.t('elements.feeds');
  h2.classList.add('card-title', 'h4');
  cardBody.append(h2);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  container.append(cardBody, ul);

  state.feeds.map((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    ul.append(li);

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;

    return ul.append(li, p);
  });

  feeds.append(container);
};

const render = (elements, state, i18n) => (path, value) => {
  switch (path) {
    case 'form.valid':
      break;

    case 'form.error':
      renderErrors(elements, value);
      break;

    case 'form.url':
      break;

    case 'feeds':
      renderFeeds(elements, state, i18n);
      break;

    case 'posts':
      break;

    default:
      throw new Error(`unknown path ${path}`);
  }
};

export default (state, elements, language) => onChange(state, render(elements, state, language));
