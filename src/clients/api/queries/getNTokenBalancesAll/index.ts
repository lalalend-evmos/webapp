import { MiaLens } from 'types/contracts_evmos';

export interface GetNTokenBalancesAllInput {
  miaLensContract: MiaLens;
  account: string;
  nTokenAddresses: string[];
}

interface GetNTokenBalancesAllResponse extends Array<string> {
  balanceOf: string;
  balanceOfUnderlying: string;
  borrowBalanceCurrent: string;
  tokenAllowance: string;
  tokenBalance: string;
  nToken: string;
}

interface GetNTokenBalanceOutput {
  balanceOf: string;
  balanceOfUnderlying: string;
  borrowBalanceCurrent: string;
  tokenAllowance: string;
  tokenBalance: string;
  nToken: string;
}

export type IGetNTokenBalancesAllOutput = {
  balances: GetNTokenBalanceOutput[];
};

const getNTokenBalancesAll = async ({
  miaLensContract,
  nTokenAddresses,
  account,
}: GetNTokenBalancesAllInput): Promise<IGetNTokenBalancesAllOutput> => {
  const response = await miaLensContract.methods
    .nTokenBalancesAll(nTokenAddresses, account?.toLowerCase())
    .call();

  // This is original returned as an array with these properties but at some
  // point the properties are getting removed from the type
  const balances = (response as unknown as GetNTokenBalancesAllResponse[]).map(item => ({
    balanceOf: item.balanceOf,
    balanceOfUnderlying: item.balanceOfUnderlying,
    borrowBalanceCurrent: item.borrowBalanceCurrent,
    tokenAllowance: item.tokenAllowance,
    tokenBalance: item.tokenBalance,
    nToken: item.nToken,
  }));

  return { balances };
};

export default getNTokenBalancesAll;
