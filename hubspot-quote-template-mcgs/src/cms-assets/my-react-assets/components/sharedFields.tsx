// A reusable "Additional content blocks" repeater every module includes,
// so editors are never limited to the fixed fields a module ships with.
// Each block is optional-everything: an image, a caption, a heading, and
// rich text - fill in only what a given block needs.
import type { CSSProperties } from 'react';
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

export type LogoValue =
  | {
      src?: string;
      alt?: string;
      width?: number;
      height?: number;
      max_width?: number;
      max_height?: number;
    }
  | undefined;

// Renders a logo/signature image respecting a deliberate resize made via
// HubSpot's image field resize/crop panel, while still fitting it into its
// design slot. HubSpot stores the *uploaded file's native pixel size* as
// width/height the moment an image is selected, before anyone has touched
// the resize handles - rendering that literally (as earlier versions of
// this component did) makes any freshly-uploaded logo balloon to its full
// source resolution. So width/height are only ever used to derive the
// image's aspect ratio; the rendered height is capped at whichever is
// smaller of the field's own height and a generous multiple of
// fallbackHeight, and the width is derived from that height to keep
// proportions correct. A deliberate resize down to something at or below
// the cap is honored exactly; an untouched native-resolution upload is
// scaled down to fit instead of overflowing its slot.
export function LogoImage({
  image,
  fallbackHeight,
  alt,
  style,
}: {
  image: LogoValue;
  fallbackHeight: number;
  alt: string;
  style?: CSSProperties;
}) {
  if (!image?.src) return null;
  const hasExplicitSize = Boolean(image.width && image.height);
  let renderWidth: number | string = 'auto';
  let renderHeight: number | string = fallbackHeight;
  if (hasExplicitSize) {
    const aspectRatio = image.width! / image.height!;
    renderHeight = Math.min(image.height!, fallbackHeight * 2);
    renderWidth = renderHeight * aspectRatio;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      alt={image.alt || alt}
      style={{
        display: 'block',
        width: renderWidth,
        height: renderHeight,
        maxWidth: '100%',
        ...style,
      }}
    />
  );
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
      <ImageField name="image" label="Image" default={{ src: '', alt: '' }} />
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
