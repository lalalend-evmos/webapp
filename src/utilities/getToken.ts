import { Token, TokenId } from 'types';

import { TOKENS_EVMOS } from 'constants/tokens';

export const getToken = (id: TokenId) => TOKENS_EVMOS[id] as Token;

export default getToken;
