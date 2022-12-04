/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  ApyChart,
  ApyChartProps,
  InterestRateChart,
  InterestRateChartProps,
} from 'components';
import { Spinner } from "components/Spinner/moon";
import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'translation';
import { NTokenId } from 'types';
import {
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatTokensToReadableValue,
  getToken,
  getNErc20Token,
} from 'utilities';

import { useGetNTokenApySimulations } from 'clients/api';
import Path from 'constants/path';
import PLACEHOLDER_KEY from 'constants/placeholderKey';

import Card, { CardProps } from './Card';
import MarketInfo, { MarketInfoProps } from './MarketInfo';
import { useStyles } from './styles';
import TEST_IDS from './testIds';
import useGetChartData from './useGetChartData';
import useGetMarketData from './useGetMarketData';

export interface MarketDetailsUiProps {
  nTokenId: NTokenId;
  supplyChartData: ApyChartProps['data'];
  borrowChartData: ApyChartProps['data'];
  interestRateChartData: InterestRateChartProps['data'];
  totalBorrowBalanceCents?: number;
  totalSupplyBalanceCents?: number;
  borrowApyPercentage?: BigNumber;
  supplyApyPercentage?: BigNumber;
  borrowDistributionApyPercentage?: number;
  supplyDistributionApyPercentage?: number;
  tokenPriceDollars?: BigNumber;
  liquidityCents?: BigNumber;
  supplierCount?: number;
  borrowerCount?: number;
  borrowCapTokens?: BigNumber;
  dailyInterestsCents?: number;
  reserveFactor?: number;
  collateralFactor?: number;
  mintedTokens?: BigNumber;
  reserveTokens?: BigNumber;
  exchangeRateNTokens?: BigNumber;
  currentUtilizationRate?: number;
}

