/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import { TokenId } from 'types';
import { getToken } from 'utilities';

import { useGetSebVaultUserInfo, useWithdrawFromSebVault } from 'clients/api';
import { TOKENS_EVMOS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';

import ActionModal, { ActionModalProps } from '../ActionModal';

export type WithdrawFromSebVaultModalProps = Pick<ActionModalProps, 'handleClose'>;

const VAI_ID = TOKENS_EVMOS.seb.id as TokenId;

const WithdrawFromSebVaultModal: React.FC<WithdrawFromSebVaultModalProps> = ({ handleClose }) => {
  const { t } = useTranslation();
  const { account } = useContext(AuthContext);
  const vaiSymbol = getToken(VAI_ID).symbol;

  const { data: sebVaultUserInfo, isLoading: isGetSebVaultUserInfoLoading } =
    useGetSebVaultUserInfo(
      {
        accountAddress: account?.address || '',
      },
      {
        enabled: !!account?.address,
      },
    );

  const { mutateAsync: withdraw, isLoading: isWithdrawLoading } = useWithdrawFromSebVault();

  const handleWithdraw = async (amountWei: BigNumber) => {
    // Send request to withdraw
    const res = await withdraw({
      amountWei,
      // account.address has to exist at this point since users are prompted to
      // connect their wallet before they're able to withdraw
      fromAccountAddress: account?.address || '',
    });

    // Close modal
    handleClose();

    return res;
  };

  return (
    <ActionModal
      title={t('withdrawFromSebVaultModal.title', { tokenSymbol: vaiSymbol })}
      tokenId={VAI_ID}
      handleClose={handleClose}
      availableTokensWei={sebVaultUserInfo?.stakedSebWei || new BigNumber(0)}
      isInitialLoading={isGetSebVaultUserInfoLoading}
      onSubmit={handleWithdraw}
      isSubmitting={isWithdrawLoading}
      connectWalletMessage={t('withdrawFromSebVaultModal.connectWalletMessage', {
        tokenSymbol: vaiSymbol,
      })}
      availableTokensLabel={t('withdrawFromSebVaultModal.availableTokensLabel', {
        tokenSymbol: vaiSymbol,
      })}
      submitButtonLabel={t('withdrawFromSebVaultModal.submitButtonLabel')}
      submitButtonDisabledLabel={t('withdrawFromSebVaultModal.submitButtonDisabledLabel')}
      successfulTransactionTitle={t('withdrawFromSebVaultModal.successfulTransactionModal.title')}
      successfulTransactionDescription={t(
        'withdrawFromSebVaultModal.successfulTransactionModal.description',
      )}
    />
  );
};

export default WithdrawFromSebVaultModal;
