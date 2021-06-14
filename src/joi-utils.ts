import * as Joi from 'joi';
import iso3166 from 'iso-3166-1';
import iso639 from 'iso-639-1';
import * as mimeTypeDb from 'mime-db';

export const language = Joi.string().custom((value: string, helpers) => {
  const [lang, region] = value.split('-');

  if (!iso639.getName(lang)) {
    return helpers.error('any.invalid');
  }

  if (region && !iso3166.whereAlpha2(region)) {
    return helpers.error('any.invalid');
  }

  return value;
});

export const mimeType = Joi.string().custom((value: string, helpers) => {
  if (typeof value === 'string' && !mimeTypeDb[value]) {
    return helpers.error('any.invalid');
  }

  return value;
});
