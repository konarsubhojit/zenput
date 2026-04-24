import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './Tooltip';
import { Button } from '../../actions/Button';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <Button>Hover or focus me</Button>
      </TooltipTrigger>
      <TooltipContent>A short hint describing the action.</TooltipContent>
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, padding: 80 }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger>
            <Button>{side}</Button>
          </TooltipTrigger>
          <TooltipContent side={side}>On {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const WithProvider: Story = {
  render: () => (
    <TooltipProvider openDelay={200} closeDelay={0}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Tooltip>
          <TooltipTrigger>
            <Button>One</Button>
          </TooltipTrigger>
          <TooltipContent>First button</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Button>Two</Button>
          </TooltipTrigger>
          <TooltipContent>Second button</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};
