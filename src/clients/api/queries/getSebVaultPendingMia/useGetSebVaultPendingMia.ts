import { QueryObserverOptions, useQuery } from 'react-query';

import {
  GetSebVaultPendingMiaInput,
  GetSebVaultPendingMiaOutput,
  getSebVaultPendingMia,
} from 'clients/api';
import { useSebVaultContract } from 'clients/contracts/hooks';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
GetSebVaultPendingMiaOutput,
  Error,
  GetSebVaultPendingMiaOutput,
  GetSebVaultPendingMiaOutput,
  [FunctionKey.GET_SEB_VAULT_PENDING_MIA, string]
>;

const useGetSebVaultPendingMia = (
  { accountAddress }: Omit<GetSebVaultPendingMiaInput, 'sebVaultContract'>,
  options?: Options,
) => {
  const sebVaultContract = useSebVaultContract();

  return useQuery(
    [FunctionKey.GET_SEB_VAULT_PENDING_MIA, accountAddress],
    () => getSebVaultPendingMia({ sebVaultContract, accountAddress }),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
    },
  );
};

export default useGetSebVaultPendingMia;
