// Shared brand tokens for the MCGlobal Solutions quote template modules.
// Colors were sampled directly from the company's logo artwork so every
// module stays visually consistent without duplicating hex values.
export const COLORS = {
  navy: '#182c42',
  navySoft: '#334c66',
  orange: '#ec6820',
  orangeSoft: '#fbe3d1',
  paper: '#ffffff',
  panel: '#f6f7f9',
  body: '#33404d',
  muted: '#6b7684',
  border: '#e3e6ea',
};

export const FONT_HEADING =
  "'Poppins', 'Segoe UI', Helvetica, Arial, sans-serif";
export const FONT_BODY =
  "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif";

// Sizes every top-level module section as one A4 sheet (210mm x 297mm) and
// forces a page break after it, so when a quote renders to PDF each
// module/case-study lands on its own clean page instead of running on or
// splitting mid-content. minHeight (not height) lets a section that needs
// more room grow past one page rather than clipping content.
export const A4_PAGE: {
  width: string;
  minHeight: string;
  boxSizing: 'border-box';
  margin: string;
  pageBreakAfter: 'always';
  breakAfter: 'page';
} = {
  width: '210mm',
  minHeight: '297mm',
  boxSizing: 'border-box',
  margin: '0 auto',
  pageBreakAfter: 'always',
  breakAfter: 'page',
};

export function formatCrmDate(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  const date = Number.isFinite(num) ? new Date(num) : new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function splitLines(value: string | undefined | null): string[] {
  if (!value) return [];
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

// Lets editors drop {{company}}, {{contact_first_name}}, etc. into plain
// TextField copy (title/heading/subtitle fields) and have it resolved from
// the live quote/deal/contact at render time. RichTextField content gets
// the same tokens PLUS HubSpot's own built-in personalization token picker
// (see richTextPersonalizationFeatures below) for inserting live CRM
// properties without leaving the editor.
export function personalize(
  text: string | undefined | null,
  tokens: Record<string, string | undefined | null>
): string {
  if (!text) return '';
  let result = text;
  for (const [key, value] of Object.entries(tokens)) {
    result = result.split(`{{${key}}}`).join(value || '');
  }
  return result;
}

// A curated RichTextField toolbar: formatting essentials, inline images,
// and HubSpot's "personalize" token picker (contact/company/deal
// properties) so editors aren't limited to plain paragraphs.
export const richTextPersonalizationFeatures = [
  'standard_emphasis',
  'lists',
  'indents',
  'alignment',
  'link',
  'colors',
  'personalize',
  'image',
] as const;

// The runtime value shape of a FontField (font family/size/weight/color
// picker in the sidebar). Matches @hubspot/cms-components' FontFieldType
// default shape.
export interface FontValue {
  font?: string;
  font_set?: 'DEFAULT' | 'GOOGLE' | 'CUSTOM';
  fallback?: string;
  size?: number;
  size_unit?: string;
  color?: string;
  styles?: { bold?: boolean; italic?: boolean; underline?: boolean };
  line_height?: number;
  letter_spacing?: number;
  casing?: 'none' | 'uppercase';
}

// Converts a FontField value into inline styles, so a module can let an
// editor pick font family/size (and weight/color/casing) for one text
// element from the sidebar instead of it being hardcoded in code.
export function fontValueToStyle(
  value: FontValue | undefined,
  fallbackFamily: string
): {
  fontFamily: string;
  fontSize?: string;
  color?: string;
  fontWeight?: number;
  fontStyle?: 'italic';
  textDecoration?: 'underline';
  lineHeight?: number;
  letterSpacing?: number;
  textTransform?: 'uppercase';
} {
  if (!value) return { fontFamily: fallbackFamily };
  const family = value.font
    ? `'${value.font}', ${value.fallback || fallbackFamily}`
    : fallbackFamily;
  return {
    fontFamily: family,
    ...(value.size ? { fontSize: `${value.size}${value.size_unit || 'px'}` } : null),
    ...(value.color ? { color: value.color } : null),
    ...(value.styles?.bold ? { fontWeight: 700 } : null),
    ...(value.styles?.italic ? { fontStyle: 'italic' as const } : null),
    ...(value.styles?.underline ? { textDecoration: 'underline' as const } : null),
    ...(value.line_height ? { lineHeight: value.line_height } : null),
    ...(value.letter_spacing ? { letterSpacing: value.letter_spacing } : null),
    ...(value.casing === 'uppercase' ? { textTransform: 'uppercase' as const } : null),
  };
}
