import { QueryObserverOptions, useQuery } from 'react-query';
import { NTokenId } from 'types';

import getNTokenInterestRateModel, {
  GetNTokenInterestRateModelOutput,
} from 'clients/api/queries/getNTokenInterestRateModel';
import { useNTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetNTokenInterestRateModelOutput,
  Error,
  GetNTokenInterestRateModelOutput,
  GetNTokenInterestRateModelOutput,
  [FunctionKey.GET_N_TOKEN_INTEREST_RATE_MODEL, NTokenId]
>;

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key : any, value : any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

const useGetNTokenInterestRateModel = ({ nTokenId }: { nTokenId: NTokenId }, options?: Options) => {
  const nTokenContract = useNTokenContract(nTokenId);
  //console.log("nTokenContract : " + JSON.stringify(nTokenContract, getCircularReplacer()));
  
  return useQuery(
    [FunctionKey.GET_N_TOKEN_INTEREST_RATE_MODEL, nTokenId],
    () => getNTokenInterestRateModel({ nTokenContract }),
    options,
  );
};

export default useGetNTokenInterestRateModel;
