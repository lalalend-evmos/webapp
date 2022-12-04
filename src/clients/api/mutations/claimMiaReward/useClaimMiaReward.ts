import { MutationObserverOptions, useMutation } from 'react-query';

import {
  ClaimMiaRewardInput,
  ClaimMiaRewardOutput,
  claimMiaReward,
  queryClient, 
} from 'clients/api';
import { useComptrollerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<
  ClaimMiaRewardOutput,
  Error,
  Omit<ClaimMiaRewardInput, 'comptrollerContract' | 'miaLensContract'>
>;

const useClaimMiaReward = (options?: Options) => {
  const comptrollerContract = useComptrollerContract();

  return useMutation(
    FunctionKey.CLAIM_MIA_REWARD,
    (params: Omit<ClaimMiaRewardInput, 'comptrollerContract' | 'miaLensContract'>) =>
      claimMiaReward({
        comptrollerContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        queryClient.resetQueries(FunctionKey.GET_MIA_REWARD);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useClaimMiaReward;
