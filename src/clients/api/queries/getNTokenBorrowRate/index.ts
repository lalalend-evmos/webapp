import BigNumber from 'bignumber.js';

import { InterestModel } from 'types/contracts_evmos';

export interface GetNTokenBorrowRateInput {
  interestModelContract: InterestModel;
  cashAmountWei: BigNumber;
  borrowsAmountWei: BigNumber;
  reservesAmountWei: BigNumber;
}

export type IGetNTokenBorrowRateOutput = {
  borrowRate: BigNumber;
};

const getNTokenBorrowRate = async ({
  interestModelContract,
  cashAmountWei,
  borrowsAmountWei,
  reservesAmountWei,
}: GetNTokenBorrowRateInput): Promise<IGetNTokenBorrowRateOutput> => {
  const res = await interestModelContract.methods
    .getBorrowRate(cashAmountWei.toFixed(), borrowsAmountWei.toFixed(), reservesAmountWei.toFixed())
    .call();

  return {
    borrowRate: new BigNumber(res),
  };
};

export default getNTokenBorrowRate;
