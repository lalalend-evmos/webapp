import { interactionErrorPhrases } from 'errors/interactionErrorPhrases';
import { transactionErrorPhrases } from 'errors/transactionErrorPhrases';
import { unexpectedErrorPhrases } from 'errors/unexpectedErrorPhrases';

import { ErrorCodes, NError, NErrorParamMap, NErrorPhraseMap } from './NError';

export const formatNErrorToReadableString = (error: NError<ErrorCodes>) => {
  let phrase = unexpectedErrorPhrases.somethingWentWrong;
  if (error.type === 'transaction') {
    const message = transactionErrorPhrases[error.message as NErrorPhraseMap['transaction']];
    const info = transactionErrorPhrases[(error.data as NErrorParamMap['transaction']).info];
    phrase = `${message} - ${info}`;
  } else if (error.type === 'unexpected') {
    phrase = unexpectedErrorPhrases[error.message as NErrorPhraseMap['unexpected']];
  } else if (error.type === 'interaction') {
    const translationPhrase = interactionErrorPhrases[error.code as NErrorPhraseMap['interaction']];
    if (typeof translationPhrase === 'function') {
      if (error.data) {
        phrase = translationPhrase(error.data as NErrorParamMap['interaction']);
      }
    } else {
      phrase = translationPhrase;
    }
  }
  return phrase || unexpectedErrorPhrases.somethingWentWrong;
};
