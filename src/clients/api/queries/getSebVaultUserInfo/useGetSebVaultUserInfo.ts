import { QueryObserverOptions, useQuery } from 'react-query';

import {
  GetSebVaultUserInfoInput,
  GetSebVaultUserInfoOutput,
  getSebVaultUserInfo,
} from 'clients/api';
import { useSebVaultContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetSebVaultUserInfoOutput,
  Error,
  GetSebVaultUserInfoOutput,
  GetSebVaultUserInfoOutput,
  [FunctionKey.GET_SEB_VAULT_USER_INFO, string]
>;

const useGetSebVaultUserInfo = (
  { accountAddress }: Omit<GetSebVaultUserInfoInput, 'sebVaultContract'>,
  options?: Options,
) => {
  const sebVaultContract = useSebVaultContract();

  return useQuery(
    [FunctionKey.GET_SEB_VAULT_USER_INFO, accountAddress],
    () => getSebVaultUserInfo({ sebVaultContract, accountAddress }),
    options,
  );
};

export default useGetSebVaultUserInfo;
