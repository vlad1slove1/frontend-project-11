import { uniqueId } from 'lodash';

export default (content) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/xml');

  const parsingError = doc.querySelector('parsererror');
  if (parsingError) {
    throw new Error('parsingError');
  }

  const feed = {
    title: doc.querySelector('title').textContent,
    description: doc.querySelector('description').textContent,
    link: doc.querySelector('link').textContent,
    id: uniqueId(),
  };

  // console.log(feed);

  const feedItems = doc.querySelectorAll('item');
  const posts = [...feedItems].map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
    id: uniqueId(),
    feedId: feed.id,
  }));

  // console.log(posts);

  return { feed, posts };
};
