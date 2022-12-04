import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import { getNErc20Token } from 'utilities';
import Web3 from 'web3';
import type { TransactionReceipt } from 'web3-core/types';

import { getMaximillionContract, getNTokenContract } from 'clients/contracts';

export interface RepayEvmosInput {
  web3: Web3;
  fromAccountAddress: string;
  amountWei: BigNumber;
  isRepayingFullLoan?: boolean;
}

export type RepayEvmosOutput = TransactionReceipt;

export const REPAYMENT_EVMOS_BUFFER_PERCENTAGE = 0.001;
const NEVMOS_ADDRESS = getNErc20Token('wevmos').address;

const repayEvmos = async ({
  web3,
  fromAccountAddress,
  amountWei,
  isRepayingFullLoan = false,
}: RepayEvmosInput): Promise<RepayEvmosOutput> => {
  let resp: TransactionReceipt;

  // If we're repaying a full loan, we need to call the Maximillion contract to
  // do so. If we partially repay a loan, we need to send the EVMOS amount to
  // repay to the nEvmos contract
  if (isRepayingFullLoan) {
    const maximillionContract = getMaximillionContract(web3);
    const amountWithBuffer = amountWei.multipliedBy(1 + REPAYMENT_EVMOS_BUFFER_PERCENTAGE);

    resp = await maximillionContract.methods
      .repayBehalfExplicit(fromAccountAddress, NEVMOS_ADDRESS)
      .send({
        from: fromAccountAddress,
        value: amountWithBuffer.toFixed(0),
      });
  } else {
    const nEvmosContract = getNTokenContract('wevmos', web3);
    const contractData = nEvmosContract.methods.repayBorrow().encodeABI();

    resp = await web3.eth.sendTransaction({
      from: fromAccountAddress,
      to: NEVMOS_ADDRESS,
      value: amountWei.toFixed(),
      data: contractData,
    });
  }

  return checkForTokenTransactionError(resp);
};

export default repayEvmos;
