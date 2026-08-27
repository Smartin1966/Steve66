// Shared visual building blocks for the "Prop-" module set, which recreates
// the Solution Proposal template. That template's brand system reuses the
// same navy/orange palette as the MCGS quote modules but adds its own
// decorative motifs (a diagonal wedge banner, a hero-photo banner with a
// curved edge, and a small corner wedge) repeated across most pages.
import type { CSSProperties } from 'react';
import { ImageField } from '@hubspot/cms-components/fields';
import { COLORS, FONT_HEADING } from './theme';
import { LogoImage, LogoValue as ImageValue } from './sharedFields';

export function LogoField({ name = 'logo' }: { name?: string } = {}) {
  return (
    <ImageField
      name={name}
      label="Logo"
      helpText="Upload your logo to the HubSpot file manager first, then select it here. If left blank, a styled text wordmark is used instead."
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
    />
  );
}

function Wordmark({ light }: { light?: boolean }) {
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
      <span style={{ color: light ? '#ffffff' : COLORS.orange }}>MC</span>
      GLOBAL SOLUTIONS
    </span>
  );
}

// The diagonal navy/orange bar + logo used at the top of most interior
// pages (Services, Why Choose Us, Fees header, Clients grid, Case studies).
export function WedgeTopBanner({ logo }: { logo?: ImageValue }) {
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
        ) : (
          <Wordmark />
        )}
      </div>
    </div>
  );
}

// Small decorative navy/orange wedge in the bottom-right corner, used on
// pages that don't carry a full photo footer banner.
export function WedgeCornerFooter() {
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
          ? `linear-gradient(180deg, rgba(24,44,66,0.35), rgba(24,44,66,0.55)), url(${image.src})`
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
      ) : (
        <div style={{ marginBottom: 10 }}>
          {logoFallbackText ? (
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: 0.5,
                color: '#ffffff',
                whiteSpace: 'nowrap',
              }}
            >
              {logoFallbackText}
            </span>
          ) : (
            <Wordmark light />
          )}
        </div>
      )}
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
          ? `linear-gradient(180deg, rgba(24,44,66,0.45), rgba(24,44,66,0.7)), url(${image.src})`
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
        }}
      >
        {label || 'Solution Proposal'}
      </div>
    </div>
  );
}
