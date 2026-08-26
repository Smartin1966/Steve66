# MCGlobal Solutions — Coded Quote Template for HubSpot Revenue Hub

This project recreates the design of `MCGlobal_Proposal_Ultimo_Template01.pdf`
as **code**, so you don't have to hand-build the 11-page proposal layout
inside HubSpot's drag-and-drop quote template editor.

## How this actually works in HubSpot (important context)

HubSpot's current Quotes tool (Revenue Hub) does **not** support a single
fully-custom HTML/HubL page the way old "legacy" quote templates once did.
Instead:

- A **quote template** is a drag-and-drop layout built in
  **Settings → Objects → Quotes → Quote templates**.
- You drag *modules* into that layout — some are HubSpot's built-in modules
  (company/sender header, the line items table, e-signature, payment), and
  some can be **your own custom-coded modules**.
- Custom quote modules are written in **React + HubL**, deployed with the
  HubSpot CLI, and then show up in the "+" add-module panel inside the quote
  template editor, ready to drag in — no manual box-by-box layout work.

So "coding the template" means: this repo contains 7 custom modules that
reproduce every narrative page of the PDF (cover, letter, project scope,
recommendations, feature highlight, timeline, why-choose-us, case studies).
The **pricing table and e-signature stay on HubSpot's native modules**
(Line Items, Signature) so they keep syncing with the deal/products — those
you just drag in from the standard module panel, no coding needed.

## A4 page sizing

Every module's root element is sized as one A4 sheet (`210mm` wide,
`297mm` minimum height, defined once as `A4_PAGE` in `components/theme.ts`)
with a forced page break after it. `QuoteCaseStudiesModule` applies this
per case-study card instead of to the module as a whole, since one module
instance can render multiple case studies. Practically this means:

- Each module (and each case study) starts on its own clean page when the
  quote is exported/rendered to PDF, instead of running on from the
  previous section or splitting mid-content.
- A section with little content still fills a full A4 page height; a
  section with more content than fits on one page grows past `297mm`
  rather than clipping (better to have a section run slightly long than
  silently lose text).
- On screen (in the template/quote editor, not the PDF), this renders as
  a centered ~210mm-wide column, matching the fixed-page-width look of
  the original PDF proposal.

If you change the padding/margins in a module, keep it inside the printable
area of an A4 page (roughly 190mm usable width after standard margins) so
nothing gets pushed off the edge when printed.

## What's included

```
src/cms-assets/my-react-assets/components/modules/
├── QuoteCoverModule/            Cover page: logo, hero banner, title, client name, submitted-by/date
├── QuoteLetterModule/           "Overview" cover letter with signature block
├── QuoteContentSectionsModule/  Reusable heading+body sections (use once for "Project Scope",
│                                again for "Additional Recommendations") + optional banner image
├── QuoteFeatureHighlightModule/ Feature callout with screenshots + bullet list (e.g. "AI Predictive Maintenance")
├── QuoteTimelineModule/         Banner image + intro text + Project Phase / Week table
├── QuoteWhyChooseUsModule/      "Why choose us" copy + optional banner image + two-column client list
└── QuoteCaseStudiesModule/      Repeatable case-study cards (logo, quote, challenge/solution/results)
```

## Editing: text, images, and personalized fields

Every text field in every module is a normal HubSpot **TextField** or
**RichTextField** — click it in the template/quote editor sidebar and type,
no code required. Every module also has at least one **ImageField** (logo,
hero banner, screenshots, case-study logos, or a decorative banner) so you
can swap in your own pictures the same way.

### Adding more than the fixed fields: "Additional content blocks"

Every module (and, inside `QuoteCaseStudiesModule`, every individual case
study) ends with an **Additional content blocks** repeater — click "Add"
in the sidebar to append as many extra blocks as you need, in any
combination, without touching code:

- an image (with an optional caption),
- a heading,
- rich text (with the same personalize/lists/links/colors toolbar as
  every other rich text field),

and leave any part of a block blank to skip it — an image-only block, a
text-only block, or both together are all fine. Blocks render in the order
you add them, after the module's built-in content, and each one still
respects the module's A4 page (a section with a lot of extra blocks just
grows taller rather than clipping). This is the escape hatch for anything
the fixed fields above don't cover — you are not limited to what a module
shipped with.

Two ways to personalize copy per-quote:

