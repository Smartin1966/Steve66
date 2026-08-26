// A reusable "Additional content blocks" repeater every module includes,
// so editors are never limited to the fixed fields a module ships with.
// Each block is optional-everything: an image, a caption, a heading, and
// rich text - fill in only what a given block needs.
import {
  RepeatedFieldGroup,
  ImageField,
  TextField,
  RichTextField,
} from '@hubspot/cms-components/fields';
import { RichTextFieldWrapper } from '@hubspot/cms-components';
import { COLORS, FONT_HEADING, richTextPersonalizationFeatures } from './theme';

export interface ExtraBlock {
  image?: { src?: string; alt?: string };
  caption?: string;
  heading?: string;
  text?: string;
}

export function ExtraContentBlocksField({
  name = 'extraBlocks',
  label = 'Additional content blocks',
}: {
  name?: string;
  label?: string;
} = {}) {
  return (
    <RepeatedFieldGroup
      name={name}
      label={label}
      occurrence={{ min: 0, max: 12 }}
      helpText="Add as many extra text and/or image blocks as this section needs. Each block is optional in every part - leave the image, heading, or text blank to skip it. Blocks render in order, after the section's main content."
    >
      <ImageField name="image" label="Image" />
      <TextField name="caption" label="Image caption" default="" />
      <TextField name="heading" label="Heading" default="" />
      <RichTextField
        name="text"
        label="Text"
        default=""
        enabledFeatures={[...richTextPersonalizationFeatures]}
      />
    </RepeatedFieldGroup>
  );
}

export function ExtraBlocks({ blocks }: { blocks?: ExtraBlock[] }) {
  if (!blocks?.length) return null;
  return (
    <>
      {blocks.map((block, index) => (
        <div key={index} style={{ marginTop: 'calc(var(--spacing-unit) * 3)' }}>
          {block.image?.src ? (
            <figure style={{ margin: '0 0 12px 0' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={block.image.src}
                alt={block.image.alt || block.heading || ''}
                style={{ width: '100%', borderRadius: 10, display: 'block' }}
              />
              {block.caption ? (
                <figcaption
                  style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}
                >
                  {block.caption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          {block.heading ? (
            <h3
              style={{
                fontFamily: FONT_HEADING,
                color: COLORS.orange,
                fontWeight: 700,
                fontSize: 18,
                margin: '0 0 8px 0',
              }}
            >
              {block.heading}
            </h3>
          ) : null}

          {block.text ? (
            <RichTextFieldWrapper tag="div" fieldValue={block.text} />
          ) : null}
        </div>
      ))}
    </>
  );
}
