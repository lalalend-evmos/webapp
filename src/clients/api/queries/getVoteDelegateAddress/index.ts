import { NULL_ADDRESS } from 'constants/address';
import { MiaVault } from 'types/contracts_evmos';

export interface GetVoteDelegateAddressInput {
  miaVaultContract: MiaVault;
  accountAddress: string;
}

export type GetVoteDelegateAddressOutput = {
  delegateAddress: string | undefined;
};

/**
 *
 * @param address string (valid Ethereum address)
 * @returns Delegated address, if no delegation returns undefined
 */
const getVoteDelegateAddress = async ({
  miaVaultContract,
  accountAddress,
}: GetVoteDelegateAddressInput): Promise<GetVoteDelegateAddressOutput> => {
  const resp = await miaVaultContract.methods.delegates(accountAddress).call();

  return {
    delegateAddress: resp !== NULL_ADDRESS ? resp : undefined,
  };
};

export default getVoteDelegateAddress;
