import BigNumber from 'bignumber.js';

import { MiaVault } from 'types/contracts_evmos';

import { GetMiaVaultUserInfoOutput } from './types';

const formatToUserInfo = ({
  amount,
  pendingWithdrawals,
  rewardDebt,
}: Awaited<
  ReturnType<ReturnType<MiaVault['methods']['getUserInfo']>['call']>
>): GetMiaVaultUserInfoOutput => ({
  stakedAmountWei: new BigNumber(amount),
  pendingWithdrawalsTotalAmountWei: new BigNumber(pendingWithdrawals),
  rewardDebtAmountWei: new BigNumber(rewardDebt),
});

export default formatToUserInfo;
