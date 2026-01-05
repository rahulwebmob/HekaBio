# Combined Implementation Plan - Phase 1 Cleanup & Enhancement

**Document Version**: 1.0
**Date**: January 5, 2026
**Combines**:
- PHASE1_CLIENT_REQUIREMENTS_MAPPING.md
- UI_BUTTONS_AUDIT.md

---

## Executive Summary

This plan combines:
1. **Client Requirements** - Consolidate navigation, add missing fields, expand templates
2. **UI Cleanup** - Remove illogical buttons, standardize patterns

**Total Timeline**: 6 weeks
**Current Focus**: Week 1-2 (Cleanup & Consolidation)

---

## Phase 1A: Critical Cleanup (Week 1 - Days 1-5)

### Day 1: Remove Pipeline "New Opportunity" Button

**Priority**: 🚨 CRITICAL - User reported issue

**Files to Modify**:
1. `src/pages/PipelinePage.tsx`

**Changes**:
```typescript
// LINE 38 - REMOVE:
const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);

// LINE 23 - REMOVE IMPORT:
import { OpportunityDetailDrawer, OpportunityFormDrawer } from '../components/features/pipeline';
// CHANGE TO:
import { OpportunityDetailDrawer } from '../components/features/pipeline';

// LINE 211-217 - REMOVE ENTIRE BUTTON:
<Button
  variant="primary"
  leftIcon={<IconPlus size={18} />}
  onClick={() => setIsFormDrawerOpen(true)}
>
  New Opportunity
</Button>

// LINE 195-219 - SIMPLIFY HEADER:
// BEFORE:
<div className="flex items-center gap-3">
  <Button>Show Closed Deals</Button>
  <Button>New Opportunity</Button>
</div>

// AFTER:
<Button
  variant="outline"
  size="sm"
  leftIcon={<IconFilter size={16} />}
  onClick={() => setShowClosedDeals(!showClosedDeals)}
>
  {showClosedDeals ? 'Hide' : 'Show'} Closed Deals
</Button>

// LINE 437 - REMOVE:
<OpportunityFormDrawer isOpen={isFormDrawerOpen} onClose={() => setIsFormDrawerOpen(false)} />
```

**Test Checklist**:
- [ ] Pipeline page loads without errors
- [ ] No "New Opportunity" button visible
- [ ] Drag-and-drop still works
- [ ] View opportunity detail still works
- [ ] No console errors

---

### Day 2: Remove Duplicate Menu Items from Sidebar

**Priority**: 🚨 CRITICAL - Client requirements

**Files to Modify**:
1. `src/components/layout/AppSidebar.tsx`

**Changes**:
```typescript
// LINE 59-69 - REMOVE "Lead Scoring" menu item:
// DELETE THESE LINES:
{
  label: 'Lead Scoring',
  icon: <IconTrendingUp size={20} stroke={1.5} />,
  path: '/lead-scoring',
  allowedRoles: [
    'super_admin',
    'crm_owner',
    'gate_1_analyst',
    'gate_2_analyst',
    'gate_3_decision_maker',
  ],
},

// LINE 71-81 - REMOVE "Screenings" menu item:
// DELETE THESE LINES:
{
  label: 'Screenings',
  icon: <IconThermometer size={20} stroke={1.5} />,
  path: '/screenings',
  allowedRoles: [
    'super_admin',
    'crm_owner',
    'gate_1_analyst',
    'gate_2_analyst',
    'gate_3_decision_maker',
  ],
},

// LINE 174-184 - REMOVE "Companies" menu item:
// DELETE THESE LINES:
{
  label: 'Companies',
  icon: <IconBuildingHospital size={20} stroke={1.5} />,
  path: '/companies',
  allowedRoles: [
    'super_admin',
    'crm_owner',
    'gate_1_analyst',
    'gate_2_analyst',
    'gate_3_decision_maker',
  ],
},

// LINE 186-196 - REMOVE "Contacts" menu item:
// DELETE THESE LINES:
{
  label: 'Contacts',
  icon: <UserIcon className="w-5 h-5" />,
  path: '/contacts',
  allowedRoles: [
    'super_admin',
    'crm_owner',
    'gate_1_analyst',
    'gate_2_analyst',
    'gate_3_decision_maker',
  ],
},

// ADD NEW MENU ITEM (after "Documents", around line 148):
{
  label: 'Address Book',
  icon: <IconAddressBook size={20} stroke={1.5} />,
  path: '/address-book',
  allowedRoles: [
    'super_admin',
    'crm_owner',
    'gate_1_analyst',
    'gate_2_analyst',
    'gate_3_decision_maker',
  ],
},

// ADD IMPORT AT TOP:
import { IconAddressBook } from '@tabler/icons-react';
```

