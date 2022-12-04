import { MiaVault } from 'types/contracts_evmos';

export interface GetMiaVaultTotalAllocPointsInput {
  miaVaultContract: MiaVault;
  tokenAddress: string;
}

export type GetMiaVaultTotalAllocPointsOutput = {
  totalAllocationPoints: number;
};

const getMiaVaultTotalAllocationPoints = async ({
  miaVaultContract,
  tokenAddress,
}: GetMiaVaultTotalAllocPointsInput): Promise<GetMiaVaultTotalAllocPointsOutput> => {
  const res = await miaVaultContract.methods.totalAllocPoints(tokenAddress).call();

  return {
    totalAllocationPoints: +res,
  };
};

export default getMiaVaultTotalAllocationPoints;
