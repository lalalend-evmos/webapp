import type { TransactionReceipt } from 'web3-core/types';

//import { MiaVesting } from 'types/contracts_evmos';
 
/*export interface WithdrawMiaInput {
  miaVestingContract: MiaVesting;
  accountAddress: string;
}*/

export type WithdrawMiaOutput = TransactionReceipt;

const withdrawMia = ({
  miaVestingContract,
  accountAddress,
}: any): Promise<WithdrawMiaOutput> => //WithdrawMiaInput
  miaVestingContract.methods.withdraw().send({
    from: accountAddress,
  });

export default withdrawMia;
