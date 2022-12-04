import Typography from '@mui/material/Typography';
import { ComponentMeta } from '@storybook/react';
import { noop } from 'lodash';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import { EnableTokenUi } from '.';

export default {
  title: 'Components/EnableToken',
  component: EnableTokenUi,
  decorators: [withCenterStory({ width: 450 })],
} as ComponentMeta<typeof EnableTokenUi>;

export const Disabled = () => (
  <EnableTokenUi
    title="To withdraw EVMOS to the Lalalend Protocol, you need to enable it first."
    nTokenId="weth"
    isTokenEnabled={false}
    enableToken={noop}
  >
    <Typography>Invisible Content</Typography>
  </EnableTokenUi>
);

export const DisabledWithTokenInfo = () => (
  <EnableTokenUi
    title="To withdraw EVMOS to the Lalalend Protocol, you need to enable it first."
    nTokenId="weth"
    isTokenEnabled={false}
    tokenInfo={[
      { iconName: 'seb', label: 'Supply APY', children: '77.36' },
      { iconName: 'seb', label: 'Distribution APY', children: '0.82' },
    ]}
    enableToken={noop}
  >
    <Typography>Invisible Content</Typography>
  </EnableTokenUi>
);

export const Enabled = () => (
  <EnableTokenUi
    title="Enable Token"
    isTokenEnabled
    nTokenId="weth"
    tokenInfo={[]}
    enableToken={noop}
  >
    <Typography>Visible Content</Typography>
  </EnableTokenUi>
);
