import 'bootstrap';
import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import view from './view.js';
import resources from './locales/resources.js';
import parse from './parse.js';

export default () => {
  const state = {
    form: {
      valid: false,
      error: null,
      urls: [],
    },
    feeds: [],
    posts: [],
    modal: {
      clickedPost: '',
      clickedPostId: '',
    },
    delayTime: 5000,
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button[type="submit"]'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    feedback: document.querySelector('.feedback'),
  };

  const i18n = i18next.createInstance();
  const defaultLanguage = 'ru';

  i18n.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  yup.setLocale({
    string: {
      url: i18n.t('errors.urlInvalid'),
    },
    mixed: {
      notOneOf: i18n.t('errors.rssDuplicated'),
    },
  });

  const loadRss = (url) => {
    const encodedUrl = encodeURIComponent(url);
    const proxy = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodedUrl}`;

    return axios.get(proxy)
      .then((response) => response.data.contents)
      .catch(() => {
        throw new Error('parsingError');
      });
  };

  const updatePosts = (response, posts) => {
    const newPosts = response.posts;
    const loadedPostsId = [];

    posts.map((post) => loadedPostsId.push(post.title));
    const diffPosts = newPosts.filter((post) => !loadedPostsId.includes(post.title));

    if (diffPosts.length !== 0) {
      diffPosts.map((diffPost) => posts.push(diffPost));
    }

    console.group('diff posts');
    console.log(diffPosts);
    console.log('*********');
    console.log(posts);
    console.groupEnd();
  };

  const reloadSource = (currentUrl, posts) => {
    Promise.resolve(currentUrl)
      .then(() => loadRss(currentUrl))
      .then((response) => parse(response))
      .then((response) => updatePosts(response, posts))
      .then((setTimeout(() => reloadSource(currentUrl, posts), state.delayTime)));
  };

  const watchedState = view(state, elements, i18n);

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const currentUrl = formData.get('url').trim();

    const schema = yup.string()
      .required()
      .url(i18n.t('errors.urlInvalid'))
      .notOneOf(watchedState.form.urls, i18n.t('errors.rssDuplicated'));

    schema.validate(currentUrl)
      .then(() => loadRss(currentUrl))
      .then((response) => {
        const { feed, posts } = parse(response);
        watchedState.feeds = [...watchedState.feeds, feed];
        watchedState.posts = [...watchedState.posts, ...posts];

        watchedState.form.valid = true;
        watchedState.form.urls.push(currentUrl);

        // console.log(state.posts);
      })
      .then(() => {
        elements.posts.addEventListener('click', (evt) => {
          const { target } = evt;
          watchedState.modal.clickedPost = target;
          watchedState.modal.clickedPostId = target.dataset.id;

          // console.log(state.modal);
        });
      })
      .then(() => setTimeout(reloadSource(currentUrl, watchedState.posts), state.delayTime))
      .catch((error) => {
        // console.log(error.type);
        switch (error.type) {
          case 'url':
            watchedState.form.valid = false;
            watchedState.form.error = i18n.t('errors.urlInvalid');
            console.log(`- url validation error: ${error}`);
            console.log('- invalid form state', state);
            break;

          case 'notOneOf':
            watchedState.form.valid = false;
            watchedState.form.error = i18n.t('errors.rssDuplicated');
            console.log(`- not one of error: ${error}`);
            console.log('- invalid form state', state);
            break;

          case 'parsingError':
            watchedState.form.valid = false;
            watchedState.form.error = i18n.t('errors.rssInvalid');
            console.log(`- parsing error: ${i18n.t('errors.rssInvalid')}`);
            console.log('- invalid form state', state);
            break;

          default:
            console.log('form state =', state);
            throw new Error(`## unknown error: ${error}`);
        }
      });
  });
};
