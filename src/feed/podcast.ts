import * as objectPath from 'object-path';
import {iTunes, RSS2_0 as RSS, xml} from '../';
import {postProcessor, tags} from '../tags';

export enum PodcastType {
  Episodic = 'Episodic',
  Serial = 'Serial',
}

export enum EpisodeType {
  Full = 'Full',
  Trailer = 'Trailer',
  Bonus = 'Bonus',
}

@iTunes.support
export class Category {
  @iTunes.category.name
  name!: string;

  @iTunes.category.subCategories
  subCategories?: Category[];
}

@iTunes.support
export class Episode {
  @RSS.item.guid({isPermaLink: false})
  id!: string;

  @RSS.item.link
  url?: string;

  @RSS.item.title
  title!: string;

  @iTunes.episode.image
  coverImageUrl?: string;

  @RSS.enclosure.url
  audioUrl!: string;

  @RSS.enclosure.type
  audioType!: string;

  @RSS.enclosure.length
  audioSize!: number;

  @RSS.item.pubDate
  publishedAt!: Date;

  @RSS.item.description
  description?: string;

  @iTunes.episode.duration
  duration?: number;

  @iTunes.episode.explicit
  explicit?: boolean;

  @iTunes.episode.episode
  episodeNumber?: number;

  @iTunes.episode.season
  seasonNumber?: number;

  @iTunes.episode.episodeType
  type?: EpisodeType;

  @iTunes.episode.block
  block?: boolean;
}

@iTunes.support
@RSS.ns({atom: 'http://www.w3.org/2005/Atom'})
@postProcessor((doc, podcast: Podcast) => {
  objectPath.set(doc, 'rss.channel.atom:link', [
    {
      '@rel': 'hub',
      '@href': 'https://pubsubhubbub.appspot.com',
    },
    {
      '@rel': 'self',
      '@href': podcast.feedUrl,
    },
  ]);
  return doc;
}, 'xml')
export class Podcast {
  @RSS.channel.title
  title!: string;

  feedUrl!: string;

  @RSS.channel.description
  description!: string;

  @iTunes.podcast.image
  coverImageUrl!: string;

  @RSS.channel.language
  language!: string;

  @iTunes.podcast.categories
  categories!: (Category | string)[];

  @iTunes.podcast.explicit
  explicit?: boolean;

  @iTunes.podcast.author
  author?: string;

  @RSS.channel.link
  homePageUrl!: string;

  @iTunes.podcast.ownerName
  ownerName?: string;

  @iTunes.podcast.ownerEmail
  ownerEmail?: string;

  @iTunes.podcast.type
  type?: PodcastType;

  @RSS.channel.copyright
  copyright?: string;

  @iTunes.podcast.newFeedUrl
  newFeedUrl?: string;

  @iTunes.podcast.block
  block?: boolean;

  @iTunes.podcast.complete
  complete?: boolean;

  @RSS.channel.items
  episodes?: Episode[];

  toRSS(): string {
    return xml.toString(this);
  }
}
