import formatToOutput from './formatToOutput';
import { GetMintableSebInput, GetMintableSebOutput } from './types';

export * from './types';

const getMintableSeb = async ({
  sebControllerContract, 
  accountAddress,
}: GetMintableSebInput): Promise<GetMintableSebOutput> => {
  const res = await sebControllerContract.methods.getMintableSEB(accountAddress).call();
  
  return formatToOutput(res);
};
  
export default getMintableSeb;
