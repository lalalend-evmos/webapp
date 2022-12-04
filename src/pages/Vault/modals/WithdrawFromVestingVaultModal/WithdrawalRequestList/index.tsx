/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import { ConnectWallet, LabeledInlineContent } from 'components';
import {Spinner} from "components/Spinner/moon";

import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import { LockedDeposit, TokenId } from 'types';
import { convertWeiToTokens } from 'utilities';

import { useGetMiaVaultLockedDeposits } from 'clients/api';
import { TOKENS_EVMOS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';

import { useStyles } from './styles';
import TEST_IDS from './testIds';

export interface WithdrawalRequestListUiProps {
  isInitialLoading: boolean;
  hasError: boolean;
  userLockedDeposits: LockedDeposit[];
}

const WithdrawalRequestListUi: React.FC<WithdrawalRequestListUiProps> = ({
  isInitialLoading,
  hasError,
  userLockedDeposits,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <>
      {isInitialLoading || hasError ? (
        <Spinner />
      ) : (
        <>
          {userLockedDeposits.length === 0 ? (
            <Typography>
              {t('withdrawFromVestingVaultModalModal.withdrawalRequestList.emptyState')}
            </Typography>
          ) : (
            <>
              {userLockedDeposits.map(userLockedDeposit => (
                <LabeledInlineContent
                  css={styles.listItem}
                  iconName={TOKENS_EVMOS.mia.id as TokenId}
                  data-testid={TEST_IDS.withdrawalRequestListItem}
                  key={`withdrawal-request-list-item-${userLockedDeposit.unlockedAt.getTime()}`}
                  invertTextColors
                  label={convertWeiToTokens({
                    valueWei: userLockedDeposit.amountWei,
                    tokenId: TOKENS_EVMOS.mia.id as TokenId,
                    returnInReadableFormat: true,
                  })}
                >
                  {t('withdrawFromVestingVaultModalModal.withdrawalRequestList.itemContent', {
                    date: userLockedDeposit.unlockedAt,
                  })}
                </LabeledInlineContent>
              ))}
            </>
          )}
        </>
      )}
    </>
  );
};

export interface WithdrawalRequestListProps {
  poolIndex: number;
}

const WithdrawalRequestList: React.FC<WithdrawalRequestListProps> = ({ poolIndex }) => {
  const { account } = useContext(AuthContext);
  const { t } = useTranslation();

  const {
    data: userLockedDepositsData = {
      lockedDeposits: [],
    },
    isLoading: isGetMiaVaultUserLockedDepositsLoading,
    error: getMiaVaultUserLockedDepositsError,
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

  return (
    <ConnectWallet
      message={t(
        'withdrawFromVestingVaultModalModal.withdrawalRequestList.enableToken.connectWalletMessage',
      )}
    >
      <WithdrawalRequestListUi
        isInitialLoading={isGetMiaVaultUserLockedDepositsLoading}
        userLockedDeposits={userLockedDepositsData.lockedDeposits}
        hasError={!!getMiaVaultUserLockedDepositsError}
      />
    </ConnectWallet>
  );
};

export default WithdrawalRequestList;
