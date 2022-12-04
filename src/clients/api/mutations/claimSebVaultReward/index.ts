import type { TransactionReceipt } from 'web3-core/types';

import { SebVault } from 'types/contracts_evmos';

export interface ClaimSebVaultRewardInput {
  sebVaultContract: SebVault;
  fromAccountAddress: string;
}

export type ClaimSebVaultRewardOutput = TransactionReceipt;

const claimSebVaultReward = async ({
  sebVaultContract,
  fromAccountAddress,
}: ClaimSebVaultRewardInput): Promise<ClaimSebVaultRewardOutput> => {
  const resp = await sebVaultContract.methods.claim().send({ from: fromAccountAddress });
  return resp;
};

export default claimSebVaultReward;
