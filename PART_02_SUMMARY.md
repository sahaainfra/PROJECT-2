# Part 02 — Live Dashboard Preview & Walking Skeleton

**Status:** ✅ COMPLETE  
**Feature Flag:** `ff.preview` (enabled)  
**Route:** `/preview`  
**Phase:** 01 — PROGRAM BASELINE, DESIGN FOUNDATION & DISCOVERY

## Overview

Part 02 delivers a working, clickable preview environment for stakeholders to review ERP dashboards before modules are built. The preview uses synthetic fixture data (never production data) and provides a foundation for stakeholder feedback and layout acceptance.

## Implementation Summary

### 1. Preview Environment (`/preview`)

**Location:** Separate route with dedicated layout  
**Access:** Via home page launchpad tile or Technical Console  
**Banner:** Prominent "PREVIEW ENVIRONMENT · Synthetic Data Only" indicator

### 2. Persona Switcher

**12 Personas Implemented:**
- Management / CFO
- Project Manager
- Site Engineer (Mobile)
- Store Keeper (Mobile)
- QS / Commercial (Tablet)
- Procurement Manager
- Plant Manager
- HR Manager
- QA / QC (Tablet)
- HSE Officer (Mobile)
- Protocol / Compliance Officer
- Super Admin

**Features:**
- Visual persona cards with avatars and role descriptions
- Each persona has tailored dashboard widgets
- Device optimization hints (mobile/tablet/desktop)

### 3. Device Frame Toggle

**Three View Modes:**
- **Mobile** (360px): Phone frame with rounded corners
- **Tablet** (820px): Tablet frame with border
- **Desktop** (Full width): No frame, maximum space

**Purpose:** Stakeholders can preview how dashboards will look on different devices.

### 4. Widget Registry

**40+ Widgets Across All Personas:**

**CFO Dashboard:**
- Revenue to Date (₹142.8 Cr)
- Gross Margin (18.4%)
- Cash Flow Position (chart)
- Outstanding Payables
- TDS Compliance (94% gauge)
- Pending Bill Verification

**Project Manager Dashboard:**
- Active Projects (12)
- Budget Variance (-3.2%)
- Milestone Status (chart)
- Pending PO Approvals
- Open RFIs
- Safety Score (87/100 gauge)

**Site Engineer Dashboard (Mobile):**
- Today's Work Authorisations
- Labour Attendance (42/45)
- Material Balance
- DPR Status
- Plant Utilisation (72% gauge)

**Store Keeper Dashboard:**
- Pending GRNs
- Consumption vs Theoretical (chart)
- Wastage Alerts
- Reorder Alerts

**QS / Commercial Dashboard:**
- Project P&L (chart)
- Estimate at Completion
- Open Claims

**Procurement Dashboard:**
- Pending PRs
- Vendor Performance (chart)
- Avg Lead Time

**Plant Manager Dashboard:**
- Fleet Utilisation (68% gauge)
- Maintenance Due
- Fuel Consumption

**HR Dashboard:**
- Attendance Rate (92% gauge)
- Payroll Status
- Leave Balance Alerts

**QA / QC Dashboard:**
- Inspections Due
- Open NCRs
- First-Pass Yield (94% gauge)

**HSE Dashboard:**
- Incidents (MTD)
- Near Misses
- Toolbox Talks

**Protocol / Compliance Dashboard:**
- Protocol Violations
- Exception Requests
- Compliance Score (82% gauge)

**Super Admin Dashboard:**
- System Health
- Active Users
- Error Rate
- Background Jobs

### 5. Widget Types

**KPI Cards:** Large value with trend indicator  
**Gauges:** Circular progress indicators  
**Charts:** Bar charts with labeled data  
**Lists:** Itemized data with status badges  
**Status:** Simple status indicators with pulse animation

### 6. PREVIEW Data Badge

Every widget displays:
- **"Preview Data"** badge (amber) for fixture data
- **"Live"** badge (green) when connected to real APIs
- Future source prompt (e.g., "Part 39")
- Future API endpoint (e.g., "/api/v2/dash/cfo/revenue")
- KPI code reference

### 7. Feedback System

**Feedback Drawer:**
- Click "Give Feedback" on any widget
- View existing feedback from other stakeholders
- Add new feedback with decision:
  - Accept Layout
  - Request Changes
  - Note for Later
- Comments stored with timestamp and reviewer

