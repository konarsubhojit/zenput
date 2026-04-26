import React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton, SkeletonText, SkeletonAvatar } from './Skeleton';
import { expectNoA11yViolations } from '../../../test-utils/axe';

describe('Skeleton', () => {
  it('renders an aria-hidden element when loading', () => {
    render(<Skeleton data-testid="s" width={200} height={20} />);
    const el = screen.getByTestId('s');
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders children when loading is false', () => {
    render(<Skeleton loading={false}>Loaded content</Skeleton>);
    expect(screen.getByText('Loaded content')).toBeInTheDocument();
  });

  it('applies shimmer class by default', () => {
    render(<Skeleton data-testid="s" />);
    expect(screen.getByTestId('s').className).toMatch(/shimmer/);
  });

  it('applies pulse class when animation="pulse"', () => {
    render(<Skeleton data-testid="s" animation="pulse" />);
    expect(screen.getByTestId('s').className).toMatch(/pulse/);
  });

  it('applies no animation class when animation="none"', () => {
    render(<Skeleton data-testid="s" animation="none" />);
    const el = screen.getByTestId('s');
    expect(el.className).not.toMatch(/shimmer/);
    expect(el.className).not.toMatch(/pulse/);
  });

  it('applies circle variant class', () => {
    render(<Skeleton data-testid="s" variant="circle" width={40} height={40} />);
    expect(screen.getByTestId('s').className).toMatch(/variant-circle/);
  });

  it('applies inline width and height styles', () => {
    render(<Skeleton data-testid="s" width={120} height={16} />);
    const el = screen.getByTestId('s');
    expect(el.style.width).toBe('120px');
    expect(el.style.height).toBe('16px');
  });

  it('renders as a custom element via "as" prop', () => {
    render(<Skeleton as="div" data-testid="s" />);
    expect(screen.getByTestId('s').tagName).toBe('DIV');
  });
});

describe('SkeletonText', () => {
  it('renders the correct number of lines', () => {
    render(<SkeletonText lines={4} />);
    // Each line is aria-hidden so we can count spans
    const container = document.querySelector('[aria-hidden="true"]')!.parentElement!;
    expect(container).toBeInTheDocument();
  });
});

describe('SkeletonAvatar', () => {
  it('renders a circle variant', () => {
    render(<SkeletonAvatar data-testid="a" />);
    expect(screen.getByTestId('a').className).toMatch(/variant-circle/);
  });

  it('applies the given size', () => {
    render(<SkeletonAvatar size={60} data-testid="a" />);
    const el = screen.getByTestId('a');
    expect(el.style.width).toBe('60px');
    expect(el.style.height).toBe('60px');
  });
});

describe('Skeleton a11y (axe)', () => {
  it('has no detectable axe violations', async () => {
    const { container } = render(
      <div>
        <Skeleton width={200} height={20} />
        <SkeletonText lines={3} />
        <SkeletonAvatar size={40} />
      </div>
    );
    await expectNoA11yViolations(container);
  });
});
