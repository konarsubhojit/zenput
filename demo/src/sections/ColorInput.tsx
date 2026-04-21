import { ColorInput } from 'zenput';
import { Section, Scenario } from './_shell';

export function ColorInputSection() {
  return (
    <Section
      id="color-input"
      name="ColorInput"
      description="Native color picker with optional hex-value readout."
    >
      <Scenario title="Default">
        <ColorInput label="Theme color" defaultValue="#6366f1" showHexValue />
      </Scenario>
      <Scenario title="Without hex readout">
        <ColorInput label="Accent" defaultValue="#10b981" />
      </Scenario>
      <Scenario title="Disabled">
        <ColorInput label="Brand" defaultValue="#f43f5e" disabled showHexValue />
      </Scenario>
    </Section>
  );
}
