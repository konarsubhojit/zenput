import React, { useMemo, useState } from 'react';
import {
  // Form inputs
  TextInput,
  TextArea,
  NumberInput,
  PasswordInput,
  SelectInput,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Toggle,
  DateInput,
  TimeInput,
  FileInput,
  RangeInput,
  ColorInput,
  SearchInput,
  PhoneInput,
  OTPInput,
  AutoComplete,
  MoneyInput,
  DataTable,
  // Design-system primitives
  Heading,
  Text,
  Link,
  Code,
  Kbd,
  Box,
  Stack,
  Divider,
  Button,
  Badge,
  // Context / theming
  ThemeProvider,
  type Theme,
  type DataTableColumn,
} from 'zenput';

/* -------------------------------------------------------------------------- */
/* Theme presets                                                              */
/* -------------------------------------------------------------------------- */

const THEMES: Record<string, Theme> = {
  Default: {},
  Indigo: {
    primaryColor: '#6366f1',
    focusRingColor: '#6366f1',
    borderRadius: '8px',
  },
  Emerald: {
    primaryColor: '#10b981',
    focusRingColor: '#10b981',
    borderRadius: '4px',
    successColor: '#059669',
  },
  Rose: {
    primaryColor: '#f43f5e',
    focusRingColor: '#f43f5e',
    borderRadius: '12px',
    errorColor: '#e11d48',
  },
  Dark: {
    mode: 'dark',
    primaryColor: '#818cf8',
    bgColor: '#1e1e2e',
    textColor: '#cdd6f4',
    borderColor: '#45475a',
    placeholderColor: '#6c7086',
    disabledBg: '#313244',
    disabledText: '#585b70',
  },
  'High Contrast': {
    mode: 'highContrast',
  },
};

/* -------------------------------------------------------------------------- */
/* Small layout helpers (demo shell only – not part of Zenput)                */
/* -------------------------------------------------------------------------- */

interface ScenarioProps {
  title: string;
  children: React.ReactNode;
  full?: boolean;
}

function Scenario({ title, children, full }: ScenarioProps) {
  return (
    <div className={`scenario${full ? ' scenario-full' : ''}`}>
      <div className="scenario-title">{title}</div>
      <div className="stack">{children}</div>
    </div>
  );
}

interface SectionProps {
  id: string;
  name: string;
  description: string;
  children: React.ReactNode;
}

