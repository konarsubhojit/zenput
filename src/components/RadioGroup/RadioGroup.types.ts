import { BaseInputProps } from '../../types';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps
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
  /** Name attribute for radio inputs */
  name: string;
  /** List of radio options */
  options: RadioOption[];
  /** Currently selected value (controlled) */
  value?: string;
  /** Default selected value (uncontrolled) */
  defaultValue?: string;
  /** Called when selection changes */
  onChange?: (value: string) => void;
  /** Layout direction */
  direction?: 'horizontal' | 'vertical';
  /** id for the group */
  id?: string;
}
