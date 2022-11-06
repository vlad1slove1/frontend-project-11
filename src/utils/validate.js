import * as yup from 'yup';

export default async (url, feedsUrl) => {
  const schema = yup.string()
    .required()
    .url()
    .notOneOf(feedsUrl);

  await schema.validate(url);
};