export const MarketDetailsUi: React.FC<MarketDetailsUiProps> = ({
  nTokenId,
  totalBorrowBalanceCents,
  borrowApyPercentage,
  borrowDistributionApyPercentage,
  totalSupplyBalanceCents,
  supplyApyPercentage,
  supplyDistributionApyPercentage,
  currentUtilizationRate,
  tokenPriceDollars,
  liquidityCents,
  supplierCount,
  borrowerCount,
  borrowCapTokens,
  dailyInterestsCents,
  reserveTokens,
  reserveFactor,
  collateralFactor,
  mintedTokens,
  exchangeRateNTokens,
  supplyChartData,
  borrowChartData,
  interestRateChartData,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const token = getToken(nTokenId);
  const nToken = getNErc20Token(nTokenId);

  const supplyInfoStats: CardProps['stats'] = React.useMemo(
    () => [
      {
        label: t('marketDetails.supplyInfo.stats.totalSupply'),
        value: formatCentsToReadableValue({
          value: totalSupplyBalanceCents,
          shortenLargeValue: true,
        }),
      },
      {
        label: t('marketDetails.supplyInfo.stats.apy'),
        value: formatToReadablePercentage(supplyApyPercentage),
      },
      {
        label: t('marketDetails.supplyInfo.stats.distributionApy'),
        value: formatToReadablePercentage(supplyDistributionApyPercentage),
      },
    ],
    [totalSupplyBalanceCents?.toFixed(), supplyApyPercentage, supplyDistributionApyPercentage],
  );

  const supplyInfoLegends: CardProps['legends'] = [
    {
      label: t('marketDetails.legends.supplyApy'),
      color: styles.legendColors.supplyApy,
    },
  ];

  const borrowInfoStats: CardProps['stats'] = React.useMemo(
    () => [
      {
        label: t('marketDetails.borrowInfo.stats.totalBorrow'),
        value: formatCentsToReadableValue({
          value: totalBorrowBalanceCents,
          shortenLargeValue: true,
        }),
      },
      {
        label: t('marketDetails.borrowInfo.stats.apy'),
        value: formatToReadablePercentage(borrowApyPercentage),
      },
      {
        label: t('marketDetails.borrowInfo.stats.distributionApy'),
        value: formatToReadablePercentage(borrowDistributionApyPercentage),
      },
    ],
    [totalBorrowBalanceCents?.toFixed(), borrowApyPercentage, borrowDistributionApyPercentage],
  );

  const borrowInfoLegends: CardProps['legends'] = [
    {
      label: t('marketDetails.legends.borrowApy'),
      color: styles.legendColors.borrowApy,
    },
  ];

  const interestRateModelLegends: CardProps['legends'] = [
    {
      label: t('marketDetails.legends.utilizationRate'),
      color: styles.legendColors.utilizationRate,
    },
    {
      label: t('marketDetails.legends.borrowApy'),
      color: styles.legendColors.borrowApy,
    },
    {
      label: t('marketDetails.legends.supplyApy'),
      color: styles.legendColors.supplyApy,
    },
  ];

  const marketInfoStats: MarketInfoProps['stats'] = React.useMemo(
    () => [
      {
        label: t('marketDetails.marketInfo.stats.priceLabel'),
        value:
          tokenPriceDollars === undefined ? PLACEHOLDER_KEY : `$${tokenPriceDollars.toFormat(2)}`,
      },
      {
        label: t('marketDetails.marketInfo.stats.marketLiquidityLabel'),
        value: formatCentsToReadableValue({
          value: liquidityCents,
        }),
      },
      {
        label: t('marketDetails.marketInfo.stats.supplierCountLabel'),
        value: supplierCount ?? '-',
      },
      {
        label: t('marketDetails.marketInfo.stats.borrowerCountLabel'),
        value: borrowerCount ?? '-',
      },
      {
        label: t('marketDetails.marketInfo.stats.borrowCapLabel'),
        value: borrowCapTokens?.isEqualTo(0)
          ? t('marketDetails.marketInfo.stats.unlimitedBorrowCap')
          : formatTokensToReadableValue({
              value: borrowCapTokens,
              tokenId: nTokenId,
            }),
      },
      {
        label: t('marketDetails.marketInfo.stats.dailyInterestsLabel'),
        value: formatCentsToReadableValue({
          value: dailyInterestsCents,
        }),
      },
      {
        label: t('marketDetails.marketInfo.stats.reserveTokensLabel'),
        value: formatTokensToReadableValue({
          value: reserveTokens,
          minimizeDecimals: true,
          tokenId: nTokenId,
        }),
      },
      {
        label: t('marketDetails.marketInfo.stats.reserveFactorLabel'),
        value: formatToReadablePercentage(reserveFactor),
      },
      {
        label: t('marketDetails.marketInfo.stats.collateralFactorLabel'),
        value: formatToReadablePercentage(collateralFactor),
      },
      {
        label: t('marketDetails.marketInfo.stats.mintedTokensLabel', {
          nTokenSymbol: nToken.symbol,
        }),
        value: formatTokensToReadableValue({
          value: mintedTokens,
          minimizeDecimals: true,
          addSymbol: false,
          tokenId: nTokenId,
        }),
      },
      {
        label: t('marketDetails.marketInfo.stats.exchangeRateLabel'),
        value: exchangeRateNTokens
          ? t('marketDetails.marketInfo.stats.exchangeRateValue', {
              tokenSymbol: token.symbol,
              nTokenSymbol: nToken.symbol,
              rate: exchangeRateNTokens.dp(6).toFixed(),
            })
          : PLACEHOLDER_KEY,
      },
    ],
    [
      tokenPriceDollars,
      liquidityCents?.toFixed(),
      supplierCount,
      borrowerCount,
      borrowCapTokens?.toFixed(),
      dailyInterestsCents?.toFixed(),
      reserveTokens?.toFixed(),
      nTokenId,
      reserveFactor?.toFixed(),
      collateralFactor?.toFixed(),
      mintedTokens?.toFixed(),
      exchangeRateNTokens?.toFixed(),
    ],
  );

  if (!supplyChartData.length || !borrowChartData.length || !interestRateChartData.length) {
    console.log("still waiting for what ??");
    console.log("supplyChartData = " + supplyChartData.length);
    console.log("borrowChartData = " + borrowChartData.length);
    console.log("interestRateChartData = " + interestRateChartData.length);

    return <Spinner />;
  }

  // @TODO: handle fetching errors

  return (
    <div css={styles.container}>
      <div css={[styles.column, styles.graphsColumn]}>
        <Card
          testId={TEST_IDS.supplyInfo}
          title={t('marketDetails.supplyInfo.title')}
          css={styles.graphCard}
          stats={supplyInfoStats}
          legends={supplyInfoLegends}
        >
          <div css={styles.apyChart}>
            <ApyChart data={supplyChartData} type="supply" />
          </div>
        </Card>

        <Card
          testId={TEST_IDS.borrowInfo}
          title={t('marketDetails.borrowInfo.title')}
          css={styles.graphCard}
          stats={borrowInfoStats}
          legends={borrowInfoLegends}
        >
          <div css={styles.apyChart}>
            <ApyChart data={borrowChartData} type="borrow" />
          </div>
        </Card>

        <Card
          testId={TEST_IDS.interestRateModel}
          title={t('marketDetails.interestRateModel.title')}
          css={styles.graphCard}
          legends={interestRateModelLegends}
        >
          <div css={styles.apyChart}>
            <InterestRateChart
              data={interestRateChartData}
              currentUtilizationRate={currentUtilizationRate}
            />
          </div>
        </Card>
      </div>

      <div css={[styles.column, styles.statsColumn]}>
        <MarketInfo stats={marketInfoStats} testId={TEST_IDS.marketInfo} />
      </div>
    </div>
  );
};

export type MarketDetailsProps = RouteComponentProps<{ nTokenId: NTokenId }>;

const MarketDetails: React.FC<MarketDetailsProps> = ({
  match: {
    params: { nTokenId },
  },
}) => {
  const nToken = getNErc20Token(nTokenId);
  
  // Redirect to market page if nTokenId passed through route params is invalid
  if (!nToken) {
    return <Redirect to={Path.MARKETS} />;
  }
  if(nToken.id == "usdc") {
    nToken.address = "0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7";
  }
  console.log('nToken addy is ///// '+ JSON.stringify(nToken.address) );

  const { reserveFactorMantissa, ...marketData } = useGetMarketData({
    nTokenId,
    nTokenAddress: nToken.address,
  });

  const chartData = useGetChartData({
    nTokenId,
  });

  const {
    data: interestRateChartData = {
      apySimulations: [],
    },
  } = useGetNTokenApySimulations({
    nTokenId,
    reserveFactorMantissa,
  });

  return (
    <MarketDetailsUi
      nTokenId={nTokenId}
      {...marketData}
      {...chartData}
      interestRateChartData={interestRateChartData.apySimulations}
    />
  );
};

export default MarketDetails;
