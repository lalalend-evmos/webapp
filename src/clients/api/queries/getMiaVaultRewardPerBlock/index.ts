import BigNumber from 'bignumber.js';

import { MiaVault } from 'types/contracts_evmos';

export interface GetMiaVaultRewardPerBlockInput {
  miaVaultContract: MiaVault;
  tokenAddress: string;
}

export type GetMiaVaultRewardPerBlockOutput = {
  rewardPerBlockWei: BigNumber;
};

const getMiaVaultRewardPerBlock = async ({
  miaVaultContract,
  tokenAddress,
}: GetMiaVaultRewardPerBlockInput): Promise<GetMiaVaultRewardPerBlockOutput> => {
  const res = await miaVaultContract.methods.rewardTokenAmountsPerBlock(tokenAddress).call();

  return {
    rewardPerBlockWei: new BigNumber(res),
  };
};

export default getMiaVaultRewardPerBlock;
