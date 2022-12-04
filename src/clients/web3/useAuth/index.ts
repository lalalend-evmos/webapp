import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
} from '@web3-react/walletconnect-connector';
import { NError, formatNErrorToReadableString } from 'errors';
import { useCallback, useState } from 'react';

import { toast } from 'components/Toast';
import { LS_KEY_CONNECTED_CONNECTOR } from 'constants/localStorageKeys';

import { connectorsByName } from '../connectors';
import { Connector } from '../types';
import setupNetwork from './setUpNetwork';

const isRunningInInfinityWalletApp = () => window.ethereum && window.ethereum?.isInfinityWallet;

const getConnectedConnector = (): Connector | undefined => {
  const lsConnectedConnector = window.localStorage.getItem(LS_KEY_CONNECTED_CONNECTOR);

  return lsConnectedConnector &&
    Object.values(Connector).includes(lsConnectedConnector as Connector)
    ? (lsConnectedConnector as Connector)
    : undefined;
};

const useAuth = () => {
  const { activate, deactivate, account } = useWeb3React();

  const [connectedConnector, setConnectedConnector] = useState(getConnectedConnector());

  const login = useCallback(
    async (connectorID: Connector) => {

      const connector = connectorsByName[connectorID];
      if (!connector) {
        // TODO: log error (this case should never happen, as it means
        // an incorrect connectorID was passed to this function)

        throw new NError({ type: 'interaction', code: 'unsupportedWallet' });
      }

      try {
        // Log user in
        await activate(connector, undefined, true);

        // Mark user as logged in
        window.localStorage.setItem(LS_KEY_CONNECTED_CONNECTOR, connectorID);
        setConnectedConnector(connectorID);
      } catch (error) {
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork();
          if (hasSetup) {
            await activate(connector);
          }

          return;
        }

        // Display error message
        let errorMessage;

        if (
          error instanceof UserRejectedRequestErrorInjected ||
          error instanceof UserRejectedRequestErrorWalletConnect
        ) {
          throw new NError({ type: 'interaction', code: 'authorizeAccess' });
        } else if (
          error instanceof NoEthereumProviderError        ) 
        {
          // TODO: log error
          throw new NError({ type: 'interaction', code: 'noProvider' });
        } else {
          errorMessage = (error as Error).message;
        }

        toast.error({ message: errorMessage });
      }
    },
    [activate],
  );

  const loginShowToast = async (connectorID: Connector) => {
    try {
      await login(connectorID);
    } catch (error) {
      let { message } = error as Error;

      if (error instanceof NError) {
        message = formatNErrorToReadableString(error);
      }

      toast.error({
        message,
      });
    }
  };

  const logOut = useCallback(() => {
    deactivate();

    // Remove flag indicating user is logged in
    window.localStorage.removeItem(LS_KEY_CONNECTED_CONNECTOR);
    setConnectedConnector(undefined);
  }, [deactivate]);

  return { login: loginShowToast, logOut, accountAddress: account, connectedConnector };
};

export default useAuth;
