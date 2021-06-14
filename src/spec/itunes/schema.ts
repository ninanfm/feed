import * as Joi from 'joi';
import {language} from '../../joi-utils';

const url = Joi.string().uri({scheme: ['http', 'https']});

const image = url.custom(value => ({'@href': value}));

const category = Joi.alternatives()
  .try(
    Joi.string().custom(value => ({'@text': value})),
    Joi.object({
      text: Joi.string()
        .required()
        .custom(value => ({'@text': value})),
      'itunes:category': Joi.array().items(Joi.link('#itunes:category')),
    })
  )
  .id('itunes:category');

const item = Joi.object({
  'itunes:duration': Joi.number(),
  'itunes:image': image,
  'itunes:explicit': Joi.bool(),
  'itunes:episode': Joi.number().integer().min(1),
  'itunes:season': Joi.number().integer().min(1),
  'itunes:episodeType': Joi.string().valid('Full', 'Trailer', 'Bonus'),
  'itunes:block': Joi.bool().custom(value => (value ? 'Yes' : 'No')),
});

const channel = Joi.object({
  'itunes:image': image.required(),
  language: language.required(),
  'itunes:category': Joi.array().items(category),
  'itunes:explicit': Joi.bool().default(false),
  'itunes:author': Joi.string().custom(value => ({$: value})),
  'itunes:owner': Joi.object({
    'itunes:email': Joi.string()
      .email()
      .required()
      .custom(value => ({$: value})),
    'itunes:name': Joi.string()
      .required()
      .custom(value => ({$: value})),
  }),
  'itunes:type': Joi.string().valid('Episodic', 'Serial'),
  'itunes:new-feed-url': url,
  'itunes:block': Joi.bool().custom(value => (value ? 'Yes' : 'No')),
  'itunes:complete': Joi.bool().custom(value => (value ? 'Yes' : 'No')),
  item: Joi.array().items(item),
});

const rss = Joi.object({
  channel: channel.required(),
});

export const schema = Joi.object({rss: rss.required()});
