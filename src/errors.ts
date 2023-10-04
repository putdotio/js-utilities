import ExtendableError from 'es6-error';

export class SuspenseError extends ExtendableError {
  constructor() {
    super('A suspense error occurred within a React component.');
  }
}