1. **Rich text fields** (letter body, section bodies, feature intro, case
   study quotes) have HubSpot's built-in **personalize** toolbar button
   enabled — click it in the sidebar's text editor to insert a live
   contact/company/deal property (first name, company name, etc.) without
   leaving the editor. They also support headings, lists, links, colors,
   and inline images.
2. **Plain text fields** (titles, headings, subtitles) don't get a toolbar
   button, but support simple `{{token}}` placeholders that resolve
   automatically from the quote/deal/contact at render time:
   - `{{company}}` — the buyer's company name (falls back to the deal name)
   - `{{contact_first_name}}` — the primary buyer contact's first name
   - `{{sender_first_name}}` / `{{sender_last_name}}` — the quote sender
   - `{{sender_name}}` — sender's full name (Cover module only)

   Each field's help text in the sidebar lists which tokens it supports.
   In the template editor (before a real quote exists) these fall back to
   placeholder values like "Acme Corp" so the layout still looks right.

Brand colors (navy `#182c42`, orange `#ec6820`) were sampled directly from
the real MCGlobal Solutions logo and centralized in `components/theme.ts`
so every module stays visually consistent. The extracted logo file is at
`assets/mcglobal-solutions-logo.png` — upload it to HubSpot's file manager
once, then point the Cover module's "Company logo" field at it.

Note: the original PDF's stock photography and the third-party software
screenshot (Ultimo/Accruent UI) aren't bundled here — licensing on those
assets is unknown. The `heroImage` and screenshot fields are just left
empty for you to fill in with your own licensed images.

## Prerequisites

- **Revenue Hub Professional or Enterprise** (custom quote modules require this)
- Node.js 20+
- HubSpot CLI: `npm install -g @hubspot/cli`, then `hs auth` against your portal

## Local setup

```sh
cd hubspot-quote-template-mcgs
npm install      # installs root + src/cms-assets/my-react-assets deps
npm start         # boots the CMS dev server with live HubL evaluation
```

## Deploy to your HubSpot portal

```sh
npm run deploy    # runs `hs project upload`
```

This builds and uploads the project. Each module then appears in the "+"
add-module panel inside **both** the quote template editor and individual
quotes.

## Assembling the template in HubSpot

1. Go to **Settings → Objects → Quotes → Quote templates** and create a new
   template (or edit an existing one).
2. Click **Customize quote template**, then use the **+** button to add
   modules in this order, matching the original PDF page-by-page:
   1. `MCGS - Cover Page`
   2. `MCGS - Cover Letter`
   3. `MCGS - Content Sections` → set Title to "Project Scope" (defaults are already pre-filled with the 5 sections from the PDF)
   4. `MCGS - Content Sections` (a second instance) → set Title to "Additional Recommendations", replace the items with "User Acceptance Testing (UAT)" and "Support Tiers"
   5. `MCGS - Feature Highlight` → defaults are pre-filled for "AI Predictive Maintenance"; add your own screenshots
   6. `MCGS - Timeline` → defaults are pre-filled with the 4 project phases
   7. HubSpot's native **Line items** module → this replaces the "Services Fees" pages; configure columns as Description / Price / Qty / Amount to match
   8. `MCGS - Why Choose Us` → defaults are pre-filled with the client list
   9. `MCGS - Case Studies` → defaults are pre-filled with the News Corp and Devro case studies from the PDF; add/replace with your own, upload each client's logo
   10. HubSpot's native **Signature** module
3. Open **Settings** in the template editor to set the quote's theme color
   to `#182c42` (navy) with `#ec6820` (orange) accents, so the native
   header/line-items/signature modules match the custom modules.
4. Save, then select this template when creating a quote — every field
   above is editable per-quote/per-template from the sidebar, no code
   changes required for day-to-day use.

## Editing content later

All the boilerplate marketing copy (Project Scope, Additional
Recommendations, Why Choose Us, Case Studies, Timeline) is pre-loaded as
**field defaults**, editable from the sidebar in the template/quote editor.
Only touch the code in `components/modules/**` if you want to change the
*layout* rather than the words — e.g. resizing the hero banner or adding a
new section type. After editing, redeploy with `npm run deploy`.

New module versions apply to future quotes and unpublished drafts, not to
quotes that have already been published.

## Reference

- Built from HubSpot's own starter/spec: https://github.com/HubSpot/quote-dev-starter
- SDK types: `@hubspot/quote-dev-sdk` (quote, deal, line items, buyer/billing contact & company, signers)
- Field components: `@hubspot/cms-components/fields` (TextField, RichTextField, ImageField, RepeatedFieldGroup, etc.)
