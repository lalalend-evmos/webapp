/** @jsxImportSource @emotion/react */
import { Paper } from '@mui/material';
import BigNumber from 'bignumber.js';
import { Delimiter } from 'components';
import React, { useContext } from 'react';
import { Asset, TokenId } from 'types';

import { TOKENS_EVMOS } from 'constants/tokens';
import BorrowRepayModal from 'pages/Dashboard/Modals/BorrowRepay';

import { useStyles } from '../styles';
import BorrowMarketTable, { BorrowMarketTableProps } from './BorrowMarketTable';
import BorrowingTable, { BorrowingUiProps } from './BorrowingTable';

export interface BorrowMarketUiProps {
  className?: string;
  borrowMarketAssets: Asset[];
  borrowingAssets: Asset[];
  isMiaEnabled: boolean;
  userTotalBorrowLimitCents: BigNumber;
}

export const BorrowMarketUi: React.FC<BorrowMarketUiProps> = ({
  className,
  borrowingAssets,
  borrowMarketAssets,
  isMiaEnabled,
  userTotalBorrowLimitCents
}) => {
  const [selectedAssetId, setSelectedAssetId] = React.useState<Asset['id'] | undefined>(undefined);
  const styles = useStyles();

  const rowOnClick: BorrowMarketTableProps['rowOnClick'] | BorrowingUiProps['rowOnClick'] = (
    _e,
    row,
  ) => {
    const assetId = row[0].value as TokenId;

    setSelectedAssetId(row[0].value as TokenId);
  };

  const selectedAsset = React.useMemo(
    () =>
      [...borrowingAssets, ...borrowMarketAssets].find(
        marketAsset => marketAsset.id === selectedAssetId,
      ),
    [selectedAssetId, JSON.stringify(borrowingAssets), JSON.stringify(borrowMarketAssets)],
  );

  return (
    <>
      <Paper className={className} css={styles.tableContainer}>
        {borrowingAssets.length > 0 && (
          <>
            <BorrowingTable
              assets={borrowingAssets}
              isMiaEnabled={isMiaEnabled}
              userTotalBorrowLimitCents={userTotalBorrowLimitCents}
              rowOnClick={rowOnClick}
            />
            <Delimiter css={styles.delimiter} />
          </>
        )}
        <BorrowMarketTable
          assets={borrowMarketAssets}
          isMiaEnabled={isMiaEnabled}
          rowOnClick={rowOnClick}
        />
      </Paper>

      {selectedAsset && (
        <BorrowRepayModal
          asset={selectedAsset}
          onClose={() => setSelectedAssetId(undefined)}
          isMiaEnabled={isMiaEnabled}
        />
      )}
    </>
  );
};

const BorrowMarket: React.FC<BorrowMarketUiProps> = ({
  className,
  isMiaEnabled,
  borrowMarketAssets,
  borrowingAssets,
  userTotalBorrowLimitCents,
}) => {

  return (
    <BorrowMarketUi
      className={className}
      borrowingAssets={borrowingAssets}
      borrowMarketAssets={borrowMarketAssets}
      isMiaEnabled={isMiaEnabled}
      userTotalBorrowLimitCents={userTotalBorrowLimitCents}
    />
  );
};

export default BorrowMarket;
