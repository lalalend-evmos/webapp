import BigNumber from 'bignumber.js';
import { NError } from 'errors';
import { TokenId } from 'types';
import { getToken } from 'utilities';

import { useStakeInSebVault, useStakeInMiaVault } from 'clients/api';

export interface UseStakeInVaultInput {
  stakedTokenId: TokenId;
  rewardTokenId: TokenId;
  poolIndex?: number;
}

interface StakeInput {
  amountWei: BigNumber;
  accountAddress: string;
}

const useStakeInVault = ({ stakedTokenId, rewardTokenId, poolIndex }: UseStakeInVaultInput) => {
  const { mutateAsync: stakeInMiaVault, isLoading: isStakeInMiaVaultLoading } = useStakeInMiaVault({
    stakedTokenId,
  });

  const { mutateAsync: stakeInSebVault, isLoading: isStakeInSebVaultLoading } =
    useStakeInSebVault();



  const isLoading =
  isStakeInMiaVaultLoading || isStakeInSebVaultLoading;

  const stake = async ({ amountWei, accountAddress }: StakeInput) => {
    if (typeof poolIndex === 'number') {
      const rewardTokenAddress = getToken(rewardTokenId).address;

      return stakeInMiaVault({
        poolIndex,
        fromAccountAddress: accountAddress,
        rewardTokenAddress,
        amountWei,
      });
    }

    if (stakedTokenId === 'seb') {
      return stakeInSebVault({
        fromAccountAddress: accountAddress,
        amountWei,
      });
    }

    /*if (stakedTokenId === 'vrt') {
      return stakeInVrtVault({
        fromAccountAddress: accountAddress,
        amountWei,
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
    stake,
  };
};

export default useStakeInVault;
