# Image Optimization Audit

## PNG Files in `src/assets/`

| File | Use Case | Referenced By |
|------|----------|---------------|
| **2002.png** | Timeline snapshot | `AboutSection.astro` |
| **2010.png** | Timeline snapshot | `AboutSection.astro` |
| **2012.png** | Timeline snapshot | `AboutSection.astro` |
| **2015.png** | Timeline snapshot | `AboutSection.astro` |
| **2016.png** | Timeline snapshot | `AboutSection.astro` |
| **2022.png** | Timeline snapshot | `AboutSection.astro` |
| **2025.png** | Timeline snapshot | `AboutSection.astro` |
| **banner.png** | *(unused)* | — |
| **clarity.png** | Tool icon (Process) | `ProcessSection.astro` |
| **clouds.png** | Background (grid-reveal) | `grid-reveal.astro` (CSS) |
| **commercial.png** | Persona avatar | `pricing.astro` |
| **floral_hero.png** | Hero background | `Hero.astro`, `index.astro` (preload) |
| **footer.png** | CTA/footer background | `CTASection.astro` |
| **main-image.png** | Statue (grid-reveal) | `grid-reveal.astro` |
| **manage.png** | Persona avatar | `pricing.astro` |
| **persona1.png** | Persona avatar | `wea.astro` |
| **phorm.png** | *(imported, unused in WorkSection)* | — |
| **portrait1.png** | Persona avatar | `wea.astro` |
| **portrait2.png** | About portrait | `AboutSection.astro` |
| **portrait22.png** | *(unused)* | — |
| **portrait3.png** | Persona avatar | `wea.astro` |
| **portrait4.png** | Persona avatar | `wea.astro` |
| **priceops.png** | Persona avatar | `pricing.astro` |
| **pricing_img.png** | Portfolio screenshot | `WorkSection.astro` |
| **region.png** | Persona avatar | `pricing.astro` |
| **skylens_img.png** | *(unused)* | — |
| **torn_dark.png** | *(unused)* | — |
| **wea.png** | Portfolio screenshot | `WorkSection.astro` |

**JPG also optimized:** `floral_bg.jpg` (AboutSection bg), `bgtexture.jpg` (grid-reveal noise).

---

## Component → Image Reference Map

| Component | Images | Settings Applied |
|-----------|--------|------------------|
| **CTASection.astro** | `footer.png` | Background: webp 80, lazy, `decoding="async"` |
| **Hero.astro** | `floral_hero.png` | Hero: webp 85, eager, `fetchpriority="high"`, `decoding="async"` |
| **ProcessSection.astro** | `clarity.png` | Tool icon: webp 80, lazy, `decoding="async"` |
| **WorkSection.astro** | `wea.png`, `pricing_img.png` | Portfolio: webp 88, lazy, `decoding="async"` |
| **AboutSection.astro** | `floral_bg.jpg`, `portrait2.png`, `2002`–`2025.png` | Bg 80, portrait/snapshots 85, lazy, `decoding="async"` |
| **wea.astro** | `persona1`, `portrait1`, `portrait3`, `portrait4` | Persona: webp 85, lazy, `decoding="async"` |
| **pricing.astro** | `region`, `manage`, `priceops`, `commercial` | Persona: webp 85, lazy, `decoding="async"` |
| **grid-reveal.astro** | `main-image.png`, `clouds.png`, `bgtexture.jpg` | Statue: Image webp 85, lazy; clouds/noise: `getImage` webp 80 → CSS |
| **index.astro** | `floral_hero.png` | Preload only (same as Hero) |

---

## Conversion Approach

**No separate conversion script is required.** Astro’s built-in image pipeline handles everything at build time:

1. **`<Image />`** – All PNG/JPG imports used in `<Image>` are processed by Astro. With `format="webp"` and `quality={…}`, Astro outputs optimized WebP under `/_astro/` and updates `src`/`srcset` automatically.

2. **CSS backgrounds (grid-reveal)** – `clouds.png` and `bgtexture.jpg` are passed through `getImage({ format: 'webp', quality: 80 })`. The returned `.src` is used in inline CSS (`--clouds`, `--noise`), so those backgrounds are also served as WebP.

3. **Imports stay as `.png` / `.jpg`** – You keep importing the originals. Astro generates WebP only in the build output. No need to add `.webp` files to `src/assets/` or change import paths.

---

## Build Output (Sample)

Run `npm run build` to see optimized assets, e.g.:

```
generating optimized images
  ▶ /_astro/floral_hero....webp (before: 6771kB, after: 804kB)
  ▶ /_astro/footer....webp (before: 3019kB, after: 171kB)
  ▶ /_astro/wea....webp (before: 956kB, after: 36kB)
  …
```

All raster images used in components or via `getImage` are converted to WebP with the quality levels specified above.

---

## Optional: Standalone WebP Script (Sharp)

If you ever need **standalone `.webp` files** (e.g. for a CDN or non-Astro pages), you can use this script. It is **not** required for the current Astro site.

```bash
npm install sharp --save-dev
```

```js
// scripts/convert-to-webp.mjs
import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, extname } from 'path';

const ASSETS = 'src/assets';
const OUT = 'public/webp';

await mkdir(OUT, { recursive: true });
const files = await readdir(ASSETS);
const raster = files.filter((f) => /\.(png|jpe?g)$/i.test(f));

for (const f of raster) {
  const base = f.replace(extname(f), '');
  await sharp(join(ASSETS, f))
    .webp({ quality: 85 })
    .toFile(join(OUT, `${base}.webp`));
  console.log(`${f} → ${base}.webp`);
}
```

Run with `node scripts/convert-to-webp.mjs`. Output goes to `public/webp/`. The Astro app does not use this; it uses the built-in pipeline instead.

---

## Changes Applied in This Audit

- **CTASection:** `footer.png` → quality 80, `decoding="async"` (background).
- **Hero:** `floral_hero.png` → quality 85, eager, `fetchpriority="high"`, `decoding="async"`.
- **ProcessSection:** `clarity.png` → `decoding="async"`.
- **WorkSection:** `wea.png`, `pricing_img.png` → quality 88, `decoding="async"`.
- **AboutSection:** `floral_bg` → quality 80; `portrait2` → lazy + `decoding="async"`; snapshots → quality 85, `decoding="async"`.
- **wea.astro / pricing.astro:** Persona avatars → quality 85, `decoding="async"`.
- **grid-reveal.astro:** Statue → `<Image>` webp 85, lazy, `decoding="async"`; clouds + noise → `getImage` webp 80, used in CSS.
- **Layout:** Added `<slot name="head" />` for page-level head content.
- **index.astro:** Hero image preload via `getImage` + `<link rel="preload" as="image" href={…} />` in `slot="head"`.
- **Layout.astro:** Fixed CSS typo (`color: inherit;ç` → `color: inherit;`).

All `<Image>` usages now have explicit `width`/`height`, `format="webp"`, appropriate `quality`, `loading`, and `decoding="async"` where applicable.

---

## Other Performance Notes

- **Preload:** The hero image (`floral_hero`) is preloaded on the homepage to improve LCP.
- **Lazy loading:** All below-the-fold images use `loading="lazy"`.
- **Unused assets:** `banner.png`, `portrait22.png`, `skylens_img.png`, `torn_dark.png`, and the `phorm` import in `WorkSection` are unused. Consider removing them to simplify the bundle.
- **Dark Renaissance look:** Quality 85–88 for hero, portrait, and portfolio images keeps the desired visual fidelity while reducing file size via WebP.
