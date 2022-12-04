import { TokenId, NTokenId } from 'types';

import { MiaToken, NErc20, NEvmosToken, Erc20, SebToken} from 'types/contracts_evmos';

export type TokenContract<T extends TokenId> = T extends 'mia'
  ? MiaToken
  : T extends 'seb'
  ? SebToken
  /* : T extends 'vrt' 
  ? VrtToken*/
  : Erc20;

export type NTokenContract<T extends NTokenId> = T extends 'wevmos' ? NEvmosToken : NErc20;
    