import BigNumber from 'bignumber.js';

//import { Bep20, SebToken, VrtToken, MiaToken } from 'types/contracts';
import { Erc20, SebToken, MiaToken } from 'types/contracts_evmos';

export interface GetBalanceOfInput {
  tokenContract:  MiaToken | Erc20 | SebToken;
  accountAddress: string;
}

export type GetBalanceOfOutput = {
  balanceWei: BigNumber;
};

const getBalanceOf = async ({
  tokenContract,
  accountAddress,
}: GetBalanceOfInput): Promise<GetBalanceOfOutput> => {
  const resp = await tokenContract.methods.balanceOf(accountAddress).call();

  return {
    balanceWei: new BigNumber(resp),
  };
};

export default getBalanceOf;
