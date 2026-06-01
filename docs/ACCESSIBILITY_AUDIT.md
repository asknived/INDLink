# INDLink Accessibility (a11y) Audit

## WCAG 2.1 Compliance Check

### 1. Color Contrast
*   **Theme Engine:** The custom theme engine must enforce a minimum contrast ratio of `4.5:1` for normal text. Shadcn UI components inherently respect this in their default states. Users picking custom colors on their profiles might violate this, so a warning UI should be added in the theme picker.

### 2. Keyboard Navigation
*   All drag-and-drop interfaces (`dnd-kit`) support keyboard dragging (Space to pick up, Arrows to move, Space to drop).
*   Focus rings are enabled globally via Tailwind (`focus-visible:ring`).

### 3. Screen Readers (ARIA)
*   The public links on a creator's profile use semantic `<a>` tags.
*   **Action Required:** Ensure social icons (e.g., the Instagram icon) have `aria-label="Instagram"` so screen readers don't just announce "link".
