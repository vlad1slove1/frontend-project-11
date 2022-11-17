import validate from './utils/validate.js';
import view from './view.js';

export default () => {
  const state = {
    form: {
      valid: true,
      errors: [],
      urlList: [],
    },
    feeds: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button[type="submit"]'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    feedback: document.querySelector('.feedback'),
  };

  const watchedState = view(state, elements);

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const url = formData.get('url');

    validate(url, state.urlList)
      .then((currentUrl) => {
        watchedState.form.urlList.push(currentUrl);
        watchedState.form.valid = true;
        watchedState.form.errors = [];
      })
      .catch((error) => {
        watchedState.form.errors.push(error.message);
        watchedState.form.valid = false;
        console.log(error.message);
      });
  });
};
