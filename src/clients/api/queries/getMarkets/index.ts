import BigNumber from 'bignumber.js';
import { Market, TokenId } from 'types';
import { restService } from 'utilities';

import { NTOKENS_EVMOS } from 'constants/tokens';

export interface GetMarketsResponse {
  dailyMia: number;
  markets: Market[];
  request: { addresses: string[] };
  miaRate: string;
}

export interface GetMarketsOutput {
  markets: Market[];
  dailyMiaWei: BigNumber | undefined;
}

const getMarkets = async (): Promise<GetMarketsOutput> => {
  const response = await restService<GetMarketsResponse>({
    endpoint: '/governance/mia',
    method: 'GET',
  });
  if ('result' in response && response.result === 'error') {
    throw new Error(response.message);
  }
  let markets: Market[] = [];
  let dailyMiaWei;
  console.log('response is : '+ JSON.stringify(response));
  
  if (response && response.data && response.data.data) {
    dailyMiaWei = new BigNumber(response.data.data.dailyMia);
    markets = Object.keys(NTOKENS_EVMOS).reduce<Market[]>((acc: Market[], curr: string) => { // changed : NTOKENS_EVMOS
      const activeMarket = response.data?.data.markets.find(
        (market: Market) => market.underlyingSymbol.toLowerCase() === curr.toLowerCase(),
      ); 
      if (activeMarket) {
        console.log('token price '+ activeMarket.tokenPrice);
        const price = new BigNumber(activeMarket.tokenPrice);
        const formattedActiveMarket = {
          ...activeMarket,
          id: activeMarket.underlyingSymbol.toLowerCase() as TokenId,
          tokenPrice: price.div(10**18),
          liquidity: new BigNumber(activeMarket.liquidity),
          borrowMiaApy: new BigNumber(activeMarket.borrowMiaApy),
          borrowApy: new BigNumber(activeMarket.borrowApy),
          supplyMiaApy: new BigNumber(activeMarket.supplyMiaApy),
          supplyApy: new BigNumber(activeMarket.supplyApy),
          treasuryTotalBorrowsCents: new BigNumber(activeMarket.totalBorrowsUsd),//times(100)
          treasuryTotalSupplyCents: new BigNumber(activeMarket.totalSupplyUsd), //times(100)
        };
        return [...acc, formattedActiveMarket];
      }
      return acc;
    }, []);
  }
  console.log('test Markets : ' + markets);
  
  return { markets, dailyMiaWei };
};

export default getMarkets;
