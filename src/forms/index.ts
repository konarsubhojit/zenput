/**
 * `zenput/forms` — opt-in form integration for Zenput.
 *
 * Exports a `<Form>` compound component and `useZenputForm` hook that wire
 * up react-hook-form + Zod validation to Zenput input components.
 *
 * Peer dependencies (must be installed by the consumer):
 *   - `react-hook-form` ≥7
 *   - `@hookform/resolvers` ≥3
 *   - `zod` ≥3 (when using a Zod schema)
 */
export { Form } from './Form';
export { useZenputForm } from './useZenputForm';
export type {
  FormProps,
  FormFieldProps,
  FormSubmitProps,
  FormResetProps,
  FormErrorSummaryProps,
  FieldRenderProps,
  UseZenputFormOptions,
} from './Form.types';
