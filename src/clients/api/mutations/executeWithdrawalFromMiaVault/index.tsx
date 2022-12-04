import { checkForMiaVaultProxyTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { MiaVault } from 'types/contracts_evmos';

export interface ExecuteWithdrawalFromMiaVaultInput {
  miaVaultContract: MiaVault;
  fromAccountAddress: string;
  rewardTokenAddress: string;
  poolIndex: number;
}

export type ExecuteWithdrawalFromMiaVaultOutput = TransactionReceipt;

const executeWithdrawalFromMiaVault = async ({
  miaVaultContract,
  fromAccountAddress,
  rewardTokenAddress,
  poolIndex,
}: ExecuteWithdrawalFromMiaVaultInput): Promise<ExecuteWithdrawalFromMiaVaultOutput> => {
  const res = await miaVaultContract.methods
    .executeWithdrawal(rewardTokenAddress, poolIndex)
    .send({ from: fromAccountAddress });

  return checkForMiaVaultProxyTransactionError(res);
};

export default executeWithdrawalFromMiaVault;
