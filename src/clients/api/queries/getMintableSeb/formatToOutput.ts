import BigNumber from 'bignumber.js';

import { SebUnitroller } from 'types/contracts_evmos';

import { GetMintableSebOutput } from './types';

const formatToProposal = (
  response: Awaited<ReturnType<ReturnType<SebUnitroller['methods']['getMintableSEB']>['call']>>,
): GetMintableSebOutput => ({
  mintableSebWei: new BigNumber(response[1]),
});

export default formatToProposal;
