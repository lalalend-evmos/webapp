import BigNumber from 'bignumber.js';
import { getContractAddress } from 'utilities';

//import { MiaLens } from 'types/contracts';
import { MiaLens } from 'types/contracts_evmos';

export interface GetDailyMiaInput {
  miaLensContract: MiaLens;
  accountAddress: string;
}

export type IGetDailyMiaOutput = {
  dailyMiaWei: BigNumber;
};

const comptrollerAddress = getContractAddress('comptroller');
 
const getDailyMia = async ({
  miaLensContract,
  accountAddress,
}: GetDailyMiaInput): Promise<IGetDailyMiaOutput> => {
  const response = await miaLensContract.methods
    .getDailyMIA(accountAddress, comptrollerAddress)
    .call();

  return {
    dailyMiaWei: new BigNumber(response),
  };
};

export default getDailyMia;