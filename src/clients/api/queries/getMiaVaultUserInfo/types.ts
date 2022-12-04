import BigNumber from 'bignumber.js';

import { MiaVault } from 'types/contracts_evmos';

export interface GetMiaVaultUserInfoInput {
  miaVaultContract: MiaVault;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export interface GetMiaVaultUserInfoOutput {
  stakedAmountWei: BigNumber;
  pendingWithdrawalsTotalAmountWei: BigNumber;
  rewardDebtAmountWei: BigNumber;
}
