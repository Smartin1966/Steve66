import { ModuleFields, TextField, FontField } from '@hubspot/cms-components/fields';
import type { QuoteTemplateContext } from '@hubspot/quote-dev-sdk';
import {
  COLORS,
  FONT_HEADING,
  FONT_BODY,
  A4_PAGE,
  formatCrmDate,
  personalize,
  fontValueToStyle,
  FontValue,
} from '../../theme';
import { LogoField, LogoFallbackTextField, BannerImageField, HeroPhotoBanner } from '../../propShared';
import { ExtraBlock, ExtraBlocks, ExtraContentBlocksField } from '../../sharedFields';

interface FieldValues {
  logo?: { src?: string; alt?: string };
  logoFallbackText?: string;
  heroImage?: { src?: string; alt?: string };
  title: string;
  titleFont?: FontValue;
  tagline: string;
  taglineHighlight: string;
  taglineFont?: FontValue;
  companyNameLabel: string;
  companyNameFont?: FontValue;
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

  const titleStyle = fontValueToStyle(fieldValues.titleFont, FONT_HEADING);
  const taglineStyle = fontValueToStyle(fieldValues.taglineFont, FONT_HEADING);
  const companyNameStyle = fontValueToStyle(fieldValues.companyNameFont, FONT_HEADING);

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
        logoFallbackText={fieldValues.logoFallbackText}
        title={fieldValues.title}
        height={680}
        contentAlign="top"
        fillAvailable
        curvedBottom={false}
        titleStyle={titleStyle}
      />

      <div
        style={{
          backgroundColor: COLORS.navy,
          textAlign: 'center',
          padding: 'calc(var(--spacing-unit) * 2)',
          ...taglineStyle,
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
            marginBottom: 'calc(var(--spacing-unit) * 3)',
            ...companyNameStyle,
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
    <LogoFallbackTextField />
    <BannerImageField name="heroImage" label="Hero photo" />
    <TextField name="title" label="Title" default="Solution Proposal" />
    <FontField
      name="titleFont"
      label="Title font"
      loadExternalFonts
      default={{
        font: 'Poppins',
        font_set: 'GOOGLE',
        fallback: FONT_HEADING,
        size: 40,
        size_unit: 'px',
        color: '#ffffff',
        styles: { bold: true },
        casing: 'uppercase',
      }}
    />
    <TextField
      name="tagline"
      label="Tagline"
      helpText="Use the field below to choose which word gets the orange highlight."
      default="The Solution That Delivers"
    />
    <TextField name="taglineHighlight" label="Tagline highlighted word" default="Delivers" />
    <FontField
      name="taglineFont"
      label="Tagline font"
      loadExternalFonts
      default={{
        font: 'Poppins',
        font_set: 'GOOGLE',
        fallback: FONT_HEADING,
        size: 20,
        size_unit: 'px',
        color: '#ffffff',
        styles: { bold: true },
        casing: 'uppercase',
      }}
    />
    <TextField
      name="companyNameLabel"
      label="Purchasing company name"
      helpText="Personalize with {{company}}, or type a name directly. Falls back to the quote's buyer company automatically."
      default="{{company}}"
    />
    <FontField
      name="companyNameFont"
      label="Purchasing company name font"
      loadExternalFonts
      default={{
        font: 'Poppins',
        font_set: 'GOOGLE',
        fallback: FONT_HEADING,
        size: 22,
        size_unit: 'px',
        color: COLORS.navy,
        styles: { bold: true },
        casing: 'uppercase',
      }}
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
