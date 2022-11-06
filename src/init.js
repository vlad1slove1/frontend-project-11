import onChange from 'on-change';
import validate from './utils/validate.js';
import view from './view.js';

const state = {
  form: {
    valid: true,
    state: 'filling',
    error: null,
  },
  posts: [],
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

export default () => {
  const watchedState = onChange(state, view(elements, state));
  const { form } = elements;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    watchedState.form.state = 'filling';
    const formData = new FormData(event.target);
    const url = formData.get('url');
    const feedsUrl = state.feeds.map((feed) => feed.url);
    console.log(watchedState);

    validate(url, feedsUrl)
      .then((validUrl) => {
        watchedState.form.valid = true;
        watchedState.feeds.push(validUrl);
      })
      .catch((error) => {
        watchedState.form.valid = false;
        watchedState.error = error;
      });
  });
};
