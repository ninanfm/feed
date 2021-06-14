import * as objectPath from 'object-path';
import {tags, spec, postProcessor} from '../../tags';
import {schema} from './schema';

export const support: ClassDecorator = spec(schema, 'xml');

export const ns = (namespaces: {[name: string]: string}): ClassDecorator =>
  postProcessor(doc => {
    for (const [name, url] of Object.entries(namespaces)) {
      objectPath.set(doc, `rss.@xmlns:${name}`, url);
    }
    return doc;
  }, 'xml');

export const channel = {
  title: tags({xml: 'rss.channel.title'}),
  link: tags({xml: 'rss.channel.link'}),
  description: tags({xml: 'rss.channel.description'}),
  language: tags({xml: 'rss.channel.language'}),
  copyright: tags({xml: 'rss.channel.copyright'}),
  managingEditor: tags({xml: 'rss.channel.managingEditor'}),
  webMaster: tags({xml: 'rss.channel.webMaster'}),
  pubDate: tags({xml: 'rss.channel.pubDate'}),
  lastBuildDate: tags({xml: 'rss.channel.lastBuildDate'}),
  categories: tags({xml: 'rss.channel.category'}),
  generator: tags({xml: 'rss.channel.generator'}),
  docs: tags({xml: 'rss.channel.docs'}),
  cloud: tags({xml: 'rss.channel.cloud'}),
  ttl: tags({xml: 'rss.channel.ttl'}),
  image: tags({xml: 'rss.channel.image'}),
  textInput: tags({xml: 'rss.channel.textInput'}),
  skipHours: tags({xml: 'rss.channel.skipHours'}),
  skipDays: tags({xml: 'rss.channel.skipDays'}),
  items: tags({xml: 'rss.channel.item'}),
};

export const item = {
  title: tags({xml: 'title'}),
  link: tags({xml: 'link'}),
  description: tags({xml: 'description'}),
  author: tags({xml: 'author'}),
  categories: tags({xml: 'category'}),
  comments: tags({xml: 'comments'}),
  enclosure: tags({xml: 'enclosure'}),
  guid:
    ({isPermaLink = false}): PropertyDecorator =>
    (target, propKey) => {
      const newProp = '@@guidIsPermaLink';
      Object.assign(target, {[newProp]: isPermaLink});
      tags({xml: 'guid.#'})(target, propKey);
      tags({xml: 'guid.@isPermaLink'})(target, newProp);
    },
  pubDate: tags({xml: 'pubDate'}),
  source: tags({xml: 'source'}),
};

export const cloud = {
  domain: tags({xml: '@domain'}),
  port: tags({xml: '@port'}),
  path: tags({xml: '@path'}),
  registerProcedure: tags({xml: '@registerProcedure'}),
  protocol: tags({xml: '@protocol'}),
};

export const image = {
  url: tags({xml: 'url'}),
  title: tags({xml: 'title'}),
  link: tags({xml: 'link'}),
  width: tags({xml: 'width'}),
  height: tags({xml: 'height'}),
  description: tags({xml: 'description'}),
};

export const textInput = {
  title: tags({xml: 'title'}),
  description: tags({xml: 'description'}),
  name: tags({xml: 'name'}),
  link: tags({xml: 'link'}),
};

export const enclosure = {
  url: tags({xml: 'url'}),
  length: tags({xml: 'length'}),
  type: tags({xml: 'type'}),
};

export const source = {
  name: tags({xml: '#'}),
  url: tags({xml: '@url'}),
};

export const category = {
  domain: tags({xml: '@domain'}),
  name: tags({xml: '#'}),
};
