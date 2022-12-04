/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import { NTokenId } from 'types';

import { useApproveToken, useGetAllowance } from 'clients/api';
import { AuthContext } from 'context/AuthContext';

import { SecondaryButton } from '../Button';
import { Delimiter } from '../Delimiter';
import { Icon } from '../Icon';
import { LabeledInlineContent, LabeledInlineContentProps } from '../LabeledInlineContent';
import { Spinner } from '../Spinner/moon';
import useStyles from './styles';

export interface EnableTokenUiProps {
  nTokenId: NTokenId | 'seb' // 'vrt';
  title: string | React.ReactElement;
  isTokenEnabled: boolean;
  enableToken: () => void;
  isInitialLoading?: boolean;
  isEnableTokenLoading?: boolean;
  tokenInfo?: LabeledInlineContentProps[];
  disabled?: boolean;
}

export const EnableTokenUi: React.FC<EnableTokenUiProps> = ({
  nTokenId,
  title,
  tokenInfo = [],
  children,
  enableToken,
  isTokenEnabled,
  isInitialLoading = false,
  isEnableTokenLoading = false,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  if (isTokenEnabled) {
    return <>{children}</>;
  }

  return (
    <div css={styles.container}>
      {isInitialLoading ? (
        <Spinner insideModal />
      ) : (
        <>
          <Icon name={nTokenId} css={styles.mainLogo} />

          <Typography component="h3" variant="h3" css={styles.mainText}>
            {title}
          </Typography>

          {tokenInfo.length > 0 && (
            <div css={styles.tokenInfoContainer}>
              <Delimiter css={styles.delimiter} />

              {tokenInfo.map(info => (
                <LabeledInlineContent
                  {...info}
                  key={info.label}
                  css={styles.labeledInlineContent}
                />
              ))}
            </div>
          )}

          <SecondaryButton
            disabled={disabled || isEnableTokenLoading}
            loading={isEnableTokenLoading}
            fullWidth
            onClick={enableToken}
          >
            {t('enableToken.enableButtonLabel')}
          </SecondaryButton>
        </>
      )}
    </div>
  );
};

export interface EnableTokenProps
  extends Pick<EnableTokenUiProps, 'tokenInfo' | 'disabled' | 'title' | 'nTokenId'> {
  spenderAddress: string;
}

export const EnableToken: React.FC<EnableTokenProps> = ({ nTokenId, spenderAddress, ...rest }) => {
  const { account } = useContext(AuthContext);

  const { data: getTokenAllowanceData, isLoading: isGetAllowanceLoading } = useGetAllowance(
    {
      accountAddress: account?.address || '',
      spenderAddress,
      tokenId: nTokenId,
    },
    {
      enabled: !!account?.address,
    },
  );

  const isTokenApproved =
    nTokenId === 'wevmos' ||
    (!!getTokenAllowanceData && getTokenAllowanceData.allowanceWei.isGreaterThan(0));

  const { mutate: contractApproveToken, isLoading: isApproveTokenLoading } = useApproveToken({
    tokenId: nTokenId,
  });

  const approveToken = () => {
    if (account?.address) {
      contractApproveToken({
        accountAddress: account.address,
        spenderAddress,
      });
    }
  };

  return (
    <EnableTokenUi
      {...rest}
      nTokenId={nTokenId}
      enableToken={approveToken}
      isTokenEnabled={isTokenApproved}
      isEnableTokenLoading={isApproveTokenLoading}
      isInitialLoading={isGetAllowanceLoading}
      disabled={!account}
    />
  );
};

export default EnableToken;
