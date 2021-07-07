import {InvalidValueError} from './errors';

export function applyMixins(derivedCtor: any, constructors: any[]): void {
  constructors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}

export function assert(val: unknown, path: string, object: unknown): void {
  if (!val) {
    throw new InvalidValueError(path, object);
  }
}
