import * as objectPath from 'object-path';
import {getTags, execPostProcessors} from './tags';

export const toString = (target: {}): string => {
  const doc = buildDoc(target);
  const postProcessedDoc = execPostProcessors(
    'json',
    target.constructor,
    doc as {},
    target
  );
  return JSON.stringify(postProcessedDoc);
};

function buildDoc(target: unknown): unknown {
  if (!target) {
    return target;
  }

  if (Array.isArray(target)) {
    return target.map(buildDoc);
  }

  if (typeof target !== 'object' || target instanceof Date) {
    return target;
  }

  const list = getTags(target as {});
  const doc: {[k: string]: unknown} = {};

  for (const {path, tags} of list) {
    const jsonTag: string | undefined = Reflect.get(tags, 'json');

    if (!jsonTag) {
      continue;
    }

    objectPath.set(doc, jsonTag, buildDoc(Reflect.get(target!, path)));
  }

  return doc;
}
