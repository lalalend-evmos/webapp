import formatToLockedDeposit from './formatToLockedDeposit';
import { GetMiaVaultLockedDepositsInput, GetMiaVaultLockedDepositsOutput } from './types';

export * from './types';

const getMiaVaultLockedDeposits = async ({
  miaVaultContract,
  rewardTokenAddress,
  poolIndex,
  accountAddress,
}: GetMiaVaultLockedDepositsInput): Promise<GetMiaVaultLockedDepositsOutput> => {
  const res = await miaVaultContract.methods
    .getWithdrawalRequests(rewardTokenAddress, poolIndex, accountAddress)
    .call();

  return {
    lockedDeposits: res.map(formatToLockedDeposit),
  };
};

export default getMiaVaultLockedDeposits;
