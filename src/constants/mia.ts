import { getToken } from 'utilities';

export const MIA_TOKEN_ID = 'mia';
export const MIA_TOKEN_ADDRESS = getToken(MIA_TOKEN_ID).address;
export const MIA_DECIMAL = getToken(MIA_TOKEN_ID).decimals;
