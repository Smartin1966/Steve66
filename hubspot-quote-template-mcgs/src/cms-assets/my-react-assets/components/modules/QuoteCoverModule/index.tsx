import {
  ModuleFields,
  TextField,
  ImageField,
} from '@hubspot/cms-components/fields';
import type { QuoteTemplateContext } from '@hubspot/quote-dev-sdk';
import { COLORS, FONT_HEADING, FONT_BODY, A4_PAGE, formatCrmDate } from '../../theme';

interface FieldValues {
  logo?: { src?: string; alt?: string };
  heroImage?: { src?: string; alt?: string };
  eyebrow: string;
  title: string;
}

interface HublData {
  buyerCompanyName?: string;
  dealName?: string;
  senderFirstName?: string;
  senderLastName?: string;
  publishedDate?: QuoteTemplateContext['quote']['hs_last_published_date'];
  isQuoteBlueprint: boolean;
}

interface Props {
  fieldValues: FieldValues;
  hublData: HublData;
}

export function Component({ fieldValues, hublData }: Props) {
  const { isQuoteBlueprint } = hublData;

  const companyName = isQuoteBlueprint
    ? 'Acme Corp'
    : hublData.buyerCompanyName || hublData.dealName || 'Your Company';

  const senderName = isQuoteBlueprint
    ? 'Steve Martin'
    : [hublData.senderFirstName, hublData.senderLastName]
        .filter(Boolean)
        .join(' ') || 'Steve Martin';

  const publishedLabel = isQuoteBlueprint
    ? '4 March 2026'
    : formatCrmDate(hublData.publishedDate) || 'Not yet submitted';

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
      <div
        style={{
          padding: 'calc(var(--spacing-unit) * 4) calc(var(--spacing-unit) * 5) 0',
        }}
      >
        {fieldValues.logo?.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fieldValues.logo.src}
            alt={fieldValues.logo.alt || 'Company logo'}
            style={{ height: 44, display: 'block' }}
          />
        ) : (
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 1,
              color: COLORS.navy,
            }}
          >
            <span style={{ color: COLORS.orange }}>MC</span>GLOBAL SOLUTIONS
          </div>
        )}
      </div>

      <div
        style={{
          margin: 'calc(var(--spacing-unit) * 3) calc(var(--spacing-unit) * 5) 0',
          borderRadius: 18,
          overflow: 'hidden',
          minHeight: 260,
          backgroundColor: COLORS.navy,
          backgroundImage: fieldValues.heroImage?.src
            ? `linear-gradient(180deg, rgba(24,44,66,0.15), rgba(24,44,66,0.65)), url(${fieldValues.heroImage.src})`
            : `linear-gradient(135deg, ${COLORS.navy} 0%, #23374f 60%, ${COLORS.orange} 140%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: `6px solid ${COLORS.orange}`,
        }}
        aria-hidden={fieldValues.heroImage?.src ? undefined : true}
      />

      <div
        style={{
          padding:
            'calc(var(--spacing-unit) * 4) calc(var(--spacing-unit) * 5) calc(var(--spacing-unit) * 5)',
        }}
      >
        {fieldValues.eyebrow ? (
          <div
            style={{
              fontFamily: FONT_HEADING,
              color: COLORS.orange,
              fontWeight: 600,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            {fieldValues.eyebrow}
          </div>
        ) : null}

        <h1
          style={{
            fontFamily: FONT_HEADING,
            color: COLORS.navy,
            fontWeight: 700,
            fontSize: 38,
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          {fieldValues.title}
        </h1>

        <div
          style={{
            fontFamily: FONT_HEADING,
            color: COLORS.orange,
            fontWeight: 700,
            fontSize: 22,
            marginTop: 18,
          }}
        >
          {companyName}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 'calc(var(--spacing-unit) * 6)',
            marginTop: 'calc(var(--spacing-unit) * 5)',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                color: COLORS.orange,
                fontWeight: 600,
                fontSize: 13,
                marginBottom: 4,
              }}
            >
              Date submitted
            </div>
            <div style={{ fontSize: 15 }}>{publishedLabel}</div>
          </div>
          <div>
            <div
              style={{
                color: COLORS.orange,
                fontWeight: 600,
                fontSize: 13,
                marginBottom: 4,
              }}
            >
              Submitted by
            </div>
            <div style={{ fontSize: 15 }}>{senderName}</div>
          </div>
        </div>
      </div>

      <div style={{ height: 6, backgroundColor: COLORS.orange, marginTop: 'auto' }} />
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <ImageField name="logo" label="Company logo" helpText="Upload your logo to the HubSpot file manager first, then select it here." />
    <ImageField
      name="heroImage"
      label="Hero / banner image"
      helpText="Optional. If left blank a navy-to-orange gradient is used instead."
    />
    <TextField name="eyebrow" label="Eyebrow label" default="Proposal" />
    <TextField
      name="title"
      label="Proposal title"
      default="Enterprise Asset Management System Proposal"
    />
  </ModuleFields>
);

export const meta = {
  label: 'MCGS - Cover Page',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set hublData = {
    "buyerCompanyName": quoteTemplateContext.buyerCompany.name,
    "dealName": quoteTemplateContext.deal.dealname,
    "senderFirstName": quoteTemplateContext.quote.hs_sender_firstname,
    "senderLastName": quoteTemplateContext.quote.hs_sender_lastname,
    "publishedDate": quoteTemplateContext.quote.hs_last_published_date,
    "isQuoteBlueprint": isQuoteBlueprint
  } %}
`;
