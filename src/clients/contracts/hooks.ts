import { useMemo } from 'react';
import { TokenId, NTokenId } from 'types';

import { useWeb3 } from 'clients/web3';

import {
  getComptrollerContract,
  getGovernorBravoDelegateContract,
  getInterestModelContract,
  getPriceOracleContract,
  getTokenContract,
  getTokenContractByAddress,
  getNTokenContract,
  getSebUnitrollerContract,
  getSebVaultContract,
  getMiaLensContract,
  getMiaVaultContract,
  getMiaVaultProxyContract,
} from './getters';

export const useTokenContract = <T extends TokenId>(name: T) => {
  const web3 = useWeb3();
  return useMemo(() => getTokenContract<T>(name, web3), [web3, name]);
};

export const useTokenContractByAddress = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getTokenContractByAddress(address, web3), [web3, address]);
};

export const useNTokenContract = <T extends NTokenId>(name: T) => {
  const web3 = useWeb3();
  return useMemo(() => getNTokenContract<T>(name, web3), [web3, name]);
};

export const useSebUnitrollerContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getSebUnitrollerContract(web3), [web3]);
};

export const useSebVaultContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getSebVaultContract(web3), [web3]);
};

export const useComptrollerContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getComptrollerContract(web3), [web3]);
};

export const usePriceOracleContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getPriceOracleContract(web3), [web3]);
};

export const useInterestModelContract = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getInterestModelContract(address, web3), [web3]);
};

export const useMiaLensContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getMiaLensContract(web3), [web3]);
};

export const useMiaVaultContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getMiaVaultContract(web3), [web3]);
};

export const useMiaVaultProxyContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getMiaVaultProxyContract(web3), [web3]);
};
  
export const useGovernorBravoDelegateContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getGovernorBravoDelegateContract(web3), [web3]);
};

/*
// VRT conversion
export const useVrtConverterProxyContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getVrtConverterProxyContract(web3), [web3]);
};

export const useMiaVestingProxyContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getMiaVestingProxyContract(web3), [web3]);
};

export const useVrtVaultProxyContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getVrtVaultProxyContract(web3), [web3]);
};
*/