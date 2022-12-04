import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Asset, Market, TokenId } from 'types';
import {
  calculateCollateralValue,
  convertTokensToWei,
  convertWeiToTokens,
  getToken,
  getNErc20Token,
  indexBy,
} from 'utilities';

import {
  IGetNTokenBalancesAllOutput,
  useGetAssetsInAccount,
  useGetMarkets,
  useGetMintedSeb,
  useGetNTokenBalancesAll,
} from 'clients/api';
import { TOKENS_EVMOS, NTOKENS_EVMOS } from 'constants/tokens';

export interface Data {
  assets: Asset[];
  userTotalBorrowLimitCents: BigNumber;
  userTotalBorrowBalanceCents: BigNumber;
  userTotalSupplyBalanceCents: BigNumber;
  totalMiaDistributedWei: BigNumber;
  dailyMiaWei: BigNumber;
}

export interface UseGetUserMarketInfoOutput {
  isLoading: boolean;
  data: Data;
}

const nTokenAddresses: string[] = Object.values(NTOKENS_EVMOS).reduce(
  (acc, item) => (item.address ? [...acc, item.address] : acc),
  [],
);
console.log("nTokenAddresses (useGetUserMarketInfo) = " + JSON.stringify(nTokenAddresses));


const useGetUserMarketInfo = ({
  accountAddress,
}: {
  accountAddress?: string;
}): UseGetUserMarketInfoOutput => {
 
  const { data: userMintedSebData, isLoading: isGetUserMintedSebLoading } = useGetMintedSeb(
    {
      accountAddress: accountAddress || '',
    },
    {
      enabled: !!accountAddress,
    },
  );

  const {
    data: getMarketsData = {
      markets: [],
      dailyMiaWei: new BigNumber(0),
    },
    isLoading: isGetMarketsLoading,
  } = useGetMarkets({
    placeholderData: {
      markets: [],
      dailyMiaWei: new BigNumber(0),
    },
  });

  console.log("queries basic : getMarketsData : "+ JSON.stringify(getMarketsData.markets));
  
  const marketsMap = useMemo(
    () =>
      indexBy(
        (item: Market) => item.underlyingSymbol.toLowerCase(), // index by symbol of underlying token
        getMarketsData.markets,
      ),
    [getMarketsData?.markets],
  );


  const {
    data: assetsInAccount = {
      tokenAddresses: [],
    },
    isLoading: isGetAssetsInAccountLoading,
  } = useGetAssetsInAccount(
    { accountAddress: accountAddress || '' },
    {
      enabled: !!accountAddress,
      placeholderData: {
        tokenAddresses: [],
      },
    },
  );

  const {
    data: nTokenBalancesAccount = { balances: [] },
    isLoading: isGetNTokenBalancesAccountLoading,
  } = useGetNTokenBalancesAll(
    { account: accountAddress || '', nTokenAddresses },
    { enabled: !!accountAddress, placeholderData: { balances: [] } },
  );

  const nTokenBalances = useMemo(
    () =>
      indexBy(
        (item: IGetNTokenBalancesAllOutput['balances'][number]) => item.nToken.toLowerCase(), // index by nToken address
        nTokenBalancesAccount.balances,
      ),
    [JSON.stringify(nTokenBalancesAccount)],
  );

  const isLoading =
    isGetMarketsLoading ||
    isGetAssetsInAccountLoading ||
    isGetNTokenBalancesAccountLoading ||
    isGetUserMintedSebLoading;

  const data = useMemo(() => {
    const {
      assets,
      userTotalBorrowBalanceCents,
      userTotalBorrowLimitCents,
      userTotalSupplyBalanceCents,
      totalMiaDistributedWei,
    } = Object.values(TOKENS_EVMOS).reduce(
      (acc, item, index) => {
        const { assets: assetAcc } = acc;

        const toDecimalAmount = (mantissa: string) =>
          new BigNumber(mantissa).shiftedBy(-item.decimals);

        const nErcToken = getNErc20Token(item.id);
        // if no corresponding vassets, skip
        if (!nErcToken) {
          console.log(item.id + " : not nerc found");
          return acc;
        }

        const market = marketsMap[item.id];
        //console.log("market from marketMap is "+ JSON.stringify(market));

        const ntokenAddress = nErcToken.address.toLowerCase();
        const collateral = (assetsInAccount.tokenAddresses || [])
          .map((address: string) => address.toLowerCase())
          .includes(ntokenAddress);

        let walletBalance = new BigNumber(0);
        let supplyBalance = new BigNumber(0);
        let borrowBalance = new BigNumber(0);
        const percentOfLimit = '0';

        const wallet = nTokenBalances && nTokenBalances[ntokenAddress];
        if (accountAddress && wallet) {
          walletBalance = toDecimalAmount(wallet.tokenBalance);
          supplyBalance = toDecimalAmount(wallet.balanceOfUnderlying);
          borrowBalance = toDecimalAmount(wallet.borrowBalanceCurrent);
        }

        const asset = {
          key: index,
          id: item.id,
          img: item.asset,
          nimg: item.vasset,
          symbol: market?.underlyingSymbol || item.id.toUpperCase(),
          decimals: item.decimals,
          tokenAddress: market?.underlyingAddress,
          nsymbol: market?.symbol,
          ntokenAddress,
          supplyApy: new BigNumber(market?.supplyApy || 0),
          borrowApy: new BigNumber(market?.borrowApy || 0),
          miaSupplyApy: new BigNumber(market?.supplyMiaApy || 0),
          miaBorrowApy: new BigNumber(market?.borrowMiaApy || 0),
          collateralFactor: new BigNumber(market?.collateralFactor || 0).div(1e18),
          tokenPrice: new BigNumber(market?.tokenPrice || 0),
          liquidity: new BigNumber(market?.liquidity || 0),
          borrowCaps: new BigNumber(market?.borrowCaps || 0),
          treasuryTotalBorrowsCents: new BigNumber(market?.totalBorrowsUsd || 0).times(100),
          treasuryTotalSupplyCents: new BigNumber(market?.totalSupplyUsd || 0).times(100),
          treasuryTotalSupply: new BigNumber(market?.totalSupply || 0),
          treasuryTotalBorrows: new BigNumber(market?.totalBorrows2 || 0),
          walletBalance,
          supplyBalance,
          borrowBalance,
          collateral,
          percentOfLimit,
          miaPerDay: new BigNumber(market?.supplierDailyMia || 0)
            .plus(new BigNumber(market?.borrowerDailyMia || 0))
            .div(new BigNumber(10).pow(getToken('mia').decimals)),
        };

        // user totals
        const borrowBalanceCents = asset.borrowBalance.times(asset.tokenPrice).times(100);
        const supplyBalanceCents = asset.supplyBalance.times(asset.tokenPrice).times(100);
        acc.userTotalBorrowBalanceCents = acc.userTotalBorrowBalanceCents.plus(borrowBalanceCents);
        acc.userTotalSupplyBalanceCents = acc.userTotalSupplyBalanceCents.plus(supplyBalanceCents);

        acc.totalMiaDistributedWei = acc.totalMiaDistributedWei.plus(
          new BigNumber(market?.totalDistributed || 0).times(
            new BigNumber(10).pow(getToken('mia').decimals),
          ),
        );

        // Create borrow limit based on assets supplied as collateral
        if (asset.collateral) {
          acc.userTotalBorrowLimitCents = acc.userTotalBorrowLimitCents.plus(
            calculateCollateralValue({
              amountWei: convertTokensToWei({ value: asset.supplyBalance, tokenId: asset.id }),
              tokenId: asset.id,
              tokenPriceTokens: asset.tokenPrice,
              collateralFactor: asset.collateralFactor,
            }).times(100),
          );
        }

        return { ...acc, assets: [...assetAcc, asset] };
      },
      {
        assets: [],
        userTotalBorrowBalanceCents: new BigNumber(0),
        userTotalBorrowLimitCents: new BigNumber(0),
        userTotalSupplyBalanceCents: new BigNumber(0),
        totalMiaDistributedWei: new BigNumber(0),
      },
    );

    let assetList = assets;

    const userTotalBorrowBalanceWithUserMintedSeb = userTotalBorrowBalanceCents.plus(
      userMintedSebData
        ? convertWeiToTokens({
            valueWei: userMintedSebData.mintedSebWei,
            tokenId: TOKENS_EVMOS.seb.id as TokenId,
          })
            // Convert SEB to dollar cents (we assume 1 SEB = 1 dollar)
            .times(100)
        : 0,
    );

    // percent of limit
    assetList = assetList.map((item: Asset) => ({
      ...item,
      percentOfLimit: new BigNumber(userTotalBorrowLimitCents).isZero()
        ? '0'
        : item.borrowBalance
            .times(item.tokenPrice)
            .div(userTotalBorrowLimitCents)
            .times(100)
            .dp(0, 1)
            .toFixed(),
    }));

    return {
      assets: assetList,
      userTotalBorrowBalanceCents: userTotalBorrowBalanceWithUserMintedSeb,
      userTotalBorrowLimitCents,
      userTotalSupplyBalanceCents,
      dailyMiaWei: getMarketsData.dailyMiaWei || new BigNumber(0),
      totalMiaDistributedWei,
    };
  }, [
    userMintedSebData?.mintedSebWei.toFixed(),
    JSON.stringify(marketsMap),
    JSON.stringify(assetsInAccount),
    JSON.stringify(nTokenBalances),
    JSON.stringify(getMarketsData),
  ]);

  return {
    isLoading,
    data,
    // TODO: handle errors and retry scenarios
  };

};

export default useGetUserMarketInfo;
