import React from 'react';

export interface ScenarioProps {
  title: string;
  children: React.ReactNode;
  full?: boolean;
}

export function Scenario({ title, children, full }: ScenarioProps) {
  return (
    <div className={`scenario${full ? ' scenario-full' : ''}`}>
      <div className="scenario-title">{title}</div>
      <div className="stack">{children}</div>
    </div>
  );
}

export interface SectionProps {
  id: string;
  name: string;
  description: string;
  children: React.ReactNode;
}

export function Section({ id, name, description, children }: SectionProps) {
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
