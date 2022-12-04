import { Token } from 'types';

import { TOKENS_EVMOS } from 'constants/tokens';

const getTokenByAddress = (address: string) => {
  let token: Token | undefined;

  Object.keys(TOKENS_EVMOS)
    .filter(key => Object.prototype.hasOwnProperty.call(TOKENS_EVMOS, key))
    .forEach(tokenId => {
      const currentToken = TOKENS_EVMOS[tokenId as keyof typeof TOKENS_EVMOS];
      if (currentToken?.address === address) {
        token = currentToken as Token;
      }
    });

  return token;
};

export default getTokenByAddress;
