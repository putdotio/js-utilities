import {
  type IPutioAPIClientError,
  isPutioAPIError,
  isPutioAPIErrorResponse,
  createMockErrorResponse,
} from '@putdotio/api-client';
import { LocalizedError, type LocalizedErrorParams } from './LocalizedError';

export type LocalizeErrorFn<E> = (
  error: E
) => Pick<LocalizedErrorParams, 'message' | 'recoverySuggestion' | 'meta'>;

export type APIErrorByStatusCodeLocalizer = {
  kind: 'api_status_code';
  status_code: number;
  localize: LocalizeErrorFn<IPutioAPIClientError>;
};

export type APIErrorByErrorTypeLocalizer = {
  kind: 'api_error_type';
  error_type: string;
  localize: LocalizeErrorFn<IPutioAPIClientError>;
};

export type MatchConditionLocalizer<E> = {
  kind: 'match_condition';
  match: (error: E) => boolean;
  localize: LocalizeErrorFn<E>;
};

export type GenericErrorLocalizer = {
  kind: 'generic';
  localize: LocalizeErrorFn<unknown>;
};

export type ErrorLocalizer<E> =
  | APIErrorByStatusCodeLocalizer
  | APIErrorByErrorTypeLocalizer
  | MatchConditionLocalizer<E>
  | GenericErrorLocalizer;

export type ErrorLocalizerFn = (error: unknown) => LocalizedError;

export const isErrorLocalizer = (fn: unknown): fn is ErrorLocalizerFn => {
  return (
    typeof fn === 'function' && fn(new Error('test')) instanceof LocalizedError
  );
};

export const createLocalizeError =
  <GlobalError extends unknown>(
    globalLocalizers: ErrorLocalizer<GlobalError>[]
  ) =>
  <ScopedError extends GlobalError>(
    error: ScopedError,
    scopedLocalizers: ErrorLocalizer<ScopedError>[] = []
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
