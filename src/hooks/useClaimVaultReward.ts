import { NError } from 'errors';
import { TokenId } from 'types';
import { getToken } from 'utilities';

import {
  useClaimSebVaultReward,
  useClaimMiaVaultReward,
} from 'clients/api';

interface StakeInput {
  rewardTokenId: TokenId;
  stakedTokenId: TokenId;
  accountAddress: string;
  poolIndex?: number;
}

const useClaimVaultReward = () => {
  const { mutateAsync: claimMiaVaultRewardLoading, isLoading: isClaimMiaVaultRewardLoading } =
    useClaimMiaVaultReward();

  const { mutateAsync: claimSebVaultReward, isLoading: isClaimSebVaultReward } =
    useClaimSebVaultReward();



  const isLoading = claimMiaVaultRewardLoading || isClaimSebVaultReward;

  const claimReward = async ({
    rewardTokenId,
    stakedTokenId,
    accountAddress,
    poolIndex,
  }: StakeInput) => {
    if (typeof poolIndex === 'number') {
      const rewardTokenAddress = getToken(rewardTokenId).address;

      return claimMiaVaultRewardLoading({
        poolIndex,
        fromAccountAddress: accountAddress,
        rewardTokenAddress,
      });
    }

    if (stakedTokenId === 'seb') {
      return claimSebVaultReward({
        fromAccountAddress: accountAddress,
      });
    }

    /*if (stakedTokenId === 'vrt') {
      return claimVrtVaultReward({
        fromAccountAddress: accountAddress,
      });
    }*/

    // This cose should never be reached, but just in case we throw a generic
    // internal error
    throw new NError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  };

  return {
    isLoading,
    claimReward,
  };
};

export default useClaimVaultReward;
