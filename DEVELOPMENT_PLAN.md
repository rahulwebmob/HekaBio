# HekaBio Platform - Frontend Development Plan

## Project Overview
A comprehensive multi-tenant healthcare innovation management platform with two major phases:
- **Phase 1**: Partner intake, CRM, lead scoring, Japan market screening, NDA management, and due diligence
- **Phase 2**: Supply chain operations, order management, transportation tracking, and product collection

## Brand Identity
- **Primary Color**: Teal/Turquoise (#00B8A9 / similar)
- **Secondary Color**: Darker Teal for depth
- **UI Style**: Clean, modern, professional with scenic backgrounds
- **Typography**: Sans-serif, clean and readable
- **Tagline**: "Miracles through Partnership"

---

## Technology Stack

### Core Framework
```
- React 18.3+ (with TypeScript)
- Vite 5+ (build tool)
- TypeScript 5+
- React Router v6 (routing)
```

### State Management
```
- Redux Toolkit (RTK) with RTK Query for API calls
- Redux Persist for local storage
- Immer (built into RTK) for immutable updates
```

### UI Library Options (Choose ONE)
**Option 1 - Ant Design (Recommended)**
- Comprehensive enterprise component library
- Excellent table, form, and modal components
- Built-in i18n support (critical for JP/EN)
- Strong dashboard capabilities
- Pro Components for advanced layouts

**Option 2 - Material-UI (MUI)**
- Modern Material Design
- Highly customizable theming
- Good documentation
- Strong community

**Option 3 - Shadcn/ui + Tailwind CSS**
- Modern, minimalist approach
- Full component control
- Excellent performance
- Requires more custom work

**Recommendation**: **Ant Design** for this project due to enterprise features, complex forms/tables, and built-in i18n.

### Additional Libraries
```
Form Management: React Hook Form + Zod validation
Charts & Visualization: Recharts or Apache ECharts
Date/Time: Day.js (Ant Design compatible)
Drag & Drop: @dnd-kit/core
File Upload: react-dropzone
Rich Text Editor: Quill or TipTap
PDF Generation: jsPDF or React-PDF
Email Templates: mjml-react or react-email
Calendar: FullCalendar or React Big Calendar
Notifications: react-toastify or Ant Design notifications
Icons: @ant-design/icons or lucide-react
i18n: react-i18next
HTTP Client: Axios (with RTK Query)
```

---

## Project Structure

```
hekabio-platform/
├── public/
│   ├── logo.png
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── store.ts                 # Redux store configuration
│   │   └── rootReducer.ts           # Root reducer
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   ├── hero-bg.png
│   │   │   └── ...
│   │   └── styles/
│   │       ├── variables.css        # CSS variables for theming
│   │       └── global.css
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppLayout/           # Main layout wrapper
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── Footer/
│   │   │   ├── Loader/
│   │   │   ├── ErrorBoundary/
│   │   │   ├── ProtectedRoute/
│   │   │   └── RoleGate/            # Role-based rendering
│   │   ├── forms/
│   │   │   ├── SurveyForm/
│   │   │   ├── CompanyForm/
│   │   │   ├── ContactForm/
│   │   │   └── OrderForm/
│   │   ├── widgets/
│   │   │   ├── StageCard/
│   │   │   ├── ScoreCard/
│   │   │   ├── ProgressTracker/
│   │   │   ├── ActivityTimeline/
│   │   │   ├── DocumentViewer/
│   │   │   └── NotificationBell/
│   │   └── charts/
│   │       ├── FunnelChart/
│   │       ├── PipelineChart/
│   │       └── MetricsCard/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── authSlice.ts
│   │   │   └── authAPI.ts
│   │   ├── phase1/
│   │   │   ├── addressBook/
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── addressBookSlice.ts
│   │   │   │   └── addressBookAPI.ts
│   │   │   ├── projects/
│   │   │   │   ├── components/
│   │   │   │   │   ├── ProjectCard/
│   │   │   │   │   ├── ProjectDetail/
│   │   │   │   │   ├── StageWorkflow/
│   │   │   │   │   └── GateReview/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── ProjectList.tsx
│   │   │   │   │   ├── ProjectDetail.tsx
│   │   │   │   │   └── ProjectDashboard.tsx
│   │   │   │   ├── projectsSlice.ts
│   │   │   │   └── projectsAPI.ts
│   │   │   ├── surveys/
│   │   │   │   ├── components/
│   │   │   │   │   ├── SurveyBuilder/
│   │   │   │   │   ├── SurveyRenderer/
│   │   │   │   │   └── SurveyAnalytics/
│   │   │   │   ├── pages/
│   │   │   │   ├── surveysSlice.ts
│   │   │   │   └── surveysAPI.ts
│   │   │   ├── leadScoring/
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── scoringSlice.ts
│   │   │   │   └── scoringAPI.ts
│   │   │   ├── japanScreening/
│   │   │   │   ├── components/
│   │   │   │   │   ├── ScreeningTemplate/
│   │   │   │   │   ├── AIAnalysis/
│   │   │   │   │   └── MarketAssessment/
│   │   │   │   ├── pages/
│   │   │   │   ├── screeningSlice.ts
│   │   │   │   └── screeningAPI.ts
│   │   │   ├── nda/
│   │   │   │   ├── components/
│   │   │   │   │   ├── NDAForm/
│   │   │   │   │   ├── ESignature/
│   │   │   │   │   └── NDAStatus/
│   │   │   │   ├── pages/
│   │   │   │   ├── ndaSlice.ts
│   │   │   │   └── ndaAPI.ts
│   │   │   ├── dueDiligence/
│   │   │   │   ├── components/
│   │   │   │   │   ├── DDWorkspace/
│   │   │   │   │   ├── DDSections/
│   │   │   │   │   ├── DataRoom/
│   │   │   │   │   ├── AIReport/
│   │   │   │   │   └── DDProgress/
│   │   │   │   ├── pages/
│   │   │   │   ├── ddSlice.ts
│   │   │   │   └── ddAPI.ts
│   │   │   ├── contracts/
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── contractsSlice.ts
│   │   │   │   └── contractsAPI.ts
│   │   │   ├── communications/
│   │   │   │   ├── components/
│   │   │   │   │   ├── EmailComposer/
│   │   │   │   │   ├── EmailTemplates/
│   │   │   │   │   ├── MeetingScheduler/
│   │   │   │   │   └── AIMeetingSummary/
│   │   │   │   ├── pages/
│   │   │   │   ├── commsSlice.ts
│   │   │   │   └── commsAPI.ts
│   │   │   ├── tasks/
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── tasksSlice.ts
│   │   │   │   └── tasksAPI.ts
│   │   │   └── dashboard/
│   │   │       ├── components/
│   │   │       │   ├── PipelineFunnel/
│   │   │       │   ├── LeadScoreView/
│   │   │       │   ├── MetricsCards/
│   │   │       │   └── RecentActivity/
│   │   │       ├── pages/
│   │   │       │   └── MainDashboard.tsx
│   │   │       ├── dashboardSlice.ts
│   │   │       └── dashboardAPI.ts
│   │   ├── phase2/
│   │   │   ├── orders/
│   │   │   │   ├── components/
│   │   │   │   │   ├── OrderForm/
│   │   │   │   │   ├── OrderApproval/
│   │   │   │   │   ├── OrderTracking/
│   │   │   │   │   └── OrderTimeline/
│   │   │   │   ├── pages/
│   │   │   │   ├── ordersSlice.ts
│   │   │   │   └── ordersAPI.ts
│   │   │   ├── manufacturing/
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── manufacturingSlice.ts
│   │   │   │   └── manufacturingAPI.ts
│   │   │   ├── transportation/
│   │   │   │   ├── components/
│   │   │   │   │   ├── InternationalTracking/
│   │   │   │   │   ├── DomesticTracking/
│   │   │   │   │   ├── CustomsStatus/
│   │   │   │   │   ├── ShipmentTimeline/
│   │   │   │   │   └── DocumentUpload/
│   │   │   │   ├── pages/
│   │   │   │   ├── transportSlice.ts
│   │   │   │   └── transportAPI.ts
│   │   │   ├── inventory/
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── inventorySlice.ts
│   │   │   │   └── inventoryAPI.ts
│   │   │   ├── collection/
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── collectionSlice.ts
│   │   │   │   └── collectionAPI.ts
│   │   │   ├── documents/
│   │   │   │   ├── components/
│   │   │   │   │   ├── DocumentManager/
│   │   │   │   │   ├── DocumentViewer/
│   │   │   │   │   ├── VersionHistory/
│   │   │   │   │   └── AuditTrail/
│   │   │   │   ├── pages/
│   │   │   │   ├── documentsSlice.ts
│   │   │   │   └── documentsAPI.ts
│   │   │   ├── scheduling/
│   │   │   │   ├── components/
│   │   │   │   │   ├── Calendar/
│   │   │   │   │   ├── MilestoneTracker/
│   │   │   │   │   └── Reminders/
│   │   │   │   ├── pages/
│   │   │   │   ├── schedulingSlice.ts
│   │   │   │   └── schedulingAPI.ts
│   │   │   └── reports/
│   │   │       ├── components/
│   │   │       │   ├── ReportBuilder/
│   │   │       │   ├── ReportTemplates/
│   │   │       │   └── ExportOptions/
│   │   │       ├── pages/
│   │   │       ├── reportsSlice.ts
│   │   │       └── reportsAPI.ts
│   │   └── notifications/
│   │       ├── components/
│   │       ├── notificationsSlice.ts
│   │       └── notificationsAPI.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePermissions.ts
│   │   ├── useNotifications.ts
│   │   ├── useDebounce.ts
│   │   └── usePagination.ts
│   ├── services/
│   │   ├── api.ts                   # Axios instance
│   │   ├── authService.ts
│   │   └── socketService.ts         # WebSocket for real-time updates
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── company.types.ts
│   │   ├── project.types.ts
│   │   ├── order.types.ts
│   │   └── common.types.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── helpers.ts
│   ├── routes/
│   │   ├── index.tsx                # Route configuration
│   │   ├── ProtectedRoute.tsx
│   │   └── RoleBasedRoute.tsx
│   ├── config/
│   │   ├── theme.ts                 # Ant Design theme config
│   │   └── env.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .env.development
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Routing Structure

```typescript
// Phase 1 Routes
/                                    → Public Landing Page
/login                               → Login Page
/register                            → Registration
/survey/:surveyId                    → Public Survey Form (QR/Link)

// Authenticated Routes
/dashboard                           → Main Dashboard (Role-based)

// Phase 1 - CRM & Pipeline
/projects                            → Project List View
/projects/:id                        → Project Detail View
/projects/:id/survey                 → Survey Responses
/projects/:id/scoring                → Lead Score Details
/projects/:id/japan-screening        → Japan Market Analysis
/projects/:id/nda                    → NDA Management
/projects/:id/due-diligence          → DD Workspace
/projects/:id/contract               → Contract Decision

/address-book                        → Company & Contact Management
/address-book/companies              → Companies List
/address-book/companies/:id          → Company Detail
/address-book/contacts               → Contacts List

/surveys                             → Survey Management
/surveys/create                      → Survey Builder
/surveys/:id/analytics               → Survey Analytics

/pipeline                            → Pipeline Overview Dashboard
/pipeline/funnel                     → Funnel Visualization
/pipeline/lead-score                 → Lead Score View

/communications                      → Email & Meeting Hub
/communications/emails               → Email List
/communications/meetings             → Meetings Calendar

/tasks                               → Task Management
/notifications                       → Notification Center

// Phase 2 - Supply Chain
/orders                              → Orders List
/orders/create                       → New Order Form
/orders/:id                          → Order Detail & Tracking
/orders/:id/approvals                → Approval Flow
/orders/:id/tracking                 → Shipment Tracking

/manufacturing                       → Manufacturing Dashboard
/manufacturing/feasibility           → Feasibility Review Queue
/manufacturing/schedule              → Production Schedule

/transportation                      → Transportation Hub
/transportation/international        → International Shipments
/transportation/domestic             → Domestic Deliveries
/transportation/customs              → Customs Tracking

/inventory                           → Inventory Management
/collection                          → Product Collection Management
/documents                           → Document Repository

/calendar                            → Shared Calendar & Milestones
/reports                             → Reports & Analytics
/reports/export                      → Export Templates

// Admin
/admin                               → Admin Dashboard
/admin/users                         → User Management
/admin/roles                         → Role Configuration
/admin/settings                      → System Settings
/admin/scoring-config                → Lead Scoring Configuration
```

---

## User Roles & Permissions

```typescript
enum UserRole {
  // Phase 1 Roles
  SUPER_ADMIN = 'super_admin',
  CRM_OWNER = 'crm_owner',
  GATE_1_ANALYST = 'gate_1_analyst',
  GATE_2_ANALYST = 'gate_2_analyst',
  GATE_3_DECISION_MAKER = 'gate_3_decision_maker',
  DD_SPECIALIST_SCIENTIFIC = 'dd_specialist_scientific',
  DD_SPECIALIST_REGULATORY = 'dd_specialist_regulatory',
  DD_SPECIALIST_COMMERCIAL = 'dd_specialist_commercial',
  DD_SPECIALIST_FINANCIAL = 'dd_specialist_financial',
  PRODUCT_OWNER = 'product_owner',

  // Phase 2 Roles
  HOSPITAL_STAFF = 'hospital_staff',
  DISTRIBUTOR_STAFF = 'distributor_staff',
  LICENSE_HOLDER_STAFF = 'license_holder_staff',
  MANUFACTURING_STAFF = 'manufacturing_staff',
}

// Permission Matrix (example)
{
  projects: {
    view: ['crm_owner', 'gate_1_analyst', 'gate_2_analyst', 'gate_3_decision_maker'],
    create: ['crm_owner', 'gate_1_analyst'],
    edit: ['crm_owner', 'gate_1_analyst', 'gate_2_analyst'],
    delete: ['crm_owner'],
    approve_gate_1: ['gate_1_analyst'],
    approve_gate_2: ['gate_2_analyst'],
    approve_gate_3: ['gate_3_decision_maker'],
  },
  // ... more permissions
}
```

---

## Phase 1 - Detailed Module Breakdown

### 1. Multi-Channel Survey Capture

**Components:**
- `SurveyBuilder` - Admin tool to create surveys
- `SurveyRenderer` - Public-facing survey form
- `SurveyQRGenerator` - Generate QR codes
- `DeckUploader` - AI-powered document upload & extraction
- `SurveySubmissionConfirmation` - Auto-email acknowledgment

**Key Features:**
- Dynamic form rendering based on survey config
- Support for multiple question types (text, select, radio, checkbox, file upload)
- Auto-save draft responses
- QR code generation with analytics tracking
- PDF/PPT deck upload with AI extraction
- Conditional logic (show/hide questions based on answers)
- Multi-language support (EN/JP)

**State Management:**
```typescript
interface SurveyState {
  surveys: Survey[];
  activeSurvey: Survey | null;
  submissions: Submission[];
  loading: boolean;
  error: string | null;
}
```

**API Endpoints (Mock):**
```
GET    /api/surveys
GET    /api/surveys/:id
POST   /api/surveys
PUT    /api/surveys/:id
DELETE /api/surveys/:id
POST   /api/surveys/:id/submit
POST   /api/surveys/upload-deck
```

---

### 2. Address Book & Company Master

**Components:**
- `CompanyList` - Searchable company table
- `CompanyDetail` - Company profile view
- `CompanyForm` - Add/Edit company
- `ContactList` - Contact management
- `ContactForm` - Add/Edit contact
- `DuplicateChecker` - AI-powered duplicate detection

**Key Features:**
- Fuzzy search and filters
- Company categorization (Product Owner, Buyer, Distributor, etc.)
- Relationship mapping
- Duplicate detection & merge
- Import/Export CSV
- Activity timeline per company

**State:**
```typescript
interface AddressBookState {
  companies: Company[];
  contacts: Contact[];
  filters: FilterState;
  selectedCompany: Company | null;
}
```

---

### 3. Project Lifecycle & Stage Management

**Components:**
- `ProjectCard` - Grid/list card view
- `ProjectDetail` - Full project view
- `StageWorkflow` - Visual stage progression
- `ProjectTimeline` - Activity history
- `TagManager` - Strategic Portfolio/Finders/Development Services tags

**Stages for Strategic Portfolio:**
```
Lobby → Survey 1 → Survey 2 → Japan Early Assessment → NDA → Survey 3 → Due Diligence → Contract Decision
```

**Stages for Finders:**
```
Lobby → Data Analysis → Contract Decision (Finders) → Outreach List → Make the Introductions → Revenue Generated
```

**Stages for Development Services:**
```
Lobby → Data Analysis → Contract Decision
```

**Key Features:**
- Visual Kanban board for stage movement
- Stage-specific forms and checklists
- Approval history tracking
- Automated stage transitions based on rules
- Stage-based access control

**State:**
```typescript
interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  stageHistory: StageChange[];
  filters: ProjectFilters;
}

