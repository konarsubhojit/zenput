import { RadioGroup } from 'zenput';
import { Section, Scenario } from './_shell';

export function RadioGroupSection() {
  return (
    <Section
      id="radio-group"
      name="RadioGroup"
      description="Single-choice group with horizontal or vertical layout."
    >
      <Scenario title="Vertical">
        <RadioGroup
          name="plan"
          label="Plan"
          defaultValue="pro"
          options={[
            { value: 'free', label: 'Free' },
            { value: 'pro', label: 'Pro' },
            { value: 'team', label: 'Team' },
          ]}
        />
      </Scenario>
      <Scenario title="Horizontal">
        <RadioGroup
          name="size"
          label="T-shirt size"
          direction="horizontal"
          options={[
            { value: 's', label: 'S' },
            { value: 'm', label: 'M' },
            { value: 'l', label: 'L' },
            { value: 'xl', label: 'XL' },
          ]}
        />
      </Scenario>
      <Scenario title="Disabled option & error">
        <RadioGroup
          name="shipping"
          label="Shipping"
          validationState="error"
          errorMessage="Please choose a shipping method"
          options={[
            { value: 'standard', label: 'Standard (3–5 days)' },
            { value: 'express', label: 'Express (1–2 days)' },
            { value: 'overnight', label: 'Overnight', disabled: true },
          ]}
        />
      </Scenario>
    </Section>
  );
}
