import { TokenId } from 'types';

import nerc20Tokens from 'constants/contracts/addresses/ntokens_on_evmos.json';

const getTokenIdFromNAddress = (address: string) => {
  const token = Object.entries<{ [key: string]: string }>(nerc20Tokens).find(
    ([, value]) =>
      value[process.env.REACT_APP_CHAIN_ID || '9000'].toString() === address.toString(),
  );
  if (token) {
    return token[0] as TokenId;
  }
};

export default getTokenIdFromNAddress;
