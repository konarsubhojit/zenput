import React from 'react';
import { render, screen } from '@testing-library/react';
import { Divider } from './Divider';
import { expectNoA11yViolations } from '../../../test-utils/axe';

describe('Divider', () => {
  it('renders a separator with horizontal orientation by default', () => {
    render(<Divider />);
    const el = screen.getByRole('separator');
    expect(el).toHaveAttribute('aria-orientation', 'horizontal');
    expect(el.className).toMatch(/horizontal/);
  });

  it('supports vertical orientation', () => {
    render(<Divider orientation="vertical" />);
    const el = screen.getByRole('separator');
    expect(el).toHaveAttribute('aria-orientation', 'vertical');
    expect(el.className).toMatch(/vertical/);
  });

  it('renders a label when provided', () => {
    render(<Divider label="or" />);
    expect(screen.getByText('or')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('applies strong class when strong', () => {
    render(<Divider strong />);
    expect(screen.getByRole('separator').className).toMatch(/strong/);
  });

  it('applies strong styling even when a label is present', () => {
    render(<Divider label="or" strong />);
    expect(screen.getByRole('separator').className).toMatch(/labelWrapperStrong/);
  });
});

describe('a11y (axe)', () => {
  it('has no detectable axe violations in default render', async () => {
    const { container } = render(<Divider label="or" />);
    await expectNoA11yViolations(container);
  });
});
