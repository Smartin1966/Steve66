import {
  ModuleFields,
  TextField,
  RichTextField,
  RepeatedFieldGroup,
} from '@hubspot/cms-components/fields';
import { RichTextFieldWrapper } from '@hubspot/cms-components';
import { COLORS, FONT_HEADING, FONT_BODY, A4_PAGE, richTextPersonalizationFeatures } from '../../theme';
import { LogoField, BannerImageField, HeroPhotoBanner, WedgeCornerFooter } from '../../propShared';
import { ExtraBlock, ExtraBlocks, ExtraContentBlocksField } from '../../sharedFields';

interface TimelineRow {
  phase: string;
  week: string;
}

interface FieldValues {
  logo?: { src?: string; alt?: string };
  heroImage?: { src?: string; alt?: string };
  title: string;
  heading: string;
  intro: string;
  note?: string;
  rows: TimelineRow[];
  extraBlocks?: ExtraBlock[];
}

export function Component({ fieldValues }: { fieldValues: FieldValues }) {
  const rows = fieldValues.rows || [];

  return (
    <div
      style={{
        ...A4_PAGE,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT_BODY,
        color: COLORS.body,
        backgroundColor: COLORS.paper,
      }}
    >
      <HeroPhotoBanner image={fieldValues.heroImage} logo={fieldValues.logo} title={fieldValues.title} height={180} />

      <div style={{ padding: 'calc(var(--spacing-unit) * 4) calc(var(--spacing-unit) * 5)', lineHeight: 1.6 }}>
        <h2
          style={{
            fontFamily: FONT_HEADING,
            color: COLORS.navy,
            fontWeight: 700,
            fontSize: 30,
            margin: '0 0 calc(var(--spacing-unit) * 2) 0',
          }}
        >
          {fieldValues.heading}
        </h2>

        <RichTextFieldWrapper tag="div" fieldValue={fieldValues.intro} />

        {fieldValues.note ? (
          <p style={{ marginTop: 'calc(var(--spacing-unit) * 2)' }}>{fieldValues.note}</p>
        ) : null}

        <div
          style={{
            marginTop: 'calc(var(--spacing-unit) * 3)',
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              backgroundColor: COLORS.navy,
              color: COLORS.paper,
              fontFamily: FONT_HEADING,
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            <div style={{ flex: 1, padding: '12px 18px' }}>Project Phase</div>
            <div style={{ width: 140, padding: '12px 18px', textAlign: 'right' }}>Week</div>
          </div>
          {rows.map((row, index) => (
            <div
              key={`${row.phase}-${index}`}
              style={{
                display: 'flex',
                borderTop: index === 0 ? 'none' : `1px solid ${COLORS.border}`,
                borderLeft: `4px solid ${COLORS.orange}`,
              }}
            >
              <div style={{ flex: 1, padding: '14px 18px', fontWeight: index === 0 ? 700 : 400 }}>
                {row.phase}
              </div>
              <div style={{ width: 140, padding: '14px 18px', textAlign: 'right' }}>{row.week}</div>
            </div>
          ))}
        </div>

        <ExtraBlocks blocks={fieldValues.extraBlocks} />
      </div>

      <WedgeCornerFooter />
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <LogoField />
    <BannerImageField name="heroImage" label="Header photo" />
    <TextField name="title" label="Header title" default="Solution Proposal" />
    <TextField name="heading" label="Heading" default="Timeline" />
    <RichTextField
      name="intro"
      label="Intro"
      default="<p>To complete the work outlined in the project scope, we estimate approximately 13 weeks from beginning to end. This may vary depending on when we receive feedback at each milestone.</p><p>Upon signing the proposal we will order the software licenses and schedule the work to begin as soon as possible.</p>"
      enabledFeatures={[...richTextPersonalizationFeatures]}
    />
    <TextField name="note" label="Footnote" default="Note: software support is ongoing." />
    <RepeatedFieldGroup
      name="rows"
      label="Timeline rows"
      occurrence={{ min: 1, default: 4 }}
      default={[
        { phase: 'Review & Plan', week: '1-3' },
        { phase: 'Implement', week: '4-12' },
        { phase: 'Integration & Training', week: '6-10' },
        { phase: 'Go Live', week: '13' },
      ]}
    >
      <TextField name="phase" label="Phase" default="" />
      <TextField name="week" label="Week" default="" />
    </RepeatedFieldGroup>
    <ExtraContentBlocksField />
  </ModuleFields>
);

export const meta = {
  label: 'Prop- Timeline',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set hublData = {} %}
`;
