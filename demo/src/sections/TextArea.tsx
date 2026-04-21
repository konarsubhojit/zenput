import { TextArea } from 'zenput';
import { Section, Scenario } from './_shell';

export function TextAreaSection() {
  return (
    <Section
      id="text-area"
      name="TextArea"
      description="Multi-line text with optional auto-resize and character counter."
    >
      <Scenario title="Default">
        <TextArea label="Description" placeholder="Describe your issue" rows={4} />
      </Scenario>
      <Scenario title="Auto-resize + character count">
        <TextArea
          label="Tweet"
          autoResize
          showCharCount
          maxLength={140}
          placeholder="What's happening?"
        />
      </Scenario>
      <Scenario title="Validation states">
        <TextArea
          label="Feedback"
          validationState="error"
          errorMessage="Please add a few more details."
          defaultValue="Bug"
        />
        <TextArea label="Disabled" disabled defaultValue="Cannot edit" />
      </Scenario>
    </Section>
  );
}
