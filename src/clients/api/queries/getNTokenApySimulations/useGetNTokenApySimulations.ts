import BigNumber from 'bignumber.js';
import { QueryObserverOptions, useQuery } from 'react-query';
import { NTokenId } from 'types';

import getNTokenApySimulations, {
  GetNTokenApySimulationsOutput,
} from 'clients/api/queries/getNTokenApySimulations';
import useGetNTokenInterestRateModel from 'clients/api/queries/getNTokenInterestRateModel/useGetNTokenInterestRateModel';
import { getInterestModelContract } from 'clients/contracts/getters';
import { useWeb3 } from 'clients/web3';
import FunctionKey from 'constants/functionKey';
import { InterestModel } from 'types/contracts_evmos';

type Options = QueryObserverOptions<
  GetNTokenApySimulationsOutput,
  Error,
  GetNTokenApySimulationsOutput,
  GetNTokenApySimulationsOutput,
  [FunctionKey.GET_N_TOKEN_APY_SIMULATIONS, NTokenId]
>;

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key:any, value:any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

const useGetNTokenApySimulations = (
  { nTokenId, reserveFactorMantissa }: { nTokenId: NTokenId; reserveFactorMantissa?: BigNumber },
  options?: Options,
) => {
  const web3 = useWeb3();
  const { data: interestRateModelData } = useGetNTokenInterestRateModel({ nTokenId });

  console.log("IRMODEL contract address = "+ interestRateModelData?.contractAddress);
  
  const interestModelContract = interestRateModelData?.contractAddress
    ? getInterestModelContract(interestRateModelData.contractAddress, web3)
    : undefined;
    if(interestModelContract === undefined) {
      console.log("undefined for IR contract instance");
      
    }
  console.log('IRmodel data for ' +  nTokenId + " is "+ JSON.stringify(interestModelContract,getCircularReplacer()));
console.log("reservefactor is " + reserveFactorMantissa);


  // TO RESOLVE : getnTOKENApy n'est pas appellee
  return useQuery(
    [FunctionKey.GET_N_TOKEN_APY_SIMULATIONS, nTokenId],
    () =>
      getNTokenApySimulations({
        interestModelContract: interestModelContract || ({} as InterestModel),
        reserveFactorMantissa: reserveFactorMantissa || new BigNumber(0),
      }),
    {
      ...options,
      enabled:
        (options?.enabled === undefined || options?.enabled) &&
        interestRateModelData?.contractAddress !== undefined &&
        reserveFactorMantissa !== undefined,
    },
  );
};

export default useGetNTokenApySimulations;
