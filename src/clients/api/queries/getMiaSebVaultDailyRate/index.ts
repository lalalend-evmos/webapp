import BigNumber from 'bignumber.js';

import { BLOCKS_PER_DAY } from 'constants/evmos';
import { Comptroller } from 'types/contracts_evmos';

export interface GetMiaSebVaultDailyRateInput {
  comptrollerContract: Comptroller;
}
 
export type GetMiaSebVaultDailyRateOutput = {
  dailyRateWei: BigNumber;
};

const getMiaSebVaultDailyRate = async ({
  comptrollerContract,
}: GetMiaSebVaultDailyRateInput): Promise<GetMiaSebVaultDailyRateOutput> => {
  const resp = await comptrollerContract.methods.miaSEBVaultRate().call();

  return {
    dailyRateWei: new BigNumber(resp).times(BLOCKS_PER_DAY),
  };
};

export default getMiaSebVaultDailyRate;
