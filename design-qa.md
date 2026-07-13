# Design QA — hero full-bleed

- Reference: `C:\Users\Usuario\.codex\generated_images\019f58b6-c5b2-7f10-89d4-8b878e8552f7\exec-4574055e-7e7b-44f9-b63b-fa8d9dd44993.png`
- Implementation: `C:\Users\Usuario\AppData\Local\Temp\portfolio-fullbleed-2026-07-13\implementation-reference-viewport.png`
- Combined comparison: `C:\Users\Usuario\AppData\Local\Temp\portfolio-fullbleed-2026-07-13\comparison-final.png`
- Browser viewport: `1586 × 992`, top of page, autoplay active.

## Fidelity surfaces

1. Fonts and typography — passed. Manrope hierarchy, weight contrast, compact navigation, oversized two-line statement and monospaced utility labels preserve the approved direction without clipping.
2. Spacing and layout rhythm — passed. The hero fills the desktop viewport, content is anchored left, the showreel rail sits low-right, and no empty black “TV wall” remains. Mobile keeps its previous stacked stage.
3. Colors and visual tokens — passed. The black/white/lime system remains intact; the new dark treatment is a readability layer over real media rather than a replacement image.
4. Image quality and asset fidelity — passed. The production site uses only Enzo's real poster/video files. Landscape media fills the stage; portrait media stays sharp in a dedicated right-side 9:16 area while a blurred copy of the same real poster fills the remaining frame.
5. Copy and product-specific content — passed. Contact email is `enzosmarinho@hotmail.com`; Negócio Sem Filtro now states cuts/teasers plus filming of one long-form episode, without claiming its long-form edit.

## Interaction and responsive QA

- Seven showreel selectors, previous/next and pause/resume controls work.
- The active video reaches ready state 4 and plays muted/inline; inactive videos are paused, have their `src` removed and release their decoder state after the transition.
- Desktop checked at 1440×900, 1586×992 and 2048×1008.
- Mobile checked at 390×844 with the previous composition preserved.
- Browser console: no errors.
- Lighthouse: Performance 94, Accessibility 100, Best Practices 100, SEO 100; CLS 0.001 and TBT 90 ms.

## Issue history

- P0/P1: none remaining.
- P2 fixed: removed the isolated fixed-ratio screen and dead black field on desktop; extended each real scene to the viewport; converted the controller into a slim low-right rail; corrected contact and portfolio credits.
- P3 follow-up: GitHub Pages cache headers should improve the local Lighthouse cache-lifetime warning after publication.

final result: passed
