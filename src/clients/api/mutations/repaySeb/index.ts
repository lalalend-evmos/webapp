import { checkForSebControllerTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core';

import { SebUnitroller } from 'types/contracts_evmos';

export interface RepaySebInput {
  sebControllerContract: SebUnitroller;
  fromAccountAddress: string;
  amountWei: string;
}

export type IRepaySebOutput = TransactionReceipt;

const repaySeb = async ({
  sebControllerContract,
  fromAccountAddress,
  amountWei,
}: RepaySebInput): Promise<IRepaySebOutput> => {
  const resp = await sebControllerContract.methods
    .repaySEB(amountWei) 
    .send({ from: fromAccountAddress });
  return checkForSebControllerTransactionError(resp);
};

export default repaySeb;
