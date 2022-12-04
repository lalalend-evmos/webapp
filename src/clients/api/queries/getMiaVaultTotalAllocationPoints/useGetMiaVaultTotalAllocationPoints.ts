import { QueryObserverOptions, useQuery } from 'react-query';

import getMiaVaultTotalAllocationPoints, {
  GetMiaVaultTotalAllocPointsInput,
  GetMiaVaultTotalAllocPointsOutput,
} from 'clients/api/queries/getMiaVaultTotalAllocationPoints';
import { useMiaVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMiaVaultTotalAllocPointsOutput,
  Error,
  GetMiaVaultTotalAllocPointsOutput,
  GetMiaVaultTotalAllocPointsOutput,
  [FunctionKey.GET_MIA_VAULT_TOTAL_ALLOCATION_POINTS, string]
>;

const useGetMiaVaultTotalAllocationPoints = (
  { tokenAddress }: Omit<  GetMiaVaultTotalAllocPointsInput, 'miaVaultContract'>,
  options?: Options,
) => {
  const miaVaultContract = useMiaVaultProxyContract();

  return useQuery(
    [FunctionKey.GET_MIA_VAULT_TOTAL_ALLOCATION_POINTS, tokenAddress],
    () => getMiaVaultTotalAllocationPoints({ tokenAddress, miaVaultContract }),
    options,
  );
};

export default useGetMiaVaultTotalAllocationPoints;
