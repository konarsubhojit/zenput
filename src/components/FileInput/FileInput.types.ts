import React from 'react';
import { BaseInputProps } from '../../types';

export interface FileInputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'size' | 'type' | 'value' | 'defaultValue' | 'multiple'
    >,
    BaseInputProps {
  /** Button label text */
  buttonLabel?: string;
  /** Show selected file names */
  showFileNames?: boolean;
  /** Allow drag-and-drop */
  dropzone?: boolean;
  /**
   * Selected files (controlled).
   * When provided, the component does not manage its own file array.
   */
  value?: File[];
  /** Called when selected files change (controlled/uncontrolled). */
  onFilesChange?: (files: File[]) => void;
  /** Whether multiple files can be selected */
  multiple?: boolean;
  /** Maximum number of files allowed (enforced on selection) */
  maxFiles?: number;
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
