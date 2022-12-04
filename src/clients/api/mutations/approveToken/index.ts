import type { TransactionReceipt } from 'web3-core';

import ALLOWANCE_AMOUNT_WEI from 'constants/allowanceAmountWei';
import { Erc20, SebToken, MiaToken } from 'types/contracts_evmos';

export interface ApproveTokenInput {
  tokenContract: Erc20 | SebToken | MiaToken;
  accountAddress: string;
  spenderAddress: string;
  allowance?: string;
}

export type ApproveTokenOutput = TransactionReceipt;

const approveToken = ({
  tokenContract,
  accountAddress,
  spenderAddress,
  allowance = ALLOWANCE_AMOUNT_WEI,
}: ApproveTokenInput): Promise<ApproveTokenOutput> =>
  tokenContract.methods.approve(spenderAddress, allowance).send({ from: accountAddress });

export default approveToken;
