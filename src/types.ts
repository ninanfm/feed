export interface FeedGenerator<T> {
  generate(feed: T): string;
}

export interface FeedParser<T> {
  parse(rawData: string): T;
}

export interface Spec<T> extends FeedGenerator<T>, FeedParser<T> {}
