import * as objectPath from 'object-path';
import {create} from 'xmlbuilder2';
import {getTags, execPostProcessors} from './tags';

export const toString = (target: {}): string => {
  const doc = buildDoc(target);
  const postProcessedDoc = execPostProcessors(
    'xml',
    target.constructor,
    doc as {},
    target
  );
  return create(postProcessedDoc).end();
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
    const xmlTag: string | undefined = Reflect.get(tags, 'xml');

    if (!xmlTag) {
      continue;
    }

    objectPath.set(doc, xmlTag, buildDoc(Reflect.get(target!, path)));
  }

  return doc;
}
