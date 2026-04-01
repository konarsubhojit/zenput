import React from 'react';
import { BaseInputProps } from '../../types';

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    BaseInputProps {}
