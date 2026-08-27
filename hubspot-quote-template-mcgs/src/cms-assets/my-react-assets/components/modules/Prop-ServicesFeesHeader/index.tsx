// Compact header block for the Services Fees pages. Deliberately NOT an
// A4_PAGE section: it sits directly above HubSpot's native Line Items
// module (variable height, driven by the deal's real line items), so it
// flows naturally instead of forcing its own page.
import { ModuleFields, TextField } from '@hubspot/cms-components/fields';
import { COLORS, FONT_HEADING, FONT_BODY } from '../../theme';
import { LogoField, HeaderBannerImageField, WedgeTopBanner } from '../../propShared';

interface FieldValues {
  logo?: { src?: string; alt?: string };
  headerBannerImage?: { src?: string; alt?: string };
  title: string;
}

export function Component({ fieldValues }: { fieldValues: FieldValues }) {
  return (
    <div style={{ fontFamily: FONT_BODY, color: COLORS.body, backgroundColor: COLORS.paper }}>
      <WedgeTopBanner logo={fieldValues.logo} bannerImage={fieldValues.headerBannerImage} />
      <h2
        style={{
          fontFamily: FONT_HEADING,
          color: COLORS.navy,
          fontWeight: 700,
          fontSize: 30,
          margin: 0,
          padding: 'calc(var(--spacing-unit) * 4) calc(var(--spacing-unit) * 5) calc(var(--spacing-unit) * 2)',
        }}
      >
        {fieldValues.title}
      </h2>
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <LogoField />
    <HeaderBannerImageField />
    <TextField name="title" label="Title" default="Services Fees" />
  </ModuleFields>
);

export const meta = {
  label: 'Prop- Services Fees Header',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set hublData = {} %}
`;
