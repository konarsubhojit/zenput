import type { ValidationState } from '../types/common';

/**
 * Gets the appropriate message based on validation state
 * @param validationState - Current validation state
 * @param errorMessage - Message to show in error state
 * @param successMessage - Message to show in success state
 * @param warningMessage - Message to show in warning state
 * @param helperText - Default helper text
 * @returns The active message to display
 */
export function getValidationMessage(
  validationState: ValidationState = 'default',
  errorMessage?: string,
  successMessage?: string,
  warningMessage?: string,
  helperText?: string
): string | undefined {
  if (validationState === 'error') return errorMessage;
  if (validationState === 'success') return successMessage;
  if (validationState === 'warning') return warningMessage;
  return helperText;
}

/**
 * Gets the CSS class name for validation message styling
 * @param validationState - Current validation state
 * @param styles - CSS modules styles object containing message class names
 * @returns The appropriate CSS class name
 */
export function getValidationMessageClass(
  validationState: ValidationState = 'default',
  styles: {
    errorText?: string;
    successText?: string;
    warningText?: string;
    helperText?: string;
  }
): string | undefined {
  if (validationState === 'error') return styles.errorText;
  if (validationState === 'success') return styles.successText;
  if (validationState === 'warning') return styles.warningText;
  return styles.helperText;
}
