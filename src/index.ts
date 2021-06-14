export * as xml from './xml';
export * as json from './json';
export * from './spec';

interface Constructor<T> {
  new (): T;
}

export const create = <F>(FeedType: Constructor<F>, data: Partial<F>): F => {
  const feed = new FeedType();
  Object.assign(feed, data);
  return feed;
};
