# Prospect CRM — B2B Lead Management & Pipeline Analytics Dashboard

A modern, responsive, production-quality SaaS CRM application built with **Next.js (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Lucide React**, and **Recharts**.

Prospect CRM is designed specifically for enterprise B2B sales teams to track prospects, qualify inbound leads, log activity history and internal memos, and analyze pipeline performance in real time with client-side browser persistence (`localStorage`).

---

## 🚀 Live Demo & Quick Launch

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+ (tested on Node v20.20.2)
- **npm**: v9+ or v10+ (tested on npm 10.8.2)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd PlusUae
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port indicated in your console) to view the application.

### 4. Production Build & Linting
```bash
# Run ESLint to verify code quality
npm run lint

# Compile optimized production build
npm run build

# Start production server
npm run start
```

---

## 🧭 Application Routes

| Route | Description | Key Features |
| :--- | :--- | :--- |
| **`/`** | **Dashboard Overview** | 4 Dynamic KPI metric cards, Recharts 7-Day Activity Area Chart, Lead Qualification Donut Chart, Recent Prospects table with quick-view, Real-time Activity Feed. |
| **`/prospects`** | **Prospects Directory** | Full-text real-time search, multi-filter dropdowns (Status, Industry, Sales Rep), multi-column sorting (Revenue, Company, Employees, Date), pagination (7 per page), row actions (View, Edit, Delete), and accessible delete confirmation dialog. |
| **`/prospects/new`** | **Add Prospect** | Client-side validated form with required field indicators, URL validation, non-negative number checks, representative assignment, and toast notification on success. |
| **`/prospects/[id]`** | **Prospect Details** | Company profile overview, strategic context, quick KPI summary bar, stakeholder contact credentials (`mailto:`, `tel:`, website links), interactive account notes manager, and chronological audit history timeline. |
| **`/prospects/[id]/edit`** | **Edit Prospect** | Pre-populated form allowing seamless updates to corporate attributes, lifecycle status transitions, and assigned representatives. Automatically logs lifecycle events upon saving. |

---

## 🎨 Professional UI Design System

Prospect CRM adheres strictly to a clean, cohesive, enterprise-grade B2B design system:

- **Sidebar Navigation**: Fixed dark desktop sidebar (`bg-slate-900`) with subtle borders (`border-slate-800`), muted typography (`text-slate-300`), active route highlighting (`bg-[#004e9f] text-white`), and a bottom user profile card (`Alex Morgan, CRM Administrator`).
- **Main Canvas**: Warm neutral canvas (`bg-[#f9f9ff]`) providing comfortable contrast and scannability.
- **Card Surfaces**: Clean white surfaces (`bg-white`) framed by subtle borders (`border-slate-200/80`) and rounded corners (`rounded-2xl`).
- **Primary Brand Accent**: Deep enterprise blue (`#004e9f` with hover `#003d7c`) for primary CTAs and interactive focus states.
- **Success Tone**: Emerald green (`#34A853`) for qualified lead states and positive metric trends.
- **Status Badges**:
  - `New`: Neutral blue (`bg-blue-50 text-blue-700 border-blue-200`)
  - `Contacted`: Informational amber (`bg-amber-50 text-amber-800 border-amber-200`)
  - `Qualified`: Success green (`bg-emerald-50 text-emerald-800 border-emerald-200`)
  - `Unqualified`: Subtle rose/red (`bg-rose-50 text-rose-800 border-rose-200`)
- **Responsive Mobile Navigation**: Automatic transformation of desktop sidebar into an accessible slide-over mobile drawer with backdrop blur, focus trap, and Escape key dismissal.

---

## 🏗️ Architecture & Component Hierarchy

