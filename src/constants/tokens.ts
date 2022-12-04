import config from 'config';


import wevmos from 'assets/img/tokens/wevmos.png';
import eth from 'assets/img/tokens/eth.png';
import usdc from 'assets/img/tokens/usdc.png';
import usdt from 'assets/img/tokens/usdt.png';
import seb from 'assets/img/tokens/nai.svg';
import vbnb from 'assets/img/tokens/vbnb.png';
import veth from 'assets/img/tokens/veth.png';
import vusdc from 'assets/img/tokens/vusdc.png';
import vusdt from 'assets/img/tokens/vusdt.png';
import frax from 'assets/img/tokens/frax.svg';
import EVMOS_TOKEN_ADDRESSES from './contracts/addresses/tokens_on_evmos.json';
import NERC20_TOKEN_ADDRESSES from './contracts/addresses/ntokens_on_evmos.json';

export const NERC_TOKEN_DECIMALS = 8;
export const NTOKEN_DECIMALS = 8;

export const NERC20_TOKEN_DECIMALS = 8;

// WONT USE THEM JUST FOR REFERENCE
export const TOKENS_EVMOS = config.isOnTestnet ? { 
  usdc: {
    id: 'usdc',
    symbol: 'USDC',
    decimals: 6,
    address: EVMOS_TOKEN_ADDRESSES.usdc[9000],
    asset: usdc,
    nasset: vusdc,
  },
  usdt: {
    id: 'usdt',
    symbol: 'USDT',
    decimals: 6,
    address: EVMOS_TOKEN_ADDRESSES.usdt[9000], // have nothing 
    asset: usdt,
    nasset: vusdt,
  },
  weth: {
    id: 'weth',
    symbol: 'wETH',
    decimals: 18,
    address: EVMOS_TOKEN_ADDRESSES.weth[9000], // have nothing 
    asset: eth,
    nasset: veth,
  },
  frax: {
    id: 'frax',
    symbol: 'FRAX',
    decimals: 18,
    address: EVMOS_TOKEN_ADDRESSES.frax[9000], // have nothing 
    asset: frax,
    nasset: vbnb,
  },
  wevmos: {
    id: 'wevmos',
    symbol: 'wEVMOS',
    decimals: 18,
    address: EVMOS_TOKEN_ADDRESSES.wevmos[9000],
    asset: wevmos,
    nasset: vbnb,
  },


  mockatom: {
    id: 'mockatom',
    symbol: 'mockATOM',
    decimals: 18,
    address: EVMOS_TOKEN_ADDRESSES.mock_atom[9000],
    asset: wevmos, // TODO : nevmos
    nasset: vbnb,
  },
  mockosmo: {
    id: 'mockosmo',
    symbol: 'mockOSMO',
    decimals: 18,
    address: EVMOS_TOKEN_ADDRESSES.mock_osmosis[9000],
    asset: wevmos, // TODO : nevmos
    nasset: vbnb, // TODO : nevmos
  },
  mockdai: {
    id: 'mockdai',
    symbol: 'mockDAI',
    decimals: 18,
    address: EVMOS_TOKEN_ADDRESSES.dai_mock[9000],
    asset: wevmos, // TODO : nevmos
    nasset: vbnb, // TODO : nevmos
  },
  seb: {
    id: 'seb',
    symbol: 'SEB',
    decimals: 18,
    address: EVMOS_TOKEN_ADDRESSES.seb[9000],
    asset: seb,
  },
  mia: {
    id: 'mia',
    symbol: 'MIA',
    decimals: 18,
    address: EVMOS_TOKEN_ADDRESSES.mia[9000],
    asset: seb,
  },
  wbtc: {
    id: 'wbtc',
    symbol: 'madBTC',
    decimals: 8,
    address: EVMOS_TOKEN_ADDRESSES.wbtc[9000],
    asset: wevmos, // TODO : nevmos
    vasset: vbnb, // TODO : nevmos
  }

} : {
  usdc: {
    id: 'usdc',
    symbol: 'madUSDC',
    decimals: 6,
    address: EVMOS_TOKEN_ADDRESSES.usdc[9001],
    asset: usdc,
    vasset: vusdc,
  },
  usdt: {
    id: 'usdt',
    symbol: 'madUSDT',
    decimals: 6,
    address: EVMOS_TOKEN_ADDRESSES.usdt[9001],
    asset: usdt,
    vasset: vusdt,
  },
  weth: {
    id: 'weth',
    symbol: 'madETH',
    decimals: 18,
    address: EVMOS_TOKEN_ADDRESSES.weth[9001],
    asset: eth,
    vasset: veth,
  },
  frax: {
    id: 'frax',
    symbol: 'FRAX',
    decimals: 18,
    address: EVMOS_TOKEN_ADDRESSES.frax[9001],
    asset: frax,
    vasset: vbnb, // TODO : vfrax
  },
  wevmos: {
    id: 'wevmos',
    symbol: 'WEVMOS',
    decimals: 18,
    address: EVMOS_TOKEN_ADDRESSES.wevmos[9001],
    asset: wevmos, // TODO : nevmos
    vasset: vbnb, // TODO : nevmos
  },
  dai: {
    id: 'dai',
    symbol: 'madDAI',
    decimals: 18,
    address: EVMOS_TOKEN_ADDRESSES.dai[9001],
    asset: wevmos, // TODO : nevmos
    vasset: vbnb, // TODO : nevmos
  },
  mia: {
    id: 'mia',
    symbol: 'MIA',
    decimals: 18,
    address: EVMOS_TOKEN_ADDRESSES.mia[9001],
    asset: wevmos, // TODO : nevmos
    vasset: vbnb, // TODO : nevmos
  },
  osmosis: {
    id: 'osmosis',
    symbol: 'OSMO',
    decimals: 6,
    address: EVMOS_TOKEN_ADDRESSES.osmosis[9001],
    asset: wevmos, // TODO : nevmos
    vasset: vbnb, // TODO : nevmos
  },
  atom: {
    id: 'atom',
    symbol: 'ATOM',
    decimals: 6,
    address: EVMOS_TOKEN_ADDRESSES.atom[9001],
    asset: wevmos, // TODO : nevmos
    vasset: vbnb, // TODO : nevmos
  },
  wbtc: {
    id: 'wbtc',
    symbol: 'madBTC',
    decimals: 8,
    address: EVMOS_TOKEN_ADDRESSES.wbtc[9001],
    asset: wevmos, // TODO : nevmos
    vasset: vbnb, // TODO : nevmos
  },
  seb: {
    id: 'seb',
    symbol: 'SEB',
    decimals: 18,
    address: EVMOS_TOKEN_ADDRESSES.seb[9000],
    asset: seb,
  },
}
;

