import { NErc20, NEvmosToken } from 'types/contracts_evmos';

export interface GetNTokenInterestRateModelInput {
  nTokenContract: NErc20 | NEvmosToken;
}

export type GetNTokenInterestRateModelOutput = {
  contractAddress: string;
};

const getNTokenInterestRateModel = async ({
  nTokenContract,
}: GetNTokenInterestRateModelInput): Promise<GetNTokenInterestRateModelOutput> => {
  const contractAddress = await nTokenContract.methods.interestRateModel().call();

  return {
    contractAddress,
  };
};

export default getNTokenInterestRateModel;
