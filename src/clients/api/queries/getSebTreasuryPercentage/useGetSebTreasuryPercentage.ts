import { QueryObserverOptions, useQuery } from 'react-query';

import { GetSebTreasuryPercentageOutput, getSebTreasuryPercentage } from 'clients/api';
import { useSebUnitrollerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
GetSebTreasuryPercentageOutput,
  Error,
  GetSebTreasuryPercentageOutput,
  GetSebTreasuryPercentageOutput,
  FunctionKey.GET_SEB_TREASURY_PERCENTAGE
>;

const useGetSebTreasuryPercentage = (options?: Options) => {
  const sebControllerContract = useSebUnitrollerContract();

  return useQuery(
    FunctionKey.GET_SEB_TREASURY_PERCENTAGE,
    () => getSebTreasuryPercentage({ sebControllerContract }),
    options,
  );
};

export default useGetSebTreasuryPercentage;
