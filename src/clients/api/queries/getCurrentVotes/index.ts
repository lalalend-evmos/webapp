import BigNumber from 'bignumber.js';

//import { MiaVault } from 'types/contracts';
import { MiaVault } from 'types/contracts_evmos';

export interface GetCurrentVotesInput {
  miaVaultContract: MiaVault;
  accountAddress: string;
}

export type GetCurrentVotesOutput = {
  votesWei: BigNumber;
};

const getCurrentVotes = async ({
  miaVaultContract,
  accountAddress,
}: GetCurrentVotesInput): Promise<GetCurrentVotesOutput> => {
  const resp = await miaVaultContract.methods.getCurrentVotes(accountAddress).call();

  return {
    votesWei: new BigNumber(resp),
  };
};

export default getCurrentVotes;
