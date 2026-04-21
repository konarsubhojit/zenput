import { PasswordInput } from 'zenput';
import { Section, Scenario } from './_shell';

export function PasswordInputSection() {
  return (
    <Section
      id="password-input"
      name="PasswordInput"
      description="Password field with visibility toggle and optional strength indicator."
    >
      <Scenario title="Default">
        <PasswordInput label="Password" placeholder="Enter password" />
      </Scenario>
      <Scenario title="With strength indicator">
        <PasswordInput label="New password" showStrengthIndicator />
      </Scenario>
      <Scenario title="Validation">
        <PasswordInput
          label="Confirm password"
          validationState="error"
          errorMessage="Passwords do not match"
          defaultValue="abc"
        />
      </Scenario>
    </Section>
  );
}
