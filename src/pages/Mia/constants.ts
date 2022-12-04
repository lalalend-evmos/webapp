import BigNumber from 'bignumber.js';
import { getToken } from 'utilities';

export const MIA_DECIMALS = getToken('mia').decimals;
export const MINTED_MIA = '23700000';
export const MINTED_MIA_WEI = new BigNumber(MINTED_MIA).times(new BigNumber(10).pow(MIA_DECIMALS));
