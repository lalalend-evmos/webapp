/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { ConnectWallet, LabeledInlineContent, PrimaryButton } from 'components';
import {Spinner} from "components/Spinner/moon";
import isBefore from 'date-fns/isBefore';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { TokenId } from 'types';
import { getToken } from 'utilities';

import { useExecuteWithdrawalFromMiaVault, useGetMiaVaultLockedDeposits } from 'clients/api';
import { TOKENS_EVMOS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';

import { useStyles } from './styles';
import TEST_IDS from './testIds';

export interface WithdrawUiProps {
  stakedTokenId: TokenId;
  isInitialLoading: boolean;
  onSubmitSuccess: () => void;
  onSubmit: () => Promise<unknown>;
  isSubmitting: boolean;
  withdrawableWei?: BigNumber;
}

const WithdrawUi: React.FC<WithdrawUiProps> = ({
  stakedTokenId,
  isInitialLoading,
  onSubmit,
  onSubmitSuccess,
  isSubmitting,
  withdrawableWei,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const handleSubmit = async () => {
    await onSubmit();

    onSubmitSuccess();
  };

  const stakedToken = getToken(stakedTokenId);

  const readableWithdrawableTokens = useConvertWeiToReadableTokenString({
    valueWei: withdrawableWei,
    tokenId: stakedTokenId,
    minimizeDecimals: true,
  });

  return (
    <>
      {isInitialLoading || !withdrawableWei ? (
        <Spinner />
      ) : (
        <>
          <LabeledInlineContent
            css={styles.content}
            iconName={stakedTokenId}
            data-testid={TEST_IDS.availableTokens}
            label={t('withdrawFromVestingVaultModalModal.withdrawTab.availableTokens', {
              tokenSymbol: stakedToken.symbol,
            })}
          >
            {readableWithdrawableTokens}
          </LabeledInlineContent>

          <PrimaryButton
            type="submit"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={withdrawableWei.isEqualTo(0)}
            fullWidth
          >
            {t('withdrawFromVestingVaultModalModal.withdrawTab.submitButton')}
          </PrimaryButton>
        </>
      )}
    </>
  );
};

export interface WithdrawProps {
  stakedTokenId: TokenId;
  poolIndex: number;
  handleClose: () => void;
}

const Withdraw: React.FC<WithdrawProps> = ({ stakedTokenId, poolIndex, handleClose }) => {
  const { t } = useTranslation();
  const { account } = useContext(AuthContext);

  const {
    data: miaVaultUserLockedDepositsData = {
      lockedDeposits: [],
    },
    isLoading: isGetMiaVaultUserLockedDepositsLoading,
  } = useGetMiaVaultLockedDeposits(
    {
      poolIndex,
      rewardTokenAddress: TOKENS_EVMOS.mia.address,
      accountAddress: account?.address || '',
    },
    {
      placeholderData: {
        lockedDeposits: [],
      },
      enabled: !!account?.address,
    },
  );

  const withdrawableWei = useMemo(() => {
    const now = new Date();

    return miaVaultUserLockedDepositsData.lockedDeposits.reduce(
      (acc, miaVaultUserLockedDeposit) =>
        isBefore(miaVaultUserLockedDeposit.unlockedAt, now)
          ? acc.plus(miaVaultUserLockedDeposit.amountWei)
          : acc,
      new BigNumber(0),
    );
  }, [JSON.stringify(miaVaultUserLockedDepositsData.lockedDeposits)]);

  const {
    mutateAsync: executeWithdrawalFromMiaVault,
    isLoading: isExecutingWithdrawalFromMiaVault,
  } = useExecuteWithdrawalFromMiaVault({
    stakedTokenId,
  });

  const handleSubmit = () =>
    executeWithdrawalFromMiaVault({
      poolIndex,
      // account is always defined at this stage since we don't display the form
      // if no account is connected
      fromAccountAddress: account?.address || '',
      rewardTokenAddress: TOKENS_EVMOS.mia.address,
    });

  return (
    <ConnectWallet
      message={t('withdrawFromVestingVaultModalModal.withdrawTab.enableToken.connectWalletMessage')}
    >
      <WithdrawUi
        stakedTokenId={stakedTokenId}
        isInitialLoading={isGetMiaVaultUserLockedDepositsLoading}
        isSubmitting={isExecutingWithdrawalFromMiaVault}
        withdrawableWei={withdrawableWei}
        onSubmit={handleSubmit}
        onSubmitSuccess={handleClose}
      />
    </ConnectWallet>
  );
};

export default Withdraw;
