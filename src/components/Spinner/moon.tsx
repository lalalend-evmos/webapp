/** @jsxImportSource @emotion/react */
import React from 'react';

import { MoonLoader } from 'react-spinners';

import { useStyles } from './styles';
import TEST_IDS from './testIds';

interface SpinnerProps {
  variant?: 'large' | 'small';
  autoplay?: boolean;
  className?: string;
  insideModal?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  variant = 'large',
  autoplay = true,
  className,
  insideModal
}) => {
  const styles = useStyles({ variant });
  //const color = insideModal ? "white" :  "#17e7ff";
  return (
    <div css={styles.container} className={className} data-testid={TEST_IDS.spinner}>
      <MoonLoader color="white" size={30} />
    </div>
  );
};
