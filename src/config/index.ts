import { EvmosChainId } from 'types';

import { EVMOS_SCAN_URLS } from 'constants/evmos';
import { API_ENDPOINT_URLS, RPC_URLS } from 'constants/endpoints';

export interface Config {
  chainId: EvmosChainId;
  isOnTestnet: boolean;
  rpcUrl: string;
  apiUrl: string;
  evmosScanUrl: string;
}

// TO CHANGE
const chainId: EvmosChainId = 9000 

const isOnTestnet = chainId === EvmosChainId.TESTNET;
const rpcUrl = RPC_URLS[chainId][0];
const apiUrl = API_ENDPOINT_URLS[chainId];
const evmosScanUrl = EVMOS_SCAN_URLS[chainId];
const config: Config = {
  chainId,
  isOnTestnet,
  rpcUrl,
  apiUrl,
  evmosScanUrl,
};

export default config;
