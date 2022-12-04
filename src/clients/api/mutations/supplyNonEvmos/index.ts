import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core';

import { NErc20 } from 'types/contracts_evmos';

export interface SupplyNonEvmosInput {
  tokenContract: NErc20;
  account: string;
  amountWei: BigNumber;
}

export type SupplyNonEvmosOutput = TransactionReceipt;

const supplyNonEvmos = async ({
  tokenContract,
  account,
  amountWei,
}: SupplyNonEvmosInput): Promise<SupplyNonEvmosOutput> => {
  const resp = await tokenContract.methods.mint(amountWei.toFixed()).send({ from: account, gasLimit: 3000000 });
  return checkForTokenTransactionError(resp);
};

export default supplyNonEvmos;