interface Project {
  id: string;
  company: Company;
  name: string;
  tags: ProjectTag[];
  currentStage: Stage;
  score: number;
  japanInterest: boolean;
  partnerTags: PartnerTag[];
  createdAt: string;
  updatedAt: string;
}
```

---

### 4. Data Analysis & AI Auto-Fill

**Components:**
- `AIExtractionViewer` - Show extracted data
- `GapAnalysis` - Missing field highlighter
- `FollowUpEmailComposer` - Smart email for missing info
- `FieldMapper` - Map deck fields to system fields

**Key Features:**
- AI extraction from introduction decks
- Automatic field population
- Gap identification with visual indicators
- One-click follow-up email generation
- Manual override for incorrect extractions
- Confidence score per extracted field

**UI Flow:**
1. Upload introduction deck
2. AI processes and extracts data
3. System displays extracted fields with confidence scores
4. User reviews and approves/corrects
5. System identifies missing fields
6. Auto-generate follow-up email with missing questions
7. Send to product owner

---

### 5. Lead Scoring Engine

**Components:**
- `ScoringConfig` - Admin scoring model setup
- `ScoreCard` - Visual score display
- `ScoreBreakdown` - Factor-by-factor breakdown
- `ScoreTrends` - Historical score changes

**Scoring Factors (Example):**
- Clinical evidence strength (0-20 points)
- IP status (0-15 points)
- Market traction (0-15 points)
- Strategic fit (0-20 points)
- Regulatory pathway clarity (0-15 points)
- Financial health (0-15 points)

**Key Features:**
- Configurable scoring weights
- Real-time score calculation
- Score history tracking
- Threshold-based alerts
- Visual score breakdown (donut/bar charts)

**State:**
```typescript
interface ScoringState {
  scoringModel: ScoringModel;
  projectScores: Record<string, ProjectScore>;
}

