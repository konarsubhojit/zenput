import { SelectInput } from 'zenput';
import { Section, Scenario } from './_shell';

const SELECT_OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
  { value: 'in', label: 'India' },
];

export function SelectInputSection() {
  return (
    <Section
      id="select-input"
      name="SelectInput"
      description="Native select with optional multi-select chips."
    >
      <Scenario title="Single-select">
        <SelectInput
          label="Country"
          placeholder="Choose a country"
          options={SELECT_OPTIONS}
        />
      </Scenario>
      <Scenario title="Multi-select">
        <SelectInput
          label="Countries"
          multiple
          options={SELECT_OPTIONS}
          multiplePlaceholder="Add country…"
        />
      </Scenario>
      <Scenario title="Validation & disabled">
        <SelectInput
          label="Required"
          required
          validationState="error"
          errorMessage="Please choose an option"
          options={SELECT_OPTIONS}
          placeholder="Select…"
        />
        <SelectInput label="Disabled" options={SELECT_OPTIONS} disabled defaultValue="us" />
      </Scenario>
    </Section>
  );
}
