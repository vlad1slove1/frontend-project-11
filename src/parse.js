import { uniqueId } from 'lodash';

export default (content) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/xml');

  if (doc.querySelector('parsererror')) {
    throw new Error('parsingError');
  }

  const feed = {
    title: doc.querySelector('title').textContent,
    description: doc.querySelector('description').textContent,
    id: uniqueId(),
  };

  const feedItems = doc.querySelectorAll('item');
  const posts = [...feedItems].map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
    id: uniqueId(),
    feedId: feed.id,
  }));

  return { feed, posts };
};
