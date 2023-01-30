import 'bootstrap';
import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import { uniqueId } from 'lodash';
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
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button[type="submit"]'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    feedback: document.querySelector('.feedback'),
    selectorsToTranslate: {
      title: document.querySelector('.title'),
      subTitle: document.querySelector('.subTitle'),
      rssLink: document.querySelector('.rssLink'),
      exampleUrl: document.querySelector('.exampleUrl'),
      mainButton: document.querySelector('.mainButton'),
    },
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

  const watchedState = view(state, elements, i18n);

  const loadRss = (url) => {
    const newUrl = new URL('https://allorigins.hexlet.app');
    newUrl.pathname = '/get';
    newUrl.searchParams.append('disableCache', true);
    newUrl.searchParams.append('url', url);

    const proxy = newUrl.href;

    return axios.get(proxy)
      .then((response) => {
        const content = response.data.contents;

        return parse(content);
      })
      .then((response) => {
        const { feed, posts } = response;

        const feedId = uniqueId();
        feed.id = feedId;

        posts.forEach((post) => {
          const postId = uniqueId();
          post.id = postId;
          post.feedId = feedId;
        });

        return response;
      })
      .catch((error) => {
        if (error.name === 'AxiosError') {
          const networkError = new Error();
          networkError.type = 'networkError';
          throw networkError;
        }

        if (error.name === 'parsingError') {
          const parsingError = new Error();
          parsingError.type = 'parsingError';
          throw parsingError;
        }

        console.log(error.message);
      });
  };

  const updatePosts = (response, posts) => {
    const newPosts = response.posts;
    const loadedPostsTitles = [];

    posts.map((post) => loadedPostsTitles.push(post.title));
    const diffPosts = newPosts.filter((post) => !loadedPostsTitles.includes(post.title));

    if (diffPosts.length !== 0) {
      diffPosts.map((diffPost) => posts.push(diffPost));
    }

    console.group('diff posts');
    console.log(diffPosts);
    console.log('*********');
    console.log(posts);
    console.groupEnd();
  };

  const delayTime = 5000;

  const reloadSource = (currentUrl, posts) => {
    Promise.resolve(currentUrl)
      .then(() => loadRss(currentUrl))
      .then((response) => updatePosts(response, posts))
      .then((setTimeout(() => reloadSource(currentUrl, posts), delayTime)));
  };

  window.addEventListener('DOMContentLoaded', () => {
    const {
      title,
      subTitle,
      rssLink,
      exampleUrl,
      mainButton,
    } = elements.selectorsToTranslate;

    title.textContent = i18n.t('elements.title');
    subTitle.textContent = i18n.t('elements.subTitle');
    rssLink.textContent = i18n.t('elements.rssLink');
    exampleUrl.textContent = i18n.t('elements.exampleUrl');
    mainButton.textContent = i18n.t('elements.mainButton');
  });

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
        const { feed, posts } = response;

        watchedState.feeds = [...watchedState.feeds, feed];
        watchedState.posts = [...watchedState.posts, ...posts];

        watchedState.form.valid = true;
        watchedState.form.urls.push(currentUrl);
      })
      .then(() => {
        elements.posts.addEventListener('click', (evt) => {
          const { target } = evt;
          watchedState.modal.clickedPost = target;
          watchedState.modal.clickedPostId = target.dataset.id;
        });
      })
      .then(() => setTimeout(reloadSource(currentUrl, watchedState.posts), delayTime))
      .catch((error) => {
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

          case 'networkError':
            watchedState.form.valid = false;
            watchedState.form.error = i18n.t('errors.networkError');
            console.log(`- network error: ${i18n.t('errors.networkError')}`);
            console.log('- invalid form state', state);
            break;

          default:
            console.log(error.type, error.message);
            // throw new Error(`## unknown error: ${error.message}`);
        }
      });
  });
};

// http://lorem-rss.herokuapp.com/feed?unit=second&interval=5&length=1 // => generate 1 feed every 5 sec
