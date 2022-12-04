import { MutationObserverOptions, useMutation } from 'react-query';

import { RepayEvmosInput, RepayEvmosOutput, queryClient, repayEvmos } from 'clients/api';
import { useWeb3 } from 'clients/web3'; 
import FunctionKey from 'constants/functionKey';
import { TOKENS_EVMOS } from 'constants/tokens';

type Options = MutationObserverOptions<RepayEvmosOutput, Error, Omit<RepayEvmosInput, 'web3'>>;

const useRepayNonEvmosNToken = (options?: Options) => {
  const web3 = useWeb3();

  return useMutation(
    FunctionKey.REPAY_EVMOS,
    params =>
      repayEvmos({
        web3,
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
          {
            accountAddress: fromAccountAddress,
            nTokenId: TOKENS_EVMOS.wevmos.id,
          },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRepayNonEvmosNToken;
