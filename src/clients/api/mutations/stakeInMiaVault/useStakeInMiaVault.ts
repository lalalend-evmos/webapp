import { MutationObserverOptions, useMutation } from 'react-query';
import { TokenId } from 'types';
import { getContractAddress } from 'utilities';

import { 
  StakeInMiaVaultInput,
  StakeInMiaVaultOutput,
  queryClient,
  stakeInMiaVault,
} from 'clients/api';
import { useMiaVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { MIA_TOKEN_ADDRESS } from 'constants/mia';

const MIA_VAULT_PROXY_CONTRACT_ADDRESS = getContractAddress('miaVaultProxy');

type Options = MutationObserverOptions<
StakeInMiaVaultOutput,
  Error,
  Omit<StakeInMiaVaultInput, 'miaVaultContract'>
>;

const useStakeInMiaVault = ({ stakedTokenId }: { stakedTokenId: TokenId }, options?: Options) => {
  const miaVaultContract = useMiaVaultProxyContract();

  return useMutation(
    FunctionKey.STAKE_IN_MIA_VAULT,
    (params: Omit<StakeInMiaVaultInput, 'miaVaultContract'>) =>
      stakeInMiaVault({
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

export default useStakeInMiaVault;
