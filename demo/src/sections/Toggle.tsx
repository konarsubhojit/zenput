import { Toggle } from 'zenput';
import { Section, Scenario } from './_shell';

export function ToggleSection() {
  return (
    <Section
      id="toggle"
      name="Toggle"
      description="Switch between on/off states. Label may sit on either side."
    >
      <Scenario title="States">
        <Toggle label="Off" />
        <Toggle label="On" defaultChecked />
        <Toggle label="Disabled" disabled />
      </Scenario>
      <Scenario title="Label position">
        <Toggle label="Label right (default)" labelPosition="right" />
        <Toggle label="Label left" labelPosition="left" defaultChecked />
      </Scenario>
      <Scenario title="Sizes">
        <Toggle size="sm" label="Small" defaultChecked />
        <Toggle size="md" label="Medium" defaultChecked />
        <Toggle size="lg" label="Large" defaultChecked />
      </Scenario>
    </Section>
  );
}
