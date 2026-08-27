import {
  ModuleFields,
  TextField,
  RichTextField,
  RepeatedFieldGroup,
} from '@hubspot/cms-components/fields';
import { RichTextFieldWrapper } from '@hubspot/cms-components';
import { COLORS, FONT_HEADING, FONT_BODY, A4_PAGE, richTextPersonalizationFeatures } from '../../theme';
import { LogoField, BannerImageField, WedgeTopBanner, PhotoFooterBanner } from '../../propShared';
import { ExtraBlock, ExtraBlocks, ExtraContentBlocksField } from '../../sharedFields';

interface ColumnPoint {
  label?: string;
  text: string;
}

interface Column {
  title: string;
  points: ColumnPoint[];
}

interface FieldValues {
  logo?: { src?: string; alt?: string };
  footerImage?: { src?: string; alt?: string };
  heading: string;
  intro: string;
  columnsHeading: string;
  columns: Column[];
  extraBlocks?: ExtraBlock[];
}

function ColumnCard({ column }: { column: Column }) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: COLORS.panel,
        borderTop: `4px solid ${COLORS.orange}`,
        borderRadius: 8,
        padding: 'calc(var(--spacing-unit) * 2)',
      }}
    >
      <div
        style={{
          fontFamily: FONT_HEADING,
          color: COLORS.orange,
          fontWeight: 700,
          fontSize: 16,
          textAlign: 'center',
          marginBottom: 10,
        }}
      >
        {column.title}
      </div>
      {(column.points || []).map((point, index) => (
        <div key={index} style={{ marginBottom: 10, textAlign: 'center' }}>
          {point.label ? (
            <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 12, color: COLORS.body }}>
              {point.label}
            </div>
          ) : null}
          <div style={{ fontSize: 12.5, color: COLORS.body }}>{point.text}</div>
        </div>
      ))}
    </div>
  );
}

export function Component({ fieldValues }: { fieldValues: FieldValues }) {
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
      <WedgeTopBanner logo={fieldValues.logo} />

      <div style={{ padding: 'calc(var(--spacing-unit) * 4) calc(var(--spacing-unit) * 5)', lineHeight: 1.6 }}>
        <h2
          style={{
            fontFamily: FONT_HEADING,
            color: COLORS.navy,
            fontWeight: 700,
            fontSize: 26,
            margin: '0 0 calc(var(--spacing-unit) * 1.5) 0',
          }}
        >
          {fieldValues.heading}
        </h2>

        <RichTextFieldWrapper tag="div" fieldValue={fieldValues.intro} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            color: COLORS.navy,
            fontWeight: 700,
            fontSize: 24,
            margin: 'calc(var(--spacing-unit) * 3) 0 calc(var(--spacing-unit) * 2) 0',
          }}
        >
          {fieldValues.columnsHeading}
        </h2>

        <div style={{ display: 'flex', gap: 'calc(var(--spacing-unit) * 1.5)' }}>
          {(fieldValues.columns || []).map((column, index) => (
            <ColumnCard key={`${column.title}-${index}`} column={column} />
          ))}
        </div>

        <ExtraBlocks blocks={fieldValues.extraBlocks} />
      </div>

      <PhotoFooterBanner image={fieldValues.footerImage} />
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <LogoField />
    <TextField name="heading" label="Heading" default="Why Choose MCGlobal Solutions" />
    <RichTextField
      name="intro"
      label="Body"
      default={`<p>MCGlobal Solutions are experts in maintenance management and facility operations for asset-intensive industries. For over 20 years, we've supported operators through consulting and implementation of tailored CMMS and EAM systems, carefully curated to the needs and usability requirements of each business.</p>
<p>We take pride in our customer relationships, which average 12 years, built on a genuine understanding of what our clients need and consistently excellent ongoing support. Our consultants bring real operational experience to every engagement, from decades in the industry to hands-on backgrounds in ports and shipping, and on-the-ground technical roles.</p>
<p>We deliver systems built to support the scale and complexity of our clients' operations, giving teams access to the maintenance information and reporting they need, anywhere in the world, from any web browser.</p>
<p>Today we support clients across industries including manufacturing, renewables and utilities, facility management, healthcare, ports and shipping, transportation, mining and resources, and hospitality, across 12 countries spanning Australia, New Zealand, Europe, the UK, the US and China.</p>`}
      enabledFeatures={[...richTextPersonalizationFeatures]}
    />
    <TextField name="columnsHeading" label="Columns heading" default="Purpose, Values & Promise" />
    <RepeatedFieldGroup
      name="columns"
      label="Columns"
      occurrence={{ min: 1, default: 3 }}
      default={[
        {
          title: 'Purpose',
          points: [
            {
              label: '',
              text: "To devote our resources and technical skills to improving our clients' systems and performance.",
            },
            {
              label: '',
              text: 'To be a trusted leader in maintenance management and asset performance consulting, delivering unmatched service worldwide while leading the way with sustainability and community support.',
            },
          ],
        },
        {
          title: 'Values',
          points: [
            {
              label: 'Honesty',
              text: 'We will be open and honest to build long-term relationships, which are mutually beneficial.',
            },
            {
              label: 'Respect',
              text: 'We value our staff and clients and will build strong partnerships based on mutual respect.',
            },
            {
              label: 'Exceed',
              text: 'We will exceed our clients expectations by delivering exceptional products and services.',
            },
            {
              label: 'Superior',
              text: "We will listen to our clients' requirements to deliver better solutions through superior knowledge and systems.",
            },
          ],
        },
        {
          title: 'Promise',
          points: [
            { label: '', text: 'We will always recommend the right solution for your operation' },
            { label: '', text: 'We will provide consultancy backed by real industry experience' },
            {
              label: '',
              text: 'We will get you live and benefiting from your system fast, without unnecessary delay',
            },
            { label: '', text: 'We will give you real visibility into your maintenance operations' },
            {
              label: '',
              text: 'We will be approachable, responsive, and available when you need us',
            },
          ],
        },
      ]}
    >
      <TextField name="title" label="Column title" default="" />
      <RepeatedFieldGroup name="points" label="Points" occurrence={{ min: 1, default: 2 }}>
        <TextField name="label" label="Label (optional)" default="" />
        <TextField name="text" label="Text" default="" allowNewLine />
      </RepeatedFieldGroup>
    </RepeatedFieldGroup>
    <BannerImageField name="footerImage" label="Footer photo" />
    <ExtraContentBlocksField />
  </ModuleFields>
);

export const meta = {
  label: 'Prop- Why Choose Us',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set hublData = {} %}
`;
