# Zenput

[![CI](https://github.com/konarsubhojit/zenput/actions/workflows/ci.yml/badge.svg)](https://github.com/konarsubhojit/zenput/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/konarsubhojit/zenput/branch/master/graph/badge.svg)](https://codecov.io/gh/konarsubhojit/zenput)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=zenput&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=zenput)
[![npm](https://img.shields.io/npm/v/zenput.svg)](https://www.npmjs.com/package/zenput)
[![bundle size](https://img.shields.io/bundlephobia/minzip/zenput)](https://bundlephobia.com/package/zenput)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

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
import { useState } from 'react';

function Example() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileInput
      label="Upload gallery images"
      accept="image/*"
      multiple
      maxFiles={5}
      value={files}
      onFilesChange={setFiles}
    />
  );
}
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

### DataTable (expanded row controls)
```tsx
<DataTable
  columns={columns}
  data={rows}
  rowKey={(row) => row.id}
  expandedRowRender={(row, { close, isExpanded }) => (
    <div>
      <strong>{row.name}</strong>
      <div>Expanded: {String(isExpanded)}</div>
      <button type="button" onClick={close}>
        Save & collapse
      </button>
    </div>
  )}
/>
```

## Theming

Zenput provides a comprehensive theming system with semantic colors, per-component tokens, density scaling, and theme composition utilities.

### Basic Theming

Use `ThemeProvider` to customize design tokens:

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

### Advanced Theming

#### Theme Modes

Switch between light, dark, and high-contrast modes:

```tsx
<ThemeProvider theme={{ mode: 'dark' }}>
  {/* your app */}
</ThemeProvider>
```

Available modes: `'light'` (default), `'dark'`, `'highContrast'`, `'system'`

#### System Mode (OS Preference)

Use `mode="system"` to automatically follow the OS `prefers-color-scheme` preference. The resolved mode updates live when the user changes their OS setting:

```tsx
<ThemeProvider theme={{ mode: 'system' }}>
  {/* Automatically light or dark based on OS preference */}
</ThemeProvider>
```

#### Persistence with `storageKey`

Pass `storageKey` to persist the user's mode choice across page loads. The stored value takes precedence over the `theme.mode` prop on subsequent visits:

```tsx
<ThemeProvider theme={{ mode: 'system' }} storageKey="zp-theme">
  {/* User's last chosen mode is remembered */}
</ThemeProvider>
```

Use `storage="sessionStorage"` to scope persistence to the current browser session:

```tsx
<ThemeProvider theme={{ mode: 'light' }} storageKey="zp-theme" storage="sessionStorage">
  {/* ... */}
</ThemeProvider>
```

#### `useColorMode()` Hook

Read and control the color mode from any descendant component:

```tsx
import { useColorMode } from 'zenput';

function ThemeToggle() {
  const { mode, resolvedMode, setMode, toggle } = useColorMode();

  return (
    <button onClick={toggle}>
      Current: {resolvedMode} (selected: {mode})
    </button>
  );
}
```

| Property | Type | Description |
|----------|------|-------------|
| `mode` | `ColorMode` | User-selected mode (may be `'system'`). |
| `resolvedMode` | `ThemeMode` | Actual applied mode (`'light' \| 'dark' \| 'highContrast'`). |
| `setMode(mode)` | `(mode: ColorMode) => void` | Change the mode (persists if `storageKey` is set). |
| `toggle()` | `() => void` | Toggle between `'light'` and `'dark'`. |

#### High-Contrast Auto-Detection

When `detectHighContrast` is enabled alongside `mode="system"`, the provider automatically switches to `'highContrast'` when the OS `prefers-contrast: more` media feature is active:

```tsx
<ThemeProvider theme={{ mode: 'system' }} detectHighContrast>
  {/* ... */}
</ThemeProvider>
```

#### Anti-Flash Script (Next.js App Router)

Prevent a flash of the wrong colour scheme during server-side rendering by injecting an inline script into `<head>` before React hydrates. Use `getColorModeScript` to generate the script string:

```tsx
// app/layout.tsx
import Script from 'next/script';
import { ThemeProvider, getColorModeScript } from 'zenput';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          id="zp-color-mode"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: getColorModeScript({ storageKey: 'zp-theme', defaultMode: 'system' }),
          }}
        />
      </head>
      <body>
        {/* storageKey must match the script's storageKey */}
        <ThemeProvider theme={{ mode: 'system' }} storageKey="zp-theme" as="main">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

The script sets `data-zp-theme` on `<html>` before the first paint so your CSS variables are already correct when the page renders. This eliminates the flash even when the user prefers dark mode or has a stored preference.

#### `useReducedMotion()` Hook

Detect the OS `prefers-reduced-motion: reduce` preference and disable animations accordingly. All built-in Zenput animations already honour this media feature via the `--zp-duration-*` CSS custom properties:

```tsx
import { useReducedMotion } from 'zenput';

function AnimatedCard() {
  const reduced = useReducedMotion();
  return (
    <div
      style={{
        transition: reduced ? 'none' : 'transform var(--zp-duration-normal) var(--zp-easing-standard)',
      }}
    >
      {/* ... */}
    </div>
  );
}
```

#### Nested `ThemeProvider`

Nest `ThemeProvider` to apply a different theme to a specific section of your UI. The inner provider inherits the parent's resolved mode by default and merges CSS tokens — the child's values override the parent's:

```tsx
<ThemeProvider theme={{ mode: 'dark' }}>
  {/* Dark mode throughout */}
  <main>
    <ThemeProvider
      theme={{
        components: {
          button: { borderRadius: '9999px' },
        },
      }}
    >
      {/* Still dark mode, but with pill-shaped buttons in this section */}
    </ThemeProvider>
  </main>
</ThemeProvider>
```

Custom CSS variables from parent providers are inherited and can be overridden:

```tsx
<ThemeProvider theme={{ cssVars: { '--brand-accent': '#6366f1' } }}>
  <ThemeProvider theme={{ cssVars: { '--brand-accent': '#8b5cf6' } }}>
    {/* --brand-accent is '#8b5cf6' here */}
  </ThemeProvider>
</ThemeProvider>
```

#### Density Scaling

Control component sizing with density tokens:

```tsx
<ThemeProvider theme={{ density: 'compact' }}>
  {/* your app */}
</ThemeProvider>
```

Available densities: `'compact'`, `'normal'` (default), `'spacious'`

#### Semantic Color Overrides

Override semantic colors while preserving the mode's defaults:

```tsx
<ThemeProvider
  theme={{
    mode: 'light',
    semantic: {
      brand: '#6366f1',
      brandHover: '#4f46e5',
      danger: '#ef4444',
      success: '#10b981',
    },
  }}
>
  {/* your app */}
</ThemeProvider>
```

#### Per-Component Tokens

Customize individual component styles:

```tsx
<ThemeProvider
  theme={{
    components: {
      button: {
        borderRadius: '9999px',      // Pill-shaped buttons
        primaryBg: '#8b5cf6',
        primaryBgHover: '#7c3aed',
      },
      input: {
        borderRadius: 'var(--zp-radius-xl)',
        borderColor: '#8b5cf6',
      },
      badge: {
        fontSize: 'var(--zp-font-size-sm)',
        borderRadius: 'var(--zp-radius-sm)',
      },
    },
  }}
>
  {/* your app */}
</ThemeProvider>
```

Available component tokens: `button`, `input`, `badge`, `dialog`, `tooltip`, `dataTable`

#### Theme Composition with `extendTheme()`

Compose themes by extending a base theme:

```tsx
import { ThemeProvider, extendTheme } from 'zenput';

// Create a base brand theme
const brandTheme = {
  mode: 'light' as const,
  semantic: {
    brand: '#6366f1',
    brandHover: '#4f46e5',
  },
};

// Extend with additional customizations
const customTheme = extendTheme(brandTheme, {
  density: 'spacious',
  components: {
    button: {
      borderRadius: 'var(--zp-radius-lg)',
    },
  },
});

<ThemeProvider theme={customTheme}>
  {/* your app */}
</ThemeProvider>
```

#### Multiple Theme Extensions

Chain multiple theme presets:

```tsx
const baseTheme = { mode: 'light' as const };
const densityPreset = { density: 'compact' as const };
const componentOverrides = {
  components: {
    button: { borderRadius: 'var(--zp-radius-full)' },
  },
};

const finalTheme = extendTheme(baseTheme, densityPreset, componentOverrides);
```

#### Custom CSS Variables

Add arbitrary CSS custom properties:

```tsx
<ThemeProvider
  theme={{
    cssVars: {
      '--custom-accent': '#f59e0b',
      '--custom-highlight': '#fbbf24',
    },
  }}
>
  {/* your app */}
</ThemeProvider>
```

### Token Browser

Explore all available design tokens interactively:

`TokenBrowser` uses the `--zp-*` CSS variables emitted by `ThemeProvider`, so
render it inside a provider:

```tsx
import { ThemeProvider, TokenBrowser } from 'zenput';

<ThemeProvider>
  <TokenBrowser defaultCategory="colors" />
</ThemeProvider>
```

### Design Token Reference

> **Stability guarantee** — All `--zp-*` CSS custom property names listed here are stable within a major version of zenput. Token names will not be renamed or removed within the same major version. New tokens may be added in minor releases. The `src/tokens/tokens.snapshot.test.ts` snapshot file is the machine-readable contract that enforces this guarantee.

Every CSS custom property is emitted by `ThemeProvider` on its root element and scoped to that element's subtree. The prefix is always `--zp-` (not `--zenput-`).

#### Referencing tokens in code

Use the exported `cssVar()` helper (or its re-export `tokenVar()`) to produce type-safe `var(…)` expressions without hard-coding variable names:

```tsx
import { cssVar } from 'zenput';
// or: import { tokenVar } from 'zenput';

cssVar('color-brand')                 // 'var(--zp-color-brand)'
cssVar('space-4')                     // 'var(--zp-space-4)'
cssVar('color-brand', '#0000ff')      // 'var(--zp-color-brand, #0000ff)'
cssVar('space-0.5')                   // 'var(--zp-space-0-5)'  ← dots normalized
```

Decimal spacing keys (e.g. `0.5`) are automatically normalized to a dash form (`0-5`) to produce valid CSS custom-property names.

---

#### Brand colors (`--zp-color-brand-*`)

| Custom property | Light | Dark | High-contrast | Purpose |
|-----------------|-------|------|---------------|---------|
| `--zp-color-brand` | `#2563eb` | `#60a5fa` | `#1aebff` | Primary action / filled button |
| `--zp-color-brand-hover` | `#1d4ed8` | `#93c5fd` | `#ffffff` | Hover state |
| `--zp-color-brand-active` | `#1e40af` | `#bfdbfe` | `#ffff00` | Active / pressed state |
| `--zp-color-brand-subtle` | `#eff6ff` | `rgba(59, 130, 246, 0.16)` | `#000000` | Low-emphasis brand wash |
| `--zp-color-brand-text` | `#1d4ed8` | `#93c5fd` | `#ffffff` | Brand-colored text on surfaces |

---

#### Semantic state colors

Each state (`success`, `warning`, `danger`, `info`) exposes the following tokens. These are the canonical tokens for Toast, Alert, Banner, and Tag variants.

| Token pattern | Purpose |
|---------------|---------|
| `--zp-color-{state}` | Primary accent color |
| `--zp-color-{state}-subtle` | Low-emphasis background wash |
| `--zp-color-{state}-text` | Text on the default surface |
| `--zp-color-{state}-bg-subtle` | Subtle background (e.g. Alert, Tag) |
| `--zp-color-{state}-bg-solid` | Vivid filled background |
| `--zp-color-{state}-text-on-solid` | Text / icon on the filled background |

##### Success (`--zp-color-success-*`)

| Custom property | Light | Dark | High-contrast |
|-----------------|-------|------|---------------|
| `--zp-color-success` | `#16a34a` | `#4ade80` | `#3ff23f` |
| `--zp-color-success-subtle` | `#f0fdf4` | `rgba(34, 197, 94, 0.16)` | `#000000` |
| `--zp-color-success-text` | `#15803d` | `#86efac` | `#ffffff` |
| `--zp-color-success-bg-subtle` | `#f0fdf4` | `rgba(34, 197, 94, 0.16)` | `#000000` |
| `--zp-color-success-bg-solid` | `#16a34a` | `#4ade80` | `#3ff23f` |
| `--zp-color-success-text-on-solid` | `#ffffff` | `#ffffff` | `#000000` |

##### Warning (`--zp-color-warning-*`)

| Custom property | Light | Dark | High-contrast |
|-----------------|-------|------|---------------|
| `--zp-color-warning` | `#f59e0b` | `#fbbf24` | `#ffff00` |
| `--zp-color-warning-subtle` | `#fffbeb` | `rgba(245, 158, 11, 0.16)` | `#000000` |
| `--zp-color-warning-text` | `#b45309` | `#fcd34d` | `#ffffff` |
| `--zp-color-warning-bg-subtle` | `#fffbeb` | `rgba(245, 158, 11, 0.16)` | `#000000` |
| `--zp-color-warning-bg-solid` | `#f59e0b` | `#fbbf24` | `#ffff00` |
| `--zp-color-warning-text-on-solid` | `#111827` | `#111827` | `#000000` |

##### Danger (`--zp-color-danger-*`)

| Custom property | Light | Dark | High-contrast |
|-----------------|-------|------|---------------|
| `--zp-color-danger` | `#dc2626` | `#f87171` | `#ff5f5f` |
| `--zp-color-danger-hover` | `#b91c1c` | `#fca5a5` | `#ffffff` |
| `--zp-color-danger-active` | `#991b1b` | `#fecaca` | `#ffff00` |
| `--zp-color-danger-subtle` | `#fef2f2` | `rgba(239, 68, 68, 0.16)` | `#000000` |
| `--zp-color-danger-text` | `#b91c1c` | `#fca5a5` | `#ffffff` |
| `--zp-color-danger-bg-subtle` | `#fef2f2` | `rgba(239, 68, 68, 0.16)` | `#000000` |
| `--zp-color-danger-bg-solid` | `#dc2626` | `#f87171` | `#ff5f5f` |
| `--zp-color-danger-text-on-solid` | `#ffffff` | `#ffffff` | `#000000` |

##### Info (`--zp-color-info-*`)

| Custom property | Light | Dark | High-contrast |
|-----------------|-------|------|---------------|
| `--zp-color-info` | `#0891b2` | `#22d3ee` | `#1aebff` |
| `--zp-color-info-subtle` | `#ecfeff` | `rgba(6, 182, 212, 0.16)` | `#000000` |
| `--zp-color-info-text` | `#0e7490` | `#67e8f9` | `#ffffff` |
| `--zp-color-info-bg-subtle` | `#ecfeff` | `rgba(6, 182, 212, 0.16)` | `#000000` |
| `--zp-color-info-bg-solid` | `#0891b2` | `#22d3ee` | `#1aebff` |
| `--zp-color-info-text-on-solid` | `#ffffff` | `#ffffff` | `#000000` |

---

#### Neutral semantic state (`--zp-color-neutral-*`)

| Custom property | Light | Dark | High-contrast |
|-----------------|-------|------|---------------|
| `--zp-color-neutral` | `#6b7280` | `#9ca3af` | `#ffffff` |
| `--zp-color-neutral-subtle` | `#f3f4f6` | `rgba(156, 163, 175, 0.16)` | `#000000` |
| `--zp-color-neutral-text` | `#374151` | `#d1d5db` | `#ffffff` |
| `--zp-color-neutral-bg-subtle` | `#f3f4f6` | `rgba(156, 163, 175, 0.16)` | `#000000` |
| `--zp-color-neutral-bg-solid` | `#6b7280` | `#9ca3af` | `#ffffff` |
| `--zp-color-neutral-text-on-solid` | `#ffffff` | `#ffffff` | `#000000` |

---

#### Surface & background tokens

| Custom property | Light | Dark | High-contrast | Purpose |
|-----------------|-------|------|---------------|---------|
| `--zp-color-background` | `#ffffff` | `#0b0f17` | `#000000` | Page / app canvas |
| `--zp-color-surface` | `#ffffff` | `#121826` | `#000000` | Default card / panel |
| `--zp-color-surface-raised` | `#ffffff` | `#1a2132` | `#000000` | Raised surface (e.g. Popover) |
| `--zp-color-surface-overlay` | `rgba(17, 24, 39, 0.5)` | `rgba(0, 0, 0, 0.65)` | `rgba(0, 0, 0, 0.85)` | Scrim behind inline overlays |
| `--zp-color-surface-0` | `#ffffff` | `#0b0f17` | `#000000` | Depth level 0 — canvas |
| `--zp-color-surface-1` | `#ffffff` | `#121826` | `#000000` | Depth level 1 — default surface |
| `--zp-color-surface-2` | `#f9fafb` | `#1a2132` | `#000000` | Depth level 2 |
| `--zp-color-surface-3` | `#f3f4f6` | `#222b3d` | `#000000` | Depth level 3 |
| `--zp-color-surface-4` | `#e5e7eb` | `#2b3548` | `#000000` | Depth level 4 — most raised |

Use `--zp-color-surface-0` through `--zp-color-surface-4` in Card, Dialog, Popover, and Menu to express depth.

---

#### Text colors (`--zp-color-text-*`)

| Custom property | Light | Dark | High-contrast | Purpose |
|-----------------|-------|------|---------------|---------|
| `--zp-color-text-primary` | `#111827` | `#f9fafb` | `#ffffff` | Default body text |
| `--zp-color-text-secondary` | `#4b5563` | `#d1d5db` | `#ffffff` | Supporting / metadata text |
| `--zp-color-text-disabled` | `#6b7280` | `#6b7280` | `#3ff23f` | Disabled interactive text |
| `--zp-color-text-inverse` | `#ffffff` | `#111827` | `#000000` | Text on filled / dark backgrounds |

---

#### Border tokens (`--zp-color-border-*`)

| Custom property | Light | Dark | Purpose |
|-----------------|-------|------|---------|
| `--zp-color-border` | `#d1d5db` | `#374151` | Default border |
| `--zp-color-border-subtle` | `#e5e7eb` | `#1f2937` | Subtle / muted border |
| `--zp-color-border-strong` | `#9ca3af` | `#4b5563` | Emphasized border |
| `--zp-color-border-inverse` | `#ffffff` | `#f9fafb` | Border on filled / dark surfaces |
| `--zp-color-border-focus` | `#3b82f6` | `#60a5fa` | Focus indicator border |

---

#### Focus ring (`--zp-focus-ring-*`)

| Custom property | Default value | Notes |
|-----------------|---------------|-------|
| `--zp-focus-ring-width` | `2px` | Outline width |
| `--zp-focus-ring-offset` | `2px` | Outline offset |
| `--zp-focus-ring-style` | `solid` | Outline style |
| `--zp-focus-ring-color` | `var(--zp-color-focus-ring)` | Tracks the semantic focus-ring color |

The global `.zp-focus-ring:focus-visible` utility class uses these tokens so all interactive elements stay in sync automatically.

---

#### Color palette ramps (`--zp-color-{ramp}-{step}`)

Raw palette steps are available for custom usage. Prefer semantic tokens wherever possible.

Available ramps: `neutral`, `blue`, `green`, `amber`, `red`, `cyan`.  
Available steps: `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`.

Examples: `--zp-color-blue-500` → `#3b82f6`, `--zp-color-red-100` → `#fee2e2`.

---

#### Spacing (`--zp-space-*`)

| Custom property | Value | px |
|-----------------|-------|----|
| `--zp-space-0` | `0` | 0 |
| `--zp-space-0-5` | `0.125rem` | 2 |
| `--zp-space-1` | `0.25rem` | 4 |
| `--zp-space-1-5` | `0.375rem` | 6 |
| `--zp-space-2` | `0.5rem` | 8 |
| `--zp-space-2-5` | `0.625rem` | 10 |
| `--zp-space-3` | `0.75rem` | 12 |
| `--zp-space-4` | `1rem` | 16 |
| `--zp-space-5` | `1.25rem` | 20 |
| `--zp-space-6` | `1.5rem` | 24 |
| `--zp-space-8` | `2rem` | 32 |
| `--zp-space-10` | `2.5rem` | 40 |
| `--zp-space-12` | `3rem` | 48 |
| `--zp-space-16` | `4rem` | 64 |
| `--zp-space-20` | `5rem` | 80 |
| `--zp-space-24` | `6rem` | 96 |

> Source token keys with decimal steps (e.g. `0.5`) are normalized to dashes (e.g. `--zp-space-0-5`). Pass the raw key to `cssVar('space-0.5')` — the helper normalizes automatically.

---

#### Typography

##### Font families (`--zp-font-family-*`)

| Custom property | Usage |
|-----------------|-------|
| `--zp-font-family-sans` | Body text (system-UI stack) |
| `--zp-font-family-serif` | Editorial / long-form text |
| `--zp-font-family-mono` | Code blocks and monospace |

##### Font sizes (`--zp-font-size-*`)

| Custom property | Value | px |
|-----------------|-------|----|
| `--zp-font-size-xs` | `0.75rem` | 12 |
| `--zp-font-size-sm` | `0.875rem` | 14 |
| `--zp-font-size-md` | `1rem` | 16 |
| `--zp-font-size-lg` | `1.125rem` | 18 |
| `--zp-font-size-xl` | `1.25rem` | 20 |
| `--zp-font-size-2xl` | `1.5rem` | 24 |
| `--zp-font-size-3xl` | `1.875rem` | 30 |
| `--zp-font-size-4xl` | `2.25rem` | 36 |
| `--zp-font-size-5xl` | `3rem` | 48 |

##### Font weights (`--zp-font-weight-*`)

| Custom property | Value | Usage |
|-----------------|-------|-------|
| `--zp-font-weight-regular` | `400` | Body text |
| `--zp-font-weight-medium` | `500` | Slightly emphasized |
| `--zp-font-weight-semibold` | `600` | Labels, headings |
| `--zp-font-weight-bold` | `700` | Strong emphasis |

##### Line heights (`--zp-line-height-*`)

| Custom property | Value | Usage |
|-----------------|-------|-------|
| `--zp-line-height-none` | `1` | Inline / icon elements |
| `--zp-line-height-tight` | `1.25` | Headings |
| `--zp-line-height-snug` | `1.375` | Dense body copy |
| `--zp-line-height-normal` | `1.5` | Default body copy |
| `--zp-line-height-relaxed` | `1.625` | Long-form / article text |

##### Letter spacing (`--zp-letter-spacing-*`)

| Custom property | Value | Usage |
|-----------------|-------|-------|
| `--zp-letter-spacing-tight` | `-0.01em` | Display / hero text |
| `--zp-letter-spacing-normal` | `0` | Body text |
| `--zp-letter-spacing-wide` | `0.02em` | Button labels |
| `--zp-letter-spacing-wider` | `0.04em` | Overlines, ALL-CAPS labels |

---

#### Radius (`--zp-radius-*`)

| Custom property | Value | Usage |
|-----------------|-------|-------|
| `--zp-radius-none` | `0` | Sharp corners |
| `--zp-radius-sm` | `2px` | Small elements (badges) |
| `--zp-radius-md` | `4px` | Default (inputs, badges) |
| `--zp-radius-lg` | `8px` | Cards, dialogs |
| `--zp-radius-xl` | `12px` | Large surfaces |
| `--zp-radius-2xl` | `16px` | Extra-large surfaces |
| `--zp-radius-full` | `9999px` | Fully round |
| `--zp-radius-pill` | `9999px` | Alias — pill-shaped buttons and badges |
| `--zp-radius-card` | `8px` | Alias — standard Card / panel surface |

---

#### Shadows (`--zp-shadow-*`)

| Custom property | Purpose |
|-----------------|---------|
| `--zp-shadow-none` | No shadow (flat) |
| `--zp-shadow-xs` | Subtle depth (rows, list items) |
| `--zp-shadow-sm` | Card surface |
| `--zp-shadow-md` | Dropdown, Popover |
| `--zp-shadow-lg` | Dialog, Drawer |
| `--zp-shadow-xl` | Floating / full-screen panels |
| `--zp-shadow-2xl` | Deep overlays |

#### Elevation scale (`--zp-elevation-*`)

The elevation scale maps numeric levels to shadow tokens:

| Custom property | Shadow token | Description |
|-----------------|--------------|-------------|
| `--zp-elevation-0` | `shadow.none` | No shadow |
| `--zp-elevation-1` | `shadow.xs` | Extra-small shadow |
| `--zp-elevation-2` | `shadow.sm` | Small shadow |
| `--zp-elevation-3` | `shadow.md` | Medium shadow |
| `--zp-elevation-4` | `shadow.lg` | Large shadow |
| `--zp-elevation-5` | `shadow.xl` | Extra-large shadow |

---

#### Border widths (`--zp-border-width-*`)

| Custom property | Value | Usage |
|-----------------|-------|-------|
| `--zp-border-width-0` | `0` | No border |
| `--zp-border-width-1` | `1px` | Default border |
| `--zp-border-width-2` | `2px` | Focused / active border |
| `--zp-border-width-4` | `4px` | Accent / left-border style |

---

#### Duration (`--zp-duration-*`)

| Custom property | Value | Usage |
|-----------------|-------|-------|
| `--zp-duration-instant` | `0ms` | No transition |
| `--zp-duration-fast` | `100ms` | Micro-interactions (hover) |
| `--zp-duration-normal` | `200ms` | Default transitions |
| `--zp-duration-slow` | `300ms` | Expanded panels |
| `--zp-duration-slower` | `500ms` | Large surface transitions |
| `--zp-duration-shimmer` | `1500ms` | Skeleton shimmer loop |
| `--zp-duration-spin` | `600ms` | Spinner loop |

#### Easing (`--zp-easing-*`)

| Custom property | Curve | Usage |
|-----------------|-------|-------|
| `--zp-easing-linear` | `linear` | Progress bars, opacity |
| `--zp-easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default transitions |
| `--zp-easing-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | Emphasized motion |
| `--zp-easing-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Entrance animations |
| `--zp-easing-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Exit animations |
| `--zp-easing-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful overshoot (popover open) |

---

#### Z-index scale (`--zp-z-*`)

| Custom property | Value | Usage |
|-----------------|-------|-------|
| `--zp-z-hide` | `-1` | Hidden layers |
| `--zp-z-base` | `0` | Default stacking |
| `--zp-z-raised` | `1` | Slightly raised elements |
| `--zp-z-docked` | `10` | Docked/fixed bars |
| `--zp-z-dropdown` | `1000` | Dropdown menus |
| `--zp-z-sticky` | `1100` | Sticky headers/footers |
| `--zp-z-banner` | `1200` | Banners/notifications |
| `--zp-z-overlay` | `1300` | Generic overlays |
| `--zp-z-drawer` | `1350` | Drawer / side-sheet |
| `--zp-z-modal` | `1400` | Modal dialogs |
| `--zp-z-dialog` | `1400` | Dialog (alias for modal) |
| `--zp-z-popover` | `1500` | Popovers |
| `--zp-z-skip-nav` | `1600` | Skip-navigation links |
| `--zp-z-toast` | `1700` | Toast notifications |
| `--zp-z-tooltip` | `1800` | Tooltips |

---

#### Breakpoints (`--zp-breakpoint-*`)

These tokens expose the min-width thresholds. They are static (mode-independent).

| Custom property | Value | Usage |
|-----------------|-------|-------|
| `--zp-breakpoint-sm` | `640px` | Small devices |
| `--zp-breakpoint-md` | `768px` | Tablets |
| `--zp-breakpoint-lg` | `1024px` | Desktops |
| `--zp-breakpoint-xl` | `1280px` | Large desktops |
| `--zp-breakpoint-2xl` | `1536px` | Extra-large screens |

---

#### Density (`--zp-density-*`)

Density tokens reflect the active `density` setting (`compact` / `normal` / `spacious`) and update when `ThemeProvider`'s `density` prop changes.

| Custom property | compact | normal | spacious | Purpose |
|-----------------|---------|--------|----------|---------|
| `--zp-density-scale` | `0.75` | `1` | `1.25` | Multiplier |
| `--zp-density-padding-sm` | `0.375rem` | `0.5rem` | `0.75rem` | Small component padding |
| `--zp-density-padding-md` | `0.5rem` | `0.75rem` | `1rem` | Medium component padding |
| `--zp-density-padding-lg` | `0.625rem` | `1rem` | `1.25rem` | Large component padding |
| `--zp-density-gap` | `0.25rem` | `0.5rem` | `0.75rem` | Gap between elements |
| `--zp-density-min-height` | `2rem` | `2.5rem` | `3rem` | Touch target minimum height |

---

#### Typography presets

Semantic typography presets are available as `.zp-text-*` CSS utility classes.

| Class | Use case |
|-------|----------|
| `.zp-text-display-lg` | Hero / splash headings |
| `.zp-text-display-md` | Section splash headings |
| `.zp-text-heading-1` … `.zp-text-heading-6` | Page / section headings |
| `.zp-text-body-lg` | Large body copy |
| `.zp-text-body-md` | Default body copy |
| `.zp-text-body-sm` | Small / dense body copy |
| `.zp-text-caption` | Labels beneath images/charts |
| `.zp-text-overline` | ALL-CAPS category labels |
| `.zp-text-code` | Inline or block code snippets |

All classes reference `--zp-*` CSS custom properties, so they automatically adapt to the active theme.

---

#### Overlay backdrop (`--zp-overlay`)

| Custom property | Light | Dark | High-contrast |
|-----------------|-------|------|---------------|
| `--zp-overlay` | `rgba(17, 24, 39, 0.5)` | `rgba(0, 0, 0, 0.6)` | `rgba(0, 0, 0, 0.75)` |

> `--zp-color-overlay` is also emitted with the same value as an artifact of the generic semantic-color emission; prefer `--zp-overlay` as the canonical token.

---

### Tailwind v4 integration

Map zenput's design tokens into Tailwind v4's `@theme` block so both systems share the same values and respond to theme changes simultaneously.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Semantic colors */
  --color-brand: var(--zp-color-brand);
  --color-brand-hover: var(--zp-color-brand-hover);
  --color-success: var(--zp-color-success);
  --color-warning: var(--zp-color-warning);
  --color-danger: var(--zp-color-danger);
  --color-info: var(--zp-color-info);

  /* Surfaces / backgrounds */
  --color-surface: var(--zp-color-surface);
  --color-surface-raised: var(--zp-color-surface-raised);
  --color-background: var(--zp-color-background);

  /* Text */
  --color-text: var(--zp-color-text-primary);
  --color-text-muted: var(--zp-color-text-secondary);

  /* Typography */
  --font-sans: var(--zp-font-family-sans);
  --font-mono: var(--zp-font-family-mono);

  /* Radius */
  --radius-sm: var(--zp-radius-sm);
  --radius-md: var(--zp-radius-md);
  --radius-lg: var(--zp-radius-lg);
  --radius-pill: var(--zp-radius-pill);

  /* Spacing */
  --spacing-1: var(--zp-space-1);
  --spacing-2: var(--zp-space-2);
  --spacing-4: var(--zp-space-4);
  --spacing-8: var(--zp-space-8);

  /* Shadows */
  --shadow-sm: var(--zp-shadow-sm);
  --shadow-md: var(--zp-shadow-md);
  --shadow-lg: var(--zp-shadow-lg);
}
```

Because `ThemeProvider` updates the `--zp-*` variables on its root element, Tailwind utility classes that reference these aliases respond to light/dark/high-contrast mode changes without any additional configuration.

#### Overriding tokens with raw CSS

You can also override any token with plain CSS — no React required:

```css
/* Brand rebrand without re-rendering */
:root {
  --zp-color-brand: #8b5cf6;
  --zp-color-brand-hover: #7c3aed;
  --zp-color-brand-active: #6d28d9;
  --zp-color-focus-ring: #8b5cf6;
}

/* Per-section overrides */
.my-promo-banner {
  --zp-color-brand: #f59e0b;
  --zp-color-brand-hover: #d97706;
}
```

Scoped overrides work because CSS custom properties cascade normally — a value set on a parent element propagates to all its descendants, and the nearest ancestor wins.

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

## Accessibility primitives

Zenput ships a set of first-class accessibility primitives in `src/components/a11y/`. All are
exported from the top-level `zenput` package entry point.

### Published a11y baselines (for consumer CI)

Zenput also publishes per-component accessibility snapshots under `zenput/a11y/*` (JSON files).
These are generated during `npm run build` from the default `vitest-axe` fixtures for the 18 core
input components (TextInput, TextArea, NumberInput, PasswordInput, SelectInput, Checkbox,
CheckboxGroup, RadioGroup, Toggle, DateInput, TimeInput, FileInput, RangeInput, ColorInput,
SearchInput, PhoneInput, OTPInput, AutoComplete).

Each baseline artifact records:
- the fixture source test (`src/components/**/**.test.tsx`)
- the rule set (`axe-core default`)
- the expected violation IDs for that fixture (currently an empty array)

What Zenput guarantees:
- those exact default fixtures continue to pass with no axe violations
- artifact paths and names remain stable (`zenput/a11y/<component>.json`)

What consumers still own:
- checking your composed screens/pages and custom theming
- validating interactive flows not covered by the default fixture
- deciding which axe rules/tags to enforce for your product requirements

Example CI assertion in a consuming app:

```ts
import baseline from 'zenput/a11y/text-input';
import { axe } from 'vitest-axe';

const results = await axe(container);
const actualViolationIds = results.violations.map((v) => v.id).sort();
expect(actualViolationIds).toEqual(baseline.guarantee.expectedViolations.slice().sort());
```

### `<VisuallyHidden>`

Visually hides content while keeping it accessible to screen readers (clip-path technique).
The hiding styles always win over consumer-supplied `style` props.

```tsx
import { VisuallyHidden } from 'zenput';

<button>
  <span aria-hidden="true">🔍</span>
  <VisuallyHidden>Search</VisuallyHidden>
</button>
```

Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `React.ElementType` | `'span'` | Rendered element type |
| `children` | `React.ReactNode` | — | Content to hide visually |

---

### `<SkipLink>`

Keyboard-only visible anchor that becomes visible when it receives focus. Always place it as the
very first focusable element in the document so keyboard users can skip repetitive navigation.

```tsx
import { SkipLink } from 'zenput';

// Place before <nav> in your layout
<SkipLink href="#main" />
<nav>…</nav>
<main id="main">…</main>
```

Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | `'#main'` | Target fragment id |
| `children` | `React.ReactNode` | `'Skip to main content'` | Link label |

---

### `<LiveRegion>` + `useAnnounce()`

Mount **one** `<LiveRegion>` near your app root. Use `useAnnounce()` anywhere in the tree to
push polite or assertive messages into an `aria-live` region.

Features: one mounted region per app, debounced re-announcement of identical
messages (clears then re-sets so screen readers re-read).

```tsx
import { LiveRegion, useAnnounce } from 'zenput';

// In your root layout:
<LiveRegion>
  <App />
</LiveRegion>

// Anywhere in the tree:
function SearchResults({ count }: { count: number }) {
  const announce = useAnnounce();

  useEffect(() => {
    announce(`${count} results found`);
  }, [count, announce]);

  return <ul>…</ul>;
}
```

`LiveRegion` props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | — | Wrapped content |

`useAnnounce()` signature:

```ts
type AnnounceOptions = { politeness?: 'polite' | 'assertive' };
announce(message: string, options?: AnnounceOptions): void
```

---

### `<FocusScope>`

Declarative wrapper around `useFocusTrap`. Renders a container element and manages focus
trapping, auto-focus on activation, and focus restoration on deactivation.
Used internally by `<Dialog>`, `<Drawer>`, and `<Menu>`.

```tsx
import { FocusScope } from 'zenput';

<FocusScope trapped restoreFocus autoFocus>
  <div role="dialog" aria-label="Settings">
    <button>Save</button>
    <button>Cancel</button>
  </div>
</FocusScope>
```

Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trapped` | `boolean` | `false` | Activate the focus trap |
| `restoreFocus` | `boolean` | `true` | Restore focus on deactivation |
| `autoFocus` | `boolean` | `true` | Auto-focus first tabbable element on activation |
| `clickOutsideDeactivates` | `boolean` | `true` | Allow clicks outside to move focus |
| `initialFocusRef` | `RefObject<HTMLElement>` | — | Override initial focus target |
| `returnFocusRef` | `RefObject<HTMLElement>` | — | Override focus-restoration target |
| `as` | `React.ElementType` | `'div'` | Rendered container element |

---

### `useRovingTabIndex()`

Generic hook for keyboard-navigable lists and grids. Implements the WAI-ARIA roving-tabindex
pattern: only the active item has `tabIndex={0}`; all others have `tabIndex={-1}`. Arrow keys,
Home, and End move focus within the group.

```tsx
import { useRovingTabIndex } from 'zenput';

const items = ['apple', 'banana', 'cherry'];

function FruitList() {
  const [selected, setSelected] = useState('apple');
  const containerRef = useRef<HTMLDivElement>(null);

  const { getTabIndex, onKeyDown } = useRovingTabIndex({
    items,
    activeItem: selected,
    onNavigate: setSelected,
    containerRef,           // enables automatic DOM focus on navigation
  });

  return (
    <div role="listbox" ref={containerRef} onKeyDown={onKeyDown}>
      {items.map((id) => (
        <div
          key={id}
          role="option"
          tabIndex={getTabIndex(id)}
          data-rti-value={id}       // required for DOM focus to work
          aria-selected={id === selected}
          onClick={() => setSelected(id)}
        >
          {id}
        </div>
      ))}
    </div>
  );
}
```

Options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `string[]` | — | Ordered item identifiers in DOM order |
| `activeItem` | `string` | — | Currently active item |
| `orientation` | `'horizontal' \| 'vertical' \| 'both'` | `'horizontal'` | Navigation axis |
| `onNavigate` | `(item: string) => void` | — | Called when focus should move |
| `loop` | `boolean` | `true` | Wrap from last to first and vice versa |
| `disabledItems` | `string[]` | `[]` | Items skipped during navigation |
| `containerRef` | `RefObject<HTMLElement>` | — | Container ref for automatic DOM focus |

---

### `useId()` re-export

React 18+ ships `useId()` built-in. Zenput re-exports it so consumers don't need to reach for
a third-party package:

```tsx
import { useId } from 'zenput';

function Field({ label }: { label: string }) {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </>
  );
}
```

## Imperative overlays

Zenput ships **provider-based imperative APIs** for Dialog, Drawer, and Popover. These are designed for "fire-and-forget" use cases where managing `open` state and JSX placement would be inconvenient — confirming navigation, prompting for input from a row-action callback, or surfacing errors from `fetch().catch()`.

> **Anti-pattern guard** — providers are for *transient* / *imperative* flows. The declarative
> `<Dialog open={x}>…</Dialog>` API remains the recommended primitive for dialogs whose content
> is part of the page layout. Both APIs ship side-by-side.

### Setup

Wrap your application (or a subtree) with the providers once:

```tsx
import { DialogProvider, DrawerProvider, PopoverProvider } from 'zenput';

<DialogProvider>
  <DrawerProvider>
    <PopoverProvider>
      <App />
    </PopoverProvider>
  </DrawerProvider>
</DialogProvider>
```

### `useConfirm`

```tsx
import { useConfirm } from 'zenput';

function DeleteButton() {
  const confirm = useConfirm();

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Delete project?',
      description: 'This cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      destructive: true,   // uses the danger button variant
      dismissible: true,   // Escape / backdrop resolves false (default)
    });
    if (ok) deleteProject();
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

### `usePrompt`

```tsx
import { usePrompt } from 'zenput';

function RenameButton({ file, renameFile }: Props) {
  const prompt = usePrompt();

  const handleRename = async () => {
    const newName = await prompt({
      title: 'Rename file',
      label: 'New name',
      defaultValue: file.name,
      validate: (v) => v.trim().length > 0 || 'Name is required',
    });
    if (newName) renameFile(newName);
  };

  return <button onClick={handleRename}>Rename</button>;
}
```

### `useAlert`

```tsx
import { useAlert } from 'zenput';

function SaveButton() {
  const alert = useAlert();

  // Works great inside async error handlers — no JSX needed at the call site.
  const handleSave = async () => {
    try {
      await fetch('/api/save');
    } catch (err) {
      await alert({
        title: 'Save failed',
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### `useDialog` — generic content

```tsx
import { useDialog } from 'zenput';

function MyButton() {
  const dialog = useDialog();

  const openForm = async () => {
    const handle = dialog.open<string>({
      size: 'md',
      content: ({ close }) => (
        <MyForm onSubmit={(v) => close(v)} onCancel={() => close()} />
      ),
    });
    const result = await handle.result; // string | null
    return result;
  };

  return <button onClick={openForm}>Open form</button>;
}
```

### `useDrawer`

Same shape as `useDialog` but anchored to an edge of the viewport.

```tsx
import { useDrawer, DrawerHeader, DrawerTitle, DrawerBody, DrawerFooter } from 'zenput';

function OpenDetailsButton() {
  const drawer = useDrawer();

  const handleOpen = () => {
    drawer.open({
      side: 'right',   // 'left' | 'right' | 'top' | 'bottom'
      size: 'md',
      content: ({ close }) => (
        <>
          <DrawerHeader><DrawerTitle>Details</DrawerTitle></DrawerHeader>
          <DrawerBody>…</DrawerBody>
          <DrawerFooter><button onClick={() => close()}>Done</button></DrawerFooter>
        </>
      ),
    });
  };

  return <button onClick={handleOpen}>Open details</button>;
}
```

### `usePopover`

Anchor a popover to an element ref **or** `(x, y)` viewport coordinates.

```tsx
import { useRef } from 'react';
import { usePopover } from 'zenput';

function PopoverDemo() {
  const popover = usePopover();
  const ref = useRef<HTMLButtonElement>(null);

  // Anchored to an element
  const openMenu = () => {
    popover.open({
      anchor: ref,
      side: 'bottom',
      content: ({ close }) => <Menu onSelect={(v) => close(v)} />,
    });
  };

  // Anchored to cursor (context menu)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    popover.open({
      anchor: { x: e.clientX, y: e.clientY },
      content: ({ close }) => <Menu onSelect={(v) => close(v)} />,
    });
  };

  return (
    <button ref={ref} onClick={openMenu} onContextMenu={handleContextMenu}>
      Menu
    </button>
  );
}
```

### Promise resolution

| Hook | Resolved value | Dismissed value |
|------|---------------|-----------------|
| `useConfirm` | `true` | `false` |
| `usePrompt` | `string` | `null` |
| `useAlert` | `void` | `void` |
| `useDialog` | value passed to `close(value)` | `null` |
| `useDrawer` | value passed to `close(value)` | `null` |
| `usePopover` | value passed to `close(value)` | `null` |

All promises resolve (never reject). When the provider unmounts with open dialogs, remaining promises are resolved with their dismissed value — no unhandled rejection warnings.

### Stack support

Opening a dialog (or confirm) from inside another dialog stacks them in DOM order — the most recently opened overlay is on top. Escape and backdrop dismissal target only the topmost overlay; if the topmost is `dismissible: false`, neither it nor any underlying overlay can be dismissed via Escape/backdrop until it is closed programmatically.

## Development

```bash
# Install dependencies
npm install

