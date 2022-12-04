import BigNumber from 'bignumber.js';
import { checkForMiaVaultProxyTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { MiaVault } from 'types/contracts_evmos';

export interface StakeInMiaVaultInput {
  miaVaultContract: MiaVault;
  fromAccountAddress: string;
  rewardTokenAddress: string;
  amountWei: BigNumber;
  poolIndex: number;
}

export type StakeInMiaVaultOutput = TransactionReceipt;

const stakeInMiaVault = async ({
  miaVaultContract,
  fromAccountAddress,
  rewardTokenAddress,
  amountWei,
  poolIndex,
}: StakeInMiaVaultInput): Promise<StakeInMiaVaultOutput> => {
  const resp = await miaVaultContract.methods
    .deposit(rewardTokenAddress, poolIndex, amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForMiaVaultProxyTransactionError(resp);
};

export default stakeInMiaVault;
