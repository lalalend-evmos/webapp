import BigNumber from 'bignumber.js';
import { convertWeiToTokens } from 'utilities';

import { SEB_ID } from '../constants';

const getReadableFeeSeb = ({
  valueWei,
  mintFeePercentage,
}: {
  valueWei: BigNumber;
  mintFeePercentage: number;
}) => {
  const feeWei = new BigNumber(valueWei || 0).multipliedBy(mintFeePercentage).dividedBy(100);
  return convertWeiToTokens({
    valueWei: feeWei,
    tokenId: SEB_ID,
    returnInReadableFormat: true,
  });
};

export default getReadableFeeSeb;
