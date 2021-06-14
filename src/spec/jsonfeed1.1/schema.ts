import * as Joi from 'joi';
import {language, mimeType} from '../../joi-utils';

const url = Joi.string().uri({scheme: ['http', 'https']});

const author = Joi.object({
  name: Joi.string(),
  url,
  avatar: url,
});

const attachment = Joi.object({
  url: url.required(),
  mime_type: mimeType.required(),
  title: Joi.string(),
  size_in_bytes: Joi.number(),
  duration_in_seconds: Joi.number(),
});

const item = Joi.object({
  id: Joi.string().required(),
  url: url,
  external_url: url,
  title: Joi.string(),
  content_html: Joi.string(),
  content_text: Joi.string(),
  summary: Joi.string(),
  image: url,
  banner_image: url,
  date_published: Joi.string().isoDate(),
  date_modified: Joi.string().isoDate(),
  authors: Joi.array().items(author),
  tags: Joi.array().items(Joi.string()),
  language,
  attachments: Joi.array().items(attachment),
});

const feed = Joi.object({
  version: Joi.string().default('https://jsonfeed.org/version/1.1'),
  title: Joi.string().required(),
  home_page_url: url,
  feed_url: url,
  description: Joi.string(),
  user_comment: Joi.string(),
  next_url: url,
  icon: url,
  favicon: url,
  authors: Joi.array().items(author),
  language,
  expired: Joi.bool(),
  hubs: Joi.array().items(Joi.string()),
  items: Joi.array().items(item),
});

export const schema = feed;
