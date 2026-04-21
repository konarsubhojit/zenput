import { RangeInput } from 'zenput';
import { Section, Scenario } from './_shell';

export function RangeInputSection() {
  return (
    <Section
      id="range-input"
      name="RangeInput"
      description="Slider for numeric ranges with optional value readout and formatter."
    >
      <Scenario title="Default with value">
        <RangeInput label="Volume" min={0} max={100} defaultValue={40} showValue />
      </Scenario>
      <Scenario title="Stepped + formatted">
        <RangeInput
          label="Temperature"
          min={16}
          max={30}
          step={0.5}
          defaultValue={22}
          showValue
          formatValue={(v) => `${v.toFixed(1)} °C`}
        />
      </Scenario>
      <Scenario title="Disabled">
        <RangeInput label="Locked" min={0} max={100} defaultValue={75} disabled showValue />
      </Scenario>
    </Section>
  );
}
