import BigNumber from 'bignumber.js';

import { SebUnitroller } from 'types/contracts_evmos';

export interface GetMintableSebInput {
  sebControllerContract: SebUnitroller;
  accountAddress: string;
}

export interface GetMintableSebOutput {
  mintableSebWei: BigNumber;
}
