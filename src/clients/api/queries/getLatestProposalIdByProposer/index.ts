import { GovernorBravoDelegate } from 'types/contracts_evmos';

export interface GetLatestProposalIdByProposerInput {
  governorBravoContract: GovernorBravoDelegate;
  accountAddress: string;
}

export type GetLatestProposalIdByProposerOutput = {
  proposalId: string;
};

const getLatestProposalIdByProposer = async ({
  governorBravoContract,
  accountAddress,
}: GetLatestProposalIdByProposerInput): Promise<GetLatestProposalIdByProposerOutput> => {
  const res = await governorBravoContract.methods.latestProposalIds(accountAddress).call();

  return {
    proposalId: res,
  };
};

export default getLatestProposalIdByProposer;
