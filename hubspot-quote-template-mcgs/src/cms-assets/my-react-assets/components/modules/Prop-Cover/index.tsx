import { ModuleFields, TextField } from '@hubspot/cms-components/fields';
import type { QuoteTemplateContext } from '@hubspot/quote-dev-sdk';
import { COLORS, FONT_HEADING, FONT_BODY, A4_PAGE, formatCrmDate, personalize } from '../../theme';
import { LogoField, BannerImageField, HeroPhotoBanner } from '../../propShared';
import { ExtraBlock, ExtraBlocks, ExtraContentBlocksField } from '../../sharedFields';

interface FieldValues {
  logo?: { src?: string; alt?: string };
  heroImage?: { src?: string; alt?: string };
  title: string;
  tagline: string;
  taglineHighlight: string;
  companyNameLabel: string;
  extraBlocks?: ExtraBlock[];
}

interface HublData {
  buyerCompanyName?: string;
  dealName?: string;
  senderFirstName?: string;
  senderLastName?: string;
  publishedDate?: QuoteTemplateContext['quote']['hs_last_published_date'];
  isQuoteBlueprint: boolean;
}

export function Component({
  fieldValues,
  hublData,
}: {
  fieldValues: FieldValues;
  hublData: HublData;
}) {
  const { isQuoteBlueprint } = hublData;

  const companyName = isQuoteBlueprint
    ? 'Acme Corp'
    : hublData.buyerCompanyName || hublData.dealName || 'Purchasing Company Name';

  const senderName = isQuoteBlueprint
    ? 'Steve Martin'
    : [hublData.senderFirstName, hublData.senderLastName].filter(Boolean).join(' ') ||
      'Steve Martin';

  const publishedLabel = isQuoteBlueprint
    ? '4 March 2026'
    : formatCrmDate(hublData.publishedDate) || '00/00/0000';

  const tokens = { company: companyName };
  const companyNameLabel = personalize(fieldValues.companyNameLabel, tokens) || companyName;

  const tagline = fieldValues.tagline || '';
  const highlight = fieldValues.taglineHighlight || '';
  const highlightIndex = highlight ? tagline.toLowerCase().indexOf(highlight.toLowerCase()) : -1;

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
      <HeroPhotoBanner
        image={fieldValues.heroImage}
        logo={fieldValues.logo}
        title={fieldValues.title}
        height={680}
        contentAlign="top"
      />

      <div
        style={{
          backgroundColor: COLORS.navy,
          color: '#ffffff',
          textAlign: 'center',
          fontFamily: FONT_HEADING,
          fontWeight: 700,
          fontSize: 20,
          textTransform: 'uppercase',
          padding: 'calc(var(--spacing-unit) * 2)',
          marginTop: 'auto',
        }}
      >
        {highlightIndex >= 0 ? (
          <>
            {tagline.slice(0, highlightIndex)}
            <span style={{ color: COLORS.orange }}>
              {tagline.slice(highlightIndex, highlightIndex + highlight.length)}
            </span>
            {tagline.slice(highlightIndex + highlight.length)}
          </>
        ) : (
          tagline
        )}
      </div>

      <div
        style={{
          backgroundColor: COLORS.panel,
          textAlign: 'center',
          padding: 'calc(var(--spacing-unit) * 5) calc(var(--spacing-unit) * 4)',
        }}
      >
        <div
          style={{
            fontFamily: FONT_HEADING,
            fontWeight: 700,
            color: COLORS.navy,
            fontSize: 22,
            textTransform: 'uppercase',
            marginBottom: 'calc(var(--spacing-unit) * 3)',
          }}
        >
          {companyNameLabel}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'calc(var(--spacing-unit) * 6)',
          }}
        >
          <div>
            <div style={{ fontSize: 14 }}>Date submitted</div>
            <div style={{ color: COLORS.orange, fontWeight: 600, marginTop: 4 }}>
              {publishedLabel}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14 }}>Submitted by</div>
            <div style={{ color: COLORS.orange, fontWeight: 600, marginTop: 4 }}>
              {senderName}
            </div>
          </div>
        </div>

        <ExtraBlocks blocks={fieldValues.extraBlocks} />
      </div>
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <LogoField />
    <BannerImageField name="heroImage" label="Hero photo" />
    <TextField name="title" label="Title" default="Solution Proposal" />
    <TextField
      name="tagline"
      label="Tagline"
      helpText="Use the field below to choose which word gets the orange highlight."
      default="The Solution That Delivers"
    />
    <TextField name="taglineHighlight" label="Tagline highlighted word" default="Delivers" />
    <TextField
      name="companyNameLabel"
      label="Purchasing company name"
      helpText="Personalize with {{company}}, or type a name directly. Falls back to the quote's buyer company automatically."
      default="{{company}}"
    />
    <ExtraContentBlocksField />
  </ModuleFields>
);

export const meta = {
  label: 'Prop- Cover Page',
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
