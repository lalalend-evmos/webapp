import BigNumber from 'bignumber.js';
import { TokenId, TransactionCategory, TransactionEvent } from 'types';
import { convertTokensToWei, getTokenIdFromNAddress } from 'utilities';

import { MIA_TOKEN_ID } from 'constants/mia';

import { TransactionResponse } from './types';

const formatTransaction = ({
  amount,
  createdAt,
  updatedAt,
  category,
  event,
  nTokenAddress,
  ...rest
}: TransactionResponse) => {
  const tokenId = nTokenAddress ? (getTokenIdFromNAddress(nTokenAddress) as TokenId) : MIA_TOKEN_ID;
  console.log('token Id : '+ tokenId);
  return {
    ...rest,
    amountWei: convertTokensToWei({ value: new BigNumber(amount), tokenId }),
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    category: category as TransactionCategory,
    event: event as TransactionEvent,
    nTokenAddress,
  };
};
export default formatTransaction;
