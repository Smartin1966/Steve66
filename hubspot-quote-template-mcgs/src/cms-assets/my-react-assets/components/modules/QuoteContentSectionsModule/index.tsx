import {
  ModuleFields,
  TextField,
  RichTextField,
  RepeatedFieldGroup,
} from '@hubspot/cms-components/fields';
import { RichTextFieldWrapper } from '@hubspot/cms-components';
import { COLORS, FONT_HEADING, FONT_BODY } from '../../theme';

interface SectionItem {
  heading: string;
  description: string;
}

interface FieldValues {
  title: string;
  subtitle?: string;
  items: SectionItem[];
}

interface HublData {
  buyerCompanyName?: string;
  dealName?: string;
  isQuoteBlueprint: boolean;
}

interface Props {
  fieldValues: FieldValues;
  hublData: HublData;
}

export function Component({ fieldValues, hublData }: Props) {
  const companyName = hublData.isQuoteBlueprint
    ? 'Acme Corp'
    : hublData.buyerCompanyName || hublData.dealName || 'your company';

  const subtitle = fieldValues.subtitle?.replace('{{company}}', companyName);

  return (
    <div
      style={{
        fontFamily: FONT_BODY,
        color: COLORS.body,
        backgroundColor: COLORS.paper,
        padding: 'calc(var(--spacing-unit) * 4) calc(var(--spacing-unit) * 5)',
        lineHeight: 1.6,
      }}
    >
      <h2
        style={{
          fontFamily: FONT_HEADING,
          color: COLORS.navy,
          fontWeight: 700,
          fontSize: 30,
          margin: 0,
        }}
      >
        {fieldValues.title}
      </h2>

      {subtitle ? (
        <p style={{ color: COLORS.muted, marginTop: 8, fontWeight: 600 }}>
          {subtitle}
        </p>
      ) : null}

      <div style={{ marginTop: 'calc(var(--spacing-unit) * 3)' }}>
        {(fieldValues.items || []).map((item, index) => (
          <div
            key={`${item.heading}-${index}`}
            style={{ marginBottom: 'calc(var(--spacing-unit) * 3)' }}
          >
            <h3
              style={{
                fontFamily: FONT_HEADING,
                color: COLORS.orange,
                fontWeight: 700,
                fontSize: 18,
                margin: '0 0 8px 0',
              }}
            >
              {item.heading}
            </h3>
            <RichTextFieldWrapper tag="div" fieldValue={item.description} />
          </div>
        ))}
      </div>
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <TextField name="title" label="Section title" default="Project Scope" />
    <TextField
      name="subtitle"
      label="Section subtitle"
      helpText="Use {{company}} anywhere in this text to insert the buyer's company name automatically."
      default="Proposal for {{company}}'s Enterprise Asset Management Solution"
    />
    <RepeatedFieldGroup
      name="items"
      label="Sections"
      occurrence={{ min: 1, default: 5 }}
      default={[
        {
          heading: 'Expert Review',
          description: '<p>Our consultants will conduct a thorough assessment of your current asset and maintenance management practices. This review identifies specific business requirements and areas for improvement, ensuring the solution is precisely aligned with your operational needs.</p>',
        },
        {
          heading: 'Strategic Planning',
          description: '<p>We will design a customized implementation plan tailored to your unique environment. This may include reconfiguring, streamlining, or enhancing current processes to ensure maximum system efficiency and business value.</p>',
        },
        {
          heading: 'Professional Implementation',
          description: "<p>Our team will manage a systematic, phased rollout of the solution, customized to your organization's priorities and pace. We follow a standardized methodology to ensure consistency, reliability, and successful adoption.</p>",
        },
        {
          heading: 'Tailored Training',
          description: '<p>We provide role-specific training to empower your staff with the knowledge and skills needed to confidently use and maintain the system. These customized sessions, supported by user-friendly materials, will maximize your return on investment and ensure long-term success.</p>',
        },
        {
          heading: 'Personalized Support Services',
          description: '<p>An MCGlobal Solutions support representative will collaborate with your system administrator and key users to resolve issues efficiently and recommend best practices. Our ongoing technical support ensures your system remains optimized in line with evolving technologies and industry standards.</p>',
        },
      ]}
    >
      <TextField name="heading" label="Heading" default="" />
      <RichTextField name="description" label="Body" default="" />
    </RepeatedFieldGroup>
  </ModuleFields>
);

export const meta = {
  label: 'MCGS - Content Sections',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set hublData = {
    "buyerCompanyName": quoteTemplateContext.buyerCompany.name,
    "dealName": quoteTemplateContext.deal.dealname,
    "isQuoteBlueprint": isQuoteBlueprint
  } %}
`;
