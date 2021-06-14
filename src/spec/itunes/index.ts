import {tags, spec} from '../../tags';
import {schema} from './schema';
import * as rss from '../rss2.0';

export const support: ClassDecorator = target => {
  rss.support(target);
  spec(schema, 'xml')(target);
  rss.ns({itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd'})(target);
};

export const podcast = {
  image: tags({xml: 'rss.channel.itunes:image'}),
  categories: tags({xml: 'rss.channel.itunes:category'}),
  explicit: tags({xml: 'rss.channel.itunes:explicit'}),
  author: tags({xml: 'rss.channel.itunes:author'}),
  owner: tags({xml: 'rss.channel.itunes:owner'}),
  ownerName: tags({xml: 'rss.channel.itunes:owner.itunes:name'}),
  ownerEmail: tags({xml: 'rss.channel.itunes:owner.itunes:email'}),
  type: tags({xml: 'rss.channel.itunes:type'}),
  newFeedUrl: tags({xml: 'rss.channel.itunes:new-feed-url'}),
  block: tags({xml: 'rss.channel.itunes:block'}),
  complete: tags({xml: 'rss.channel.itunes:complete'}),
};

export const episode = {
  duration: tags({xml: 'itunes:duration'}),
  image: tags({xml: 'itunes:image'}),
  explicit: tags({xml: 'itunes:explicit'}),
  episode: tags({xml: 'itunes:episode'}),
  season: tags({xml: 'itunes:season'}),
  episodeType: tags({xml: 'itunes:episodeType'}),
  block: tags({xml: 'itunes:block'}),
};

export const category = {
  name: tags({xml: 'text'}),
  subCategories: tags({xml: 'itunes:category'}),
};

export const owner = {
  name: tags({xml: 'itunes:name'}),
  email: tags({xml: 'itunes:email'}),
};
