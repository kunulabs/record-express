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

## Colour schemes (current designs/)

The three current designs under `designs/` carry layout only and never name a
colour. The palette lives in one shared layer, `css/schemes.css`, applied as
`data-scheme` on `<html>` and set from the `?scheme=` query parameter by an
inline script in each design's `<head>` before first paint. A scheme is
therefore a token swap over the same page: adding one is a block of custom
properties, not a fourth copy of the markup, and a palette fix lands on all
three designs at once. An absent or unrecognised value falls back to `light`.

| Scheme | `?scheme=` | Source | Shape |
|---|---|---|---|
| Light | `light` | V6 frames | Cream ground, tan accent bands, white surfaces |
| Mixed | `mixed` | V6 frames | Dark, with named bands re-lightened (`.is-light-band`) |
| Dark | `dark` | V6 frames | Dark ground throughout, coral ramp flipped light for AA |
| Original colours | `original` | recordexpress.com | The live palette; white-led, green leads and coral supports |
| Only 5 colours | `five` | `33508:5101` | Five values, one flat stone ground, no banding |
| Matching colours | `matching` | `33510:12337` | Stone replaces cream *and* white; coral used as a 500/700 pair |

The last two come from the newest pair of D frames and were added together.
`five` is a deliberate reduction — `#f5f2ec`, `#1a2a1a`, `#223526`, `#ec6655`,
`#2ecc71` and nothing else — so the light scheme's cream/tan/white alternation
flattens to one ground and the coral ramp collapses to a single value.
`matching` keeps the alternation but swaps both near-whites for the one stone
that the tan actually matches, and uses `#ec6655`/`#b84437` as a pair.

Each scheme's block in `css/schemes.css` carries the reasoning and the measured
contrast, including where a frame's own choice lands below AA and was shipped
as drawn rather than quietly patched.

Two fills are hard-coded in the design stylesheets rather than tokenised, so
they need a per-scheme rule when a frame disagrees: `.stat-badge` is overridden
for both new schemes (`#223526` for `five`, `#1a2a1a` for `matching`).
`.rating-badge` is `#223526` in both frames already, so it is left alone.

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
repository root, listed by the chooser at the root index. Names and schemes are
the designer's own, read off the frames.

| Folder  | Figma node  | Frame | Gutter | Scheme      | Frame name                              |
|---------|-------------|-------|--------|-------------|-----------------------------------------|
| build-a | 33365:2801  | 1280  | 50     | light       | A Light - Quote & Contact               |
| build-b | 33385:3090  | 1280  | 50     | light       | B Light - Veritcal Quote & Contact      |
| build-c | 33385:3803  | 1440  | 100    | light       | C Light - Only Quote (1440px - normal)  |
| build-d | 33385:5229  | 1280  | 50     | light       | D - Light - Only Quote (1280 px - small)|
| build-e | 33387:7560  | 1280  | 50     | light       | E - Light - Vertical Quote & Image      |
| build-f | 33387:8334  | 1280  | 50     | dark        | F - Dark (Green) - Quote &              |
| build-g | 33388:9831  | 1280  | 50     | dark & light| G - Dark & Light- Quote & Image         |
| build-h | 33404:3750  | 1280  | 50     | dark        | H - Dark - Quote & Large Dispatch       |

The seven 1280 frames use 50px gutters (1180 of content); the 1440 frame uses
100px (1240). Each build is responsive below its own frame.

They share one asset folder at assets/ rather than carrying a copy each - the
set is 8.4MB, so eight copies would have added ~67MB to the repository. Each
build is otherwise self-contained: its own index.html, stylesheet and script.
