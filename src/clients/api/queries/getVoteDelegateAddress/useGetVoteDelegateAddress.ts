import { QueryObserverOptions, useQuery } from 'react-query';

import {
  GetVoteDelegateAddressInput,
  GetVoteDelegateAddressOutput,
  getVoteDelegateAddress,
} from 'clients/api';
import { useMiaVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVoteDelegateAddressOutput,
  Error,
  GetVoteDelegateAddressOutput,
  GetVoteDelegateAddressOutput,
  [FunctionKey.GET_VOTE_DELEGATE_ADDRESS, Omit<GetVoteDelegateAddressInput, 'miaVaultContract'>]
>;

const useGetVoteDelegateAddress = (
  { accountAddress }: Omit<GetVoteDelegateAddressInput, 'miaVaultContract'>,
  options?: Options,
) => {
  const miaVaultContract = useMiaVaultProxyContract();

  return useQuery(
    [FunctionKey.GET_VOTE_DELEGATE_ADDRESS, { accountAddress }],
    () => getVoteDelegateAddress({ miaVaultContract, accountAddress }),
    options,
  );
};

export default useGetVoteDelegateAddress;
