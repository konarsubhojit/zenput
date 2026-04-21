import { useState } from 'react';
import { SearchInput } from 'zenput';
import { Section, Scenario } from './_shell';

export function SearchInputSection() {
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
