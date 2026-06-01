import { useState } from 'react';
import { Button } from 'zenput';
import { Section, Scenario } from './_shell';

export function ButtonSection() {
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
          <Button variant="destructive">Destructive</Button>
          
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
