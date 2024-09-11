import ExtendableError from 'es6-error';

export type LocalizedErrorRecoverySuggestionTypeInstruction = {
  type: 'instruction';
  description: string;
};

export type LocalizedErrorRecoverySuggestionTypeAction = {
  type: 'action';
  description: string;
  trigger: {
    label: string;
    callback: () => void;
  };
};

export type LocalizedErrorRecoverySuggestionTypeCaptcha = {
  type: 'captcha';
  description: string;
};

export type LocalizedErrorRecoverySuggestion =
  | LocalizedErrorRecoverySuggestionTypeInstruction
  | LocalizedErrorRecoverySuggestionTypeAction
  | LocalizedErrorRecoverySuggestionTypeCaptcha;

export type LocalizedErrorParams = {
  message: string;
  recoverySuggestion: LocalizedErrorRecoverySuggestion;
  underlyingError: unknown;
  meta?: Record<string, unknown>;
};

export class LocalizedError extends ExtendableError {
  message: string;

  recoverySuggestion: LocalizedErrorRecoverySuggestion;

  underlyingError: unknown;

  meta: Record<string, unknown>;

  constructor(params: LocalizedErrorParams) {
    super(params.message);
    this.message = params.message;
    this.recoverySuggestion = params.recoverySuggestion;
    this.underlyingError = params.underlyingError;
    this.meta = params.meta || {};
  }
}
