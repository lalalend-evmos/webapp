import { LockedDeposit } from 'types';

import { MiaVault } from 'types/contracts_evmos';

export interface GetMiaVaultLockedDepositsInput {
  miaVaultContract: MiaVault;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export type GetMiaVaultLockedDepositsOutput = {
  lockedDeposits: LockedDeposit[];
};