# Run tests (Vitest)
npm test

# Watch tests / open Vitest UI
npm run test:watch
npm run test:ui

# Run tests with coverage (85% lines/statements/functions, 80% branches)
npm run test:coverage

# Build the library (Rollup → dist/)
npm run build

# Lint (ESLint 9 flat config + jsx-a11y)
npm run lint

# Type check
npm run type-check

# Bundle-size budget (size-limit)
npm run size
npm run size:why

# Storybook
npm run storybook         # dev server on :6006
npm run build-storybook   # static build → storybook-static/
npm run test:storybook    # Storybook a11y via @storybook/test-runner
```

## Running CI locally

Both GitHub Actions and the Azure Pipeline delegate to the same npm scripts,
so a local run that matches CI is:

```bash
npm ci
npm run lint
npm run type-check
npm run test:ci          # coverage + JUnit (reports/junit.xml)
npm run build
npm run build-storybook
npm run size
```

### Azure self-hosted prerequisites

The Azure Pipeline (`AzCICD.yml`) targets a single self-hosted Linux agent in
the pool `Default` and runs all CI steps sequentially on that one machine
(lint → type-check → test → build → size → Storybook a11y). The agent needs
`git`, Node 20.x (ideally managed via `nvm`), and npm 10+ pre-installed.
Playwright browsers are cached under `~/.cache/ms-playwright` and installed
only when missing. SonarCloud analysis is gated on a `SONAR_TOKEN` pipeline
variable and a service connection named `SonarCloud`.

## Forms

Zenput ships an **opt-in** form integration via the `zenput/forms` subpath. It wraps `react-hook-form` + `zod` so that every Zenput input gets `value`, `onChange`, `onBlur`, `name`, `ref`, `validationState`, `errorMessage`, `aria-invalid`, and `aria-describedby` wired up automatically.

### Installation

Install the peer dependencies alongside Zenput:

```bash
npm install zenput react-hook-form @hookform/resolvers zod
```

`react-hook-form`, `@hookform/resolvers`, and `zod` are **peer-optional** — the core bundle is unaffected if you don't use the `zenput/forms` entry point.

### End-to-end example

```tsx
import { z } from 'zod';
import { Form, useZenputForm } from 'zenput/forms';
import { TextInput, PasswordInput, Button } from 'zenput';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const form = useZenputForm<LoginValues>({
    schema: loginSchema,
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginValues) => {
    await fetch('/api/login', { method: 'POST', body: JSON.stringify(values) });
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      {/* Error summary — focuses and lists all errors for screen readers */}
      <Form.ErrorSummary />

      <Form.Field<LoginValues> name="email">
        {(field) => (
          <TextInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            validationState={field.props.validationState}
            errorMessage={field.props.errorMessage}
            value={field.props.value as string}
            onChange={(e) => field.props.onChange(e.target.value)}
            onBlur={field.props.onBlur}
            ref={field.props.ref as React.Ref<HTMLInputElement>}
            name={field.props.name}
            fullWidth
          />
        )}
      </Form.Field>

      <Form.Field<LoginValues> name="password">
        {(field) => (
          <PasswordInput
            label="Password"
            validationState={field.props.validationState}
            errorMessage={field.props.errorMessage}
            value={field.props.value as string}
            onChange={(e) => field.props.onChange(e.target.value)}
            onBlur={field.props.onBlur}
            ref={field.props.ref as React.Ref<HTMLInputElement>}
            name={field.props.name}
            fullWidth
          />
        )}
      </Form.Field>

      <Button type="submit" loading={form.formState.isSubmitting} fullWidth>
        Sign in
      </Button>
    </Form>
  );
}
```

### API

#### `useZenputForm(options)`

| Option | Type | Default | Description |
|---|---|---|---|
| `schema` | `ZodType` | — | Zod schema for validation (optional). |
| `defaultValues` | `Partial<TFieldValues>` | — | Initial form values. |
| `mode` | `'onBlur' \| 'onChange' \| 'onSubmit' \| 'onTouched' \| 'all'` | `'onBlur'` | Validation trigger mode. |

Returns the standard `react-hook-form` `UseFormReturn` object — every RHF API is available.

#### `<Form form={form} onSubmit={handler}>`

| Prop | Type | Description |
|---|---|---|
| `form` | `UseFormReturn` | The form instance from `useZenputForm`. |
| `onSubmit` | `SubmitHandler` | Called with validated values on success. |
| `onError` | `SubmitErrorHandler` | Called with validation errors on failure (optional). |

#### `<Form.Field name="fieldName">`

Render-prop component. The child function receives `{ props, invalid, errorMessage }`. Spread `field.props` onto any Zenput input:

```tsx
<Form.Field name="email">
  {(field) => <TextInput {...field.props} label="Email" />}
