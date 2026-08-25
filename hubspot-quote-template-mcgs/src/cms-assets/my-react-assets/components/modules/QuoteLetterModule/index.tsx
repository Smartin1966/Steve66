import {
  ModuleFields,
  TextField,
  RichTextField,
  ImageField,
} from '@hubspot/cms-components/fields';
import { RichTextFieldWrapper } from '@hubspot/cms-components';
import { COLORS, FONT_HEADING, FONT_BODY } from '../../theme';

interface FieldValues {
  eyebrow: string;
  body: string;
  signatureImage?: { src?: string; alt?: string };
  senderJobTitle?: string;
  websiteLabel?: string;
  footerLabel?: string;
}

interface HublData {
  contactFirstName?: string;
  senderFirstName?: string;
  senderLastName?: string;
  senderEmail?: string;
  isQuoteBlueprint: boolean;
}

interface Props {
  fieldValues: FieldValues;
  hublData: HublData;
}

export function Component({ fieldValues, hublData }: Props) {
  const { isQuoteBlueprint } = hublData;

  const contactFirstName = isQuoteBlueprint
    ? 'Jordan'
    : hublData.contactFirstName || '';

  const senderName = isQuoteBlueprint
    ? 'Steve Martin'
    : [hublData.senderFirstName, hublData.senderLastName]
        .filter(Boolean)
        .join(' ') || 'Steve Martin';

  const senderEmail = isQuoteBlueprint
    ? 'smartin@mcaus.com.au'
    : hublData.senderEmail || '';

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
          color: COLORS.orange,
          fontWeight: 700,
          fontSize: 26,
          margin: '0 0 calc(var(--spacing-unit) * 2) 0',
        }}
      >
        {fieldValues.eyebrow}
      </h2>

      <p style={{ margin: '0 0 calc(var(--spacing-unit) * 2) 0' }}>
        Dear {contactFirstName || 'valued customer'},
      </p>

      <RichTextFieldWrapper tag="div" fieldValue={fieldValues.body} />

      <p style={{ marginTop: 'calc(var(--spacing-unit) * 3)' }}>Sincerely,</p>

      {fieldValues.signatureImage?.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fieldValues.signatureImage.src}
          alt={fieldValues.signatureImage.alt || 'Signature'}
          style={{ height: 48, display: 'block', margin: '4px 0 12px' }}
        />
      ) : null}

      <p style={{ margin: 0, fontWeight: 600 }}>{senderName}</p>
      {fieldValues.senderJobTitle ? (
        <p style={{ margin: '2px 0 0 0', color: COLORS.muted }}>
          {fieldValues.senderJobTitle}
        </p>
      ) : null}

      <div
        style={{
          marginTop: 'calc(var(--spacing-unit) * 4)',
          paddingTop: 'calc(var(--spacing-unit) * 2)',
          borderTop: `1px solid ${COLORS.border}`,
          fontSize: 14,
          color: COLORS.navy,
        }}
      >
        <div style={{ fontFamily: FONT_HEADING, fontWeight: 700 }}>
          {senderName.toUpperCase()}
        </div>
        <div style={{ marginTop: 4 }}>
          {senderEmail}
          {senderEmail && fieldValues.websiteLabel ? ' | ' : ''}
          {fieldValues.websiteLabel}
        </div>
      </div>

      <div
        style={{
          marginTop: 'calc(var(--spacing-unit) * 4)',
          paddingTop: 'calc(var(--spacing-unit) * 2)',
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: `3px solid ${COLORS.orange}`,
          color: COLORS.muted,
          fontSize: 13,
        }}
      >
        <span>{fieldValues.footerLabel}</span>
      </div>
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <TextField name="eyebrow" label="Section heading" default="Overview" />
    <RichTextField
      name="body"
      label="Letter body"
      default={`<p>Thank you for the opportunity to present this proposal for implementing the Ultimo Enterprise Asset Management (EAM) system. At MCGlobal Solutions, we specialize in delivering cloud-based solutions that enable maintenance teams to seamlessly execute complex processes with efficiency and confidence.</p>
<p>Our proposed EAM platform offers a robust suite of capabilities, including long-term asset management, advanced dashboard reporting, Health, Safety &amp; Environment (HSE) features, and Permit to Work functionality. This integrated and scalable system is designed to streamline operations across your organization while providing an intuitive and user-friendly experience.</p>
<p>Maintenance personnel will have the flexibility to work both online and offline using smartphones or mobile tablets&mdash;enhancing productivity across the board.</p>
<p>Since 2007, MCGlobal Solutions has been recognized for our commitment to exceptional customer service and innovative, results-driven maintenance solutions. We look forward to partnering with you to deliver a powerful and future-ready asset management system.</p>
<p>I welcome the opportunity to discuss the next steps with you.</p>`}
    />
    <ImageField
      name="signatureImage"
      label="Signature image"
      helpText="Optional. A scanned or drawn signature graphic."
    />
    <TextField
      name="senderJobTitle"
      label="Sender job title"
      default="Founder &amp; Director"
    />
    <TextField
      name="websiteLabel"
      label="Website"
      default="www.mcgsol.com"
    />
    <TextField
      name="footerLabel"
      label="Footer label"
      default="MC Global Solutions"
    />
  </ModuleFields>
);

export const meta = {
  label: 'MCGS - Cover Letter',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set hublData = {
    "contactFirstName": quoteTemplateContext.buyerContacts[0].firstname if quoteTemplateContext.buyerContacts else null,
    "senderFirstName": quoteTemplateContext.quote.hs_sender_firstname,
    "senderLastName": quoteTemplateContext.quote.hs_sender_lastname,
    "senderEmail": quoteTemplateContext.quote.hs_sender_email,
    "isQuoteBlueprint": isQuoteBlueprint
  } %}
`;