```
src/
├── app/
│   ├── globals.css                # Base Tailwind CSS tokens & custom scrollbars
│   ├── layout.tsx                 # Root layout with Inter font, ProspectProvider, & MainLayout
│   ├── page.tsx                   # Route: / (Dashboard Overview)
│   ├── prospects/
│   │   ├── page.tsx               # Route: /prospects (Prospect Management Table & Filters)
│   │   ├── new/
│   │   │   └── page.tsx           # Route: /prospects/new (Create Prospect Form)
│   │   └── [id]/
│   │       ├── page.tsx           # Route: /prospects/[id] (Prospect Details, Timeline, & Notes)
│   │       └── edit/
│   │           └── page.tsx       # Route: /prospects/[id]/edit (Edit Prospect Form)
├── components/
│   ├── layout/
│   │   ├── AppHeader.tsx          # Sticky top bar with breadcrumbs, notifications, & demo reset
│   │   ├── AppSidebar.tsx         # Dark fixed desktop sidebar with brand & profile
│   │   ├── MobileNavigation.tsx   # Mobile drawer with backdrop & keyboard accessibility
│   │   └── MainLayout.tsx         # Layout wrapper with Suspense boundaries for App Router
│   ├── dashboard/
│   │   ├── MetricCard.tsx         # Reusable KPI card with trend calculation
│   │   ├── ProspectActivityChart.tsx # Recharts responsive area chart (last 7 days)
│   │   ├── LeadQualificationChart.tsx # Recharts donut chart with dynamic status breakdown
│   │   ├── RecentProspectsTable.tsx  # Compact recent accounts overview
│   │   └── RecentActivityFeed.tsx    # Chronological audit feed of updates & notes
│   ├── prospects/
│   │   ├── ProspectFilters.tsx    # Real-time search by company name & multi-select filters
│   │   ├── ProspectTable.tsx      # Paginated, sortable table with accessible delete modal
│   │   └── ProspectForm.tsx       # Unified create/edit form with real-time field validation
│   └── ui/
│       ├── Button.tsx             # Reusable button with variants, sizes, & loading spinner
│       ├── ConfirmDialog.tsx      # Accessible delete confirmation dialog (ARIA & Escape key)
│       ├── EmptyState.tsx         # Empty state for 0 search matches or empty lists
│       ├── Pagination.tsx         # Responsive pagination bar with page numbers
│       ├── ProspectStatusBadge.tsx# Styled status indicator badges
│       ├── Skeleton.tsx           # Shimmer loading skeleton states
│       └── Toast.tsx              # Floating toast notification system
├── context/
│   └── ProspectContext.tsx        # React Context providing global reactive state & CRUD methods
├── data/
│   └── seedData.ts                # 20 realistic B2B enterprise prospects with history & notes
├── lib/
│   ├── storage.ts                 # LocalStorage repository with SSR-safety & event logging
│   └── utils.ts                   # Currency, compact numbers, relative date formatters, and cn
└── types/
    └── prospect.ts                # TypeScript interfaces (Prospect, ActivityEvent, NoteItem, etc.)
```

---

## 💾 Data Model & Persistence Strategy

All prospects are stored in client-side `localStorage` under the key `'prospect_crm_records_v1'`.

### Data Model Schema (`Prospect`)
```typescript
export interface Prospect {
  id: string;                      // Stable unique ID (e.g., 'prsp-101')
  companyName: string;             // Legal corporate entity name
  website: string;                 // Valid URL (e.g., 'https://apexcloud.io')
  industry: string;                // Primary operating industry
  country: string;                 // Domicile country
  annualRevenue: number;           // Non-negative integer (e.g., 14500000)
  employeeCount: number;           // Total headcount (e.g., 185)
  assignedEmployee: string;        // Assigned account representative
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  description: string;             // Business model overview & strategic notes
  contactName?: string;            // Optional primary stakeholder name
  contactEmail?: string;           // Optional email address
  contactPhone?: string;           // Optional direct telephone
  createdAt: string;               // ISO 8601 timestamp
  updatedAt: string;               // ISO 8601 timestamp
  activityHistory: ActivityEvent[];// Audit trail of events (status changes, creations, etc.)
  notes?: NoteItem[];              // Collaborative internal notes with author & date
}
```

### Persistence Behaviors:
1. **Initial Seed**: If `localStorage` is empty or cleared, 20 diverse, realistic B2B prospects are automatically loaded.
2. **Reactive State**: Adding, editing, deleting, or adding notes immediately updates all reactive views, table pagination, and dashboard KPI calculations without requiring a page reload.
3. **Audit History Generation**: Modifying a prospect or changing its status automatically appends a timestamped `ActivityEvent` to that prospect's lifecycle history, which feeds directly into the Dashboard activity log.
4. **Reset Demo Utility**: Evaluators can click the **"Reset Demo"** button in the top header at any time to restore the original 20 demo prospects.

---

## 🧪 Verification & Testing Summary

The application has been verified through automated checks, browser automation subagents, and manual testing:

| Verification Phase | Tool / Command | Outcome |
| :--- | :--- | :--- |
| **ESLint Verification** | `npm run lint` | **Passed** with 0 errors and 0 warnings. |
| **Type Checking & Prerender** | `npm run build` | **Passed**. All routes (`/`, `/prospects`, `/prospects/new`, `/prospects/[id]`, `/prospects/[id]/edit`) statically prerendered with dynamic streaming boundaries. |
| **End-to-End Browser Testing** | `browser_subagent` | **Passed**. Complete automated run verifying Dashboard metrics, real-time search, multi-column sorting, pagination, form validation errors, successful prospect creation, note posting, record editing, delete modal cancel/confirm, and mobile viewport drawer. |
| **Responsive Viewports** | Browser resize (`390x844`, `768x1024`, `1440x900`) | **Passed**. Clean layout adaptivity, no horizontal viewport overflows, responsive table scrolling boundaries, and touch-friendly mobile drawer. |

---

## 👥 User Identity

- **Active Profile**: Alex Morgan
- **Role**: CRM Administrator
- **Organization**: Enterprise Hub
