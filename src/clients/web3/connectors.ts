import { InjectedConnector } from '@web3-react/injected-connector';
import config from 'config';

import { Connector } from './types';

export const injectedConnector = new InjectedConnector({ supportedChainIds: [config.chainId] });

export const connectorsByName = {
  [Connector.MetaMask]: injectedConnector
};
