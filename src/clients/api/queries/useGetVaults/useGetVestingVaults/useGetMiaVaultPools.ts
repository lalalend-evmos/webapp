import { UseQueryOptions, UseQueryResult, useQueries } from 'react-query';

import {
  GetMiaVaultPendingRewardOutput,
  GetMiaVaultPoolInfoOutput,
  GetMiaVaultUserInfoOutput,
  getMiaVaultPendingReward,
  getMiaVaultPoolInfo,
  getMiaVaultUserInfo,
} from 'clients/api';
import { useMiaVaultProxyContract } from 'clients/contracts/hooks';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import { MIA_TOKEN_ADDRESS } from 'constants/mia';

export interface UseGetMiaVaultPoolsInput {
  poolsCount: number;
  accountAddress?: string;
}

export type UseGetMiaVaultPoolsOutput = UseQueryResult<
  GetMiaVaultPoolInfoOutput | GetMiaVaultPendingRewardOutput | GetMiaVaultUserInfoOutput
>[];

const useGetMiaVaultPools = ({
  accountAddress,
  poolsCount,
}: UseGetMiaVaultPoolsInput): UseGetMiaVaultPoolsOutput => {
  const miaVaultContract = useMiaVaultProxyContract();

  const poolQueries: UseQueryOptions<
    GetMiaVaultPoolInfoOutput | GetMiaVaultPendingRewardOutput | GetMiaVaultUserInfoOutput
  >[] = [];

  // Fetch pool infos
  for (let poolIndex = 0; poolIndex < poolsCount; poolIndex++) {
    poolQueries.push({
      queryFn: () =>
        getMiaVaultPoolInfo({
          miaVaultContract,
          rewardTokenAddress: MIA_TOKEN_ADDRESS,
          poolIndex,
        }),
      queryKey: [
        FunctionKey.GET_MIA_VAULT_POOL_INFOS,
        { rewardTokenAddress: MIA_TOKEN_ADDRESS, poolIndex },
      ],
    });

    poolQueries.push({
      queryFn: () =>
        getMiaVaultPendingReward({
          miaVaultContract,
          rewardTokenAddress: MIA_TOKEN_ADDRESS,
          poolIndex,
          accountAddress: accountAddress || '',
        }),
      queryKey: [
        FunctionKey.GET_MIA_VAULT_PENDING_REWARD,
        { accountAddress, rewardTokenAddress: MIA_TOKEN_ADDRESS, poolIndex },
      ],
      enabled: !!accountAddress,
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    });

    poolQueries.push({
      queryFn: () =>
        getMiaVaultUserInfo({
          miaVaultContract,
          rewardTokenAddress: MIA_TOKEN_ADDRESS,
          poolIndex,
          accountAddress: accountAddress || '',
        }),
      queryKey: [
        FunctionKey.GET_MIA_VAULT_USER_INFO,
        { accountAddress, rewardTokenAddress: MIA_TOKEN_ADDRESS, poolIndex },
      ],
      enabled: !!accountAddress,
    });
  }

  return useQueries(poolQueries);
};

export default useGetMiaVaultPools;
