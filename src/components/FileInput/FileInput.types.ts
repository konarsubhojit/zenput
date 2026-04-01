import React from 'react';
import { BaseInputProps } from '../../types';

export interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    BaseInputProps {
  /** Button label text */
  buttonLabel?: string;
  /** Show selected file names */
  showFileNames?: boolean;
  /** Allow drag-and-drop */
  dropzone?: boolean;
}
