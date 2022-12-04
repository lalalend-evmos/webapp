import BigNumber from 'bignumber.js';
import React from 'react';
import { NErcToken } from 'types';
import { convertPercentageFromSmartContract, convertWeiToTokens, getToken } from 'utilities';

import { useGetMarkets, useGetNTokenCash } from 'clients/api';
import { NTOKEN_DECIMALS } from 'constants/tokens';

const useGetMarketData = ({
  nTokenId,
  nTokenAddress,
}: {
  nTokenId: NErcToken['id'];
  nTokenAddress: NErcToken['address'];
}) => {
  const { data: nTokenCashData } = useGetNTokenCash({
    nTokenId,
  });

  const { data: getMarketData } = useGetMarkets();
  const assetMarket = (getMarketData?.markets || []).find(
    market => market.address.toLowerCase() === nTokenAddress.toLowerCase(),
  );

  return React.useMemo(() => {
    const totalBorrowBalanceCents = assetMarket && +assetMarket.totalBorrowsUsd * 100;
    const totalSupplyBalanceCents = assetMarket && +assetMarket.totalSupplyUsd * 100;
    const borrowApyPercentage = assetMarket?.borrowApy;
    const supplyApyPercentage = assetMarket?.supplyApy;
    const borrowDistributionApyPercentage = assetMarket && +assetMarket.borrowMiaApy;
    const supplyDistributionApyPercentage = assetMarket && +assetMarket.supplyMiaApy;
    const tokenPriceDollars = assetMarket?.tokenPrice;
    const liquidityCents = assetMarket && new BigNumber(assetMarket.liquidity).multipliedBy(100);
    const supplierCount = assetMarket?.supplierCount;
    const borrowerCount = assetMarket?.borrowerCount;
    const borrowCapTokens = assetMarket && new BigNumber(assetMarket.borrowCaps);
    const mintedTokens = assetMarket && new BigNumber(assetMarket.totalSupply2);
    const reserveFactorMantissa = assetMarket && new BigNumber(assetMarket.reserveFactor);

    const dailyInterestsCents =
      assetMarket &&
      convertWeiToTokens({
        valueWei: new BigNumber(assetMarket.supplierDailyMia).plus(
          new BigNumber(assetMarket.borrowerDailyMia),
        ),
        tokenId: 'mia',
      })
        // Convert MIA to dollars
        .multipliedBy(assetMarket.tokenPrice)
        // Convert to cents
        .multipliedBy(100)
        .toNumber();

    const reserveFactor =
      assetMarket && convertPercentageFromSmartContract(assetMarket.reserveFactor);

    const collateralFactor =
      assetMarket && convertPercentageFromSmartContract(assetMarket.collateralFactor);

    const reserveTokens =
      assetMarket &&
      convertWeiToTokens({
        valueWei: new BigNumber(assetMarket.totalReserves),
        tokenId: nTokenId,
      });

    const exchangeRateNTokens =
      assetMarket &&
      new BigNumber(1).div(
        new BigNumber(assetMarket.exchangeRate).div(
          new BigNumber(10).pow(18 + getToken(nTokenId).decimals - NTOKEN_DECIMALS),
        ),
      );

    let currentUtilizationRate: number | undefined;
    if (nTokenCashData?.cashWei && assetMarket && reserveTokens) {
      const nTokenCashTokens = convertWeiToTokens({
        valueWei: nTokenCashData.cashWei,
        tokenId: nTokenId,
      });

      currentUtilizationRate = new BigNumber(assetMarket.totalBorrows2)
        .div(nTokenCashTokens.plus(assetMarket.totalBorrows2).minus(reserveTokens))
        .multipliedBy(100)
        .dp(0)
        .toNumber();
    }

    return {
      totalBorrowBalanceCents,
      totalSupplyBalanceCents,
      borrowApyPercentage,
      supplyApyPercentage,
      borrowDistributionApyPercentage,
      supplyDistributionApyPercentage,
      tokenPriceDollars,
      liquidityCents,
      supplierCount,
      borrowerCount,
      borrowCapTokens,
      mintedTokens,
      dailyInterestsCents,
      reserveFactor,
      collateralFactor,
      reserveTokens,
      exchangeRateNTokens,
      currentUtilizationRate,
      reserveFactorMantissa,
    };
  }, [JSON.stringify(assetMarket), nTokenCashData?.cashWei.toFixed()]);
};

export default useGetMarketData;
