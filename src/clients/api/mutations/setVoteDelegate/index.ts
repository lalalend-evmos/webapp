import type { TransactionReceipt } from 'web3-core';

import { MiaVault } from 'types/contracts_evmos';

export interface SetVoteDelegateInput {
  miaVaultContract: MiaVault;
  accountAddress: string;
  delegateAddress: string;
}

export type SetVoteDelegateOutput = TransactionReceipt;

const setVoteDelegate = async ({
  miaVaultContract,
  accountAddress,
  delegateAddress,
}: SetVoteDelegateInput) =>
  miaVaultContract.methods.delegate(delegateAddress).send({ from: accountAddress });

export default setVoteDelegate;
