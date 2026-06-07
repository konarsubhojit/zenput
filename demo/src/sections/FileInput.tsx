import React, { useState } from 'react';
import { FileInput } from 'zenput';
import { Section, Scenario } from './_shell';

export function FileInputSection() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Section
      id="file-input"
      name="FileInput"
      description="File picker with optional dropzone, thumbnail preview and progress bar."
    >
      <Scenario title="Default">
        <FileInput label="Attachment" helperText="PDF, up to 5 MB" />
      </Scenario>
      <Scenario title="Dropzone with file names">
        <FileInput
          label="Documents"
          dropzone
          multiple
          showFileNames
          buttonLabel="Choose files"
        />
      </Scenario>
      <Scenario title="Controlled (remove/reorder + maxFiles)">
        <FileInput
          label="Gallery"
          dropzone
          multiple
          maxFiles={5}
          value={files}
          onChange={setFiles}
          buttonLabel="Add images"
          accept="image/*"
          helperText="Up to 5 images; use ↑/↓ to reorder and ✕ to remove"
        />
      </Scenario>
      <Scenario title="Upload progress">
        <FileInput label="Avatar" accept="image/*" uploading uploadProgress={65} />
      </Scenario>
    </Section>
  );
}
