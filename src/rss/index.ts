/* eslint-disable @typescript-eslint/no-unused-vars */
import {Spec} from '../types';
import {RSSFeed} from './feed';
import {RSSFeedGenerator} from './generator';
import {RSSFeedParser} from './parser';
import {applyMixins} from '../utils';

export {RSSFeed} from './feed';

export class RSS implements Spec<RSSFeed> {
  generate(feed: RSSFeed): string {
    throw new Error('Method not implemented.');
  }
  parse(rawData: string): RSSFeed {
    throw new Error('Method not implemented.');
  }
}

applyMixins(RSS, [RSSFeedGenerator, RSSFeedParser]);
