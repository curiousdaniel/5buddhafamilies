# Feature Prompt: Add Five Buddha & Five Luminous Kings Imagery to Results Page

## Overview

We have a set of traditional Buddhist images sourced from Wikipedia stored in `/public/graphics/`. We want to incorporate these images meaningfully and beautifully into the results page, associating each image with its corresponding Buddha Family. The goal is to make the results page feel visually rich, sacred, and grounded in the actual iconographic tradition — not decorative for its own sake.

---

## The Image Assets

All images are located in `/public/graphics/`. The mapping of images to families is as follows:

### Five Buddhas

| Family | Buddha | Filename |
|--------|--------|----------|
| Vajra | Akshobhya Buddha | `Aksobhya_Buddha.gif` |
| Padma | Amitabha Buddha | `Amitabha_Buddha_in_Tangka.jpg` |
| Ratna | Ratnasambhava Buddha | `Ratnasambhava3.gif` |
| Karma | Amoghasiddhi Buddha | `Amoghasiddhi_Buddha.jpg` |
| Buddha | Vairocana Buddha | `Saravid_Vairocana.jpg` |

### Five Luminous Kings (Vidyarajas)

| Family | Luminous King | Filename |
|--------|--------------|----------|
| Vajra | Trailokyavijaya | `Trailokya-vijaya-raja.jpg` |
| Padma | Yamantaka | `Yamantaka_Luminous_King.jpg` |
| Ratna | Kundali | `Kundali_Luminous_King.jpg` |
| Karma | Vajrayaksha | `Vajra-yaksa_Luminous_King.jpg` |
| Buddha | Acala | `Acala_Vidya-Raja.jpg` |

---

## Where to Use the Images

### 1. Results Page Header

In the results page header — where the user's primary family name is displayed — add the **Buddha image** for their primary family as a prominent hero visual. It should appear above or beside the family name, large and centered, treated reverentially. Apply a subtle glow or soft drop shadow using the family's signature color. Do not crop or distort the image — display it at its natural proportions within a defined max-width container (around 280–320px wide on desktop, smaller on mobile).

Below the Buddha image, display the Buddha's name in small elegant caption text (e.g., *"Akshobhya Buddha"*) in a muted color.

### 2. Primary Family Deep-Dive Section

In the section dedicated to the user's primary family interpretation, display **both images** for that family — the Buddha and the Luminous King — side by side or stacked, depending on available layout space. Each image should have a small caption identifying it by name and role (e.g., *"Akshobhya Buddha — Mirror-Like Wisdom"* and *"Trailokyavijaya — Luminous King of the Vajra Family"*).

### 3. Family Composition Accordion / All-Five-Families Section

In the expandable section where all five families are shown, display the **Buddha image** for each family as a small thumbnail (approximately 80–100px wide) alongside that family's name and description. This gives users a visual anchor for each family as they explore their full composition.

### 4. Module Cards (Optional Enhancement)

If the Spiritual Practice module (`spiritual_overview`) has been generated and is displayed, consider showing the relevant Buddha image again within that module's content area as a decorative aside — since that module goes deepest into the iconographic tradition and practitioners will find it meaningful.

---

## Image Display Guidelines

**Aspect ratio:** Never force images into square crops. These are traditional thangka paintings and sculptures with varying proportions. Use `object-fit: contain` within a defined container, not `object-fit: cover`.

**Background:** Display images against a very dark background (matching the app's dark theme) or with a subtle semi-transparent dark overlay behind them. Do not place them on white or light backgrounds — it will look jarring against the app's aesthetic.

**Border treatment:** A thin border in the family's signature color (low opacity, around 30–40%) looks elegant and grounds the image within the design system without being heavy-handed.

**Loading:** Use Next.js `<Image>` component for all images to ensure proper optimization and lazy loading. Set appropriate `width` and `height` props based on intended display size.

**Alt text:** All images must have descriptive alt text, e.g., `"Akshobhya Buddha, representing Mirror-Like Wisdom of the Vajra Family"`.

**Captions:** All images should have visible caption text below them in a small, elegant, muted style — italic, slightly smaller than body text. Captions should include the figure's name and their role or wisdom quality.

---

## Family Color Reference (for glow/border effects)

| Family | Hex Color |
|--------|-----------|
| Buddha | `#E8E4DC` (warm white/pearl) |
| Vajra | `#1B3A6B` (deep blue) |
| Ratna | `#D4A017` (golden yellow) |
| Padma | `#B22222` (crimson red) |
| Karma | `#2D6A4F` (forest green) |

---

## Implementation Notes

- Create a data structure (either within `families.ts` or a new `familyImages.ts` file) that maps each family code to its Buddha image path, Buddha name, Luminous King image path, and Luminous King name. This keeps the image associations centralized and easy to maintain.

```typescript
type FamilyImages = {
  buddhaImage: string;
  buddhaName: string;
  luminousKingImage: string;
  luminousKingName: string;
  luminousKingSanskrit: string;
};
```

- The images are a mix of `.jpg` and `.gif` formats. Both work fine with the Next.js `<Image>` component but note that `.gif` files will not animate (they are static in this case).

- On mobile, reduce image sizes significantly — the header Buddha image should be no wider than 180px on small screens, and the accordion thumbnails can drop to 60px.

- Do not add images to the PDF export automatically — the current PDF layout may not accommodate them gracefully. Leave PDF image inclusion as a future enhancement unless it is straightforward to implement cleanly.
