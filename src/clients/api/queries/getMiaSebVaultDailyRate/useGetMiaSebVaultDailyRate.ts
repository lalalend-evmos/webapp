import { QueryObserverOptions, useQuery } from 'react-query';

import { GetMiaSebVaultDailyRateOutput, getMiaSebVaultDailyRate } from 'clients/api';
import { useComptrollerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMiaSebVaultDailyRateOutput,
  Error,
  GetMiaSebVaultDailyRateOutput,
  GetMiaSebVaultDailyRateOutput,
  FunctionKey.GET_MIA_SEB_VAULT_DAILY_RATE
>;

const useGetMMiaSebVaultDailyRate = (options?: Options) => {
  const comptrollerContract = useComptrollerContract();

  return useQuery(
    FunctionKey.GET_MIA_SEB_VAULT_DAILY_RATE,
    () => getMiaSebVaultDailyRate({ comptrollerContract }),
    options,
  );
};

export default useGetMMiaSebVaultDailyRate;
