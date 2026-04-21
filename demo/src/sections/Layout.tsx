import { Text, Box, Stack, Divider, Badge } from 'zenput';
import { Section, Scenario } from './_shell';

export function LayoutSection() {
  return (
    <Section
      id="layout"
      name="Layout (Box, Stack, Divider)"
      description="Polymorphic primitives for composing layouts with design tokens."
    >
      <Scenario title="Box with tokens">
        <Box p="4" radius="lg" shadow="sm" style={{ background: 'var(--zp-color-surface-subtle)' }}>
          <Text>Box with padding 4, radius lg, shadow sm.</Text>
        </Box>
      </Scenario>
      <Scenario title="Stack (column)">
        <Stack gap="2">
          <Box p="2" radius="md" style={{ background: 'var(--zp-color-brand-subtle)' }}>
            Item 1
          </Box>
          <Box p="2" radius="md" style={{ background: 'var(--zp-color-brand-subtle)' }}>
            Item 2
          </Box>
          <Box p="2" radius="md" style={{ background: 'var(--zp-color-brand-subtle)' }}>
            Item 3
          </Box>
        </Stack>
      </Scenario>
      <Scenario title="Stack (row with justify)">
        <Stack direction="row" gap="3" justify="between" align="center">
          <Badge tone="brand">Left</Badge>
          <Badge tone="success">Center</Badge>
          <Badge tone="warning">Right</Badge>
        </Stack>
      </Scenario>
      <Scenario title="Divider variants" full>
        <Text>Horizontal (subtle):</Text>
        <Divider />
        <Text>Horizontal (strong):</Text>
        <Divider strong />
        <Text>With label:</Text>
        <Divider label="OR" />
        <div style={{ display: 'flex', alignItems: 'center', height: 40, gap: 12 }}>
          <Text>Left</Text>
          <Divider orientation="vertical" />
          <Text>Right</Text>
        </div>
      </Scenario>
    </Section>
  );
}
