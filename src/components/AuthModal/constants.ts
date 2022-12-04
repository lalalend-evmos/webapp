import { t } from 'translation';
import { ReactComponent as LedgerLogo } from 'assets/img/wallets/ledgerLogo.svg';
import { ReactComponent as MetaMaskLogo } from 'assets/img/wallets/metaMaskLogo.svg';
import { ReactComponent as SafePalLogo } from 'assets/img/wallets/safePalLogo.svg';
import { Connector } from 'clients/web3';

import { BaseWallet, IntegratedWallet, Wallet } from './types';

export const WALLETS: Wallet[] = [
  {
    name: t('wallets.metamask'),
    Logo: MetaMaskLogo,
    connector: Connector.MetaMask,
  }
];

export const INTEGRATED_WALLETS: IntegratedWallet[] = [
  {
    name: t('wallets.ledger'),
    Logo: LedgerLogo,
    linkUrl: 'https://www.ledger.com/academy/security/the-safest-way-to-use-metamask',
  },
];