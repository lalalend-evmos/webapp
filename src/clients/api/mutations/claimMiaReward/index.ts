import { checkForComptrollerTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { NTOKENS_EVMOS } from 'constants/tokens';
import { Comptroller } from 'types/contracts_evmos';

export interface ClaimMiaRewardInput {
  comptrollerContract: Comptroller;
  fromAccountAddress: string;
}

export type ClaimMiaRewardOutput = TransactionReceipt;

const claimMiaReward = async ({
  comptrollerContract,
  fromAccountAddress,
}: ClaimMiaRewardInput): Promise<ClaimMiaRewardOutput> => {
  // Fetch list of tokens for which user have a positive balance, since these
  // are the tokens susceptible to have generated MIA rewards
  const nTokenAddresses = Object.values(NTOKENS_EVMOS).map(nToken => nToken.address);
  // @TODO [VEN-198] - use mia lens to fetch rewards by addresses once it is upgraded with this functionality
  // Send query to claim MIA reward
  const resp = await comptrollerContract.methods['claimMia(address,address[])'](
    fromAccountAddress,
    nTokenAddresses,
  ).send({
    from: fromAccountAddress,
  });
  return checkForComptrollerTransactionError(resp);
};

export default claimMiaReward;
