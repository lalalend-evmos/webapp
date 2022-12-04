import type { TransactionReceipt } from 'web3-core';

import { GovernorBravoDelegate } from 'types/contracts_evmos';

export interface ExecuteProposalInput {
  governorBravoContract: GovernorBravoDelegate;
  accountAddress: string;
  proposalId: number;
}

export type ExecuteProposalOutput = TransactionReceipt;

const executeProposal = async ({
  governorBravoContract,
  accountAddress,
  proposalId,
}: ExecuteProposalInput): Promise<ExecuteProposalOutput> =>
  governorBravoContract.methods.execute(proposalId).send({ from: accountAddress });

export default executeProposal;
