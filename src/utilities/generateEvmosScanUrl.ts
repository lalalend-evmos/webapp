import config from 'config';
import { TokenId } from 'types';

import getToken from './getToken';

export type UrlType = 'address' | 'token' | 'tx';

export const generateEvmosScanUrl = <T extends UrlType = 'address'>(
  identifier: T extends 'token' ? TokenId : string,
  urlType?: T,
) => {
  const safeUrlType = urlType || 'address';

  let suffix: string = identifier;
  if (safeUrlType === 'token') {
    suffix = getToken(identifier as TokenId).address;
  }
  //console.log(config.evmosScanUrl);
  
  return `${config.evmosScanUrl}/${safeUrlType}/${suffix}`;
};

export default generateEvmosScanUrl;
