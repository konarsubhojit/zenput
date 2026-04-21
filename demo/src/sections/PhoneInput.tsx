import { PhoneInput } from 'zenput';
import { Section, Scenario } from './_shell';

export function PhoneInputSection() {
  return (
    <Section
      id="phone-input"
      name="PhoneInput"
      description="Phone field with a country/dial-code selector."
    >
      <Scenario title="Default (US)">
        <PhoneInput label="Phone number" defaultDialCode="+1" placeholder="(555) 555-5555" />
      </Scenario>
      <Scenario title="Validation">
        <PhoneInput
          label="Contact"
          defaultDialCode="+44"
          validationState="error"
          errorMessage="Invalid phone number"
        />
      </Scenario>
    </Section>
  );
}
