import { QueryObserverOptions, useQuery } from 'react-query';

import { useMiaLensContract } from 'clients/contracts/hooks';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

import getMiaReward, { GetMiaRewardInput, GetMiaRewardOutput } from '.';

type Options = QueryObserverOptions<
  GetMiaRewardOutput,
  Error,
  GetMiaRewardOutput,
  GetMiaRewardOutput,
  [FunctionKey.GET_MIA_REWARD, string]
>;

const useGetMiaReward = (
  { accountAddress }: Omit<GetMiaRewardInput, 'lensContract'>,
  options?: Options,
) => {
  const lensContract = useMiaLensContract();

  return useQuery(
    [FunctionKey.GET_MIA_REWARD, accountAddress],
    () =>
      getMiaReward({
        lensContract,
        accountAddress,
      }),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
    },
  );
};

export default useGetMiaReward;
