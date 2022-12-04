import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core';

import { NErc20 } from 'types/contracts_evmos';

export interface RedeemInput {
  tokenContract: NErc20;
  accountAddress: string;
  amountWei: BigNumber;
}

export type RedeemOutput = TransactionReceipt;

const redeem = async ({
  tokenContract,
  accountAddress,
  amountWei,
}: RedeemInput): Promise<RedeemOutput> => {
  const resp = await tokenContract.methods
    .redeem(amountWei.toFixed())
    .send({ from: accountAddress });

  return checkForTokenTransactionError(resp);
};

export default redeem;
