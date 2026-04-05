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
  /**
   * URL (or data-URL) of the currently-saved image.
   * Renders a thumbnail that updates to a live object-URL preview
   * as soon as a new file is picked.
   */
  previewSrc?: string;
  /** Whether an upload is in progress */
  uploading?: boolean;
  /**
   * Upload progress percentage (0–100).
   * Renders a progress bar inside the component when provided.
   */
  uploadProgress?: number;
}
