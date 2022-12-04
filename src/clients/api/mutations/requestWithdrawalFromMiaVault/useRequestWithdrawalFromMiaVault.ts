import { MutationObserverOptions, useMutation } from 'react-query';

import {
  RequestWithdrawalFromMiaVaultInput, 
  RequestWithdrawalFromMiaVaultOutput,
  queryClient,
  requestWithdrawalFromMiaVault,
} from 'clients/api';
import { useMiaVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { MIA_TOKEN_ADDRESS } from 'constants/mia';

type Options = MutationObserverOptions<
  RequestWithdrawalFromMiaVaultOutput,
  Error,
  Omit<RequestWithdrawalFromMiaVaultInput, 'miaVaultContract'>
>;

const useRequestWithdrawalFromMiaVault = (options?: Options) => {
  const miaVaultContract = useMiaVaultProxyContract();

  return useMutation(
    FunctionKey.REQUEST_WITHDRAWAL_FROM_MIA_VAULT,
    (params: Omit<RequestWithdrawalFromMiaVaultInput, 'miaVaultContract'>) =>
      requestWithdrawalFromMiaVault({
        miaVaultContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { fromAccountAddress, poolIndex } = onSuccessParams[1];

        // Invalidate cached user info
        queryClient.invalidateQueries([
          FunctionKey.GET_MIA_VAULT_USER_INFO,
          { accountAddress: fromAccountAddress, rewardTokenAddress: MIA_TOKEN_ADDRESS, poolIndex },
        ]);

        // Invalidate cached user pending reward
        queryClient.invalidateQueries([
          FunctionKey.GET_MIA_VAULT_PENDING_REWARD,
          { accountAddress: fromAccountAddress, rewardTokenAddress: MIA_TOKEN_ADDRESS, poolIndex },
        ]);

        // Invalidate cached user withdrawal requests
        queryClient.invalidateQueries([
          FunctionKey.GET_MIA_VAULT_WITHDRAWAL_REQUESTS,
          { accountAddress: fromAccountAddress, rewardTokenAddress: MIA_TOKEN_ADDRESS, poolIndex },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRequestWithdrawalFromMiaVault;
