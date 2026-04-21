import { AutoComplete } from 'zenput';
import { Section, Scenario } from './_shell';

const FRAMEWORKS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'qwik', label: 'Qwik' },
  { value: 'preact', label: 'Preact' },
];

export function AutoCompleteSection() {
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
