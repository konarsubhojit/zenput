import { useState } from 'react';
import { ThemeProvider, extendTheme, type Theme } from 'zenput';
import {
  TypographySection,
  LayoutSection,
  ButtonSection,
  BadgeSection,
  FieldSection,
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
  PickersSection,
  FileInputSection,
  RangeInputSection,
  ColorInputSection,
  SearchInputSection,
  PhoneInputSection,
  OTPInputSection,
  AutoCompleteSection,
  MoneyInputSection,
  ComboboxSection,
  MultiSelectSection,
  DataTableSection,
  TabsSection,
  AccordionSection,
  BreadcrumbsSection,
  ActionsExtSection,
  FeedbackSection,
  ContentSection,
  DialogSection,
  DrawerSection,
  PopoverSection,
  TooltipSection,
  PortalSection,
  MenuSection,
  ToastSection,
  TokenBrowserSection,
  ThemingSection,
} from './sections';

type DensityScale = 'compact' | 'normal' | 'spacious';

const BASE_THEMES: Record<string, Theme> = {
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
  Brand: extendTheme(
    {
      primaryColor: '#7c3aed',
      focusRingColor: '#7c3aed',
    },
    {
      components: {
        button: {
          borderRadius: 'var(--zp-radius-full)',
        },
      },
    }
  ),
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
  'Dark (alt)': {
    mode: 'dark',
    primaryColor: '#818cf8',
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
      { id: 'actions-ext', name: 'Avatar / Tag / SegmentedControl' },
    ],
  },
  {
    title: 'Field',
    items: [{ id: 'field', name: 'Field' }],
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
      { id: 'date-time', name: 'DateInput & TimeInput' },
      { id: 'pickers', name: 'Pickers (Calendar / DatePicker / DateRange / TimePicker)' },
      { id: 'file-input', name: 'FileInput' },
      { id: 'range-input', name: 'RangeInput' },
      { id: 'color-input', name: 'ColorInput' },
      { id: 'search-input', name: 'SearchInput' },
      { id: 'phone-input', name: 'PhoneInput' },
      { id: 'otp-input', name: 'OTPInput' },
      { id: 'autocomplete', name: 'AutoComplete' },
      { id: 'money-input', name: 'MoneyInput' },
      { id: 'combobox', name: 'Combobox' },
      { id: 'multi-select', name: 'MultiSelect' },
    ],
  },
  {
    title: 'Data display',
    items: [
      { id: 'data-table', name: 'DataTable' },
      { id: 'content', name: 'Card / EmptyState / Pagination' },
    ],
  },
  {
    title: 'Feedback',
    items: [{ id: 'feedback', name: 'Spinner / Skeleton / ProgressBar / CircularProgress' }],
  },
  {
    title: 'Navigation',
    items: [
      { id: 'tabs', name: 'Tabs' },
      { id: 'accordion', name: 'Accordion' },
      { id: 'breadcrumbs', name: 'Breadcrumbs' },
    ],
  },
  {
    title: 'Overlay',
    items: [
      { id: 'dialog', name: 'Dialog' },
      { id: 'drawer', name: 'Drawer' },
      { id: 'popover', name: 'Popover' },
      { id: 'tooltip', name: 'Tooltip' },
      { id: 'portal', name: 'Portal' },
      { id: 'menu', name: 'Menu / ContextMenu' },
      { id: 'toast', name: 'Toast' },
    ],
  },
  {
    title: 'Tokens',
    items: [
      { id: 'token-browser', name: 'Token Browser' },
      { id: 'theming', name: 'Theming' },
    ],
  },
];

export function App() {
  const [themeName, setThemeName] = useState<keyof typeof BASE_THEMES>('Default');
  const [density, setDensity] = useState<DensityScale>('normal');

  const baseTheme = BASE_THEMES[themeName];
  const theme: Theme = density === 'normal' ? baseTheme : extendTheme(baseTheme, { density });

  return (
    <ThemeProvider theme={theme}>
      <div
        className="app-shell"
        style={{
          // Ensure the demo shell itself reacts to the active theme's surface/text
          background: (baseTheme as Theme & { bgColor?: string }).bgColor ?? 'var(--zp-color-surface-canvas)',
          color: (baseTheme as Theme & { textColor?: string }).textColor ?? 'var(--zp-color-text-default)',
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
                onChange={(e) => setThemeName(e.target.value as keyof typeof BASE_THEMES)}
              >
                {Object.keys(BASE_THEMES).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="app-control">
              Density
              <select
                value={density}
                onChange={(e) => setDensity(e.target.value as DensityScale)}
              >
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="spacious">Spacious</option>
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
            <ActionsExtSection />
            <FieldSection />
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
            <PickersSection />
            <FileInputSection />
            <RangeInputSection />
            <ColorInputSection />
            <SearchInputSection />
            <PhoneInputSection />
            <OTPInputSection />
            <AutoCompleteSection />
            <MoneyInputSection />
            <ComboboxSection />
            <MultiSelectSection />
            <DataTableSection />
            <ContentSection />
            <FeedbackSection />
            <TabsSection />
            <AccordionSection />
            <BreadcrumbsSection />
            <DialogSection />
            <DrawerSection />
            <PopoverSection />
            <TooltipSection />
            <PortalSection />
            <MenuSection />
            <ToastSection />
            <TokenBrowserSection />
            <ThemingSection />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

