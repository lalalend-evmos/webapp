import { NErcToken, NTokenId } from 'types';

import { NTOKENS_EVMOS } from 'constants/tokens';

export const getNErc20Token = (id: NTokenId) => NTOKENS_EVMOS[id] as NErcToken;

export default getNErc20Token;
