/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import React, { useMemo } from 'react';
import { Asset } from 'types';

import { useGetUserMarketInfo } from 'clients/api';

import { MIA_TOKEN_ID } from 'constants/mia';
import { AuthContext } from 'context/AuthContext';

import Markets from './Markets';
import MyAccount from './MyAccount';
import { useStyles } from './styles';

interface DashboardUiProps {
  accountAddress: string;
  userTotalBorrowLimitCents: BigNumber;
  userTotalBorrowBalanceCents: BigNumber;
  userTotalSupplyBalanceCents: BigNumber;
  assets: Asset[];
}

const DashboardUi: React.FC<DashboardUiProps> = ({
  accountAddress,
  assets,
  userTotalBorrowLimitCents,
  userTotalBorrowBalanceCents,
  userTotalSupplyBalanceCents,
}) => {
  const styles = useStyles();
  const [isMiaEnabled, setIsMiaEnabled] = React.useState(true);

  const { suppliedAssets, supplyMarketAssets, borrowingAssets, borrowMarketAssets } =
    useMemo(() => {
      const sortedAssets = assets.reduce(
        (acc, curr) => {
          if (curr.supplyBalance.isGreaterThan(0)) {
            acc.suppliedAssets.push(curr);
          } else {
            acc.supplyMarketAssets.push(curr);
          }

          if (curr.borrowBalance.isGreaterThan(0)) {
            acc.borrowingAssets.push(curr);
          } else if (curr.id !== MIA_TOKEN_ID) {
            acc.borrowMarketAssets.push(curr);
          }
          return acc;
        },
        {
          suppliedAssets: [] as Asset[],
          supplyMarketAssets: [] as Asset[],
          borrowingAssets: [] as Asset[],
          borrowMarketAssets: [] as Asset[],
        },
      );
      return sortedAssets;
    }, [JSON.stringify(assets)]);

  return (
    <>
      <div css={styles.row}>
        <MyAccount
          assets={assets}
          setIsMiaEnabled={setIsMiaEnabled}
          isMiaEnabled={isMiaEnabled}
          userTotalBorrowLimitCents={userTotalBorrowLimitCents}
          userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
          userTotalSupplyBalanceCents={userTotalSupplyBalanceCents}
        />

      </div>

      <Markets
        isMiaEnabled={isMiaEnabled}
        accountAddress={accountAddress}
        userTotalBorrowLimitCents={userTotalBorrowLimitCents}
        suppliedAssets={suppliedAssets}
        supplyMarketAssets={supplyMarketAssets}
        borrowingAssets={borrowingAssets}
        borrowMarketAssets={borrowMarketAssets}
      />
    </>
  );
};

const Dashboard: React.FC = () => {
  const { account } = React.useContext(AuthContext);
  const accountAddress = account?.address || '';
  // TODO: handle loading state (see https://app.clickup.com/t/2d4rcee)
  const {
    data: {
      assets,
      userTotalBorrowLimitCents,
      userTotalBorrowBalanceCents,
      userTotalSupplyBalanceCents,
    },
  } = useGetUserMarketInfo({
    accountAddress,
  });
  console.log("DATA(assets) FROM CLIENTS/API/USEGETUSERMARKETINFO :: "+ JSON.stringify(assets));
  console.log("userTotalSupplyBalanceCents is : "+ userTotalSupplyBalanceCents);
  
  return (
    <DashboardUi
      accountAddress={accountAddress}
      assets={assets}
      userTotalBorrowLimitCents={userTotalBorrowLimitCents}
      userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
      userTotalSupplyBalanceCents={userTotalSupplyBalanceCents}
    />
  );
};

export default Dashboard;