**Result**: Sidebar reduces from 19 items → 15 items

**Test Checklist**:
- [ ] Sidebar shows 15 items (not 19)
- [ ] No "Lead Scoring" menu item
- [ ] No "Screenings" menu item
- [ ] No "Companies" menu item
- [ ] No "Contacts" menu item
- [ ] New "Address Book" menu item visible
- [ ] All other menu items still work

---

### Day 3: Add Route Redirects

**Priority**: 🚨 CRITICAL - Don't break existing links

**Files to Modify**:
1. `src/routes/index.tsx`

**Changes**:
```typescript
// AFTER LINE 102 (after Opportunities route), ADD REDIRECTS:

// Redirect old Lead Scoring route
{
  path: '/lead-scoring',
  element: () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate('/opportunities', { replace: true });
    }, [navigate]);
    return null;
  },
  isPublic: false,
  title: 'Redirect - HekaBio',
},

// Redirect old Screenings route
{
  path: '/screenings',
  element: () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate('/opportunities', { replace: true });
    }, [navigate]);
    return null;
  },
  isPublic: false,
  title: 'Redirect - HekaBio',
},

// AFTER LINE 346 (after Companies routes), ADD REDIRECTS:

// Redirect old Companies route to Address Book
{
  path: '/companies',
  element: () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate('/address-book?tab=companies', { replace: true });
    }, [navigate]);
    return null;
  },
  isPublic: false,
  title: 'Redirect - HekaBio',
},

// Redirect old Contacts route to Address Book
{
  path: '/contacts',
  element: () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate('/address-book?tab=contacts', { replace: true });
    }, [navigate]);
    return null;
  },
  isPublic: false,
  title: 'Redirect - HekaBio',
},

// ADD NEW ROUTE (after NDAs, around line 260):
{
  path: '/address-book',
  element: AddressBookPage,
  isPublic: false,
  allowedRoles: [
    'super_admin',
    'crm_owner',
    'gate_1_analyst',
    'gate_2_analyst',
    'gate_3_decision_maker',
  ],
  title: 'Address Book - HekaBio',
},

// ADD IMPORT AT TOP:
const AddressBookPage = lazy(() => import('../pages/AddressBookPage'));
```

**Alternative (Better approach)**: Use Navigate component from react-router-dom:
```typescript
import { Navigate } from 'react-router-dom';

// Redirects:
{
  path: '/lead-scoring',
  element: () => <Navigate to="/opportunities" replace />,
  isPublic: false,
},
{
  path: '/screenings',
  element: () => <Navigate to="/opportunities" replace />,
  isPublic: false,
},
{
  path: '/companies',
  element: () => <Navigate to="/address-book?tab=companies" replace />,
  isPublic: false,
},
{
  path: '/contacts',
  element: () => <Navigate to="/address-book?tab=contacts" replace />,
  isPublic: false,
},
```

**Test Checklist**:
- [ ] Visiting `/lead-scoring` redirects to `/opportunities`
- [ ] Visiting `/screenings` redirects to `/opportunities`
- [ ] Visiting `/companies` redirects to `/address-book?tab=companies`
- [ ] Visiting `/contacts` redirects to `/address-book?tab=contacts`

---

### Day 4: Create Address Book Page (Consolidation)

**Priority**: 🚨 CRITICAL - Client requirements

**Files to Create**:
1. `src/pages/AddressBookPage.tsx`
2. `src/components/features/addressbook/CompaniesTab.tsx`
3. `src/components/features/addressbook/ContactsTab.tsx`

**Step 1: Create AddressBookPage.tsx**:
```typescript
/**
 * Address Book Page
 * Unified view of Companies and Contacts
 */

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconBuilding, IconUser, IconDownload, IconUpload } from '@tabler/icons-react';
import { AppLayout } from '../components/layout';
import { Button } from '../components/ui';
import CompaniesTab from '../components/features/addressbook/CompaniesTab';
import ContactsTab from '../components/features/addressbook/ContactsTab';

type TabType = 'companies' | 'contacts';

export default function AddressBookPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('companies');

  // Get tab from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab') as TabType;
    if (tab === 'contacts' || tab === 'companies') {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Update URL when tab changes
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    navigate(`/address-book?tab=${tab}`, { replace: true });
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export', activeTab);
  };

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log('Import', activeTab);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Address Book</h1>
            <p className="text-gray-600 mt-1">
              Manage your company and contact relationships
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              leftIcon={<IconDownload size={18} />}
              onClick={handleExport}
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              leftIcon={<IconUpload size={18} />}
              onClick={handleImport}
            >
              Import CSV
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('companies')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === 'companies'
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <IconBuilding size={20} />
                <span>Companies</span>
              </div>
            </button>
            <button
              onClick={() => handleTabChange('contacts')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === 'contacts'
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <IconUser size={20} />
                <span>Contacts</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'companies' && <CompaniesTab />}
          {activeTab === 'contacts' && <ContactsTab />}
        </div>
      </div>
    </AppLayout>
  );
}
```

