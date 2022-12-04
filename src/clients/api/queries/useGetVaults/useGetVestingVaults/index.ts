import { useMemo } from 'react';
import { UseQueryResult } from 'react-query';
import { Vault } from 'types';
import { getTokenByAddress, indexBy } from 'utilities';

import {
  GetMiaVaultPendingRewardOutput,
  GetMiaVaultPoolInfoOutput,
  GetMiaVaultUserInfoOutput,
  useGetMiaVaultPoolCount,
  useGetMiaVaultRewardPerBlock, 
  useGetMiaVaultTotalAllocationPoints,
} from 'clients/api';
import { BLOCKS_PER_DAY } from 'constants/evmos';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { MIA_TOKEN_ADDRESS, MIA_TOKEN_ID } from 'constants/mia';

import useGetMiaVaultPoolBalances from './useGetMiaVaultPoolBalances';
import useGetMiaVaultPools from './useGetMiaVaultPools';

export interface UseGetVestingVaultsOutput {
  isLoading: boolean;
  data: Vault[];
}

const useGetVestingVaults = ({
  accountAddress,
}: {
  accountAddress?: string;
}): UseGetVestingVaultsOutput => {
  const {
    data: miaVaultPoolCountData = { poolCount: 0 },
    isLoading: isGetMiaVaultPoolCountLoading,
  } = useGetMiaVaultPoolCount();

  // Fetch data generic to all MIA pools
  const { data: miaVaultRewardWeiPerBlock, isLoading: isGetMiaVaultRewardPerBlockLoading } =
    useGetMiaVaultRewardPerBlock({
      tokenAddress: MIA_TOKEN_ADDRESS,
    });

  const {
    data: miaVaultTotalAllocationPointsData,
    isLoading: isGetMiaVaultTotalAllocationPointsLoading,
  } = useGetMiaVaultTotalAllocationPoints({
    tokenAddress: MIA_TOKEN_ADDRESS,
  });

  // Fetch pools
  const poolQueryResults = useGetMiaVaultPools({
    accountAddress,
    poolsCount: miaVaultPoolCountData.poolCount,
  });
  const arePoolQueriesLoading = poolQueryResults.some(queryResult => queryResult.isLoading);

  // Index results by pool ID
  const [poolData, stakedTokenAddresses] = useMemo(() => {
    const data: {
      [poolIndex: string]: {
        poolInfos: GetMiaVaultPoolInfoOutput;
        userPendingReward?: GetMiaVaultPendingRewardOutput;
        userInfos?: GetMiaVaultUserInfoOutput;
      };
    } = {};

    const tokenAddresses: string[] = [];

    const queriesPerPoolCount =
      miaVaultPoolCountData.poolCount > 0
        ? poolQueryResults.length / miaVaultPoolCountData.poolCount
        : 0;

    for (let poolIndex = 0; poolIndex < miaVaultPoolCountData.poolCount; poolIndex++) {
      const poolQueryResultStartIndex = poolIndex * queriesPerPoolCount;

      const poolInfosQueryResult = poolQueryResults[
        poolQueryResultStartIndex
      ] as UseQueryResult<GetMiaVaultPoolInfoOutput>;

      const userPendingRewardQueryResult = poolQueryResults[
        poolQueryResultStartIndex + 1
      ] as UseQueryResult<GetMiaVaultPendingRewardOutput>;

      const userInfoQueryResult = poolQueryResults[
        poolQueryResultStartIndex + 2
      ] as UseQueryResult<GetMiaVaultUserInfoOutput>;

      if (poolInfosQueryResult?.data) {
        tokenAddresses.push(poolInfosQueryResult.data.stakedTokenAddress);

        data[poolIndex] = {
          poolInfos: poolInfosQueryResult.data,
          userInfos: userInfoQueryResult.data,
          userPendingReward: userPendingRewardQueryResult.data,
        };
      }
    }

    return [data, tokenAddresses];
  }, [JSON.stringify(poolQueryResults), miaVaultPoolCountData.poolCount]);

  // Fetch pool balances
  const poolBalanceQueryResults = useGetMiaVaultPoolBalances({
    stakedTokenAddresses,
  });
  const arePoolBalanceQueriesLoading = poolBalanceQueryResults.some(
    queryResult => queryResult.isLoading,
  );

  // Index results by pool ID
  const poolBalances = useMemo(
    () =>
      indexBy(
        (_item, index) => `${index}`,
        poolBalanceQueryResults.map(poolBalanceQueryResult => poolBalanceQueryResult.data),
      ),
    [JSON.stringify(poolBalanceQueryResults)],
  );

  const isLoading =
    isGetMiaVaultPoolCountLoading ||
    isGetMiaVaultRewardPerBlockLoading ||
    isGetMiaVaultTotalAllocationPointsLoading ||
    arePoolQueriesLoading ||
    arePoolBalanceQueriesLoading;

  // Format query results into Vaults
  const data: Vault[] = useMemo(
    () =>
      Array.from({ length: miaVaultPoolCountData.poolCount }).reduce<Vault[]>(
        (acc, _item, poolIndex) => {
          const totalStakedWeiData = poolBalances[poolIndex];
          const lockingPeriodMs = poolData[poolIndex]?.poolInfos.lockingPeriodMs;
          const userStakedWei = poolData[poolIndex]?.userInfos?.stakedAmountWei;
          const userPendingRewardWei = poolData[poolIndex]?.userPendingReward?.pendingMiaReward;

          const stakedTokenId =
            poolData[poolIndex]?.poolInfos?.stakedTokenAddress &&
            getTokenByAddress(poolData[poolIndex]?.poolInfos.stakedTokenAddress)?.id;

          const poolRewardWeiPerBlock =
            miaVaultRewardWeiPerBlock?.rewardPerBlockWei &&
            miaVaultTotalAllocationPointsData?.totalAllocationPoints &&
            poolData[poolIndex]?.poolInfos.allocationPoint &&
            miaVaultRewardWeiPerBlock.rewardPerBlockWei
              .multipliedBy(poolData[poolIndex]?.poolInfos.allocationPoint)
              .div(miaVaultTotalAllocationPointsData.totalAllocationPoints);

          const dailyEmissionWei =
            poolRewardWeiPerBlock && poolRewardWeiPerBlock.multipliedBy(BLOCKS_PER_DAY);

          const stakingAprPercentage =
            dailyEmissionWei &&
            totalStakedWeiData &&
            dailyEmissionWei
              .multipliedBy(DAYS_PER_YEAR)
              .div(totalStakedWeiData.balanceWei)
              .multipliedBy(100)
              .toNumber();

          if (
            stakedTokenId &&
            lockingPeriodMs &&
            dailyEmissionWei &&
            totalStakedWeiData &&
            stakingAprPercentage
          ) {
            const vault: Vault = {
              rewardTokenId: MIA_TOKEN_ID,
              stakedTokenId,
              lockingPeriodMs,
              dailyEmissionWei,
              totalStakedWei: totalStakedWeiData.balanceWei,
              stakingAprPercentage,
              userStakedWei,
              userPendingRewardWei,
              poolIndex,
            };

            return [...acc, vault];
          }

          return acc;
        },
        [],
      ),
    [
      miaVaultPoolCountData.poolCount,
      JSON.stringify(poolData),
      JSON.stringify(poolBalances),
      miaVaultRewardWeiPerBlock?.rewardPerBlockWei.toFixed(),
      miaVaultTotalAllocationPointsData?.totalAllocationPoints,
    ],
  );

  return {
    data,
    isLoading,
  };
};

export default useGetVestingVaults;
