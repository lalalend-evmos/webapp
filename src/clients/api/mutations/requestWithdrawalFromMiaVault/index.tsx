import BigNumber from 'bignumber.js';
import { checkForMiaVaultProxyTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { MiaVault } from 'types/contracts_evmos';

export interface RequestWithdrawalFromMiaVaultInput {
  miaVaultContract: MiaVault;
  fromAccountAddress: string;
  rewardTokenAddress: string;
  poolIndex: number;
  amountWei: BigNumber;
}

export type RequestWithdrawalFromMiaVaultOutput = TransactionReceipt;

const requestWithdrawalFromMiaVault = async ({
  miaVaultContract,
  fromAccountAddress,
  rewardTokenAddress,
  poolIndex,
  amountWei,
}: RequestWithdrawalFromMiaVaultInput): Promise<RequestWithdrawalFromMiaVaultOutput> => {
  const res = await miaVaultContract.methods
    .requestWithdrawal(rewardTokenAddress, poolIndex, amountWei.toFixed())
    .send({ from: fromAccountAddress });

  return checkForMiaVaultProxyTransactionError(res);
};

export default requestWithdrawalFromMiaVault;
