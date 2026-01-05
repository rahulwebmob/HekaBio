# Phase 1: Client Requirements Mapping & Implementation Plan

**Document Version**: 1.0
**Date**: January 5, 2026
**Status**: Analysis Complete - Ready for Implementation
**Client Feedback**: "Overall feel is good" ✅

---

## Executive Summary

This document maps client-provided requirements against the current Phase 1 implementation, identifies gaps, and provides a clear action plan. The analysis focuses ONLY on Phase 1 (CRM/Project Management). Phase 2 items (ERP/SCM: Products, Orders, Inventory) are explicitly excluded.

### Key Findings

**✅ Good News**: Client likes the overall feel
**⚠️ Issues Found**: Navigation confusion - duplicate pages for the same workflow
**📋 Missing**: Enhanced fields, expanded templates, tighter integration

---

## Table of Contents

1. [Client Requirements Analysis](#1-client-requirements-analysis)
2. [Current Implementation Review](#2-current-implementation-review)
3. [Gap Analysis & Issues](#3-gap-analysis--issues)
4. [What to Remove](#4-what-to-remove)
5. [What to Consolidate](#5-what-to-consolidate)
6. [What to Add/Expand](#6-what-to-addexpand)
7. [Implementation Roadmap](#7-implementation-roadmap)

---

## 1. Client Requirements Analysis

### 1.1 Client-Provided Documents

| Document | Lines/Fields | Phase | Status |
|----------|--------------|-------|--------|
| **Project Filtering Flow** | Diagram | Phase 1 | ✅ Analyze |
| **Opportunity Assessment** | Flow (50 screens → assessment → contracts) | Phase 1 | ✅ Analyze |
| **Address Book Structure** | Table with key fields | Phase 1 | ✅ Analyze |
| **Survey 1 (Comprehensive)** | 134 fields | Phase 1 | ⚠️ Need to expand |
| **Screening Assessment** | 63 fields | Phase 1 | ✅ Implemented |
| **Due Diligence** | 94 items | Phase 1 | ⚠️ Need to expand |
| **Survey 2 (Technical)** | 55 fields | Phase 1 | ⚠️ Need to implement |
| **ERP SCM Flow** | Diagram | **Phase 2** | ⏭️ Skip for now |
| **Product List** | 24 fields | **Phase 2** | ⏭️ Skip for now |
| **Order Form** | 37 fields | **Phase 2** | ⏭️ Skip for now |
| **Inventory Management** | Japanese tracking table | **Phase 2** | ⏭️ Skip for now |
| **Automation vs AI** | 14 lines | Phase 1 | ✅ Reference |

### 1.2 Client's Expected Flow (from diagrams)

```
┌─────────────────────────────────────────────────────────────────┐
│                      PHASE 1: LEAD TO PROJECT                    │
└─────────────────────────────────────────────────────────────────┘

Case 1 (Cold Reach):
   Survey Form → Submit → Data to HekaBio DB

Case 2 (Warm Reach):
   HR/Address Book → Send Introduction → Data to HekaBio DB

Case 3 (Warm Reach):
   Request Introduction → Data to HekaBio DB

                    ↓
        ┌───────────────────────┐
        │  Screening: AI Analysis│  ← Should be ONE workflow
        │  - Missing info list   │
        │  - Internal meeting    │
        │  - External meeting    │
        └───────────────────────┘
                    ↓
          Monitor → Decision
                    ↓
            ┌──────┴──────┐
            │             │
          YES            NO
            │             │
    Proceed to Business   Exit
    (Request NDA,
     All Due Diligence)
            │
      → Contract
```

**CLIENT'S INTENT**:
- ONE unified Opportunity workflow (not separate Opportunities, Lead Scoring, Screenings pages)
- Flow from Data Gathering (50 screens) → Opportunity Assessment → Decision → Contract

---

## 2. Current Implementation Review

### 2.1 Current Sidebar Menu (19 Items)

```
✅ = Good | ⚠️ = Needs Work | ❌ = Should Remove/Consolidate

1.  ✅ Dashboard
2.  ✅ Projects
3.  ⚠️ Opportunities          ← Should contain Lead Scoring + Screening
4.  ❌ Lead Scoring           ← REMOVE: Should be tab in Opportunities
5.  ❌ Screenings             ← REMOVE: Should be tab in Opportunities
6.  ✅ Pipeline
7.  ✅ Surveys
8.  ✅ Survey Templates
9.  ✅ Automation
10. ✅ Communications
11. ✅ Tasks
12. ✅ Notifications
13. ✅ Calendar
14. ✅ Documents
15. ⚠️ Contracts             ← OPTIONAL: Merge with NDAs into "Legal"
16. ⚠️ NDAs                  ← OPTIONAL: Merge with Contracts into "Legal"
17. ✅ Due Diligence
18. ❌ Companies             ← REMOVE: Merge with Contacts into "Address Book"
19. ❌ Contacts              ← REMOVE: Merge with Companies into "Address Book"
```

**RECOMMENDATION**: Reduce from **19 items → 15 items** (or 14 if Legal consolidation is done)

### 2.2 Current Routes

| Route | Page | Issue | Action |
|-------|------|-------|--------|
| `/opportunities` | OpportunitiesPage.tsx | ✅ Keep, but enhance | Enhance |
| `/lead-scoring` | LeadScorePage.tsx | ❌ Separate page | Remove, merge into Opportunities |
| `/screenings` | ScreeningsPage.tsx | ❌ Separate page | Remove, merge into Opportunities |
| `/companies` | CompaniesPage.tsx | ❌ Separate from Contacts | Merge into Address Book |
| `/contacts` | ContactsPage.tsx | ❌ Separate from Companies | Merge into Address Book |
| `/contracts` | ContractsPage.tsx | ⚠️ Could merge with NDAs | Optional: merge into Legal |
| `/ndas` | NDAPage.tsx | ⚠️ Could merge with Contracts | Optional: merge into Legal |

### 2.3 Current Data Model: Company

```typescript
// ❌ CURRENT (Missing Fields)
interface Company {
  id: ID;
  name: string;
  roles: CompanyRole[];
  country: string;
  address?: Address;
  website?: URL;
  diseaseArea?: string[];  // ✅ Has this (but named incorrectly - should be diseaseAreas)

  // ❌ MISSING FROM CLIENT REQUIREMENTS:
  // - modalities (Drug, Device, Diagnostic, Digital Health)
  // - managementContact (name, email)
  // - bdContact (BD Contact name, email)
  // - rdContact (R&D Contact name, email)
  // - focusedTherapeuticArea (Oncology, Cardiology, etc.)
}
```

**CLIENT EXPECTS** (from Address Book table):
- Management Contact (Name + Email)
- BD Contact (Name + Email)
- R&D Contact (Name + Email)
- Website
- Focused Therapeutic Area
- Focused Disease Area (Breast Cancer, Diabetes, etc.)
- Modality (Drug, Device, Diagnostic, Digital Health)

---

## 3. Gap Analysis & Issues

### 3.1 Critical Issues

#### Issue #1: Navigation Confusion 🚨

**Problem**: Users see 3 separate menu items for lead assessment workflow:

```
Current Sidebar (CONFUSING):
├─ Opportunities        ← "I have a new lead, where do I go?"
├─ Lead Scoring         ← "Or here? What's the difference?"
└─ Screenings           ← "Or here?"
```

**User Impact**:
- Confusion about where to create a new lead
- Don't understand the difference between Opportunities, Lead Scoring, and Screenings
- Workflow feels fragmented

**Solution**: Consolidate into ONE page with tabs

```
RECOMMENDED: Single Workflow
└─ Opportunities
   └─ Click an opportunity → Detail page with tabs:
      ├─ Overview
      ├─ Quick Assessment (10 questions from client's "50 screens")
      ├─ Lead Scoring (auto-calculated from assessment)
      ├─ Screening Assessment (TRL, market, competitive analysis)
      └─ Go/No-Go Decision
```

#### Issue #2: Companies + Contacts Separation 🚨

**Problem**: Client's "Address Book" concept shows Companies and Contacts as one unified view with tabs, but current implementation has separate pages.

**Client Expectation** (from Address Book table):
- One "Address Book" menu item
- Inside: tabs for Companies | Contacts
- Company record shows key contacts inline

**Current Implementation**:
- Separate "Companies" menu item
- Separate "Contacts" menu item
- No clear relationship

**Solution**: Create unified `AddressBookPage.tsx` with tabs

#### Issue #3: Missing Company Fields

**Client Requirements** (from Address Book table):

| Field | Client Needs | Current Implementation | Status |
|-------|--------------|------------------------|--------|
| Management Contact | Name + Email | ❌ Missing | Add |
| BD Contact | Name + Email | ❌ Missing | Add |
| R&D Contact | Name + Email | ❌ Missing | Add |
| Website | URL | ✅ Has | OK |
| Focused Therapeutic Area | Dropdown | ✅ Has | OK |
| Focused Disease Area | Multi-select | ⚠️ Has `diseaseArea` but single | Fix to array |
| Modality | Multi-select | ❌ Missing | Add |

### 3.2 Template Gaps

| Template Type | Client Needs | Current Status | Gap |
|--------------|--------------|----------------|-----|
| **Survey 1 (Comprehensive Intake)** | 134 fields (9 sections) | ~20 basic fields | +114 fields |
| **Survey 2 (Technical Deep-Dive)** | 55 fields (5 sections) | ❌ Not implemented | +55 fields |
| **Contract Types** | 7 specific types:<br>1. Strategic Contract with Originator<br>2. Product Sales (Reimbursed)<br>3. Product Sales (Patient Pay)<br>4. Clinical Development Services<br>5. PMS Development Services<br>6. Finders/Distributor<br>7. MAH/DMAH Services | Generic contract templates | Need 7 templates |
| **Due Diligence Checklist** | 94 items (9 sections) | Basic structure ~30 items | +64 items |

### 3.3 Phase 2 Items (IGNORE FOR NOW)

The following client documents are **Phase 2** (ERP/SCM) and should NOT be implemented in Phase 1:

❌ **Product List** (24 fields) - Product catalog management
❌ **Order Form** (37 fields) - Order management system
❌ **Inventory Management** - Japanese radiation source tracking
❌ **ERP SCM Flow** - Shipment tracking, customs, hospital delivery

**Recommendation**: Create a separate `PHASE2_ERP_SCM_PLAN.md` after Phase 1 completion.

---

## 4. What to Remove

### 4.1 Pages to Remove from Sidebar

#### Remove #1: Lead Scoring (standalone page)

**Current**:
- Menu item: "Lead Scoring"
- Route: `/lead-scoring`
- Page: `LeadScorePage.tsx`

**Action**:
1. Remove menu item from `AppSidebar.tsx` (line 59-69)
2. Keep route for redirects: `/lead-scoring` → `/opportunities` (with message)
3. Convert `LeadScorePage.tsx` logic into `LeadScoringTab.tsx` component
4. Integrate as tab in Opportunity detail view

#### Remove #2: Screenings (standalone page)

**Current**:
- Menu item: "Screenings"
- Route: `/screenings`
- Page: `ScreeningsPage.tsx`

**Action**:
1. Remove menu item from `AppSidebar.tsx` (line 71-81)
2. Keep route for redirects: `/screenings` → `/opportunities`
3. Convert `ScreeningsPage.tsx` into `ScreeningTab.tsx` component
4. Integrate as tab in Opportunity detail view

#### Remove #3: Companies (standalone page)

**Current**:
- Menu item: "Companies"
- Route: `/companies`
- Page: `CompaniesPage.tsx`

**Action**:
1. Remove menu item from `AppSidebar.tsx` (line 174-184)
2. Redirect route: `/companies` → `/address-book?tab=companies`
3. Convert `CompaniesPage.tsx` into `CompaniesTab.tsx` component
4. Use in new `AddressBookPage.tsx`

#### Remove #4: Contacts (standalone page)

**Current**:
- Menu item: "Contacts"
- Route: `/contacts`
- Page: `ContactsPage.tsx`

**Action**:
1. Remove menu item from `AppSidebar.tsx` (line 186-196)
2. Redirect route: `/contacts` → `/address-book?tab=contacts`
3. Convert `ContactsPage.tsx` into `ContactsTab.tsx` component
4. Use in new `AddressBookPage.tsx`

### 4.2 Optional: Legal Consolidation

**Current**:
- Contracts (separate menu item)
- NDAs (separate menu item)

**Recommendation** (Optional):
- Consolidate into "Legal" menu item
- Inside: tabs for Contracts | NDAs
- Benefits: Cleaner sidebar, logical grouping

**Decision**: Ask client preference

---

## 5. What to Consolidate

### 5.1 Opportunities Workflow Consolidation

**Goal**: Create ONE unified workflow from lead to project conversion

**New Structure**:

```typescript
// NEW FILE: src/pages/OpportunityDetailPage.tsx
export default function OpportunityDetailPage() {
  const { id } = useParams();
  const opportunity = useAppSelector(state =>
    state.opportunities.opportunities.find(o => o.id === id)
  );

  return (
    <AppLayout>
      <Tabs>
        <Tab label="Overview" icon={<IconInfoCircle />}>
          <OpportunityOverview opportunity={opportunity} />
          {/* Basic info, company, contacts, timeline */}
        </Tab>

        <Tab
          label="Quick Assessment"
          icon={<IconCheckbox />}
          disabled={opportunity.status === 'NEW'}
        >
          <QuickAssessmentTab opportunity={opportunity} />
          {/* 10-question assessment from client's "50 screens" concept */}
        </Tab>

        <Tab
          label="Lead Scoring"
          icon={<IconTrendingUp />}
          disabled={!opportunity.quickAssessment}
        >
          <LeadScoringTab opportunity={opportunity} />
          {/* Auto-calculated score from Quick Assessment */}
          {/* Logic moved from LeadScorePage.tsx */}
        </Tab>

        <Tab
          label="Screening Assessment"
          icon={<IconThermometer />}
          disabled={opportunity.leadScore < 60}
        >
          <ScreeningTab opportunity={opportunity} />
          {/* TRL, therapeutic fit, market assessment */}
          {/* Logic moved from ScreeningsPage.tsx */}
        </Tab>

        <Tab
          label="Go/No-Go Decision"
          icon={<IconChecks />}
          disabled={!opportunity.screeningCompleted}
        >
          <GoNoGoDecisionTab opportunity={opportunity} />
          {/* Final decision → creates Project if GO */}
        </Tab>
      </Tabs>
    </AppLayout>
  );
}
```

**Progressive Disclosure**: Tabs unlock as previous steps complete

### 5.2 Address Book Consolidation

**Goal**: Unified view of Companies and Contacts

**New Structure**:

```typescript
// NEW FILE: src/pages/AddressBookPage.tsx
export default function AddressBookPage() {
  const [activeTab, setActiveTab] = useState<'companies' | 'contacts'>('companies');

  // Get tab from URL (?tab=companies or ?tab=contacts)
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'contacts') setActiveTab('contacts');
  }, [location]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1>Address Book</h1>
          <div className="flex gap-2">
            <Button onClick={() => exportToCSV()}>Export CSV</Button>
            <Button onClick={() => importCSV()}>Import CSV</Button>
          </div>
        </div>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tab value="companies" label="Companies" icon={<IconBuilding />}>
            <CompaniesTab />
            {/* Reuse logic from CompaniesPage.tsx */}
          </Tab>
          <Tab value="contacts" label="Contacts" icon={<IconUser />}>
            <ContactsTab />
            {/* Reuse logic from ContactsPage.tsx */}
          </Tab>
        </Tabs>
      </div>
    </AppLayout>
  );
}
```

### 5.3 Optional: Legal Consolidation

**New Structure**:

```typescript
// OPTIONAL FILE: src/pages/LegalPage.tsx
export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<'contracts' | 'ndas'>('contracts');

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1>Legal Documents</h1>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tab value="contracts" label="Contracts" icon={<IconContract />}>
            <ContractsTab />
          </Tab>
          <Tab value="ndas" label="NDAs" icon={<IconShieldCheck />}>
            <NDATab />
          </Tab>
        </Tabs>
      </div>
    </AppLayout>
  );
}
```

---

## 6. What to Add/Expand

### 6.1 Company Fields (High Priority)

**Current Company Type**:
```typescript
// src/types/company.types.ts
export interface Company {
  id: ID;
  name: string;
  roles: CompanyRole[];
  country: string;
  address?: Address;
  website?: URL;
  diseaseArea?: string[];  // EXISTS but needs rename

  // ❌ MISSING:
  // - modalities
  // - managementContact
  // - bdContact
  // - rdContact
  // - focusedTherapeuticArea
}
```

**UPDATED Company Type** (to match client requirements):

```typescript
export type Modality =
  | 'DRUG'
  | 'DEVICE'
  | 'DIAGNOSTIC'
  | 'DIGITAL_HEALTH'
  | 'COMBINATION';

export interface KeyContact {
  name: string;
  email: Email;
  contactId?: ID;  // Optional link to Contact record
}

export interface Company {
  id: ID;
  name: string;
  roles: CompanyRole[];
  country: string;
  address?: Address;
  website?: URL;

  // Categorization (from client requirements)
  focusedTherapeuticArea?: string;  // "Oncology", "Cardiology", etc.
  diseaseAreas: string[];  // Rename from diseaseArea (was singular)
  modalities: Modality[];  // NEW: Drug, Device, Diagnostic, Digital Health

  // Key Contacts (from client Address Book table)
  managementContact?: KeyContact;  // NEW: Management contact
  bdContact?: KeyContact;  // NEW: BD contact
  rdContact?: KeyContact;  // NEW: R&D contact

  // ... rest of fields
}
```

**Action Items**:
1. Update `company.types.ts` with new fields
2. Update `CompanyFormPage.tsx` to include new fields:
   - Multi-select for `modalities`
   - 3 key contact fields (name + email each)
3. Update `CompanyDetailPage.tsx` to display new fields
4. Update mock data with realistic values

### 6.2 Survey Template Expansion (High Priority)

#### Survey 1: Comprehensive Intake (134 fields)

**Client Provided**: 134 fields across 9 sections

**Sections from Client Document**:
1. Company & Contact Information (~10 fields)
2. Partnership Interest (~8 fields)
3. Technology & Product Information (~25 fields)
4. Development Status & Regulatory (~15 fields)
5. Market & Commercialization (~15 fields)
6. Intellectual Property (~10 fields)
7. Financial Information (~12 fields)
8. Team & Capabilities (~10 fields)
9. Partnership Expectations (~5 fields)

**Current Status**: Basic survey template with ~20 fields

**Action**: Expand to 134 fields matching client's structure

**File to Modify**: `src/data/mockSurveys.ts` or create `comprehensiveIntakeSurvey.ts`

**Sample Expanded Structure**:
```typescript
export const COMPREHENSIVE_INTAKE_SURVEY: SurveyTemplate = {
  id: 'template-comprehensive-intake',
  title: 'Comprehensive Partnership Intake Survey',
  description: 'Detailed assessment for partnership opportunities',
  sections: [
    {
      id: 'section-1',
      title: 'Company & Contact Information',
      questions: [
        { id: 'q1-1', type: 'SHORT_TEXT', question: 'Company Name', required: true },
        { id: 'q1-2', type: 'EMAIL', question: 'Primary Contact Email', required: true },
        { id: 'q1-3', type: 'SHORT_TEXT', question: 'Primary Contact Name', required: true },
        { id: 'q1-4', type: 'SHORT_TEXT', question: 'Job Title', required: true },
        { id: 'q1-5', type: 'PHONE', question: 'Phone Number', required: false },
        { id: 'q1-6', type: 'URL', question: 'Company Website', required: false },
        { id: 'q1-7', type: 'SHORT_TEXT', question: 'Company Location', required: true },
        { id: 'q1-8', type: 'DROPDOWN', question: 'Company Size', required: true,
          options: ['1-10', '11-50', '51-200', '201-500', '500+'] },
        { id: 'q1-9', type: 'NUMBER', question: 'Year Founded', required: false },
        { id: 'q1-10', type: 'LONG_TEXT', question: 'Brief Company Description', required: true },
      ],
    },
    {
      id: 'section-2',
      title: 'Partnership Interest',
      questions: [
        {
          id: 'q2-1',
          type: 'MULTIPLE_CHOICE',
          question: 'What type of partnership are you interested in?',
          required: true,
          options: [
            'Distribution Rights',
            'Co-Development',
            'Licensing Agreement',
            'Investment Opportunity',
            'Manufacturing Partnership',
            'Clinical Trial Collaboration',
            'Other'
          ]
        },
        // ... 7 more questions
      ],
    },
    // ... 7 more sections with total 134 fields
  ],
};
```

#### Survey 2: Technical Deep-Dive (55 fields)

**Client Provided**: 55 fields across 5 sections

**Sections**:
1. Technical Specifications (~15 fields)
2. Clinical Data (~12 fields)
3. Regulatory Status (~10 fields)
4. Manufacturing & Supply Chain (~10 fields)
5. Intellectual Property Details (~8 fields)

**Current Status**: ❌ Not implemented

**Action**: Create new survey template

### 6.3 Contract Templates (Medium Priority)

**Client Requires**: 7 specific contract types

**From Client Document**:
1. **Strategic Contract with Originator** (1-3 agreements/year)
2. **Product Sales (Reimbursed) Contract**
3. **Product Sales (Patient Pay) Contract**
4. **Clinical Development Services Contract**
5. **PMS Development Services Contract**
6. **Finders / Distributor Contract**
7. **MAH/DMAH Services Contract**

**Current Status**: Generic contract templates

**Action**: Create 7 specific templates in `src/data/mockContracts.ts`

**Sample Structure**:
```typescript
export const CONTRACT_TEMPLATES = {
  STRATEGIC_ORIGINATOR: {
    id: 'template-strategic-originator',
    type: 'STRATEGIC_ORIGINATOR',
    name: 'Strategic Contract with Originator',
    description: '1-3 agreements per year with technology originators',
    sections: [
      'Definitions',
      'Scope of Partnership',
      'Territory & Rights (Japan focus)',
      'Financial Terms (Upfront + Milestones + Royalties)',
      'Development Responsibilities',
      'Regulatory Strategy',
      'Intellectual Property Rights',
      'Confidentiality',
      'Term & Termination',
      'Dispute Resolution'
    ],
    clauses: [
      // Pre-defined clauses for this contract type
    ]
  },
  PRODUCT_SALES_REIMBURSED: {
    id: 'template-product-sales-reimbursed',
    type: 'PRODUCT_SALES_REIMBURSED',
    name: 'Product Sales (Reimbursed) Contract',
    description: 'For products with reimbursement pathway',
    sections: [
      'Product Specifications',
      'Pricing & Reimbursement',
      'Distribution Rights',
      'Marketing & Promotion',
      'Quality Assurance',
      'Post-Marketing Surveillance',
      'Regulatory Compliance',
      'Payment Terms',
      'Term & Renewal'
    ]
  },
  // ... 5 more templates
};
```

### 6.4 Due Diligence Checklist Expansion (Medium Priority)

**Client Requires**: 94 items across 9 sections

**From Client Document** (sections):
1. Executive Summary (5 items)
2. Technology / Scientific DD (10 items)
3. Regulatory DD (11 items)
4. Commercial DD (10 items)
5. Financial DD (10 items)
6. Legal DD (10 items)
7. Operational DD (9 items)
8. Strategic Fit (6 items)
9. Overall Risk Assessment (10 items)

**Current Status**: Basic DD structure with ~30 items

**Action**: Expand to 94 items in `src/data/mockDDTemplates.ts`

---

## 7. Implementation Roadmap

### Phase 1A: Consolidation & Cleanup (Week 1-2)

**Goal**: Simplify navigation, remove duplicate pages

#### Week 1: Opportunity Consolidation

**Day 1-2**: Remove Duplicate Menu Items
- [ ] Remove "Lead Scoring" from `AppSidebar.tsx` (line 59-69)
- [ ] Remove "Screenings" from `AppSidebar.tsx` (line 71-81)
- [ ] Add redirect routes in `src/routes/index.tsx`

**Day 3-5**: Create Unified Opportunity Detail Page
- [ ] Create `src/pages/OpportunityDetailPage.tsx` with 5 tabs
- [ ] Convert `LeadScorePage.tsx` logic to `LeadScoringTab.tsx` component
- [ ] Convert `ScreeningsPage.tsx` logic to `ScreeningTab.tsx` component
- [ ] Implement progressive tab unlocking
- [ ] Update `opportunitiesSlice.ts` with new fields:
  ```typescript
  interface Opportunity {
    // ... existing
    leadScore?: number;
    screeningId?: string;
    screeningCompleted: boolean;
    quickAssessment?: QuickAssessmentData;
  }
  ```
- [ ] Test end-to-end opportunity flow

**Acceptance Criteria**:
- [ ] Users can no longer access `/lead-scoring` or `/screenings` as standalone pages
- [ ] All functionality accessible through unified Opportunity detail page
- [ ] Tabs unlock progressively (can't skip ahead)
- [ ] No broken links or console errors

#### Week 2: Address Book Consolidation

**Day 1-2**: Remove Company/Contact Separation
- [ ] Remove "Companies" from `AppSidebar.tsx` (line 174-184)
- [ ] Remove "Contacts" from `AppSidebar.tsx` (line 186-196)
- [ ] Add "Address Book" menu item to `AppSidebar.tsx`

**Day 3-4**: Create Unified Address Book Page
- [ ] Create `src/pages/AddressBookPage.tsx` with 2 tabs
- [ ] Create `src/components/features/addressbook/CompaniesTab.tsx` (reuse CompaniesPage logic)
- [ ] Create `src/components/features/addressbook/ContactsTab.tsx` (reuse ContactsPage logic)
- [ ] Add redirects: `/companies` → `/address-book?tab=companies`
- [ ] Add redirects: `/contacts` → `/address-book?tab=contacts`
- [ ] Add export/import functionality to Address Book page

**Day 5**: Add Missing Company Fields
- [ ] Update `company.types.ts`:
  - Add `Modality` type
  - Add `KeyContact` interface
  - Add fields: `modalities`, `managementContact`, `bdContact`, `rdContact`
  - Rename `diseaseArea` → `diseaseAreas` (plural)
- [ ] Update `CompanyFormPage.tsx`:
  - Add "Modalities" multi-select
  - Add "Management Contact" (name + email)
  - Add "BD Contact" (name + email)
  - Add "R&D Contact" (name + email)
- [ ] Update `CompanyDetailPage.tsx` to display new fields
- [ ] Update mock data with new fields

**Acceptance Criteria**:
- [ ] Sidebar shows "Address Book" instead of separate Companies/Contacts
- [ ] Address Book page has tabs that switch between Companies and Contacts
- [ ] Old routes redirect correctly with tab parameter
- [ ] Company form has all client-required fields
- [ ] Export/Import works with new fields

### Phase 1B: Template Expansion (Week 3-5)

**Goal**: Match client's comprehensive template requirements

#### Week 3: Survey 1 Expansion (134 fields)

**Day 1-2**: Section 1-3 (Company Info, Partnership Interest, Technology)
- [ ] Expand Company & Contact Information section (10 fields)
- [ ] Expand Partnership Interest section (8 fields)
- [ ] Expand Technology & Product Information section (25 fields)

**Day 3-4**: Section 4-6 (Development, Market, IP)
- [ ] Expand Development Status & Regulatory section (15 fields)
- [ ] Expand Market & Commercialization section (15 fields)
- [ ] Expand Intellectual Property section (10 fields)

**Day 5**: Section 7-9 (Financial, Team, Partnership)
- [ ] Expand Financial Information section (12 fields)
- [ ] Expand Team & Capabilities section (10 fields)
- [ ] Expand Partnership Expectations section (5 fields)
- [ ] Test survey end-to-end, ensure conditional logic works

**File**: `src/data/mockSurveys.ts` or create new file `comprehensiveIntakeSurvey.ts`

**Acceptance Criteria**:
- [ ] Survey 1 has 134+ fields across 9 sections
- [ ] All question types render correctly
- [ ] Conditional logic works (questions show/hide based on answers)
- [ ] Required validation works
- [ ] Survey can be submitted and responses stored

#### Week 4: Survey 2 + Contract Templates

**Day 1-2**: Create Survey 2 (55 fields)
- [ ] Create Technical Deep-Dive survey template
- [ ] 5 sections: Technical Specs, Clinical Data, Regulatory, Manufacturing, IP Details
- [ ] Test and validate

**Day 3-5**: Create 7 Contract Templates
- [ ] Strategic Contract with Originator
- [ ] Product Sales (Reimbursed) Contract
- [ ] Product Sales (Patient Pay) Contract
- [ ] Clinical Development Services Contract
- [ ] PMS Development Services Contract
- [ ] Finders / Distributor Contract
- [ ] MAH/DMAH Services Contract
- [ ] Update contract types in `contract.types.ts`
- [ ] Update contract creation flow to use new templates

**Acceptance Criteria**:
- [ ] Survey 2 has 55+ fields across 5 sections
- [ ] 7 contract templates available when creating contracts
- [ ] Each template has appropriate sections and clauses
- [ ] Templates are selectable in contract creation flow

#### Week 5: DD Checklist Expansion

**Day 1-3**: Expand DD Checklist (94 items)
- [ ] Expand Executive Summary (5 items)
- [ ] Expand Technology / Scientific DD (10 items)
- [ ] Expand Regulatory DD (11 items)
- [ ] Expand Commercial DD (10 items)
- [ ] Expand Financial DD (10 items)
- [ ] Expand Legal DD (10 items)
- [ ] Expand Operational DD (9 items)
- [ ] Expand Strategic Fit (6 items)
- [ ] Expand Overall Risk Assessment (10 items)

**Day 4-5**: Testing & Polish
- [ ] Test DD checklist in DD Workspace
- [ ] Ensure progress tracking works
- [ ] Ensure required items are flagged
- [ ] End-to-end test all templates

**File**: `src/data/mockDDTemplates.ts`

**Acceptance Criteria**:
- [ ] DD checklist has 94+ items across 9 sections
- [ ] Each item has required/optional flag
- [ ] Progress tracking works (X% complete)
- [ ] Can mark items complete/incomplete
- [ ] All sections align with client requirements

### Phase 1C: Polish & Integration (Week 6)

**Goal**: Connect everything, add export, fix TODOs

#### Week 6: Final Polish

**Day 1-2**: Export Functionality
- [ ] Add Excel export for Projects page
- [ ] Add CSV export for Projects page
- [ ] Add Excel/CSV export for Address Book (both tabs)
- [ ] Install `xlsx` library: `npm install xlsx`
- [ ] Create `src/utils/exportUtils.ts`

**Day 3**: Fix Incomplete Features
- [ ] Fix survey resend logic (`SurveyDetailPage.tsx` line 973)
- [ ] Fix public survey backend integration (`PublicSurveyPage.tsx` line 577)
- [ ] Fix pipeline edit button (`PipelinePage.tsx` line 440)
- [ ] Replace all hardcoded "current-user-id" with auth context

**Day 4-5**: Automation Integration
- [ ] Survey submission → auto-create Opportunity
- [ ] Go decision → auto-create NDA
- [ ] Stage change → auto-assign tasks
- [ ] Test automation triggers

**Acceptance Criteria**:
- [ ] Export works on Projects and Address Book pages
- [ ] All TODO comments removed from code
- [ ] Automation creates opportunities from survey submissions
- [ ] Automation creates NDAs after Go decisions
- [ ] No hardcoded user IDs remaining

---

## 8. Final Phase 1 Sidebar (After Consolidation)

### Recommended New Sidebar (15 items, down from 19)

```
1.  Dashboard
2.  Projects
3.  Opportunities          ← Now contains Lead Scoring + Screening as tabs
4.  Pipeline
5.  Surveys
6.  Survey Templates
7.  Automation
8.  Communications
9.  Tasks
10. Notifications
11. Calendar
12. Documents
13. Address Book          ← NEW: Companies + Contacts merged
14. Legal                 ← NEW (OPTIONAL): Contracts + NDAs merged
15. Due Diligence

ALTERNATIVE (if not merging Contracts/NDAs):
13. Address Book
14. Contracts
15. NDAs
16. Due Diligence
Total: 16 items
```

**Reduction**: 19 → 15 items (or 16 if keeping Contracts/NDAs separate)

---

## 9. Client Requirement Checklist

### ✅ Implemented & Working
- [x] Dashboard with real-time stats
- [x] Projects with stage management
- [x] Basic surveys with templates
- [x] Task management with Kanban board
- [x] Calendar with event scheduling
- [x] Document management
- [x] Contract management
- [x] NDA management
- [x] Basic DD workspace
- [x] Basic automation rules
- [x] Pipeline visualization

### ⚠️ Needs Enhancement
- [ ] **Opportunities**: Consolidate Lead Scoring + Screening into tabs
- [ ] **Address Book**: Merge Companies + Contacts, add missing fields
- [ ] **Survey 1**: Expand to 134 fields
- [ ] **Survey 2**: Create 55-field technical survey
- [ ] **Contracts**: Add 7 specific contract templates
- [ ] **DD Checklist**: Expand to 94 items
- [ ] **Export**: Add Excel/CSV export functionality
- [ ] **Automation**: Tighter integration with workflows

### ❌ Phase 2 (NOT Phase 1)
- [ ] Product catalog management (24 fields)
- [ ] Order management system (37 fields)
- [ ] Inventory management (Japanese radiation tracking)
- [ ] ERP/SCM shipment tracking
- [ ] Customs clearance workflow
- [ ] Hospital delivery management

---

## 10. Summary & Next Steps

### Key Actions

**Immediate (Week 1-2)**:
1. ✅ Remove Lead Scoring and Screenings from sidebar
2. ✅ Create unified Opportunity detail page with tabs
3. ✅ Remove Companies and Contacts from sidebar
4. ✅ Create unified Address Book page with tabs
5. ✅ Add missing Company fields (modalities, key contacts)

**Short-term (Week 3-5)**:
1. ✅ Expand Survey 1 to 134 fields
2. ✅ Create Survey 2 with 55 fields
3. ✅ Add 7 contract templates
4. ✅ Expand DD checklist to 94 items

**Final (Week 6)**:
1. ✅ Add export functionality
2. ✅ Fix all TODO items
3. ✅ Integrate automation triggers
4. ✅ Test end-to-end

### Success Criteria

**Phase 1 is complete when**:
- [ ] Sidebar has 15-16 items (down from 19)
- [ ] All opportunity workflow in ONE place (no separate Lead Scoring/Screenings)
- [ ] Address Book consolidates Companies + Contacts
- [ ] Company records have all client-required fields
- [ ] Survey 1 has 134+ fields
- [ ] Survey 2 has 55+ fields
- [ ] 7 contract templates available
- [ ] DD checklist has 94+ items
- [ ] Export to Excel/CSV works
- [ ] All TODO comments removed
- [ ] Client reviews and approves ✅

### Phase 2 Planning

**After Phase 1 completion**, create:
- `PHASE2_ERP_SCM_PLAN.md` - Product, Order, Inventory management
- Focus on Japanese regulatory compliance for inventory tracking
- International shipping and customs workflows

---

**Document Prepared By**: Development Team
**Client Consultation Required**: Yes (for Legal consolidation preference)
**Estimated Phase 1 Completion**: 6 weeks from start
**Status**: Ready to begin implementation

---

## Appendix A: Files to Modify

### High Priority
- `src/components/layout/AppSidebar.tsx` - Remove 4 menu items, add 1-2 new
- `src/routes/index.tsx` - Add redirects for old routes
- `src/types/company.types.ts` - Add new fields
- `src/pages/CompanyFormPage.tsx` - Add form fields
- `src/pages/OpportunityDetailPage.tsx` - CREATE NEW
- `src/pages/AddressBookPage.tsx` - CREATE NEW

### Medium Priority
- `src/data/mockSurveys.ts` - Expand Survey 1, create Survey 2
- `src/data/mockContracts.ts` - Add 7 contract templates
- `src/data/mockDDTemplates.ts` - Expand DD checklist
- `src/utils/exportUtils.ts` - CREATE NEW

### Low Priority (Cleanup)
- `src/pages/SurveyDetailPage.tsx` - Fix TODO on line 973
- `src/pages/PublicSurveyPage.tsx` - Fix TODO on line 577
- `src/pages/PipelinePage.tsx` - Fix TODO on line 440
- Various files - Replace hardcoded "current-user-id"

---

## Appendix B: Client Documents Reference

| Document | Relevance | Action |
|----------|-----------|--------|
| Project Filtering Flow (diagram) | Phase 1 | ✅ Use to guide Opportunity consolidation |
| Opportunity Assessment (50 screens) | Phase 1 | ✅ Implement as Quick Assessment tab (10 questions) |
| Address Book (table) | Phase 1 | ✅ Add missing Company fields |
| Survey 1 (134 lines) | Phase 1 | ✅ Expand survey template |
| Screening (63 lines) | Phase 1 | ✅ Already implemented, make it a tab |
| Due Diligence (94 lines) | Phase 1 | ✅ Expand DD checklist |
| Survey 2 (55 lines) | Phase 1 | ✅ Create new technical survey |
| ERP SCM (diagram) | **Phase 2** | ⏭️ Skip for now |
| Product List (24 lines) | **Phase 2** | ⏭️ Skip for now |
| Order Form (37 lines) | **Phase 2** | ⏭️ Skip for now |
| Inventory (Japanese table) | **Phase 2** | ⏭️ Skip for now |
| Automation vs AI (14 lines) | Phase 1 | ✅ Reference for automation rules |

---

**END OF DOCUMENT**
