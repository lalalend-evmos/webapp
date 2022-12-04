import { QueryObserverOptions, useQuery } from 'react-query';

import getMintableSeb, {
  GetMintableSebInput,
  GetMintableSebOutput,
} from 'clients/api/queries/getMintableSeb';
import { useSebUnitrollerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMintableSebOutput,
  Error,
  GetMintableSebOutput,
  GetMintableSebOutput,
  [FunctionKey.GET_MINTABLE_SEB, Omit<GetMintableSebInput, 'sebControllerContract'>]
>;
  
const useGetMintableSeb = (
  params: Omit<GetMintableSebInput, 'sebControllerContract'>,
  options?: Options,
) => {
  const sebControllerContract = useSebUnitrollerContract();

  return useQuery(
    [FunctionKey.GET_MINTABLE_SEB, params],
    () => getMintableSeb({ sebControllerContract, ...params }),
    options,
  ); 
};

export default useGetMintableSeb;
