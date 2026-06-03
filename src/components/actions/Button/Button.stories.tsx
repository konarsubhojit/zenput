import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { PlusIcon, ChevronDownIcon, CloseIcon } from '../../../icons';

// Local stub used to demonstrate Radix-style `asChild` composition with a
// custom routing component (e.g. a localized `<Link>`). Replace with your
// app's link component in real usage.
const LocaleLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(function LocaleLink(props, ref) {
  return <a ref={ref} {...props} />;
});

const meta: Meta<typeof Button> = {
  title: 'Components/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Action primitive whose visual styling is owned by the component and driven by design tokens ' +
          '(CSS custom properties such as `--zp-color-*`, `--zp-space-*`, `--zp-radius-*`). ' +
          'Compose and extend via the `variant`, `size`, `fullWidth`, `iconOnly`, and `asChild` props ' +
          'rather than redeclaring Tailwind class strings. Use `className` only for layout-level overrides; ' +
          'do not duplicate token-driven styles. The `destructive` variant is an alias of `danger` and ' +
          'renders with the same token-backed styles.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'subtle', 'outline', 'ghost', 'danger', 'destructive'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: 'Primary Button' },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button leftIcon={<PlusIcon />}>Add item</Button>
      <Button rightIcon={<ChevronDownIcon />} variant="outline">
        Open menu
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button iconOnly aria-label="Close" variant="ghost">
        <CloseIcon />
      </Button>
      <Button iconOnly aria-label="Add" variant="primary">
        <PlusIcon />
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button loading>Saving…</Button>
      <Button loading variant="outline">
        Loading
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button disabled>Disabled</Button>
      <Button disabled variant="outline">
        Disabled
      </Button>
    </div>
  ),
};

export const Destructive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`destructive` is an alias for `danger` and renders with the same `variant-danger` token-driven styles. ' +
          'Use whichever name better fits your product vocabulary; both produce identical output.',
      },
    },
  },
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

export const AsChild: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates polymorphic composition using `asChild`. Example uses a custom `LocaleLink` component.',
      },
    },
  },
  args: {
    asChild: true,
    children: <LocaleLink href="#">Custom Link</LocaleLink>,
  },
};

export const FullWidth: Story = {
  args: { children: 'Full width', fullWidth: true },
};
