import {PodcastFeed} from './feed';
import {Spec} from '../types';
import {PodcastFeedParser} from './parser';
import {PodcastFeedGenerator} from './generator';

export * from './feed';

export class Podcast implements Spec<PodcastFeed> {
  private parser = new PodcastFeedParser();
  private generator = new PodcastFeedGenerator();

  generate(feed: PodcastFeed): string {
    return this.generator.generate(feed);
  }

  parse(rawData: string): PodcastFeed {
    return this.parser.parse(rawData);
  }
}
