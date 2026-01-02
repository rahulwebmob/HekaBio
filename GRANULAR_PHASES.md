
# HekaBio Platform - Granular Development Phases

## Tech Stack Decisions (LOCKED)

✅ **Frontend Framework**: React 18.3 + TypeScript 5+
✅ **Build Tool**: Vite 5+
✅ **UI Library**: Ant Design 5+ (enterprise-grade, excellent forms/tables/charts)
✅ **State Management**: Redux Toolkit + RTK Query
✅ **Routing**: React Router v6
✅ **Forms**: React Hook Form + Zod
✅ **Charts**: Apache ECharts (Ant Design compatible)
✅ **Icons**: @ant-design/icons
✅ **Date/Time**: Day.js
✅ **HTTP Client**: Axios + RTK Query
✅ **Language**: English only (Phase 1), i18n structure ready for future
✅ **AI Features**: Fully mocked with realistic dummy data
✅ **Approach**: Phase 1 complete → Phase 2 complete

---

## Phase Breakdown (16 Mini Phases)

### PHASE 0: Foundation & Setup (Week 1)

#### Phase 0.1: Project Initialization
- [ ] Initialize Vite + React + TypeScript project
- [ ] Configure TypeScript (strict mode)
- [ ] Set up ESLint + Prettier
- [ ] Create .gitignore
- [ ] Initialize git repository
- [ ] Create basic README

**Deliverable**: Running Vite dev server with TypeScript

---

#### Phase 0.2: Package Installation & Configuration
- [ ] Install Ant Design + @ant-design/icons
- [ ] Install Redux Toolkit + React Redux
- [ ] Install React Router DOM
- [ ] Install React Hook Form + Zod
- [ ] Install Day.js
- [ ] Install Axios
- [ ] Install development dependencies (types, etc.)

**Deliverable**: All dependencies installed, no errors

---

