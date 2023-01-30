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

const renderValidForm = (elements, value, i18n) => {
  const { form, feedback, input } = elements;

  if (value === true) {
    feedback.textContent = '';
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18n.t('successed.rssLoaded');

    form.reset();
    input.focus();
  }

  form.reset();
  input.focus();
};

const renderFeeds = (elements, state, i18n) => {
  const { form, input, feeds } = elements;
  feeds.innerHTML = '';

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

    return li.append(h3, p);
  });

  feeds.append(container);
  form.reset();
  input.focus();
};

const renderPosts = (elements, state, i18n) => {
  const { form, input, posts } = elements;
  posts.innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('car', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.textContent = i18n.t('elements.posts');
  h2.classList.add('card-title', 'h4');
  cardBody.append(h2);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  container.append(cardBody, ul);
  state.posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    ul.append(li);

    const a = document.createElement('a');
    a.classList.add('fw-bold');
    a.setAttribute('href', `${post.link}`);
    a.setAttribute('data-id', post.id);
    a.setAttribute('target', '_blanc');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = post.title;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', post.id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18n.t('elements.postButton');

    li.append(a, button);
  });

  posts.append(container);
  form.reset();
  input.focus();
};

const clickedPostsHandler = (state) => {
  const { clickedPost } = state.modal;

  const handlePost = (post) => {
    post.classList.replace('fw-bold', 'fw-normal');
    post.classList.add('link-secondary');
  };

  return handlePost(clickedPost);
};

const renderModal = (state, i18n) => {
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const modalFooter = document.querySelector('.modal-footer');
  const modalLinkButton = modalFooter.querySelector('a');
  const modalCloseButton = modalFooter.querySelector('button');

  modalLinkButton.textContent = i18n.t('modal.linkButton');
  modalCloseButton.textContent = i18n.t('modal.closeButton');

  state.posts.map((post) => {
    const {
      title,
      description,
      link,
      id,
    } = post;

    if (id === state.modal.clickedPostId) {
      modalTitle.textContent = title;
      modalBody.textContent = description;
      modalLinkButton.setAttribute('href', link);
    }

    return state;
  });
};

const render = (elements, state, i18n) => (path, value) => {
  switch (path) {
    case 'form.valid':
      renderValidForm(elements, value, i18n);
      break;

    case 'form.error':
      renderErrors(elements, value, i18n);
      break;

    case 'form.urls':
      break;

    case 'feeds':
      renderFeeds(elements, state, i18n);
      break;

    case 'posts':
      renderPosts(elements, state, i18n);
      break;

    case 'modal.clickedPost':
      clickedPostsHandler(state);
      break;

    case 'modal.clickedPostId':
      renderModal(state, i18n);
      break;

    case 'delayTime':
      break;

    default:
      throw new Error(`unknown path ${path}`);
  }
};

export default (state, elements, language) => onChange(state, render(elements, state, language));
