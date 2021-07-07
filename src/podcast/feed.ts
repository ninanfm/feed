import {RSSFeed, Item, Channel} from '../rss';

export interface PodcastFeed extends RSSFeed {
  channel: PodcastChannel;
}

export interface PodcastChannel extends Channel {
  itunes?: ChannelItunes;
  items?: PodcastItem[];
}

export interface PodcastItem extends Item {
  itunes?: ItemItunes;
}

export interface ChannelItunes {
  image: string;
  categories: ItunesCategory[];
  explicit: boolean;

  author?: string;
  owner?: ItunesOwner;
  title?: string;
  type?: ItunesType;
  newFeedUrl?: string;
  block?: boolean;
  complete?: boolean;
}

export interface ItunesCategory {
  name: string;
  categories?: ItunesCategory[];
}

export interface ItunesOwner {
  name?: string;
  email?: string;
}

export enum ItunesType {
  Episodic = 'Episodic',
  Serial = 'Serial',
}

export interface ItemItunes {
  duration?: number;
  image?: string;
  explicit?: boolean;
  title?: string;
  episode?: string;
  season?: string;
  episodeType?: ItunesEpisodeType;
  block?: boolean;
}

export enum ItunesEpisodeType {
  Full = 'Full',
  Trailer = 'Trailer',
  Bonus = 'Bonus',
}
