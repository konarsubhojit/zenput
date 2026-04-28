import React from 'react';
import { render, screen } from '@testing-library/react';
import { SkipLink } from './SkipLink';
import { expectNoA11yViolations } from '../../../test-utils/axe';

describe('SkipLink', () => {
  it('renders an anchor with default href and label', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link', { name: 'Skip to main content' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#main');
  });

  it('accepts a custom href', () => {
    render(<SkipLink href="#content" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '#content');
  });

  it('renders custom children', () => {
    render(<SkipLink>Go to navigation</SkipLink>);
    expect(screen.getByRole('link', { name: 'Go to navigation' })).toBeInTheDocument();
  });

  it('forwards additional HTML attributes', () => {
    render(<SkipLink data-testid="skip" />);
    expect(screen.getByTestId('skip')).toBeInTheDocument();
  });

  it('merges className with base styles', () => {
    render(<SkipLink className="custom-cls" data-testid="skip" />);
    expect(screen.getByTestId('skip').className).toMatch(/custom-cls/);
  });
});

describe('SkipLink a11y (axe)', () => {
  it('has no detectable axe violations', async () => {
    const { container } = render(
      <main>
        <SkipLink href="#main" />
        <div id="main">Main content</div>
      </main>
    );
    await expectNoA11yViolations(container);
  });
});
