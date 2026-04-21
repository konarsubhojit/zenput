import { CheckboxGroup } from 'zenput';
import { Section, Scenario } from './_shell';

const PERMS = [
  { value: 'read', label: 'Read' },
  { value: 'write', label: 'Write' },
  { value: 'admin', label: 'Admin' },
  { value: 'delete', label: 'Delete', disabled: true },
];

export function CheckboxGroupSection() {
  return (
    <Section
      id="checkbox-group"
      name="CheckboxGroup"
      description="Grouped checkboxes with shared label and helper messaging."
    >
      <Scenario title="Vertical">
        <CheckboxGroup
          label="Permissions"
          options={PERMS}
          defaultValue={['read']}
          helperText="Choose all that apply"
        />
      </Scenario>
      <Scenario title="Horizontal">
        <CheckboxGroup
          label="Notifications"
          direction="horizontal"
          options={[
            { value: 'email', label: 'Email' },
            { value: 'sms', label: 'SMS' },
            { value: 'push', label: 'Push' },
          ]}
        />
      </Scenario>
      <Scenario title="Error state">
        <CheckboxGroup
          label="Required permissions"
          required
          options={PERMS}
          validationState="error"
          errorMessage="Select at least one permission"
        />
      </Scenario>
    </Section>
  );
}
