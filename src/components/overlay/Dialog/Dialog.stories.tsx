import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from './Dialog';
import { Button } from '../../actions/Button';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Overlay/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>Open dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The item will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p>Any unsaved changes will be lost.</p>
        </DialogBody>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose>Confirm</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger>{size}</DialogTrigger>
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>Size {size}</DialogTitle>
            </DialogHeader>
            <DialogBody>Lorem ipsum dolor sit amet.</DialogBody>
            <DialogFooter>
              <DialogClose>Close</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    function ControlledDialog() {
      const [open, setOpen] = useState(false);
      return (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => setOpen((v) => !v)}>External toggle</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>Open from trigger</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Controlled</DialogTitle>
              </DialogHeader>
              <DialogBody>Open state lives in the parent component.</DialogBody>
              <DialogFooter>
                <DialogClose>Done</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    }
    return <ControlledDialog />;
  },
};

export const ScrollableBody: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>Open long dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms of service</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {Array.from({ length: 40 }).map((_, i) => (
            <p key={i}>Paragraph {i + 1}: lorem ipsum dolor sit amet…</p>
          ))}
        </DialogBody>
        <DialogFooter>
          <DialogClose>Agree</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
