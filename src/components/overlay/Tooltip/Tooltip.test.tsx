import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './Tooltip';

afterEach(() => {
  document.querySelectorAll('[data-zenput-portal]').forEach((el) => el.remove());
  vi.useRealTimers();
});

function BasicTooltip({ openDelay = 0, closeDelay = 0 }: { openDelay?: number; closeDelay?: number }) {
  return (
    <Tooltip openDelay={openDelay} closeDelay={closeDelay}>
      <TooltipTrigger>
        <button>Hover me</button>
      </TooltipTrigger>
      <TooltipContent>Helpful label</TooltipContent>
    </Tooltip>
  );
}

describe('Tooltip', () => {
  it('is hidden by default', () => {
    render(<BasicTooltip />);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens on focus and closes on blur (no delay)', () => {
    render(<BasicTooltip />);
    const trigger = screen.getByRole('button', { name: 'Hover me' });

    act(() => {
      fireEvent.focus(trigger);
    });
    expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful label');

    act(() => {
      fireEvent.blur(trigger);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens on pointer enter after openDelay', () => {
    vi.useFakeTimers();
    render(<BasicTooltip openDelay={100} closeDelay={0} />);
    const trigger = screen.getByRole('button');

    act(() => {
      fireEvent.pointerEnter(trigger);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('sets aria-describedby on the trigger while open', () => {
    render(<BasicTooltip />);
    const trigger = screen.getByRole('button');
    act(() => fireEvent.focus(trigger));

    const tooltip = screen.getByRole('tooltip');
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);
  });

  it('closes on Escape keydown from the trigger', () => {
    render(<BasicTooltip />);
    const trigger = screen.getByRole('button');
    act(() => fireEvent.focus(trigger));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(trigger, { key: 'Escape' });
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('TooltipProvider supplies default delays to nested tooltips', () => {
    vi.useFakeTimers();
    render(
      <TooltipProvider openDelay={50} closeDelay={0}>
        <Tooltip>
          <TooltipTrigger>
            <button>x</button>
          </TooltipTrigger>
          <TooltipContent>Label</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    act(() => fireEvent.pointerEnter(screen.getByRole('button')));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});
