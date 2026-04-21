import { TextInput } from 'zenput';
import { Section, Scenario } from './_shell';

export function TextInputSection() {
  return (
    <Section
      id="text-input"
      name="TextInput"
      description="Single-line text field with size, variant, validation-state, icons and floating labels."
    >
      <Scenario title="Sizes">
        <TextInput label="Small" size="sm" placeholder="sm" />
        <TextInput label="Medium" size="md" placeholder="md (default)" />
        <TextInput label="Large" size="lg" placeholder="lg" />
      </Scenario>
      <Scenario title="Variants">
        <TextInput label="Outlined" variant="outlined" defaultValue="Value" />
        <TextInput label="Filled" variant="filled" defaultValue="Value" />
        <TextInput label="Underlined" variant="underlined" defaultValue="Value" />
      </Scenario>
      <Scenario title="Validation states">
        <TextInput label="Error" validationState="error" errorMessage="This field is required" defaultValue="" />
        <TextInput label="Success" validationState="success" successMessage="Looks good!" defaultValue="Zenput" />
        <TextInput label="Warning" validationState="warning" warningMessage="Username is almost taken" defaultValue="zen" />
      </Scenario>
      <Scenario title="Icons, floating label & disabled">
        <TextInput
          label="Email"
          placeholder="you@example.com"
          prefixIcon={<span aria-hidden>✉</span>}
          helperText="We never share your address."
        />
        <TextInput label="Floating label" floatingLabel defaultValue="Hello" />
        <TextInput label="Read-only" readOnly defaultValue="Read-only value" />
        <TextInput label="Disabled" disabled defaultValue="Disabled value" />
      </Scenario>
    </Section>
  );
}
