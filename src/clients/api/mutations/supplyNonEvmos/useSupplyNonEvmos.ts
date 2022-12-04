import { MutationObserverOptions, useMutation } from 'react-query';
import { NTokenId } from 'types';

import supplyNonEvmos, { SupplyNonEvmosInput, SupplyNonEvmosOutput } from 'clients/api/mutations/supplyNonEvmos';
import queryClient from 'clients/api/queryClient';
import { useNTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { NErc20 } from 'types/contracts_evmos';

export type SupplyNonEvmosParams = Omit<SupplyNonEvmosInput, 'tokenContract' | 'account'>;

const useSupplyNonEvmos = (
  { assetId, account }: { assetId: NTokenId; account: string },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<SupplyNonEvmosOutput, Error, SupplyNonEvmosParams>,
) => {
  const tokenContract = useNTokenContract<NTokenId>(assetId);

  return useMutation(
    [FunctionKey.SUPPLY, assetId],
    params => 
      supplyNonEvmos({
        tokenContract: tokenContract as NErc20,
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
            nTokenId: assetId,
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

export default useSupplyNonEvmos;
