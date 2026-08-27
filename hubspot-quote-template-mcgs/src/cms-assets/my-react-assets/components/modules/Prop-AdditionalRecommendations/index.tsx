import {
  ModuleFields,
  TextField,
  RichTextField,
  RepeatedFieldGroup,
  BooleanField,
} from '@hubspot/cms-components/fields';
import { RichTextFieldWrapper } from '@hubspot/cms-components';
import { COLORS, FONT_HEADING, FONT_BODY, A4_PAGE, richTextPersonalizationFeatures, splitLines } from '../../theme';
import { WedgeCornerFooter } from '../../propShared';
import { ExtraBlock, ExtraBlocks, ExtraContentBlocksField } from '../../sharedFields';

interface RecommendationSection {
  sectionLabel: string;
  highlightIntro: string;
  bodyText?: string;
  listHeading?: string;
  numbered?: boolean;
  listItems?: string;
}

interface FieldValues {
  heading: string;
  sections: RecommendationSection[];
  extraBlocks?: ExtraBlock[];
}

function SectionBlock({ section }: { section: RecommendationSection }) {
  const items = splitLines(section.listItems);
  const ListTag = section.numbered ? 'ol' : 'ul';
  return (
    <div style={{ marginBottom: 'calc(var(--spacing-unit) * 2.5)' }}>
      <h3
        style={{
          fontFamily: FONT_HEADING,
          color: COLORS.navy,
          fontWeight: 700,
          fontSize: 17,
          textTransform: 'uppercase',
          margin: '0 0 6px 0',
        }}
      >
        {section.sectionLabel}
      </h3>
      <div style={{ color: COLORS.orange, fontWeight: 600 }}>
        <RichTextFieldWrapper tag="div" fieldValue={section.highlightIntro} />
      </div>
      {section.bodyText ? <p style={{ margin: '6px 0 0 0' }}>{section.bodyText}</p> : null}
      {section.listHeading ? <p style={{ margin: '10px 0 4px 0' }}>{section.listHeading}</p> : null}
      {items.length ? (
        <ListTag style={{ margin: '4px 0 0 0', paddingLeft: 20 }}>
          {items.map((item, index) => (
            <li key={index} style={{ marginBottom: 4 }}>
              {item}
            </li>
          ))}
        </ListTag>
      ) : null}
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
      <div style={{ padding: 'calc(var(--spacing-unit) * 4) calc(var(--spacing-unit) * 5)', lineHeight: 1.6 }}>
        <h2
          style={{
            fontFamily: FONT_HEADING,
            color: COLORS.navy,
            fontWeight: 700,
            fontSize: 28,
            lineHeight: 1.2,
            textTransform: 'uppercase',
            borderLeft: `6px solid ${COLORS.orange}`,
            paddingLeft: 16,
            margin: '0 0 calc(var(--spacing-unit) * 3) 0',
          }}
        >
          {fieldValues.heading}
        </h2>

        {(fieldValues.sections || []).map((section, index) => (
          <SectionBlock key={`${section.sectionLabel}-${index}`} section={section} />
        ))}

        <ExtraBlocks blocks={fieldValues.extraBlocks} />
      </div>

      <WedgeCornerFooter />
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <TextField name="heading" label="Heading" default="Additional Recommendations" />
    <RepeatedFieldGroup
      name="sections"
      label="Sections"
      occurrence={{ min: 1, default: 4 }}
      default={[
        {
          sectionLabel: 'AI Predictive Maintenance',
          highlightIntro:
            '<p>Predict failures with Artificial Intelligence, giving your maintenance department the capability to perform maintenance only when required.</p>',
          listItems: [
            'Rather than taking equipment offline purely based on a predefined schedule from an equipment supplier, use advanced Artificial Intelligence (AI) technology to learn when the equipment is performing normally.',
            'Remotely monitor thousands of assets anytime, anywhere.',
            'Help your maintenance teams focus their efforts in the right areas, reducing wasted effort and operational expenditure.',
            'Increase productivity from anywhere, anytime.',
          ].join('\n'),
        },
        {
          sectionLabel: 'GIS Tracking',
          highlightIntro:
            '<p>A web mapping platform for sharing spatial information data through an intuitive interface empowers staff to make informed and accurate decisions, saving time and money.</p>',
          listItems: [
            'Manage location-based assets, people, and property',
            'Deploy networks, infrastructure, and utilities with confidence',
            'Map resources, plan logistics and prepare for emergencies',
          ].join('\n'),
        },
        {
          sectionLabel: 'User Acceptance Testing (UAT)',
          highlightIntro:
            "<p>Although not mandatory, we recommend conducting user testing to validate the system's usability and performance before going live.</p>",
          bodyText:
            'Our consultants will develop targeted test plans to identify potential improvements and align the system with real-world user needs.',
        },
        {
          sectionLabel: 'Support Tiers',
          highlightIntro:
            '<p>To maintain and expand your system after launch, we offer ongoing support packages tailored to your needs. We offer three tiers of support&mdash;Platinum, Gold, and Silver&mdash;to provide scalable assistance that evolves with your business.</p>',
          listHeading: 'All packages include:',
          numbered: true,
          listItems: [
            'Regular system health checks',
            'Feature and system upgrades',
            'Training and guidance to keep your team aligned with best practices',
          ].join('\n'),
        },
      ]}
    >
      <TextField name="sectionLabel" label="Section label" default="" />
      <RichTextField
        name="highlightIntro"
        label="Highlighted intro"
        default=""
        enabledFeatures={[...richTextPersonalizationFeatures]}
      />
      <TextField name="bodyText" label="Extra paragraph (optional)" default="" allowNewLine />
      <TextField name="listHeading" label="List heading (optional)" default="" />
      <BooleanField name="numbered" label="Numbered list?" default={false} />
      <TextField name="listItems" label="List items (optional)" allowNewLine helpText="One item per line." default="" />
    </RepeatedFieldGroup>
    <ExtraContentBlocksField />
  </ModuleFields>
);

export const meta = {
  label: 'Prop- Additional Recommendations',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set hublData = {} %}
`;
