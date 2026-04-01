# Zenput

A production-ready, accessible React TypeScript input components library with 18 fully-featured components.

## Features

- 🎯 **18 input components** — TextInput, TextArea, NumberInput, PasswordInput, SelectInput, Checkbox, CheckboxGroup, RadioGroup, Toggle, DateInput, TimeInput, FileInput, RangeInput, ColorInput, SearchInput, PhoneInput, OTPInput, AutoComplete
- ♿ **Fully accessible** — ARIA attributes, keyboard navigation, screen reader support
- 🎨 **Themeable** — CSS custom properties with `ThemeProvider`
- 📐 **3 sizes** — `sm`, `md`, `lg`
- 🖼️ **3 variants** — `outlined`, `filled`, `underlined`
- ✅ **Validation states** — `default`, `error`, `success`, `warning`
- 🔒 **TypeScript strict** — No `any` types, full type safety
- 📦 **Tree-shakeable** — ESM + CJS dual output
- 🧪 **Tested** — comprehensive test coverage with React Testing Library

## Installation

```bash
npm install zenput
```

## Quick Start

```tsx
import { TextInput, ThemeProvider } from 'zenput';

function App() {
  return (
    <ThemeProvider theme={{ primaryColor: '#6366f1' }}>
      <TextInput
        label="Email"
        placeholder="you@example.com"
        required
        fullWidth
      />
    </ThemeProvider>
  );
}
```

## Components

### TextInput
```tsx
<TextInput
  label="Username"
  placeholder="Enter username"
  size="md"
  variant="outlined"
  validationState="error"
  errorMessage="Username is required"
  required
  fullWidth
/>
```

### TextArea
```tsx
<TextArea
  label="Bio"
  placeholder="Tell us about yourself"
  autoResize
  showCharCount
  maxLength={500}
  rows={4}
/>
```

### NumberInput
```tsx
<NumberInput
  label="Quantity"
  min={0}
  max={100}
  step={1}
  defaultValue={1}
/>
```

### PasswordInput
```tsx
<PasswordInput
  label="Password"
  showStrengthIndicator
/>
```

### SelectInput
```tsx
<SelectInput
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
  placeholder="Select a country"
/>
```

### Checkbox
```tsx
<Checkbox label="I agree to the terms" required />
```

### CheckboxGroup
```tsx
<CheckboxGroup
  label="Interests"
  options={[
    { value: 'react', label: 'React' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'node', label: 'Node.js' },
  ]}
  value={['react']}
  onChange={(values) => console.log(values)}
/>
```

### RadioGroup
```tsx
<RadioGroup
  label="Plan"
  options={[
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise' },
  ]}
  value="free"
  onChange={(value) => console.log(value)}
/>
```

### Toggle
```tsx
<Toggle label="Enable notifications" defaultChecked />
```

### DateInput
```tsx
<DateInput label="Date of birth" min="1900-01-01" max="2024-12-31" />
```

### TimeInput
```tsx
<TimeInput label="Meeting time" />
```

### FileInput
```tsx
<FileInput label="Upload avatar" accept="image/*" />
```

### RangeInput
```tsx
<RangeInput label="Volume" min={0} max={100} defaultValue={50} showValue />
```

### ColorInput
```tsx
<ColorInput label="Brand color" defaultValue="#3b82f6" />
```

### SearchInput
```tsx
<SearchInput
  label="Search"
  placeholder="Search..."
  onSearch={(q) => console.log(q)}
/>
```

### PhoneInput
```tsx
<PhoneInput
  label="Phone number"
  defaultDialCode="+1"
/>
```

### OTPInput
```tsx
<OTPInput
  label="Verification code"
  length={6}
  onChange={(value) => console.log(value)}
/>
```

### AutoComplete
```tsx
<AutoComplete
  label="City"
  options={[
    { value: 'nyc', label: 'New York' },
    { value: 'la', label: 'Los Angeles' },
    { value: 'chi', label: 'Chicago' },
  ]}
  onSearch={(q) => console.log(q)}
/>
```

## Theming

Use `ThemeProvider` to customise the design tokens:

```tsx
import { ThemeProvider } from 'zenput';

<ThemeProvider
  theme={{
    primaryColor: '#6366f1',
    errorColor: '#dc2626',
    successColor: '#16a34a',
    warningColor: '#d97706',
    borderRadius: '8px',
    fontFamily: 'Inter, sans-serif',
  }}
>
  {/* your app */}
</ThemeProvider>
```

## Props

### Common props (all components inherit `BaseInputProps`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Visual size |
| `variant` | `'outlined' \| 'filled' \| 'underlined'` | `'outlined'` | Visual variant |
| `validationState` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | Validation state |
| `label` | `string` | — | Label text |
| `helperText` | `string` | — | Helper text below input |
| `errorMessage` | `string` | — | Error message (shown when `validationState='error'`) |
| `successMessage` | `string` | — | Success message |
| `warningMessage` | `string` | — | Warning message |
| `required` | `boolean` | `false` | Mark field as required |
| `disabled` | `boolean` | `false` | Disable the input |
| `readOnly` | `boolean` | `false` | Make the input read-only |
| `prefixIcon` | `React.ReactNode` | — | Icon/element before the input |
| `suffixIcon` | `React.ReactNode` | — | Icon/element after the input |
| `fullWidth` | `boolean` | `false` | Expand to full container width |
| `wrapperClassName` | `string` | — | Class for the wrapper element |
| `inputClassName` | `string` | — | Class for the input element |

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build the library
npm run build

# Lint
npm run lint

# Type check
npm run type-check
```

## License

MIT © konarsubhojit
