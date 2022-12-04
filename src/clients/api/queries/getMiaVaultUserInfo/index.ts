import formatToUserInfo from './formatToUserInfo';
import { GetMiaVaultUserInfoInput, GetMiaVaultUserInfoOutput } from './types';

export * from './types';

const getMiaVaultUserInfo = async ({
  miaVaultContract,
  rewardTokenAddress,
  poolIndex,
  accountAddress,
}: GetMiaVaultUserInfoInput): Promise<GetMiaVaultUserInfoOutput> => {
  const res = await miaVaultContract.methods
    .getUserInfo(rewardTokenAddress, poolIndex, accountAddress)
    .call();

  return formatToUserInfo(res);
};

export default getMiaVaultUserInfo;
