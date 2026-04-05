import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '../context';
import { TextInput } from '../components/TextInput';
import { SelectInput } from '../components/SelectInput';
import { Checkbox } from '../components/Checkbox';
import { Toggle } from '../components/Toggle';
import { NumberInput } from '../components/NumberInput';
import { PasswordInput } from '../components/PasswordInput';
import { SearchInput } from '../components/SearchInput';

const COUNTRY_OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
];

interface ThemeShowcaseProps {
  themeName: string;
  theme: Record<string, string>;
  darkBackground?: boolean;
}

const ThemeShowcase = ({ themeName, theme, darkBackground }: ThemeShowcaseProps) => (
  <ThemeProvider theme={theme}>
    <div
      style={{
        padding: '1.5rem',
        borderRadius: '12px',
        backgroundColor: darkBackground ? theme.bgColor || '#1e1e2e' : '#f9fafb',
        border: '1px solid #e5e7eb',
        marginBottom: '2rem',
      }}
    >
      <h3
        style={{
          margin: '0 0 1.25rem 0',
          fontSize: '1rem',
          fontWeight: 600,
          color: darkBackground ? theme.textColor || '#cdd6f4' : '#111827',
        }}
      >
        {themeName}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <TextInput label="Full Name" placeholder="Enter your name" />
        <PasswordInput label="Password" placeholder="Enter password" />
        <NumberInput label="Quantity" min={0} max={100} defaultValue={10} />
        <SelectInput label="Country" options={COUNTRY_OPTIONS} placeholder="Select a country" />
        <SearchInput label="Search" placeholder="Search..." showClearButton />
        <TextInput label="Email" placeholder="you@example.com" validationState="error" errorMessage="Invalid email" />
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', alignItems: 'center' }}>
        <Checkbox label="Remember me" defaultChecked />
        <Toggle label="Notifications" defaultChecked />
        <Toggle label="Dark mode" />
      </div>
    </div>
  </ThemeProvider>
);

const AllThemesStory = () => (
  <div style={{ padding: '1rem', maxWidth: '900px' }}>
    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>
      Theme Showcase — Zenput
    </h2>

    <ThemeShowcase
      themeName="Default (System)"
      theme={{}}
    />

    <ThemeShowcase
      themeName="Indigo"
      theme={{
        primaryColor: '#6366f1',
        focusRingColor: '#6366f1',
        borderRadius: '8px',
        borderColor: '#c7d2fe',
      }}
    />

    <ThemeShowcase
      themeName="Emerald"
      theme={{
        primaryColor: '#10b981',
        focusRingColor: '#10b981',
        borderRadius: '4px',
        successColor: '#059669',
        borderColor: '#6ee7b7',
      }}
    />

    <ThemeShowcase
      themeName="Rose"
      theme={{
        primaryColor: '#f43f5e',
        focusRingColor: '#f43f5e',
        borderRadius: '12px',
        errorColor: '#e11d48',
        borderColor: '#fecdd3',
      }}
    />

    <ThemeShowcase
      themeName="Amber"
      theme={{
        primaryColor: '#f59e0b',
        focusRingColor: '#f59e0b',
        borderRadius: '6px',
        warningColor: '#d97706',
        borderColor: '#fde68a',
      }}
    />

    <ThemeShowcase
      themeName="Dark (Catppuccin Mocha)"
      theme={{
        primaryColor: '#818cf8',
        bgColor: '#1e1e2e',
        textColor: '#cdd6f4',
        borderColor: '#45475a',
        placeholderColor: '#6c7086',
        disabledBg: '#313244',
        disabledText: '#585b70',
        focusRingColor: '#89b4fa',
        borderRadius: '8px',
      }}
      darkBackground
    />
  </div>
);

const meta: Meta = {
  title: 'Showcase/Theming',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const AllThemes: Story = {
  render: () => <AllThemesStory />,
  parameters: {
    layout: 'fullscreen',
  },
};

export const DefaultTheme: Story = {
  render: () => (
    <ThemeShowcase
      themeName="Default"
      theme={{}}
    />
  ),
};

export const IndigoTheme: Story = {
  render: () => (
    <ThemeShowcase
      themeName="Indigo"
      theme={{
        primaryColor: '#6366f1',
        focusRingColor: '#6366f1',
        borderRadius: '8px',
        borderColor: '#c7d2fe',
      }}
    />
  ),
};

export const EmeraldTheme: Story = {
  render: () => (
    <ThemeShowcase
      themeName="Emerald"
      theme={{
        primaryColor: '#10b981',
        focusRingColor: '#10b981',
        borderRadius: '4px',
        successColor: '#059669',
        borderColor: '#6ee7b7',
      }}
    />
  ),
};

export const RoseTheme: Story = {
  render: () => (
    <ThemeShowcase
      themeName="Rose"
      theme={{
        primaryColor: '#f43f5e',
        focusRingColor: '#f43f5e',
        borderRadius: '12px',
        errorColor: '#e11d48',
        borderColor: '#fecdd3',
      }}
    />
  ),
};

export const DarkTheme: Story = {
  render: () => (
    <ThemeShowcase
      themeName="Dark (Catppuccin Mocha)"
      theme={{
        primaryColor: '#818cf8',
        bgColor: '#1e1e2e',
        textColor: '#cdd6f4',
        borderColor: '#45475a',
        placeholderColor: '#6c7086',
        disabledBg: '#313244',
        disabledText: '#585b70',
        focusRingColor: '#89b4fa',
        borderRadius: '8px',
      }}
      darkBackground
    />
  ),
};
