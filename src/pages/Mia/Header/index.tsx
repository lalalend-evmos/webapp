/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { EllipseAddress, Icon, LabeledProgressBar } from 'components';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import {
  convertWeiToTokens,
  formatTokensToReadableValue,
  generateEvmosScanUrl,
  getContractAddress,
  getToken,
} from 'utilities';

import { useGetBalanceOf, useGetUserMarketInfo, useGetMiaSebVaultDailyRate } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import useCopyToClipboard from 'hooks/useCopyToClipboard';

import { MINTED_MIA_WEI } from '../constants';
import { useStyles } from '../styles';

import miaLogo from "assets/img/tokens/hibou.png";


interface HeaderProps {
  className?: string;
}

interface HeaderContainerProps {
  remainingDistributionWei: BigNumber;
  dailyMiaWei: BigNumber;
  miaSebVaultDailyRateWei: BigNumber;
  totalMiaDistributedWei: BigNumber;
}

export const HeaderUi: React.FC<HeaderProps & HeaderContainerProps> = ({
  className,
  remainingDistributionWei,
  dailyMiaWei,
  miaSebVaultDailyRateWei,
  totalMiaDistributedWei,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const miaAddress = getToken('mia').address;
  const copy = useCopyToClipboard(t('interactive.copy.miaAddress'));
  const copyAddress = () => copy(miaAddress);

  const readableDailyDistribution = useMemo(() => {
    const dailyMiaTokens = convertWeiToTokens({
      valueWei: dailyMiaWei,
      tokenId: 'mia',
    });

    const miaSebVaultDailyRateTokens = convertWeiToTokens({
      valueWei: miaSebVaultDailyRateWei,
      tokenId: 'mia',
    });

    const dailyDistribution = dailyMiaTokens.plus(miaSebVaultDailyRateTokens);

    return formatTokensToReadableValue({
      value: dailyDistribution,
      tokenId: 'mia',
      minimizeDecimals: true,
    });
  }, [dailyMiaWei.toFixed(), miaSebVaultDailyRateWei.toFixed()]);

  const readableRemainingDistribution = useMemo(
    () =>
      convertWeiToTokens({
        valueWei: remainingDistributionWei,
        tokenId: 'mia',
        returnInReadableFormat: true,
        minimizeDecimals: true,
      }),
    [remainingDistributionWei.toFixed()],
  );

  const percentOfMiaDistributed = useMemo(
    () => totalMiaDistributedWei.dividedBy(MINTED_MIA_WEI).multipliedBy(100).toNumber(),
    [],
  );

  return (
    <Paper className={className} css={styles.headerRoot}>
      <div css={styles.addressContainer}>
        <div css={styles.miaIconContainer}>
          {/*<Icon name="mia" size={styles.iconSize} />*/}
          <img src={miaLogo} width={50}/>
        </div>

        <Typography
          href={generateEvmosScanUrl('mia')}
          target="_blank"
          rel="noreferrer"
          variant="small2"
          component="a"
          css={[styles.whiteText, styles.addressText]}
        >
          <EllipseAddress address={miaAddress} ellipseBreakpoint="xl" />
        </Typography>

        <div css={styles.copyIconContainer}>
          <Icon name="copy" onClick={copyAddress} css={styles.copyIcon} size={styles.iconSizeXl} />
        </div>
      </div>

      <div css={styles.slider}>
        <LabeledProgressBar
          css={styles.progressBar}
          min={1}
          max={100}
          step={1}
          value={percentOfMiaDistributed}
          ariaLabel={t('mia.progressBar')}
          greyLeftText={t('mia.dailyDistribution')}
          whiteLeftText={readableDailyDistribution}
          greyRightText={t('mia.remaining')}
          whiteRightText={readableRemainingDistribution}
        />
      </div>
    </Paper>
  );
};

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { account } = useContext(AuthContext);
  const { data: miaSebVaultDailyRateData } = useGetMiaSebVaultDailyRate();
  const {
    data: { dailyMiaWei, totalMiaDistributedWei },
  } = useGetUserMarketInfo({
    accountAddress: account?.address,
  });
  const { data: miaRemainingDistributionData } = useGetBalanceOf({
    tokenId: 'mia',
    accountAddress: getContractAddress('comptroller'),
  });

  return (
    <HeaderUi
      remainingDistributionWei={miaRemainingDistributionData?.balanceWei || new BigNumber(0)}
      miaSebVaultDailyRateWei={miaSebVaultDailyRateData?.dailyRateWei || new BigNumber(0)}
      className={className}
      dailyMiaWei={dailyMiaWei}
      totalMiaDistributedWei={totalMiaDistributedWei}
    />
  );
};

export default Header;
