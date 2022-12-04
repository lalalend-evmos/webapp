import { MutationObserverOptions, useMutation } from 'react-query';
import { getContractAddress } from 'utilities';

import {
  StakeInSebVaultInput,
  StakeInSebVaultOutput, 
  queryClient,
  stakeInSebVault,
} from 'clients/api';
import { useSebVaultContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { TOKENS_EVMOS } from 'constants/tokens';

const SEB_VAULT_ADDRESS = getContractAddress('sebVault');

type Options = MutationObserverOptions<
  StakeInSebVaultOutput,
  Error,
  Omit<StakeInSebVaultInput, 'sebVaultContract'>
>;

const useStakeInSebVault = (options?: Options) => {
  const sebVaultContract = useSebVaultContract();

  return useMutation(
    FunctionKey.STAKE_IN_SEB_VAULT,
    (params: Omit<StakeInSebVaultInput, 'sebVaultContract'>) =>
      stakeInSebVault({
        sebVaultContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { fromAccountAddress } = onSuccessParams[1];

        // Invalidate cached user info, including pending reward
        queryClient.invalidateQueries([FunctionKey.GET_SEB_VAULT_USER_INFO, fromAccountAddress]);

        // Invalidate cached user balance
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          fromAccountAddress,
          TOKENS_EVMOS.seb.id,
        ]);

        // Invalidate cached vault data
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          SEB_VAULT_ADDRESS,
          TOKENS_EVMOS.seb.id,
        ]);

        queryClient.invalidateQueries(FunctionKey.GET_MIA_SEB_VAULT_DAILY_RATE);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useStakeInSebVault;
