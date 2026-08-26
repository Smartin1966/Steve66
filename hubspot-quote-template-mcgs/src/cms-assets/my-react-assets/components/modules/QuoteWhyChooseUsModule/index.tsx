import {
  ModuleFields,
  TextField,
  RichTextField,
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
  splitLines,
} from '../../theme';

interface FieldValues {
  heading: string;
  intro: string;
  clientsHeading: string;
  clients: string;
  bannerImage?: { src?: string; alt?: string };
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
  const clients = splitLines(fieldValues.clients);
  const midpoint = Math.ceil(clients.length / 2);
  const columns = [clients.slice(0, midpoint), clients.slice(midpoint)];
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
      <h2
        style={{
          fontFamily: FONT_HEADING,
          color: COLORS.navy,
          fontWeight: 700,
          fontSize: 28,
          margin: '0 0 calc(var(--spacing-unit) * 2) 0',
        }}
      >
        {heading}
      </h2>

      <RichTextFieldWrapper tag="div" fieldValue={fieldValues.intro} />

      {fieldValues.bannerImage?.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fieldValues.bannerImage.src}
          alt={fieldValues.bannerImage.alt || ''}
          style={{
            width: '100%',
            maxHeight: 180,
            objectFit: 'cover',
            borderRadius: 12,
            margin: 'calc(var(--spacing-unit) * 3) 0',
            display: 'block',
          }}
        />
      ) : null}

      {clients.length ? (
        <div style={{ marginTop: 'calc(var(--spacing-unit) * 3)' }}>
          <div
            style={{
              fontFamily: FONT_HEADING,
              color: COLORS.navy,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            {fieldValues.clientsHeading}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(180px, 1fr))',
              gap: '4px 32px',
            }}
          >
            {columns.map((column, columnIndex) => (
              <ul
                key={columnIndex}
                style={{ margin: 0, paddingLeft: 20, listStyle: 'disc' }}
              >
                {column.map((client, index) => (
                  <li key={index} style={{ marginBottom: 6 }}>
                    {client}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <TextField
      name="heading"
      label="Heading"
      helpText="Personalize with {{company}}."
      default="Why Choose MCGlobal Solutions?"
    />
    <RichTextField
      name="intro"
      label="Body"
      default={`<p>At MCGlobal Solutions, we specialize in delivering straightforward, effective, and user-focused solutions. Our goal is to make asset management intuitive&mdash;empowering users to efficiently oversee every aspect of their operations, enhance performance, and drive productivity.</p>
<p>Our strength lies in the ability to track, analyze, and manage critical data&mdash;providing operational benefits to organizations across a wide range of industries and scales.</p>
<p>We achieve this by actively listening to our clients, gaining a deep understanding of their business needs, and applying our extensive industry expertise to develop solutions that support and accelerate their goals.</p>
<p>MCGlobal Solutions currently partners with clients in 12 countries around the world, including the United States, Germany, the United Kingdom, Portugal, China, Australia, and New Zealand.</p>`}
      enabledFeatures={[...richTextPersonalizationFeatures]}
    />
    <ImageField
      name="bannerImage"
      label="Banner image"
      helpText="Optional decorative image shown below the intro text."
    />
    <TextField
      name="clientsHeading"
      label="Clients heading"
      default="MCGlobal Solutions clients include:"
    />
    <TextField
      name="clients"
      label="Clients"
      allowNewLine
      helpText="One client name per line."
      default={[
        'News Corp Australia',
        'Sanitarium',
        'Woodside Energy',
        'Devro',
        'Falls Creek Resorts',
        'Sunshine Coast Airport',
        'Fisher & Paykel Healthcare',
        'Siemens Healthineers',
        'BaptistCare',
        'Scentre Group',
        'Lavazza',
        'Farmers (NZ)',
        'AIRBUS',
        'Churchill',
        'Port Authority NSW',
        'Woolham Construction',
        'Tassal',
        'Slater+Gordon Lawyers',
      ].join('\n')}
    />
  </ModuleFields>
);

export const meta = {
  label: 'MCGS - Why Choose Us',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set hublData = {
    "buyerCompanyName": quoteTemplateContext.buyerCompany.name,
    "dealName": quoteTemplateContext.deal.dealname,
    "isQuoteBlueprint": isQuoteBlueprint
  } %}
`;
