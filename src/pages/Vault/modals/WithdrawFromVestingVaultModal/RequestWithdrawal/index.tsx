/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { ConnectWallet, TextButton } from 'components';
import {Spinner} from "components/Spinner/moon";

import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { TokenId } from 'types';
import { getToken } from 'utilities';

import {
  useGetMiaVaultLockedDeposits,
  useGetMiaVaultPoolInfo,
  useGetMiaVaultUserInfo,
  useRequestWithdrawalFromMiaVault,
} from 'clients/api';
import { TOKENS_EVMOS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';

import TransactionForm, { TransactionFormProps } from '../../../TransactionForm';
import { useStyles } from './styles';

export interface RequestWithdrawalUiProps {
  stakedTokenId: TokenId;
  isInitialLoading: boolean;
  requestableWei: BigNumber;
  onSubmitSuccess: () => void;
  onSubmit: TransactionFormProps['onSubmit'];
  isSubmitting: boolean;
  displayWithdrawalRequestList: () => void;
  lockingPeriodMs: number | undefined;
}

export const RequestWithdrawalUi: React.FC<RequestWithdrawalUiProps> = ({
  stakedTokenId,
  isInitialLoading,
  requestableWei,
  lockingPeriodMs,
  onSubmitSuccess,
  onSubmit,
  isSubmitting,
  displayWithdrawalRequestList,
}) => {
  const stakedToken = getToken(stakedTokenId);
  const { t } = useTranslation();
  const styles = useStyles();

  const handleSubmit: TransactionFormProps['onSubmit'] = async amountWei => {
    const res = await onSubmit(amountWei);
    onSubmitSuccess();
    return res;
  };

  return (
    <>
      {isInitialLoading || !lockingPeriodMs ? (
        <Spinner />
      ) : (
        <>
          <TransactionForm
            tokenId={stakedTokenId}
            availableTokensLabel={t(
              'withdrawFromVestingVaultModalModal.requestWithdrawalTab.availableTokensLabel',
              { tokenSymbol: stakedToken.symbol },
            )}
            availableTokensWei={requestableWei}
            submitButtonLabel={t(
              'withdrawFromVestingVaultModalModal.requestWithdrawalTab.submitButtonLabel',
            )}
            submitButtonDisabledLabel={t(
              'withdrawFromVestingVaultModalModal.requestWithdrawalTab.submitButtonDisabledLabel',
            )}
            successfulTransactionTitle={t(
              'withdrawFromVestingVaultModalModal.requestWithdrawalTab.successfulTransactionTitle',
            )}
            successfulTransactionDescription={t(
              'withdrawFromVestingVaultModalModal.requestWithdrawalTab.successfulTransactionDescription',
            )}
            lockingPeriodMs={lockingPeriodMs}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />

          <TextButton
            onClick={displayWithdrawalRequestList}
            css={styles.displayWithdrawalRequestListButton}
          >
            {t(
              'withdrawFromVestingVaultModalModal.requestWithdrawalTab.displayWithdrawalRequestListButton',
            )}
          </TextButton>
        </>
      )}
    </>
  );
};

export interface RequestWithdrawalProps {
  stakedTokenId: TokenId;
  poolIndex: number;
  handleClose: () => void;
  handleDisplayWithdrawalRequestList: () => void;
}

const RequestWithdrawal: React.FC<RequestWithdrawalProps> = ({
  stakedTokenId,
  poolIndex,
  handleDisplayWithdrawalRequestList,
  handleClose,
}) => {
  const { account } = useContext(AuthContext);
  const { t } = useTranslation();

  const {
    mutateAsync: requestWithdrawalFromMiaVault,
    isLoading: isRequestingWithdrawalFromMiaVault,
  } = useRequestWithdrawalFromMiaVault();

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

  const { data: miaVaultUserInfo, isLoading: isGetMiaVaultUserInfoLoading } =
    useGetMiaVaultUserInfo(
      {
        poolIndex,
        rewardTokenAddress: TOKENS_EVMOS.mia.address,
        accountAddress: account?.address || '',
      },
      {
        enabled: !!account?.address,
      },
    );

  const requestableWei = useMemo(() => {
    if (!miaVaultUserInfo?.stakedAmountWei) {
      return new BigNumber(0);
    }

    // Subtract sum of all active withdrawal requests amounts to amount of
    // tokens staked by user
    const pendingLockedDepositsSum = miaVaultUserLockedDepositsData.lockedDeposits.reduce(
      (acc, miaVaultUserLockedDeposit) => acc.plus(miaVaultUserLockedDeposit.amountWei),
      new BigNumber(0),
    );
    return miaVaultUserInfo.stakedAmountWei.minus(pendingLockedDepositsSum);
  }, [
    JSON.stringify(miaVaultUserLockedDepositsData.lockedDeposits),
    JSON.stringify(miaVaultUserInfo),
  ]);

  const { data: miaVaultPoolInfo, isLoading: isGetMiaVaultPoolInfoLoading } =
    useGetMiaVaultPoolInfo(
      {
        poolIndex,
        rewardTokenAddress: TOKENS_EVMOS.mia.address,
      },
      {
        enabled: !!account?.address,
      },
    );

  const isInitialLoading =
    isGetMiaVaultPoolInfoLoading ||
    isGetMiaVaultUserInfoLoading ||
    isGetMiaVaultUserLockedDepositsLoading;

  const handleSubmit: TransactionFormProps['onSubmit'] = async amountWei =>
    requestWithdrawalFromMiaVault({
      poolIndex,
      // account is always defined at this stage since we don't display the form
      // if no account is connected
      fromAccountAddress: account?.address || '',
      rewardTokenAddress: TOKENS_EVMOS.mia.address,
      amountWei,
    });

  return (
    <ConnectWallet
      message={t(
        'withdrawFromVestingVaultModalModal.requestWithdrawalTab.enableToken.connectWalletMessage',
      )}
    >
      <RequestWithdrawalUi
        stakedTokenId={stakedTokenId}
        isInitialLoading={isInitialLoading}
        requestableWei={requestableWei}
        lockingPeriodMs={miaVaultPoolInfo?.lockingPeriodMs}
        onSubmitSuccess={handleClose}
        onSubmit={handleSubmit}
        isSubmitting={isRequestingWithdrawalFromMiaVault}
        displayWithdrawalRequestList={handleDisplayWithdrawalRequestList}
      />
    </ConnectWallet>
  );
};

export default RequestWithdrawal;
