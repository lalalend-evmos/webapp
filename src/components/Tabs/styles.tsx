import { css, keyframes } from '@emotion/react';
import { useTheme } from '@mui/material';

export const styles = () => {
  const theme = useTheme();
  const animation = keyframes`
    0% {
      background-position: 0% 50%;
    }
    
    50% {
      background-position: 50% 100%;
    }
    100% {
      background-position: 100% 0%;
    }
  `
  return {
    getContainer: ({ hasTitle }: { hasTitle: boolean }) => css`
      display: flex;
      margin-bottom: ${theme.spacing(8)};
      width: 100%;

      ${hasTitle &&
      css`
        align-items: center;

        ${theme.breakpoints.down('sm')} {
          display: block;
        }
      `}
    `,
    headerTitle: css`
      flex: 0 1 auto;
      margin-right: auto;
      padding-right: ${theme.spacing(4)};

      ${theme.breakpoints.down('sm')} {
        width: 100%;
        padding-right: 0;
        margin-bottom: ${theme.spacing(6)};
      }
    `,
    getButtonsContainer: ({ fullWidth }: { fullWidth: boolean }) => css`
      display: flex;
      align-items: center;

      ${theme.breakpoints.down('sm')} {
        width: 100%;
      }

      ${fullWidth &&
      css`
        width: 100%;
      `}
    `,
    getButton: ({
      active,
      last,
      fullWidth,
    }: {
      active: boolean;
      last: boolean; 
      fullWidth: boolean;
    }) => css`
      :hover:not(:disabled),
      :active:not(:disabled) {
        background-color: transparent;
        border: solid 1px transparent;
        background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #e9eca3, #dca3ec);
        background-origin: border-box;
        background-clip: content-box, border-box;
        box-shadow: 2px 1000px 1px black inset;
      }

      ${fullWidth &&
      css`
        flex: 1;
      `}

      ${!last &&
      css`
        margin-right: ${theme.spacing(2)};
      `};

      ${!active &&
      css`
        background-color: transparent;
        border-color: transparent;

        :not(:hover, :active) {
          color: ${theme.palette.text.secondary};
        }

        :hover {
          color: ${theme.palette.text.secondary};
        }
      `};

      ${theme.breakpoints.down('sm')} {
        flex: 1;
      }
    `,
  };
};

export default styles;
