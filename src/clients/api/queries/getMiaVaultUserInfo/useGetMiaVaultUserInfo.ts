import { QueryObserverOptions, useQuery } from 'react-query';

import getMiaVaultUserInfo, {
  GetMiaVaultUserInfoInput,
  GetMiaVaultUserInfoOutput,
} from 'clients/api/queries/getMiaVaultUserInfo';
import { useMiaVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMiaVaultUserInfoOutput,
  Error,
  GetMiaVaultUserInfoOutput,
  GetMiaVaultUserInfoOutput,
  [FunctionKey.GET_MIA_VAULT_USER_INFO, Omit<GetMiaVaultUserInfoInput, 'miaVaultContract'>]
>;

const useGetMiaVaultUserInfo = (
  params: Omit<GetMiaVaultUserInfoInput, 'miaVaultContract'>,
  options?: Options,
) => {
  const miaVaultContract = useMiaVaultProxyContract();

  return useQuery(
    [FunctionKey.GET_MIA_VAULT_USER_INFO, params],
    () => getMiaVaultUserInfo({ miaVaultContract, ...params }),
    options,
  );
};

export default useGetMiaVaultUserInfo;
