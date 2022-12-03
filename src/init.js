import i18next from 'i18next';
import * as yup from 'yup';
import view from './view.js';
import resources from './locales/resources.js';

export default () => {
  const state = {
    form: {
      valid: true,
      error: null,
      url: '',
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
  });

  const watchedState = view(state, elements, i18n);

  elements.form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const currentUrl = formData.get('url').trim();
    const urls = state.feeds.map((feed) => feed);

    const schema = yup.string()
      .required()
      .url('urlInvalid')
      .notOneOf(urls, 'rssDuplicated');

    await schema.validate(currentUrl)
      .then(() => {
        watchedState.form.valid = true;
        watchedState.form.url = currentUrl;
        watchedState.feeds.push(currentUrl);
        watchedState.form.error = null;
        console.log('+ valid form state', state);
      })
      .catch((error) => {
        switch (error.type) {
          case 'url':
            watchedState.form.valid = false;
            watchedState.form.error = i18n.t('errors.urlInvalid');
            console.log(`- validation error: ${error.type}`);
            console.log('- invalid form state', state);
            break;

          case 'notOneOf':
            watchedState.form.valid = false;
            watchedState.form.error = i18n.t('errors.rssDuplicated');
            console.log(`- validation error: ${error.type}`);
            console.log('- invalid form state', state);
            break;

          default:
            throw new Error(`##unknown error type: ${error.type}`);
        }
      });
  });
};
