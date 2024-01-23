import {
  type IPutioAPIClientError,
  isPutioAPIError,
  isPutioAPIErrorResponse,
  createMockErrorResponse,
} from '@putdotio/api-client';
import { LocalizedError, type LocalizedErrorParams } from './LocalizedError';

export type LocalizeFn<E> = (
  error: E
) => Pick<LocalizedErrorParams, 'message' | 'recoverySuggestion' | 'meta'>;

export type APIErrorByStatusCodeLocalizer = {
  kind: 'api_status_code';
  status_code: number;
  localize: LocalizeFn<IPutioAPIClientError>;
};

export type APIErrorByErrorTypeLocalizer = {
  kind: 'api_error_type';
  error_type: string;
  localize: LocalizeFn<IPutioAPIClientError>;
};

export type MatchConditionLocalizer<E> = {
  kind: 'match_condition';
  match: (error: E) => boolean;
  localize: LocalizeFn<E>;
};

export type GenericErrorLocalizer = {
  kind: 'generic';
  localize: LocalizeFn<unknown>;
};

type Localizer<E> =
  | APIErrorByStatusCodeLocalizer
  | APIErrorByErrorTypeLocalizer
  | MatchConditionLocalizer<E>
  | GenericErrorLocalizer;

export type ErrorLocalizer = (error: unknown) => LocalizedError;

export const isErrorLocalizer = (fn: unknown): fn is ErrorLocalizer => {
  return (
    typeof fn === 'function' && fn(new Error('test')) instanceof LocalizedError
  );
};

export const createLocalizeError =
  <GlobalError extends unknown>(globalLocalizers: Localizer<GlobalError>[]) =>
  <ScopedError extends GlobalError>(
    error: ScopedError,
    scopedLocalizers: Localizer<ScopedError>[] = []
  ): LocalizedError => {
    const localizers = [...scopedLocalizers, ...globalLocalizers];

    if (isPutioAPIError(error) || isPutioAPIErrorResponse(error)) {
      const apiError = isPutioAPIErrorResponse(error)
        ? createMockErrorResponse(error)
        : error;

      const byErrorType = localizers.find(
        (l): l is APIErrorByErrorTypeLocalizer => {
          if (l.kind === 'api_error_type') {
            return l.error_type === apiError.data.error_type;
          }

          return false;
        }
      );

      if (byErrorType) {
        return new LocalizedError({
          underlyingError: apiError,
          ...byErrorType.localize(apiError),
        });
      }

      const byStatusCode = localizers.find(
        (l): l is APIErrorByStatusCodeLocalizer => {
          if (l.kind === 'api_status_code') {
            return l.status_code === apiError.data.status_code;
          }

          return false;
        }
      );

      if (byStatusCode) {
        const apiError = isPutioAPIErrorResponse(error)
          ? createMockErrorResponse(error)
          : error;

        return new LocalizedError({
          underlyingError: apiError,
          ...byStatusCode.localize(apiError),
        });
      }
    }

    const matchConditionLocalizer = localizers.find(
      (l): l is MatchConditionLocalizer<ScopedError> => {
        if (l.kind === 'match_condition') {
          return l.match(error);
        }

        return false;
      }
    );

    if (matchConditionLocalizer) {
      return new LocalizedError({
        underlyingError: error,
        ...matchConditionLocalizer.localize(error),
      });
    }

    const genericLocalizer = localizers.find(
      (l): l is GenericErrorLocalizer => {
        if (l.kind === 'generic') {
          return true;
        }

        return false;
      }
    );

    if (genericLocalizer) {
      return new LocalizedError({
        underlyingError: error,
        ...genericLocalizer.localize(error),
      });
    }

    throw new Error(`No localizer found for error: ${error}`);
  };
