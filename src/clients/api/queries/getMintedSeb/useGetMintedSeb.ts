import { QueryObserverOptions, useQuery } from 'react-query';

import getMintedSeb, {
  GetMintedSebInput,
  GetMintedSebOutput,
} from 'clients/api/queries/getMintedSeb';
import { useComptrollerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
GetMintedSebOutput,
  Error,
  GetMintedSebOutput,
  GetMintedSebOutput,
  FunctionKey.GET_MINTED_SEB
>;

const useGetMintedSeb = (
  { accountAddress }: Omit<GetMintedSebInput, 'comptrollerContract'>,
  options?: Options,
) => {
  const comptrollerContract = useComptrollerContract();

  return useQuery(
    FunctionKey.GET_MINTED_SEB,
    () => getMintedSeb({ accountAddress, comptrollerContract }),
    options,
  );
};

export default useGetMintedSeb;
