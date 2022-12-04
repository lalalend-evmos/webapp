import BigNumber from 'bignumber.js';

import { NErc20, NEvmosToken } from 'types/contracts_evmos';

export interface GetNTokenCashInput {
  nTokenContract: NErc20 | NEvmosToken;
}

export type GetNTokenCashOutput = {
  cashWei: BigNumber;
};

const getNTokenCash = async ({
  nTokenContract,
}: GetNTokenCashInput): Promise<GetNTokenCashOutput> => {
  const res = await nTokenContract.methods.getCash().call();

  return {
    cashWei: new BigNumber(res),
  };
};

export default getNTokenCash;
