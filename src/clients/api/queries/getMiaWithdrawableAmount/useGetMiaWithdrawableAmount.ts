import { QueryObserverOptions, useQuery } from 'react-query';

/*import getMiaWithdrawableAmount, {
  GetMiaWithdrawableAmountInput,
  GetMiaWithdrawableAmountOutput,
} from 'clients/api/queries/getMiaWithdrawableAmount';*/
//import { useMiaVestingProxyContract } from 'clients/contracts/hooks';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

/*type Options = QueryObserverOptions<
  GetMiaWithdrawableAmountOutput,
  Error,
  GetMiaWithdrawableAmountOutput,
  GetMiaWithdrawableAmountOutput,
  FunctionKey.GET_MIA_WITHDRAWABLE_AMOUNT
>;*/

const useGetMiaWithdrawableAmount = (
  { accountAddress }: any //Omit<GetMiaWithdrawableAmountInput, 'miaVestingContract'>,
  //options?: Options,
) => {
  //const miaVestingContract = useMiaVestingProxyContract();

  return 0;/*useQuery(
    FunctionKey.GET_MIA_WITHDRAWABLE_AMOUNT,
    () => getMiaWithdrawableAmount({ miaVestingContract, accountAddress }),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
    },
  );*/
};

export default useGetMiaWithdrawableAmount;
