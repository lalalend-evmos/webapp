import { MutationObserverOptions, useMutation } from 'react-query';
import { NTokenId } from 'types';

import {
  RepayEvmosOutput,
  RepayNonEvmosNTokenInput,
  queryClient, 
  repayNonEvmosNToken,
} from 'clients/api';
import { useNTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<
  RepayEvmosOutput,
  Error,
  Omit<RepayNonEvmosNTokenInput, 'nTokenContract'>
>;

const useRepayNonEvmosNToken = (
  { nTokenId }: { nTokenId: Exclude<NTokenId, 'wevmos'> },
  options?: Options,
) => {
  const nTokenContract = useNTokenContract(nTokenId);

  return useMutation(
    FunctionKey.REPAY_NON_EVMOS_N_TOKEN,
    params =>
      repayNonEvmosNToken({
        nTokenContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        const { fromAccountAddress } = onSuccessParams[1];

        queryClient.invalidateQueries(FunctionKey.GET_N_TOKEN_BALANCES_ALL);
        queryClient.invalidateQueries(FunctionKey.GET_MARKETS);
        queryClient.invalidateQueries([
          FunctionKey.GET_N_TOKEN_BORROW_BALANCE,
          { accountAddress: fromAccountAddress, nTokenId },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRepayNonEvmosNToken;
