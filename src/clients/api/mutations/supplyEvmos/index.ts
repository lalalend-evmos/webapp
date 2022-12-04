import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import Web3 from 'web3';
import type { TransactionReceipt } from 'web3-core';

import { NTOKENS_EVMOS } from 'constants/tokens';
import { NEvmosToken } from 'types/contracts_evmos';

export interface SupplyEvmosInput {
  tokenContract: NEvmosToken;
  web3: Web3;
  account: string;
  amountWei: BigNumber;
}

export type SupplyEvmosOutput = TransactionReceipt;

const supplyEvmos = async ({
  web3,
  tokenContract,
  account,
  amountWei,
}: SupplyEvmosInput): Promise<SupplyEvmosOutput> => {
  const contractData = tokenContract.methods.mint().encodeABI();
  const tx = {
    from: account,
    to: NTOKENS_EVMOS.wevmos.address,
    value: amountWei.toFixed(),
    data: contractData,
  };

  const resp = await web3.eth.sendTransaction(tx);
  return checkForTokenTransactionError(resp);
};

export default supplyEvmos;