interface ProjectScore {
  total: number;
  breakdown: ScoreBreakdown;
  lastUpdated: string;
}
```

---

### 6. Japan Market Screening with AI

**Components:**
- `ScreeningTemplate` - Japan screening form template
- `AIMarketAnalysis` - AI-generated market insights
- `UnmetNeedAnalysis` - Japan medical need assessment
- `CompetitiveLandscape` - Current treatment options
- `RegulatoryContext` - PMDA pathway analysis

**Template Sections:**
- Executive Summary
- Unmet Medical Need in Japan
- Current Treatment Landscape
- Product Development Details
- Japan Positioning & Potential
- Regulatory Considerations
- Risk Assessment

**Key Features:**
- AI web search for Japan-specific data
- Template-based structured analysis
- Multi-source data aggregation
- Japan market fit score (High/Medium/Low)
- Export to PDF
- Reviewer comments and approval

---

### 7-8. Partner Tagging & Opportunity Assessment

**Components:**
- `PartnerTagSelector` - Tag projects with potential partners
- `OpportunityAssessmentForm` - Decision on strategic vs pass-through
- `AssessmentSummary` - Visual recommendation

**Key Features:**
- Internal-only partner tags
- Multi-select partner matching
- Assessment decision: Strategic Contract, Pass-Through (Finder), Both, or Close
- Reasoning capture for decisions
- Automated workflow routing based on assessment

---

### 9. Multi-Gate Vetting Workflow

**Components:**
- `Gate1ReviewPanel` - Data gathering & validation
- `Gate2ReviewPanel` - 1-on-1 meeting & deep dive
- `Gate3ReviewPanel` - Senior decision maker view
- `GateDecisionForm` - Approve/Hold/Close with reasoning
- `GateHistory` - Audit trail

**Gate 1 (Data Gathering):**
- Review survey responses
- Validate data extraction
- Check completeness
- Initial scoring review
- Decision: Move to Gate 2, Request More Info, or Close

**Gate 2 (1-on-1):**
- Schedule meetings with product owner
- Deep dive into product details
- Japan screening review
- Partner fit assessment
- Decision: Move to Gate 3/NDA, Hold, or Close

**Gate 3 (Senior Decision):**
- Only sees projects that passed Gate 1 & 2
- Strategic evaluation
- Budget & resource allocation
- Final go/no-go for NDA and DD
- Decision: Proceed to NDA/DD, Renegotiate, or Decline

**Key Features:**
- Role-based gate access
- Threshold enforcement (score, Japan interest)
- Decision capture with reasoning
- Automated notifications on gate progression
- Gate metrics dashboard

---

### 10. NDA Management

**Components:**
- `NDAInitiator` - Trigger NDA request
- `NDAForm` - NDA document generator
- `ESignatureIntegration` - DocuSign/Adobe Sign integration (mock)
- `NDAStatus` - Status badge (Requested, In Progress, Completed)
- `NDADocumentViewer` - View signed NDA

**NDA Workflow:**
1. CRM Owner/Analyst initiates NDA from project
2. System generates NDA document from template
3. Send for e-signature to product owner
4. Track signature status
5. Once signed, update NDA status to Completed
6. Store signed document in project
7. Unlock confidential data room access

**Key Features:**
- Template-based NDA generation
- E-signature workflow simulation
- Status tracking
- Document version control
- Access control based on NDA status

---

### 11. Due Diligence Workspace

**Components:**
- `DDWorkspace` - Main DD hub
- `DDSections` - Templated DD sections
  - Executive Summary
  - Corporate & Legal
  - Scientific
  - Clinical
  - Regulatory
  - Intellectual Property
  - Commercial
  - Financial
  - Risk Assessment
- `DataRoom` - Secure document repository
- `AIReportGenerator` - AI-powered DD analysis
- `DDProgressTracker` - Section completion status
- `DDCollaboration` - Comments & reviewer assignments

**DD Process:**
1. Project enters DD stage after NDA completion
2. System creates DD workspace with template sections
3. DD Specialists assigned to relevant sections
4. Upload documents to data room
5. AI analyzes documents and web sources
6. Specialists review AI-generated content
7. Add findings, risks, and recommendations
8. Track section completion
9. Generate final DD report
10. Submit recommendation to Gate 3

**Key Features:**
- Template-driven DD structure
- Role-based section assignment
- AI-powered document analysis
- Web research integration
- Collaborative editing
- Version control
- Progress visualization
- Risk flagging
- Final recommendation capture

**State:**
```typescript
interface DueDiligenceState {
  workspace: DDWorkspace | null;
  sections: DDSection[];
  documents: Document[];
  aiAnalysis: AIAnalysis[];
  progress: SectionProgress[];
  recommendation: DDRecommendation | null;
}
```

---

### 12. Contract Decision & Records

**Components:**
- `ContractDecisionForm` - Final decision entry
- `ContractRecordForm` - Basic contract details
- `ContractDocumentUpload` - Upload signed contract
- `ContractSummary` - Contract overview card

**Key Features:**
- Capture final decision (Proceed, Decline, Renegotiate)
- Store contract metadata (parties, type, effective date, status)
- Upload signed contract document
- Link contract to project
- Contract status tracking
- Basic contract details view (Phase 2 will handle full ERP)

---

### 13-14. Dashboard & Pipeline Overview

**Components:**
- `MainDashboard` - Role-based landing page
- `PipelineFunnel` - Visual funnel chart
- `StageDistribution` - Bar/pie charts
- `MetricsCards` - KPI cards (total projects, conversion rates, avg time per stage)
- `TrendCharts` - Time-based trends
- `RecentActivity` - Latest updates feed
- `QuickFilters` - Stage, disease area, product category, country filters

**Dashboard Views by Role:**
- **CRM Owner**: Full pipeline, all projects, system health metrics
- **Gate 1/2 Analyst**: Projects in their queue, action items, deadlines
- **Gate 3**: High-priority projects only, DD summaries, contract decisions
- **DD Specialist**: Assigned DD projects, section completion status
- **Product Owner**: Their project status, next steps, document requests

**Key Metrics:**
- Total projects by stage
- Conversion rates between stages
- Average time per stage
- "Hot" opportunities (high score + Japan interest)
- "Diamond" opportunities (strategic + high potential)
- Stalled projects (no activity > X days)
- Upcoming deadlines

**Visualization:**
- Funnel chart for pipeline stages
- Trend lines for project flow over time
- Heatmap for stage bottlenecks
- Geographic distribution of originators

---

### 15-17. Lead Score View & Progress Tracking

**Components:**
- `LeadScoreTable` - Sortable project list with scores
- `JapanFitIndicator` - High/Medium/Low badge with AI summary
- `ScoreFactorBreakdown` - Detailed score explanation
- `NDAProgressBadge` - NDA status badge
- `DDProgressBar` - DD section completion percentage

**Key Features:**
- Sortable by score, stage, Japan fit
- Filter by thresholds (score > 70, Japan interest = Yes)
- AI-generated Japan suitability summary
- Direct navigation to project details
- Quick actions (send email, schedule meeting, move stage)

---

### 18-19. Email Communication & Meeting Scheduling

**Components:**
- `EmailComposer` - Rich text email editor
- `EmailTemplateSelector` - Pre-defined templates
- `EmailThread` - Conversation view
- `EmailStatusTracker` - Sent, Delivered, Replied, Awaiting Reply
- `MeetingScheduler` - Calendar integration
- `MeetingInvite` - Send Teams/Zoom invites
- `AIMeetingSummary` - Post-meeting AI summary
- `CommunicationTimeline` - All emails & meetings in one view

**Email Templates:**
- Survey invitation
- Missing information request
- NDA request
- DD follow-up
- Contract discussion
- Partner introduction report

**Meeting Features:**
- Calendar picker
- Participant selection
- Agenda builder
- Automatic meeting link generation (Teams/Zoom mock)
- Document attachments
- Post-meeting AI summary generation
  - Executive summary
  - Key decisions
  - Action items with owners
  - Risks & open questions
- Email summary to participants

**Key Features:**
- Microsoft 365 / Google Workspace integration (mock)
- Email thread linking to projects
- Auto-detect replies
- Follow-up reminders for unanswered emails
- Meeting recordings/transcripts upload
- AI-powered meeting notes

---

### 20. Tasks, Alerts & Notifications

**Components:**
- `TaskList` - User task queue
- `TaskForm` - Create/edit tasks
- `TaskBoard` - Kanban view
- `NotificationCenter` - Notification dropdown
- `AlertBanner` - Critical alerts
- `ReminderSettings` - User preferences

**Task Features:**
- Task creation from emails, meetings, DD actions
- Owner assignment
- Due dates
- Priority levels
- Status tracking (To Do, In Progress, Completed)
- Link to related project
- Bulk actions

**Notification Types:**
- New project created
- Project stage changed
- Gate approval needed
- NDA initiated
- NDA completed
- DD section completed
- Task assigned
- Task overdue
- Email awaiting reply
- Meeting scheduled
- Stalled project alert

**Alert Logic:**
- Projects with no activity > 30 days
- Overdue NDA requests
- Incomplete DD sections past target date
- Emails not replied > 7 days
- Tasks overdue

---

## Phase 2 - Detailed Module Breakdown

### 1-3. Order Request & Manufacturing Feasibility

**Components:**
- `OrderRequestForm` - Hospital creates order
- `OrderTypeSelector` - Normal vs Trial
- `CollectionScheduler` - Set collection date
- `FeasibilityReviewPanel` - Manufacturer reviews quantity & schedule
- `ApprovalWorkflow` - A → B → C → D chain
- `OrderStatusBadge` - Current approval status

**Order Flow:**
1. Hospital creates order (Normal/Trial)
2. Specifies collection requirement & date
3. Order goes to Distributor (B) for approval
4. Distributor approves/rejects
5. Order goes to HekaBio (C) for approval
6. HekaBio approves/rejects
7. Order goes to Manufacturer (D)
8. Manufacturer performs feasibility check
9. Manufacturer approves/rejects (if reject, stops here)
10. If approved, system notifies Distributor & HekaBio
11. Order becomes active for production & logistics

**Key Features:**
- Trial orders allowed before contract signing
- No editing after approval (cancel & re-submit if changes needed)
- Approval history tracking
- Rejection reason capture
- Notification at each approval step

---

### 4-5. Order Form Generation & Inventory

**Components:**
- `OrderFormGenerator` - Auto-generate order documents
- `OrderFormViewer` - View approved order form
- `InventoryDashboard` - Current inventory levels
- `ProductionSchedule` - Manufacturing timeline
- `InventoryAlerts` - Low stock warnings

**Key Features:**
- Dynamic order form generation based on approved data
- Transfer order form through A → B → C → D
- Convert approved orders to production data
- Update inventory & schedule in real-time
- Production planning integration (mock)

---

### 6-8. International & Domestic Transportation

**Components:**
- `InternationalShipmentForm` - Register airbill, invoice, packing list, CoA, QA docs, label photos
- `AirportArrivalTracker` - Track arrival at domestic airport
- `CustomsClearancePanel` - Customs status tracking
- `DomesticTransportPanel` - Distributor → Hospital tracking
- `ShipmentTimeline` - Visual timeline of entire journey
- `DocumentDashboard` - Centralized doc links & tracking info

**Transportation States:**
- **International**: Shipped → In Transit → Arrived at Narita
- **Customs**: Inspection → Import Declaration → Cleared
- **Domestic to Distributor**: Picked Up → In Transit → Delivered
- **Distributor Inspection**: Pending → Completed (with inspection report)
- **Domestic to Hospital**: Dispatched → In Transit → Delivered
- **Hospital Inspection**: Pending → Accepted

**Key Features:**
- Document upload & review tracking
- Real-time status updates
- Notification on status changes
- Customs clearance certificate upload
- Delivery proof capture (signature, photo)
- Inspection report generation

---

### 9-11. Product Collection & Document Management

**Components:**
- `CollectionScheduler` - View & manage collection dates
- `CollectionReminder` - Auto-reminders before collection date
- `RecallManifest` - Collection documentation
- `CollectionStatus` - Scheduled → Picked Up → In Storage → Disposed
- `DocumentRepository` - Central doc storage
- `DocumentVersionControl` - Track versions
- `AuditTrail` - Action logs
- `ESignatureFlow` - Digital signature workflow (mock)

**Document Management:**
- Mandatory document capture at each step
- 5-year retention policy
- Version history
- Audit trail for all actions
- Role-based access control
- SLA-based reminders for missing docs

**Collection Flow:**
1. Hospital specifies collection need at order creation
2. System creates collection task with planned date
3. Auto-reminder sent X days before collection date
4. License holder arranges collection
5. Update status: Scheduled → Picked Up
6. Update inventory: In Storage
7. Final disposition: Disposed (with documentation)

---

### 12-13. Calendar, Milestones & Reporting

**Components:**
- `SharedCalendar` - Multi-party calendar view
- `MilestoneTracker` - Key event tracking
- `GanttChart` - Timeline view of orders & shipments
- `ReportBuilder` - Custom report generation
- `ReportTemplates` - Pre-defined reports
- `ExportOptions` - PDF, Excel, CSV export
- `MetricsDashboard` - Supply chain KPIs

**Key Milestones:**
- Order approved
- Manufacturing started
- International shipment dispatched
- Arrived at customs
- Customs cleared
- Delivered to distributor
- Distributor inspection completed
- Delivered to hospital
- Surgery scheduled
- Surgery completed
- Collection scheduled
- Collection completed

**Reports:**
- Order summary report (exportable template)
- Transportation lead time analysis
- Approval time metrics
- Collection compliance
- Document compliance
- Custom field reports

**Exportable Report Fields:**
- Order Number, Event Type, Source Name, Nuclide, Activity per Seed, Quantity, Total Activity, Source Numbers, Date, Receiving Party, Facility, Worker, Method/Place of Use, Storage details, Disposal details

---

## State Management Architecture (RTK)

```typescript
// Store Structure
{
  auth: AuthState,
  addressBook: AddressBookState,
  projects: ProjectsState,
  surveys: SurveysState,
  scoring: ScoringState,
  japanScreening: ScreeningState,
  nda: NDAState,
  dueDiligence: DDState,
  contracts: ContractsState,
  communications: CommunicationsState,
  tasks: TasksState,
  dashboard: DashboardState,
  notifications: NotificationsState,

  // Phase 2
  orders: OrdersState,
  manufacturing: ManufacturingState,
  transportation: TransportationState,
  inventory: InventoryState,
  collection: CollectionState,
  documents: DocumentsState,
  scheduling: SchedulingState,
  reports: ReportsState,
}
```

**RTK Query Example:**

```typescript
// projectsAPI.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const projectsAPI = createApi({
  reducerPath: 'projectsAPI',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Project'],
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => 'projects',
      providesTags: ['Project'],
    }),
    getProjectById: builder.query<Project, string>({
      query: (id) => `projects/${id}`,
      providesTags: ['Project'],
    }),
    createProject: builder.mutation<Project, Partial<Project>>({
      query: (body) => ({
        url: 'projects',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation<Project, { id: string; data: Partial<Project> }>({
      query: ({ id, data }) => ({
        url: `projects/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Project'],
    }),
    moveStage: builder.mutation<Project, { id: string; stage: Stage }>({
      query: ({ id, stage }) => ({
        url: `projects/${id}/stage`,
        method: 'PATCH',
        body: { stage },
      }),
      invalidatesTags: ['Project'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useMoveStageMutation,
} = projectsAPI;
```

---

## Theme Configuration (Ant Design)

```typescript
// config/theme.ts
import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#00B8A9',      // Teal from logo
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    colorLink: '#00B8A9',
    borderRadius: 6,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#001529',
    },
    Button: {
      colorPrimary: '#00B8A9',
      algorithm: true,
    },
    Menu: {
      darkItemBg: '#001529',
      darkItemSelectedBg: '#00B8A9',
    },
  },
};

export default theme;
```

---

## Mock Data Strategy

For dummy flow implementation, we'll create comprehensive mock data:

```typescript
// utils/mockData/projects.ts
export const mockProjects: Project[] = [
  {
    id: 'PROJ-001',
    company: {
      id: 'COMP-001',
      name: 'InnoMed Technologies',
      country: 'USA',
    },
    name: 'InnoMed Technologies - AI Cancer Diagnostics',
    tags: ['Strategic Portfolio'],
    currentStage: 'JAPAN_EARLY_ASSESSMENT',
    score: 85,
    japanInterest: true,
    partnerTags: ['Distributor A', 'Hospital Network B'],
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2025-01-01T14:30:00Z',
  },
  // ... more mock projects
];

// Mock API responses with realistic delays
export const mockAPI = {
  getProjects: () =>
    new Promise((resolve) =>
      setTimeout(() => resolve(mockProjects), 500)
    ),
  // ... more mock endpoints
};
```

---

## Development Phases

### Phase 0: Foundation (Week 1)
✅ Initialize Vite + React + TypeScript project
✅ Install & configure Ant Design
✅ Set up Redux Toolkit store
✅ Configure routing (React Router)
✅ Create base layouts (AppLayout, Header, Sidebar, Footer)
✅ Set up theme & global styles
✅ Implement authentication (mock)
✅ Create role-based routing guards
✅ Set up mock API layer

### Phase 1A: Core CRM (Weeks 2-4)
- Address Book module (companies, contacts)
- Project management (list, detail, CRUD)
- Survey capture & submission
- Data extraction & gap analysis
- Basic dashboard

### Phase 1B: Scoring & Screening (Weeks 5-6)
- Lead scoring engine
- Japan market screening
- Partner tagging
- Opportunity assessment

### Phase 1C: Gates & Workflow (Weeks 7-8)
- Multi-gate vetting (Gate 1, 2, 3)
- Stage management & workflow
- Notifications & alerts
- Task management

### Phase 1D: NDA & Due Diligence (Weeks 9-11)
- NDA management & e-signature flow
- Due diligence workspace
- Data room
- AI report generation (mock)
- DD progress tracking

### Phase 1E: Communications & Reporting (Weeks 12-13)
- Email composer & templates
- Meeting scheduler
- AI meeting summaries
- Enhanced dashboard with charts
- Lead score view
- Export & reporting

### Phase 2A: Order Management (Weeks 14-15)
- Order request forms
- Approval workflow (A→B→C→D)
- Manufacturing feasibility
- Order form generation

### Phase 2B: Logistics & Transportation (Weeks 16-18)
- International shipment tracking
- Customs clearance
- Domestic transportation
- Document management
- Inspection workflows

### Phase 2C: Collection & Reporting (Weeks 19-20)
- Product collection management
- Calendar & milestones
- Comprehensive reporting
- Export templates
- Analytics dashboards

### Phase 3: Polish & Integration (Weeks 21-22)
- Cross-module integration testing
- UI/UX refinement
- Performance optimization
- Accessibility improvements
- Documentation

---

## Key UI/UX Patterns

### Color Coding
- **Teal (#00B8A9)**: Primary actions, active states, HekaBio branding
- **Green**: Approvals, completed stages, positive metrics
- **Yellow/Orange**: Pending actions, warnings, requires attention
- **Red**: Rejections, errors, critical alerts
- **Blue**: Informational, links, secondary actions
- **Gray**: Inactive, disabled, background

### Stage Visual Indicators
```
Lobby: Gray circle
Survey 1: Blue circle (active)
Survey 2: Blue circle (active)
Japan Early Assessment: Purple circle
NDA: Orange circle (if pending)
Due Diligence: Teal circle (HekaBio color)
Contract Decision: Green circle (if approved) / Red (if declined)
```

### Icons
- 📊 Dashboard
- 📁 Projects
- 📋 Surveys
- 📇 Address Book
- 🎯 Lead Scoring
- 🇯🇵 Japan Screening
- 🔏 NDA
- 🔍 Due Diligence
- 📄 Contracts
- 📦 Orders
- 🚚 Transportation
- 📅 Calendar
- 📈 Reports
- ✉️ Communications
- ✅ Tasks
- 🔔 Notifications

### Responsive Breakpoints
- Desktop: ≥ 1200px (full sidebar, 3-column layouts)
- Tablet: 768px - 1199px (collapsible sidebar, 2-column layouts)
- Mobile: < 768px (hidden sidebar with drawer, single column)

---

## TypeScript Types (Core)

```typescript
// types/project.types.ts
export type ProjectTag = 'Strategic Portfolio' | 'Finders' | 'Development Services';

export type Stage =
  | 'LOBBY'
  | 'SURVEY_1'
  | 'SURVEY_2'
  | 'JAPAN_EARLY_ASSESSMENT'
  | 'NDA'
  | 'SURVEY_3'
  | 'DUE_DILIGENCE'
  | 'CONTRACT_DECISION'
  | 'DATA_ANALYSIS'
  | 'CONTRACT_DECISION_FINDERS'
  | 'OUTREACH_LIST'
  | 'MAKE_INTRODUCTIONS'
  | 'REVENUE_GENERATED';

export interface Project {
  id: string;
  company: Company;
  name: string;
  tags: ProjectTag[];
  currentStage: Stage;
  score: number;
  japanInterest: boolean;
  japanFit?: 'HIGH' | 'MEDIUM' | 'LOW';
  japanSummary?: string;
  partnerTags: string[];
  ndaStatus?: 'REQUESTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NOT_REQUIRED';
  ddProgress?: number; // 0-100
  contractStatus?: 'PENDING' | 'APPROVED' | 'DECLINED' | 'RENEGOTIATE';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string[];
}

export interface Company {
  id: string;
  name: string;
  country: string;
  category?: string;
  diseaseArea?: string[];
  productCategory?: string[];
  roles: CompanyRole[];
}

export type CompanyRole =
  | 'PRODUCT_OWNER'
  | 'BUYER'
  | 'DISTRIBUTOR'
  | 'CHANNEL_PARTNER'
  | 'SUPPLIER'
  | 'HOSPITAL'
  | 'MANUFACTURER';

export interface StageChange {
  id: string;
  projectId: string;
  fromStage: Stage | null;
  toStage: Stage;
  changedBy: string;
  changedAt: string;
  reason?: string;
}

export interface GateDecision {
  id: string;
  projectId: string;
  gate: 'GATE_1' | 'GATE_2' | 'GATE_3';
  decision: 'APPROVE' | 'HOLD' | 'CLOSE';
  reviewer: string;
  reviewedAt: string;
  reasoning: string;
}
```

---

## Implementation Priorities

### Must-Have for Demo
1. Authentication & role switching
2. Main dashboard with pipeline funnel
3. Project list & detail views
4. Survey submission flow (public)
5. Lead scoring visualization
6. Stage workflow with approvals
7. Basic NDA flow
8. Order creation & approval (Phase 2)
9. Transportation tracking timeline
10. Document upload & status

### Nice-to-Have
1. AI meeting summaries (can be mocked)
2. Advanced charts & analytics
3. Email integration (use simple forms)
4. Complex filtering & search
5. Bulk operations
6. Export to PDF/Excel

### Can Be Simplified for Dummy Flow
1. E-signature integration → Use status simulation
2. Real-time notifications → Use polling or manual refresh
3. AI extraction → Pre-populated mock data with "AI extracted" badge
4. Web search → Show mock results
5. Calendar integration → Standalone calendar component

---

## Next Steps

1. **Review & Approve Plan**: Ensure this plan covers all requirements
2. **Choose UI Library**: Confirm Ant Design or alternative
3. **Initialize Project**: Set up Vite + React + TypeScript
4. **Create Base Structure**: Layouts, routing, theme
5. **Build Phase 1 Modules**: Start with core CRM features
6. **Iterate & Refine**: Build module by module with user feedback

---

## Questions for Clarification

1. **UI Library**: Ant Design, MUI, or Shadcn/ui? (I recommend Ant Design)
2. **i18n**: English only for now, or build with JP support from start?
3. **Backend**: Will there be a real backend API, or pure frontend mock for now?
4. **Deployment**: Where will this be hosted? (Vercel, Netlify, custom server?)
5. **AI Features**: Should AI features be fully mocked, or integrate with actual AI APIs?
6. **E-signature**: Mock flow or integrate with DocuSign/Adobe Sign sandbox?
7. **Priority**: Phase 1 complete first, or build both phases in parallel?

---

## Estimated Timeline

- **Phase 0 (Foundation)**: 1 week
- **Phase 1 (CRM & Pipeline)**: 13 weeks
- **Phase 2 (Supply Chain)**: 7 weeks
- **Phase 3 (Polish)**: 2 weeks

**Total**: ~23 weeks (5.5 months) for complete dummy flow with all features

For MVP/demo version focusing on core flows: **8-10 weeks**

---

This plan provides a comprehensive roadmap for building the entire HekaBio platform frontend. Let me know if you'd like me to proceed with project initialization or if you have any adjustments to the plan!
