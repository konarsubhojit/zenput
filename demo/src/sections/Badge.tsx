import { Badge } from 'zenput';
import { Section, Scenario } from './_shell';

export function BadgeSection() {
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
