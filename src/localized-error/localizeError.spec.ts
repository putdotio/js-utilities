import { createMockErrorResponse } from '@putdotio/api-client';
import { LocalizedError } from './LocalizedError';
import {
  GenericErrorLocalizer,
  createLocalizeError,
  isErrorLocalizer,
} from './localizeError';

const genericErrorLocalizer: GenericErrorLocalizer = {
  kind: 'generic',
  localize: () => ({
    message: 'message',
    recoverySuggestion: {
      type: 'instruction',
      description: 'description',
    },
  }),
};

describe('localizeError', () => {
  it('should throw an error if no localizer is found', () => {
    const localizeError = createLocalizeError([]);
    expect(() => localizeError(undefined)).toThrowError();
  });

  it('should return a LocalizedError', () => {
    const localizeError = createLocalizeError([genericErrorLocalizer]);
    expect(localizeError(undefined)).toBeInstanceOf(LocalizedError);
  });

  it('shoud localize api errors by status_code', () => {
    const error = createMockErrorResponse({
      status_code: 400,
      error_type: 'test',
      error_message: 'test',
      extra: {},
    });

    const localizeError = createLocalizeError([
      genericErrorLocalizer,
      {
        kind: 'api_status_code',
        status_code: 400,
        localize: () => ({
          message: 'message',
          recoverySuggestion: {
            type: 'instruction',
            description: 'description',
          },
        }),
      },
    ]);

    expect(localizeError(error)).toBeInstanceOf(LocalizedError);
    expect(localizeError(error.data)).toBeInstanceOf(LocalizedError);

    error.data.status_code = 401;
    expect(localizeError(error)).toBeInstanceOf(LocalizedError);
    expect(localizeError(error.data)).toBeInstanceOf(LocalizedError);
  });

  it('shoud localize api errors by error_type', () => {
    const error = createMockErrorResponse({
      status_code: 400,
      error_type: 'test',
      error_message: 'test',
      extra: {},
    });

    const localizeError = createLocalizeError([
      genericErrorLocalizer,
      {
        kind: 'api_error_type',
        error_type: 'test',
        localize: () => ({
          message: 'message',
          recoverySuggestion: {
            type: 'instruction',
            description: 'description',
          },
        }),
      },
    ]);

    expect(localizeError(error)).toBeInstanceOf(LocalizedError);
    expect(localizeError(error.data)).toBeInstanceOf(LocalizedError);

    error.data.error_type = 'test_new';
    expect(localizeError(error)).toBeInstanceOf(LocalizedError);
    expect(localizeError(error.data)).toBeInstanceOf(LocalizedError);
  });

  it('shoud localize api errors by match_condition', () => {
    const error = { foo: 'bar' };

    const localizeError = createLocalizeError([
      genericErrorLocalizer,
      {
        kind: 'match_condition',
        match: (error: { foo: string }) => error.foo === 'bar',
        localize: () => ({
          message: 'message',
          recoverySuggestion: {
            type: 'instruction',
            description: 'description',
          },
        }),
      },
    ]);

    expect(localizeError(error)).toBeInstanceOf(LocalizedError);

    error.foo = 'baz';
    expect(localizeError(error)).toBeInstanceOf(LocalizedError);
  });

  it('should add meta attributes to the LocalizedError', () => {
    const error = { foo: 'baz' };
    const meta = { field: 'username' };

    const localizeError = createLocalizeError([
      genericErrorLocalizer,
      {
        kind: 'match_condition',
        match: (error: { foo: string }) => error.foo === 'baz',
        localize: () => ({
          message: 'message',
          recoverySuggestion: {
            type: 'instruction',
            description: 'description',
          },
          meta,
        }),
      },
    ]);

    expect(localizeError(error).meta).toEqual(meta);
  });

  it('should throw an error if no generic localizer is found', () => {
    const error = { foo: 'baz' };

    const localizeError = createLocalizeError([
      {
        kind: 'match_condition',
        match: (error: { foo: string }) => error.foo === 'bar',
        localize: () => ({
          message: 'message',
          recoverySuggestion: {
            type: 'instruction',
            description: 'description',
          },
        }),
      },
    ]);

    expect(() => localizeError(error)).toThrowError();
  });
});

describe('isErrorLocalizer', () => {
  it('should return true if the object is an error localizer', () => {
    expect(
      isErrorLocalizer(
        () =>
          new LocalizedError({
            message: 'message',
            recoverySuggestion: {
              type: 'instruction',
              description: 'description',
            },
            underlyingError: undefined,
          })
      )
    ).toBe(true);
  });
});
