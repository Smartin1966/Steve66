import {
  ModuleFields,
  TextField,
  RichTextField,
  RepeatedFieldGroup,
  ImageField,
} from '@hubspot/cms-components/fields';
import { RichTextFieldWrapper } from '@hubspot/cms-components';
import { COLORS, FONT_HEADING, FONT_BODY, splitLines } from '../../theme';

interface ImageItem {
  image?: { src?: string; alt?: string };
  caption?: string;
}

interface FieldValues {
  eyebrow: string;
  intro: string;
  bullets: string;
  images: ImageItem[];
}

interface HublData {
  isQuoteBlueprint: boolean;
}

interface Props {
  fieldValues: FieldValues;
  hublData: HublData;
}

export function Component({ fieldValues }: Props) {
  const bullets = splitLines(fieldValues.bullets);
  const images = (fieldValues.images || []).filter((item) => item.image?.src);

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
      <div
        style={{
          fontFamily: FONT_HEADING,
          color: COLORS.navy,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: 'uppercase',
          fontSize: 15,
          marginBottom: 'calc(var(--spacing-unit) * 2)',
        }}
      >
        {fieldValues.eyebrow}
      </div>

      {images.length ? (
        <div
          style={{
            display: 'flex',
            gap: 'calc(var(--spacing-unit) * 2)',
            flexWrap: 'wrap',
            marginBottom: 'calc(var(--spacing-unit) * 3)',
          }}
        >
          {images.map((item, index) => (
            <figure
              key={index}
              style={{
                margin: 0,
                flex: '1 1 320px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                overflow: 'hidden',
                backgroundColor: COLORS.panel,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image?.src}
                alt={item.image?.alt || item.caption || 'Screenshot'}
                style={{ width: '100%', display: 'block' }}
              />
              {item.caption ? (
                <figcaption
                  style={{
                    padding: '8px 12px',
                    fontSize: 12,
                    color: COLORS.muted,
                  }}
                >
                  {item.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}

      <div
        style={{
          color: COLORS.orange,
          fontWeight: 700,
          fontSize: 20,
          marginBottom: 'calc(var(--spacing-unit) * 2)',
        }}
      >
        <RichTextFieldWrapper tag="div" fieldValue={fieldValues.intro} />
      </div>

      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {bullets.map((bullet, index) => (
          <li key={index} style={{ marginBottom: 10 }}>
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <TextField
      name="eyebrow"
      label="Eyebrow label"
      default="AI Predictive Maintenance"
    />
    <RichTextField
      name="intro"
      label="Highlighted intro"
      default="<p>Predict failures with Artificial Intelligence, giving your maintenance department the capability to perform maintenance only when required.</p>"
    />
    <TextField
      name="bullets"
      label="Bullet points"
      allowNewLine
      helpText="One bullet per line."
      default={[
        'Rather than taking equipment offline purely based on a predefined schedule from an equipment supplier, use advanced Artificial Intelligence (AI) technology to learn when the equipment is performing normally.',
        'Remotely monitor thousands of assets anytime, anywhere.',
        'Help your maintenance teams focus their efforts in the right areas, reducing wasted effort and operational expenditure.',
        'Increase productivity from anywhere, anytime.',
      ].join('\n')}
    />
    <RepeatedFieldGroup name="images" label="Screenshots" occurrence={{ min: 0, max: 4 }}>
      <ImageField name="image" label="Image" />
      <TextField name="caption" label="Caption" default="" />
    </RepeatedFieldGroup>
  </ModuleFields>
);

export const meta = {
  label: 'MCGS - Feature Highlight',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set hublData = {
    "isQuoteBlueprint": isQuoteBlueprint
  } %}
`;