export const NTOKENS_EVMOS = config.isOnTestnet ? 
{
  usdc: {
    id: 'usdc',
    symbol: 'nUSDC',
    address: NERC20_TOKEN_ADDRESSES.usdc[9000],
    decimals: NERC20_TOKEN_DECIMALS,
  },
  usdt: {
    id: 'usdt',
    symbol: 'nUSDT',
    address: NERC20_TOKEN_ADDRESSES.usdt[9000],
    decimals: NERC20_TOKEN_DECIMALS,
  },
  weth: {
    id: 'weth',
    symbol: 'nETH',
    address: NERC20_TOKEN_ADDRESSES.weth[9000],
    decimals: NERC20_TOKEN_DECIMALS,
  },
  frax: {
    id: 'frax',
    symbol: 'nFRAX',
    address: NERC20_TOKEN_ADDRESSES.frax[9000],
    decimals: NERC20_TOKEN_DECIMALS,
  },
  wevmos: {
    id: 'wevmos',
    symbol: 'nEVMOS',
    address: NERC20_TOKEN_ADDRESSES.wevmos[9000],
    decimals: NERC20_TOKEN_DECIMALS,
  },
  mockosmo: {
    id: 'mockosmo',
    symbol: 'nMockOSMO',
    address: NERC20_TOKEN_ADDRESSES.mock_osmosis[9000],
    decimals: NERC20_TOKEN_DECIMALS,
  },
  mockatom: { 
    id: 'mockatom',
    symbol: 'nMockATOM',
    address: NERC20_TOKEN_ADDRESSES.mock_atom[9000],
    decimals: NERC20_TOKEN_DECIMALS,
  },
  mockdai: {
    id: 'mockdai',
    symbol: 'nDAI',
    address: NERC20_TOKEN_ADDRESSES.dai_mock[9000],
    decimals: NERC20_TOKEN_DECIMALS,
  },
  mia: {
    id: 'mia',
    symbol: 'nMIA',
    address: NERC20_TOKEN_ADDRESSES.mia[9000],
    decimals: NERC20_TOKEN_DECIMALS,
  },

} : {
  usdc: {
    id: 'usdc',
    symbol: 'nUSDC',
    address: NERC20_TOKEN_ADDRESSES.usdc[9001],
    decimals: NERC20_TOKEN_DECIMALS,
  },
  usdt: {
    id: 'usdt',
    symbol: 'nUSDT',
    address: NERC20_TOKEN_ADDRESSES.usdt[9001],
    decimals: NERC20_TOKEN_DECIMALS,
  },
  weth: {
    id: 'weth',
    symbol: 'nETH',
    address: NERC20_TOKEN_ADDRESSES.weth[9001],
    decimals: NERC20_TOKEN_DECIMALS,
  },
  frax: {
    id: 'frax',
    symbol: 'nFRAX',
    address: NERC20_TOKEN_ADDRESSES.frax[9001],
    decimals: NERC20_TOKEN_DECIMALS,
  },
  wevmos: {
    id: 'wevmos',
    symbol: 'nEVMOS',
    address: NERC20_TOKEN_ADDRESSES.wevmos[9001],
    decimals: NERC20_TOKEN_DECIMALS,
  },
  dai: {
    id: 'dai',
    symbol: 'nDAI',
    address: NERC20_TOKEN_ADDRESSES.dai[9001],
    decimals: NERC20_TOKEN_DECIMALS,
  },
  mia: {
    id: 'mia',
    symbol: 'nMIA',
    address: NERC20_TOKEN_ADDRESSES.mia[9001],
    decimals: NERC20_TOKEN_DECIMALS,
  },
  osmosis: {
    id: 'osmosis',
    symbol: 'nOSMO',
    address: NERC20_TOKEN_ADDRESSES.osmosis[9001],
    decimals: NERC20_TOKEN_DECIMALS,
  },
  atom: {
    id: 'atom',
    symbol: 'nATOM',
    address: NERC20_TOKEN_ADDRESSES.atom[9001],
    decimals: NERC20_TOKEN_DECIMALS,
  },
  wbtc: {
    id: 'wbtc',
    symbol: 'nBTC',
    address: NERC20_TOKEN_ADDRESSES.wbtc[9001],
    decimals: NERC20_TOKEN_DECIMALS,
  },
}