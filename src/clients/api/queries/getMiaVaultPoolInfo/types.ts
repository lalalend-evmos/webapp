import BigNumber from 'bignumber.js';

import { MiaVault } from 'types/contracts_evmos';

export interface GetMiaVaultPoolInfoInput {
  miaVaultContract: MiaVault;
  rewardTokenAddress: string;
  poolIndex: number;
}

export interface GetMiaVaultPoolInfoOutput {
  stakedTokenAddress: string;
  allocationPoint: number;
  lastRewardBlock: number;
  accRewardPerShare: BigNumber;
  lockingPeriodMs: number;
}
