import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import { NTokenId } from 'types';
import type { TransactionReceipt } from 'web3-core/types';

import { NTokenContract } from 'clients/contracts/types'; 

export interface BorrowNTokenInput {
  nTokenContract: NTokenContract<NTokenId>;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type BorrowNTokenOutput = TransactionReceipt;

const borrowNToken = async ({
  nTokenContract,
  fromAccountAddress,
  amountWei,
}: BorrowNTokenInput): Promise<BorrowNTokenOutput> => {
  const resp = await nTokenContract.methods
    .borrow(amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForTokenTransactionError(resp);
};

export default borrowNToken;
