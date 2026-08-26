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
