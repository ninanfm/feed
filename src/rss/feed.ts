export interface RSSFeed {
  namespaces: Namespace[];
  channel: Channel;
}

export interface Namespace {
  name: string;
  url: string;
}

export interface Channel {
  title: string;
  link: string;
  description: string;

  language?: string;
  copyright?: string;
  managingEditor?: string;
  webMaster?: string;
  pubDate?: Date;
  lastBuildDate?: Date;
  categories?: Category[];
  generator?: string;
  docs?: string;
  ttl?: number;
  image?: Image;
  textInput?: TextInput;
  skipHours?: number[];
  skipDays?: number[];
  items?: Item[];
}

export interface Category {
  name: string;
  domain?: string;
}

export interface Image {
  url: string;
  title: string;
  link: string;

  width?: number;
  height?: number;
  description?: string;
}

export interface TextInput {
  title: string;
  description: string;
  name: string;
  link: string;
}

export interface Item {
  title?: string;
  link?: string;
  description?: string;
  author?: string;
  categories?: Category[];
  comments?: string;
  enclosure?: Enclosure;
  guid?: GUID;
  pubDate?: Date;
  source?: Source;
}

export interface Enclosure {
  url: string;
  length?: number;
  type?: string;
}

export interface GUID {
  isPermaLink?: boolean;
  value: string;
}

export interface Source {
  url: string;
  name: string;
}
