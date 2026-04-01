import { BaseInputProps } from '../../types';

export interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps
  extends Pick<
    BaseInputProps,
    | 'size'
    | 'validationState'
    | 'label'
    | 'helperText'
    | 'errorMessage'
    | 'required'
    | 'disabled'
    | 'wrapperClassName'
    | 'wrapperStyle'
    | 'labelClassName'
    | 'labelStyle'
    | 'helperTextClassName'
    | 'helperTextStyle'
  > {
  /** List of checkbox options */
  options: CheckboxOption[];
  /** Currently selected values (controlled) */
  value?: string[];
  /** Default selected values (uncontrolled) */
  defaultValue?: string[];
  /** Called when selection changes */
  onChange?: (values: string[]) => void;
  /** Layout direction */
  direction?: 'horizontal' | 'vertical';
  /** id for the group */
  id?: string;
}