function Section({ id, name, description, children }: SectionProps) {
  return (
    <section id={id} className="component-section" aria-labelledby={`${id}-title`}>
      <header>
        <h2 id={`${id}-title`}>{name}</h2>
        <p className="description">{description}</p>
      </header>
      <div className="scenarios">{children}</div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Component-specific demo sections                                           */
/* -------------------------------------------------------------------------- */

function TypographySection() {
  return (
    <Section
      id="typography"
      name="Typography"
      description="Heading, Text, Link, Code and Kbd primitives built on the type scale."
    >
      <Scenario title="Heading levels" full>
        <Heading level={1}>Display heading</Heading>
        <Heading level={2}>Section heading</Heading>
        <Heading level={3}>Subsection heading</Heading>
        <Heading level={4}>Minor heading</Heading>
      </Scenario>
      <Scenario title="Text sizes">
        <Text size="xs">Extra small text</Text>
        <Text size="sm">Small text</Text>
        <Text size="md">Medium body text</Text>
        <Text size="lg">Large paragraph text</Text>
      </Scenario>
      <Scenario title="Text tones">
        <Text tone="neutral">Neutral tone</Text>
        <Text tone="brand">Brand tone</Text>
        <Text tone="success">Success tone</Text>
        <Text tone="warning">Warning tone</Text>
        <Text tone="danger">Danger tone</Text>
        <Text tone="info">Info tone</Text>
      </Scenario>
      <Scenario title="Inline elements">
        <Text>
          Visit the <Link href="https://github.com/konarsubhojit/zenput" external>
            Zenput repository
          </Link>{' '}
          or press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to search. Install with{' '}
          <Code>npm i zenput</Code>.
        </Text>
      </Scenario>
    </Section>
  );
}

function LayoutSection() {
  return (
    <Section
      id="layout"
      name="Layout (Box, Stack, Divider)"
      description="Polymorphic primitives for composing layouts with design tokens."
    >
      <Scenario title="Box with tokens">
        <Box p="4" radius="lg" shadow="sm" style={{ background: 'var(--zp-color-surface-subtle)' }}>
          <Text>Box with padding 4, radius lg, shadow sm.</Text>
        </Box>
      </Scenario>
      <Scenario title="Stack (column)">
        <Stack gap="2">
          <Box p="2" radius="md" style={{ background: 'var(--zp-color-brand-subtle)' }}>
            Item 1
          </Box>
          <Box p="2" radius="md" style={{ background: 'var(--zp-color-brand-subtle)' }}>
            Item 2
          </Box>
          <Box p="2" radius="md" style={{ background: 'var(--zp-color-brand-subtle)' }}>
            Item 3
          </Box>
        </Stack>
      </Scenario>
      <Scenario title="Stack (row with justify)">
        <Stack direction="row" gap="3" justify="between" align="center">
          <Badge tone="brand">Left</Badge>
          <Badge tone="success">Center</Badge>
          <Badge tone="warning">Right</Badge>
        </Stack>
      </Scenario>
      <Scenario title="Divider variants" full>
        <Text>Horizontal (subtle):</Text>
        <Divider />
        <Text>Horizontal (strong):</Text>
        <Divider strong />
        <Text>With label:</Text>
        <Divider label="OR" />
        <div style={{ display: 'flex', alignItems: 'center', height: 40, gap: 12 }}>
          <Text>Left</Text>
          <Divider orientation="vertical" />
          <Text>Right</Text>
        </div>
      </Scenario>
    </Section>
  );
}

function ButtonSection() {
  const [loading, setLoading] = useState(false);
  return (
    <Section
      id="button"
      name="Button"
      description="Primary action primitive — six variants, three sizes, icon slots and loading state."
    >
      <Scenario title="Variants">
        <div className="row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </Scenario>
      <Scenario title="Sizes">
        <div className="row">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </Scenario>
      <Scenario title="With icons">
        <div className="row">
          <Button leftIcon={<span aria-hidden>＋</span>}>Create</Button>
          <Button variant="outline" rightIcon={<span aria-hidden>→</span>}>
            Continue
          </Button>
          <Button iconOnly aria-label="Settings" variant="ghost">
            <span aria-hidden>⚙</span>
          </Button>
        </div>
      </Scenario>
      <Scenario title="Loading & disabled">
        <div className="row">
          <Button
            loading={loading}
            onClick={() => {
              setLoading(true);
              window.setTimeout(() => setLoading(false), 1500);
            }}
          >
            {loading ? 'Saving…' : 'Click to save'}
          </Button>
          <Button disabled>Disabled</Button>
          <Button variant="primary" fullWidth>
            Full width
          </Button>
        </div>
      </Scenario>
    </Section>
  );
}

function BadgeSection() {
  return (
    <Section
      id="badge"
      name="Badge"
      description="Status/count indicators with six tones and three visual variants."
    >
      <Scenario title="Tones (subtle)">
        <div className="row">
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="brand">Brand</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="info">Info</Badge>
        </div>
      </Scenario>
      <Scenario title="Variants">
        <div className="row">
          <Badge tone="brand" variant="solid">Solid</Badge>
          <Badge tone="brand" variant="subtle">Subtle</Badge>
          <Badge tone="brand" variant="outline">Outline</Badge>
        </div>
      </Scenario>
      <Scenario title="Counts">
        <div className="row">
          <Badge tone="danger" count={3} />
          <Badge tone="danger" count={42} />
          <Badge tone="danger" count={1200} max={99} />
          <Badge tone="success" count={0} showZero />
        </div>
      </Scenario>
      <Scenario title="Dots & sizes">
        <div className="row">
          <Badge tone="success" dot /> online
          <Badge tone="warning" dot /> away
          <Badge tone="danger" dot /> busy
        </div>
        <div className="row">
          <Badge size="sm" tone="brand">sm</Badge>
          <Badge size="md" tone="brand">md</Badge>
          <Badge size="lg" tone="brand">lg</Badge>
        </div>
      </Scenario>
    </Section>
  );
}

function TextInputSection() {
  return (
    <Section
      id="text-input"
      name="TextInput"
      description="Single-line text field with size, variant, validation-state, icons and floating labels."
    >
      <Scenario title="Sizes">
        <TextInput label="Small" size="sm" placeholder="sm" />
        <TextInput label="Medium" size="md" placeholder="md (default)" />
        <TextInput label="Large" size="lg" placeholder="lg" />
      </Scenario>
      <Scenario title="Variants">
        <TextInput label="Outlined" variant="outlined" defaultValue="Value" />
        <TextInput label="Filled" variant="filled" defaultValue="Value" />
        <TextInput label="Underlined" variant="underlined" defaultValue="Value" />
      </Scenario>
      <Scenario title="Validation states">
        <TextInput label="Error" validationState="error" errorMessage="This field is required" defaultValue="" />
        <TextInput label="Success" validationState="success" successMessage="Looks good!" defaultValue="Zenput" />
        <TextInput label="Warning" validationState="warning" warningMessage="Username is almost taken" defaultValue="zen" />
      </Scenario>
      <Scenario title="Icons, floating label & disabled">
        <TextInput
          label="Email"
          placeholder="you@example.com"
          prefixIcon={<span aria-hidden>✉</span>}
          helperText="We never share your address."
        />
        <TextInput label="Floating label" floatingLabel defaultValue="Hello" />
        <TextInput label="Read-only" readOnly defaultValue="Read-only value" />
        <TextInput label="Disabled" disabled defaultValue="Disabled value" />
      </Scenario>
    </Section>
  );
}

function TextAreaSection() {
  return (
    <Section
      id="text-area"
      name="TextArea"
      description="Multi-line text with optional auto-resize and character counter."
    >
      <Scenario title="Default">
        <TextArea label="Description" placeholder="Describe your issue" rows={4} />
      </Scenario>
      <Scenario title="Auto-resize + character count">
        <TextArea
          label="Tweet"
          autoResize
          showCharCount
          maxLength={140}
          placeholder="What's happening?"
        />
      </Scenario>
      <Scenario title="Validation states">
        <TextArea
          label="Feedback"
          validationState="error"
          errorMessage="Please add a few more details."
          defaultValue="Bug"
        />
        <TextArea label="Disabled" disabled defaultValue="Cannot edit" />
      </Scenario>
    </Section>
  );
}

function NumberInputSection() {
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

function PasswordInputSection() {
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

const SELECT_OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
  { value: 'in', label: 'India' },
];

function SelectInputSection() {
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

function CheckboxSection() {
  const [checked, setChecked] = useState(false);
  return (
    <Section
      id="checkbox"
      name="Checkbox"
      description="Single checkbox with checked, indeterminate and disabled states."
    >
      <Scenario title="States">
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="Disabled" disabled />
      </Scenario>
      <Scenario title="Controlled">
        <Checkbox
          label="Accept terms"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <Text size="sm" tone="secondary">
          Accepted: {checked ? 'yes' : 'no'}
        </Text>
      </Scenario>
      <Scenario title="With error">
        <Checkbox
          label="I agree"
          validationState="error"
          errorMessage="You must accept the terms to continue"
          required
        />
      </Scenario>
    </Section>
  );
}

const PERMS = [
  { value: 'read', label: 'Read' },
  { value: 'write', label: 'Write' },
  { value: 'admin', label: 'Admin' },
  { value: 'delete', label: 'Delete', disabled: true },
];

function CheckboxGroupSection() {
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

function RadioGroupSection() {
  return (
    <Section
      id="radio-group"
      name="RadioGroup"
      description="Single-choice group with horizontal or vertical layout."
    >
      <Scenario title="Vertical">
        <RadioGroup
          name="plan"
          label="Plan"
          defaultValue="pro"
          options={[
            { value: 'free', label: 'Free' },
            { value: 'pro', label: 'Pro' },
            { value: 'team', label: 'Team' },
          ]}
        />
      </Scenario>
      <Scenario title="Horizontal">
        <RadioGroup
          name="size"
          label="T-shirt size"
          direction="horizontal"
          options={[
            { value: 's', label: 'S' },
            { value: 'm', label: 'M' },
            { value: 'l', label: 'L' },
            { value: 'xl', label: 'XL' },
          ]}
        />
      </Scenario>
      <Scenario title="Disabled option & error">
        <RadioGroup
          name="shipping"
          label="Shipping"
          validationState="error"
          errorMessage="Please choose a shipping method"
          options={[
            { value: 'standard', label: 'Standard (3–5 days)' },
            { value: 'express', label: 'Express (1–2 days)' },
            { value: 'overnight', label: 'Overnight', disabled: true },
          ]}
        />
      </Scenario>
    </Section>
  );
}

function ToggleSection() {
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

function DateTimeSection() {
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

function FileInputSection() {
  return (
    <Section
      id="file-input"
      name="FileInput"
      description="File picker with optional dropzone, thumbnail preview and progress bar."
    >
      <Scenario title="Default">
        <FileInput label="Attachment" helperText="PDF, up to 5 MB" />
      </Scenario>
      <Scenario title="Dropzone with file names">
        <FileInput
          label="Documents"
          dropzone
          multiple
          showFileNames
          buttonLabel="Choose files"
        />
      </Scenario>
      <Scenario title="Upload progress">
        <FileInput label="Avatar" accept="image/*" uploading uploadProgress={65} />
      </Scenario>
    </Section>
  );
}

function RangeInputSection() {
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

function ColorInputSection() {
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

function SearchInputSection() {
  const [query, setQuery] = useState('');
  return (
    <Section
      id="search-input"
      name="SearchInput"
      description="Search field with icon, clear-button and onSearch callback (fires on Enter)."
    >
      <Scenario title="Default">
        <SearchInput
          label="Search"
          placeholder="Search components…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={(v) => alert(`Search: ${v}`)}
          showClearButton
        />
      </Scenario>
      <Scenario title="Without icon">
        <SearchInput label="Filter" placeholder="Filter results" showSearchIcon={false} />
      </Scenario>
      <Scenario title="Disabled">
        <SearchInput label="Disabled" disabled defaultValue="query" />
      </Scenario>
    </Section>
  );
}

function PhoneInputSection() {
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

function OTPInputSection() {
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

const FRAMEWORKS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'qwik', label: 'Qwik' },
  { value: 'preact', label: 'Preact' },
];

function AutoCompleteSection() {
  return (
    <Section
      id="autocomplete"
      name="AutoComplete"
      description="Typeahead field with filtered suggestions, loading state and optional free-text values."
    >
      <Scenario title="Default">
        <AutoComplete
          label="Framework"
          options={FRAMEWORKS}
          placeholder="Search frameworks…"
        />
      </Scenario>
      <Scenario title="Allow custom value">
        <AutoComplete
          label="Skill"
          options={FRAMEWORKS}
          allowCustomValue
          helperText="Pick one or enter your own"
        />
      </Scenario>
      <Scenario title="Loading / empty">
        <AutoComplete
          label="Async search"
          options={[]}
          loading
          placeholder="Searching…"
        />
        <AutoComplete
          label="No results"
          options={[]}
          defaultValue="zzz"
          noOptionsMessage="No matches found"
        />
      </Scenario>
    </Section>
  );
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
];

function MoneyInputSection() {
  return (
    <Section
      id="money-input"
      name="MoneyInput"
      description="Currency-aware amount input with a currency selector."
    >
      <Scenario title="Default (USD)">
        <MoneyInput label="Amount" currencies={CURRENCIES} defaultCurrency="USD" defaultValue={1299.99} />
      </Scenario>
      <Scenario title="Bounded">
        <MoneyInput
          label="Donation"
          currencies={CURRENCIES}
          defaultCurrency="EUR"
          min={1}
          max={1000}
          step={1}
          helperText="Between €1 and €1,000"
        />
      </Scenario>
      <Scenario title="Error / disabled">
        <MoneyInput
          label="Invalid"
          currencies={CURRENCIES}
          defaultCurrency="INR"
          validationState="error"
          errorMessage="Amount exceeds daily limit"
          defaultValue={99999}
        />
        <MoneyInput
          label="Locked"
          currencies={CURRENCIES}
          defaultCurrency="JPY"
          defaultValue={5000}
          disabled
        />
      </Scenario>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* DataTable demo data                                                        */
/* -------------------------------------------------------------------------- */

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  active: boolean;
}

const USER_ROWS: UserRow[] = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@zenput.dev', role: 'admin', active: true },
  { id: 2, name: 'Alan Turing', email: 'alan@zenput.dev', role: 'editor', active: true },
  { id: 3, name: 'Grace Hopper', email: 'grace@zenput.dev', role: 'editor', active: false },
  { id: 4, name: 'Linus Torvalds', email: 'linus@zenput.dev', role: 'viewer', active: true },
  { id: 5, name: 'Margaret Hamilton', email: 'margaret@zenput.dev', role: 'admin', active: true },
  { id: 6, name: 'Dennis Ritchie', email: 'dennis@zenput.dev', role: 'viewer', active: false },
  { id: 7, name: 'Barbara Liskov', email: 'barbara@zenput.dev', role: 'editor', active: true },
];

function DataTableSection() {
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const paginated = useMemo(
    () => USER_ROWS.slice((page - 1) * pageSize, page * pageSize),
    [page]
  );

  const columns: DataTableColumn<UserRow>[] = useMemo(
    () => [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'email', header: 'Email' },
      {
        key: 'role',
        header: 'Role',
        filterable: true,
        render: (value) => (
          <Badge
            tone={value === 'admin' ? 'brand' : value === 'editor' ? 'info' : 'neutral'}
          >
            {String(value)}
          </Badge>
        ),
      },
      {
        key: 'active',
        header: 'Status',
        render: (value) => (
          <Badge tone={value ? 'success' : 'danger'} variant="subtle">
            {value ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
    ],
    []
  );

  return (
    <Section
      id="data-table"
      name="DataTable"
      description="Sortable, filterable and paginated data grid with selection, expansion and skeleton loading."
    >
      <Scenario title="Full-featured (sort / filter / pagination)" full>
        <DataTable<UserRow>
          columns={columns}
          data={paginated}
          rowKey={(r) => r.id}
          pagination={{
            currentPage: page,
            pageSize,
            totalCount: USER_ROWS.length,
            onPageChange: setPage,
          }}
          selectable
        />
      </Scenario>
      <Scenario title="Expandable rows" full>
        <DataTable<UserRow>
          columns={columns.slice(0, 3)}
          data={USER_ROWS.slice(0, 3)}
          rowKey={(r) => r.id}
          onRowClick={() => undefined}
          expandedRowRender={(row) => (
            <Box p="3" style={{ background: 'var(--zp-color-surface-subtle)' }}>
              <Text size="sm">
                <strong>{row.name}</strong> &lt;{row.email}&gt; — role {row.role}
              </Text>
            </Box>
          )}
        />
      </Scenario>
      <Scenario title="Loading skeleton" full>
        <DataTable<UserRow>
          columns={columns}
          data={[]}
          loading
          skeletonRowCount={4}
        />
      </Scenario>
      <Scenario title="Empty state" full>
        <DataTable<UserRow>
          columns={columns}
          data={[]}
          emptyMessage="No users match your filters."
        />
      </Scenario>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

const NAV_GROUPS: Array<{ title: string; items: Array<{ id: string; name: string }> }> = [
  {
    title: 'Foundations',
    items: [
      { id: 'typography', name: 'Typography' },
      { id: 'layout', name: 'Layout' },
    ],
  },
  {
    title: 'Actions',
    items: [
      { id: 'button', name: 'Button' },
      { id: 'badge', name: 'Badge' },
    ],
  },
  {
    title: 'Form inputs',
    items: [
      { id: 'text-input', name: 'TextInput' },
      { id: 'text-area', name: 'TextArea' },
      { id: 'number-input', name: 'NumberInput' },
      { id: 'password-input', name: 'PasswordInput' },
      { id: 'select-input', name: 'SelectInput' },
      { id: 'checkbox', name: 'Checkbox' },
      { id: 'checkbox-group', name: 'CheckboxGroup' },
      { id: 'radio-group', name: 'RadioGroup' },
      { id: 'toggle', name: 'Toggle' },
      { id: 'date-time', name: 'Date & Time' },
      { id: 'file-input', name: 'FileInput' },
      { id: 'range-input', name: 'RangeInput' },
      { id: 'color-input', name: 'ColorInput' },
      { id: 'search-input', name: 'SearchInput' },
      { id: 'phone-input', name: 'PhoneInput' },
      { id: 'otp-input', name: 'OTPInput' },
      { id: 'autocomplete', name: 'AutoComplete' },
      { id: 'money-input', name: 'MoneyInput' },
    ],
  },
  {
    title: 'Data display',
    items: [{ id: 'data-table', name: 'DataTable' }],
  },
];

/* -------------------------------------------------------------------------- */
/* Root App                                                                   */
/* -------------------------------------------------------------------------- */

export function App() {
  const [themeName, setThemeName] = useState<keyof typeof THEMES>('Default');
  const theme = THEMES[themeName];

  return (
    <ThemeProvider theme={theme}>
      <div
        className="app-shell"
        style={{
          // Ensure the demo shell itself reacts to the active theme's surface/text
          background: theme.bgColor ?? 'var(--zp-color-surface-canvas)',
          color: theme.textColor ?? 'var(--zp-color-text-default)',
        }}
      >
        <header className="app-header">
          <div className="app-brand">
            <span className="app-brand-name">Zenput</span>
            <span className="app-brand-tag">Component gallery</span>
          </div>
          <div className="app-controls">
            <label className="app-control">
              Theme
              <select
                value={themeName}
                onChange={(e) => setThemeName(e.target.value as keyof typeof THEMES)}
              >
                {Object.keys(THEMES).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        <div className="app-body">
          <nav className="app-nav" aria-label="Component sections">
            {NAV_GROUPS.map((group) => (
              <div key={group.title}>
                <h2>{group.title}</h2>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`}>{item.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <main className="app-main">
            <div className="intro">
              <h1>Zenput component gallery</h1>
              <p>
                Live examples for every Zenput component, organised by area. Each card below
                showcases a different scenario — sizes, variants, validation states, and edge
                cases. Use the theme switcher in the header to preview components under the
                different design-system palettes.
              </p>
            </div>

            <TypographySection />
            <LayoutSection />
            <ButtonSection />
            <BadgeSection />
            <TextInputSection />
            <TextAreaSection />
            <NumberInputSection />
            <PasswordInputSection />
            <SelectInputSection />
            <CheckboxSection />
            <CheckboxGroupSection />
            <RadioGroupSection />
            <ToggleSection />
            <DateTimeSection />
            <FileInputSection />
            <RangeInputSection />
            <ColorInputSection />
            <SearchInputSection />
            <PhoneInputSection />
            <OTPInputSection />
            <AutoCompleteSection />
            <MoneyInputSection />
            <DataTableSection />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
