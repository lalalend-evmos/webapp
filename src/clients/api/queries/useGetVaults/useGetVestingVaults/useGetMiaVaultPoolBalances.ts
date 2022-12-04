import { UseQueryOptions, UseQueryResult, useQueries } from 'react-query';
import { getContractAddress, getTokenByAddress } from 'utilities';

import { GetBalanceOfOutput, getBalanceOf } from 'clients/api';
import { getTokenContractByAddress } from 'clients/contracts';
import { useWeb3 } from 'clients/web3';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import { Erc20 } from 'types/contracts_evmos';

const MIA_VAULT_PROXY_CONTRACT_ADDRESS = getContractAddress('miaVaultProxy');

export interface UseGetMiaVaultPoolBalancesInput {
  stakedTokenAddresses: (string | undefined)[];
}
  
export type UseGetMiaVaultPoolBalancesOutput = UseQueryResult<GetBalanceOfOutput>[];

const useGetMiaVaultPoolBalances = ({
  stakedTokenAddresses,
}: UseGetMiaVaultPoolBalancesInput): UseGetMiaVaultPoolBalancesOutput => {
  const web3 = useWeb3();

  // Fetch total amount of tokens staked in each pool
  const queries: UseQueryOptions<GetBalanceOfOutput>[] = stakedTokenAddresses.map(
    stakedTokenAddress => {
      const tokenContract = stakedTokenAddress
        ? getTokenContractByAddress(stakedTokenAddress, web3)
        : undefined;

      const stakedTokenId = stakedTokenAddress
        ? getTokenByAddress(stakedTokenAddress)?.id
        : undefined;

      return {
        queryFn: () =>
          getBalanceOf({
            tokenContract: tokenContract || ({} as Erc20),
            accountAddress: MIA_VAULT_PROXY_CONTRACT_ADDRESS,
          }),
        queryKey: [FunctionKey.GET_BALANCE_OF, MIA_VAULT_PROXY_CONTRACT_ADDRESS, stakedTokenId],
        enabled: !!tokenContract,
        refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      };
    },
  );

  return useQueries(queries);
};

export default useGetMiaVaultPoolBalances;
