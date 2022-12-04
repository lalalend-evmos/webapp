import BigNumber from 'bignumber.js';
import { checkForSebControllerTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core';

import { SebUnitroller } from 'types/contracts_evmos';

export interface MintSebInput {
  sebControllerContract: SebUnitroller;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type MintSebOutput = TransactionReceipt;

const mintSeb = async ({
  sebControllerContract,
  fromAccountAddress,
  amountWei,
}: MintSebInput): Promise<MintSebOutput> => {
  const resp = await sebControllerContract.methods
    .mintSEB(amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForSebControllerTransactionError(resp);
}; 

export default mintSeb;
