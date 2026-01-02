# HekaBio Platform - Manual Testing Guide

Use this guide to systematically test all features and navigation flows.

---

## 🧭 NAVIGATION TESTING

### Sidebar Navigation
Start from Dashboard and test each sidebar link:

1. **Dashboard Link**
   - [ ] Click "Dashboard" in sidebar
   - [ ] Should navigate to `/dashboard`
   - [ ] Should show welcome message, stats, recent projects

2. **Projects Link**
   - [ ] Click "Projects" in sidebar
   - [ ] Should navigate to `/projects`
   - [ ] Should show projects list with filters

3. **Surveys Link**
   - [ ] Click "Surveys" in sidebar
   - [ ] Should navigate to `/surveys`
   - [ ] Should show surveys list with stats cards

4. **Companies Link**
   - [ ] Click "Companies" in sidebar
   - [ ] Should navigate to `/companies`
   - [ ] Should show companies table with filters

5. **Contacts Link**
   - [ ] Click "Contacts" in sidebar
   - [ ] Should navigate to `/contacts`
   - [ ] Should show contacts table with filters

---

## 📊 DASHBOARD TESTING

### Stat Cards (Should be clickable)
- [ ] Click "Total Projects" card → navigates to `/projects`
- [ ] Click "Companies" card → navigates to `/companies`
- [ ] Click "Hot Projects" card → navigates to `/projects`
- [ ] Click "Avg Score" card → navigates to `/projects`

### Recent Projects
- [ ] Click any project card → navigates to `/projects/:id` detail page
- [ ] Click "View All" button → navigates to `/projects`

### Quick Actions
- [ ] Click "New Project" → navigates to `/projects/new`
- [ ] Click "New Company" → navigates to `/companies/new`
- [ ] Click "View Surveys" → navigates to `/surveys`
- [ ] Click "View Contacts" → navigates to `/contacts`

---

## 🔬 PROJECTS MODULE TESTING

### Projects List Page (`/projects`)

**Navigation TO this page:**
- [ ] From Dashboard (sidebar, stat cards, View All)
- [ ] From Project Detail (breadcrumb back)
- [ ] From Project Form (breadcrumb back, after save)

**Buttons:**
- [ ] "New Project" button → navigates to `/projects/new`
- [ ] Click any project card → navigates to `/projects/:id`

**Filters:**
- [ ] Search box (type to filter)
- [ ] Tag filter dropdown (Strategic Portfolio, Finders, Development Services)
- [ ] Stage filter dropdown (shows all unique stages)
- [ ] Japan Market Fit filter (High, Medium, Low, Not Assessed)
- [ ] Score range filter (80-100, 70-79, 60-69, 0-59)
- [ ] Flag filter (Hot, Diamond, Stalled, Japan Interest)
- [ ] "Clear all filters" button (should reset all)

