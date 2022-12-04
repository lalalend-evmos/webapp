import { MutationObserverOptions } from 'react-query';
import { NTokenId } from 'types';

import {
  RepayEvmosInput,
  RepayEvmosOutput,
  RepayNonEvmosNTokenInput,
  RepayNonEvmosNTokenOutput,
  useRepayEvmos,
  useRepayNonEvmosNToken,
} from 'clients/api'; 

type Options = MutationObserverOptions<
  RepayEvmosOutput | RepayNonEvmosNTokenOutput,
  Error,
  Omit<RepayNonEvmosNTokenInput, 'nTokenContract'> | Omit<RepayEvmosInput, 'web3'>
>;

const useRepayNToken = ({ nTokenId }: { nTokenId: NTokenId }, options?: Options) => {
  const useRepayNonEvmosNTokenResult = useRepayNonEvmosNToken(
    { nTokenId: nTokenId as Exclude<NTokenId, 'wevmos'> },
    options,
  );
  const useRepayEvmosResult = useRepayEvmos(options);

  return nTokenId === 'wevmos' ? useRepayEvmosResult : useRepayNonEvmosNTokenResult;
};

export default useRepayNToken;
