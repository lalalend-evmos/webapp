import { MutationObserverOptions, useMutation } from 'react-query';

import supplyEvmos, { SupplyEvmosInput, SupplyEvmosOutput } from 'clients/api/mutations/supplyEvmos';
import queryClient from 'clients/api/queryClient';
import { useNTokenContract } from 'clients/contracts/hooks';
import { useWeb3 } from 'clients/web3';
import FunctionKey from 'constants/functionKey';
import { NEvmosToken } from 'types/contracts_evmos';

export type SupplyEvmosParams = Omit<SupplyEvmosInput, 'tokenContract' | 'account' | 'web3'>;

const useSupplyEvmos = (
  { account }: { account: string },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<SupplyEvmosOutput, Error, SupplyEvmosParams>,
) => {
  const nEvmosContract = useNTokenContract<'wevmos'>('wevmos');
  const web3 = useWeb3();
  return useMutation(
    FunctionKey.SUPPLY_EVMOS,
    params =>
      supplyEvmos({
        tokenContract: nEvmosContract as NEvmosToken,
        web3,
        account,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_N_TOKEN_BALANCES_ALL);
        queryClient.invalidateQueries([
          FunctionKey.GET_N_TOKEN_BALANCE,
          {
            accountAddress: account,
            nTokenId: 'wevmos',
          },
        ]);
        queryClient.invalidateQueries(FunctionKey.GET_ASSETS_IN_ACCOUNT);
        queryClient.invalidateQueries(FunctionKey.GET_MARKETS);
        queryClient.invalidateQueries(FunctionKey.GET_N_TOKEN_DAILY_MIA);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useSupplyEvmos;
