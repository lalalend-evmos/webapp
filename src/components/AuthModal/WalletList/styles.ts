import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    theme,
    container: css`
      margin: ${theme.spacing(0, 10)};

      ${theme.breakpoints.down('md')} {
        margin: ${theme.spacing(-2, 4, 0)};
      }
    `,
    walletList: css`
      margin-bottom: ${theme.spacing(8)};
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-gap: ${theme.spacing(4)};
      align-items: start;

      ${theme.breakpoints.down('md')} {
        grid-template-columns: 1fr 1fr 1fr;
        row-gap: ${theme.spacing(2)};
        column-gap: ${theme.spacing(0)};
        margin-bottom: ${theme.spacing(4)};
      }
    `,
    getListItem: ({ isActionable }: { isActionable: boolean }) => css`
      background-color: transparent;
      box-shadow: none;
      border: 0;
      border-radius: ${theme.shape.borderRadius.small}px;
      padding: ${theme.spacing(2)};
      color: ${theme.palette.text.primary};
      text-align: center;
      transition: all 0.2s ease-in;

      ${isActionable &&
      css`
        cursor: pointer;

        :hover {
          color: #aea8d3;
          text-shadow:0px 0px 100px #aea8d3;
          transition: all 0.2s ease-in;
        }
      `}
    `,
    walletLogo: css`
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};
      margin: ${theme.spacing(0, 'auto', 1)};
      display: block;
     
      ${theme.breakpoints.down('md')} {
        width: ${theme.spacing(10)};
      }
    `,
    comingSoonText: css`
      color: ${theme.palette.text.secondary};
    `,
    footer: css`
      text-align: center;
      padding: ${theme.spacing(0, 4)};
    `,
    footerLink: css`
      color: ${theme.palette.button.main};

      :hover {
        color: ${theme.palette.button.medium};
      }

      :active {
        color: ${theme.palette.button.dark};
      }
    `,
  };
};
