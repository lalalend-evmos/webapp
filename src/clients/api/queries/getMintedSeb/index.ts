import BigNumber from 'bignumber.js';

import { Comptroller } from 'types/contracts_evmos';

export interface GetMintedSebInput {
  comptrollerContract: Comptroller;
  accountAddress: string;
}

export type GetMintedSebOutput = {
  mintedSebWei: BigNumber;
};

const getMintedSeb = async ({
  comptrollerContract,
  accountAddress,
}: GetMintedSebInput): Promise<GetMintedSebOutput> => {
  const res = await comptrollerContract.methods.mintedSEBs(accountAddress).call();

  return {
    mintedSebWei: new BigNumber(res),
  };
};

export default getMintedSeb;
