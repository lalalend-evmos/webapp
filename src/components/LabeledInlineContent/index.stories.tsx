import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import { LabeledInlineContent } from '.';

export default {
  title: 'Components/LabeledInlineContent',
  component: LabeledInlineContent,
  decorators: [withCenterStory({ width: 450 })],
} as ComponentMeta<typeof LabeledInlineContent>;

export const Default = () => (
  <LabeledInlineContent label="Available SEB LIMIT">2000 SEB</LabeledInlineContent>
);

export const WithIcon = () => (
  <LabeledInlineContent label="Available SEB LIMIT" iconName="seb">
    2000 SEB
  </LabeledInlineContent>
);

export const WithInvertedTextColors = () => (
  <LabeledInlineContent label="Available SEB LIMIT" iconName="seb" invertTextColors>
    2000 SEB
  </LabeledInlineContent>
);
