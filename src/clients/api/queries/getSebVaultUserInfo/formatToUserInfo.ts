import BigNumber from 'bignumber.js';

import { SebVault } from 'types/contracts_evmos';

import { GetSebVaultUserInfoOutput } from './types';

const formatToUserInfo = ({
  amount,
}: Awaited<
  ReturnType<ReturnType<SebVault['methods']['userInfo']>['call']>
>): GetSebVaultUserInfoOutput => ({
  stakedSebWei: new BigNumber(amount),
});

export default formatToUserInfo;
