import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { TokenId, Vault } from 'types';
import { convertWeiToTokens, getContractAddress } from 'utilities';

import {
  useGetBalanceOf,
  useGetMarkets,
  useGetSebVaultPendingMia,
  useGetSebVaultUserInfo,
  useGetMiaSebVaultDailyRate,
} from 'clients/api';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import { TOKENS_EVMOS } from 'constants/tokens';

const SEB_VAULT_ADDRESS = getContractAddress('sebVault');

export interface UseGetSebVaultOutput {
  isLoading: boolean;
  data: Vault | undefined;
}

const useGetSebVault = ({ accountAddress }: { accountAddress?: string }): UseGetSebVaultOutput => {
  const { data: totalSebStakedData, isLoading: isGetTotalSebStakedWeiLoading } = useGetBalanceOf(
    {
      accountAddress: SEB_VAULT_ADDRESS,
      tokenId: TOKENS_EVMOS.seb.id as TokenId,
    },
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    },
  );

  const { data: sebVaultUserInfo, isLoading: isGetSebVaultUserInfoLoading } =
    useGetSebVaultUserInfo(
      {
        accountAddress: accountAddress || '',
      },
      {
        enabled: !!accountAddress,
      },
    );

  const { data: userPendingSebRewardData, isLoading: isGetUserPendingSebRewardWeiLoading } =
    useGetSebVaultPendingMia(
      {
        accountAddress: accountAddress || '',
      },
      {
        enabled: !!accountAddress,
      },
    );

  const { data: sebVaultDailyRateData, isLoading: isGetSebVaultDailyRateWeiLoading } =
    useGetMiaSebVaultDailyRate();

  const { data: getMarketsData, isLoading: isGetMarketsLoading } = useGetMarkets();
  const miaPriceDollars: BigNumber | undefined = useMemo(
    () => (getMarketsData?.markets || []).find(market => market.id === TOKENS_EVMOS.mia.id)?.tokenPrice,
    [JSON.stringify(getMarketsData?.markets)],
  );

  const data: Vault | undefined = useMemo(() => {
    if (!totalSebStakedData || !sebVaultDailyRateData || !miaPriceDollars) {
      return undefined;
    }

    const stakingAprPercentage = convertWeiToTokens({
      valueWei: sebVaultDailyRateData.dailyRateWei,
      tokenId: TOKENS_EVMOS.mia.id as TokenId,
    })
      .multipliedBy(miaPriceDollars) // We assume 1 SEB = 1 dollar
      .multipliedBy(DAYS_PER_YEAR)
      .dividedBy(
        convertWeiToTokens({
          valueWei: totalSebStakedData.balanceWei,
          tokenId: TOKENS_EVMOS.seb.id as TokenId,
        }),
      )
      .multipliedBy(100)
      .toNumber();

    return {
      rewardTokenId: TOKENS_EVMOS.mia.id as TokenId,
      stakedTokenId: TOKENS_EVMOS.seb.id as TokenId,
      dailyEmissionWei: sebVaultDailyRateData.dailyRateWei,
      totalStakedWei: totalSebStakedData.balanceWei,
      stakingAprPercentage,
      userStakedWei: sebVaultUserInfo?.stakedSebWei,
      userPendingRewardWei: userPendingSebRewardData?.pendingMiaWei,
    };
  }, [
    totalSebStakedData?.balanceWei.toFixed(),
    sebVaultDailyRateData?.dailyRateWei.toFixed(),
    miaPriceDollars?.toFixed(),
    JSON.stringify(sebVaultUserInfo),
    userPendingSebRewardData?.pendingMiaWei.toFixed(),
  ]);

  const isLoading =
    isGetTotalSebStakedWeiLoading ||
    isGetSebVaultDailyRateWeiLoading ||
    isGetMarketsLoading ||
    isGetSebVaultUserInfoLoading ||
    isGetUserPendingSebRewardWeiLoading;

  return {
    data,
    isLoading,
  };
};

export default useGetSebVault;
