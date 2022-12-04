import { TokenId, NTokenId } from 'types';
import { getContractAddress, getToken, getNErc20Token } from 'utilities';
import Web3 from 'web3';   
import { AbiItem } from 'web3-utils';

import { getWeb3NoAccount } from 'clients/web3';


import erc20Abi from 'constants/contracts/abis_evmos/erc20.json';
import comptrollerAbi from 'constants/contracts/abis_evmos/comptroller.json';
import governorBravoDelegateAbi from 'constants/contracts/abis_evmos/governorBravoDelegate.json';
import interestModelAbi from 'constants/contracts/abis_evmos/interestModel.json';
import maximillionAbi from 'constants/contracts/abis_evmos/maximillion.json';
import oracleAbi from 'constants/contracts/abis_evmos/oracle.json';
import nErc20Abi from 'constants/contracts/abis_evmos/nErc20.json';
import nEvmosTokenAbi from 'constants/contracts/abis_evmos/nEvmosToken.json';
import sebTokenAbi from 'constants/contracts/abis_evmos/sebToken.json';
import sebUnitrollerAbi from 'constants/contracts/abis_evmos/sebUnitroller.json';
import sebVaultAbi from 'constants/contracts/abis_evmos/sebVault.json';
import miaLensAbi from 'constants/contracts/abis_evmos/miaLens.json';
import miaTokenAbi from 'constants/contracts/abis_evmos/miaToken.json';
import miaVaultAbi from 'constants/contracts/abis_evmos/miaVault.json';
import miaVaultStoreAbi from 'constants/contracts/abis_evmos/miaVaultStore.json';

/*
import {
  Bep20,
  Comptroller,
  GovernorBravoDelegate,
  InterestModel,
  Maximillion,
  Oracle,
  SebUnitroller,
  SebVault,
  MiaLens,
  VrtConverter,
  VrtVault,
  MiaVault,
  MiaVaultStore,
  MiaVesting,
} from 'types/contracts';
*/

import {
  Erc20,
  Comptroller,
  GovernorBravoDelegate,
  InterestModel,
  Maximillion,
  Oracle,
  SebUnitroller,
  SebVault,
  MiaLens,
  MiaVault,
  MiaVaultStore,
} from 'types/contracts_evmos';

import { TokenContract, NTokenContract } from './types';

const getContract = <T>(abi: AbiItem | AbiItem[], address: string, web3Instance: Web3) => {
  const web3 = web3Instance ?? getWeb3NoAccount();
  return new web3.eth.Contract(abi, address) as unknown as T;
};

export const getTokenContract = <T extends TokenId>(tokenId: T, web3: Web3): TokenContract<T> => {
  //console.log("trying to get token for tokenId : "+ tokenId + "....");
  const tokenAddress = getToken(tokenId).address;
  //console.log("and got result .... : "+ tokenAddress);

  if (tokenId === 'mia') {
    // TODO REMOVE AFTER (JUST FOR TEST)
    //const tokenAddress2 = "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff";
    return getContract<TokenContract<T>>(miaTokenAbi as AbiItem[], tokenAddress, web3);
  }

  if (tokenId === 'seb') {
    return getContract<TokenContract<T>>(sebTokenAbi as AbiItem[], tokenAddress, web3);
  }
  /*
  if (tokenId === 'vrt') {
    return getContract<TokenContract<T>>(vrtTokenAbi as AbiItem[], tokenAddress, web3);
  }*/

  return getContract<TokenContract<T>>(erc20Abi as AbiItem[], tokenAddress, web3);
};

export const getTokenContractByAddress = (address: string, web3: Web3): Erc20 =>
  getContract(erc20Abi as AbiItem[], address, web3) as unknown as Erc20;

export const getNTokenContract = <T extends NTokenId>(
  tokenId: T,
  web3: Web3,
): NTokenContract<T> => {
  let nErcTokenAddress = getNErc20Token(tokenId).address;

  
  if (tokenId === 'wevmos') {
    return getContract(
      nEvmosTokenAbi as AbiItem[],
      nErcTokenAddress,
      web3,
    ) as unknown as NTokenContract<T>;
  }

  return getContract(
    nErc20Abi as AbiItem[],
    nErcTokenAddress,
    web3,
  ) as unknown as NTokenContract<T>;
};

export const getSebUnitrollerContract = (web3: Web3) =>
  getContract(
    sebUnitrollerAbi as AbiItem[],
    getContractAddress('sebUnitroller'),
    web3,
  ) as unknown as SebUnitroller;

export const getSebVaultContract = (web3: Web3) =>
  getContract(
    sebVaultAbi as AbiItem[],
    getContractAddress('sebVault'),
    web3,
  ) as unknown as SebVault;

export const getMiaVaultContract = (web3: Web3) =>
  getContract(
    miaVaultAbi as AbiItem[],
    getContractAddress('miaVault'),
    web3,
  ) as unknown as MiaVault;

export const getMiaVaultProxyContract = (web3: Web3) =>
  getContract(
    miaVaultAbi as AbiItem[],
    getContractAddress('miaVaultProxy'),
    web3,
  ) as unknown as MiaVault;

export const getMiaVaultStoreContract = (web3: Web3) =>
  getContract(
    miaVaultStoreAbi as AbiItem[],
    getContractAddress('miaVaultStore'),
    web3,
  ) as unknown as MiaVaultStore;

export const getComptrollerContract = (web3: Web3) =>
  getContract(
    comptrollerAbi as AbiItem[],
    getContractAddress('comptroller'),
    web3,
  ) as unknown as Comptroller;

export const getPriceOracleContract = (web3: Web3) =>
  getContract(oracleAbi as AbiItem[], getContractAddress('oracle'), web3) as unknown as Oracle;

export const getInterestModelContract = (address: string, web3: Web3) =>
  getContract(interestModelAbi as AbiItem[], address, web3) as unknown as InterestModel;

export const getMiaLensContract = (web3: Web3) =>
  getContract(
    miaLensAbi as AbiItem[],
    getContractAddress('miaLens'),
    web3,
  ) as unknown as MiaLens;

export const getGovernorBravoDelegateContract = (web3: Web3) =>
  getContract(
    governorBravoDelegateAbi as AbiItem[],
    getContractAddress('governorBravoDelegator'),
    web3,
  ) as unknown as GovernorBravoDelegate;

export const getMaximillionContract = (web3: Web3) =>
  getContract(
    maximillionAbi as AbiItem[],
    getContractAddress('maximillion'),
    web3,
  ) as unknown as Maximillion;

/*
// VRT conversion
export const getMiaVestingProxyContract = (web3: Web3) =>
  getContract(
    miaVestingAbi as AbiItem[],
    getContractAddress('miaVestingProxy'),
    web3,
  ) as unknown as MiaVesting;

export const getVrtConverterProxyContract = (web3: Web3) =>
  getContract(
    vrtConverterAbi as AbiItem[],
    getContractAddress('vrtConverterProxy'),
    web3,
  ) as unknown as VrtConverter;

// VRT vault
export const getVrtVaultProxyContract = (web3: Web3) =>
  getContract(
    vrtVaultAbi as AbiItem[],
    getContractAddress('vrtVaultProxy'),
    web3,
  ) as unknown as VrtVault;
  */