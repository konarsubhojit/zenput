import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';
import { Form } from './Form';
import { useZenputForm } from './useZenputForm';
import { TextInput } from '../components/TextInput/TextInput';
import { PasswordInput } from '../components/PasswordInput/PasswordInput';
import { Button } from '../components/actions/Button/Button';

const meta: Meta = {
  title: 'Forms/Form (react-hook-form + zod)',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// ---------------------------------------------------------------------------
// Story 1 – Basic login form (rhf + zod)
// ---------------------------------------------------------------------------

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
type LoginValues = z.infer<typeof loginSchema>;

function LoginFormExample() {
  const [submitted, setSubmitted] = useState<LoginValues | null>(null);
  const form = useZenputForm<LoginValues>({
    schema: loginSchema,
    defaultValues: { email: '', password: '' },
  });

  return (
    <div style={{ maxWidth: 400, padding: 24, fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: 16 }}>Login</h2>
      <Form
        form={form}
        onSubmit={(values) => setSubmitted(values)}
        style={{ gap: 16, display: 'flex', flexDirection: 'column' }}
      >
        <Form.ErrorSummary />
        <Form.Field<LoginValues> name="email">
          {(field) => (
            <TextInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              validationState={field.props.validationState}
              errorMessage={field.props.errorMessage}
              value={field.props.value as string}
              onChange={(e) => field.props.onChange(e.target.value)}
              onBlur={field.props.onBlur}
              ref={field.props.ref as React.Ref<HTMLInputElement>}
              name={field.props.name}
              fullWidth
            />
          )}
        </Form.Field>
        <Form.Field<LoginValues> name="password">
          {(field) => (
            <PasswordInput
              label="Password"
              placeholder="••••••••"
              validationState={field.props.validationState}
              errorMessage={field.props.errorMessage}
              value={field.props.value as string}
              onChange={(e) => field.props.onChange(e.target.value)}
              onBlur={field.props.onBlur}
              ref={field.props.ref as React.Ref<HTMLInputElement>}
              name={field.props.name}
              fullWidth
            />
          )}
        </Form.Field>
        <div style={{ display: 'flex', gap: 8 }}>
          <Form.Submit>
            <Button type="submit" loading={form.formState.isSubmitting} fullWidth>
              Sign in
            </Button>
          </Form.Submit>
          <Form.Reset>
            <Button type="reset" variant="outline">
              Clear
            </Button>
          </Form.Reset>
        </div>
      </Form>
      {submitted && (
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: '#f0fdf4',
            borderRadius: 6,
            fontSize: 13,
          }}
        >
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </div>
  );
}

export const LoginForm: Story = {
  render: () => <LoginFormExample />,
};

// ---------------------------------------------------------------------------
// Story 2 – Async server-side errors
// ---------------------------------------------------------------------------

const registrationSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email'),
});
type RegistrationValues = z.infer<typeof registrationSchema>;

function AsyncErrorsExample() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  const form = useZenputForm<RegistrationValues>({
    schema: registrationSchema,
    defaultValues: { username: '', email: '' },
  });

  const handleSubmit = async (values: RegistrationValues) => {
    // Simulate async server check
    await new Promise((r) => setTimeout(r, 800));

    if (values.username === 'admin') {
      form.setError('username', {
        type: 'server',
        message: 'Username "admin" is already taken',
      });
      return;
    }

    setSubmitted(`Registered as ${values.username}`);
  };

  return (
    <div style={{ maxWidth: 400, padding: 24, fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: 16 }}>Register (try username "admin")</h2>
      <Form
        form={form}
        onSubmit={handleSubmit}
        style={{ gap: 16, display: 'flex', flexDirection: 'column' }}
      >
        <Form.ErrorSummary />
        <Form.Field<RegistrationValues> name="username">
          {(field) => (
            <TextInput
              label="Username"
              validationState={field.props.validationState}
              errorMessage={field.props.errorMessage}
              value={field.props.value as string}
              onChange={(e) => field.props.onChange(e.target.value)}
              onBlur={field.props.onBlur}
              ref={field.props.ref as React.Ref<HTMLInputElement>}
              name={field.props.name}
              fullWidth
            />
          )}
        </Form.Field>
        <Form.Field<RegistrationValues> name="email">
          {(field) => (
            <TextInput
              label="Email"
              type="email"
              validationState={field.props.validationState}
              errorMessage={field.props.errorMessage}
              value={field.props.value as string}
              onChange={(e) => field.props.onChange(e.target.value)}
              onBlur={field.props.onBlur}
              ref={field.props.ref as React.Ref<HTMLInputElement>}
              name={field.props.name}
              fullWidth
            />
          )}
        </Form.Field>
        <Form.Submit>
          {form.formState.isSubmitting ? 'Checking…' : 'Register'}
        </Form.Submit>
      </Form>
      {submitted && (
        <p style={{ marginTop: 12, color: '#16a34a', fontWeight: 600 }}>{submitted}</p>
      )}
    </div>
  );
}

export const AsyncServerErrors: Story = {
  render: () => <AsyncErrorsExample />,
};

// ---------------------------------------------------------------------------
// Story 3 – useFormField recipe (no form library)
// ---------------------------------------------------------------------------

import { useFormField } from '../hooks/useFormField';
import { useState as useReactState } from 'react';

function NoLibraryExample() {
  const [value, setValue] = useReactState('');
  const [error, setError] = useReactState('');
  const [submitted, setSubmitted] = useReactState<string | null>(null);

  const { inputId, helperId: _helperId, labelProps: _labelProps, inputAriaProps } = useFormField({
    id: 'no-lib-email',
    label: 'Email',
    errorMessage: error,
    validationState: error ? 'error' : 'default',
    required: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setSubmitted(value);
  };

  return (
    <div style={{ maxWidth: 400, padding: 24, fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: 16 }}>useFormField recipe (no library)</h2>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
        Use <code>useFormField</code> directly for consumers who don't want a form library.
      </p>
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TextInput
          id={inputId}
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(''); }}
          validationState={error ? 'error' : 'default'}
          errorMessage={error}
          required
          fullWidth
          {...inputAriaProps}
        />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Submit
        </button>
      </form>
      {submitted && (
        <p style={{ marginTop: 12, color: '#16a34a' }}>Submitted: {submitted}</p>
      )}
    </div>
  );
}

export const UseFormFieldRecipe: Story = {
  render: () => <NoLibraryExample />,
};
