import {tags, spec} from '../../tags';
import {schema} from './schema';

export const support: ClassDecorator = spec(schema, 'json');

export const feed = {
  title: tags({json: 'title'}),
  homePageUrl: tags({json: 'home_page_url'}),
  feedUrl: tags({json: 'feed_url'}),
  description: tags({json: 'description'}),
  userComment: tags({json: 'user_comment'}),
  nextUrl: tags({json: 'next_url'}),
  icon: tags({json: 'icon'}),
  favicon: tags({json: 'favicon'}),
  authors: tags({json: 'authors'}),
  language: tags({json: 'language'}),
  expired: tags({json: 'expired'}),
  hubs: tags({json: 'hubs'}),
  items: tags({json: 'items'}),
};

export const item = {
  id: tags({json: 'id'}),
  url: tags({json: 'url'}),
  externalUrl: tags({json: 'external_url'}),
  title: tags({json: 'title'}),
  contentHtml: tags({json: 'content_html'}),
  contentText: tags({json: 'content_text'}),
  summary: tags({json: 'summary'}),
  image: tags({json: 'image'}),
  bannerImage: tags({json: 'banner_image'}),
  datePublished: tags({json: 'date_published'}),
  dateModified: tags({json: 'date_modified'}),
  authors: tags({json: 'authors'}),
  tags: tags({json: 'tags'}),
  language: tags({json: 'language'}),
  attachments: tags({json: 'attachments'}),
};

export const attachment = {
  url: tags({json: 'url'}),
  mimeType: tags({json: 'mime_type'}),
  title: tags({json: 'title'}),
  sizeInBytes: tags({json: 'size_in_bytes'}),
  durationInSeconds: tags({json: 'duration_in_seconds'}),
};

export const author = {
  name: tags({json: 'name'}),
  url: tags({json: 'url'}),
  avatar: tags({json: 'avatar'}),
};
