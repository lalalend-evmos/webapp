import { interactionErrorPhrases } from './interactionErrorPhrases';
import { transactionErrorPhrases } from './transactionErrorPhrases';
import { unexpectedErrorPhrases } from './unexpectedErrorPhrases';

export interface NErrorParamMap {
  transaction: {
    error: keyof typeof transactionErrorPhrases;
    info: keyof typeof transactionErrorPhrases;
  };
  unexpected: { message: string } | undefined;
  interaction: { assetName: string };
}

export interface NErrorPhraseMap {
  transaction: keyof typeof transactionErrorPhrases;
  unexpected: keyof typeof unexpectedErrorPhrases;
  interaction: keyof typeof interactionErrorPhrases;
}

export type ErrorCodes = keyof NErrorParamMap;

export class NError<E extends ErrorCodes> extends Error {
  data: NErrorParamMap[E] | undefined;

  type: E;

  code: NErrorPhraseMap[E];

  constructor({
    type,
    code,
    data,
  }: {
    type: E;
    code: NErrorPhraseMap[E];
    data?: NErrorParamMap[E];
  }) {
    super(code);
    this.type = type;
    this.code = code;
    this.data = data;
  }
}
