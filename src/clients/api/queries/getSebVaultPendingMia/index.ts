import BigNumber from 'bignumber.js';

import { SebVault } from 'types/contracts_evmos';

export interface GetSebVaultPendingMiaInput {
  sebVaultContract: SebVault;
  accountAddress: string;
}

export type GetSebVaultPendingMiaOutput = {
  pendingMiaWei: BigNumber;
};

const getSebVaultPendingMia = async ({
  sebVaultContract,
  accountAddress,
}: GetSebVaultPendingMiaInput): Promise<GetSebVaultPendingMiaOutput> => {
  const res = await sebVaultContract.methods.pendingMIA(accountAddress).call();

  return {
    pendingMiaWei: new BigNumber(res),
  };
};

export default getSebVaultPendingMia;
