import { MutationObserverOptions, useMutation } from 'react-query';

import { /*WithdrawMiaInput*/ WithdrawMiaOutput, withdrawMia } from 'clients/api';
import queryClient from 'clients/api/queryClient';
//import { useMiaVestingProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
 
const useWithdrawMia = (
  options?: MutationObserverOptions<
    WithdrawMiaOutput,
    Error,
    Omit<any, 'miaVestingContract'> // WithdrawMiaInput
  >,
) => {
  //const miaVestingContract = useMiaVestingProxyContract();

  return 0; /*useMutation(
    FunctionKey.WITHDRAW_MIA,
    params =>
      withdrawMia({
        miaVestingContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_MIA_WITHDRAWABLE_AMOUNT);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );*/
};

export default useWithdrawMia;
