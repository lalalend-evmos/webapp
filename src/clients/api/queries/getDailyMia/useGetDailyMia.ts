import { QueryObserverOptions, useQuery } from 'react-query';

import getDailyMia, { GetDailyMiaInput, IGetDailyMiaOutput } from 'clients/api/queries/getDailyMia';
import { useMiaLensContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetDailyMiaOutput,
  Error,
  IGetDailyMiaOutput,
  IGetDailyMiaOutput,
  [FunctionKey.GET_N_TOKEN_DAILY_MIA, Omit<GetDailyMiaInput, 'miaLensContract'>]
>;

const useGetDailyMia = (params: Omit<GetDailyMiaInput, 'miaLensContract'>, options?: Options) => {
  const miaLensContract = useMiaLensContract();

  return useQuery(
    [FunctionKey.GET_N_TOKEN_DAILY_MIA, params],
    () => getDailyMia({ accountAddress: params.accountAddress, miaLensContract }),
    options,
  );
};
export default useGetDailyMia;