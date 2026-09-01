import {
  ModuleFields,
  TextField,
  RichTextField,
  RepeatedFieldGroup,
  ImageField,
} from '@hubspot/cms-components/fields';
import { RichTextFieldWrapper } from '@hubspot/cms-components';
import {
  COLORS,
  FONT_HEADING,
  FONT_BODY,
  A4_PAGE,
  personalize,
  richTextPersonalizationFeatures,
} from '../../theme';
import { ExtraBlock, ExtraBlocks, ExtraContentBlocksField } from '../../sharedFields';

interface TimelineRow {
  phase: string;
  week: string;
}

interface FieldValues {
  heading: string;
  intro: string;
  note?: string;
  bannerImage?: { src?: string; alt?: string };
  rows: TimelineRow[];
  extraBlocks?: ExtraBlock[];
}

interface HublData {
  buyerCompanyName?: string;
  dealName?: string;
  isQuoteBlueprint: boolean;
}

export function Component({
  fieldValues,
  hublData,
}: {
  fieldValues: FieldValues;
  hublData: HublData;
}) {
  const rows = fieldValues.rows || [];
  const companyName = hublData.isQuoteBlueprint
    ? 'Acme Corp'
    : hublData.buyerCompanyName || hublData.dealName || 'your company';
  const heading = personalize(fieldValues.heading, { company: companyName });

  return (
    <div
      style={{
        ...A4_PAGE,
        fontFamily: FONT_BODY,
        color: COLORS.body,
        backgroundColor: COLORS.paper,
        padding: 'calc(var(--spacing-unit) * 4) calc(var(--spacing-unit) * 5)',
        lineHeight: 1.6,
      }}
    >
      {fieldValues.bannerImage?.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fieldValues.bannerImage.src}
          alt={fieldValues.bannerImage.alt || ''}
          style={{
            width: '100%',
            maxHeight: 160,
            objectFit: 'cover',
            borderRadius: 12,
            marginBottom: 'calc(var(--spacing-unit) * 3)',
            display: 'block',
          }}
        />
      ) : null}

      <h2
        style={{
          fontFamily: FONT_HEADING,
          color: COLORS.navy,
          fontWeight: 700,
          fontSize: 30,
          margin: '0 0 calc(var(--spacing-unit) * 2) 0',
        }}
      >
        {heading}
      </h2>

      <RichTextFieldWrapper tag="div" fieldValue={fieldValues.intro} />

      {fieldValues.note ? (
        <p style={{ fontStyle: 'italic', color: COLORS.muted }}>
          {fieldValues.note}
        </p>
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
          <div style={{ width: 140, padding: '12px 18px', textAlign: 'right' }}>
            Week
          </div>
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
            <div style={{ flex: 1, padding: '14px 18px', fontWeight: 600 }}>
              {row.phase}
            </div>
            <div style={{ width: 140, padding: '14px 18px', textAlign: 'right' }}>
              {row.week}
            </div>
          </div>
        ))}
      </div>

      <ExtraBlocks blocks={fieldValues.extraBlocks} />
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <TextField
      name="heading"
      label="Heading"
      helpText="Personalize with {{company}}."
      default="Timeline"
    />
    <ImageField
      name="bannerImage"
      label="Banner image"
      helpText="Optional decorative image shown at the top of this page."
      default={{ src: '', alt: '' }}
    />
    <RichTextField
      name="intro"
      label="Intro"
      default="<p>To complete the work outlined in the project scope, we estimate approximately 13 weeks from beginning to end. This may vary depending on when we receive feedback at each milestone.</p><p>Upon signing the proposal we will order the software licenses and schedule the work to begin as soon as possible.</p>"
      enabledFeatures={[...richTextPersonalizationFeatures]}
    />
    <TextField name="note" label="Footnote" default="Note, software support is ongoing." />
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
  label: 'MCGS - Timeline',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set hublData = {
    "buyerCompanyName": quoteTemplateContext.buyerCompany.name,
    "dealName": quoteTemplateContext.deal.dealname,
    "isQuoteBlueprint": isQuoteBlueprint
  } %}
`;
