import { QueryObserverOptions, useQuery } from 'react-query';

import getMiaVaultRewardPerBlock, {
  GetMiaVaultRewardPerBlockInput,
  GetMiaVaultRewardPerBlockOutput,
} from 'clients/api/queries/getMiaVaultRewardPerBlock';
import { useMiaVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMiaVaultRewardPerBlockOutput,
  Error,
  GetMiaVaultRewardPerBlockOutput,
  GetMiaVaultRewardPerBlockOutput,
  [FunctionKey.GET_MIA_VAULT_REWARD_PER_BLOCK, string]
>;

const useGetMiaVaultRewardPerBlock = (
  { tokenAddress }: Omit<GetMiaVaultRewardPerBlockInput, 'miaVaultContract'>,
  options?: Options,
) => {
  const miaVaultContract = useMiaVaultProxyContract();

  return useQuery(
    [FunctionKey.GET_MIA_VAULT_REWARD_PER_BLOCK, tokenAddress],
    () => getMiaVaultRewardPerBlock({ tokenAddress, miaVaultContract }),
    options,
  );
};

export default useGetMiaVaultRewardPerBlock;
