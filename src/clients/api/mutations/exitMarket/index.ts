import { checkForComptrollerTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core';

import { Comptroller } from 'types/contracts_evmos';

export interface ExitMarketInput {
  comptrollerContract: Comptroller;
  accountAddress?: string;
  ntokenAddress: string;
}

export type ExitMarketOutput = TransactionReceipt;

const exitMarket = async ({
  comptrollerContract,
  accountAddress,
  ntokenAddress,
}: ExitMarketInput): Promise<ExitMarketOutput> => {
  const resp = await comptrollerContract.methods
    .exitMarket(ntokenAddress)
    .send({ from: accountAddress });
  return checkForComptrollerTransactionError(resp);
};

export default exitMarket;