**Step 2: Create CompaniesTab.tsx**:
```typescript
/**
 * Companies Tab Component
 * Reuses logic from CompaniesPage.tsx
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// ... (copy entire logic from CompaniesPage.tsx, but remove AppLayout wrapper)
// ... (keep all the filtering, sorting, pagination logic)

export default function CompaniesTab() {
  // Copy everything from CompaniesPage.tsx EXCEPT:
  // - Remove <AppLayout> wrapper
  // - Remove page title/header (already in AddressBookPage)
  // - Keep "Add Company" button

  return (
    <div className="space-y-6">
      {/* All the Companies page content WITHOUT the header */}
    </div>
  );
}
```

**Step 3: Create ContactsTab.tsx**:
```typescript
/**
 * Contacts Tab Component
 * Reuses logic from ContactsPage.tsx
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// ... (copy entire logic from ContactsPage.tsx, but remove AppLayout wrapper)

export default function ContactsTab() {
  // Copy everything from ContactsPage.tsx EXCEPT:
  // - Remove <AppLayout> wrapper
  // - Remove page title/header (already in AddressBookPage)
  // - Keep "Add Contact" button

  return (
    <div className="space-y-6">
      {/* All the Contacts page content WITHOUT the header */}
    </div>
  );
}
```

**Test Checklist**:
- [ ] `/address-book` loads successfully
- [ ] Default tab is "Companies"
- [ ] Can switch to "Contacts" tab
- [ ] URL updates when switching tabs
- [ ] Companies tab shows all companies
- [ ] Contacts tab shows all contacts
- [ ] "Add Company" button works
- [ ] "Add Contact" button works
- [ ] Redirects from old routes work

---

### Day 5: Standardize Project Creation Pattern

**Priority**: ⚠️ HIGH - UX consistency

**Files to Modify**:
1. `src/pages/ProjectsPage.tsx`

**Changes**:
```typescript
// LINE 39 - REMOVE:
const [isModalOpen, setIsModalOpen] = useState(false);

// REMOVE IMPORT:
import { ProjectFormModal } from '../components/features';

// LINE 308 - CHANGE:
// BEFORE:
onClick={() => setIsModalOpen(true)}

// AFTER:
onClick={() => navigate('/projects/new')}

// LINE 535 - CHANGE:
// BEFORE:
onClick={() => setIsModalOpen(true)}

// AFTER:
onClick={() => navigate('/projects/new')}

// LINE 598 - REMOVE:
<ProjectFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
```

**Files to DELETE**:
- `src/components/features/ProjectFormModal.tsx`

**Test Checklist**:
- [ ] ProjectsPage "New Project" navigates to `/projects/new`
- [ ] Dashboard "New Project" navigates to `/projects/new` (already working)
- [ ] Both use same form page
- [ ] No console errors about ProjectFormModal
- [ ] Create project works
- [ ] Edit project works

---

## Phase 1B: Standardize More Patterns (Week 1 - Days 6-7)

### Day 6: Standardize Company Creation Pattern

**Files to Modify**:
1. `src/pages/CompaniesPage.tsx` (now in CompaniesTab.tsx)
2. `src/components/features/addressbook/CompaniesTab.tsx`

**Changes**:
```typescript
// In CompaniesTab.tsx:

// REMOVE:
const [isModalOpen, setIsModalOpen] = useState(false);
import { CompanyFormModal } from '../CompanyFormModal';

// CHANGE:
// BEFORE:
onClick={() => setIsModalOpen(true)}

// AFTER:
onClick={() => navigate('/companies/new')}

// REMOVE:
<CompanyFormModal isOpen={isModalOpen} onClose={...} />
```

**Files to DELETE**:
- `src/components/features/CompanyFormModal.tsx`

