import { QueryObserverOptions, useQuery } from 'react-query';

import getMiaVaultPoolCount, {
  GetMiaVaultPoolCountOutput,
} from 'clients/api/queries/getMiaVaultPoolCount';
import { useMiaVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMiaVaultPoolCountOutput,
  Error,
  GetMiaVaultPoolCountOutput,
  GetMiaVaultPoolCountOutput,
  FunctionKey.GET_MIA_VAULT_POOLS_COUNT
>;

const useGetMiaVaultPoolCount = (options?: Options) => {
  const miaVaultContract = useMiaVaultProxyContract();

  return useQuery(
    FunctionKey.GET_MIA_VAULT_POOLS_COUNT,
    () => getMiaVaultPoolCount({ miaVaultContract }),
    options,
  );
};

export default useGetMiaVaultPoolCount;
