import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import { NTokenId } from 'types';
import type { TransactionReceipt } from 'web3-core/types';

import { NTokenContract } from 'clients/contracts/types';
import MAX_UINT256 from 'constants/maxUint256';

export interface RepayNonEvmosNTokenInput {
  nTokenContract: NTokenContract<Exclude<NTokenId, 'wevmos'>>;
  fromAccountAddress: string;
  amountWei: BigNumber;
  isRepayingFullLoan?: boolean;
}

export type RepayNonEvmosNTokenOutput = TransactionReceipt;

const repayNonEvmosNToken = async ({
  nTokenContract,
  fromAccountAddress,
  amountWei,
  isRepayingFullLoan = false,
}: RepayNonEvmosNTokenInput): Promise<RepayNonEvmosNTokenOutput> => {
  const resp = await nTokenContract.methods
    .repayBorrow(isRepayingFullLoan ? MAX_UINT256.toFixed() : amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForTokenTransactionError(resp);
};

export default repayNonEvmosNToken;