**Test Checklist**:
- [ ] Address Book → Companies tab → "Add Company" navigates to `/companies/new`
- [ ] Dashboard "New Company" navigates to `/companies/new` (already working)
- [ ] Create company works
- [ ] Edit company works

---

### Day 7: Delete Opportunity Form Drawer

**Files to DELETE**:
1. `src/components/features/pipeline/OpportunityFormDrawer.tsx`

**Verify**:
- [ ] No imports of OpportunityFormDrawer exist (should be removed on Day 1)
- [ ] No references in codebase
- [ ] Safe to delete

**Action**: Delete the file

---

## Phase 1C: Add Missing Company Fields (Week 2)

### Day 8-9: Update Company Types and Form

**Priority**: 🚨 CRITICAL - Client requirements

**Files to Modify**:

**1. src/types/company.types.ts**:
```typescript
// ADD NEW TYPES:
export type Modality =
  | 'DRUG'
  | 'DEVICE'
  | 'DIAGNOSTIC'
  | 'DIGITAL_HEALTH'
  | 'COMBINATION';

export interface KeyContact {
  name: string;
  email: string;
  contactId?: string; // Optional link to Contact record
}

// UPDATE Company interface:
export interface Company {
  id: ID;
  name: string;
  roles: CompanyRole[];
  country: string;
  address?: Address;
  website?: URL;
  description?: string;

  // Categorization (UPDATED)
  category?: string;
  focusedTherapeuticArea?: string; // NEW: e.g., "Oncology", "Cardiology"
  diseaseAreas: string[]; // CHANGED from diseaseArea (singular) to diseaseAreas (plural)
  modalities: Modality[]; // NEW
  productCategory?: string[];
  focusAreas?: string[];

  // Key Contacts (NEW)
  managementContact?: KeyContact;
  bdContact?: KeyContact;
  rdContact?: KeyContact;

  // Additional Info
  foundedYear?: number;
  employeeCount?: number;
  revenue?: number;
  fundingStage?: string;

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: ID;

  // Relationships
  contactCount?: number;
  projectCount?: number;
}
```

