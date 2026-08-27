import {
  ModuleFields,
  TextField,
  RichTextField,
  RepeatedFieldGroup,
  ImageField,
} from '@hubspot/cms-components/fields';
import { RichTextFieldWrapper } from '@hubspot/cms-components';
import { COLORS, FONT_HEADING, FONT_BODY, A4_PAGE, richTextPersonalizationFeatures, splitLines } from '../../theme';
import { LogoField, WedgeTopBanner } from '../../propShared';
import { ExtraBlock, ExtraBlocks, ExtraContentBlocksField } from '../../sharedFields';

interface CaseStudy {
  photo?: { src?: string; alt?: string };
  quoteText?: string;
  companyName: string;
  industry: string;
  challengeLabel: string;
  challengeText: string;
  solutionLabel: string;
  solutionText: string;
  outcomesLabel: string;
  outcomes: string;
  extraBlocks?: ExtraBlock[];
}

interface FieldValues {
  logo?: { src?: string; alt?: string };
  heading: string;
  caseStudies: CaseStudy[];
}

function CaseStudyRow({ study }: { study: CaseStudy }) {
  const outcomes = splitLines(study.outcomes);
  return (
    <div style={{ display: 'flex', gap: 'calc(var(--spacing-unit) * 2)', marginBottom: 'calc(var(--spacing-unit) * 3)' }}>
      <div style={{ width: '38%', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            position: 'relative',
            borderRadius: 8,
            overflow: 'hidden',
            minHeight: 150,
            flex: 1,
            backgroundColor: COLORS.panel,
            backgroundImage: study.photo?.src
              ? `url(${study.photo.src})`
              : `linear-gradient(135deg, ${COLORS.navy} 0%, #23374f 60%, ${COLORS.orange} 150%)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {study.quoteText ? (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                padding: '10px 14px',
                color: '#ffffff',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: 12.5,
                textAlign: 'center',
                textShadow: study.photo?.src ? '0 1px 4px rgba(0,0,0,0.7)' : undefined,
              }}
            >
              &ldquo;{study.quoteText}&rdquo;
            </div>
          ) : null}
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 12, color: COLORS.muted }}>Customer Case Study:</div>
          <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, color: COLORS.orange, fontSize: 16 }}>
            {study.companyName}
          </div>
          <div style={{ fontStyle: 'italic', fontSize: 12.5, color: COLORS.muted }}>{study.industry}</div>
        </div>
      </div>

      <div style={{ width: '62%' }}>
        <h4
          style={{
            fontFamily: FONT_HEADING,
            color: COLORS.orange,
            fontWeight: 700,
            fontSize: 13,
            margin: '0 0 4px 0',
          }}
        >
          {study.challengeLabel}
        </h4>
        <div style={{ fontSize: 12.5 }}>
          <RichTextFieldWrapper tag="div" fieldValue={study.challengeText} />
        </div>

        <h4
          style={{
            fontFamily: FONT_HEADING,
            color: COLORS.orange,
            fontWeight: 700,
            fontSize: 13,
            margin: '10px 0 4px 0',
          }}
        >
          {study.solutionLabel}
        </h4>
        <div style={{ fontSize: 12.5 }}>
          <RichTextFieldWrapper tag="div" fieldValue={study.solutionText} />
        </div>

        {outcomes.length ? (
          <>
            <h4
              style={{
                fontFamily: FONT_HEADING,
                color: COLORS.orange,
                fontWeight: 700,
                fontSize: 13,
                margin: '10px 0 4px 0',
              }}
            >
              {study.outcomesLabel}
            </h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 12.5 }}>
              {outcomes.map((item, index) => (
                <li key={index} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                  <span style={{ color: COLORS.orange, fontWeight: 700 }}>&#10003;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <ExtraBlocks blocks={study.extraBlocks} />
      </div>
    </div>
  );
}

export function Component({ fieldValues }: { fieldValues: FieldValues }) {
  const studies = fieldValues.caseStudies || [];
  const chunks: CaseStudy[][] = [];
  for (let i = 0; i < studies.length; i += 2) {
    chunks.push(studies.slice(i, i + 2));
  }

  return (
    <div style={{ fontFamily: FONT_BODY, color: COLORS.body, backgroundColor: COLORS.paper }}>
      {chunks.map((chunk, chunkIndex) => (
        <div
          key={chunkIndex}
          style={{
            ...A4_PAGE,
            display: 'flex',
            flexDirection: 'column',
            pageBreakBefore: chunkIndex === 0 ? 'auto' : 'always',
            breakBefore: chunkIndex === 0 ? 'auto' : 'page',
          }}
        >
          <WedgeTopBanner logo={fieldValues.logo} />
          <div style={{ padding: 'calc(var(--spacing-unit) * 4) calc(var(--spacing-unit) * 5)', lineHeight: 1.5 }}>
            <h2
              style={{
                fontFamily: FONT_HEADING,
                color: COLORS.navy,
                fontWeight: 700,
                fontSize: 26,
                margin: '0 0 calc(var(--spacing-unit) * 2.5) 0',
              }}
            >
              {fieldValues.heading}
            </h2>
            {chunk.map((study, studyIndex) => (
              <CaseStudyRow key={`${study.companyName}-${studyIndex}`} study={study} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <LogoField />
    <TextField name="heading" label="Section heading" default="Customer Case Studies" />
    <RepeatedFieldGroup
      name="caseStudies"
      label="Case studies (rendered two per page)"
      occurrence={{ min: 1, default: 4 }}
      default={[
        {
          companyName: 'Voyages Indigenous Tourism',
          industry: 'Hospitality',
          quoteText: 'The perfect package for our diverse property portfolio.',
          challengeLabel: 'The Challenge',
          challengeText:
            '<p>Multiple previous CMMS implementations had failed. Voyages needed a solution that worked for a high-turnover hospitality workforce, met statutory compliance requirements, and gave head office national visibility, all at once.</p>',
          solutionLabel: 'The Solution',
          solutionText:
            '<p>MCGlobal took the time to understand Voyages needs and implemented a single hosted CMMS across all Australian resorts, to fit their specific requirements. Designed for minimal training, staff could raise maintenance requests from day one. Compliance workflows were embedded from the outset.</p>',
          outcomesLabel: 'Key Outcomes:',
          outcomes: [
            'Succeeded where multiple previous implementations failed',
            'National visibility across all resorts from one platform',
            'Minimal training required, built for staff turnover',
            'Statutory compliance met consistently across portfolio',
          ].join('\n'),
        },
        {
          companyName: 'News Corp Australia',
          industry: 'Manufacturing',
          quoteText: 'MCGlobal Solutions continues to exceed our expectations.',
          challengeLabel: 'The Challenge',
          challengeText:
            "<p>News Corp was operating out of four separate CMMS platforms, running across major production facilities, with no shared data and no cross-site visibility. They were facing a contract renewal, with expensive upgrades that still wouldn't solve the core problems.</p>",
          solutionLabel: 'The Solution',
          solutionText:
            "<p>MCGlobal consolidated four systems into one hosted CMMS in News Corp's Sydney Data Hub. MCGlobal trained News Corp's internal team to manage the rollout themselves, delivering further cost savings beyond implementation.</p>",
          outcomesLabel: 'Key Outcomes:',
          outcomes: [
            'Cost of implementation was 1/3 of incumbent upgrade price',
            'Full national visibility on a single hosted platform',
            'Delivered on time and under budget',
            'News Corp team self-managing rollout to regional sites',
          ].join('\n'),
        },
        {
          companyName: 'Devro',
          industry: 'Food Manufacturing',
          quoteText: 'In MCGlobal Solutions, we have found the perfect partner.',
          challengeLabel: 'The Challenge',
          challengeText:
            '<p>High asset volumes across six global manufacturing sites with no formal maintenance strategy. Inconsistent practices, poor cross-site visibility, and growing production pressure across US, UK, Netherlands, China, Czech Republic & Australia.</p>',
          solutionLabel: 'The Solution',
          solutionText:
            '<p>MCGlobal implemented a single hosted CMMS across all six sites with local language translation per region. Central training in Scotland for global managers, then local rollout supported by MCGlobal throughout.</p>',
          outcomesLabel: 'Key Outcomes:',
          outcomes: [
            'Full asset visibility across all global plants',
            'Standardised processes & training across 6 countries',
            'Preventive maintenance reducing unplanned downtime',
            'Local language configuration per region',
          ].join('\n'),
        },
        {
          companyName: 'BEP | Bunde-Etzel Pipeline',
          industry: 'Natural Gas Pipeline',
          quoteText: '',
          challengeLabel: 'The Challenge',
          challengeText:
            '<p>Critical European gas infrastructure needed a flexible, user-friendly CMMS covering full maintenance and procurement, without forcing BEP to change its processes. Third-party integration with aviation software was also required.</p>',
          solutionLabel: 'The Solution',
          solutionText:
            '<p>MCGlobal implemented a fully configured CMMS alongside BEP\'s own engineers, covering asset management, preventive maintenance, work orders, procurement, stock control, and a Web API integration with aviation software for automated GIS data flow.</p>',
          outcomesLabel: 'Key Outcomes:',
          outcomes: [
            'Full CMMS covering all maintenance & procurement needs',
            'GIS & pipeline data integrated via automated API',
            'Built to scale seamlessly to additional sites',
          ].join('\n'),
        },
      ]}
    >
      <ImageField name="photo" label="Photo" />
      <TextField name="quoteText" label="Quote overlaid on photo (optional)" default="" allowNewLine />
      <TextField name="companyName" label="Company name" default="" />
      <TextField name="industry" label="Industry" default="" />
      <TextField name="challengeLabel" label="Challenge label" default="The Challenge" />
      <RichTextField
        name="challengeText"
        label="Challenge text"
        default=""
        enabledFeatures={[...richTextPersonalizationFeatures]}
      />
      <TextField name="solutionLabel" label="Solution label" default="The Solution" />
      <RichTextField
        name="solutionText"
        label="Solution text"
        default=""
        enabledFeatures={[...richTextPersonalizationFeatures]}
      />
      <TextField name="outcomesLabel" label="Outcomes label" default="Key Outcomes:" />
      <TextField name="outcomes" label="Key outcomes" allowNewLine helpText="One outcome per line." default="" />
      <ExtraContentBlocksField label="Additional content blocks for this case study" />
    </RepeatedFieldGroup>
  </ModuleFields>
);

export const meta = {
  label: 'Prop- Case Studies',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set hublData = {} %}
`;
