import { BaseInputProps } from '../../types';

export type OTPInputType = 'numeric' | 'alphanumeric';

export interface OTPInputProps
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
  /** Number of OTP digits */
  length?: number;
  /** Current value */
  value?: string;
  /** Default value */
  defaultValue?: string;
  /** Called when the OTP value changes */
  onChange?: (value: string) => void;
  /** Called when all digits are filled */
  onComplete?: (value: string) => void;
  /** Input type restriction */
  inputType?: OTPInputType;
  /** Mask the input like a password */
  mask?: boolean;
  /** id prefix */
  id?: string;
}