**2. src/pages/CompanyFormPage.tsx**:
```typescript
// ADD TO IMPORTS:
import type { Modality, KeyContact } from '../types/company.types';

// UPDATE FORM STATE:
const [formData, setFormData] = useState({
  name: '',
  roles: [] as CompanyRole[],
  country: '',
  website: '',
  description: '',

  // NEW FIELDS:
  focusedTherapeuticArea: '',
  diseaseAreas: [] as string[],
  modalities: [] as Modality[],

  managementContact: {
    name: '',
    email: '',
  },
  bdContact: {
    name: '',
    email: '',
  },
  rdContact: {
    name: '',
    email: '',
  },

  // ... existing fields
});

// ADD CONSTANTS:
const THERAPEUTIC_AREA_OPTIONS = [
  { value: 'oncology', label: 'Oncology' },
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'diabetes', label: 'Diabetes / Endocrinology' },
  { value: 'rare_disease', label: 'Rare Disease' },
  { value: 'infectious_disease', label: 'Infectious Disease' },
  { value: 'immunology', label: 'Immunology / Autoimmune' },
  { value: 'respiratory', label: 'Respiratory' },
];

const DISEASE_AREA_OPTIONS = [
  { value: 'breast_cancer', label: 'Breast Cancer' },
  { value: 'lung_cancer', label: 'Lung Cancer' },
  { value: 'colorectal_cancer', label: 'Colorectal Cancer' },
  { value: 'diabetes_t1', label: 'Diabetes Type 1' },
  { value: 'diabetes_t2', label: 'Diabetes Type 2' },
  { value: 'alzheimers', label: "Alzheimer's Disease" },
  { value: 'parkinsons', label: "Parkinson's Disease" },
  // ... add more from client's Address Book table
];

const MODALITY_OPTIONS = [
  { value: 'DRUG', label: 'Drug (Small Molecule, Biologics)' },
  { value: 'DEVICE', label: 'Medical Device' },
  { value: 'DIAGNOSTIC', label: 'Diagnostic' },
  { value: 'DIGITAL_HEALTH', label: 'Digital Health / AI' },
  { value: 'COMBINATION', label: 'Combination Product' },
];

// ADD TO FORM (after existing fields, before submit button):

{/* Focused Therapeutic Area */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Focused Therapeutic Area
  </label>
  <select
    value={formData.focusedTherapeuticArea}
    onChange={(e) => setFormData({ ...formData, focusedTherapeuticArea: e.target.value })}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
  >
    <option value="">Select therapeutic area...</option>
    {THERAPEUTIC_AREA_OPTIONS.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>

{/* Disease Areas (Multi-select) */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Disease Areas
  </label>
  <MultiSelect
    options={DISEASE_AREA_OPTIONS}
    value={formData.diseaseAreas}
    onChange={(values) => setFormData({ ...formData, diseaseAreas: values })}
    placeholder="Select disease areas..."
  />
</div>

{/* Modalities (Multi-select) */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Modalities
  </label>
  <MultiSelect
    options={MODALITY_OPTIONS}
    value={formData.modalities}
    onChange={(values) => setFormData({ ...formData, modalities: values as Modality[] })}
    placeholder="Select modalities..."
  />
</div>

{/* Key Contacts Section */}
<div className="col-span-2 border-t border-gray-200 pt-6 mt-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Contacts</h3>

  {/* Management Contact */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Management Contact Name
      </label>
      <input
        type="text"
        value={formData.managementContact.name}
        onChange={(e) => setFormData({
          ...formData,
          managementContact: { ...formData.managementContact, name: e.target.value }
        })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        placeholder="e.g., John Smith"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Management Contact Email
      </label>
      <input
        type="email"
        value={formData.managementContact.email}
        onChange={(e) => setFormData({
          ...formData,
          managementContact: { ...formData.managementContact, email: e.target.value }
        })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        placeholder="john.smith@company.com"
      />
    </div>
  </div>

  {/* BD Contact */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        BD Contact Name
      </label>
      <input
        type="text"
        value={formData.bdContact.name}
        onChange={(e) => setFormData({
          ...formData,
          bdContact: { ...formData.bdContact, name: e.target.value }
        })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        BD Contact Email
      </label>
      <input
        type="email"
        value={formData.bdContact.email}
        onChange={(e) => setFormData({
          ...formData,
          bdContact: { ...formData.bdContact, email: e.target.value }
        })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
      />
    </div>
  </div>

  {/* R&D Contact */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        R&D Contact Name
      </label>
      <input
        type="text"
        value={formData.rdContact.name}
        onChange={(e) => setFormData({
          ...formData,
          rdContact: { ...formData.rdContact, name: e.target.value }
        })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        R&D Contact Email
      </label>
      <input
        type="email"
        value={formData.rdContact.email}
        onChange={(e) => setFormData({
          ...formData,
          rdContact: { ...formData.rdContact, email: e.target.value }
        })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
      />
    </div>
  </div>
</div>
```

**Note**: You'll need to create a MultiSelect component or use an existing one

**3. Update CompanyDetailPage.tsx** to display new fields

**Test Checklist**:
- [ ] Company form has all new fields
- [ ] Can create company with new fields
- [ ] Can edit company with new fields
- [ ] Disease Areas multi-select works
- [ ] Modalities multi-select works
- [ ] Key contacts save correctly
- [ ] Company detail page shows new fields

---

## Summary of Week 1-2 Actions

### Files to DELETE:
- ❌ `src/components/features/pipeline/OpportunityFormDrawer.tsx`
- ❌ `src/components/features/ProjectFormModal.tsx`
- ❌ `src/components/features/CompanyFormModal.tsx`

### Files to CREATE:
- ✅ `src/pages/AddressBookPage.tsx`
- ✅ `src/components/features/addressbook/CompaniesTab.tsx`
- ✅ `src/components/features/addressbook/ContactsTab.tsx`

### Files to MODIFY:
- ⚠️ `src/pages/PipelinePage.tsx` (remove button)
- ⚠️ `src/components/layout/AppSidebar.tsx` (remove 4 items, add 1)
- ⚠️ `src/routes/index.tsx` (add redirects)
- ⚠️ `src/pages/ProjectsPage.tsx` (use navigation)
- ⚠️ `src/types/company.types.ts` (add fields)
- ⚠️ `src/pages/CompanyFormPage.tsx` (add form fields)

### Expected Results:
- Sidebar: 19 items → 15 items
- No illogical buttons (Pipeline)
- Consistent creation patterns
- Companies + Contacts merged into Address Book
- Company records have all client-required fields

---

## Next Steps (Week 3+)

### Week 3-5: Template Expansion
- Survey 1: 134 fields
- Survey 2: 55 fields
- Contracts: 7 templates
- DD Checklist: 94 items

### Week 6: Polish
- Export functionality
- Fix remaining TODOs
- Automation integration
- End-to-end testing

---

**Ready to start implementing! Let me know when to begin.**
