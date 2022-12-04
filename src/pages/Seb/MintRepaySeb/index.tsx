/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import { Tabs } from 'components';
import React from 'react';
import { useTranslation } from 'translation';

import MintSeb from './MintSeb';
import RepaySeb from './RepaySeb';
import { useStyles } from './styles';

export interface MintRepaySebProps {
  className?: string;
}

const MintRepaySeb: React.FC<MintRepaySebProps> = ({ className }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const tabsContent = [
    { title: t('mintRepaySeb.tabMint'), content: <MintSeb /> },
    { title: t('mintRepaySeb.tabRepay'), content: <RepaySeb /> },
  ];

  return (
    <Paper className={className} css={styles.container}>
      <Tabs componentTitle={t('mintRepaySeb.title')} tabsContent={tabsContent} />
    </Paper>
  );
};

export default MintRepaySeb;
