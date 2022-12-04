import { MutationObserverOptions, useMutation } from 'react-query';

import { IRepaySebOutput, RepaySebInput, queryClient, repaySeb } from 'clients/api';
import { useSebUnitrollerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey'; 

type Options = MutationObserverOptions<
  IRepaySebOutput,
  Error,
  Omit<RepaySebInput, 'sebControllerContract'>
>;

const useRepaySeb = (options?: Options) => {
  const sebControllerContract = useSebUnitrollerContract();

  return useMutation(
    FunctionKey.REPAY_SEB ,
    (params: Omit<RepaySebInput, 'sebControllerContract'>) =>
      repaySeb({
        sebControllerContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        // Invalidate queries related to fetching the user minted SEB  amount
        queryClient.invalidateQueries(FunctionKey.GET_MINTED_SEB );
        queryClient.invalidateQueries(FunctionKey.GET_N_TOKEN_BALANCES_ALL);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRepaySeb;
