import formatToPoolInfo from './formatToPoolInfo';
import { GetMiaVaultPoolInfoInput, GetMiaVaultPoolInfoOutput } from './types';

export * from './types';

const getMiaVaultPoolInfo = async ({
  miaVaultContract,
  rewardTokenAddress,
  poolIndex,
}: GetMiaVaultPoolInfoInput): Promise<GetMiaVaultPoolInfoOutput> => {
  const res = await miaVaultContract.methods.poolInfos(rewardTokenAddress, poolIndex).call();
  return formatToPoolInfo(res);
};

export default getMiaVaultPoolInfo;