#### Phase 0.3: Theme & Design System
- [ ] Configure Ant Design theme with teal color (#00B8A9)
- [ ] Create CSS variables file
- [ ] Set up global styles
- [ ] Add logo assets to project
- [ ] Create color palette constants
- [ ] Set up responsive breakpoints

**Deliverable**: Themed Ant Design components with HekaBio branding

---

#### Phase 0.4: Redux Store Setup
- [ ] Create store configuration
- [ ] Set up Redux DevTools
- [ ] Create root reducer structure
- [ ] Add Redux Provider to App
- [ ] Create slice templates for consistency

**Deliverable**: Redux store ready with DevTools working

---

#### Phase 0.5: Routing Architecture
- [ ] Set up React Router with BrowserRouter
- [ ] Create route constants file
- [ ] Create basic route structure (public, authenticated)
- [ ] Create ProtectedRoute wrapper component
- [ ] Create RoleBasedRoute wrapper component
- [ ] Set up route configuration object

**Deliverable**: Basic routing working with protected routes

---

### PHASE 1: Authentication & Layouts (Week 1)

#### Phase 1.1: Layout Components
- [ ] Create AppLayout wrapper component
- [ ] Create Header component with logo & user menu
- [ ] Create Sidebar navigation with menu items
- [ ] Create Footer component
- [ ] Create responsive mobile drawer for sidebar
- [ ] Add layout state management (collapsed sidebar, etc.)

**Deliverable**: Fully functional app layout with navigation

---

#### Phase 1.2: Authentication System (Mock)
- [ ] Create authSlice with login/logout/register actions
- [ ] Create mock user database (different roles)
- [ ] Create Login page with form
- [ ] Create Registration page (if needed)
- [ ] Create role switcher for demo purposes
- [ ] Add session persistence (localStorage)
- [ ] Create useAuth hook

**Deliverable**: Mock authentication working with role switching

---

#### Phase 1.3: Role-Based Access Control
- [ ] Define all user roles enum
- [ ] Create permissions configuration object
- [ ] Create usePermissions hook
- [ ] Create RoleGate component for conditional rendering
- [ ] Add role-based menu visibility
- [ ] Add role-based page access restrictions

**Deliverable**: Role-based access control fully functional

---

#### Phase 1.4: Public Landing Page
- [ ] Create landing page with hero section
- [ ] Add HekaBio logo and tagline
- [ ] Create "Send us your innovation" CTA button
- [ ] Add navigation menu (Home, About, Team, Partnerships, Contact)
- [ ] Make responsive for mobile/tablet
- [ ] Add scenic background image

**Deliverable**: Professional landing page like sample UI

---

### PHASE 2: Address Book & Company Master (Week 2)

#### Phase 2.1: Data Models & Types
- [ ] Create Company TypeScript interface
- [ ] Create Contact TypeScript interface
- [ ] Create company roles enum
- [ ] Create mock company data (20+ companies)
- [ ] Create mock contact data (50+ contacts)
- [ ] Set up addressBookSlice

**Deliverable**: Type-safe data models with mock data

---

#### Phase 2.2: Company List & Search
- [ ] Create Companies list page with Ant Design Table
- [ ] Add search/filter functionality
- [ ] Add pagination
- [ ] Add sorting by columns
- [ ] Add quick filters (by role, country, category)
- [ ] Add "Add Company" button

**Deliverable**: Searchable, filterable company list

---

#### Phase 2.3: Company Detail & CRUD
- [ ] Create Company detail page
- [ ] Create Company form (add/edit) with validation
- [ ] Add company delete confirmation modal
- [ ] Show associated contacts in company detail
- [ ] Show associated projects in company detail
- [ ] Add activity timeline for company

**Deliverable**: Full CRUD operations for companies

---

#### Phase 2.4: Contact Management
- [ ] Create Contacts list page
- [ ] Create Contact form (add/edit)
- [ ] Add contact roles selection
- [ ] Link contacts to companies
- [ ] Add contact detail view
- [ ] Add contact import/export (CSV simulation)

**Deliverable**: Complete contact management system

---

### PHASE 3: Survey System (Week 3)

#### Phase 3.1: Survey Data Models
- [ ] Create Survey TypeScript interface
- [ ] Create Question types (text, select, radio, checkbox, file, etc.)
- [ ] Create Submission interface
- [ ] Create mock survey templates (Survey 1, Survey 2, Survey 3)
- [ ] Create surveysSlice

**Deliverable**: Survey data models and mock templates

---

#### Phase 3.2: Public Survey Form
- [ ] Create public survey route (/survey/:surveyId)
- [ ] Create dynamic form renderer based on survey config
- [ ] Add field validation with Zod
- [ ] Add auto-save to localStorage (draft)
- [ ] Add progress indicator
- [ ] Add file upload for introduction deck
- [ ] Create submission confirmation page
- [ ] Send mock acknowledgment email

**Deliverable**: Fully functional public survey submission

---

#### Phase 3.3: Survey Builder (Admin)
- [ ] Create Survey management page (admin only)
- [ ] Create survey list view
- [ ] Create drag-and-drop survey builder
- [ ] Add question type selector
- [ ] Add conditional logic builder (show/hide based on answers)
- [ ] Add QR code generator for survey links
- [ ] Allow survey preview before publishing

**Deliverable**: Admin can create custom surveys

---

#### Phase 3.4: Survey Analytics
- [ ] Create survey responses list
- [ ] Create individual response viewer
- [ ] Add basic analytics (completion rate, avg time)
- [ ] Add response filtering
- [ ] Add export responses to CSV
- [ ] Link survey submissions to projects

**Deliverable**: Survey analytics dashboard

---

### PHASE 4: Project Management Core (Week 4)

#### Phase 4.1: Project Data Models
- [ ] Create Project TypeScript interface
- [ ] Create Stage enum (all workflow stages)
- [ ] Create ProjectTag types
- [ ] Create StageChange interface
- [ ] Create mock project data (30+ projects)
- [ ] Create projectsSlice with RTK Query

**Deliverable**: Project data models with comprehensive mock data

---

#### Phase 4.2: Project List View
- [ ] Create Projects list page
- [ ] Add Ant Design Table with all project fields
- [ ] Add advanced filters (stage, tag, score, Japan interest, etc.)
- [ ] Add search functionality
- [ ] Add sorting by multiple columns
- [ ] Add bulk selection for batch actions
- [ ] Add "Create Project" button
- [ ] Add project status badges (color-coded)

**Deliverable**: Comprehensive project list with filtering

---

#### Phase 4.3: Project Detail View
- [ ] Create Project detail page
- [ ] Show project header with key info
- [ ] Show company information section
- [ ] Show survey responses section
- [ ] Show activity timeline
- [ ] Show related documents
- [ ] Add quick actions toolbar (edit, delete, move stage)

**Deliverable**: Detailed project view page

---

#### Phase 4.4: Project CRUD Operations
- [ ] Create Project form (manual project creation)
- [ ] Add project edit functionality
- [ ] Add project delete with confirmation
- [ ] Auto-create project from survey submission
- [ ] Auto-create company/contact if new survey submitter
- [ ] Add project duplication feature

**Deliverable**: Full project CRUD operations

---

### PHASE 5: Stage Workflow & Tags (Week 5)

#### Phase 5.1: Project Tags System
- [ ] Create tag selector component (Strategic Portfolio, Finders, Development Services)
- [ ] Allow multi-tag selection per project
- [ ] Create tag-based filtering in project list
- [ ] Add tag statistics to dashboard
- [ ] Color-code tags (badges)

**Deliverable**: Project tagging system

---

#### Phase 5.2: Stage Workflow Visualization
- [ ] Create visual stage workflow component (stepper/timeline)
- [ ] Show different workflows for different tags
  - Strategic Portfolio workflow
  - Finders workflow
  - Development Services workflow
- [ ] Highlight current stage
- [ ] Show stage history with timestamps
- [ ] Add stage duration indicators

**Deliverable**: Visual stage progression component

---

#### Phase 5.3: Stage Movement Logic
- [ ] Create "Move Stage" functionality
- [ ] Add stage movement validation (can't skip stages)
- [ ] Add stage movement confirmation modal
- [ ] Record stage change in history (who, when, why)
- [ ] Send notifications on stage changes
- [ ] Update project status automatically

**Deliverable**: Stage movement with history tracking

---

#### Phase 5.4: Partner Tagging
- [ ] Create partner tags list (internal network companies)
- [ ] Create partner tag selector for projects
- [ ] Allow multiple partner tags per project
- [ ] Make partner tags internal-only (not visible to product owner)
- [ ] Add partner tag filtering in project list
- [ ] Show partner tag statistics

**Deliverable**: Internal partner tagging system

---

### PHASE 6: Data Extraction & Gap Analysis (Week 6)

#### Phase 6.1: AI Data Extraction (Mock)
- [ ] Create mock AI extraction service
- [ ] Upload introduction deck (PDF/PPT)
- [ ] Simulate AI processing with loading state
- [ ] Extract key fields from deck (mock data)
- [ ] Show extracted data with confidence scores
- [ ] Allow user to approve/edit extracted data
- [ ] Map extracted data to project fields

**Deliverable**: Mock AI extraction from uploaded decks

---

#### Phase 6.2: Gap Analysis
- [ ] Compare survey template fields vs submitted data
- [ ] Highlight missing required fields
- [ ] Create gap analysis report component
- [ ] Show visual indicators for completeness
- [ ] Categorize gaps (critical, important, optional)

**Deliverable**: Gap identification system

---

#### Phase 6.3: Follow-Up Email Generator
- [ ] Create email template for missing information
- [ ] Auto-populate missing fields in email
- [ ] Create focused follow-up form (only missing fields)
- [ ] Generate unique link for follow-up form
- [ ] Send email simulation
- [ ] Track follow-up status

**Deliverable**: Auto-generated follow-up emails for missing data

---

### PHASE 7: Lead Scoring Engine (Week 7)

#### Phase 7.1: Scoring Model Configuration
- [ ] Create scoring model data structure
- [ ] Define scoring factors and weights
  - Clinical evidence (0-20)
  - IP status (0-15)
  - Market traction (0-15)
  - Strategic fit (0-20)
  - Regulatory clarity (0-15)
  - Financial health (0-15)
- [ ] Create scoring configuration UI (admin only)
- [ ] Allow weight adjustments
- [ ] Version scoring models (Q1 2025, Q2 2025, etc.)

**Deliverable**: Configurable scoring model

---

#### Phase 7.2: Score Calculation Engine
- [ ] Create score calculation logic
- [ ] Calculate score based on project data
- [ ] Auto-recalculate when project data changes
- [ ] Store score history
- [ ] Add score thresholds (hot > 80, warm 60-80, cold < 60)

**Deliverable**: Automated score calculation

---

#### Phase 7.3: Score Visualization
- [ ] Create ScoreCard component (big number with color)
- [ ] Create score breakdown component (donut chart)
- [ ] Create factor-by-factor bar chart
- [ ] Add score trend line (historical)
- [ ] Add score comparison (vs average)
- [ ] Add "What-if" score calculator

**Deliverable**: Beautiful score visualizations

---

#### Phase 7.4: Lead Score View Page
- [ ] Create dedicated Lead Score page
- [ ] Show all projects with scores in table
- [ ] Add sorting by score
- [ ] Add filtering by score thresholds
- [ ] Show Japan interest indicator
- [ ] Show partner tags
- [ ] Allow drill-down to project detail

**Deliverable**: Lead score overview page

---

### PHASE 8: Japan Market Screening (Week 8)

#### Phase 8.1: Japan Screening Data Model
- [ ] Create Japan screening template structure
  - Executive Summary
  - Unmet Medical Need
  - Current Treatment Landscape
  - Development Details
  - Positioning & Potential
  - Regulatory Considerations
  - Risk Assessment
- [ ] Create JapanScreening interface
- [ ] Create mock Japan screening data

**Deliverable**: Japan screening data model

---

#### Phase 8.2: Japan Screening Form
- [ ] Create Japan screening workspace page
- [ ] Create section-by-section form
- [ ] Add rich text editor for each section
- [ ] Add save draft functionality
- [ ] Add section completion tracking
- [ ] Allow reviewer assignment

**Deliverable**: Japan screening form interface

---

#### Phase 8.3: AI Market Analysis (Mock)
- [ ] Simulate AI web search for Japan data
- [ ] Auto-populate sections with mock AI results
- [ ] Show AI confidence indicators
- [ ] Allow manual editing of AI content
- [ ] Add "Regenerate with AI" button
- [ ] Show data sources (mock URLs)

**Deliverable**: Mock AI-powered Japan market analysis

---

#### Phase 8.4: Japan Fit Scoring
- [ ] Calculate Japan market fit score (High/Medium/Low)
- [ ] Generate AI summary of Japan potential
- [ ] Create Japan fit badge component
- [ ] Show Japan fit on project cards
- [ ] Add Japan fit filtering
- [ ] Export Japan screening to PDF

**Deliverable**: Japan market fit assessment

---

### PHASE 9: Multi-Gate Vetting Workflow (Week 9)

#### Phase 9.1: Gate Review Data Models
- [ ] Create GateDecision interface
- [ ] Create gate-specific checklists
- [ ] Define gate progression rules
- [ ] Create mock gate review data

**Deliverable**: Gate review data structures

---

#### Phase 9.2: Gate 1 Review Panel (Data Gathering)
- [ ] Create Gate 1 review page
- [ ] Show only projects in Gate 1 queue
- [ ] Display survey completeness
- [ ] Display data extraction status
- [ ] Display initial score
- [ ] Create decision form (Approve to Gate 2, Request Info, Close)
- [ ] Record decision reasoning
- [ ] Send notifications on decision

**Deliverable**: Gate 1 review workflow

---

#### Phase 9.3: Gate 2 Review Panel (1-on-1)
- [ ] Create Gate 2 review page
- [ ] Show projects that passed Gate 1
- [ ] Display Japan screening summary
- [ ] Display lead score details
- [ ] Display partner fit assessment
- [ ] Create decision form (Approve to Gate 3, Hold, Close)
- [ ] Link to meeting scheduler
- [ ] Track 1-on-1 meeting completion

**Deliverable**: Gate 2 review workflow

---

#### Phase 9.4: Gate 3 Review Panel (Senior Decision)
- [ ] Create Gate 3 review page (senior decision maker only)
- [ ] Show only projects that passed Gate 2 with thresholds
  - Score > 70
  - Japan interest = Yes
  - Gate 1 & 2 approved
- [ ] Display executive summary
- [ ] Display DD preview (if available)
- [ ] Create final decision form (Proceed to NDA/DD, Renegotiate, Decline)
- [ ] Capture strategic reasoning
- [ ] Budget/resource allocation fields

**Deliverable**: Gate 3 strategic review workflow

---

#### Phase 9.5: Gate History & Audit Trail
- [ ] Create gate history timeline component
- [ ] Show all gate decisions chronologically
- [ ] Display reviewers and timestamps
- [ ] Show decision reasoning
- [ ] Add export to PDF for audit
- [ ] Create gate metrics dashboard

**Deliverable**: Complete gate audit trail

---

### PHASE 10: Dashboard & Pipeline Visualization (Week 10)

#### Phase 10.1: Main Dashboard Layout
- [ ] Create main dashboard page (role-based)
- [ ] Create responsive grid layout
- [ ] Add dashboard filters (date range, tags, etc.)
- [ ] Create dashboard configuration (save user preferences)

**Deliverable**: Dashboard shell with layout

---

#### Phase 10.2: Pipeline Funnel Visualization
- [ ] Create funnel chart component (Apache ECharts)
- [ ] Show projects count per stage
- [ ] Calculate conversion rates between stages
- [ ] Add click-through to filtered project list
- [ ] Show separate funnels for each project tag type
- [ ] Add date range filter

**Deliverable**: Interactive pipeline funnel

---

#### Phase 10.3: KPI Metrics Cards
- [ ] Create MetricsCard component
- [ ] Display key metrics:
  - Total projects
  - Active projects
  - Projects in DD
  - Contracts signed
  - Avg time per stage
  - Conversion rates
- [ ] Add trend indicators (↑ ↓)
- [ ] Add sparkline charts for trends

**Deliverable**: KPI metrics cards

---

#### Phase 10.4: Recent Activity Feed
- [ ] Create activity timeline component
- [ ] Show recent actions:
  - New projects created
  - Stage movements
  - Gate approvals
  - NDA completions
  - DD completions
- [ ] Add activity filtering
- [ ] Add activity search
- [ ] Link activities to related items

**Deliverable**: Real-time activity feed

---

#### Phase 10.5: Charts & Analytics
- [ ] Create stage distribution bar chart
- [ ] Create projects by disease area pie chart
- [ ] Create projects by country map/chart
- [ ] Create score distribution histogram
- [ ] Create time-based trend lines
- [ ] Add export charts to image

**Deliverable**: Comprehensive analytics dashboard

---

### PHASE 11: NDA Management (Week 11)

#### Phase 11.1: NDA Data Models
- [ ] Create NDA interface
- [ ] Create NDA status enum (Requested, In Progress, Completed, Not Required)
- [ ] Create NDA template structure
- [ ] Create mock NDA data

**Deliverable**: NDA data models

---

#### Phase 11.2: NDA Initiation Workflow
- [ ] Add "Initiate NDA" button in project (after Japan screening)
- [ ] Create NDA request form
- [ ] Select NDA template
- [ ] Add custom terms if needed
- [ ] Assign signatories (product owner, HekaBio)
- [ ] Generate NDA document preview

**Deliverable**: NDA initiation workflow

---

#### Phase 11.3: E-Signature Flow (Mock)
- [ ] Simulate e-signature service (DocuSign/Adobe Sign)
- [ ] Send NDA for signature (mock email)
- [ ] Track signature status
- [ ] Simulate signing process
- [ ] Store signed NDA document
- [ ] Update NDA status to Completed
- [ ] Send completion notification

**Deliverable**: Mock e-signature workflow

---

#### Phase 11.4: NDA Status Tracking
- [ ] Create NDA status badge component
- [ ] Show NDA status on project card
- [ ] Show NDA status on project detail
- [ ] Create NDA management page (list all NDAs)
- [ ] Add NDA filtering and search
- [ ] Add NDA expiration tracking
- [ ] Add NDA renewal workflow

**Deliverable**: Complete NDA tracking system

---

#### Phase 11.5: Access Control Based on NDA
- [ ] Restrict data room access until NDA completed
- [ ] Restrict DD documents until NDA completed
- [ ] Show "NDA Required" message for locked content
- [ ] Unlock content automatically when NDA completed
- [ ] Add NDA verification on sensitive pages

**Deliverable**: NDA-based access control

---

### PHASE 12: Due Diligence Workspace (Week 12-13)

#### Phase 12.1: DD Data Models
- [ ] Create DueDiligence interface
- [ ] Create DD sections structure:
  - Executive Summary
  - Corporate & Legal
  - Scientific
  - Clinical
  - Regulatory
  - Intellectual Property
  - Commercial
  - Financial
  - Risk Assessment
- [ ] Create DDDocument interface
- [ ] Create DDRecommendation interface
- [ ] Create mock DD data

**Deliverable**: DD data models

---

#### Phase 12.2: DD Workspace Page
- [ ] Create DD workspace main page
- [ ] Show DD progress overview
- [ ] Show section completion status
- [ ] Show assigned reviewers
- [ ] Show timeline and deadlines
- [ ] Add DD navigation menu

**Deliverable**: DD workspace shell

---

#### Phase 12.3: Data Room
- [ ] Create secure data room component
- [ ] Upload documents by category
- [ ] Folder structure for organization
- [ ] Document preview (PDF, images, etc.)
- [ ] Download documents
- [ ] Version control for documents
- [ ] Access log (who viewed what, when)

**Deliverable**: Secure data room

---

#### Phase 12.4: DD Section Forms
- [ ] Create form for each DD section
- [ ] Add rich text editor
- [ ] Add file attachments per section
- [ ] Add findings, risks, and recommendations fields
- [ ] Add reviewer comments
- [ ] Add section status (Not Started, In Progress, Completed)
- [ ] Save draft functionality
- [ ] Section review and approval

**Deliverable**: DD section editing interface

---

#### Phase 12.5: AI DD Report Generation (Mock)
- [ ] Simulate AI analysis of data room documents
- [ ] Auto-populate DD sections with AI findings
- [ ] Show AI confidence scores
- [ ] Highlight AI-generated vs manual content
- [ ] Add "Regenerate" button for each section
- [ ] Show AI data sources
- [ ] Allow editing of AI content

**Deliverable**: Mock AI-powered DD report generation

---

#### Phase 12.6: DD Progress Tracking
- [ ] Create DD progress bar component
- [ ] Show section-wise completion percentage
- [ ] Show overall DD completion
- [ ] Track time spent on DD
- [ ] Show overdue sections
- [ ] Send reminders for incomplete sections

**Deliverable**: DD progress visualization

---

#### Phase 12.7: DD Collaboration
- [ ] Assign DD specialists to sections
- [ ] Add comments/discussion threads per section
- [ ] Tag other users in comments
- [ ] Track revision history
- [ ] Add internal notes (not visible to product owner)
- [ ] Create DD team view

**Deliverable**: Collaborative DD workspace

---

#### Phase 12.8: DD Final Recommendation
- [ ] Create DD recommendation form
- [ ] Overall recommendation (Proceed, Decline, Renegotiate)
- [ ] Risk level (Low, Medium, High)
- [ ] Key findings summary
- [ ] Critical issues highlighted
- [ ] Suggested contract terms
- [ ] Submit to Gate 3 for final decision
- [ ] Generate DD report PDF

**Deliverable**: DD final recommendation workflow

---

### PHASE 13: Contract Decision & Records (Week 14)

#### Phase 13.1: Contract Decision Form
- [ ] Create contract decision page (Gate 3 only)
- [ ] Review DD recommendation
- [ ] Enter final decision (Proceed, Decline, Renegotiate)
- [ ] Capture decision reasoning
- [ ] Set contract type (licensing, distribution, etc.)
- [ ] Assign contract owner
- [ ] Send decision notification to product owner

**Deliverable**: Contract decision workflow

---

#### Phase 13.2: Basic Contract Record
- [ ] Create contract record form
- [ ] Enter contract details:
  - Contracting parties
  - Contract type
  - Effective date
  - Expiration date
  - Status (Draft, Active, Expired, Terminated)
  - Key terms summary
- [ ] Upload signed contract document
- [ ] Link contract to project
- [ ] Contract status badge

**Deliverable**: Contract record management

---

#### Phase 13.3: Contract List & Search
- [ ] Create contracts list page
- [ ] Add search and filtering
- [ ] Show contract status
- [ ] Show associated projects
- [ ] Add contract expiration alerts
- [ ] Add contract renewal reminders

**Deliverable**: Contract management interface

---

### PHASE 14: Communications & Meetings (Week 15)

#### Phase 14.1: Email System
- [ ] Create email composer component
- [ ] Rich text editor for email body
- [ ] Recipient selection (from address book)
- [ ] CC/BCC fields
- [ ] Subject line
- [ ] Attachments
- [ ] Link email to project
- [ ] Send email (mock - just save to DB)

**Deliverable**: Email composer

---

#### Phase 14.2: Email Templates
- [ ] Create email template library
- [ ] Pre-defined templates:
  - Survey invitation
  - Missing information request
  - NDA request
  - DD follow-up
  - Contract discussion
  - Partner report
- [ ] Template variable substitution ({{name}}, {{project}}, etc.)
- [ ] Template editing
- [ ] Template preview

**Deliverable**: Email template system

---

#### Phase 14.3: Email Thread & History
- [ ] Create email list view (inbox/sent)
- [ ] Show email threads (conversation view)
- [ ] Email status tracking (Sent, Delivered, Replied, Awaiting Reply)
- [ ] Link emails to projects (show in project timeline)
- [ ] Email search and filtering
- [ ] Mark as read/unread

**Deliverable**: Email thread management

---

#### Phase 14.4: Meeting Scheduler
- [ ] Create meeting scheduler component
- [ ] Calendar date/time picker
- [ ] Participant selection
- [ ] Meeting type (Teams, Zoom, In-person)
- [ ] Generate meeting link (mock)
- [ ] Agenda builder
- [ ] Attach documents to meeting invite
- [ ] Send calendar invite (mock)
- [ ] Link meeting to project

**Deliverable**: Meeting scheduling system

---

#### Phase 14.5: AI Meeting Summaries
- [ ] Upload meeting recording/transcript (mock)
- [ ] Simulate AI processing
- [ ] Generate meeting summary:
  - Executive summary
  - Key decisions
  - Action items with owners
  - Risks and open questions
- [ ] Edit meeting summary
- [ ] Email summary to participants
- [ ] Save summary to project

**Deliverable**: AI meeting summary generation

---

#### Phase 14.6: Communication Timeline
- [ ] Create unified communication timeline
- [ ] Show all emails related to project
- [ ] Show all meetings related to project
- [ ] Show tasks created from communications
- [ ] Filter by type (email, meeting, task)
- [ ] Search communications
- [ ] Export communication history

**Deliverable**: Unified communication view

---

### PHASE 15: Tasks & Notifications (Week 16)

#### Phase 15.1: Task Management
- [ ] Create Task interface
- [ ] Create task list page
- [ ] Create task form (add/edit)
- [ ] Task fields:
  - Title, description
  - Owner assignment
  - Due date
  - Priority (High, Medium, Low)
  - Status (To Do, In Progress, Completed)
  - Linked project
- [ ] Task filtering and search
- [ ] Task sorting

**Deliverable**: Basic task management

---

#### Phase 15.2: Task Board (Kanban)
- [ ] Create Kanban board view
- [ ] Columns: To Do, In Progress, Completed
- [ ] Drag-and-drop tasks between columns
- [ ] Task cards with key info
- [ ] Filter board by user, project, etc.
- [ ] Board view preferences (save layout)

**Deliverable**: Kanban task board

---

#### Phase 15.3: Task Automation
- [ ] Create tasks from email follow-ups
- [ ] Create tasks from meeting action items
- [ ] Create tasks from DD section assignments
- [ ] Create tasks from gate decisions
- [ ] Auto-assign tasks based on roles
- [ ] Task templates for common workflows

**Deliverable**: Automated task creation

---

#### Phase 15.4: Notification System
- [ ] Create Notification interface
- [ ] Create notification center (dropdown bell icon)
- [ ] Notification types:
  - New project created
  - Project stage changed
  - Gate approval needed
  - Task assigned
  - Email awaiting reply
  - Meeting scheduled
  - NDA completed
  - DD completed
  - Stalled project alert
- [ ] Mark as read/unread
- [ ] Notification preferences

**Deliverable**: Notification center

---

#### Phase 15.5: Alerts & Reminders
- [ ] Overdue task alerts
- [ ] Stalled project alerts (no activity > 30 days)
- [ ] Unanswered email reminders (> 7 days)
- [ ] NDA pending reminders
- [ ] DD incomplete section reminders
- [ ] Upcoming deadline alerts
- [ ] Alert badge counts on relevant pages

**Deliverable**: Intelligent alert system

---

### PHASE 16: Polish & Phase 1 Completion (Week 17)

#### Phase 16.1: Cross-Module Integration Testing
- [ ] Test complete user journeys:
  - Product owner submits survey → project created → scored → Japan screening → Gate reviews → NDA → DD → Contract
  - CRM owner manages pipeline
  - Gate reviewers process queue
  - DD specialists complete sections
- [ ] Fix integration bugs
- [ ] Ensure data flows correctly between modules

**Deliverable**: Fully integrated Phase 1

---

#### Phase 16.2: UI/UX Polish
- [ ] Consistent spacing and alignment
- [ ] Smooth transitions and animations
- [ ] Loading states for all async operations
- [ ] Empty states with helpful messages
- [ ] Error states with clear guidance
- [ ] Success confirmations
- [ ] Responsive design fixes
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)

**Deliverable**: Polished, professional UI

---

#### Phase 16.3: Performance Optimization
- [ ] Code splitting by route
- [ ] Lazy loading for heavy components
- [ ] Optimize bundle size
- [ ] Memoize expensive computations
- [ ] Optimize re-renders
- [ ] Image optimization
- [ ] Debounce search inputs

**Deliverable**: Fast, optimized app

---

#### Phase 16.4: Documentation
- [ ] README with setup instructions
- [ ] Component documentation
- [ ] Mock data documentation
- [ ] User role guide
- [ ] Demo walkthrough guide
- [ ] Known limitations list

**Deliverable**: Complete documentation

---

## PHASE 2 START (Weeks 18-24)

### PHASE 17: Orders Module (Week 18)

#### Phase 17.1: Order Data Models
- [ ] Create Order interface
- [ ] Order types (Normal, Trial)
- [ ] Order status enum
- [ ] Collection requirement fields
- [ ] Create mock order data
- [ ] Create ordersSlice

**Deliverable**: Order data models

---

#### Phase 17.2: Order Request Form (Hospital)
- [ ] Create order form page (Hospital role)
- [ ] Product selection
- [ ] Quantity input
- [ ] Order type selector (Normal/Trial)
- [ ] Preferred delivery date
- [ ] Collection required checkbox
- [ ] Collection date picker
- [ ] Submit order
- [ ] Allow Trial orders before contract signing

**Deliverable**: Hospital order creation

---

#### Phase 17.3: Approval Workflow (A→B→C→D)
- [ ] Create approval queue pages for each role:
  - Distributor approval queue
  - HekaBio approval queue
  - Manufacturer approval queue
- [ ] Approve/Reject buttons with reasoning
- [ ] Auto-forward on approval
- [ ] Stop workflow on rejection
- [ ] Send notifications at each step
- [ ] Track approval history

**Deliverable**: Multi-party approval workflow

---

#### Phase 17.4: Manufacturing Feasibility Check
- [ ] Create feasibility review page (Manufacturer role)
- [ ] Show requested quantity and schedule
- [ ] Check production capacity (mock)
- [ ] Approve/reject based on feasibility
- [ ] If approved, notify Distributor & HekaBio
- [ ] Create production schedule entry

**Deliverable**: Feasibility check workflow

---

#### Phase 17.5: Order List & Tracking
- [ ] Create orders list page (all roles see relevant orders)
- [ ] Filter by status, type, date
- [ ] Search orders
- [ ] Order detail page
- [ ] Order status timeline
- [ ] Order cancellation (create new order instead of edit)

**Deliverable**: Order tracking system

---

### PHASE 18: Manufacturing & Inventory (Week 19)

#### Phase 18.1: Production Schedule
- [ ] Create production schedule page (Manufacturer)
- [ ] Calendar view of production
- [ ] Show approved orders in queue
- [ ] Assign production dates
- [ ] Track production status
- [ ] Capacity planning view

**Deliverable**: Production scheduling

---

#### Phase 18.2: Inventory Management
- [ ] Create inventory data model
- [ ] Inventory dashboard
- [ ] Current stock levels
- [ ] Update inventory on production completion
- [ ] Update inventory on shipment
- [ ] Low stock alerts
- [ ] Inventory history

**Deliverable**: Basic inventory tracking

---

### PHASE 19: Transportation & Logistics (Week 20-21)

#### Phase 19.1: International Shipment Tracking
- [ ] Create international shipment page
- [ ] Upload airbill, invoice, packing list
- [ ] Upload CoA, QA documents, label photos
- [ ] Enter arrival date at airport
- [ ] Track shipment status
- [ ] Document review requests
- [ ] Notification on document uploads

**Deliverable**: International shipping tracking

---

#### Phase 19.2: Customs Clearance
- [ ] Create customs tracking page
- [ ] Track inspection status
- [ ] Upload import declaration
- [ ] Upload clearance certificate
- [ ] Update status to "Cleared"
- [ ] Notification on clearance completion

**Deliverable**: Customs clearance tracking

---

#### Phase 19.3: Domestic Transportation
- [ ] Create domestic transport page
- [ ] Track "In Transit to Distributor" status
- [ ] Upload delivery note
- [ ] Proof of delivery (signature, photo)
- [ ] Distributor incoming inspection
- [ ] Upload inspection report
- [ ] Track "In Transit to Hospital"
- [ ] Hospital incoming inspection

**Deliverable**: Domestic transport tracking

---

#### Phase 19.4: Complete Shipment Timeline
- [ ] Create visual shipment timeline component
- [ ] Show all stages from international → hospital
- [ ] Status indicators for each stage
- [ ] Document links at each stage
- [ ] Estimated vs actual dates
- [ ] Delay indicators
- [ ] Export timeline to PDF

**Deliverable**: End-to-end shipment visualization

---

#### Phase 19.5: Document Dashboard
- [ ] Create centralized document dashboard
- [ ] Show all required documents per shipment
- [ ] Document status (Pending, Uploaded, Reviewed, Approved)
- [ ] Document review workflow
- [ ] SLA-based reminders for missing docs
- [ ] Document search and filtering

**Deliverable**: Comprehensive document tracking

---

### PHASE 20: Surgery & Collection (Week 22)

#### Phase 20.1: Surgery Scheduling
- [ ] Create surgery schedule page (Hospital)
- [ ] Link order to surgery date
- [ ] Track surgery status (Pending, Scheduled, Completed)
- [ ] Upload surgery use records
- [ ] Send usage record request notifications

**Deliverable**: Surgery tracking

---

#### Phase 20.2: Product Collection Management
- [ ] Create collection management page (HekaBio)
- [ ] Show orders with collection required
- [ ] Show planned collection dates
- [ ] Collection reminders (X days before)
- [ ] Update collection status (Scheduled → Picked Up → In Storage → Disposed)
- [ ] Upload recall manifests
- [ ] Upload completion certificates

**Deliverable**: Product collection workflow

---

#### Phase 20.3: Post-Collection Inventory
- [ ] Track collected product inventory
- [ ] Storage location tracking
- [ ] Disposal documentation
- [ ] Compliance reporting for radioactive materials
- [ ] Collection history log

**Deliverable**: Collection inventory management

---

### PHASE 21: Calendar & Scheduling (Week 23)

#### Phase 21.1: Shared Calendar
- [ ] Create shared calendar page
- [ ] Multi-party view (Hospital, Distributor, HekaBio, Manufacturer)
- [ ] Show key milestones:
  - Order approved
  - Shipment dispatched
  - Customs clearance
  - Delivery to hospital
  - Surgery scheduled
  - Collection scheduled
- [ ] Calendar filtering by event type
- [ ] Month/week/day views

**Deliverable**: Shared calendar with milestones

---

#### Phase 21.2: Milestone Tracking
- [ ] Auto-create milestones from order events
- [ ] Visual milestone timeline
- [ ] Milestone status tracking
- [ ] Delayed milestone alerts
- [ ] Milestone completion notifications

**Deliverable**: Automated milestone tracking

---

#### Phase 21.3: Gantt Chart View
- [ ] Create Gantt chart for orders
- [ ] Show entire order lifecycle
- [ ] Parallel orders visualization
- [ ] Critical path highlighting
- [ ] Resource allocation view

**Deliverable**: Gantt chart for order planning

---

### PHASE 22: Reporting & Analytics (Week 24)

#### Phase 22.1: Report Templates
- [ ] Create exportable report template
- [ ] Fields: Order Number, Event Type, Source Name, Nuclide, Activity per Seed, Quantity, Total Activity, Source Numbers, Date, Receiving Party, Facility, Worker, Use Method/Place, Storage Worker/Method/Place, Disposal Worker/Method/Place
- [ ] Auto-populate from order data
- [ ] Generate PDF report
- [ ] Generate Excel export

**Deliverable**: Regulatory compliance reports

---

#### Phase 22.2: Custom Report Builder
- [ ] Create report builder interface
- [ ] Select fields to include
- [ ] Filter data (date range, product, facility)
- [ ] Group by options
- [ ] Sort options
- [ ] Save report templates
- [ ] Schedule recurring reports

**Deliverable**: Custom report generation

---

#### Phase 22.3: Supply Chain Analytics
- [ ] Approval time metrics
- [ ] Shipping lead time analysis
- [ ] Customs clearance duration
- [ ] Collection compliance rate
- [ ] Document compliance tracking
- [ ] Delay analysis by stage
- [ ] Trend charts over time

**Deliverable**: Supply chain KPI dashboard

---

#### Phase 22.4: Phase 2 Dashboard
- [ ] Create Phase 2 main dashboard
- [ ] Active orders count
- [ ] Orders by status
- [ ] Shipments in transit
- [ ] Upcoming surgeries
- [ ] Pending collections
- [ ] Document compliance rate
- [ ] Recent alerts

**Deliverable**: Phase 2 operations dashboard

---

### PHASE 23: Phase 2 Integration & Polish (Week 25)

#### Phase 23.1: Cross-Phase Integration
- [ ] Link Phase 1 contracts to Phase 2 orders
- [ ] Show order history in project detail
- [ ] Contract status based on order activity
- [ ] Unified notifications across phases
- [ ] Consistent user experience

**Deliverable**: Seamless Phase 1 + Phase 2 integration

---

#### Phase 23.2: Role-Based Views
- [ ] Ensure each role sees only relevant data
- [ ] Hospital: orders, deliveries, surgery, collection
- [ ] Distributor: approvals, incoming shipments, outgoing shipments
- [ ] HekaBio: all visibility, collection management
- [ ] Manufacturer: feasibility, production, international shipment
- [ ] Test permission enforcement

**Deliverable**: Proper role-based access

---

#### Phase 23.3: Final Testing
- [ ] Test complete Phase 2 user journeys
- [ ] Test all approval workflows
- [ ] Test document uploads
- [ ] Test notifications
- [ ] Test report generation
- [ ] Fix bugs

**Deliverable**: Stable Phase 2

---

#### Phase 23.4: Final Polish & Documentation
- [ ] UI/UX polish for Phase 2
- [ ] Performance optimization
- [ ] Update documentation
- [ ] Create demo data sets
- [ ] Create user guides for each role
- [ ] Prepare demo walkthrough

**Deliverable**: Production-ready application

---

## Summary

**Total Phases**: 23 granular phases
**Total Duration**: ~25 weeks (6 months)
**Phase 1**: Weeks 0-17 (18 weeks)
**Phase 2**: Weeks 17-25 (8 weeks)

Each phase is small and focused, ensuring nothing is skipped and progress is trackable.

**Next Step**: Initialize the project and begin Phase 0.1!
