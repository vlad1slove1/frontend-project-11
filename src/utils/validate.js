import * as yup from 'yup';

export default async (url, urlList) => {
  const schema = yup.string()
    .required()
    .url()
    .notOneOf(urlList);

  await schema.validate(url);
};
