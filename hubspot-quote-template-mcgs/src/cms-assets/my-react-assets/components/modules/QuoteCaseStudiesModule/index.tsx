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
  richTextPersonalizationFeatures,
  splitLines,
} from '../../theme';
import { ExtraBlock, ExtraBlocks, ExtraContentBlocksField, LogoImage } from '../../sharedFields';

interface CaseStudy {
  logo?: { src?: string; alt?: string; width?: number; height?: number };
  companyName: string;
  intro: string;
  quoteText: string;
  attribution: string;
  challengeLabel: string;
  challengePoints: string;
  solutionLabel: string;
  solutionIntro: string;
  solutionPoints: string;
  resultsLabel: string;
  resultsPoints: string;
  extraBlocks?: ExtraBlock[];
}

interface FieldValues {
  heading: string;
  caseStudies: CaseStudy[];
}

function BulletList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul style={{ margin: '0 0 16px 0', paddingLeft: 20 }}>
      {items.map((item, index) => (
        <li key={index} style={{ marginBottom: 6 }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function CaseStudyCard({ study, isFirst }: { study: CaseStudy; isFirst: boolean }) {
  return (
    <div
      style={{
        ...A4_PAGE,
        backgroundColor: COLORS.paper,
        padding: 'calc(var(--spacing-unit) * 4) calc(var(--spacing-unit) * 5)',
        borderTop: isFirst ? 'none' : `1px solid ${COLORS.border}`,
        pageBreakBefore: isFirst ? 'auto' : 'always',
        breakBefore: isFirst ? 'auto' : 'page',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'calc(var(--spacing-unit) * 2)',
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            color: COLORS.navy,
            fontWeight: 700,
            fontSize: 26,
            margin: 0,
          }}
        >
          CMMS Case Study
        </h2>
        {study.logo?.src ? (
          <LogoImage image={study.logo} fallbackHeight={36} alt={study.companyName} />
        ) : (
          <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, color: COLORS.navy }}>
            {study.companyName}
          </div>
        )}
      </div>

      <RichTextFieldWrapper tag="div" fieldValue={study.intro} />

      <blockquote
        style={{
          margin: 'calc(var(--spacing-unit) * 2) 0',
          padding: '16px 20px',
          backgroundColor: COLORS.orangeSoft,
          borderLeft: `4px solid ${COLORS.orange}`,
          borderRadius: 6,
          color: COLORS.navy,
          fontStyle: 'italic',
        }}
      >
        <RichTextFieldWrapper tag="div" fieldValue={study.quoteText} />
        <div style={{ marginTop: 8, fontWeight: 600, fontStyle: 'normal' }}>
          {study.attribution}
        </div>
      </blockquote>

      <h4
        style={{
          fontFamily: FONT_HEADING,
          color: COLORS.orange,
          textTransform: 'uppercase',
          fontSize: 14,
          letterSpacing: 0.5,
          margin: '20px 0 8px 0',
        }}
      >
        {study.challengeLabel}
      </h4>
      <BulletList items={splitLines(study.challengePoints)} />

      <h4
        style={{
          fontFamily: FONT_HEADING,
          color: COLORS.orange,
          textTransform: 'uppercase',
          fontSize: 14,
          letterSpacing: 0.5,
          margin: '20px 0 8px 0',
        }}
      >
        {study.solutionLabel}
      </h4>
      <RichTextFieldWrapper tag="div" fieldValue={study.solutionIntro} />
      <BulletList items={splitLines(study.solutionPoints)} />

      <h4
        style={{
          fontFamily: FONT_HEADING,
          color: COLORS.orange,
          textTransform: 'uppercase',
          fontSize: 14,
          letterSpacing: 0.5,
          margin: '20px 0 8px 0',
        }}
      >
        {study.resultsLabel}
      </h4>
      <BulletList items={splitLines(study.resultsPoints)} />

      <ExtraBlocks blocks={study.extraBlocks} />
    </div>
  );
}

export function Component({ fieldValues }: { fieldValues: FieldValues }) {
  const studies = fieldValues.caseStudies || [];

  return (
    <div
      style={{
        fontFamily: FONT_BODY,
        color: COLORS.body,
        backgroundColor: COLORS.paper,
        lineHeight: 1.6,
      }}
    >
      {studies.map((study, index) => (
        <CaseStudyCard key={`${study.companyName}-${index}`} study={study} isFirst={index === 0} />
      ))}
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <TextField name="heading" label="Section heading" default="Customer Success Stories" />
    <RepeatedFieldGroup
      name="caseStudies"
      label="Case studies"
      occurrence={{ min: 1, default: 2 }}
      default={[
        {
          companyName: 'News Corp Australia',
          intro:
            '<p>News Corp Australia was running four stand-alone asset management systems for each major production facility, with no sharing or visibility between sites.</p>',
          quoteText:
            "<p>“MCGlobal Solutions’ cloud-based system gave us a national asset management system and the results have been outstanding. Not only has it delivered significant cost benefits, but it has also allowed us to standardise the way we manage our assets and processes across the country.”</p>",
          attribution: 'Stephen J. | National GM – Reliability & Asset Management',
          challengeLabel: 'The Challenge',
          challengePoints: [
            'Lower the annual cost',
            'Creating visibility between sites',
            'Improving the overall ease of use and system functionality.',
          ].join('\n'),
          solutionLabel: 'The Solution',
          solutionIntro:
            '<p>MCGlobal Solutions delivered all existing functionality at a significantly lower total cost. MRO, Service Requester and MC Express were implemented.</p>',
          solutionPoints: [
            'Single hosted system',
            'Visibility for management',
            'Common configuration & processes',
            'Staff support and training',
          ].join('\n'),
          resultsLabel: 'The Results',
          resultsPoints: [
            'Full visibility of all major and regional sites configured on a single MCGlobal Solutions database hosted in the Sydney Data Hub.',
            'Roll-out and delivery of a complete EAM solution that was on time and under budget.',
            'Supply, setup, configuration, training and roll-out of the system was a third of the cost to upgrade the existing.',
            "Implementation of a user-friendly interface without the need to install any additional software on the client’s computers.",
            'Standard reports and KPIs that are easily configurable, allowing for analysis of sites which was previously not possible.',
          ].join('\n'),
        },
        {
          companyName: 'Devro',
          intro:
            '<p>Devro is a leading global supplier in food manufacturing with sites in the US, Netherlands, UK, China, Czech Republic and Australia.</p>',
          quoteText:
            "<p>“We have found the perfect partner for our Global Maintenance Connection roll-out. The regional technical and implementation support has been first-class and the relationships formed with our Super User team are a critical foundation for sustainability and continued development towards a Best Practice Asset Management model.”</p>",
          attribution: 'H. Fitzpatrick | Supply Chain Project Manager, Devro',
          challengeLabel: 'The Challenge',
          challengePoints: [
            'A high volume of assets across the globe',
            'No formal asset management strategy',
            'Need to keep up with production schedules and customer demand',
            'Improving asset visibility between sites',
          ].join('\n'),
          solutionLabel: 'The Solution',
          solutionIntro:
            '<p>MCGlobal Solutions delivered all existing functionality at a significantly lower total cost. MRO, Service Requester and MC Express were implemented.</p>',
          solutionPoints: [
            'Single hosted system',
            'Visibility for management',
            'Common configuration & processes',
            'Staff support and training',
          ].join('\n'),
          resultsLabel: 'The Results',
          resultsPoints: [
            'Transparency into asset health across global plants.',
            'Improved asset hierarchy to understand maintenance needs.',
            'Preventive maintenance schedules that diminish downtime.',
            'Roll-out and delivery of a complete EAM solution that was on time and under budget.',
          ].join('\n'),
        },
      ]}
    >
      <ImageField name="logo" label="Client logo" default={{ src: '', alt: '' }} />
      <TextField name="companyName" label="Company name" default="" />
      <RichTextField
        name="intro"
        label="Intro paragraph"
        default=""
        enabledFeatures={[...richTextPersonalizationFeatures]}
      />
      <RichTextField
        name="quoteText"
        label="Testimonial quote"
        default=""
        enabledFeatures={[...richTextPersonalizationFeatures]}
      />
      <TextField name="attribution" label="Quote attribution" default="" />
      <TextField name="challengeLabel" label="Challenge label" default="The Challenge" />
      <TextField name="challengePoints" label="Challenge points" allowNewLine default="" />
      <TextField name="solutionLabel" label="Solution label" default="The Solution" />
      <RichTextField
        name="solutionIntro"
        label="Solution intro"
        default=""
        enabledFeatures={[...richTextPersonalizationFeatures]}
      />
      <TextField name="solutionPoints" label="Solution points" allowNewLine default="" />
      <TextField name="resultsLabel" label="Results label" default="The Results" />
      <TextField name="resultsPoints" label="Results points" allowNewLine default="" />
      <ExtraContentBlocksField label="Additional content blocks for this case study" />
    </RepeatedFieldGroup>
  </ModuleFields>
);

export const meta = {
  label: 'MCGS - Case Studies',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set hublData = {} %}
`;