**Pagination:**
- [ ] Should show 12 projects per page
- [ ] Previous/Next buttons work
- [ ] Page number buttons work
- [ ] Disabled states correct (can't go before page 1 or after last page)

### Project Detail Page (`/projects/:id`)

**Navigation TO this page:**
- [ ] From Projects List (click card)
- [ ] From Dashboard (click recent project card)

**Breadcrumb:**
- [ ] "Back to Projects" link → navigates to `/projects`

**Buttons:**
- [ ] "Edit" button → navigates to `/projects/:id/edit`
- [ ] "Delete" button → shows confirmation modal
  - [ ] "Cancel" in modal → closes modal
  - [ ] "Delete Project" in modal → deletes and navigates to `/projects`

**Links:**
- [ ] Click company name → navigates to `/companies/:companyId`

**Content Display:**
- [ ] Project name and company shown
- [ ] All badges displayed (tags, stage, Japan fit, flags)
- [ ] Score breakdown with progress bars
- [ ] Japan assessment (if applicable)
- [ ] Stage history timeline
- [ ] Metadata sidebar

### Project Form Page (`/projects/new` or `/projects/:id/edit`)

**Navigation TO this page:**
- [ ] From Projects List ("New Project" button)
- [ ] From Project Detail ("Edit" button)
- [ ] From Dashboard ("New Project" quick action)

**Breadcrumb:**
- [ ] "Back" link → navigates back

**Form Validation:**
- [ ] Project Name required
- [ ] Company required
- [ ] Project Tag required
- [ ] Current Stage required (and only shows stages for selected tag)
- [ ] Score must be 0-100
- [ ] DD Progress must be 0-100 (if entered)

**Form Submission:**
- [ ] "Cancel" button → navigates back
- [ ] "Create Project" / "Update Project" button:
  - [ ] Shows validation errors if form invalid
  - [ ] If valid, saves and navigates to `/projects/:id`
  - [ ] New project should appear in projects list
  - [ ] Edited project should show updated values

---

## 🏢 COMPANIES MODULE TESTING

### Companies List Page (`/companies`)

**Navigation TO this page:**
- [ ] From Dashboard (sidebar, stat card)
- [ ] From Company Detail (breadcrumb back)
- [ ] From Company Form (breadcrumb back, after save)

**Buttons:**
- [ ] "Add Company" button → navigates to `/companies/new`
- [ ] Click any table row → navigates to `/companies/:id`

**Filters:**
- [ ] Search box (name or location)
- [ ] Role filter (Partner, Target, Service Provider, etc.)
- [ ] Category filter (Hospital, Biotech, MedTech, etc.)
- [ ] Status filter (Active Only, Inactive Only, All Status)
- [ ] "Clear all filters" button

**Pagination:**
- [ ] Should show 10 companies per page
- [ ] Pagination controls work

**Sorting:**
- [ ] Table should be sortable by column headers

### Company Detail Page (`/companies/:id`)

**Navigation TO this page:**
- [ ] From Companies List (click row)
- [ ] From Project Detail (click company name)

**Breadcrumb:**
- [ ] "Back to Companies" link → navigates to `/companies`

**Buttons:**
- [ ] "Edit" button → opens CompanyFormModal
  - [ ] Modal should pre-fill with company data
  - [ ] "Cancel" → closes modal
  - [ ] "Update Company" → saves and modal closes, page refreshes
- [ ] "Delete" button → shows confirmation modal
  - [ ] Shows warning about deleting contacts
  - [ ] "Cancel" → closes modal
  - [ ] "Delete Company" → deletes and navigates to `/companies`

**Content Display:**
- [ ] Company name and local name (if any)
- [ ] Role and category badges
- [ ] Company overview section
- [ ] Contacts list (if any)
- [ ] Contact information sidebar
- [ ] Primary contact card (if designated)
- [ ] Metadata

**Contacts Section:**
- [ ] Shows all contacts for this company
- [ ] "Add Contact" button (currently just placeholder)
- [ ] Contact cards show name, title, email, phone
- [ ] Primary contact has "Primary" badge

### Company Form Page (`/companies/new` or `/companies/:id/edit`)

**Navigation TO this page:**
- [ ] From Companies List ("Add Company" button)
- [ ] From Dashboard ("New Company" quick action)

**Breadcrumb:**
- [ ] "Back" link → navigates back

**Form Validation:**
- [ ] Company Name required
- [ ] Role required
- [ ] Category required
- [ ] Street Address required
- [ ] City required
- [ ] Postal Code required
- [ ] Country required
- [ ] Email format validation (if provided)
- [ ] Website must start with http:// or https:// (if provided)
- [ ] Founded Year must be between 1800 and current year (if provided)
- [ ] Employee Count must be positive number (if provided)

**Form Submission:**
- [ ] "Cancel" button → navigates back
- [ ] "Create Company" / "Update Company" button:
  - [ ] Shows validation errors if invalid
  - [ ] If valid, saves and navigates to `/companies/:id`
  - [ ] Tags field correctly splits comma-separated values

---

## 👥 CONTACTS MODULE TESTING

### Contacts List Page (`/contacts`)

**Navigation TO this page:**
- [ ] From Dashboard (sidebar, "View Contacts" quick action)

**Buttons:**
- [ ] "Add Contact" button → opens ContactFormModal
- [ ] Click eye icon on any row → opens ContactDetailDrawer

**Filters:**
- [ ] Search box (name, email, title, phone)
- [ ] Role filter (Executive, Researcher, Engineer, etc.)
- [ ] Company filter (shows all companies)
- [ ] Status filter (Active Only, Inactive Only, All Status)
- [ ] "Clear all filters" button

**Pagination:**
- [ ] Should show 10 contacts per page
- [ ] Pagination controls work

**Table Display:**
- [ ] Shows contact with avatar initial
- [ ] Shows role, company, email, phone
- [ ] Status indicator (Active/Inactive)

### ContactFormModal

**Trigger:**
- [ ] From Contacts List ("Add Contact" button)
- [ ] From Company Detail ("Add Contact" button - if implemented)

**Modal:**
- [ ] Opens correctly
- [ ] Form fields present
- [ ] "Cancel" button closes modal
- [ ] "Save" button validates and saves
- [ ] After save, modal closes and list refreshes
- [ ] New contact appears in list

### ContactDetailDrawer

**Trigger:**
- [ ] From Contacts List (click eye icon)
- [ ] From Company Detail (click contact - if implemented)

**Drawer:**
- [ ] Slides in from right
- [ ] Shows contact details
- [ ] Shows associated company
- [ ] "Edit" button opens ContactFormModal
- [ ] "Delete" button shows confirmation and deletes
- [ ] "X" button closes drawer
- [ ] Click overlay closes drawer

---

## 📋 SURVEYS MODULE TESTING

### Surveys List Page (`/surveys`)

**Navigation TO this page:**
- [ ] From Dashboard (sidebar, "View Surveys" quick action)
- [ ] From Survey Detail (breadcrumb back)

**Buttons:**
- [ ] "Send Survey" button (currently placeholder)
- [ ] Click eye icon on any row → navigates to `/surveys/:id`

**Stats Cards:**
- [ ] Total count correct
- [ ] In Progress count correct
- [ ] Submitted count correct
- [ ] Reviewed count correct

**Filters:**
- [ ] Search box (company, project, survey name)
- [ ] Status filter (Not Started, In Progress, Submitted, Reviewed)
- [ ] Type filter (Survey 1, Survey 2, Survey 3, Japan Assessment, Custom)
- [ ] "Clear all filters" button

**Table Display:**
- [ ] Shows survey template name and type
- [ ] Shows company and project (if linked)
- [ ] Status badge with correct color
- [ ] Progress bar with percentage
- [ ] Sent date and due date
- [ ] Overdue indicator (red text, "(Overdue)")
- [ ] Due soon indicator (orange text, "(Soon)")

**Pagination:**
- [ ] Should show 10 surveys per page
- [ ] Pagination controls work

### Survey Detail Page (`/surveys/:id`)

**Navigation TO this page:**
- [ ] From Surveys List (click eye icon)

**Breadcrumb:**
- [ ] "Back to Surveys" link → navigates to `/surveys`

**Buttons:**
- [ ] "Resend" button (if not reviewed) - currently placeholder
- [ ] "Delete" button → shows confirmation modal
  - [ ] "Cancel" → closes modal
  - [ ] "Delete Survey" → deletes and navigates to `/surveys`

**Links:**
- [ ] Click company name → navigates to `/companies/:companyId`
- [ ] Click project name (if linked) → navigates to `/projects/:projectId`

**Content Display:**
- [ ] Survey template name and type
- [ ] Company name
- [ ] Status badge
- [ ] Overdue/Due Soon badges
- [ ] Completion progress bar
- [ ] Survey sections list with question counts
- [ ] Review notes (if reviewed)
- [ ] Timeline sidebar (sent, due, started, submitted, reviewed dates)
- [ ] Metadata

---

## 🐛 COMMON ISSUES TO CHECK

### Breadcrumb Navigation
- [ ] All detail pages have breadcrumb back link
- [ ] All form pages have breadcrumb back link
- [ ] Breadcrumb links work correctly
- [ ] Breadcrumb styling is consistent (small, gray, hover effect)

### Delete Operations
- [ ] All delete buttons show confirmation modal
- [ ] Delete modal has warning text
- [ ] Cancel button in modal works
- [ ] Confirm delete removes item and redirects to list page
- [ ] Deleted items don't appear in list anymore

### Form Submissions
- [ ] All required fields show error if empty
- [ ] Validation messages are clear
- [ ] Successful save redirects to detail page
- [ ] Cancel button navigates back without saving
- [ ] Edit mode pre-fills all fields correctly

### Pagination
- [ ] Correct number of items per page
- [ ] Total count is accurate
- [ ] Page numbers calculate correctly
- [ ] Previous/Next buttons disabled appropriately
- [ ] Clicking page numbers works

### Filters
- [ ] All filters work independently
- [ ] Combining filters works (AND logic)
- [ ] Clear filters button resets everything
- [ ] Results count updates correctly
- [ ] Empty state shows when no results

### Responsive Design
- [ ] Pages work on mobile (< 768px)
- [ ] Sidebar collapses on mobile
- [ ] Tables scroll horizontally on mobile
- [ ] Cards stack vertically on mobile
- [ ] Forms are usable on mobile

### Loading States
- [ ] No console errors on page load
- [ ] No broken images or missing icons
- [ ] All Tabler icons render correctly
- [ ] All custom SVG icons render correctly

---

## 📝 BUG REPORTING TEMPLATE

When you find an issue, document it with:

```markdown
### Bug: [Short Description]

**Page/Module:** [e.g., Projects List]
**Route:** [e.g., /projects]

**Steps to Reproduce:**
1. Go to...
2. Click...
3. See error...

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Priority:** [High/Medium/Low]
```

---

## ✅ TESTING CHECKLIST SUMMARY

### By Module
- [ ] Dashboard (5 pages can navigate from here)
- [ ] Projects (List, Detail, Form)
- [ ] Companies (List, Detail, Form)
- [ ] Contacts (List, Modal, Drawer)
- [ ] Surveys (List, Detail)

### By Feature Type
- [ ] Navigation (Sidebar, breadcrumbs, buttons, links)
- [ ] CRUD Operations (Create, Read, Update, Delete)
- [ ] Filters (Search, dropdowns, combinations)
- [ ] Pagination (All list pages)
- [ ] Forms (Validation, submission, cancel)
- [ ] Modals (Open, close, confirm)
- [ ] Responsive (Mobile, tablet, desktop)

**Total Test Cases:** ~100+
**Estimated Testing Time:** 2-3 hours for comprehensive testing

---

Good luck with testing! Report any bugs you find. 🐛
