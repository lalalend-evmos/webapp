import { QueryObserverOptions, useQuery } from 'react-query';

import getNTokenBalancesAll, {
  GetNTokenBalancesAllInput,
  IGetNTokenBalancesAllOutput,
} from 'clients/api/queries/getNTokenBalancesAll';
import { useMiaLensContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetNTokenBalancesAllOutput,
  Error,
  IGetNTokenBalancesAllOutput,
  IGetNTokenBalancesAllOutput,
  [FunctionKey.GET_N_TOKEN_BALANCES_ALL, Omit<GetNTokenBalancesAllInput, 'miaLensContract'>]
>;

const useGetNTokenBalancesAll = (
  { account, nTokenAddresses }: Omit<GetNTokenBalancesAllInput, 'miaLensContract'>,
  options?: Options,
) => {
  const miaLensContract = useMiaLensContract();
  return useQuery(
    [FunctionKey.GET_N_TOKEN_BALANCES_ALL, { account, nTokenAddresses }],
    () => getNTokenBalancesAll({ miaLensContract, account, nTokenAddresses }),
    options,
  );
};

export default useGetNTokenBalancesAll;
