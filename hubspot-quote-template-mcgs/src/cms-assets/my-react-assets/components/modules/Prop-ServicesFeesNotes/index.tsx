// Compact footer block for the Services Fees pages: the two italic
// footnotes plus the corner wedge, placed directly below HubSpot's native
// Line Items module. Not an A4_PAGE section for the same reason as
// Prop-ServicesFeesHeader.
import { ModuleFields, TextField } from '@hubspot/cms-components/fields';
import { COLORS, FONT_BODY, splitLines } from '../../theme';
import { FooterBannerImageField, WedgeCornerFooter } from '../../propShared';

interface FieldValues {
  notes: string;
  footerBannerImage?: { src?: string; alt?: string };
}

export function Component({ fieldValues }: { fieldValues: FieldValues }) {
  const notes = splitLines(fieldValues.notes);
  return (
    <div style={{ fontFamily: FONT_BODY, color: COLORS.body, backgroundColor: COLORS.paper }}>
      <div style={{ padding: 'calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 5) calc(var(--spacing-unit) * 4)' }}>
        {notes.map((note, index) => (
          <p key={index} style={{ fontStyle: 'italic', margin: '0 0 6px 0' }}>
            {note}
          </p>
        ))}
      </div>
      <WedgeCornerFooter bannerImage={fieldValues.footerBannerImage} />
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <TextField
      name="notes"
      label="Footnotes"
      allowNewLine
      helpText="One note per line."
      default={[
        'Hourly rates for additional work required beyond the scope in the proposal will be charged at the standard rate for the activity.',
        'Travel costs for onsite work are charged at cost plus 10%.',
      ].join('\n')}
    />
    <FooterBannerImageField />
  </ModuleFields>
);

export const meta = {
  label: 'Prop- Services Fees Notes',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set hublData = {} %}
`;
