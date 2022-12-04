import BigNumber from 'bignumber.js';
import { checkForSebVaultTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { SebVault } from 'types/contracts_evmos';

export interface WithdrawFromSebVaultInput {
  sebVaultContract: SebVault;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type WithdrawFromSebVaultOutput = TransactionReceipt;

const withdrawFromSebVault = async ({
  sebVaultContract,
  fromAccountAddress,
  amountWei,
}: WithdrawFromSebVaultInput): Promise<WithdrawFromSebVaultOutput> => {
  const res = await sebVaultContract.methods
    .withdraw(amountWei.toFixed())
    .send({ from: fromAccountAddress });

  return checkForSebVaultTransactionError(res);
};

export default withdrawFromSebVault;
