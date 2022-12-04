import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core';

import { NErc20, NEvmosToken } from 'types/contracts_evmos';

export interface RedeemUnderlyingInput {
  nTokenContract: NErc20 | NEvmosToken;
  accountAddress: string;
  amountWei: BigNumber;
}

export type RedeemUnderlyingOutput = TransactionReceipt;

const redeemUnderlying = async ({
  nTokenContract,
  accountAddress,
  amountWei,
}: RedeemUnderlyingInput): Promise<RedeemUnderlyingOutput> => {
  const resp = await nTokenContract.methods
    .redeemUnderlying(amountWei.toFixed())
    .send({ from: accountAddress });

  return checkForTokenTransactionError(resp);
};

export default redeemUnderlying;
