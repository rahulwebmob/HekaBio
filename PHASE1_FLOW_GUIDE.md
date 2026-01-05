# 🎯 HekaBio Platform - Phase 1 Complete Flow Guide

> **Your Step-by-Step Guide to Understanding and Using the Platform**

---

## 📖 Table of Contents

1. [Getting Started](#getting-started)
2. [Understanding the Platform Architecture](#understanding-the-platform-architecture)
3. [The Complete User Journey](#the-complete-user-journey)
4. [Feature-by-Feature Guide](#feature-by-feature-guide)
5. [Data Flow & State Management](#data-flow--state-management)
6. [Testing Scenarios](#testing-scenarios)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Step 1: Start the Application

```bash
# Make sure you're in the project directory
cd C:\Users\webmob\Desktop\HekaBio

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

**Expected Output:**
```
  VITE v7.3.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 2: Access the Application

Open your browser and navigate to: **http://localhost:5173**

### Step 3: Login

**Default Credentials:**
- **Email:** `admin@hekabio.com`
- **Password:** `admin123`

**Available Test Users:**
```
1. Super Admin
   - Email: admin@hekabio.com
   - Password: admin123
   - Access: All features

2. BD Manager
   - Email: bd.manager@hekabio.com
   - Password: bd123
   - Access: Business development features

3. CRM Owner
   - Email: crm.owner@hekabio.com
   - Password: crm123
   - Access: CRM and survey management

4. Data Analyst
   - Email: analyst@hekabio.com
   - Password: analyst123
   - Access: Analytics and reporting

5. Product Owner
   - Email: product@hekabio.com
   - Password: product123
   - Access: Product management features
```

---

## 🏗️ Understanding the Platform Architecture

### What is HekaBio Platform?

HekaBio is a **BioPharma Partnership Management System** that helps manage the entire lifecycle of biotech partnerships:

```
External Partner → Survey Submission → Evaluation → Due Diligence → Contract → Partnership
```

### Core Concept: The Partnership Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    PARTNERSHIP LIFECYCLE                         │
└─────────────────────────────────────────────────────────────────┘

1. INITIAL CONTACT
   ↓
   └─→ Survey Submission (External partners fill out forms)

2. DATA GATHERING (Stage 1)
   ↓
   └─→ Survey Analysis & Initial Assessment

3. SCREENING (Gate 1 Review)
   ↓
   └─→ Score projects, filter promising candidates

4. ONE-ON-ONE MEETING (Stage 2)
   ↓
   └─→ Direct engagement with partners

5. SENIOR DECISION (Gate 2 & 3)
   ↓
   └─→ Strategic review and go/no-go decision

6. NDA EXECUTION
   ↓
   └─→ Legal protection before sharing confidential info

7. DUE DILIGENCE
   ↓
   └─→ Deep dive into technology, market, financials

8. NEGOTIATION
   ↓
   └─→ Term sheets, deal structure

9. CONTRACT EXECUTION
   ↓
   └─→ Final legal agreements

10. PARTNERSHIP ACTIVE
```

### Tech Stack Overview

```
Frontend Layer
├── React 19.2 (UI Components)
├── TypeScript 5.9 (Type Safety)
├── Redux Toolkit (State Management)
├── React Router v6 (Navigation)
└── Tailwind CSS (Styling)

State Management
├── 15 Redux Slices
│   ├── auth (Authentication)
│   ├── projects (Core business logic)
│   ├── surveys (Survey management)
│   ├── addressBook (Companies & Contacts)
│   ├── gate (Gate reviews)
│   ├── nda (NDA management)
│   ├── dd (Due diligence)
│   ├── contract (Contracts)
│   └── ... (tasks, calendar, etc.)

Routing
├── Public Routes (/, /login, /survey/:id)
└── Protected Routes (Everything else - requires login)

Data
└── Mock Data (Simulated backend)
    ├── 30+ Projects
    ├── 50+ Companies
    ├── 100+ Contacts
    ├── Sample surveys, tasks, etc.
```

---

## 🎬 The Complete User Journey

### Journey 1: External Partner Submits Survey

**Flow:** `Public Survey → Survey Review → Project Creation → Evaluation`

#### Step-by-Step:

1. **Partner receives survey link**
   - URL format: `http://localhost:5173/survey/survey-001`
   - No login required (public route)

2. **Partner fills out survey**
   - Multi-section form
   - Required fields validation
   - Conditional questions (based on previous answers)
   - Progress indicator

3. **Partner submits survey**
   - Data saved to Redux store
   - Status changes to "Submitted"
   - Notification created for internal team

4. **Internal team reviews submission**
   - Navigate to `/surveys`
   - View submission details
   - Extract key information
   - Create project from survey

5. **Project enters pipeline**
   - Initial stage: "DATA_GATHERING"
   - Appears on Dashboard
   - Ready for evaluation

---

### Journey 2: Internal Team Evaluates Project

**Flow:** `Dashboard → Project Detail → Scoring → Gate Review → Decision`

#### Step-by-Step:

1. **View projects on Dashboard**
   - Navigate to `/dashboard`
   - See project cards with key metrics
   - Filter by stage, score, tags

2. **Open project detail**
   - Click on project card
   - Navigate to `/projects/:id`
   - See comprehensive project information

3. **Review project information**
   - **Overview Tab**: Basic info, description, team
   - **Survey Data Tab**: Extracted survey responses
   - **Scoring Tab**: Lead score breakdown
   - **Japan Screening Tab**: Market fit analysis
   - **Documents Tab**: Uploaded files
   - **Activity Tab**: History log

4. **Score the project**
   - Navigate to Scoring tab
   - System shows 6 scoring factors:
     1. Technology Innovation (0-25 points)
     2. Market Size (0-20 points)
     3. Team Quality (0-15 points)
     4. IP Strength (0-15 points)
     5. Clinical Data (0-15 points)
     6. Strategic Fit (0-10 points)
   - Total score: 0-100
   - Classification:
     - 70+: HOT (High priority)
     - 50-69: WARM (Medium priority)
     - <50: COLD (Low priority)

5. **Conduct Gate Review**
   - **Gate 1** (After Data Gathering):
     - Check survey completion (≥80% required)
     - Review documentation
     - Decision: PASS, FAIL, DEFER

   - **Gate 2** (After 1-on-1 Meeting):
     - Score must be ≥50
     - Assess partnership potential
     - Decision: PASS, FAIL, DEFER

   - **Gate 3** (Senior Decision):
     - Score must be ≥70
     - Strategic alignment review
     - Decision: PASS, FAIL, DEFER

6. **Move project through stages**
   - Click "Move to Next Stage" button
   - Provide reason/notes
   - Project advances in pipeline
   - History tracked

---

### Journey 3: Japan Market Screening

**Flow:** `Project → Japan Screening → Market Fit Assessment`

#### Step-by-Step:

1. **Open Japan Screening workspace**
   - From project detail page
   - Click "Japan Market Screening" tab
   - Or navigate to `/projects/:id/japan-screening`

2. **Review 7 assessment sections**
   1. **Regulatory Landscape**
      - PMDA approval pathway
      - Clinical trial requirements
      - Timeline estimates

   2. **Market Size & Opportunity**
      - TAM/SAM/SOM analysis
      - Growth projections
      - Competition

   3. **Reimbursement Scenario**
      - NHI coverage potential
      - Pricing strategy
      - Health economics

   4. **Partnership Landscape**
      - Potential Japanese partners
      - Distribution channels
      - Commercialization strategy

   5. **Cultural & Business Fit**
      - Company culture alignment
      - Communication readiness
      - Localization needs

   6. **IP & Exclusivity**
      - Patent status in Japan
      - Freedom to operate
      - Competitive moats

   7. **Risk Assessment**
      - Regulatory risks
      - Market risks
      - Execution risks

3. **Assess market fit**
   - Rate each section
   - Overall assessment: HIGH, MEDIUM, LOW
   - Add notes and recommendations

4. **Save assessment**
   - Data linked to project
   - Visible in project overview
   - Informs decision making

---

### Journey 4: NDA Management

**Flow:** `Project Approved → Create NDA → Send for Signatures → Execute`

#### Step-by-Step:

1. **Navigate to NDA page**
   - Go to `/ndas`
   - View all NDAs

2. **Create new NDA**
   - Click "Create NDA"
   - Select NDA type:
     - Mutual NDA (both parties share confidential info)
     - One-Way Incoming (they share with us)
     - One-Way Outgoing (we share with them)

3. **Fill NDA details**
   - Link to project
   - Link to company
   - Add signatory details:
     - Name, email, role, organization
     - Signing order (if sequential)
   - Upload NDA document
   - Set terms:
     - Purpose
     - Jurisdiction
     - Term (years)
     - Exclusions

4. **Send for signatures**
   - Change status to "PENDING_SIGNATURES"
   - System tracks:
     - Who signed
     - When signed
     - IP address
     - Signature method

5. **Track signing progress**
   - View progress bar
   - See who's pending
   - Send reminders
   - Status updates:
     - DRAFT → PENDING_SIGNATURES → PARTIALLY_SIGNED → FULLY_SIGNED

6. **Execute NDA**
   - All parties sign
   - Status: FULLY_SIGNED
   - Project can move to Due Diligence

---

### Journey 5: Due Diligence

**Flow:** `NDA Signed → DD Workspace → Assessment → Decision`

#### Step-by-Step:

1. **Navigate to DD Workspace**
   - Go to `/dd-workspace`
   - Or from project detail page

2. **Create DD workspace**
   - Link to project
   - Select template:
     - Biotech
     - Pharma
     - MedTech
     - Diagnostic
     - General

3. **Review DD sections**
   Template includes:
   1. **Technology & R&D**
      - Scientific validity
      - Development stage
      - Manufacturing readiness

   2. **Market & Competition**
      - Market analysis
      - Competitive landscape
      - Positioning

   3. **Team & Management**
      - Leadership assessment
      - Advisory board
      - Key personnel

   4. **Legal**
      - Corporate structure
      - Litigation history
      - Compliance

   5. **Financial**
      - Burn rate
      - Runway
      - Previous funding

   6. **Regulatory**
      - Regulatory strategy
      - Interactions with regulators
      - Approval timeline

   7. **Intellectual Property**
      - Patent portfolio
      - Freedom to operate
      - Trade secrets

   8. **Operational**
      - Facilities
      - Quality systems
      - Supply chain

   9. **Commercial**
      - Go-to-market strategy
      - Sales & marketing
      - Customer pipeline

4. **Complete DD items**
   - Each section has checklist items
   - Assign to team members
   - Set due dates
   - Upload supporting documents
   - Rate items:
     - EXCELLENT
     - GOOD
     - ACCEPTABLE
     - CONCERNING
     - CRITICAL
   - Assess risk level: LOW, MEDIUM, HIGH, CRITICAL

5. **Track progress**
   - Overall completion percentage
   - Section-by-section status
   - Blocked items
   - Review requirements

6. **Finalize assessment**
   - Overall rating
   - Risk level
   - Executive summary
   - Major risks identified
   - Key opportunities
   - Recommendation: GO / NO-GO

---

### Journey 6: Contract Management

**Flow:** `DD Complete → Contract Creation → Negotiation → Execution`

#### Step-by-Step:

1. **Navigate to Contracts page**
   - Go to `/contracts`

2. **Create contract**
   - Link to project
   - Select type:
     - Licensing Agreement
     - Partnership Agreement
     - Collaboration Agreement
     - Service Agreement
     - Supply Agreement
     - Consulting Agreement
     - Material Transfer Agreement (MTA)
     - Other

3. **Define contract parties**
   - Add parties:
     - Client/Provider
     - Licensor/Licensee
     - Partners
   - Contact information
   - Address details
   - Signature requirements

4. **Set financial terms**
   - Total contract value
   - Currency
   - Payment schedule:
     - Amount
     - Due date
     - Description
     - Link to invoices

5. **Define milestones**
   - Title and description
   - Target dates
   - Deliverables
   - Payment triggers
   - Completion criteria

6. **Legal terms**
   - Jurisdiction
   - Governing law
   - Dispute resolution
   - Termination clauses
   - Auto-renewal settings
   - Notice periods

7. **Upload documents**
   - Main contract
   - Amendments
   - Appendices
   - Supporting documents
   - Invoices

8. **Approval workflow**
   - Legal review
   - Finance approval
   - Final approval
   - Signatures collected

9. **Track contract lifecycle**
   - Status: DRAFT → PENDING_REVIEW → ACTIVE
   - Monitor payments
   - Track milestones
   - Renewal reminders
   - Expiration alerts

---

## 🎛️ Feature-by-Feature Guide

### Dashboard (`/dashboard`)

**Purpose:** Command center for all activities

**What you see:**
- **Quick Stats Cards**
  - Active Projects
  - Pending Surveys
  - Upcoming Tasks
  - Recent Activities

- **Hot Projects** (Score ≥70)
  - High-priority opportunities
  - Quick actions

- **Pending Gate Reviews**
  - Projects awaiting approval
  - Gate level indicator

- **Recent Activity Feed**
  - Timeline of recent actions
  - User activity tracking

**Actions:**
- View project details
- Quick filters
- Navigate to detailed pages

---

### Projects Page (`/projects`)

**Purpose:** Manage all partnership projects

**Features:**
1. **Project List View**
   - Grid or table layout
   - Sort by: name, score, stage, date
   - Search by name or company

2. **Advanced Filtering**
   - By stage
   - By score range (HOT/WARM/COLD)
   - By tags
   - By Japan interest
   - By company
   - By date range

3. **Project Cards Show:**
   - Company logo
   - Project name
   - Current stage
   - Score with badge (HOT/WARM/COLD)
   - Key metrics:
     - Survey completion
     - DD progress
     - Gate status
   - Tags
   - Last activity

4. **Actions:**
   - Create new project
   - Edit project
   - Duplicate project
   - Delete project
   - Move to stage
   - View details

---

### Project Detail Page (`/projects/:id`)

**Purpose:** Complete project information hub

**Tabs:**

1. **Overview**
   - Basic information
   - Company details
   - Team members
   - Description
   - Current stage
   - Score
   - Tags
   - Timeline

2. **Survey Data**
   - Linked survey responses
   - Question-by-question review
   - Completion percentage
   - Submitted date

3. **Scoring**
   - Score breakdown by factor
   - Score history
   - Last scored date
   - Score chart/visualization

4. **Japan Screening**
   - Market fit assessment
   - Section-by-section ratings
   - Overall recommendation

5. **Gate Reviews**
   - Gate 1, 2, 3 status
   - Review history
   - Reviewer notes
   - Pass/Fail decisions

6. **Documents**
   - Uploaded files
   - Categories
   - Upload new documents
   - Document versioning

7. **Notes & Activity**
   - Internal notes
   - Activity timeline
   - Stage changes
   - Score updates
   - Document uploads

**Key Actions:**
- Edit project details
- Move to next stage
- Conduct gate review
- Add/remove tags
- Upload documents
- Add notes
- Link related items (surveys, NDAs, contracts)

---

### Pipeline View (`/pipeline`)

**Purpose:** Visual workflow management

**What you see:**
- **Kanban Board** with 8 columns (one per stage):
  1. Lobby
  2. Data Gathering
  3. Screening
  4. 1-on-1 Meeting
  5. Senior Decision
  6. NDA
  7. Due Diligence
  8. Contract

- **Project Cards** showing:
  - Company name
  - Project name
  - Score badge
  - Days in current stage
  - Assignee
  - Next action

**Interactions:**
- Drag and drop to move stages
- Click card to open details
- Filter by assignee, score, tags
- Search projects
- Quick actions menu

**Metrics:**
- Count per stage
- Average time in stage
- Conversion rates
- Bottleneck identification

---

### Surveys (`/surveys`)

**Purpose:** Manage survey submissions and templates

**Two Main Sections:**

#### 1. Survey Submissions (`/surveys`)
- **View all submissions**
- **Filter by:**
  - Status (Draft, In Progress, Submitted, Reviewed)
  - Date range
  - Company
  - Completion percentage

- **Survey List Shows:**
  - Survey title
  - Company name
  - Status badge
  - Completion %
  - Submitted date
  - Assigned reviewer

- **Actions:**
  - Review submission
  - Extract data to project
  - Export responses
  - Send reminders
  - Mark as reviewed

#### 2. Survey Templates (`/admin/survey-templates`)
- **Create new templates**
- **Manage existing templates**
- **Template Library:**
  - Partner Interest Survey
  - Technical Assessment
  - Financial Questionnaire
  - Clinical Development
  - Market Analysis

**Survey Builder** (`/admin/survey-builder/:id`)
- **Drag-and-drop question builder**
- **Question Types:**
  - Short text
  - Long text (textarea)
  - Multiple choice (single)
  - Multiple choice (multi-select)
  - Number input
  - Date picker
  - Rating scale
  - File upload

- **Advanced Features:**
  - Conditional logic (show/hide based on answers)
  - Required fields
  - Question sections
  - Progress tracking
  - Custom validation rules

**Public Survey Form** (`/survey/:id`)
- **Clean, simple interface for partners**
- **Features:**
  - Section-by-section navigation
  - Progress bar
  - Auto-save (draft mode)
  - Validation messages
  - File upload support
  - Mobile-responsive
  - No login required

---

### Lead Scoring (`/lead-scoring`)

**Purpose:** Systematic project evaluation

**Scoring Factors:**

1. **Technology Innovation** (0-25 points)
   - Novelty of approach
   - Scientific validity
   - Competitive advantage
   - Patent protection

2. **Market Size** (0-20 points)
   - Total addressable market
   - Growth rate
   - Market accessibility
   - Reimbursement potential

3. **Team Quality** (0-15 points)
   - Leadership experience
   - Technical expertise
   - Track record
   - Advisory board

4. **IP Strength** (0-15 points)
   - Patent portfolio
   - Freedom to operate
   - Trade secrets
   - Competitive barriers

5. **Clinical Data** (0-15 points)
   - Development stage
   - Trial results
   - Regulatory interactions
   - Risk profile

6. **Strategic Fit** (0-10 points)
   - Alignment with goals
   - Synergies with portfolio
   - Resource requirements
   - Geographic fit

**Scoring Interface:**
- **Score each factor individually**
- **See total score in real-time**
- **Classification:**
  - 70-100: HOT 🔥 (High priority)
  - 50-69: WARM 🌡️ (Medium priority)
  - 0-49: COLD ❄️ (Low priority)

- **Score History:**
  - Track score changes over time
  - See who scored when
  - Notes for each scoring session

**Usage:**
1. Navigate to project
2. Go to Scoring tab
3. Rate each factor (0-max points)
4. Add notes/justification
5. Save score
6. Project classification updates automatically

---

### Companies & Contacts (`/companies`, `/contacts`)

**Purpose:** Address book for partner organizations

#### Companies Page (`/companies`)

**Features:**
- **Company directory**
- **Search and filter**
- **Company cards show:**
  - Logo
  - Name
  - Industry
  - Location (city, country)
  - Primary contact
  - Linked projects count
  - Last interaction date
  - Tags

**Actions:**
- Add new company
- Edit company details
- View company detail page
- Delete company
- Import from CSV
- Export to CSV

**Company Detail Page** (`/companies/:id`)

**Tabs:**

1. **Overview**
   - Basic information
   - Industry sector
   - Company size
   - Founded date
   - Website
   - Description
   - Tags

2. **Contacts**
   - All contacts at this company
   - Primary contact indicator
   - Contact details
   - Add new contact
   - Edit contacts

3. **Projects**
   - All projects with this company
   - Project status
   - Quick navigation

4. **Notes & Activity**
   - Internal notes
   - Interaction history
   - Timeline

#### Contacts Page (`/contacts`)

**Features:**
- **Contact directory**
- **Advanced search**
- **Filter by:**
  - Company
  - Department
  - Role
  - Tags

**Contact cards show:**
- Name
- Title
- Company
- Email
- Phone
- Primary contact badge
- Last contact date

**Actions:**
- Add new contact
- Edit contact
- Delete contact
- Import from CSV
- Export to CSV
- Send email
- Add to task

**CSV Import/Export:**
- **Export format:**
  - First Name, Last Name
  - Email, Phone
  - Title, Department
  - Company
  - Primary Contact (true/false)
  - Notes

- **Import:**
  - Upload CSV file
  - Map columns
  - Validate data
  - Review errors
  - Import confirmed records

---

### Communications (`/communications`)

**Purpose:** Email and message management

**Features:**

1. **Email Composer**
   - Rich text editor
   - To/CC/BCC fields
   - Subject line
   - Email templates
   - Attachments
   - Send scheduling

2. **Email Templates**
   - Pre-written templates for common scenarios:
     - Initial outreach
     - Meeting request
     - Follow-up
     - Document request
     - Status update
     - Rejection notice

3. **Inbox** (Simulated)
   - View sent emails
   - Email history
   - Thread view
   - Search and filter

4. **Integration Placeholders**
   - Gmail integration (Phase 2)
   - Outlook integration (Phase 2)
   - Email tracking (Phase 2)

---

### Tasks (`/tasks`)

**Purpose:** Task and action item management

**Features:**

1. **Task List**
   - All tasks view
   - My tasks view
   - Team tasks view

2. **Task Views:**
   - **List View**: Detailed list with all info
   - **Board View**: Kanban by status
   - **Calendar View**: Tasks by due date

3. **Task Properties:**
   - Title and description
   - Status: Not Started, In Progress, Completed, Blocked
   - Priority: Low, Medium, High, Urgent
   - Assignee
   - Due date
   - Linked project/company
   - Checklist items
   - Attachments
   - Tags

4. **Filtering:**
   - By status
   - By priority
   - By assignee
   - By due date
   - By project
   - Overdue tasks

5. **Actions:**
   - Create task
   - Edit task
   - Change status
   - Reassign
   - Set due date
   - Add subtasks
   - Add comments
   - Link to project

---

### Calendar (`/calendar`)

**Purpose:** Schedule and event management

**Features:**

1. **Calendar Views:**
   - Month view
   - Week view
   - Day view
   - Agenda list

2. **Event Types:**
   - Meeting (1-on-1, team, external)
   - Call
   - Conference
   - Deadline
   - Reminder
   - Other

3. **Event Details:**
   - Title and description
   - Start/end time
   - All-day option
   - Location:
     - Physical address
     - Online (meeting URL)
     - Phone
   - Attendees
   - Linked project
   - Agenda
   - Reminders

4. **Actions:**
   - Create event
   - Edit event
   - Delete event
   - Invite attendees
   - Add to Google Calendar (placeholder)
   - Send meeting invites (placeholder)

---

### Documents (`/documents`)

**Purpose:** File management and document repository

**Features:**

1. **Document Library**
   - All documents
   - Folder structure
   - Recent documents
   - Starred/favorites

2. **Document Categories:**
   - Contracts
   - NDAs
   - Presentations
   - Financial documents
   - Technical documents
   - Due diligence materials
   - Marketing materials
   - Other

3. **Document Properties:**
   - Name and description
   - File type
   - Size
   - Upload date
   - Uploaded by
   - Version
   - Category
   - Tags
   - Linked project/company
   - Access level

4. **Actions:**
   - Upload document
   - Download document
   - Preview (PDF, images)
   - Delete document
   - Share (placeholder)
   - Version control
   - Move to folder

5. **Search & Filter:**
   - Full-text search
   - Filter by category
   - Filter by project
   - Filter by date
   - Filter by file type

---

### Settings (`/settings`)

**Purpose:** User and system preferences

**Settings Sections:**

1. **Profile**
   - Name and email
   - Photo
   - Job title
   - Phone
   - Bio

2. **Account**
   - Change password
   - Email preferences
   - Two-factor authentication (placeholder)

3. **Notifications**
   - Email notifications
   - In-app notifications
   - Notification preferences by type:
     - New survey submissions
     - Gate reviews
     - Task assignments
     - Document uploads
     - Contract updates

4. **Preferences**
   - Default view (list/grid)
   - Time zone
   - Date format
   - Language
   - Theme (light/dark) - placeholder

5. **Integrations** (Placeholder for Phase 2)
   - Email integration
   - Calendar sync
   - CRM integration
   - Storage integration

---

## 💾 Data Flow & State Management

### Redux Store Structure

```javascript
store
├── auth
│   ├── currentUser
│   ├── isAuthenticated
│   └── permissions
│
├── projects
│   ├── projects[] (All project data)
│   ├── selectedProjectId
│   └── filters
│
├── surveys
│   ├── surveys[] (All surveys)
│   ├── templates[]
│   └── responses[]
│
├── addressBook
│   ├── companies[]
│   └── contacts[]
│
├── gate
│   ├── reviews[]
│   └── history[]
│
├── nda
│   ├── ndas[]
│   └── signatories[]
│
├── dd
│   ├── workspaces[]
│   └── sections[]
│
├── contract
│   ├── contracts[]
│   ├── payments[]
│   └── milestones[]
│
├── communications
│   ├── emails[]
│   └── templates[]
│
├── tasks
│   └── tasks[]
│
├── calendar
│   └── events[]
│
├── documents
│   └── documents[]
│
├── notifications
│   └── notifications[]
│
├── pipeline
│   └── stageData
│
├── extraction
│   └── extractedData
│
├── userPreferences
│   └── preferences
│
└── emailTemplates
    └── templates[]
```

### Data Flow Pattern

```
Component (UI)
    ↓
Dispatch Action (Redux)
    ↓
Reducer (Update State)
    ↓
Store (New State)
    ↓
Selector (Read State)
    ↓
Component Re-render (UI Updates)
```

### Example: Creating a Project

```
1. User clicks "Create Project" button
   → ProjectsPage.tsx

2. Opens ProjectFormModal
   → User fills form

3. User clicks "Save"
   → Dispatches addProject(projectData)

4. projectsSlice reducer handles action
   → Adds project to state.projects[]

5. Component re-renders with new data
   → Project appears in list
   → Notification created
   → Activity logged
```

### Mock Data Initialization

All Redux slices are initialized with mock data:

```javascript
// src/data/mockProjects.ts
export const mockProjects = [
  {
    id: 'project-001',
    name: 'NeuroRegen Therapeutics',
    // ... 30+ realistic projects
  }
]

// In projectsSlice.ts
const initialState = {
  projects: mockProjects, // Pre-loaded
  ...
}
```

**Available Mock Data:**
- **30+ Projects** across all stages
- **50+ Companies** from various industries
- **100+ Contacts** with realistic profiles
- **15+ Surveys** in different states
- **Sample NDAs, Contracts, DD workspaces**
- **Tasks, Events, Documents**

---

## 🧪 Testing Scenarios

### Scenario 1: End-to-End Partnership Flow

**Goal:** Follow a project from survey to contract

#### Steps:

1. **External Partner Submits Survey**
   ```
   1. Go to http://localhost:5173/survey/survey-001
   2. Fill out all sections
   3. Submit
   ```

2. **Internal Team Reviews Survey**
   ```
   1. Login as admin@hekabio.com
   2. Go to /surveys
   3. Find the new submission
   4. Click "Review"
   5. Click "Create Project from Survey"
   ```

3. **Project Enters Pipeline**
   ```
   1. Go to /projects
   2. See new project in "DATA_GATHERING" stage
   3. Click project to open details
   ```

4. **Score the Project**
   ```
   1. Go to "Scoring" tab
   2. Rate each factor:
      - Technology Innovation: 20/25
      - Market Size: 15/20
      - Team Quality: 12/15
      - IP Strength: 10/15
      - Clinical Data: 10/15
      - Strategic Fit: 8/10
   3. Total: 75 (HOT)
   4. Save score
   ```

5. **Conduct Gate 1 Review**
   ```
   1. Go to "Gate Reviews" tab
   2. Click "Conduct Gate 1 Review"
   3. Review checklist:
      ✓ Survey completion ≥80%
      ✓ Basic documentation provided
      ✓ Initial assessment positive
   4. Decision: PASS
   5. Add notes: "Strong technology, good team"
   6. Submit review
   ```

6. **Move to Next Stage**
   ```
   1. Click "Move to Next Stage"
   2. Select "SCREENING"
   3. Add reason: "Passed Gate 1 review"
   4. Confirm
   5. Project moves to SCREENING stage
   ```

7. **Japan Market Screening**
   ```
   1. Go to "Japan Screening" tab
   2. Complete assessment sections:
      - Regulatory: MEDIUM fit
      - Market Size: HIGH potential
      - Reimbursement: MEDIUM
      - Partnership: HIGH
      - Cultural Fit: HIGH
      - IP: MEDIUM
      - Risk: LOW
   3. Overall: HIGH market fit
   4. Save assessment
   ```

8. **Create NDA**
   ```
   1. Go to /ndas
   2. Click "Create NDA"
   3. Select "Mutual NDA"
   4. Link to project
   5. Add signatories:
      - From HekaBio: Legal Officer
      - From Partner: CEO
   6. Upload NDA document
   7. Set terms: 3 years, confidentiality
   8. Send for signatures
   ```

9. **Track NDA Signing**
   ```
   1. View NDA detail page
   2. See progress: 1/2 signed
   3. Click "Mark as Signed" for second signatory
   4. Status: FULLY_SIGNED
   ```

10. **Create DD Workspace**
    ```
    1. Go to /dd-workspace
    2. Create new workspace
    3. Link to project
    4. Select "Biotech" template
    5. Assign team members to sections
    6. Set due dates
    ```

11. **Complete Due Diligence**
    ```
    1. Review each DD section
    2. Complete checklist items
    3. Upload supporting documents
    4. Rate items (GOOD/ACCEPTABLE/etc.)
    5. Assess risks (LOW/MEDIUM/HIGH)
    6. Overall rating: GOOD
    7. Recommendation: GO
    8. Finalize workspace
    ```

12. **Create Contract**
    ```
    1. Go to /contracts
    2. Create new contract
    3. Type: Partnership Agreement
    4. Add parties
    5. Set financial terms:
       - Total value: $5M
       - Payment schedule
       - Milestones
    6. Upload contract document
    7. Send for approvals
    8. Track to execution
    ```

**Expected Result:** Complete partnership lifecycle tracked from initial contact to executed contract.

---

### Scenario 2: Multi-Project Evaluation

**Goal:** Compare and prioritize multiple projects

#### Steps:

1. **Create Multiple Projects**
   ```
   1. Go to /projects
   2. Create 3 new projects:
      - Project A: Novel cancer therapy
      - Project B: Diagnostic platform
      - Project C: Medical device
   ```

2. **Score All Projects**
   ```
   Project A:
   - Technology: 22/25
   - Market: 18/20
   - Team: 13/15
   - IP: 12/15
   - Clinical: 12/15
   - Strategic: 9/10
   Total: 86 (HOT)

   Project B:
   - Technology: 15/25
   - Market: 12/20
   - Team: 10/15
   - IP: 8/15
   - Clinical: 8/15
   - Strategic: 6/10
   Total: 59 (WARM)

   Project C:
   - Technology: 10/25
   - Market: 10/20
   - Team: 8/15
   - IP: 6/15
   - Clinical: 5/15
   - Strategic: 5/10
   Total: 44 (COLD)
   ```

3. **View on Dashboard**
   ```
   1. Go to /dashboard
   2. See "Hot Projects" section
   3. Only Project A appears (score ≥70)
   ```

4. **Filter Projects**
   ```
   1. Go to /projects
   2. Filter: Score ≥70 (HOT only)
   3. See only Project A
   4. Clear filter
   5. Filter: Score 50-69 (WARM only)
   6. See only Project B
   ```

5. **Pipeline View**
   ```
   1. Go to /pipeline
   2. See all projects in their stages
   3. Drag Project A to "SCREENING"
   4. Project B remains in "DATA_GATHERING"
   5. Project C can be moved to "DECLINED"
   ```

**Expected Result:** Clear prioritization based on scores, easy comparison and workflow management.

---

### Scenario 3: Gate Review Workflow

**Goal:** Test gate approval process

#### Steps:

1. **Project at Gate 1**
   ```
   1. Select project in "DATA_GATHERING" stage
   2. Ensure survey completion ≥80%
   3. Go to Gate Reviews tab
   4. Conduct Gate 1 review
   ```

2. **Gate 1: PASS**
   ```
   1. Review criteria met
   2. Decision: PASS
   3. Notes: "Complete data, ready for screening"
   4. Submit
   5. Project can advance to SCREENING
   ```

3. **Gate 1: FAIL**
   ```
   1. Review criteria not met
   2. Decision: FAIL
   3. Notes: "Incomplete survey, missing financials"
   4. Submit
   5. Project cannot advance
   6. Task created to complete requirements
   ```

4. **Gate 1: DEFER**
   ```
   1. Need more information
   2. Decision: DEFER
   3. Notes: "Waiting for clinical trial data"
   4. Submit
   5. Project remains in stage
   6. Follow-up task created
   ```

5. **Gate 2 Review** (After 1-on-1 meeting)
   ```
   1. Project in "ONE_ON_ONE" stage
   2. Check score ≥50 requirement
   3. Conduct Gate 2 review
   4. Evaluate meeting outcomes
   5. Decision: PASS/FAIL/DEFER
   ```

6. **Gate 3 Review** (Senior decision)
   ```
   1. Project in "SENIOR_DECISION" stage
   2. Check score ≥70 requirement
   3. Conduct Gate 3 review
   4. Strategic alignment check
   5. Senior stakeholder approval
   6. Final GO/NO-GO decision
   ```

**Expected Result:** Structured gate process prevents projects from advancing without meeting criteria.

---

### Scenario 4: Company & Contact Management

**Goal:** Build and manage address book

#### Steps:

1. **Add New Company**
   ```
   1. Go to /companies
   2. Click "Add Company"
   3. Fill details:
      - Name: BioInnovate Inc.
      - Industry: Biotechnology
      - Location: Boston, MA, USA
      - Website: www.bioinnovate.com
      - Tags: Biotech, Oncology, Series B
   4. Save
   ```

2. **Add Contacts to Company**
   ```
   1. Open company detail page
   2. Go to Contacts tab
   3. Add contact:
      - Name: Dr. Jane Smith
      - Title: CEO
      - Email: jane.smith@bioinnovate.com
      - Phone: +1-617-555-0100
      - Primary: Yes
   4. Add another contact:
      - Name: Dr. John Doe
      - Title: CSO
      - Email: john.doe@bioinnovate.com
      - Primary: No
   5. Save
   ```

3. **Import Contacts from CSV**
   ```
   1. Prepare CSV file:
      First Name,Last Name,Email,Phone,Title,Company
      Alice,Johnson,alice@example.com,555-0101,VP BD,TechCorp
      Bob,Williams,bob@example.com,555-0102,Director,TechCorp

   2. Go to /contacts
   3. Click "Import from CSV"
   4. Upload file
   5. Map columns
   6. Review preview
   7. Import
   ```

4. **Link Company to Project**
   ```
   1. Go to /projects
   2. Create or edit project
   3. Select company: BioInnovate Inc.
   4. Primary contact auto-populated: Dr. Jane Smith
   5. Save
   ```

5. **View Company's Projects**
   ```
   1. Go to /companies
   2. Open BioInnovate Inc.
   3. Go to Projects tab
   4. See all linked projects
   5. Click to navigate to project details
   ```

**Expected Result:** Centralized contact management with easy linking to projects.

---

### Scenario 5: Task Management

**Goal:** Create and track tasks across projects

#### Steps:

1. **Create Task from Project**
   ```
   1. Open project detail page
   2. Click "Create Task"
   3. Fill details:
      - Title: "Review clinical trial data"
      - Description: "Analyze Phase 2 results"
      - Priority: High
      - Assignee: Data Analyst
      - Due date: 7 days from now
      - Linked project: Current project
   4. Save
   ```

2. **View Tasks Dashboard**
   ```
   1. Go to /tasks
   2. See all tasks
   3. Filter: "My Tasks"
   4. See tasks assigned to you
   ```

3. **Update Task Status**
   ```
   1. Click task to open
   2. Change status: Not Started → In Progress
   3. Add comment: "Started data analysis"
   4. Update progress
   5. Save
   ```

4. **Complete Task**
   ```
   1. Click task
   2. Mark checklist items as done
   3. Add final comment
   4. Change status: In Progress → Completed
   5. Save
   ```

5. **Overdue Tasks**
   ```
   1. Go to /tasks
   2. Filter: "Overdue"
   3. See tasks past due date
   4. Take action to complete or reschedule
   ```

**Expected Result:** Organized task tracking with clear accountability and deadlines.

---

## 🔧 Troubleshooting

### Issue: Login not working

**Problem:** Cannot login with credentials

**Solutions:**
1. **Check credentials:**
   - Email: `admin@hekabio.com`
   - Password: `admin123`
   - Ensure no extra spaces

2. **Clear browser storage:**
   ```javascript
   // Open browser console (F12)
   localStorage.clear()
   // Refresh page
   ```

3. **Check console for errors:**
   - Open Developer Tools (F12)
   - Go to Console tab
   - Look for error messages

---

### Issue: Projects not loading

**Problem:** Empty project list or loading forever

**Solutions:**
1. **Check Redux state:**
   ```javascript
   // In console
   store.getState().projects
   // Should show projects array
   ```

2. **Verify mock data loaded:**
   - Mock data should load automatically
   - Check `src/data/mockProjects.ts` exists

3. **Check for JavaScript errors:**
   - Open Console (F12)
   - Look for errors
   - Common issues:
     - Type errors
     - Import errors
     - Missing dependencies

---

### Issue: Routing not working

**Problem:** Navigation doesn't change page

**Solutions:**
1. **Ensure BrowserRouter is set up:**
   - Check `App.tsx`
   - Should have `<BrowserRouter>` wrapper

2. **Check protected routes:**
   - Must be logged in to access protected routes
   - Login first, then navigate

3. **Hard refresh:**
   - Press Ctrl+Shift+R (Windows)
   - Press Cmd+Shift+R (Mac)

---

### Issue: Forms not submitting

**Problem:** Form submit button doesn't work

**Solutions:**
1. **Check validation:**
   - Are all required fields filled?
   - Look for validation error messages
   - Check console for validation errors

2. **Check form state:**
   - Form component should show form data in state
   - Use React DevTools to inspect

3. **Check Redux actions:**
   - Ensure action is dispatched
   - Check Redux DevTools for action flow

---

### Issue: Build fails

**Problem:** `npm run build` shows errors

**Solutions:**
1. **Run lint:**
   ```bash
   npm run lint
   ```
   - Fix any ESLint errors

2. **Check TypeScript:**
   ```bash
   npx tsc --noEmit
   ```
   - Fix type errors

3. **Clear cache and reinstall:**
   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   npm run build
   ```

---

### Issue: Styles not appearing

**Problem:** UI looks broken, no styling

**Solutions:**
1. **Check Tailwind CSS:**
   - Ensure `tailwind.config.js` exists
   - Check `index.css` imports Tailwind

2. **Rebuild:**
   ```bash
   npm run dev
   ```

3. **Clear browser cache:**
   - Hard refresh (Ctrl+Shift+R)
   - Clear cache in browser settings

---

## 📚 Next Steps

### Phase 1 Complete ✅

You now have a fully functional BioPharma Partnership Management platform with:
- ✅ Complete project lifecycle management
- ✅ Multi-gate vetting process
- ✅ Lead scoring engine
- ✅ Japan market screening
- ✅ NDA management
- ✅ Due diligence workspace
- ✅ Contract tracking
- ✅ Survey system
- ✅ Task & calendar management
- ✅ Company & contact management
- ✅ Document repository

### Recommended Learning Path

1. **Day 1: Get Familiar**
   - Start the app
   - Login and explore dashboard
   - Navigate all main pages
   - Understand the menu structure

2. **Day 2: Survey Flow**
   - Fill out public survey
   - Review survey submission
   - Create project from survey
   - See data extraction

3. **Day 3: Project Management**
   - Create projects manually
   - Edit project details
   - Move through stages
   - Try pipeline drag-and-drop

4. **Day 4: Scoring & Gates**
   - Score multiple projects
   - Understand HOT/WARM/COLD
   - Conduct gate reviews
   - See how gates block progression

5. **Day 5: Japan Screening**
   - Complete full Japan assessment
   - Understand market fit ratings
   - See how it informs decisions

6. **Day 6: NDA & DD**
   - Create NDA
   - Track signatory progress
   - Create DD workspace
   - Complete DD items

7. **Day 7: Contracts**
   - Create contract
   - Add milestones and payments
   - Track contract lifecycle

8. **Day 8: Task & Calendar**
   - Create tasks
   - Link to projects
   - Add calendar events
   - See task workflow

9. **Day 9: Address Book**
   - Add companies
   - Import contacts
   - Link to projects

10. **Day 10: End-to-End**
    - Run complete partnership flow
    - Survey → Project → Score → Gate → NDA → DD → Contract

### Future Enhancements (Phase 2+)

Based on the current implementation, future phases could include:

1. **Backend Integration**
   - Real database (PostgreSQL)
   - REST API
   - Authentication server
   - File storage (AWS S3)

2. **Advanced Features**
   - Real-time collaboration
   - Advanced analytics & reporting
   - Email integration (Gmail, Outlook)
   - Calendar sync
   - Document version control
   - Workflow automation
   - Custom fields
   - API integrations
   - Mobile app

3. **Enhanced Security**
   - Role-based access control
   - Data encryption
   - Audit logs
   - Compliance features

---

## 🎓 Key Takeaways

### What Makes This Platform Unique

1. **Structured Process**
   - Clear stage workflow
   - Gate reviews prevent premature advancement
   - Audit trail for compliance

2. **Data-Driven Decisions**
   - Systematic scoring
   - Objective criteria
   - Historical tracking

3. **Comprehensive Management**
   - Single source of truth
   - All partnership data in one place
   - Connected workflows

4. **Flexibility**
   - Customizable surveys
   - Configurable scoring
   - Adaptable to different partnership types

### How to Think About the Platform

Think of HekaBio as a **CRM specifically designed for BioPharma partnerships**:

- **Salesforce** is for general sales
- **HekaBio** is for complex, long-term BioPharma collaborations

The platform manages:
- **Months-long evaluation processes**
- **Multiple stakeholder approvals**
- **Complex legal requirements**
- **Technical/scientific assessments**
- **Strategic alignment**

It's not just tracking contacts—it's managing a **partnership lifecycle** from first contact through executed agreements.

---

## 💬 Support & Resources

### Documentation Files
- `README.md` - Quick start guide
- `FINAL_SUMMARY.md` - Comprehensive project summary
- `IMPLEMENTATION_STATUS.md` - Feature completion status
- `GRANULAR_PHASES.md` - Development roadmap
- `PHASE1_FLOW_GUIDE.md` - This file!

### Code Structure
```
src/
├── components/      UI components
│   ├── ui/         Reusable UI elements
│   └── features/   Feature-specific components
├── features/       Feature modules
├── pages/          Page components
├── store/          Redux slices
├── hooks/          Custom React hooks
├── utils/          Utility functions
├── types/          TypeScript types
├── data/           Mock data
└── routes/         Route configuration
```

### Getting Help

If you encounter issues:
1. Check this guide
2. Check console for errors (F12)
3. Review code comments
4. Check TypeScript types for guidance

---

## 🎉 You're Ready!

You now have a complete understanding of how the HekaBio platform works. Follow the testing scenarios to get hands-on experience, and refer back to this guide whenever you need clarification.

**Happy exploring! 🚀**

---

*Last Updated: Phase 1 Complete - January 2026*
