import { vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldMessage,
  FieldCounter,
  useFieldControlProps,
} from './Field';
import { expectNoA11yViolations } from '../../test-utils/axe';

// ---------------------------------------------------------------------------
// Field (shorthand props)
// ---------------------------------------------------------------------------

describe('Field (shorthand props)', () => {
  it('renders without errors', () => {
    render(<Field><input /></Field>);
  });

  it('renders shorthand label', () => {
    render(<Field label="Full Name"><input /></Field>);
    expect(screen.getByText('Full Name')).toBeInTheDocument();
  });

  it('renders shorthand description', () => {
    render(<Field description="Enter your full name"><input /></Field>);
    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
  });

  it('renders shorthand message', () => {
    render(
      <Field message="This field is required" validationState="error">
        <input />
      </Field>
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('sets validationState to error when error prop is true', () => {
    render(
      <Field error message="Error occurred">
        <input />
      </Field>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('renders with fullWidth prop without error', () => {
    const { container } = render(<Field fullWidth><input /></Field>);
    expect(container.firstChild).toBeTruthy();
  });

  it('label is a label element when required is true', () => {
    render(<Field label="Name" required><input /></Field>);
    const label = screen.getByText('Name').closest('label');
    expect(label).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// FieldLabel
// ---------------------------------------------------------------------------

describe('FieldLabel', () => {
  it('renders label text', () => {
    render(
      <Field>
        <FieldLabel>My Label</FieldLabel>
        <input />
      </Field>
    );
    expect(screen.getByText('My Label')).toBeInTheDocument();
  });

  it('associates label with control via htmlFor', () => {
    render(
      <Field id="my-input">
        <FieldLabel>Label</FieldLabel>
        <input id="my-input" />
      </Field>
    );
    const label = screen.getByText('Label');
    expect(label).toHaveAttribute('for', 'my-input');
  });

  it('label element is rendered when Field is required', () => {
    render(
      <Field required>
        <FieldLabel>Label</FieldLabel>
        <input />
      </Field>
    );
    const label = screen.getByText('Label').closest('label');
    expect(label).not.toBeNull();
  });

  it('throws if rendered outside Field', () => {
    // suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<FieldLabel>Label</FieldLabel>)).toThrow();
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// FieldControl
// ---------------------------------------------------------------------------

describe('FieldControl', () => {
  it('renders a div by default', () => {
    const { container } = render(
      <Field id="ctrl">
        <FieldControl>content</FieldControl>
      </Field>
    );
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('renders as a custom element type', () => {
    const { container } = render(
      <Field id="ctrl">
        <FieldControl as="input" />
      </Field>
    );
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('sets the id from Field context', () => {
    const { container } = render(
      <Field id="my-field">
        <FieldControl as="input" />
      </Field>
    );
    expect(container.querySelector('input')).toHaveAttribute('id', 'my-field');
  });

  it('sets aria-invalid when validationState is error', () => {
    const { container } = render(
      <Field id="my-field" validationState="error">
        <FieldControl as="input" />
      </Field>
    );
    expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-required when required', () => {
    const { container } = render(
      <Field id="my-field" required>
        <FieldControl as="input" />
      </Field>
    );
    expect(container.querySelector('input')).toHaveAttribute('aria-required', 'true');
  });

  it('sets aria-disabled when disabled', () => {
    const { container } = render(
      <Field id="my-field" disabled>
        <FieldControl as="input" />
      </Field>
    );
    expect(container.querySelector('input')).toHaveAttribute('aria-disabled', 'true');
  });

  it('throws if rendered outside Field', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<FieldControl as="input" />)).toThrow();
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// FieldDescription
// ---------------------------------------------------------------------------

describe('FieldDescription', () => {
  it('renders description text', () => {
    render(
      <Field>
        <FieldDescription>Helpful hint</FieldDescription>
        <input />
      </Field>
    );
    expect(screen.getByText('Helpful hint')).toBeInTheDocument();
  });

  it('has the expected id', () => {
    render(
      <Field id="f">
        <FieldDescription>hint</FieldDescription>
        <input />
      </Field>
    );
    const desc = screen.getByText('hint');
    expect(desc).toHaveAttribute('id', 'f-description');
  });

  it('throws if rendered outside Field', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<FieldDescription>desc</FieldDescription>)).toThrow();
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// FieldMessage
// ---------------------------------------------------------------------------

describe('FieldMessage', () => {
  it('renders message text', () => {
    render(
      <Field validationState="error">
        <FieldMessage>Error occurred</FieldMessage>
        <input />
      </Field>
    );
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('has role="alert"', () => {
    render(
      <Field validationState="error">
        <FieldMessage>Error</FieldMessage>
        <input />
      </Field>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders error message with role="alert"', () => {
    render(
      <Field>
        <FieldMessage type="error">Error</FieldMessage>
        <input />
      </Field>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders success message with role="alert"', () => {
    render(
      <Field>
        <FieldMessage type="success">Success</FieldMessage>
        <input />
      </Field>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('renders warning message with role="alert"', () => {
    render(
      <Field>
        <FieldMessage type="warning">Warning</FieldMessage>
        <input />
      </Field>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('renders message when using Field validationState', () => {
    render(
      <Field validationState="warning">
        <FieldMessage>Watch out</FieldMessage>
        <input />
      </Field>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Watch out')).toBeInTheDocument();
  });

  it('throws if rendered outside Field', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<FieldMessage>msg</FieldMessage>)).toThrow();
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// FieldCounter
// ---------------------------------------------------------------------------

describe('FieldCounter', () => {
  it('renders current/max', () => {
    render(
      <Field>
        <FieldCounter current={5} max={20} />
        <input />
      </Field>
    );
    expect(screen.getByText('5/20')).toBeInTheDocument();
  });

  it('counter text turns red when current > max (has aria-live)', () => {
    render(
      <Field>
        <FieldCounter current={25} max={20} />
        <input />
      </Field>
    );
    const counter = screen.getByText('25/20');
    expect(counter).toHaveAttribute('aria-live', 'polite');
  });

  it('does not apply exceeded class when current <= max', () => {
    render(
      <Field>
        <FieldCounter current={10} max={20} />
        <input />
      </Field>
    );
    expect(screen.getByText('10/20')).not.toHaveClass('exceeded');
  });

  it('has aria-live="polite"', () => {
    render(
      <Field>
        <FieldCounter current={5} max={20} />
        <input />
      </Field>
    );
    expect(screen.getByText('5/20')).toHaveAttribute('aria-live', 'polite');
  });

  it('throws if rendered outside Field', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<FieldCounter current={0} max={10} />)).toThrow();
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// useFieldControlProps
// ---------------------------------------------------------------------------

describe('useFieldControlProps', () => {
  it('returns empty object when used outside Field', () => {
    let result: Record<string, unknown> = { sentinel: true };
    function Consumer() {
      result = useFieldControlProps();
      return null;
    }
    render(<Consumer />);
    expect(result).toEqual({});
  });

  it('returns id and aria-describedby inside Field', () => {
    let result: Record<string, unknown> = {};
    function Consumer() {
      result = useFieldControlProps();
      return null;
    }
    render(
      <Field id="test-field">
        <Consumer />
      </Field>
    );
    expect(result.id).toBe('test-field');
    expect(typeof result['aria-describedby']).toBe('string');
  });

  it('includes aria-invalid when validationState is error', () => {
    let result: Record<string, unknown> = {};
    function Consumer() {
      result = useFieldControlProps();
      return null;
    }
    render(
      <Field id="test-field" validationState="error">
        <Consumer />
      </Field>
    );
    expect(result['aria-invalid']).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Accessibility (axe)
// ---------------------------------------------------------------------------

describe('a11y (axe)', () => {
  it('has no violations with shorthand label', async () => {
    const { container } = render(
      <Field label="Name" required>
        <FieldControl as="input" type="text" />
      </Field>
    );
    await expectNoA11yViolations(container);
  });

  it('has no violations with advanced composition', async () => {
    const { container } = render(
      <Field id="adv-field">
        <FieldLabel>Email</FieldLabel>
        <FieldControl as="input" type="email" />
        <FieldDescription>We will never share your email</FieldDescription>
      </Field>
    );
    await expectNoA11yViolations(container);
  });
});
