import { ModuleFields, TextField, RichTextField, ImageField } from '@hubspot/cms-components/fields';
import { RichTextFieldWrapper } from '@hubspot/cms-components';
import {
  COLORS,
  FONT_HEADING,
  FONT_BODY,
  A4_PAGE,
  richTextPersonalizationFeatures,
} from '../../theme';
import { LogoField, BannerImageField, HeroPhotoBanner, WedgeCornerFooter } from '../../propShared';
import { ExtraBlock, ExtraBlocks, ExtraContentBlocksField, LogoImage } from '../../sharedFields';

interface FieldValues {
  logo?: { src?: string; alt?: string };
  heroImage?: { src?: string; alt?: string };
  title: string;
  greetingPrefix: string;
  letterBody: string;
  signatureImage?: { src?: string; alt?: string };
  senderEmail?: string;
  extraBlocks?: ExtraBlock[];
}

interface HublData {
  buyerCompanyName?: string;
  dealName?: string;
  senderFirstName?: string;
  senderLastName?: string;
  senderEmail?: string;
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
    : hublData.buyerCompanyName || hublData.dealName || '{COMPANY NAME}';

  const senderName = isQuoteBlueprint
    ? 'Steve Martin'
    : [hublData.senderFirstName, hublData.senderLastName].filter(Boolean).join(' ') ||
      'Steve Martin';

  const senderEmail = isQuoteBlueprint
    ? 'smartin@mcgsol.com.au'
    : hublData.senderEmail || fieldValues.senderEmail || '';

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
      <HeroPhotoBanner image={fieldValues.heroImage} logo={fieldValues.logo} title={fieldValues.title} height={180} />

      <div style={{ padding: 'calc(var(--spacing-unit) * 4) calc(var(--spacing-unit) * 5)', lineHeight: 1.6, flex: 1 }}>
        <p style={{ margin: '0 0 calc(var(--spacing-unit) * 2) 0' }}>
          {fieldValues.greetingPrefix} {companyName},
        </p>

        <RichTextFieldWrapper tag="div" fieldValue={fieldValues.letterBody} />

        <p style={{ marginTop: 'calc(var(--spacing-unit) * 3)', marginBottom: 4 }}>Sincerely,</p>

        <p
          style={{
            fontFamily: FONT_HEADING,
            fontWeight: 700,
            fontStyle: 'italic',
            color: COLORS.navy,
            margin: '0 0 calc(var(--spacing-unit) * 1.5) 0',
          }}
        >
          {senderName.toUpperCase()}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 16, height: 16, border: `1.5px solid ${COLORS.navy}` }} />
          <div>
            {fieldValues.signatureImage?.src ? (
              <LogoImage image={fieldValues.signatureImage} fallbackHeight={34} alt="Signature" />
            ) : (
              <div style={{ fontStyle: 'italic', color: COLORS.muted, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 2 }}>
                Signature
              </div>
            )}
            <div style={{ fontSize: 13, color: COLORS.navy, marginTop: 2 }}>{senderName}</div>
          </div>
        </div>

        {senderEmail ? (
          <p style={{ marginTop: 'calc(var(--spacing-unit) * 2)' }}>
            <span style={{ color: COLORS.orange }}>| </span>
            {senderEmail}
          </p>
        ) : null}

        <ExtraBlocks blocks={fieldValues.extraBlocks} />
      </div>

      <WedgeCornerFooter />
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <LogoField />
    <BannerImageField name="heroImage" label="Header photo" />
    <TextField name="title" label="Header title" default="Solution Proposal" />
    <TextField name="greetingPrefix" label="Greeting prefix" default="Dear" />
    <RichTextField
      name="letterBody"
      label="Letter body"
      default={`<p>Thank you for the opportunity to present this proposal for implementing an MCGlobal solution.</p>
<p>At MCGlobal Solutions, we build maintenance management systems around the way your operation actually works, not the other way around.</p>
<p>Our consultants are people who've worked the floor as well as the software, with backgrounds spanning decades in maintenance and asset-intensive operations, bringing genuine industry experience to every engagement. That real-world grounding means we understand the pressures of your business before we open a spec sheet.</p>
<p>It shows in the way our clients stay with us. Our customer relationships average 12 years, built on advisory support that continues well past initial implementation.</p>
<p>We work across leading CMMS and EAM platforms, carefully selecting and configuring the right fit for your operation's scale, complexity and hierarchy, rather than fitting your business to a single product.</p>
<p>The result is a complete, tailored solution built for how your team actually operates, today and as you grow.</p>`}
      enabledFeatures={[...richTextPersonalizationFeatures]}
    />
    <ImageField name="signatureImage" label="Signature image" helpText="Optional. A scanned or drawn signature graphic." />
    <TextField name="senderEmail" label="Sender email (fallback)" helpText="Used only if the quote has no sender email set." default="smartin@mcgsol.com.au" />
    <ExtraContentBlocksField />
  </ModuleFields>
);

export const meta = {
  label: 'Prop- Cover Letter',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set hublData = {
    "buyerCompanyName": quoteTemplateContext.buyerCompany.name,
    "dealName": quoteTemplateContext.deal.dealname,
    "senderFirstName": quoteTemplateContext.quote.hs_sender_firstname,
    "senderLastName": quoteTemplateContext.quote.hs_sender_lastname,
    "senderEmail": quoteTemplateContext.quote.hs_sender_email,
    "isQuoteBlueprint": isQuoteBlueprint
  } %}
`;
