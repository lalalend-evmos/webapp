import { MutationObserverOptions, useMutation } from 'react-query';

import { MintSebInput, MintSebOutput, mintSeb, queryClient } from 'clients/api';
import { useSebUnitrollerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions< 
  MintSebOutput,
  Error,
  Omit<MintSebInput, 'sebControllerContract'>
>;

const useMintSeb = (options?: Options) => {
  const sebControllerContract = useSebUnitrollerContract();

  return useMutation(
    FunctionKey.MINT_SEB,
    (params: Omit<MintSebInput, 'sebControllerContract'>) =>
      mintSeb({
        sebControllerContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        // Invalidate queries related to fetching the user minted SEB amount
        queryClient.invalidateQueries(FunctionKey.GET_MINTED_SEB);
        queryClient.invalidateQueries(FunctionKey.GET_N_TOKEN_BALANCES_ALL);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useMintSeb;
