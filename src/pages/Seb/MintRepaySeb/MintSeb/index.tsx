/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  ConnectWallet,
  EnableToken,
  FormikSubmitButton,
  FormikTokenTextField,
  LabeledInlineContent,
} from 'components';
import {Spinner} from "components/Spinner/moon";
import { NError } from 'errors';
import React, { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { convertTokensToWei, convertWeiToTokens, getContractAddress } from 'utilities';
import type { TransactionReceipt } from 'web3-core';

import { useGetMintableSeb, useGetSebTreasuryPercentage, useMintSeb } from 'clients/api';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { AmountForm, AmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { SEB_ID } from '../constants';
import { useStyles } from '../styles';
import getReadableFeeSeb from './getReadableFeeSeb';

const sebUnitrollerContractAddress = getContractAddress('sebUnitroller');

export interface MintSebUiProps {
  disabled: boolean;
  isMintSebLoading: boolean;
  isInitialLoading: boolean;
  mintSeb: (value: BigNumber) => Promise<TransactionReceipt | undefined>;
  limitWei?: BigNumber;
  mintFeePercentage?: number;
}

export const MintSebUi: React.FC<MintSebUiProps> = ({
  disabled,
  limitWei,
  isInitialLoading,
  mintFeePercentage,
  isMintSebLoading,
  mintSeb,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const handleTransactionMutation = useHandleTransactionMutation();

  const limitTokens = useMemo(
    () => (limitWei ? convertWeiToTokens({ valueWei: limitWei, tokenId: SEB_ID }).toFixed() : '0'),
    [limitWei?.toFixed()],
  );

  // Convert limit into SEB
  const readableSebLimit = useConvertWeiToReadableTokenString({
    valueWei: limitWei,
    tokenId: SEB_ID,
  });

  const hasMintableSeb = limitWei?.isGreaterThan(0) || false;

  const getReadableMintFee = useCallback(
    (valueWei: string) => {
      if (!mintFeePercentage) {
        return PLACEHOLDER_KEY;
      }

      const readableFeeSeb = getReadableFeeSeb({
        valueWei: new BigNumber(valueWei || 0),
        mintFeePercentage,
      });
      return `${readableFeeSeb} (${mintFeePercentage}%)`;
    },
    [mintFeePercentage],
  );

  const onSubmit: AmountFormProps['onSubmit'] = amountTokens => {
    const amountWei = convertTokensToWei({
      value: new BigNumber(amountTokens),
      tokenId: SEB_ID,
    });

    return handleTransactionMutation({
      mutate: () => mintSeb(amountWei),
      successTransactionModalProps: transactionReceipt => ({
        title: t('mintRepaySeb.mintSeb.successfulTransactionModal.title'),
        content: t('mintRepaySeb.mintSeb.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          tokenId: 'seb',
        },
        transactionHash: transactionReceipt.transactionHash,
      }),
    });
  };

  return (
    <ConnectWallet message={t('mintRepaySeb.mintSeb.connectWallet')}>
      <EnableToken
        title={t('mintRepaySeb.mintSeb.enableToken')}
        nTokenId={SEB_ID}
        spenderAddress={sebUnitrollerContractAddress}
      >
        {isInitialLoading ? (
          <Spinner />
        ) : (
          <AmountForm onSubmit={onSubmit} css={styles.tabContentContainer}>
            {({ values }) => (
              <>
                <div css={styles.ctaContainer}>
                  <FormikTokenTextField
                    name="amount"
                    css={styles.textField}
                    tokenId={SEB_ID}
                    max={limitTokens}
                    disabled={disabled || isMintSebLoading || !hasMintableSeb}
                    rightMaxButton={{
                      label: t('mintRepaySeb.mintSeb.rightMaxButtonLabel'),
                      valueOnClick: limitTokens,
                    }}
                  />

                  <LabeledInlineContent
                    css={styles.getRow({ isLast: false })}
                    iconName={SEB_ID}
                    label={t('mintRepaySeb.mintSeb.sebLimitLabel')}
                  >
                    {readableSebLimit}
                  </LabeledInlineContent>

                  <LabeledInlineContent
                    css={styles.getRow({ isLast: true })}
                    iconName="fee"
                    label={t('mintRepaySeb.mintSeb.mintFeeLabel')}
                  >
                    {getReadableMintFee(values.amount)}
                  </LabeledInlineContent>
                </div>

                <FormikSubmitButton
                  loading={isMintSebLoading}
                  disabled={disabled}
                  fullWidth
                  variant="secondary"
                  enabledLabel={t('mintRepaySeb.mintSeb.btnMintSeb')}
                />
              </>
            )}
          </AmountForm>
        )}
      </EnableToken>
    </ConnectWallet>
  );
};

const MintSeb: React.FC = () => {
  const { account } = useContext(AuthContext);

  const { data: getUserMintableSebWeiData, isLoading: isGetUserMintableSebLoading } =
    useGetMintableSeb(
      {  
        accountAddress: account?.address || '',
      },
      {
        enabled: !!account?.address,
      },
    );

  const { data: sebTreasuryPercentageData, isLoading: isGetSebTreasuryPercentageLoading } =
    useGetSebTreasuryPercentage();

  const { mutateAsync: contractMintSeb, isLoading: isMintSebLoading } = useMintSeb();

  const mintSeb: MintSebUiProps['mintSeb'] = async amountWei => {
    if (!account) {
      // This error should never happen, since the form inside the UI component
      // is disabled if there's no logged in account
      throw new NError({ type: 'unexpected', code: 'undefinedAccountErrorMessage' });
    }
    return contractMintSeb({
      fromAccountAddress: account.address,
      amountWei,
    });
  };

  return (
    <MintSebUi
      disabled={!account || isGetSebTreasuryPercentageLoading}
      limitWei={getUserMintableSebWeiData?.mintableSebWei}
      isInitialLoading={isGetUserMintableSebLoading}
      mintFeePercentage={sebTreasuryPercentageData?.percentage}
      isMintSebLoading={isMintSebLoading}
      mintSeb={mintSeb}
    />
  );
};

export default MintSeb;
