import {
  type IPutioAPIClientError,
  type IPutioAPIClientErrorData,
  isPutioAPIError,
  isPutioAPIErrorResponse,
} from '@putdotio/api-client';
import { LocalizedError, type LocalizedErrorParams } from './LocalizedError';

export type LocalizeFn<E> = (
  error: E
) => Pick<LocalizedErrorParams, 'message' | 'recoverySuggestion' | 'meta'>;

export type APIErrorByStatusCodeLocalizer = {
  kind: 'api_status_code';
  status_code: number;
  localize: LocalizeFn<IPutioAPIClientError | IPutioAPIClientErrorData>;
};

export type APIErrorByErrorTypeLocalizer = {
  kind: 'api_error_type';
  error_type: string;
  localize: LocalizeFn<IPutioAPIClientError | IPutioAPIClientErrorData>;
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

    // API ERROR
    if (isPutioAPIError(error) || isPutioAPIErrorResponse(error)) {
      const byErrorType = localizers.find(
        (l): l is APIErrorByErrorTypeLocalizer => {
          if (l.kind === 'api_error_type') {
            if (isPutioAPIErrorResponse(error)) {
              return l.error_type === error.error_type;
            }

            return l.error_type === error.data.error_type;
          }

          return false;
        }
      );

      if (byErrorType) {
        return new LocalizedError({
          ...byErrorType.localize(error),
          underlyingError: error,
        });
      }

      const byStatusCode = localizers.find(
        (l): l is APIErrorByStatusCodeLocalizer => {
          if (l.kind === 'api_status_code') {
            if (isPutioAPIErrorResponse(error)) {
              return l.status_code === error.status_code;
            }

            return l.status_code === error.data.status_code;
          }

          return false;
        }
      );

      if (byStatusCode) {
        return new LocalizedError({
          ...byStatusCode.localize(error),
          underlyingError: error,
        });
      }
    }

    // MATCH CONDITION
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
        ...matchConditionLocalizer.localize(error),
        underlyingError: error,
      });
    }

    // GENERIC
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
        ...genericLocalizer.localize(error),
        underlyingError: error,
      });
    }

    throw new Error(`No localizer found for error: ${error}`);
  };
