import {InvalidValueError} from './errors';

export function assert(val: unknown, path: string, object: unknown): void {
  if (!val) {
    throw new InvalidValueError(path, object);
  }
}
