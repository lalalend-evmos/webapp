import { MutationObserverOptions, useMutation } from 'react-query';

import {
  ClaimMiaVaultRewardInput,
  ClaimMiaVaultRewardOutput,
  claimMiaVaultReward,
  queryClient, 
} from 'clients/api';
import { useMiaVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { MIA_TOKEN_ADDRESS } from 'constants/mia';

type Options = MutationObserverOptions<
  ClaimMiaVaultRewardOutput,
  Error,
  Omit<ClaimMiaVaultRewardInput, 'miaVaultContract'>
>;

const useClaimMiaVaultReward = (options?: Options) => {
  const miaVaultContract = useMiaVaultProxyContract();

  return useMutation(
    FunctionKey.CLAIM_MIA_VAULT_REWARD,
    (params: Omit<ClaimMiaVaultRewardInput, 'miaVaultContract'>) =>
      claimMiaVaultReward({
        miaVaultContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { fromAccountAddress, poolIndex } = onSuccessParams[1];

        queryClient.invalidateQueries([
          FunctionKey.GET_MIA_VAULT_PENDING_REWARD,
          { accountAddress: fromAccountAddress, rewardTokenAddress: MIA_TOKEN_ADDRESS, poolIndex },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useClaimMiaVaultReward;
