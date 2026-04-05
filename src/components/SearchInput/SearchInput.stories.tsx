import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outlined', 'filled', 'underlined'] },
    validationState: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: { label: 'Search', placeholder: 'Search...' },
};

export const ShowClearButton: Story = {
  args: { label: 'Search', placeholder: 'Search...', showClearButton: true, defaultValue: 'initial query' },
};

export const NoSearchIcon: Story = {
  args: { label: 'Search', placeholder: 'Search...', showSearchIcon: false },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SearchInput label="Small" placeholder="Search sm..." size="sm" />
      <SearchInput label="Medium" placeholder="Search md..." size="md" />
      <SearchInput label="Large" placeholder="Search lg..." size="lg" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Search', placeholder: 'Search...', disabled: true },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SearchInput label="Outlined" placeholder="Search..." variant="outlined" />
      <SearchInput label="Filled" placeholder="Search..." variant="filled" />
      <SearchInput label="Underlined" placeholder="Search..." variant="underlined" />
    </div>
  ),
};
