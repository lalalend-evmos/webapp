import { MutationObserverOptions, useMutation } from 'react-query';

import { SetVoteDelegateInput, SetVoteDelegateOutput, setVoteDelegate } from 'clients/api';
import queryClient from 'clients/api/queryClient';
import { useMiaVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

const useSetVoteDelegate = (
  options?: MutationObserverOptions<
    SetVoteDelegateOutput,
    Error,
    Omit<SetVoteDelegateInput, 'miaVaultContract'>
  >,
) => {
  const miaVaultContract = useMiaVaultProxyContract();
  return useMutation(
    FunctionKey.SET_VOTE_DELEGATE,
    params =>
      setVoteDelegate({
        miaVaultContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        const { accountAddress } = onSuccessParams[1];

        queryClient.invalidateQueries([FunctionKey.GET_VOTE_DELEGATE_ADDRESS, { accountAddress }]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useSetVoteDelegate;