</Form.Field>
```

#### `<Form.Submit>` / `<Form.Reset>`

Pre-wired `<button type="submit">` and `<button type="button">` (Reset wires to RHF's `reset()` to ensure controlled fields are cleared). Both are automatically disabled while the form is submitting.

#### `<Form.ErrorSummary>`

Renders a live region listing all current field errors. When errors first appear (e.g., after a failed submit), the container is focused automatically — critical for keyboard and screen-reader users.

### Recipe: no form library (`useFormField` only)

If you don't want `react-hook-form`, use `useFormField` directly:

```tsx
import { useFormField } from 'zenput';
import { TextInput } from 'zenput';
import { useState } from 'react';

function EmailField() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const { inputId, inputAriaProps } = useFormField({
    id: 'email',
    label: 'Email',
    errorMessage: error,
    validationState: error ? 'error' : 'default',
    required: true,
  });

  return (
    <TextInput
      id={inputId}
      label="Email"
      value={value}
      onChange={(e) => { setValue(e.target.value); setError(''); }}
      validationState={error ? 'error' : 'default'}
      errorMessage={error}
      required
      {...inputAriaProps}
    />
  );
}
```


## Next.js App Router

Zenput ships with `'use client'` directives in its bundle so every component
and hook is clearly marked as a Client Component boundary. This means you can
import zenput components directly from **Server Components** — Next.js will
automatically render them on the client.

### Server-safe sub-path exports

| Import path | Contents | Safe in Server Component? |
|---|---|---|
| `zenput` | All components + hooks | ✅ (via `'use client'` boundary) |
| `zenput/tokens` | Design token objects, `cssVar()`, `buildCssVariables()` | ✅ Yes (no React) |
| `zenput/server` | `getColorModeScript()` | ✅ Yes (no React) |
| `zenput/forms` | `Form`, `useZenputForm` | ✅ (via `'use client'` boundary) |

### Minimal App Router setup

```tsx
// app/layout.tsx  (Server Component)
import Script from 'next/script';
import { getColorModeScript } from 'zenput/server';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My App' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/*
         * Sets data-zp-theme on <html> before first paint so CSS variables
         * are scoped correctly before React hydrates, preventing theme flash.
         * The storageKey must match the one passed to <ThemeProvider>.
         */}
        <Script
          id="zp-color-mode"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: getColorModeScript({ storageKey: 'zp-theme', defaultMode: 'system' }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/page.tsx  (Server Component — token utilities run on the server)
import { cssVar, CSS_VAR_PREFIX } from 'zenput/tokens';
import MyForm from './MyForm';           // client component

export default function Page() {
  const brand = cssVar('color-brand');   // runs on server, no hooks needed
  return <MyForm />;
}
```

```tsx
// app/MyForm.tsx  (Client Component)
'use client';
import { ThemeProvider, TextInput, Button } from 'zenput';

export default function MyForm() {
  return (
    // storageKey must match the one passed to getColorModeScript above
    <ThemeProvider theme={{ mode: 'system' }} storageKey="zp-theme">
      <TextInput label="Email" placeholder="you@example.com" />
      <Button>Submit</Button>
    </ThemeProvider>
  );
}
```

### `getColorModeScript` options

The `zenput/server` entry re-exports `getColorModeScript` from the same module
that the main `zenput` bundle exports — so you can import it from either path.

```ts
import { getColorModeScript } from 'zenput/server';
// or:
import { getColorModeScript } from 'zenput';

getColorModeScript({
  storageKey: 'zp-theme',        // required — must match ThemeProvider storageKey
  defaultMode: 'system',         // mode when no stored value ('system' respects OS)
  storage: 'localStorage',       // 'localStorage' (default) or 'sessionStorage'
  detectHighContrast: false,     // set true to honour prefers-contrast: more
});
```

### `transpilePackages` (optional)

If you see module resolution errors, add zenput to `transpilePackages` in
`next.config.ts`:

```ts
// next.config.ts
const nextConfig = {
  transpilePackages: ['zenput'],
};
export default nextConfig;
```

---

## SSR Safety

All Zenput components are designed to render safely in server-side environments:

- **`Portal`** — Defers `document` access until after mount using
  `useSyncExternalStore` with a server snapshot of `false`; renders `null` on
  the server. No browser globals accessed at module evaluation time.

- **`useFocusTrap`** — All `document` access is inside `useEffect`, which only
  runs on the client. Safe to call during SSR.

- **`ThemeProvider`** — SSR-safe by default. When `mode='system'` is set,
  `matchMedia` calls are deferred to `useEffect` and guarded by
  `typeof window !== 'undefined'`. Deterministic SSR output is achieved by
  rendering with the `defaultMode` until the client determines the OS preference.

- **`useDisclosure`** — Uses `useState` and `useRef` from React 18+; no
  `useId` fallback or random values that could cause hydration mismatches.

- **Internal hooks** (`useClickOutside`, `useEscapeKey`, `useMenuKeyboardNav`)
  — All event-listener registration is deferred to `useEffect`.

---

## License

MIT © konarsubhojit
