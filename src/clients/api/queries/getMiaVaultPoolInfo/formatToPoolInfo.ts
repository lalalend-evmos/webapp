import BigNumber from 'bignumber.js';

import { MiaVault } from 'types/contracts_evmos';

import { GetMiaVaultPoolInfoOutput } from './types';

const formatToUserInfo = ({
  token,
  allocPoint,
  lastRewardBlock,
  accRewardPerShare,
  lockPeriod,
}: Awaited<
  ReturnType<ReturnType<MiaVault['methods']['poolInfos']>['call']>
>): GetMiaVaultPoolInfoOutput => ({
  stakedTokenAddress: token,
  allocationPoint: +allocPoint,
  lastRewardBlock: +lastRewardBlock,
  accRewardPerShare: new BigNumber(accRewardPerShare),
  // Convert lockPeriod from seconds to milliseconds
  lockingPeriodMs: +lockPeriod * 1000,
});

export default formatToUserInfo;
