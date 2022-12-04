import { QueryObserverOptions, useQuery } from 'react-query';

import getMiaVaultLockedDeposits, {
  GetMiaVaultLockedDepositsInput,
  GetMiaVaultLockedDepositsOutput,
} from 'clients/api/queries/getMiaVaultLockedDeposits';
import { useMiaVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMiaVaultLockedDepositsOutput,
  Error,
  GetMiaVaultLockedDepositsOutput,
  GetMiaVaultLockedDepositsOutput ,
  [
    FunctionKey.GET_MIA_VAULT_WITHDRAWAL_REQUESTS,
    Omit<GetMiaVaultLockedDepositsInput, 'miaVaultContract'>,
  ]
>;

const useGetMiaVaultLockedDeposits = (
  params: Omit<GetMiaVaultLockedDepositsInput, 'miaVaultContract'>,
  options?: Options,
) => {
  const miaVaultContract = useMiaVaultProxyContract();

  return useQuery(
    [FunctionKey.GET_MIA_VAULT_WITHDRAWAL_REQUESTS, params],
    () => getMiaVaultLockedDeposits({ miaVaultContract, ...params }),
    options,
  );
};

export default useGetMiaVaultLockedDeposits;
