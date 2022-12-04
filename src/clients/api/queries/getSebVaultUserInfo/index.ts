import formatToUserInfo from './formatToUserInfo';
import { GetSebVaultUserInfoInput, GetSebVaultUserInfoOutput } from './types';

export * from './types';

const getSebVaultUserInfo = async ({
  sebVaultContract,
  accountAddress,
}: GetSebVaultUserInfoInput): Promise<GetSebVaultUserInfoOutput> => {
  const res = await sebVaultContract.methods.userInfo(accountAddress).call();
  return formatToUserInfo(res);
};

export default getSebVaultUserInfo;
