import Path from 'constants/path';

import { MenuItem } from './types';

export const menuItems: MenuItem[] = [
  {
    href: Path.ROOT,
    // Translation key: do not remove this comment
    // t('layout.menuItems.dashboard')
    i18nKey: 'layout.menuItems.dashboard',
    i18nTitleKey: 'layout.menuItems.dashboard',
    icon: 'dashboard',
  },
  {
    href: Path.MARKETS,
    // Translation key: do not remove this comment
    // t('layout.menuItems.markets')
    i18nKey: 'layout.menuItems.markets',
    i18nTitleKey: 'layout.menuItems.markets',
    icon: 'market',
  },
  {
    href: Path.VAULTS,
    // Translation key: do not remove this comment
    // t('layout.menuItems.vaults')
    i18nKey: 'layout.menuItems.vaults',
    i18nTitleKey: 'layout.menuItems.vaults',
    icon: 'vault',
  },
  {
    href: Path.HISTORY,
    // Translation key: do not remove this comment
    // t('layout.menuItems.history')
    i18nKey: 'layout.menuItems.history',
    i18nTitleKey: 'layout.menuItems.history',
    icon: 'history',
  },
  {
    href: Path.GOVERNANCE,
    // Translation key: do not remove this comment
    // t('layout.menuItems.governance')
    i18nKey: 'layout.menuItems.governance',
    i18nTitleKey: 'layout.menuItems.governance',
    icon: 'vote',
  },
  {
    href: Path.MIA,
    // Translation key: do not remove this comment
    // t('layout.menuItems.mia')
    i18nKey: 'layout.menuItems.mia',
    i18nTitleKey: 'layout.menuItems.mia',
    icon: 'miaIcon',
  },
  {
    href: Path.SEB,
    // Translation key: do not remove this comment
    // t('layout.menuItems.mia')
    i18nKey: 'layout.menuItems.seb',
    i18nTitleKey: 'layout.menuItems.seb',
    icon: 'sebIcon',
  },
  {
    href: Path.SWAP,
    // Translation key: do not remove this comment
    // t('layout.menuItems.mia')
    i18nKey: 'layout.menuItems.swap',
    i18nTitleKey: 'layout.menuItems.swap',
    icon: 'swap',
  },
  {
    href: Path.ANALYTICS,
    // Translation key: do not remove this comment
    // t('layout.menuItems.mia')
    i18nKey: 'layout.menuItems.analytics',
    i18nTitleKey: 'layout.menuItems.analytics',
    icon: 'analytics',
  }
];
