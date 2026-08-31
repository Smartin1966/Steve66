import { ModuleFields, TextField, RepeatedFieldGroup, ImageField } from '@hubspot/cms-components/fields';
import { COLORS, FONT_HEADING, FONT_BODY, A4_PAGE } from '../../theme';
import {
  LogoField,
  LogoFallbackTextField,
  BannerImageField,
  HeaderBannerImageField,
  WedgeTopBanner,
  PhotoFooterBanner,
} from '../../propShared';
import { ExtraBlock, ExtraBlocks, ExtraContentBlocksField, LogoImage } from '../../sharedFields';

interface ClientEntry {
  logo?: { src?: string; alt?: string; width?: number; height?: number };
  clientName: string;
}

interface FieldValues {
  logo?: { src?: string; alt?: string };
  logoFallbackText?: string;
  headerBannerImage?: { src?: string; alt?: string };
  footerImage?: { src?: string; alt?: string };
  footerLabel: string;
  heading: string;
  clients: ClientEntry[];
  extraBlocks?: ExtraBlock[];
}

const CLIENT_NAMES = [
  'A-GAS', 'AAH', 'AIRBUS', 'BAND-IT', 'BaptistCare',
  'BASF', 'Cambridge Assessment', 'Central Petroleum', 'Churchill', 'Harwich Haven Authority',
  'Coffs Harbour Airport', 'DEVRO', 'DEXION', 'Elements of Byron', 'eni',
  'Envision AESC', 'eog resources', 'Woolnorth Renewables', 'Farmers', "Fisher & Paykel Healthcare",
  'Fremantle Ports', 'Hamilton City Council', 'iOR', 'LAVAZZA', 'Matrix Composites & Engineering',
  'Metagenics', 'Ministry for Primary Industries', 'Mount Isa Water Board', "Mrs Mac's", 'News Corp Australia',
  'Numurkah Solar Farm', 'Palisade', 'Port Authority of New South Wales', 'Ross River Solar Farm', 'Sanitarium',
  'Scentre Group', 'Alpine Resorts Victoria', 'Siemens Healthineers', 'Sodexo', 'Sunshine Coast Airport',
  'Sunstate Cement Ltd', 'Tassal', 'United', 'Valspar', 'Virgin Limited Edition',
  'Voyages Indigenous Tourism', 'Woodside Energy', 'Woollam Constructions',
];

export function Component({ fieldValues }: { fieldValues: FieldValues }) {
  const clients = fieldValues.clients || [];

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
      <WedgeTopBanner
        logo={fieldValues.logo}
        bannerImage={fieldValues.headerBannerImage}
        logoFallbackText={fieldValues.logoFallbackText}
      />

      <div style={{ padding: 'calc(var(--spacing-unit) * 4) calc(var(--spacing-unit) * 5)' }}>
        <h2
          style={{
            fontFamily: FONT_HEADING,
            color: COLORS.navy,
            fontWeight: 700,
            fontSize: 28,
            margin: '0 0 calc(var(--spacing-unit) * 3) 0',
          }}
        >
          {fieldValues.heading}
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px 14px',
            alignItems: 'center',
          }}
        >
          {clients.map((client, index) => (
            <div key={`${client.clientName}-${index}`} style={{ display: 'flex', alignItems: 'center', minHeight: 28 }}>
              {client.logo?.src ? (
                <LogoImage image={client.logo} fallbackHeight={28} alt={client.clientName} />
              ) : (
                <span style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.navy }}>{client.clientName}</span>
              )}
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
    <LogoFallbackTextField />
    <HeaderBannerImageField />
    <TextField name="heading" label="Heading" default="Who We've Worked With" />
    <RepeatedFieldGroup
      name="clients"
      label="Clients"
      occurrence={{ min: 0, default: CLIENT_NAMES.length }}
      helpText="Add a logo per client if you have one - otherwise the name is shown as text."
      default={CLIENT_NAMES.map((name) => ({ clientName: name }))}
    >
      <ImageField name="logo" label="Logo (optional)" default={{ src: '', alt: '' }} />
      <TextField name="clientName" label="Client name" default="" />
    </RepeatedFieldGroup>
    <BannerImageField name="footerImage" label="Footer photo" />
    <TextField name="footerLabel" label="Footer text" default="Solution Proposal" />
    <ExtraContentBlocksField />
  </ModuleFields>
);

export const meta = {
  label: 'Prop- Clients Grid',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set hublData = {} %}
`;