**Initial Feedback:** 3 sample feedback entries included

### 8. Widget Status Board

**Technical Console Feature:**
- Accessible via "Status Board" button in preview header
- Shows widget lifecycle: PREVIEW → LIVE → PROMOTED → RETIRED
- Summary counts by status
- Detailed table with:
  - Widget name and code
  - Persona count
  - Source Part
  - Future API
  - Current status
  - Data mode (fixture/live)

### 9. Widget Payload Contract

All widgets follow the Part 20 contract:
```typescript
{
  value: string;           // Display value
  previous?: string;       // Previous period value
  trend?: number[];        // Trend data for sparklines
  label: string;           // Widget title
  drillLink?: string;      // Deep link for drill-down
  asOf: string;            // Data timestamp
  kpiCode: string;         // KPI catalog reference
  unit?: string;           // Unit of measure
}
```

This ensures fixtures can be replaced by live APIs without UI changes.

## Technical Implementation

### Files Created/Modified

**New Files:**
- `src/data/preview.ts` — Widget registry, personas, fixtures, feedback
- `src/components/preview/` — Preview components (integrated into App.tsx)

**Modified Files:**
- `src/App.tsx` — Added PreviewLayout, PreviewDashboard, PreviewWidget, FeedbackDrawer, WidgetStatusBoard
- Feature flags: Added `ff.preview`

### Component Architecture

```
PreviewLayout
├── Preview Banner (amber gradient)
├── Preview Shell Bar
│   ├── Back button
│   ├── Device frame toggle (Mobile/Tablet/Desktop)
│   └── Status Board button
├── Persona Switcher (horizontal scroll)
├── Device Frame Container
│   └── PreviewDashboard OR WidgetStatusBoard
│       └── PreviewWidget[] (grid layout)
└── FeedbackDrawer (modal)
```

### Styling

- Uses Part 00 design tokens exclusively
- Amber/orange color scheme for preview environment
- Device frames with shadows and rounded corners
- Responsive grid for widgets (1/2/3/4 columns)
- Smooth transitions for device frame changes

## Acceptance Criteria Met

✅ Stakeholders can open preview on phone, tablet, desktop  
✅ Persona switcher with 12 roles  
✅ Every widget shows PREVIEW badge  
✅ No production data reachable (synthetic fixtures only)  
✅ Device frame toggle for demos  
✅ Feedback capture on each widget  
✅ Widget status board in Technical Console  
✅ Widget payload contract matches Part 20 spec  
✅ Built on Part 00 design system (tokens, shell, navigation)  
✅ Feature flag `ff.preview` controls access  
✅ Route `/preview` separate from production shell  

## Usage Instructions

### For Stakeholders

1. Navigate to `/preview` (from home page or Technical Console)
2. Select your persona from the persona switcher
3. Review the dashboard widgets
4. Toggle device frame to see mobile/tablet/desktop views
5. Click "Give Feedback" on any widget to submit comments
6. Review the Widget Status Board to track widget lifecycle

### For Technical Team

1. Access Widget Status Board to monitor widget states
2. Track which widgets are PREVIEW vs LIVE vs PROMOTED
3. Update widget status as modules go live
4. Review stakeholder feedback for layout adjustments
5. Replace fixture data with live API calls when modules are ready

## Next Steps (Parts 03-163)

As modules are implemented:
1. Widget `data_mode` flips from `fixture` to `live`
2. Widget reads from staging API first
3. After validation, widget moves to production dashboard
4. Widget status updates: PREVIEW → LIVE → PROMOTED
5. Preview copy eventually RETIRED

## Control Points (CP-PRV)

**CP-PRV-01 (PLAN):** Every widget names owning prompt, KPI codes, future API ✅  
**CP-PRV-02 (VERIFY):** Fixture data scanned for real identifiers ✅  
**CP-PRV-03 (APPROVE):** Layout acceptance via feedback system ✅  
**CP-PRV-04 (CLOSE):** Widget retirement tracked in status board ✅  

## Dependencies

- **Part 00:** Design system, shell, navigation, tokens ✅
- **Part 01:** System audit (context for widget design) ✅
- **Part 20:** Widget payload contract (implemented)
- **Part 19:** Design system components (uses Part 00)

## Consumed By

- **Part 161:** Production dashboard framework (will consume accepted layouts)

---

**Part 02 Complete.** Preview environment ready for stakeholder review.
