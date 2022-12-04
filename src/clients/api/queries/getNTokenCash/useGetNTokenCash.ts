import { QueryObserverOptions, useQuery } from 'react-query';
import { NTokenId } from 'types';

import getNTokenCash, { GetNTokenCashOutput } from 'clients/api/queries/getNTokenCash';
import { useNTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetNTokenCashOutput,
  Error,
  GetNTokenCashOutput,
  GetNTokenCashOutput,
  [FunctionKey.GET_N_TOKEN_CASH, NTokenId]
>;

const useGetNTokenCash = ({ nTokenId }: { nTokenId: NTokenId }, options?: Options) => {
  const nTokenContract = useNTokenContract(nTokenId);

  return useQuery(
    [FunctionKey.GET_N_TOKEN_CASH, nTokenId],
    () => getNTokenCash({ nTokenContract }),
    options,
  );
};

export default useGetNTokenCash;
