/** @jsxImportSource @emotion/react */
import React from 'react';

import Header from './Header';
import Table from './Table';
import { useStyles } from './styles';

const Mia: React.FC = () => {
  const styles = useStyles();

  return (
    <div>
      <Header css={styles.header} />
      <Table />
    </div>
  );
};

export default Mia;
