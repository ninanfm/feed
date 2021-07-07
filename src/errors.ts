export abstract class FeedError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, FeedError.prototype);
  }
}

export class InvalidValueError extends FeedError {
  constructor(readonly path: string, readonly object: unknown) {
    super(`Found invalid value for \`${path}\``);
    Object.setPrototypeOf(this, InvalidValueError.prototype);
  }
}
