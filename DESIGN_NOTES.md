# Design tokens — PDF Tools Hub

Brief pins down the direction (screenshots), so tokens follow that closely,
with original brand identity swapped in.

Color:
- --color-navy-900: #10233F   (hero background, deep navy - swap for source's navy)
- --color-navy-800: #16324F   (hero gradient end / header text)
- --color-accent: #2F6FED     (brand blue - primary buttons, links, active states)
- --color-accent-warm: #FF6B4A (secondary accent - used sparingly for category pill hover / CTA highlight)
- --color-bg: #F6F8FB         (page background, light mode)
- --color-surface: #FFFFFF    (cards, header)
- --color-border: #E4E9F0
- --color-text: #142033
- --color-text-muted: #5C6B80
Dark mode mirrors: --color-bg-dark:#0B1424, --color-surface-dark:#121D30, --color-text-dark:#EAF0FA

Type:
- Display/Headings: "Sora" (geometric, confident, distinct from default Inter-everywhere look)
- Body: "Inter"
- Mono/labels (file sizes, counters): "JetBrains Mono" small caps use

Layout:
- Header: 72px fixed, white, subtle bottom border, logo+name+tagline left, nav center, icons/lang/theme right
- Hero: full-bleed navy gradient, centered column, search pill, CTA button
- Category pills: rounded-full outline buttons, wrap on mobile, active state fills accent
- Tool cards: 4-col grid desktop -> 2-col tablet -> 1-col mobile, icon in rounded-square tile, title, 2-line description, hover lift + accent border

Signature element: the tool-card icon tile uses a distinct duotone icon set (not stock FA icons rendered flat) — 
each category gets its own icon-tile color family, which doubles as the category color-coding used consistently
across pills, cards and badges. This is the one consistent "visual grammar" tying nav, pills, and cards together.
