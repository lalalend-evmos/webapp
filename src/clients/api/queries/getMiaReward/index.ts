import BigNumber from 'bignumber.js';
import { getContractAddress } from 'utilities';

import { MiaLens } from 'types/contracts_evmos';

export interface GetMiaRewardInput {
  lensContract: MiaLens;
  accountAddress: string;
}

export type GetMiaRewardOutput = {
  miaRewardWei: BigNumber;
};

const getMiaReward = async ({
  lensContract,
  accountAddress,
}: GetMiaRewardInput): Promise<GetMiaRewardOutput> => {
  const res = await lensContract.methods
    .pendingMia(accountAddress, getContractAddress('comptroller'))
    .call();

  return {
    miaRewardWei: new BigNumber(res),
  };
};

export default getMiaReward;
