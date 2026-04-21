import { useState } from 'react';
import { NumberInput, Text } from 'zenput';
import { Section, Scenario } from './_shell';

export function NumberInputSection() {
  const [value, setValue] = useState<number | undefined>(42);
  return (
    <Section
      id="number-input"
      name="NumberInput"
      description="Numeric field with min/max/step, increment controls and an optional display formatter."
    >
      <Scenario title="Controlled with steppers">
        <NumberInput
          label="Quantity"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          step={1}
        />
        <Text tone="secondary" size="sm">
          Current value: {value ?? '—'}
        </Text>
      </Scenario>
      <Scenario title="Formatted display">
        <NumberInput
          label="Price"
          defaultValue={1999}
          step={1}
          formatValue={(v) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        />
      </Scenario>
      <Scenario title="Without stepper controls">
        <NumberInput label="Percentage" defaultValue={10} min={0} max={100} hideControls />
      </Scenario>
      <Scenario title="Disabled">
        <NumberInput label="Locked" defaultValue={7} disabled />
      </Scenario>
    </Section>
  );
}
