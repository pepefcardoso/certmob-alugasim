# RentEasy UI/UX Design & Architecture Guidelines (MVP)

## 1. Design Philosophy: "Conservative Trust with Modern Frictionless UI"

The RentEasy interface must strike a balance between the reliability of traditional financial institutions and the ease-of-use of modern neobanks. The target demographic (40-65 years old, individual investors) requires high legibility, clear actions, and visual math to build trust.

## 2. Visual Identity

### 2.1. Color Palette (shadcn/ui CSS Variables)

- **Primary:** Deep Navy / Slate (`bg-slate-900` / `text-slate-50`). Conveys security, authority, and financial stability.
- **Background:** Off-white/Light Gray (`bg-slate-50`) to reduce eye strain.
- **Cards/Surfaces:** Crisp White (`bg-background`).
- **Semantic Status (Always paired with icons/text for WCAG AA compliance):**
  - _Success/Paid:_ Emerald (`bg-emerald-100 text-emerald-800`).
  - _Warning/Pending:_ Amber (`bg-amber-100 text-amber-800`).
  - _Destructive/Late:_ Rose/Red (`bg-rose-100 text-rose-800`).

### 2.2. Typography

- **Font Family:** Inter or standard sans-serif (clean, geometric).
- **Base Size:** 16px minimum for body text to ensure readability for the core demographic.
- **Line Height:** 1.5 (Relaxed) for body text.

### 2.3. Styling Touches

- **Borders & Radius:** Use subtle rounded corners (`rounded-xl`) to soften the conservative layout without making it look like a toy.
- **Shadows:** Use light, diffused drop shadows (`shadow-sm`) to lift active cards off the background, maintaining a clean visual hierarchy.

## 3. Layout & Ergonomics

- **Grid System:** Strict 8pt spacing system (use Tailwind's `gap-2`, `gap-4`, `gap-6`, `p-4`, `p-6`).
- **Mobile-First Touch Targets:** All interactive elements (buttons, table rows, select dropdowns) must have a minimum 44x44px hit area.
- **Information Architecture:** Place critical alerts (e.g., late payments, pending adjustments) "above the fold" using an F-pattern reading layout.

## 4. Component Architecture (React / Tailwind)

- **Utility & Variants:** Use `cva` (class-variance-authority) to map UI states (Paid, Pending, Late) to Badge and Card components cleanly, avoiding ternary soup.
- **Data Density:** Avoid purely color-coded dashboards. Use list views or grids displaying: Property Address, Tenant Name, Amount, and a text-labeled Status Badge.
- **Accessible Interactions:** Destructive actions (deletions, manual index overrides) must trigger a Radix UI `<Dialog>` confirmation. Forms must include inline validation and helpful placeholders.

## 5. MVP Core Views

1.  **Dashboard (Overview):** Portfolio summary, next 30 days expected income, and actionable alerts.
2.  **Properties & Contracts List:** Tabular or card-based list of properties with active tenant info and contract dates.
3.  **Contract Registration Form:** Grouped form for adding a property, tenant details, and adjustment index.
4.  **Rent Adjustment Modal:** Visual calculator explicitly showing: `Current Rent + (IPCA 4.44%) = New Rent`.
