# Record Express — Landing Page

Static landing page for Record Express (B2B courier & logistics), built from the
[Figma design](https://www.figma.com/design/A21l08qH9T8vGlLo5XcU2W/Record-Express).

Plain HTML/CSS/JS — no build step, so it previews directly on GitHub Pages or
any static host.

## Structure

The current builds live at the repository root, one folder each. The earlier
A-D explorations are kept under old-design/. The root index is a chooser that
groups builds by colour scheme (light / dark / mixed) for review.

The site lives in four self-contained variants; the repository root holds only
a small preview index that links to them.

```
index.html         Chooser: light / dark / mixed, links to each build
old-design/        The earlier A-D explorations

old-design/variant-a/         Current design (cream), quote bar in the page
old-design/variant-b/         Dark scheme, sticky booking widget
old-design/variant-c/         Light scheme (white/cream), sticky booking widget
old-design/variant-d/         Figma 33329:1919 - wider copy, smaller photo and card,
                   driver utility bar kept, no sticky widget

  index.html       Page markup
  css/style.css    Styles (design tokens, layout, components)
  js/script.js     Mobile nav, quote-bar toggle, section selectors, forms
  assets/images/   Image assets
```

## Colour-scheme variants

Each variant is a complete, independent copy — its own `index.html`, `css/`,
`js/` and `assets/`. Editing one cannot affect the others.

B and C share a layout that differs from A: the quote bar is lifted out of the
page into a fixed capsule, where hovering **Book Now** expands it full width.
Only their palettes differ.

Live previews:

| | URL |
|---|---|
| Index | https://kunulabs.github.io/record-express/ |
| Variant A | https://kunulabs.github.io/record-express/old-design/variant-a/ |
| Variant B | https://kunulabs.github.io/record-express/old-design/variant-b/ |
| Variant C | https://kunulabs.github.io/record-express/old-design/variant-c/ |
| Variant D | https://kunulabs.github.io/record-express/old-design/variant-d/ |

To reskin a variant, edit the design tokens at the top of its `css/style.css` —
the whole palette flows from that one block:

```css
:root {
  --color-bg-default: #fff6eb;   /* page background */
  --color-bg-accent:  #ffe3c2;   /* cards, pills, industry panel */
  --color-bg-dark:    #122114;   /* dark sections, featured service panel */
  --color-text-action:#d55445;   /* eyebrows, numbers, links */
  --color-coral-500:  #ec6655;   /* primary buttons, active rail row */
  --color-coral-700:  #b84437;   /* button hover, icon fills */
}
```

Note the assets are duplicated per variant, so an image or markup fix must be
applied to all four copies.

## Running locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000/.

## Note on images

The images are the real exported photography and partner logos, supplied via
Google Drive and direct upload. They cannot be pulled from Figma in this
environment: the egress policy blocks `figma.com`, so `download_assets` URLs
fail even though the design itself can be read through the Figma MCP server.
New or updated artwork therefore has to be uploaded rather than fetched.

## V5 builds

Eight builds from the "Landing Page V5 - 21 Aug" board, one folder each at the
repository root, listed by the chooser at the root index.

| Build | Figma node  | Core frame | Scheme |
|-------|-------------|-----------|--------|
| 1     | 33365:2801  | 1280      | mixed  |
| 2     | 33385:3090  | 1280      | mixed  |
| 3     | 33385:3803  | 1440      | mixed  |
| 4     | 33385:5229  | 1280      | light  |
| 5     | 33387:7560  | 1280      | light  |
| 6     | 33387:8334  | 1280      | dark   |
| 7     | 33388:9831  | 1280      | mixed  |
| 8     | 33404:3750  | 1280      | dark   |

They share one asset folder at assets/ rather than carrying a copy each - the
set is 8.4MB, so eight copies would have added ~67MB to the repository. Each
build is otherwise self-contained: its own index.html, stylesheet and script.

