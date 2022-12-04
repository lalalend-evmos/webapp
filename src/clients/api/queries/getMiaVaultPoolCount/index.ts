import { getToken } from 'utilities';

import { MiaVault } from 'types/contracts_evmos';

export interface GetMiaVaultPoolCountInput {
  miaVaultContract: MiaVault;
}

export type GetMiaVaultPoolCountOutput = {
  poolCount: number;
};

const getMiaVaultPoolCount = async ({
  miaVaultContract,
}: GetMiaVaultPoolCountInput): Promise<GetMiaVaultPoolCountOutput> => {
  const miaTokenAddress = getToken('mia').address;
  const miaVaultPoolLength = await miaVaultContract.methods.poolLength(miaTokenAddress).call();

  return {
    poolCount: +miaVaultPoolLength,
  };
};

export default getMiaVaultPoolCount;
