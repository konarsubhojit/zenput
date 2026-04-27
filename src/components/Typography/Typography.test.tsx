import React from 'react';
import { render, screen } from '@testing-library/react';
import { Text } from './Text';
import { Heading } from './Heading';
import { Link } from './Link';
import { Code } from './Code';
import { Kbd } from './Kbd';
import { expectNoA11yViolations } from '../../test-utils/axe';

describe('Typography', () => {
  describe('Text', () => {
    it('renders a span by default', () => {
      render(<Text>hello</Text>);
      const el = screen.getByText('hello');
      expect(el.tagName).toBe('SPAN');
    });

    it('renders as the polymorphic element via `as`', () => {
      render(<Text as="p">hello</Text>);
      expect(screen.getByText('hello').tagName).toBe('P');
    });

    it('applies size, weight, tone, align, italic, underline, truncate classes', () => {
      render(
        <Text
          data-testid="t"
          size="lg"
          weight="bold"
          tone="danger"
          align="center"
          italic
          underline
          truncate
        >
          text
        </Text>
      );
      const el = screen.getByTestId('t');
      expect(el.className).toMatch(/size-lg/);
      expect(el.className).toMatch(/weight-bold/);
      expect(el.className).toMatch(/tone-danger/);
      expect(el.className).toMatch(/align-center/);
      expect(el.className).toMatch(/italic/);
      expect(el.className).toMatch(/underline/);
      expect(el.className).toMatch(/truncate/);
    });

    it('renders the single child element via `asChild`', () => {
      render(
        <Text asChild size="lg">
          <p>paragraph</p>
        </Text>
      );
      const el = screen.getByText('paragraph');
      expect(el.tagName).toBe('P');
      expect(el.className).toMatch(/text/);
      expect(el.className).toMatch(/size-lg/);
    });
  });

  describe('Heading', () => {
    it('renders h2 by default', () => {
      render(<Heading>t</Heading>);
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('renders the requested level', () => {
      render(<Heading level={1}>t</Heading>);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('can override element via `as`', () => {
      render(
        <Heading level={3} as="h1">
          t
        </Heading>
      );
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('renders the single child element via `asChild`', () => {
      render(
        <Heading asChild level={1}>
          <h3>section</h3>
        </Heading>
      );
      // asChild clones the child (h3), not h1
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      expect(screen.getByText('section').className).toMatch(/weight-semibold/);
    });
  });

  describe('Link', () => {
    it('renders an anchor with href', () => {
      render(<Link href="/foo">bar</Link>);
      const link = screen.getByRole('link', { name: 'bar' });
      expect(link).toHaveAttribute('href', '/foo');
    });

    it('adds target and rel when external', () => {
      render(
        <Link external href="https://example.com">
          ex
        </Link>
      );
      const link = screen.getByRole('link', { name: 'ex' });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
      expect(link.getAttribute('rel')).toContain('noreferrer');
    });

    it('supports polymorphic `as`', () => {
      render(<Link as="span">inline</Link>);
      expect(screen.getByText('inline').tagName).toBe('SPAN');
    });

    it('does not forward target or rel when rendered as a non-anchor element', () => {
      render(
        <Link as="span" external>
          not-a-link
        </Link>
      );
      const el = screen.getByText('not-a-link');
      expect(el).not.toHaveAttribute('target');
      expect(el).not.toHaveAttribute('rel');
    });

    it('renders the single child element via `asChild`', () => {
      render(
        <Link asChild>
          <button type="button">action</button>
        </Link>
      );
      const el = screen.getByRole('button', { name: 'action' });
      expect(el.tagName).toBe('BUTTON');
      expect(el.className).toMatch(/link/);
    });
  });

  describe('Code', () => {
    it('renders a <code> element', () => {
      const { container } = render(<Code>x</Code>);
      expect(container.querySelector('code')).toBeInTheDocument();
    });

    it('supports polymorphic `as`', () => {
      render(<Code as="span">inline</Code>);
      expect(screen.getByText('inline').tagName).toBe('SPAN');
    });

    it('renders the single child element via `asChild`', () => {
      render(
        <Code asChild>
          <samp>sample</samp>
        </Code>
      );
      const el = screen.getByText('sample');
      expect(el.tagName).toBe('SAMP');
      expect(el.className).toMatch(/code/);
    });
  });

  describe('Kbd', () => {
    it('renders a <kbd> element', () => {
      const { container } = render(<Kbd>Ctrl</Kbd>);
      expect(container.querySelector('kbd')).toBeInTheDocument();
    });

    it('supports polymorphic `as`', () => {
      render(<Kbd as="span">Shift</Kbd>);
      expect(screen.getByText('Shift').tagName).toBe('SPAN');
    });

    it('renders the single child element via `asChild`', () => {
      render(
        <Kbd asChild>
          <abbr>Esc</abbr>
        </Kbd>
      );
      const el = screen.getByText('Esc');
      expect(el.tagName).toBe('ABBR');
      expect(el.className).toMatch(/kbd/);
    });
  });
});

describe('a11y (axe)', () => {
  it('has no detectable axe violations in default render', async () => {
    const { container } = render(<Text as="p">hello</Text>);
    await expectNoA11yViolations(container);
  });
});
