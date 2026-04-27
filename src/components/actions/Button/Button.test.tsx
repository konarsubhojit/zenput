import { vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import { expectNoA11yViolations } from '../../../test-utils/axe';

describe('Button', () => {
  it('renders as a button with default type="button"', () => {
    render(<Button>Click</Button>);
    const btn = screen.getByRole('button', { name: 'Click' });
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('applies variant and size classes', () => {
    render(
      <Button variant="danger" size="lg">
        x
      </Button>
    );
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(/variant-danger/);
    expect(btn.className).toMatch(/size-lg/);
  });

  it('fires onClick', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>go</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and does not fire onClick when disabled', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        x
      </Button>
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('sets aria-busy and keeps the accessible name from the content when loading', () => {
    render(<Button loading>Saving</Button>);
    const btn = screen.getByRole('button', { name: 'Saving' });
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toBeDisabled();
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument();
    // No extra role="status" live region (would duplicate announcements).
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('uses loadingLabel to override the accessible name while loading', () => {
    render(
      <Button loading loadingLabel="Guardando…">
        Save
      </Button>
    );
    // aria-label takes precedence while loading.
    expect(screen.getByRole('button', { name: 'Guardando…' })).toBeInTheDocument();
  });

  it('renders icons on both sides', () => {
    render(
      <Button leftIcon={<span data-testid="l">L</span>} rightIcon={<span data-testid="r">R</span>}>
        Label
      </Button>
    );
    expect(screen.getByTestId('l')).toBeInTheDocument();
    expect(screen.getByTestId('r')).toBeInTheDocument();
  });

  it('applies iconOnly class when iconOnly is set', () => {
    render(
      <Button iconOnly aria-label="close">
        <span>×</span>
      </Button>
    );
    expect(screen.getByRole('button').className).toMatch(/iconOnly/);
  });

  it('respects a custom type', () => {
    render(<Button type="submit">s</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('renders as a different element via `as`', () => {
    render(
      <Button as="a" href="/x">
        link
      </Button>
    );
    const el = screen.getByText('link');
    expect(el.closest('a')).not.toBeNull();
    expect(el.closest('a')).toHaveAttribute('href', '/x');
  });

  it('merges button styles onto the child element via `asChild`', () => {
    render(
      <Button asChild variant="secondary">
        <a href="/x">go</a>
      </Button>
    );
    const el = screen.getByRole('link', { name: 'go' });
    expect(el.tagName).toBe('A');
    expect(el).toHaveAttribute('href', '/x');
    expect(el.className).toMatch(/button/);
    expect(el.className).toMatch(/variant-secondary/);
  });

  it('adds aria-disabled when disabled and using asChild', () => {
    render(
      <Button asChild disabled>
        <a href="/x">link</a>
      </Button>
    );
    const el = screen.getByRole('link', { name: 'link' });
    expect(el).toHaveAttribute('aria-disabled', 'true');
    expect(el).toHaveAttribute('data-disabled');
  });

  it('adds aria-disabled when loading and using asChild', () => {
    render(
      <Button asChild loading>
        <a href="/x">link</a>
      </Button>
    );
    const el = screen.getByRole('link', { name: 'link' });
    expect(el).toHaveAttribute('aria-disabled', 'true');
  });

  it('adds aria-disabled when disabled and using non-native as', () => {
    render(
      <Button as="a" href="/x" disabled>
        link
      </Button>
    );
    const el = screen.getByText('link').closest('a')!;
    expect(el).toHaveAttribute('aria-disabled', 'true');
    expect(el).toHaveAttribute('data-disabled');
  });

  it('composes onClick handlers when using `asChild`', () => {
    const parentClick = vi.fn();
    const childClick = vi.fn();
    render(
      <Button asChild onClick={parentClick}>
        <a href="#" onClick={childClick}>
          click
        </a>
      </Button>
    );
    fireEvent.click(screen.getByRole('link', { name: 'click' }));
    expect(childClick).toHaveBeenCalledTimes(1);
    expect(parentClick).toHaveBeenCalledTimes(1);
  });
});

describe('a11y (axe)', () => {
  it('has no detectable axe violations in default render', async () => {
    const { container } = render(
      <Button iconOnly aria-label="close">
        <span>×</span>
      </Button>
    );
    await expectNoA11yViolations(container);
  });
});
