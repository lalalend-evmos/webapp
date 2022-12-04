/** @jsxImportSource @emotion/react */
import { BigNumber } from 'bignumber.js';
import React from 'react';
import { Asset } from 'types';
import {
  calculateDailyEarningsCents,
  calculateNetApy,
  calculateYearlyEarningsForAssets,
} from 'utilities';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import useDailyMiaDistributionInterests from 'hooks/useDailyMiaDistributionInterests';

import MyAccountUi, { MyAccountUiProps } from './MyAccountUi';

interface MyAccountProps {
  className?: string;
  isMiaEnabled: boolean;
  setIsMiaEnabled: (value: boolean) => void;
  assets: Asset[];
  userTotalBorrowLimitCents: BigNumber;
  userTotalBorrowBalanceCents: BigNumber;
  userTotalSupplyBalanceCents: BigNumber;
}

const MyAccount: React.FC<MyAccountProps> = ({
  className,
  assets,
  isMiaEnabled,
  setIsMiaEnabled,
  userTotalBorrowLimitCents,
  userTotalBorrowBalanceCents,
  userTotalSupplyBalanceCents,
}) => {
  // TODO: handle loading state
  const { dailyMiaDistributionInterestsCents } = useDailyMiaDistributionInterests();

  const calculations: Pick<
    MyAccountUiProps,
    'netApyPercentage' | 'dailyEarningsCents' | 'supplyBalanceCents' | 'borrowLimitCents'
  > = React.useMemo(() => {
    const yearlyEarningsCents =
      dailyMiaDistributionInterestsCents &&
      calculateYearlyEarningsForAssets({
        assets,
        isMiaEnabled,
        dailyMiaDistributionInterestsCents,
      });
    const netApyPercentage =
      userTotalSupplyBalanceCents &&
      yearlyEarningsCents &&
      calculateNetApy({
        supplyBalanceCents: userTotalSupplyBalanceCents,
        yearlyEarningsCents,
      });
    const dailyEarningsCents =
      yearlyEarningsCents && +calculateDailyEarningsCents(yearlyEarningsCents).toFixed(0);
    return {
      netApyPercentage,
      dailyEarningsCents,
      supplyBalanceCents: userTotalSupplyBalanceCents?.toNumber(),
      borrowLimitCents: userTotalBorrowLimitCents.toNumber(),
    };
  }, [JSON.stringify(assets), isMiaEnabled, dailyMiaDistributionInterestsCents]);

  return (
    <MyAccountUi
      className={className}
      safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
      isMiaEnabled={isMiaEnabled}
      onMiaToggle={setIsMiaEnabled}
      borrowBalanceCents={+userTotalBorrowBalanceCents.toFixed()}
      {...calculations}
    />
  );
};

export default MyAccount;
