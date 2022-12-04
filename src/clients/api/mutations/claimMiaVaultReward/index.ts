import { checkForMiaVaultProxyTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { MiaVault } from 'types/contracts_evmos';

export interface ClaimMiaVaultRewardInput {
  miaVaultContract: MiaVault;
  fromAccountAddress: string;
  rewardTokenAddress: string;
  poolIndex: number;
}

export type ClaimMiaVaultRewardOutput = TransactionReceipt;

const claimMiaVaultReward = async ({
  miaVaultContract,
  fromAccountAddress,
  rewardTokenAddress,
  poolIndex,
}: ClaimMiaVaultRewardInput): Promise<ClaimMiaVaultRewardOutput> => {
  const resp = await miaVaultContract.methods
    .deposit(rewardTokenAddress, poolIndex, 0)
    .send({ from: fromAccountAddress });
  return checkForMiaVaultProxyTransactionError(resp);
};

export default claimMiaVaultReward;
