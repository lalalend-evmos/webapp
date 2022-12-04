import BigNumber from 'bignumber.js';

import { NErc20, NEvmosToken } from 'types/contracts_evmos';

export interface GetNTokenBalanceOfInput {
  nTokenContract: NErc20 | NEvmosToken;
  accountAddress: string;
}

export type GetNTokenBalanceOfOutput = {
  balanceWei: BigNumber;
};

const getNTokenBalanceOf = async ({
  nTokenContract,
  accountAddress,
}: GetNTokenBalanceOfInput): Promise<GetNTokenBalanceOfOutput> => {
  const res = await nTokenContract.methods.balanceOf(accountAddress).call();

  return {
    balanceWei: new BigNumber(res),
  };
};

export default getNTokenBalanceOf;
