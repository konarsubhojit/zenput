import { Heading, Text, Link, Code, Kbd } from 'zenput';
import { Section, Scenario } from './_shell';

export function TypographySection() {
  return (
    <Section
      id="typography"
      name="Typography"
      description="Heading, Text, Link, Code and Kbd primitives built on the type scale."
    >
      <Scenario title="Heading levels" full>
        <Heading level={1}>Display heading</Heading>
        <Heading level={2}>Section heading</Heading>
        <Heading level={3}>Subsection heading</Heading>
        <Heading level={4}>Minor heading</Heading>
      </Scenario>
      <Scenario title="Text sizes">
        <Text size="xs">Extra small text</Text>
        <Text size="sm">Small text</Text>
        <Text size="md">Medium body text</Text>
        <Text size="lg">Large paragraph text</Text>
      </Scenario>
      <Scenario title="Text tones">
        <Text tone="neutral">Neutral tone</Text>
        <Text tone="brand">Brand tone</Text>
        <Text tone="success">Success tone</Text>
        <Text tone="warning">Warning tone</Text>
        <Text tone="danger">Danger tone</Text>
        <Text tone="info">Info tone</Text>
      </Scenario>
      <Scenario title="Inline elements">
        <Text>
          Visit the <Link href="https://github.com/konarsubhojit/zenput" external>
            Zenput repository
          </Link>{' '}
          or press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to search. Install with{' '}
          <Code>npm i zenput</Code>.
        </Text>
      </Scenario>
    </Section>
  );
}
