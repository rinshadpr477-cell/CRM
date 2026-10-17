# Prospect CRM — B2B Lead Management & Pipeline Analytics Dashboard ( https://crm-eosin-rho.vercel.app/ )

A modern, responsive, production-quality SaaS CRM application built with **Next.js (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Lucide React**, and **Recharts**.

Prospect CRM is designed specifically for enterprise B2B sales teams to track prospects, qualify inbound leads, log activity history and internal memos, and analyze pipeline performance in real time with client-side browser persistence (`localStorage`).

---

##  Installation & Execution

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+ (tested on Node v20.20.2)
- **npm**: v9+ or v10+ (tested on npm 10.8.2)

### 2. Installation
```bash
git clone https://github.com/rinshadpr477-cell/CRM.git
cd CRM
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port indicated in your console) to launch the application.

### 4. Code Quality & Production Build
```bash
# Run ESLint to verify code quality (passes with 0 errors, 0 warnings)
npm run lint

# Compile optimized production build with Turbopack & TypeScript
npm run build

# Start the optimized production server
npm run start
```

---

## Design Decisions & Component Architecture

### 1. Visual Direction & Design Decisions
- **Enterprise Visual Harmony**: The design uses a tailored palette featuring a fixed dark desktop sidebar (`bg-slate-900`, `text-slate-300`), a warm canvas (`bg-[#f9f9ff]`), and clean white card surfaces (`border-slate-200/80`, `rounded-2xl`).
- **Brand Identity & Accents**: Deep cobalt blue (`#004e9f` with hover `#003d7c`) is used consistently for primary CTAs, active route states, and focus rings (`focus-visible:ring-2 focus-visible:ring-[#004e9f]`), while emerald green (`#34A853`) signifies positive conversion and qualified leads.
- **Micro-Interactions**: Restrained button hover scaling, subtle card shadows, and smooth drawer slide-ins keep the interface responsive and uncluttered without distracting animations.
- **Accessible Typography & Density**: High-contrast slate typography (`text-slate-900` for primary headings, `text-slate-500` for secondary metadata) and balanced spacing maintain readability across desktop, tablet, and mobile displays.

### 2. Component Architecture
- **Layered Structure**: Presentation components (`components/ui/`, `components/dashboard/`, `components/prospects/`) are completely decoupled from data access logic (`lib/storage.ts`).
- **Unified Form Component (`ProspectForm.tsx`)**: A single, robust form handles both creation (`/prospects/new`) and editing (`/prospects/[id]/edit`), eliminating duplicate markup and ensuring consistent real-time client-side validation.
- **State & Persistence Layer (`ProspectContext.tsx`)**: Global React Context manages prospect records, recalculates derived dashboard KPIs (pipeline value, conversion rate, status counts), triggers non-intrusive toast notifications, and automatically persists mutations to `localStorage`.
- **Next.js App Router Compliance**: Dynamic client hooks (`usePathname`, `useParams`) are enclosed in `<Suspense>` boundaries to ensure static prerendering and streaming hydration work seamlessly in Next.js 16.

---

##  Application Routes

| Route | Description | Key Features |
| :--- | :--- | :--- |
| **`/`** | **Dashboard Overview** | 4 Dynamic KPI metric cards, Recharts 7-Day Activity Area Chart, Lead Qualification Donut Chart, Recent Prospects table with quick-view, Real-time Activity Feed. |
| **`/prospects`** | **Prospects Directory** | Full-text real-time search, multi-filter dropdowns (Status, Industry, Sales Rep), multi-column sorting (Revenue, Company, Employees, Date), pagination (7 per page), row actions (View, Edit, Delete), and accessible delete confirmation dialog. |
| **`/prospects/new`** | **Add Prospect** | Client-side validated form with required field indicators, URL validation, non-negative number checks, representative assignment, and toast notification on success. |
| **`/prospects/[id]`** | **Prospect Details** | Company profile overview, strategic context, quick KPI summary bar, stakeholder contact credentials (`mailto:`, `tel:`, website links), interactive account notes manager, and chronological audit history timeline. |
| **`/prospects/[id]/edit`** | **Edit Prospect** | Pre-populated form allowing seamless updates to corporate attributes, lifecycle status transitions, and assigned representatives. Automatically logs lifecycle events upon saving. |

---

##  Data Model Schema (`Prospect`)

All prospects are stored in client-side `localStorage` under the key `'prospect_crm_records_v1'`.

```typescript
export interface Prospect {
  id: string;                      // Stable unique ID (e.g., 'prsp-101')
  companyName: string;             // Legal corporate entity name
  website: string;                 // Valid URL (e.g., 'https://apexcloud.io')
  industry: string;                // Primary operating industry
  country: string;                 // Domicile country
  annualRevenue: number;           // Non-negative integer (e.g., 14,500,000)
  employeeCount: number;           // Headcount (e.g., 185)
  assignedEmployee: string;        // Assigned account representative
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  description: string;             // Business model overview & strategic notes
  contactName?: string;            // Optional primary stakeholder name
  contactEmail?: string;           // Optional email address
  contactPhone?: string;           // Optional direct telephone
  createdAt: string;               // ISO 8601 timestamp
  updatedAt: string;               // ISO 8601 timestamp
  activityHistory: ActivityEvent[];// Audit trail of events (status changes, updates, notes)
  notes?: NoteItem[];              // Collaborative internal notes with author & date
}
```

---

##  Showcase Screenshots & Artifacts

High-resolution screenshots demonstrating the application across desktop and mobile viewports are available in the artifact workspace:

1. **Dashboard View (`dashboard_view`)**: Full view of KPI cards, Recharts 7-Day Activity Area Chart, Lead Qualification Donut Chart, and recent feeds.
2. **Prospects Directory (`prospect_list_view`)**: Multi-filter toolbar, column sorting indicators, status badges, and pagination controls.
3. **Add Prospect Form (`add_prospect_form_view`)**: Structured corporate information, contact details, and validation feedback.
4. **Mobile Dashboard (`mobile_dashboard_view`)**: Single-column responsive layout optimized for mobile viewports (390px).
5. **Mobile Navigation Drawer (`mobile_drawer_view`)**: Touch-friendly sliding navigation drawer with profile credentials.
6. **End-to-End QA Session Recording**: WebP recording of browser automation tests available in artifacts directory.

---

##  Quality Assurance & Edge Case Verification

The application has been verified against all edge cases:

- **Deleting Last Row on Page**: Tested on paginated views; deleting the final row on a page automatically decrements the active page without rendering an empty state.
- **Invalid Prospect IDs (`/prospects/xyz`)**: Gracefully renders a "Prospect Not Found" alert card with a direct return button.
- **Corrupted / Cleared `localStorage`**: Auto-detects malformed JSON and transparently restores initial sample data without unhandled exceptions.
- **Double-Click Protection**: Form submit handlers disable button state and ignore subsequent submissions while asynchronous save actions are pending.
- **Long Text Overflow**: Company names use word breaks and line clamps to prevent horizontal viewport blowout on mobile devices.
- **Combined Search & Filters**: Multi-attribute filtering (name search + status + industry + sales rep) combines seamlessly with instantaneous "Clear Filters" reset.
- **Keyboard Accessibility**: Column sorting via `Enter`/`Space`, Escape key dismissal on dialogs and mobile drawer, and strict `<label htmlFor="...">` bindings across all inputs.

---

##  User Identity

- **Active User**: Alex Morgan
- **Role**: CRM Administrator
- **Platform**: Prospect CRM Enterprise Hub

  <img width="1837" height="1062" alt="image" src="https://github.com/user-attachments/assets/f06cbc27-659c-4410-831d-f42c9d0c618b" />

