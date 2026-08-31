// Shared visual building blocks for the "Prop-" module set, which recreates
// the Solution Proposal template. That template's brand system reuses the
// same navy/orange palette as the MCGS quote modules but adds its own
// decorative motifs (a diagonal wedge banner, a hero-photo banner with a
// curved edge, and a small corner wedge) repeated across most pages.
import type { CSSProperties } from 'react';
import { ImageField, TextField } from '@hubspot/cms-components/fields';
import { COLORS, FONT_HEADING } from './theme';
import { LogoImage, LogoValue as ImageValue } from './sharedFields';

export function LogoField({ name = 'logo' }: { name?: string } = {}) {
  return (
    <ImageField
      name={name}
      label="Logo"
      helpText="Upload your logo to the HubSpot file manager first, then select it here. If left blank, the fallback text below is shown instead."
      default={{ src: '', alt: '' }}
    />
  );
}

export function BannerImageField({
  name = 'bannerImage',
  label = 'Banner photo',
}: {
  name?: string;
  label?: string;
} = {}) {
  return (
    <ImageField
      name={name}
      label={label}
      helpText="Optional. If left blank a navy-to-orange gradient is used instead."
      default={{ src: '', alt: '' }}
    />
  );
}

export function HeaderBannerImageField({ name = 'headerBannerImage' }: { name?: string } = {}) {
  return (
    <ImageField
      name={name}
      label="Header banner image"
      helpText="Optional. Upload your own graphic to replace the whole header banner (wedge shapes + logo). Leave blank to use the built-in navy/orange wedge design below."
      default={{ src: '', alt: '' }}
    />
  );
}

export function FooterBannerImageField({ name = 'footerBannerImage' }: { name?: string } = {}) {
  return (
    <ImageField
      name={name}
      label="Footer banner image"
      helpText="Optional. Upload your own graphic to replace the small decorative corner wedge. Leave blank to use the built-in design."
      default={{ src: '', alt: '' }}
    />
  );
}

// Text shown in place of a logo image when none is selected. Pairs with
// LogoFallbackTextField below - clearing that field's text entirely hides
// this altogether instead of falling back to any hardcoded wordmark.
export function LogoFallbackTextField({ name = 'logoFallbackText' }: { name?: string } = {}) {
  return (
    <TextField
      name={name}
      label="Logo fallback text"
      helpText="Shown in place of the logo image if no logo is uploaded above. Clear this text completely to show nothing instead."
      default="MCGLOBAL SOLUTIONS"
    />
  );
}

