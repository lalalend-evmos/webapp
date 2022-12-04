/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import config from 'config';
import React from 'react';
import { useTranslation } from 'translation';

import { Connector } from 'clients/web3';

import {
  INTEGRATED_WALLETS,
  WALLETS,
} from '../constants';
import { useStyles } from './styles';

export interface WalletListProps {
  onLogin: (connector: Connector) => void;
}

export const WalletList: React.FC<WalletListProps> = ({ onLogin }) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  return (
    <div css={styles.container}>
      <div css={styles.walletList}>
        {WALLETS.filter(({ mainnetOnly }) => !mainnetOnly || !config.isOnTestnet).map(
          ({ name, connector, Logo }) => (
            <button
              css={styles.getListItem({ isActionable: true })}
              key={`wallet-${name}`}
              type="button"
              onClick={() => onLogin(connector)}
            >
              <Logo css={styles.walletLogo} />

              <Typography variant="tiny" component="div">
                {name}
              </Typography>
            </button>
          ),
        )}

        {INTEGRATED_WALLETS.map(({ name, Logo, linkUrl }) => (
          <a
            css={styles.getListItem({ isActionable: true })}
            key={`wallet-${name}`}
            href={linkUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Logo css={styles.walletLogo} />

            <Typography variant="tiny" component="div">
              {name}
            </Typography>
          </a>
        ))}
      </div>

    </div>
  );
};
