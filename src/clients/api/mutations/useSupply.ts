import { MutationObserverOptions } from 'react-query';
import { Asset, NTokenId } from 'types';

import {
  SupplyEvmosInput,
  SupplyEvmosOutput,
  SupplyEvmosParams,
  SupplyNonEvmosInput,
  SupplyNonEvmosOutput,
  SupplyNonEvmosParams,
  useSupplyEvmos,
  useSupplyNonEvmos,
} from 'clients/api'; 

interface UseSupplyArgs {
  asset: Asset;
  account: string;
}

type OptionsSupplyEvmos = MutationObserverOptions<SupplyEvmosOutput, Error, SupplyEvmosParams>;
type OptionsSupplyNonEvmos = MutationObserverOptions<SupplyNonEvmosOutput, Error, SupplyNonEvmosParams>;

export type UseSupplyParams =
  | Omit<SupplyNonEvmosInput, 'tokenContract' | 'assetId' | 'account'>
  | Omit<SupplyEvmosInput, 'tokenContract' | 'assetId' | 'account'>;
 
const useSupply = (
  { asset, account }: UseSupplyArgs,
  options?: OptionsSupplyEvmos | OptionsSupplyNonEvmos,
) => {
  const useSupplyNonEvmosResult = useSupplyNonEvmos(
    {
      assetId: asset?.id as NTokenId,
      account,
    },
    options as OptionsSupplyNonEvmos,
  );

  const useSupplyEvmosResult = useSupplyEvmos({ account }, options as OptionsSupplyEvmos);

  return asset.id === 'wevmos' ? useSupplyEvmosResult : useSupplyNonEvmosResult;
};

export default useSupply;
