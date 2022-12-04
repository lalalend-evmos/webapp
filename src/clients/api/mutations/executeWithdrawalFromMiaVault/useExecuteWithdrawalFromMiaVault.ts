import { MutationObserverOptions, useMutation } from 'react-query';
import { TokenId } from 'types';
import { getContractAddress } from 'utilities';

import {
  ExecuteWithdrawalFromMiaVaultInput,
  ExecuteWithdrawalFromMiaVaultOutput,
  executeWithdrawalFromMiaVault, 
  queryClient,
} from 'clients/api';
import { useMiaVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { MIA_TOKEN_ADDRESS } from 'constants/mia';

const MIA_VAULT_PROXY_CONTRACT_ADDRESS = getContractAddress('miaVaultProxy');

type Options = MutationObserverOptions<
ExecuteWithdrawalFromMiaVaultOutput,
  Error,
  Omit<ExecuteWithdrawalFromMiaVaultInput, 'miaVaultContract'>
>;

const useExecuteWithdrawalFromMiaVault = (
  { stakedTokenId }: { stakedTokenId: TokenId },
  options?: Options,
) => {
  const miaVaultContract = useMiaVaultProxyContract();

  return useMutation(
    FunctionKey.REQUEST_WITHDRAWAL_FROM_MIA_VAULT,
    (params: Omit<ExecuteWithdrawalFromMiaVaultInput, 'miaVaultContract'>) =>
      executeWithdrawalFromMiaVault({
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
          {
            rewardTokenAddress: MIA_TOKEN_ADDRESS,
            poolIndex,
            accountAddress: fromAccountAddress,
          },
        ]);

        // Invalidate cached user balance
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          fromAccountAddress,
          stakedTokenId,
        ]);

        // Invalidate cached vault data
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          MIA_VAULT_PROXY_CONTRACT_ADDRESS,
          stakedTokenId,
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_MIA_VAULT_POOL_INFOS,
          { rewardTokenAddress: MIA_TOKEN_ADDRESS, poolIndex },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useExecuteWithdrawalFromMiaVault;
