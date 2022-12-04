import BigNumber from 'bignumber.js';

import { SebVault } from 'types/contracts_evmos';

export interface GetSebVaultUserInfoInput {
  sebVaultContract: SebVault;
  accountAddress: string;
}

export interface GetSebVaultUserInfoOutput {
  stakedSebWei: BigNumber;
}