function FallbackText({ text, light }: { text: string; light?: boolean }) {
  return (
    <span
      style={{
        fontFamily: FONT_HEADING,
        fontWeight: 700,
        fontSize: 18,
        letterSpacing: 0.5,
        color: light ? '#ffffff' : COLORS.navy,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </span>
  );
}

// The diagonal navy/orange bar + logo used at the top of most interior
// pages (Services, Why Choose Us, Fees header, Clients grid, Case studies).
// If bannerImage is set, it replaces the whole banner (wedge shapes + logo)
// with the uploaded graphic instead - useful for pixel-matching a real
// exported design asset rather than the CSS recreation below.
export function WedgeTopBanner({
  logo,
  bannerImage,
  logoFallbackText,
}: {
  logo?: ImageValue;
  bannerImage?: ImageValue;
  // Text shown in place of the branded wordmark when no logo image is
  // set. Leave unset/empty to show nothing at all.
  logoFallbackText?: string;
}) {
  if (bannerImage?.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={bannerImage.src}
        alt={bannerImage.alt || 'Header banner'}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    );
  }
  return (
    <div
      style={{
        position: 'relative',
        height: 46,
        backgroundColor: COLORS.orange,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 calc(var(--spacing-unit) * 3)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '62%',
          height: '100%',
          backgroundColor: COLORS.navy,
          clipPath: 'polygon(0 0, 100% 0, 55% 100%, 0 100%)',
        }}
      />
      <div style={{ position: 'relative' }}>
        {logo?.src ? (
          <LogoImage image={logo} fallbackHeight={26} alt="Company logo" />
        ) : logoFallbackText ? (
          <FallbackText text={logoFallbackText} />
        ) : null}
      </div>
    </div>
  );
}

// Small decorative navy/orange wedge in the bottom-right corner, used on
// pages that don't carry a full photo footer banner. If bannerImage is
// set, it replaces the wedge with the uploaded graphic instead.
export function WedgeCornerFooter({ bannerImage }: { bannerImage?: ImageValue } = {}) {
  if (bannerImage?.src) {
    return (
      <div style={{ marginTop: 'auto' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bannerImage.src}
          alt={bannerImage.alt || 'Footer banner'}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>
    );
  }
  return (
    <div
      style={{
        position: 'relative',
        height: 34,
        marginTop: 'auto',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.navy,
          clipPath: 'polygon(35% 0, 100% 0, 100% 100%, 0 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.orange,
          clipPath: 'polygon(58% 0, 100% 0, 100% 100%, 22% 100%)',
        }}
      />
    </div>
  );
}

// Full hero-photo banner with a curved bottom edge, logo, and a big title -
// used on Cover, Letter, and Timeline where the PDF repeats the same photo
// treatment at different heights.
export function HeroPhotoBanner({
  image,
  logo,
  title,
  height,
  contentAlign = 'center',
  fillAvailable = false,
  curvedBottom = true,
  titleStyle,
  logoFallbackText,
}: {
  image?: ImageValue;
  logo?: ImageValue;
  title?: string;
  height: number;
  contentAlign?: 'center' | 'top';
  // Grows to fill all remaining vertical space in its flex-column parent
  // instead of using a fixed height, so the photo's bottom edge always
  // meets whatever comes right after it with no gap. `height` is still
  // used as the reference size for scaling the logo/title.
  fillAvailable?: boolean;
  // Set false to square off the bottom edge instead of the default
  // curved/eyebrow cut.
  curvedBottom?: boolean;
  // Overrides the title's default font/size/color/etc (e.g. from a
  // FontField), merged over the height-based default.
  titleStyle?: CSSProperties;
  // Text shown in place of the branded wordmark when no logo image is
  // set (e.g. an editable field so an editor can type their own company
  // name instead of the hardcoded "MCGLOBAL SOLUTIONS" wordmark).
  logoFallbackText?: string;
}) {
  return (
    <div
      style={{
        position: 'relative',
        ...(fillAvailable ? { flex: '1 1 auto' } : { height }),
        backgroundColor: COLORS.navy,
        backgroundImage: image?.src
          ? `url(${image.src})`
          : `linear-gradient(135deg, ${COLORS.navy} 0%, #23374f 55%, ${COLORS.orange} 150%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...(curvedBottom
          ? { borderBottomLeftRadius: '50% 24px', borderBottomRightRadius: '50% 24px' }
          : null),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: contentAlign === 'top' ? 'flex-start' : 'center',
        textAlign: 'center',
        textShadow: image?.src ? '0 1px 4px rgba(0,0,0,0.55)' : undefined,
        padding:
          contentAlign === 'top'
            ? 'calc(var(--spacing-unit) * 4) calc(var(--spacing-unit) * 4) 0'
            : '0 calc(var(--spacing-unit) * 4)',
      }}
    >
      {logo?.src ? (
        <LogoImage
          image={logo}
          fallbackHeight={Math.min(40, height * 0.22)}
          alt="Company logo"
          style={{ marginBottom: 10 }}
        />
      ) : logoFallbackText ? (
        <div style={{ marginBottom: 10 }}>
          <FallbackText text={logoFallbackText} light />
        </div>
      ) : null}
      {title ? (
        <div
          style={{
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            color: '#ffffff',
            fontSize: Math.min(40, height * 0.22),
            lineHeight: 1.05,
            textTransform: 'uppercase',
            ...titleStyle,
          }}
        >
          {title}
        </div>
      ) : null}
    </div>
  );
}

// Decorative footer photo strip with "SOLUTION PROPOSAL" watermark text,
// used at the bottom of Services / Why Choose Us / Clients grid pages.
export function PhotoFooterBanner({ image, label }: { image?: ImageValue; label?: string }) {
  return (
    <div
      style={{
        position: 'relative',
        height: 90,
        marginTop: 'auto',
        backgroundColor: COLORS.navy,
        backgroundImage: image?.src
          ? `url(${image.src})`
          : `linear-gradient(135deg, ${COLORS.navy} 0%, #23374f 60%, ${COLORS.orange} 150%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontFamily: FONT_HEADING,
          fontWeight: 800,
          color: 'rgba(255,255,255,0.9)',
          fontSize: 30,
          textTransform: 'uppercase',
          letterSpacing: 1,
          textShadow: image?.src ? '0 1px 4px rgba(0,0,0,0.55)' : undefined,
        }}
      >
        {label || 'Solution Proposal'}
      </div>
    </div>
  );
}
