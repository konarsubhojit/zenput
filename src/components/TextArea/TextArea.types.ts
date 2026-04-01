import React from 'react';
import { BaseInputProps } from '../../types';

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    BaseInputProps {
  /** Auto resize to fit content */
  autoResize?: boolean;
  /** Show character count */
  showCharCount?: boolean;
}
