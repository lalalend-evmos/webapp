/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  ConnectWallet,
  EnableToken,
  FormikSubmitButton,
  FormikTokenTextField,
  LabeledInlineContent
} from 'components';
import {Spinner} from "components/Spinner/moon";

import { NError } from 'errors';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import { TokenId } from 'types';
import { convertTokensToWei, convertWeiToTokens, getContractAddress } from 'utilities';
import type { TransactionReceipt } from 'web3-core';

import { useGetBalanceOf, useGetMintedSeb, useRepaySeb } from 'clients/api';
import { TOKENS_EVMOS } from 'constants/tokens';
import { AmountForm, AmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { SEB_ID } from '../constants';
import { useStyles } from '../styles';

const sebUnitrollerContractAddress = getContractAddress('sebUnitroller');

export interface RepaySebUiProps {
  disabled: boolean;
  isRepaySebLoading: boolean;
  repaySeb: (amountWei: BigNumber) => Promise<TransactionReceipt | undefined>;
  isInitialLoading: boolean;
  userBalanceWei?: BigNumber;
  userMintedWei?: BigNumber;
}

export const RepaySebUi: React.FC<RepaySebUiProps> = ({
  disabled,
  userBalanceWei,
  userMintedWei,
  isRepaySebLoading,
  isInitialLoading,
  repaySeb,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const handleTransactionMutation = useHandleTransactionMutation();

  const limitTokens = React.useMemo(() => {
    const limitWei =
      userBalanceWei && userMintedWei
        ? BigNumber.minimum(userBalanceWei, userMintedWei)
        : new BigNumber(0);

    return convertWeiToTokens({ valueWei: limitWei, tokenId: SEB_ID }).toFixed();
  }, [userBalanceWei?.toFixed(), userMintedWei?.toFixed()]);

  // Convert minted wei into SEB
  const readableRepayableSeb = useConvertWeiToReadableTokenString({
    valueWei: userMintedWei,
    tokenId: SEB_ID,
  });

  const hasRepayableSeb = userMintedWei?.isGreaterThan(0) || false;

  const onSubmit: AmountFormProps['onSubmit'] = async amountTokens => {
    const amountWei = convertTokensToWei({
      value: new BigNumber(amountTokens),
      tokenId: SEB_ID,
    });

    return handleTransactionMutation({
      mutate: () => repaySeb(amountWei),
      successTransactionModalProps: transactionReceipt => ({
        title: t('mintRepaySeb.repaySeb.successfulTransactionModal.title'),
        content: t('mintRepaySeb.repaySeb.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          tokenId: 'seb',
        },
        transactionHash: transactionReceipt.transactionHash,
      }),
    });
  };

  return (
    <ConnectWallet message={t('mintRepaySeb.repaySeb.connectWallet')}>
      <EnableToken
        title={t('mintRepaySeb.repaySeb.enableToken')}
        nTokenId={SEB_ID}
        spenderAddress={sebUnitrollerContractAddress}
      >
        {isInitialLoading ? (
          <Spinner />
        ) : (
          <AmountForm onSubmit={onSubmit} css={styles.tabContentContainer}>
            {() => (
              <>
                <div css={styles.ctaContainer}>
                  <FormikTokenTextField
                    name="amount"
                    css={styles.textField}
                    tokenId={SEB_ID}
                    max={limitTokens}
                    disabled={disabled || isRepaySebLoading || !hasRepayableSeb}
                    rightMaxButton={{
                      label: t('mintRepaySeb.repaySeb.rightMaxButtonLabel'),
                      valueOnClick: limitTokens,
                    }}
                  />

                  <LabeledInlineContent
                    css={styles.getRow({ isLast: true })}
                    iconName={SEB_ID}
                    label={t('mintRepaySeb.repaySeb.repaySebBalance')}
                  >
                    {readableRepayableSeb}
                  </LabeledInlineContent>
                </div>

                <FormikSubmitButton
                  variant="secondary"
                  loading={isRepaySebLoading}
                  disabled={disabled}
                  enabledLabel={t('mintRepaySeb.repaySeb.btnRepaySeb')}
                  fullWidth
                />
              </>
            )}
          </AmountForm>
        )}
      </EnableToken>
    </ConnectWallet>
  );
};

const RepaySeb: React.FC = () => {
  const { account } = useContext(AuthContext);


  const { data: userSebBalanceData, isLoading: isGetUserSebBalanceWeiLoading } = useGetBalanceOf(
    {
      accountAddress: account?.address || '',
      tokenId: TOKENS_EVMOS.seb.id as TokenId,
    },
    {
      enabled: !!account?.address,
    },
  );

  const { data: userMintedSebData, isLoading: isGetUserMintedSebLoading } = useGetMintedSeb(
    {
      accountAddress: account?.address || '',
    },
    {
      enabled: !!account?.address,
    },
  );

  const isInitialLoading = isGetUserMintedSebLoading || isGetUserSebBalanceWeiLoading;

  const { mutateAsync: contractRepaySeb, isLoading: isRepaySebLoading } = useRepaySeb();

  const repaySeb: RepaySebUiProps['repaySeb'] = async amountWei => {
    if (!account) {
      // This error should never happen, since the form inside the UI component
      // is disabled if there's no logged in account
      throw new NError({ type: 'unexpected', code: 'undefinedAccountErrorMessage' });
    }


    return contractRepaySeb({
      fromAccountAddress: account.address,
      amountWei: amountWei.toFixed(),
    });
  };

  return (
    <RepaySebUi
      disabled={!account}
      isInitialLoading={isInitialLoading}
      userBalanceWei={userSebBalanceData?.balanceWei}
      userMintedWei={userMintedSebData?.mintedSebWei}
      isRepaySebLoading={isRepaySebLoading}
      repaySeb={repaySeb}
    />
  );
};

export default RepaySeb;