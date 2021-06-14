import * as Joi from 'joi';

const META_VALUE = 'tags:value';
const META_POST_PROCESSOR = 'tags:postProcessor';

interface PostProcessor<T extends {} = any> {
  fn: (doc: {}, target: T) => {};
  type: string;
}

export interface Tags {
  [k: string]: unknown;
}

export const spec =
  (schema: Joi.Schema, type: string): ClassDecorator =>
  target => {
    postProcessor(doc => {
      const {value: convertedDoc, error} = schema.validate(doc, {
        allowUnknown: true,
      });
      if (error) {
        throw error;
      }
      return convertedDoc;
    }, type)(target);
  };

export const postProcessor =
  (postProcessor: PostProcessor['fn'], type: string): ClassDecorator =>
  target => {
    const postProcessors: PostProcessor[] =
      Reflect.getMetadata(META_POST_PROCESSOR, target) || [];
    postProcessors.push({fn: postProcessor, type});
    Reflect.defineMetadata(META_POST_PROCESSOR, postProcessors, target);
  };

export const tags =
  (newTags: Tags): PropertyDecorator =>
  (target, propKey) => {
    if (typeof propKey === 'symbol') {
      throw new Error('`tags` dosen\t support symbol');
    }

    const value: [string, Tags][] =
      Reflect.getMetadata(META_VALUE, target.constructor) ?? [];

    value.push([propKey, newTags]);

    Reflect.defineMetadata(META_VALUE, value, target.constructor);
  };

export const getTags = (target: {}): {path: string; tags: Tags}[] => {
  const value: [string, Tags][] =
    Reflect.getMetadata(META_VALUE, target.constructor) || [];

  return value.map(([path, tags]) => ({path, tags}));
};

export const execPostProcessors = (
  type: string,
  FeedType: {},
  doc: {},
  target: {}
): {} => {
  const postProcessors: PostProcessor[] =
    Reflect.getMetadata(META_POST_PROCESSOR, FeedType) || [];
  return postProcessors
    .filter(processor => processor.type === type)
    .reduce((doc, processor) => processor.fn(doc, target), doc);
};
