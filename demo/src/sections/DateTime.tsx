import { DateInput, TimeInput } from 'zenput';
import { Section, Scenario } from './_shell';

export function DateTimeSection() {
  return (
    <Section
      id="date-time"
      name="DateInput & TimeInput"
      description="Native-date/time pickers wrapped in the Zenput field shell."
    >
      <Scenario title="Date">
        <DateInput label="Birthday" defaultValue="2000-01-15" />
        <DateInput label="Deadline" min="2024-01-01" max="2025-12-31" />
      </Scenario>
      <Scenario title="Time">
        <TimeInput label="Start time" defaultValue="09:00" />
        <TimeInput label="End time" defaultValue="17:30" min="06:00" max="22:00" />
      </Scenario>
      <Scenario title="Validation & disabled">
        <DateInput
          label="Start date"
          validationState="error"
          errorMessage="Start date is in the past"
          defaultValue="2020-01-01"
        />
        <TimeInput label="Locked" defaultValue="12:00" disabled />
      </Scenario>
    </Section>
  );
}
