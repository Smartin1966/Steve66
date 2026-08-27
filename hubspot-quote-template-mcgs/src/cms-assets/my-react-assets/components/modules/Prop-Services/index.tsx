import {
  ModuleFields,
  TextField,
  RichTextField,
  RepeatedFieldGroup,
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
import {
  LogoField,
  BannerImageField,
  HeaderBannerImageField,
  WedgeTopBanner,
  PhotoFooterBanner,
} from '../../propShared';
import { ExtraBlock, ExtraBlocks, ExtraContentBlocksField } from '../../sharedFields';

interface ServiceItem {
  heading: string;
  description: string;
}

interface FieldValues {
  logo?: { src?: string; alt?: string };
  headerBannerImage?: { src?: string; alt?: string };
  footerImage?: { src?: string; alt?: string };
  footerLabel: string;
  title: string;
  subtitle: string;
  items: ServiceItem[];
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
  const companyName = hublData.isQuoteBlueprint
    ? 'Acme Corp'
    : hublData.buyerCompanyName || hublData.dealName || 'your company';
  const subtitle = personalize(fieldValues.subtitle, { company: companyName });

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
      <WedgeTopBanner logo={fieldValues.logo} bannerImage={fieldValues.headerBannerImage} />

      <div style={{ padding: 'calc(var(--spacing-unit) * 4) calc(var(--spacing-unit) * 5)', lineHeight: 1.6 }}>
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
          <p style={{ color: COLORS.navy, fontWeight: 700, marginTop: 6 }}>{subtitle}</p>
        ) : null}

        <div style={{ marginTop: 'calc(var(--spacing-unit) * 3)' }}>
          {(fieldValues.items || []).map((item, index) => (
            <div key={`${item.heading}-${index}`} style={{ marginBottom: 'calc(var(--spacing-unit) * 2.5)' }}>
              <h3
                style={{
                  fontFamily: FONT_HEADING,
                  color: COLORS.orange,
                  fontWeight: 700,
                  fontSize: 17,
                  margin: '0 0 6px 0',
                }}
              >
                {item.heading}
              </h3>
              <RichTextFieldWrapper tag="div" fieldValue={item.description} />
            </div>
          ))}
        </div>

        <ExtraBlocks blocks={fieldValues.extraBlocks} />
      </div>

      <PhotoFooterBanner image={fieldValues.footerImage} label={fieldValues.footerLabel} />
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <LogoField />
    <HeaderBannerImageField />
    <TextField name="title" label="Title" default="Our Services" />
    <TextField
      name="subtitle"
      label="Subtitle"
      helpText="Personalize with {{company}}."
      default="Proposal of services for {{company}}"
    />
    <RepeatedFieldGroup
      name="items"
      label="Services"
      occurrence={{ min: 1, default: 5 }}
      default={[
        {
          heading: 'Consulting',
          description:
            '<p>Our experienced teams of maintenance and technical consultants are experts at mapping your requirements, relating equally well with administrators and maintenance staff on the ground to ensure a smooth implementation and a strong return on investment.</p>',
        },
        {
          heading: 'Implementation & Support',
          description:
            '<p>We collaborate with you at every stage, delivered professionally and on time. Every project is unique, so we use a multi-layered implementation strategy tailored to each customer, giving your organisation true ownership of the solution.</p>',
        },
        {
          heading: 'Integration',
          description:
            "<p>We're experts at integrating data from other systems with your CMMS/EAM platform. Whether it's a financial system, SCADA, ERP or GIS, we provide access to a modern RESTful API or build a custom solution to fit.</p>",
        },
        {
          heading: 'Tailored Training',
          description:
            '<p>We create customised education resources for your staff, covering data preparation, asset hierarchy, workflow design, work orders and preventative maintenance schedules, delivered via classroom, web-based or on-site sessions.</p>',
        },
        {
          heading: 'Personalized Support Services',
          description:
            '<p>An MCGlobal Solutions support representative will collaborate with your system administrator and key users to resolve issues efficiently and recommend best practices. Our ongoing technical support ensures your system remains optimized in line with evolving technologies and industry standards.</p>',
        },
      ]}
    >
      <TextField name="heading" label="Heading" default="" />
      <RichTextField
        name="description"
        label="Description"
        default=""
        enabledFeatures={[...richTextPersonalizationFeatures]}
      />
    </RepeatedFieldGroup>
    <BannerImageField name="footerImage" label="Footer photo" />
    <TextField name="footerLabel" label="Footer text" default="Solution Proposal" />
    <ExtraContentBlocksField />
  </ModuleFields>
);

export const meta = {
  label: 'Prop- Our Services',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set hublData = {
    "buyerCompanyName": quoteTemplateContext.buyerCompany.name,
    "dealName": quoteTemplateContext.deal.dealname,
    "isQuoteBlueprint": isQuoteBlueprint
  } %}
`;
