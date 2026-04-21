import { useState } from 'react';
import { ThemeProvider, type Theme } from 'zenput';
import {
  TypographySection,
  LayoutSection,
  ButtonSection,
  BadgeSection,
  TextInputSection,
  TextAreaSection,
  NumberInputSection,
  PasswordInputSection,
  SelectInputSection,
  CheckboxSection,
  CheckboxGroupSection,
  RadioGroupSection,
  ToggleSection,
  DateTimeSection,
  FileInputSection,
  RangeInputSection,
  ColorInputSection,
  SearchInputSection,
  PhoneInputSection,
  OTPInputSection,
  AutoCompleteSection,
  MoneyInputSection,
  DataTableSection,
} from './sections';

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
