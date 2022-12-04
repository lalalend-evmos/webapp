import { BigNumber } from 'bignumber.js';
import { useContext, useMemo } from 'react';
import { convertWeiToTokens } from 'utilities';

import { useGetDailyMia, useGetMarkets } from 'clients/api';
import { MIA_TOKEN_ID } from 'constants/mia';
import { AuthContext } from 'context/AuthContext';

const useDailyMiaDistributionInterests = () => {
  const { account } = useContext(AuthContext);
  const { data: getDailyMiaData, isLoading: isGetDailyMiaLoading } = useGetDailyMia(
    { accountAddress: account?.address || '' },
    { enabled: !!account?.address },
  );

  const { data: getMarketsData, isLoading: isGetMarketsLoading } = useGetMarkets();
  const miaPriceDollars: BigNumber | undefined = useMemo(
    () => (getMarketsData?.markets || []).find(market => market.id === MIA_TOKEN_ID)?.tokenPrice,
    [JSON.stringify(getMarketsData?.markets)],
  );

  const { dailyMiaDistributionInterestsCents } = useMemo(() => {
    const dailyMiaTokens =
    getDailyMiaData &&
      convertWeiToTokens({
        valueWei: getDailyMiaData.dailyMiaWei,
        tokenId: MIA_TOKEN_ID,
      });

    return {
      dailyMiaDistributionInterestsCents:
        account?.address && miaPriceDollars
          ? dailyMiaTokens?.multipliedBy(miaPriceDollars).times(100)
          : new BigNumber(0),
    };
  }, [
    JSON.stringify(getDailyMiaData?.dailyMiaWei),
    JSON.stringify(getMarketsData?.markets),
    account?.address,
  ]);

  return {
    isLoading: isGetDailyMiaLoading || isGetMarketsLoading,
    dailyMiaDistributionInterestsCents,
  };
};

export default useDailyMiaDistributionInterests;
