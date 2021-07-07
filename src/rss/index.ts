/* eslint-disable @typescript-eslint/no-unused-vars */
import {Spec} from '../types';
import {RSSFeed} from './feed';
import {RSSFeedGenerator} from './generator';
import {RSSFeedParser} from './parser';

export * from './feed';

export class RSS implements Spec<RSSFeed> {
  private parser = new RSSFeedParser();
  private generator = new RSSFeedGenerator();

  generate(feed: RSSFeed): string {
    return this.generator.generate(feed);
  }

  parse(rawData: string): RSSFeed {
    return this.parser.parse(rawData);
  }
}
