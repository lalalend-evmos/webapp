import BigNumber from 'bignumber.js';

//import { Bep20, SebToken, VrtToken, MiaToken } from 'types/contracts';
import { Erc20, SebToken, MiaToken } from 'types/contracts_evmos';

export interface GetAllowanceInput {
  tokenContract:  MiaToken | Erc20 | SebToken;
  accountAddress: string;
  spenderAddress: string;
}

export type GetAllowanceOutput = {
  allowanceWei: BigNumber;
};

const getAllowance = async ({
  tokenContract,
  accountAddress,
  spenderAddress,
}: GetAllowanceInput): Promise<GetAllowanceOutput> => {
  const res = await tokenContract.methods.allowance(accountAddress, spenderAddress).call();

  return {
    allowanceWei: new BigNumber(res),
  };
};

export default getAllowance;
