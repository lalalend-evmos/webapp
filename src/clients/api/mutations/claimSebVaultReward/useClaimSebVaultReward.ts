import { MutationObserverOptions, useMutation } from 'react-query';

import {
  ClaimSebVaultRewardInput,
  ClaimSebVaultRewardOutput,
  claimSebVaultReward,
  queryClient,
} from 'clients/api';
import { useSebVaultContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<
  ClaimSebVaultRewardOutput,
  Error,
  Omit<ClaimSebVaultRewardInput, 'sebVaultContract'>
>; 

const useClaimSebVaultReward = (options?: Options) => {
  const sebVaultContract = useSebVaultContract();

  return useMutation(
    FunctionKey.CLAIM_SEB_VAULT_REWARD,
    (params: Omit<ClaimSebVaultRewardInput, 'sebVaultContract'>) =>
      claimSebVaultReward({
        sebVaultContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_SEB_VAULT_PENDING_MIA);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useClaimSebVaultReward;
