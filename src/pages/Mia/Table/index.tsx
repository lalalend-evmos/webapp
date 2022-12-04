/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Table, TableProps, Token } from 'components';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import {
  convertWeiToTokens,
  formatToReadablePercentage,
  formatTokensToReadableValue,
  getContractAddress,
} from 'utilities';

import { useGetBalanceOf, useGetUserMarketInfo, useGetMiaSebVaultDailyRate } from 'clients/api';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import { AuthContext } from 'context/AuthContext';

import { useStyles } from '../styles';

type TableAsset = Pick<Asset, 'id' | 'symbol'> & {
  miaPerDay: Asset['miaPerDay'] | undefined;
  miaSupplyApy: Asset['miaSupplyApy'] | undefined;
  miaBorrowApy: Asset['miaBorrowApy'] | undefined;
};

interface MiaTableProps {
  assets: TableAsset[];
}

const MiaTableUi: React.FC<MiaTableProps> = ({ assets }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const columns = useMemo(
    () => [
      { key: 'asset', label: t('mia.columns.asset'), orderable: false, align: 'left' },
      { key: 'miaPerDay', label: t('mia.columns.miaPerDay'), orderable: true, align: 'right' },
      {
        key: 'supplyMiaApy',
        label: t('mia.columns.supplyMiaApy'),
        orderable: true,
        align: 'right',
      },
      {
        key: 'borrowMiaApy',
        label: t('mia.columns.borrowMiaApy'),
        orderable: true,
        align: 'right',
      },
    ],
    [],
  );

  // Format assets to rows
  const rows: TableProps['data'] = assets.map(asset => [
    {
      key: 'asset',
      render: () => <Token tokenId={asset.id} />,
      value: asset.id,
      align: 'left',
    },
    {
      key: 'miaPerDay',
      render: () => (
        <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
          {formatTokensToReadableValue({
            value: asset.miaPerDay,
            tokenId: 'mia',
            minimizeDecimals: true,
          })}
        </Typography>
      ),
      value: asset.miaPerDay?.toFixed() || 0,
      align: 'right',
    },
    {
      key: 'supplyMiaApy',
      render: () => (
        <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
          {formatToReadablePercentage(asset.miaSupplyApy)}
        </Typography>
      ),
      value: asset.miaSupplyApy?.toFixed() || 0,
      align: 'right',
    },
    {
      key: 'borrowMiaApy',
      render: () => (
        <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
          {formatToReadablePercentage(asset.miaBorrowApy)}
        </Typography>
      ),
      value: asset.miaBorrowApy?.toFixed() || 0,
      align: 'right',
    },
  ]);

  return (
    <Table
      columns={columns}
      data={rows}
      initialOrder={{
        orderBy: 'miaPerDay',
        orderDirection: 'desc',
      }}
      rowKeyIndex={0}
      tableCss={styles.table}
      cardsCss={styles.cards}
      css={styles.cardContentGrid}
    />
  );
};

const MiaTable: React.FC = () => {
  const { account } = useContext(AuthContext);
  // TODO: handle loading state (see https://app.clickup.com/t/2d4rcee)
  const {
    data: { assets },
  } = useGetUserMarketInfo({
    accountAddress: account?.address,
  });

  const { data: miaSebVaultDailyRateData } = useGetMiaSebVaultDailyRate();

  const { data: vaultSebStakedData } = useGetBalanceOf(
    {
      tokenId: 'seb',
      accountAddress: getContractAddress('sebVault'),
    },
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    },
  );

  const assetsWithSeb = useMemo(() => {
    const allAssets: TableAsset[] = [...assets];
    const miaAsset = assets.find(asset => asset.id === 'mia');

    if (miaSebVaultDailyRateData && vaultSebStakedData && miaAsset) {
      const miaSebVaultDailyRateTokens = convertWeiToTokens({
        valueWei: miaSebVaultDailyRateData.dailyRateWei,
        tokenId: 'mia',
      });

      const vaultSebStakedTokens = convertWeiToTokens({
        valueWei: vaultSebStakedData.balanceWei,
        tokenId: 'seb',
      });

      const sebApy = miaSebVaultDailyRateTokens
        .times(miaAsset.tokenPrice)
        .times(DAYS_PER_YEAR)
        .times(100)
        .div(vaultSebStakedTokens);

      allAssets.unshift({
        id: 'seb',
        symbol: 'SEB',
        miaPerDay: miaSebVaultDailyRateTokens,
        miaSupplyApy: sebApy,
        miaBorrowApy: undefined,
      });
    }

    return allAssets;
  }, [
    JSON.stringify(assets),
    miaSebVaultDailyRateData?.dailyRateWei.toFixed(),
    vaultSebStakedData?.balanceWei.toFixed(),
  ]);

  return <MiaTableUi assets={assetsWithSeb} />;
};

export default MiaTable;
