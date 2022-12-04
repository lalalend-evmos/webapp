import BigNumber from 'bignumber.js';

export interface GetSebTreasuryPercentageInput {
  sebControllerContract: $TSFixMe; // @TODO: use contract type (through Typechain?)
}

export type GetSebTreasuryPercentageOutput = {
  percentage: number;
};

const getSebTreasuryPercentage = async ({
  sebControllerContract,
}: GetSebTreasuryPercentageInput): Promise<GetSebTreasuryPercentageOutput> => {
  const treasuryPercentage = await sebControllerContract.methods.treasuryPercent().call();
  const formattedTreasuryPercentage = new BigNumber(treasuryPercentage)
    .times(100)
    .div(1e18)
    .toNumber();

  return {
    percentage: formattedTreasuryPercentage,
  };
};

export default getSebTreasuryPercentage;
