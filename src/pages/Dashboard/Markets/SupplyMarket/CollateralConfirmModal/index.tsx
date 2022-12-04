/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import { Icon, Modal, ModalProps } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';

import Logo  from 'assets/img/lalalend.png';

import { useStyles } from './styles';

export interface ConfirmCollateralModalProps {
  asset: Asset | undefined;
  handleClose: ModalProps['handleClose'];
}
// @TODO: Match designs when they are complete
export const CollateralConfirmModal: React.FC<ConfirmCollateralModalProps> = ({
  asset,
  handleClose,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const title = asset?.collateral
    ? t('markets.collateralConfirmModal.disable', { asset: asset?.symbol })
    : t('markets.collateralConfirmModal.enable', { asset: asset?.symbol });

  return (
    <Modal className="mia-modal" isOpen={!!asset} handleClose={handleClose} title={title}>
      <section css={styles.collateralModalContainer}>
        <img src={Logo} width={200} style={{marginLeft:"-30px"}}/>
        <Icon className="voting-spinner" name="loading" size="28px" css={styles.loadingIcon} />
        <Typography component="p" variant="body2">
          {t('markets.collateralConfirmModal.confirmText')}
        </Typography>
      </section>
    </Modal>
  );
};
