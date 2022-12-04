import BigNumber from 'bignumber.js';

import { MiaVault } from 'types/contracts_evmos';

export interface GetMiaVaultPendingRewardInput {
  miaVaultContract: MiaVault;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export type GetMiaVaultPendingRewardOutput = {
  pendingMiaReward: BigNumber;
};

const getMiaVaultPendingReward = async ({
  miaVaultContract,
  rewardTokenAddress,
  poolIndex,
  accountAddress,
}: GetMiaVaultPendingRewardInput): Promise<GetMiaVaultPendingRewardOutput> => {
  const res = await miaVaultContract.methods
    .pendingReward(rewardTokenAddress, poolIndex, accountAddress)
    .call();

  return {
    pendingMiaReward: new BigNumber(res),
  };
};

export default getMiaVaultPendingReward;
