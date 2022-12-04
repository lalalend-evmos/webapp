import { QueryObserverOptions, useQuery } from 'react-query';

import getMiaVaultPoolInfo, {
  GetMiaVaultPoolInfoInput,
  GetMiaVaultPoolInfoOutput,
} from 'clients/api/queries/getMiaVaultPoolInfo';
import { useMiaVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
GetMiaVaultPoolInfoOutput,
  Error,
  GetMiaVaultPoolInfoOutput,
  GetMiaVaultPoolInfoOutput,
  [FunctionKey.GET_MIA_VAULT_POOL_INFOS, Omit<GetMiaVaultPoolInfoInput, 'miaVaultContract'>]
>;

const useGetMiaVaultPoolInfo = (
  params: Omit<GetMiaVaultPoolInfoInput, 'miaVaultContract'>,
  options?: Options,
) => {
  const miaVaultContract = useMiaVaultProxyContract();

  return useQuery(
    [FunctionKey.GET_MIA_VAULT_POOL_INFOS, params],
    () => getMiaVaultPoolInfo({ miaVaultContract, ...params }),
    options,
  );
};

export default useGetMiaVaultPoolInfo;
