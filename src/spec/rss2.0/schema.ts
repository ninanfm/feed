import * as Joi from 'joi';
import rfc822Date from 'rfc822-date';
import {language, mimeType} from '../../joi-utils';

const url = Joi.string().uri({scheme: ['http', 'https']});

const weekday = Joi.string().custom((value: string, helpers) => {
  const weekday = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];
  value = value.toLowerCase();
  if (!weekday.some(item => item === value)) {
    return helpers.error('any.invalid');
  }
  return value[0].toUpperCase() + value.substr(1);
});

const category = Joi.alternatives().try(
  Joi.string(),
  Joi.object({
    '@domain': Joi.string(),
    '#': Joi.string().required(),
  })
);

const date = Joi.custom((value, helpers) => {
  const date = new Date(value);

  if (String(date) === 'Invalid Date') {
    return helpers.error('any.invalid');
  }

  return rfc822Date(date);
});

const item = Joi.object({
  title: Joi.string().custom(value => ({$: value})),
  link: url,
  description: Joi.string().custom(value => ({
    $: value,
  })),
  author: Joi.string().custom(value => ({$: value})),
  category: Joi.array().items(category),
  comments: url,
  enclosure: Joi.object({
    url: url.required(),
    length: Joi.number().required(),
    type: mimeType,
  }),
  guid: Joi.object({
    '#': Joi.string().required(),
    '@isPermaLink': Joi.bool().default(false),
  }),
  pubDate: date,
  source: Joi.object({
    '@url': url.required(),
    '#': Joi.string().required(),
  }),
});

const channel = Joi.object({
  title: Joi.string()
    .required()
    .custom(value => ({$: value})),
  link: url.required(),
  description: Joi.string()
    .required()
    .custom(value => ({$: value})),
  language,
  copyright: Joi.string().custom(value => ({$: value})),
  managingEditor: Joi.string()
    .email()
    .custom(value => ({$: value})),
  webMaster: Joi.string()
    .email()
    .custom(value => ({$: value})),
  pubDate: date,
  lastBuildDate: date,
  category: Joi.array().items(category),
  generator: Joi.string().custom(value => ({$: value})),
  docs: url,
  cloud: Joi.object({
    '@domain': Joi.string().domain().required(),
    '@port': Joi.number().required(),
    '@path': Joi.string().required(),
    '@registerProcedure': Joi.string().required(),
    '@protocol': Joi.string().required(),
  }),
  ttl: Joi.number(),
  image: Joi.object({
    url: url.required(),
    title: Joi.string().required(),
    link: Joi.string().required(),
    width: Joi.number(),
    height: Joi.number(),
    description: Joi.string(),
  }),
  textInput: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    name: Joi.string().required(),
    link: url.required(),
  }),
  skipHours: Joi.array()
    .items(Joi.number().integer().min(0).max(23))
    .custom(value => {
      return {hour: value};
    }),
  skipDays: Joi.array()
    .items(Joi.array().items(weekday))
    .custom(value => {
      return {day: value};
    }),
  item: Joi.array().items(item),
}).required();

const rss = Joi.object({
  '@version': Joi.string().default('2.0'),
  channel: channel.required(),
});

export const schema = Joi.object({rss: rss.required()});
