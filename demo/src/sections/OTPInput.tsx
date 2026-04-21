import { useState } from 'react';
import { OTPInput } from 'zenput';
import { Section, Scenario } from './_shell';

export function OTPInputSection() {
  const [code, setCode] = useState('');
  return (
    <Section
      id="otp-input"
      name="OTPInput"
      description="One-time-password boxes with configurable length, type and masking."
    >
      <Scenario title="Numeric (6 digits)">
        <OTPInput
          label="Verification code"
          length={6}
          value={code}
          onChange={setCode}
          onComplete={(v) => alert(`Completed: ${v}`)}
        />
      </Scenario>
      <Scenario title="Alphanumeric (4 chars)">
        <OTPInput label="Access code" length={4} inputType="alphanumeric" />
      </Scenario>
      <Scenario title="Masked / error">
        <OTPInput label="PIN" length={4} mask defaultValue="1234" />
        <OTPInput
          label="Code"
          length={6}
          validationState="error"
          errorMessage="Code has expired"
        />
      </Scenario>
    </Section>
  );
}
