import { useState } from 'react';
import { Checkbox, Text } from 'zenput';
import { Section, Scenario } from './_shell';

export function CheckboxSection() {
  const [checked, setChecked] = useState(false);
  return (
    <Section
      id="checkbox"
      name="Checkbox"
      description="Single checkbox with checked, indeterminate and disabled states."
    >
      <Scenario title="States">
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="Disabled" disabled />
      </Scenario>
      <Scenario title="Controlled">
        <Checkbox
          label="Accept terms"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <Text size="sm" tone="secondary">
          Accepted: {checked ? 'yes' : 'no'}
        </Text>
      </Scenario>
      <Scenario title="With error">
        <Checkbox
          label="I agree"
          validationState="error"
          errorMessage="You must accept the terms to continue"
          required
        />
      </Scenario>
    </Section>
  );
}
