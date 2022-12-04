import BigNumber from 'bignumber.js';
import { checkForSebVaultTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { SebVault } from 'types/contracts_evmos';

export interface StakeInSebVaultInput {
  sebVaultContract: SebVault;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type StakeInSebVaultOutput = TransactionReceipt;

const stakeInSebVault = async ({
  sebVaultContract,
  fromAccountAddress,
  amountWei,
}: StakeInSebVaultInput): Promise<StakeInSebVaultOutput> => {
  const resp = await sebVaultContract.methods
    .deposit(amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForSebVaultTransactionError(resp);
};

export default stakeInSebVault;
