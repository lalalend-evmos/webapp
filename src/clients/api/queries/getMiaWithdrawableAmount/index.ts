import BigNumber from 'bignumber.js';

//import { MiaVesting } from 'types/contracts_evmos';

/*export interface GetMiaWithdrawableAmountInput {
  miaVestingContract: MiaVesting;
  accountAddress: string;
}

export interface GetMiaWithdrawableAmountOutput {
  totalWithdrawableAmount: BigNumber;
  totalVestedAmount: BigNumber;
  totalWithdrawnAmount: BigNumber;
}

const getMiaWithdrawableAmount = {/*async ({
  miaVestingContract,
  accountAddress,
}: GetMiaWithdrawableAmountInput): Promise<GetMiaWithdrawableAmountOutput> => {
  const resp = await miaVestingContract.methods.getWithdrawableAmount(accountAddress).call();
  return {
    totalWithdrawableAmount: new BigNumber(resp.totalWithdrawableAmount),
    totalVestedAmount: new BigNumber(resp.totalVestedAmount),
    totalWithdrawnAmount: new BigNumber(resp.totalWithdrawnAmount),
  };
  return 0;
};
*/
const getMiaWithdrawableAmount = () => {
  return 0;
}

export default getMiaWithdrawableAmount;
