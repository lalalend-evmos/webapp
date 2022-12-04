/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { NError } from 'errors';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import { TokenId } from 'types';
import type { TransactionReceipt } from 'web3-core/types';

import { useClaimMiaReward, useGetMiaReward } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { ButtonProps, SecondaryButton } from '../../Button';
import { Icon } from '../../Icon';
import TEST_IDS from '../testIds';
import { useStyles } from './styles';

const MIA_SYMBOL = 'mia';

export interface ClaimMiaRewardButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClaimReward: () => Promise<TransactionReceipt | void>;
  amountWei?: BigNumber;
}

export const ClaimMiaRewardButtonUi: React.FC<ClaimMiaRewardButtonProps> = ({
  amountWei,
  onClaimReward,
  ...otherProps
}) => {
  const { t, Trans } = useTranslation();
  const styles = useStyles();

  const handleTransactionMutation = useHandleTransactionMutation();

  const readableAmount = useConvertWeiToReadableTokenString({
    valueWei: amountWei,
    tokenId: MIA_SYMBOL,
    minimizeDecimals: true,
  });

  // Check readable amount isn't 0 (since we strip out decimals)
  if (!amountWei || readableAmount.split(' ')[0] === '0') {
    return null;
  }

  const handleClick = () =>
    handleTransactionMutation({
      mutate: onClaimReward,
      successTransactionModalProps: transactionReceipt => ({
        title: t('claimMiaRewardButton.successfulTransactionModal.title'),
        content: t('claimMiaRewardButton.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          tokenId: 'mia' as TokenId,
        },
        transactionHash: transactionReceipt.transactionHash,
      }),
    });

  return (
    <SecondaryButton
      data-testid={TEST_IDS.claimMiaRewardButton}
      css={styles.button}
      onClick={handleClick}
      {...otherProps}
    >
      <Trans
        i18nKey="claimMiaRewardButton.title"
        components={{
          Icon: <Icon css={styles.icon} name={MIA_SYMBOL} />,
        }}
        values={{
          amount: readableAmount,
        }}
      />
    </SecondaryButton>
  );
};

export const ClaimMiaRewardButton: React.FC<ButtonProps> = props => {
  const { account } = useContext(AuthContext);

  const { data: miaRewardData } = useGetMiaReward(
    {
      accountAddress: account?.address || '',
    },
    {
      enabled: !!account?.address,
    },
  );

  const { mutateAsync: claimMiaReward, isLoading: isClaimMiaRewardLoading } = useClaimMiaReward();

  const handleClaim = async () => {
    if (!account?.address) {
      throw new NError({ type: 'unexpected', code: 'walletNotConnected' });
    }

    return claimMiaReward({
      fromAccountAddress: account.address,
    });
  };

  return (
    <ClaimMiaRewardButtonUi
      amountWei={miaRewardData?.miaRewardWei}
      loading={isClaimMiaRewardLoading}
      onClaimReward={handleClaim}
      {...props}
    />
  );
};

export default ClaimMiaRewardButton;
