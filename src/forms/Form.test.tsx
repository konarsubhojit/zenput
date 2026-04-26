import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { z } from 'zod';
import { Form } from './Form';
import { useZenputForm } from './useZenputForm';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
});

type EmailFormValues = z.infer<typeof emailSchema>;

function TestForm({
  onSubmit = vi.fn(),
  defaultValues = { email: '', name: '' },
}: {
  onSubmit?: (values: EmailFormValues) => void | Promise<void>;
  defaultValues?: Partial<EmailFormValues>;
}) {
  const form = useZenputForm<EmailFormValues>({
    schema: emailSchema,
    defaultValues,
    mode: 'onSubmit',
  });

  return (
    <Form form={form} onSubmit={onSubmit}>
      <Form.Field<EmailFormValues> name="email">
        {(field) => (
          <div>
            <label htmlFor="email-input">Email</label>
            <input
              id="email-input"
              data-testid="email-input"
              {...field.props}
              value={field.props.value as string}
              onChange={(e) => field.props.onChange(e.target.value)}
            />
            {field.errorMessage && (
              <span data-testid="email-error">{field.errorMessage}</span>
            )}
          </div>
        )}
      </Form.Field>
      <Form.Field<EmailFormValues> name="name">
        {(field) => (
          <div>
            <label htmlFor="name-input">Name</label>
            <input
              id="name-input"
              data-testid="name-input"
              {...field.props}
              value={field.props.value as string}
              onChange={(e) => field.props.onChange(e.target.value)}
            />
            {field.errorMessage && (
              <span data-testid="name-error">{field.errorMessage}</span>
            )}
          </div>
        )}
      </Form.Field>
      <Form.ErrorSummary />
      <Form.Submit>Submit</Form.Submit>
      <Form.Reset>Reset</Form.Reset>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// Tests: Form rendering
// ---------------------------------------------------------------------------

describe('Form', () => {
  it('renders a <form> element', () => {
    render(<TestForm />);
    // The form element needs an accessible name to be found by role="form".
    // Verify the DOM element directly.
    expect(document.querySelector('form')).toBeInTheDocument();
  });

  it('renders submit and reset buttons', () => {
    render(<TestForm />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('does not show error summary initially', () => {
    render(<TestForm />);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Tests: Form.Field
// ---------------------------------------------------------------------------

describe('Form.Field', () => {
  it('renders the child with the correct field name', () => {
    render(<TestForm />);
    const emailInput = screen.getByTestId('email-input');
    expect(emailInput).toHaveAttribute('name', 'email');
  });

  it('sets validationState="error" and shows errorMessage when invalid', async () => {
    render(<TestForm />);
    fireEvent.submit(document.querySelector('form')!);

    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toHaveTextContent('Invalid email address');
    });
  });

  it('does not show errors for a valid field value', async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    await user.type(screen.getByTestId('email-input'), 'test@example.com');
    await user.type(screen.getByTestId('name-input'), 'Alice');
    fireEvent.submit(document.querySelector('form')!);

    await waitFor(() => {
      expect(screen.queryByTestId('email-error')).toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// Tests: Form.Submit
// ---------------------------------------------------------------------------

describe('Form.Submit', () => {
  it('has type="submit"', () => {
    render(<TestForm />);
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit');
  });

  it('calls onSubmit with form values when form is valid', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<TestForm onSubmit={onSubmit} />);

    await user.type(screen.getByTestId('email-input'), 'test@example.com');
    await user.type(screen.getByTestId('name-input'), 'Alice');
    fireEvent.submit(document.querySelector('form')!);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        { email: 'test@example.com', name: 'Alice' },
        expect.anything()
      );
    });
  });

  it('does not call onSubmit when validation fails', async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);
    fireEvent.submit(document.querySelector('form')!);

    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Tests: Form.Reset
// ---------------------------------------------------------------------------

describe('Form.Reset', () => {
  it('has type="reset"', () => {
    render(<TestForm />);
    expect(screen.getByRole('button', { name: 'Reset' })).toHaveAttribute('type', 'reset');
  });
});

// ---------------------------------------------------------------------------
// Tests: Form.ErrorSummary
// ---------------------------------------------------------------------------

describe('Form.ErrorSummary', () => {
  it('is not rendered when there are no errors', () => {
    render(<TestForm />);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('renders all field errors after failed submit', async () => {
    render(<TestForm />);
    fireEvent.submit(document.querySelector('form')!);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Invalid email address');
      expect(alert).toHaveTextContent('Name is required');
    });
  });

  it('has aria-live="polite" for screen readers', async () => {
    render(<TestForm />);
    fireEvent.submit(document.querySelector('form')!);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'polite');
    });
  });
});

// ---------------------------------------------------------------------------
// Tests: useZenputForm
// ---------------------------------------------------------------------------

describe('useZenputForm', () => {
  it('returns a react-hook-form UseFormReturn object', () => {
    function TestHook() {
      const form = useZenputForm({
        schema: z.object({ x: z.string() }),
        defaultValues: { x: '' },
      });
      return <div data-testid="is-submitting">{String(form.formState.isSubmitting)}</div>;
    }
    render(<TestHook />);
    expect(screen.getByTestId('is-submitting')).toHaveTextContent('false');
  });

  it('works without a schema', () => {
    function TestHook() {
      const form = useZenputForm({ defaultValues: { x: '' } });
      return <div data-testid="dirty">{String(form.formState.isDirty)}</div>;
    }
    render(<TestHook />);
    expect(screen.getByTestId('dirty')).toHaveTextContent('false');
  });
});
