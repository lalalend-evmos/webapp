import { NError } from 'errors';
import { MarketSnapshot, NTokenId } from 'types';
import { getNErc20Token, restService } from 'utilities';

export interface GetMarketHistoryResponse {
  limit: number;
  total: number;
  result: MarketSnapshot[];
}

export interface GetMarketHistoryInput {
  nTokenId: NTokenId;
  limit?: number;
  type?: string;
}

export type GetMarketHistoryOutput = {
  marketSnapshots: MarketSnapshot[];
};

const getMarketHistory = async ({
  nTokenId,
  limit = 30,
  type = '1day',
}: GetMarketHistoryInput): Promise<GetMarketHistoryOutput> => {
  const tokenAddress = getNErc20Token(nTokenId).address;

  let endpoint = `/market_history/graph?asset=${tokenAddress}&type=${type}`;
  if (limit) {
    endpoint += `&limit=${limit}`;
  }

  const response = await restService<GetMarketHistoryResponse>({
    endpoint,
    method: 'GET',
  });

  // @todo Add specific api error handling
  if ('result' in response && response.result === 'error') {
    console.log("error happened here for market api route");
    throw new NError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { message: response.message },
    });
  }

  return {
    marketSnapshots: response.data?.data.result || [],
  };
};

export default getMarketHistory;
