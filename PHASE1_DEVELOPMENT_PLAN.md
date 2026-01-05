================================================================================
                    HEKABIO - PHASE 1 DEVELOPMENT PLAN
================================================================================

Date: January 6, 2026
Version: 1.0
Focus: Partner Discovery & Due Diligence Workflow
Strategy: Working Mock Flow with Single Entries

================================================================================
                          EXECUTIVE SUMMARY
================================================================================

PHASE 1 OBJECTIVE:
Build a complete partner discovery and qualification system that takes potential
partners from initial contact through due diligence and decision-making.

WHAT'S INCLUDED IN PHASE 1:
- Lead generation (Cold/Warm reach workflows)
- Address book management
- Survey 1 (Initial data collection - 50 questions)
- AI-powered screening and analysis
- Meeting management and notes
- Opportunity assessment flow (50 → 10 → 1-3 funnel)
- Survey 2 (Detailed assessment - Japan-specific)
- Due diligence checklist (10 categories)
- Decision gates and workflow automation
- Product database management

WHAT'S EXCLUDED FROM PHASE 1:
- ERP/SCM integration (order processing)
- Inventory management system
- Order form system
- PO/Payment management
- Manufacturing integration
- Actual product fulfillment workflows

MOCK DATA STRATEGY:
- Single entry per entity (1 company, 1 contact, 1 survey, etc.)
- Focus on complete end-to-end flow
- Real-world data structure, simplified volume


================================================================================
                    SECTION 1: DATABASE SCHEMA DESIGN
================================================================================

1.1 COMPANIES TABLE
───────────────────────────────────────────────────────────────────────────
id: UUID (PK)
company_name: VARCHAR(255)
headquarters_location: VARCHAR(255)
website: VARCHAR(255)
company_type: ENUM('Biotech/Pharma', 'Medical Device', 'Diagnostics',
                    'Digital Health', 'Academic Institution', 'Other')
year_founded: INTEGER
number_of_employees: INTEGER
company_stage: ENUM('Pre-revenue', 'Revenue-generating', 'Profitable')
lead_source: ENUM('Cold Reach', 'Warm Reach - Address Book',
                  'Warm Reach - Introduction')
status: ENUM('Lead', 'Qualified', 'In Screening', 'In DD', 'Approved',
             'Declined', 'Contracted')
lead_score: INTEGER (0-100)
assigned_to: UUID (FK → users.id)
created_at: TIMESTAMP
updated_at: TIMESTAMP

INDEXES:
- idx_company_status
- idx_company_lead_score
- idx_company_assigned_to


1.2 CONTACTS TABLE
───────────────────────────────────────────────────────────────────────────
id: UUID (PK)
company_id: UUID (FK → companies.id)
full_name: VARCHAR(255)
role: ENUM('Management', 'BD', 'R&D', 'Other')
title: VARCHAR(255)
email: VARCHAR(255)
phone: VARCHAR(50)
linkedin_url: VARCHAR(255)
is_primary: BOOLEAN
created_at: TIMESTAMP
updated_at: TIMESTAMP

INDEXES:
- idx_contact_company_id
- idx_contact_email


1.3 THERAPEUTIC_AREAS TABLE
───────────────────────────────────────────────────────────────────────────
id: UUID (PK)
company_id: UUID (FK → companies.id)
therapeutic_area: VARCHAR(255)
disease_indication: TEXT
modality: ENUM('Small Molecule Drug', 'Biologic/Antibody', 'Gene Therapy',
               'Cell Therapy', 'Medical Device', 'Diagnostic',
               'Digital Therapeutic', 'Other')
is_primary: BOOLEAN
created_at: TIMESTAMP


1.4 PRODUCTS TABLE
───────────────────────────────────────────────────────────────────────────
id: UUID (PK)
company_id: UUID (FK → companies.id)
product_name: VARCHAR(255)
generic_name: VARCHAR(255)
therapeutic_area: VARCHAR(255)
disease_indication: TEXT
modality: VARCHAR(100)
development_stage: ENUM('Discovery/Preclinical', 'Phase I', 'Phase II',
                        'Phase III', 'Approved in Home Country',
                        'Approved in Other Markets', 'Marketed/Commercialized')
regulatory_status_japan: ENUM('Not Started', 'Planning', 'PMDA Submitted',
                              'Under Review', 'Approved', 'Marketed')
approval_date_japan: DATE
brief_description: TEXT
estimated_japan_market_size: DECIMAL(15,2)
peak_sales_estimate: DECIMAL(15,2)
lifecycle_stage: ENUM('Under Evaluation', 'In Development (Japan)',
                      'Filed with PMDA', 'Under Review', 'Approved',
                      'Launched', 'Mature Product', 'End of Life')
created_at: TIMESTAMP
updated_at: TIMESTAMP

INDEXES:
- idx_product_company_id
- idx_product_development_stage
- idx_product_lifecycle_stage


1.5 SURVEY_1_RESPONSES TABLE (Initial Data Collection)
───────────────────────────────────────────────────────────────────────────
id: UUID (PK)
company_id: UUID (FK → companies.id)
submitted_by: UUID (FK → contacts.id)
submission_date: TIMESTAMP
completion_percentage: INTEGER (0-100)

-- Company Information (Q1-4)
company_name: VARCHAR(255)
headquarters_location: VARCHAR(255)
website: VARCHAR(255)
company_type: VARCHAR(100)

-- Primary Contact (Q5-9)
contact_name: VARCHAR(255)
contact_title: VARCHAR(255)
contact_email: VARCHAR(255)
contact_phone: VARCHAR(50)
contact_linkedin: VARCHAR(255)

-- Product/Technology Overview (Q10-15)
product_name: VARCHAR(255)
therapeutic_area: VARCHAR(255)
disease_indication: TEXT
modality: VARCHAR(100)
development_stage: VARCHAR(100)
product_description: TEXT

-- Regulatory Status (Q16-18)
approved_countries: TEXT
approved_in_japan: BOOLEAN
pmda_guidance_received: BOOLEAN
pmda_guidance_details: TEXT

-- Clinical Data (Q19-23)
trials_completed: INTEGER
total_patients_enrolled: INTEGER
key_clinical_outcomes: TEXT
adverse_events: TEXT
publication_count: INTEGER
key_publications: TEXT

-- Intellectual Property (Q24-26)
patent_status: VARCHAR(100)
patent_families_count: INTEGER
patent_markets_covered: TEXT
patent_expiration_dates: TEXT
ip_disputes: BOOLEAN
ip_disputes_details: TEXT

-- Manufacturing & Supply Chain (Q27-31)
manufacturing_status: VARCHAR(100)
manufacturing_locations: TEXT
gmp_certified: BOOLEAN
annual_production_capacity: VARCHAR(255)
supply_chain_japan_ready: VARCHAR(100)

-- Market & Commercial (Q32-37)
current_markets: TEXT
global_market_size: DECIMAL(15,2)
japan_market_size: DECIMAL(15,2)
current_revenue: DECIMAL(15,2)
projected_revenue_year1: DECIMAL(15,2)
projected_revenue_year3: DECIMAL(15,2)
current_pricing: DECIMAL(15,2)
target_pricing_japan: DECIMAL(15,2)
reimbursement_status: TEXT

-- Japan Market Interest (Q38-41)
japan_interest_reason: TEXT
previous_japan_interactions: TEXT
preferred_partnership_model: VARCHAR(100)
japan_entry_timeline: VARCHAR(100)

-- Financial & Investment (Q42-46)
funding_status: VARCHAR(100)
total_funding_raised: DECIMAL(15,2)
key_investors: TEXT
cash_runway: VARCHAR(100)
seeking_investment: BOOLEAN
investment_amount_sought: DECIMAL(15,2)

-- Additional Information (Q47-50)
key_competitors: TEXT
competitive_advantages: TEXT
key_risks: TEXT
additional_comments: TEXT

-- Attachments
attachments: JSONB

created_at: TIMESTAMP
updated_at: TIMESTAMP

INDEXES:
- idx_survey1_company_id
- idx_survey1_submission_date


1.6 SCREENING_RECORDS TABLE
───────────────────────────────────────────────────────────────────────────
id: UUID (PK)
company_id: UUID (FK → companies.id)
screener_id: UUID (FK → users.id)
screening_date: TIMESTAMP
status: ENUM('Pending', 'In Progress', 'Completed')

-- Company Deep Dive (Section 1)
legal_name: VARCHAR(255)
year_founded: INTEGER
employee_count: INTEGER
ceo_name: VARCHAR(255)
ceo_background: TEXT
cso_name: VARCHAR(255)
cso_background: TEXT
corporate_structure: VARCHAR(100)
company_stage: VARCHAR(100)

-- Product/Technology Deep Dive (Section 2)
mechanism_of_action: TEXT
target_patient_population: TEXT
disease_prevalence_japan: TEXT
unmet_medical_need: TEXT
clinical_differentiation: TEXT
technology_readiness_level: INTEGER (1-9)
platform_vs_single: VARCHAR(100)

-- Regulatory Pathway (Section 3)
regulatory_strategy_japan: VARCHAR(255)
pmda_last_interaction_date: DATE
pmda_interaction_type: VARCHAR(255)
pmda_outcome: TEXT
required_studies_japan: TEXT
timeline_estimate: VARCHAR(100)
cost_estimate: DECIMAL(15,2)
orphan_drug_potential: BOOLEAN
orphan_patient_count_japan: INTEGER

-- Clinical Evidence (Section 4)
clinical_trials_summary: JSONB
ongoing_trials: TEXT
planned_trials: TEXT
japanese_patients_included: BOOLEAN
japanese_patient_count: INTEGER
safety_profile: TEXT

-- Market Analysis (Section 5)
japan_target_population: INTEGER
epidemiology_data: TEXT
current_treatment_landscape: TEXT
key_opinion_leaders_japan: TEXT
competitors_japan: JSONB
market_access_strategy: TEXT
year1_sales_projection: DECIMAL(15,2)
year3_sales_projection: DECIMAL(15,2)
peak_sales_estimate: DECIMAL(15,2)

-- Partnership Requirements (Section 6)
partner_capabilities_needed: JSONB
upfront_payment_expectation: DECIMAL(15,2)
development_milestones: DECIMAL(15,2)
commercial_milestones: DECIMAL(15,2)
royalty_expectations: DECIMAL(5,2)
exclusivity_terms: VARCHAR(100)
control_decision_making: VARCHAR(100)

-- Risk Assessment (Section 7)
technical_risk_level: ENUM('Low', 'Medium', 'High')
technical_risk_description: TEXT
regulatory_risk_level: ENUM('Low', 'Medium', 'High')
regulatory_risk_description: TEXT
commercial_risk_level: ENUM('Low', 'Medium', 'High')
commercial_risk_description: TEXT
ip_risk_level: ENUM('Low', 'Medium', 'High')
ip_risk_description: TEXT
competitive_risk_level: ENUM('Low', 'Medium', 'High')
competitive_risk_description: TEXT

-- AI Analysis Results
ai_missing_info_list: JSONB
ai_risk_score: INTEGER (0-100)
ai_opportunity_score: INTEGER (0-100)
ai_summary: TEXT

-- Recommendation
recommendation: ENUM('Proceed to Meeting', 'Request Additional Info', 'Decline')
recommendation_notes: TEXT
additional_info_needed: TEXT
decline_reason: TEXT

created_at: TIMESTAMP
updated_at: TIMESTAMP

INDEXES:
- idx_screening_company_id
- idx_screening_status
- idx_screening_recommendation


1.7 MEETINGS TABLE
───────────────────────────────────────────────────────────────────────────
id: UUID (PK)
company_id: UUID (FK → companies.id)
meeting_type: ENUM('Screening', 'Due Diligence', 'Negotiation', 'Other')
meeting_date: TIMESTAMP
meeting_duration_minutes: INTEGER
attendees_hekabio: JSONB
attendees_partner: JSONB
meeting_location: VARCHAR(255)
meeting_mode: ENUM('In-Person', 'Virtual', 'Hybrid')
meeting_notes: TEXT
action_items: JSONB
next_steps: TEXT
ai_analysis: TEXT
ai_extracted_action_items: JSONB
created_by: UUID (FK → users.id)
created_at: TIMESTAMP
updated_at: TIMESTAMP

INDEXES:
- idx_meeting_company_id
- idx_meeting_date


1.8 OPPORTUNITY_ASSESSMENTS TABLE
───────────────────────────────────────────────────────────────────────────
id: UUID (PK)
company_id: UUID (FK → companies.id)
assessment_type: ENUM('Quick Assessment', 'Deep Dive')
assessment_stage: ENUM('Data Gathering', 'Quick Assessment',
                       'NDA/DD/Business Plan', 'Contract Negotiation')
assessment_date: TIMESTAMP
assessed_by: UUID (FK → users.id)

-- Scoring
strategic_fit_score: INTEGER (0-100)
technical_score: INTEGER (0-100)
commercial_score: INTEGER (0-100)
regulatory_score: INTEGER (0-100)
financial_score: INTEGER (0-100)
overall_score: INTEGER (0-100)

-- Assessment Details
strategic_fit_notes: TEXT
technical_notes: TEXT
commercial_notes: TEXT
regulatory_notes: TEXT
financial_notes: TEXT

-- Contract Type (if applicable)
potential_contract_types: JSONB
-- Options: Product Sales (Reimbursed), Product Sales (Patient Pay),
--          Clinical Development Services, PMS Development Services,
--          Finders Contract, Contract with Distributor,
--          Secure Investment, MAH/DMAH Services

-- Gate Decision
gate_decision: ENUM('Proceed', 'Hold', 'Decline')
gate_decision_notes: TEXT
gate_decision_date: TIMESTAMP
gate_decision_by: UUID (FK → users.id)

created_at: TIMESTAMP
updated_at: TIMESTAMP

INDEXES:
- idx_assessment_company_id
- idx_assessment_overall_score
- idx_assessment_gate_decision


1.9 SURVEY_2_RESPONSES TABLE (Detailed Assessment)
───────────────────────────────────────────────────────────────────────────
id: UUID (PK)
company_id: UUID (FK → companies.id)
submitted_by: UUID (FK → contacts.id)
submission_date: TIMESTAMP

-- Japan-Specific Considerations (Q1-5)
japanese_materials_available: JSONB
japan_team_experience: VARCHAR(100)
pmda_regulatory_strategy: VARCHAR(100)
japanese_clinical_data_understanding: VARCHAR(100)
nhi_pricing_knowledge: VARCHAR(100)

-- Cultural & Operational Fit (Q6-9)
preferred_communication_style: VARCHAR(100)
decision_timeline: VARCHAR(100)
cultural_training_status: VARCHAR(100)
travel_willingness: VARCHAR(100)

-- Partnership Structure Preferences (Q10-13)
development_responsibilities: VARCHAR(100)
manufacturing_supply_plan: VARCHAR(100)
pharmacovigilance_plan: VARCHAR(100)
medical_affairs_plan: VARCHAR(100)

-- Commercial Expectations (Q14-16)
launch_timeline_japan: VARCHAR(100)
peak_sales_estimate_range: VARCHAR(100)
market_share_goal: VARCHAR(100)

-- Financial Terms (Q17-21)
upfront_payment_range: DECIMAL(15,2)
development_milestones_total: DECIMAL(15,2)
commercial_milestones_total: DECIMAL(15,2)
royalty_rate_min: DECIMAL(5,2)
royalty_rate_max: DECIMAL(5,2)
equity_investment_open: BOOLEAN
equity_amount_preferred: DECIMAL(15,2)

-- Timeline & Next Steps (Q22-25)
nda_timeline: VARCHAR(100)
data_room_access_timing: VARCHAR(100)
dd_timeline: VARCHAR(100)
decision_makers: VARCHAR(255)

-- Additional Questions (Q26-30)
other_asian_markets: TEXT
competing_discussions: VARCHAR(100)
success_criteria: TEXT
key_concerns: TEXT
questions_for_hekabio: TEXT

created_at: TIMESTAMP
updated_at: TIMESTAMP

INDEXES:
- idx_survey2_company_id
- idx_survey2_submission_date


1.10 DUE_DILIGENCE TABLE
───────────────────────────────────────────────────────────────────────────
id: UUID (PK)
company_id: UUID (FK → companies.id)
dd_lead: UUID (FK → users.id)
start_date: TIMESTAMP
target_completion_date: TIMESTAMP
actual_completion_date: TIMESTAMP
status: ENUM('Not Started', 'In Progress', 'Completed', 'On Hold')
overall_risk_rating: ENUM('Low', 'Medium', 'High', 'Critical')

-- Category 1: Corporate & Legal
corporate_legal_checklist: JSONB
corporate_legal_risk: VARCHAR(50)
corporate_legal_notes: TEXT

-- Category 2: Intellectual Property
ip_checklist: JSONB
ip_risk: VARCHAR(50)
ip_notes: TEXT

-- Category 3: Regulatory & Clinical
regulatory_clinical_checklist: JSONB
regulatory_clinical_risk: VARCHAR(50)
regulatory_clinical_notes: TEXT

-- Category 4: Scientific & Technical
scientific_technical_checklist: JSONB
scientific_technical_risk: VARCHAR(50)
scientific_technical_notes: TEXT

-- Category 5: Manufacturing & Quality
manufacturing_quality_checklist: JSONB
manufacturing_quality_risk: VARCHAR(50)
manufacturing_quality_notes: TEXT

-- Category 6: Commercial & Market
commercial_market_checklist: JSONB
commercial_market_risk: VARCHAR(50)
commercial_market_notes: TEXT

-- Category 7: Financial
financial_checklist: JSONB
financial_risk: VARCHAR(50)
financial_notes: TEXT

-- Category 8: Partnerships & Collaborations
partnerships_checklist: JSONB
partnerships_risk: VARCHAR(50)
partnerships_notes: TEXT

-- Category 9: Product Liability & Insurance
liability_insurance_checklist: JSONB
liability_insurance_risk: VARCHAR(50)
liability_insurance_notes: TEXT

-- Category 10: Human Resources & Key Personnel
hr_personnel_checklist: JSONB
hr_personnel_risk: VARCHAR(50)
hr_personnel_notes: TEXT

-- Overall Summary
total_documents_reviewed: INTEGER
outstanding_items: INTEGER
key_strengths: JSONB
key_concerns: JSONB
red_flags: TEXT

-- Recommendation
recommendation: ENUM('Proceed to Negotiation', 'Proceed with Conditions',
                     'Request Additional Information', 'Do Not Proceed')
recommendation_notes: TEXT
conditions: TEXT
additional_info_needed: TEXT

reviewed_by: UUID (FK → users.id)
reviewed_date: TIMESTAMP
approved_by: UUID (FK → users.id)
approved_date: TIMESTAMP

created_at: TIMESTAMP
updated_at: TIMESTAMP

INDEXES:
- idx_dd_company_id
- idx_dd_status
- idx_dd_overall_risk_rating


1.11 WORKFLOW_STAGES TABLE
───────────────────────────────────────────────────────────────────────────
id: UUID (PK)
company_id: UUID (FK → companies.id)
stage: ENUM('Lead', 'Survey Sent', 'Survey Completed', 'Screening',
            'Meeting Scheduled', 'Meeting Completed', 'Quick Assessment',
            'Deep Dive', 'NDA', 'Due Diligence', 'Negotiation',
            'Contract Signed', 'Declined')
entered_date: TIMESTAMP
exited_date: TIMESTAMP
duration_days: INTEGER
notes: TEXT
created_at: TIMESTAMP

INDEXES:
- idx_workflow_company_id
- idx_workflow_stage


1.12 DECISION_GATES TABLE
───────────────────────────────────────────────────────────────────────────
id: UUID (PK)
company_id: UUID (FK → companies.id)
gate_type: ENUM('Gate 1 - Screening', 'Gate 2 - Deep Dive',
                'Gate 3 - Due Diligence', 'Gate 4 - Contract')
gate_date: TIMESTAMP
decision: ENUM('Go', 'No-Go', 'Hold', 'Request More Info')
decision_maker: UUID (FK → users.id)
decision_rationale: TEXT
key_factors: JSONB
voting_record: JSONB (if committee decision)
next_steps: TEXT
conditions: TEXT
created_at: TIMESTAMP

INDEXES:
- idx_gate_company_id
- idx_gate_decision


1.13 DOCUMENTS TABLE
───────────────────────────────────────────────────────────────────────────
id: UUID (PK)
company_id: UUID (FK → companies.id)
document_type: VARCHAR(100)
document_name: VARCHAR(255)
file_path: VARCHAR(500)
file_size_bytes: BIGINT
mime_type: VARCHAR(100)
uploaded_by: UUID (FK → users.id)
uploaded_at: TIMESTAMP
document_category: ENUM('Survey Attachment', 'Clinical Data', 'Regulatory',
                       'Financial', 'Legal', 'IP', 'Other')
is_confidential: BOOLEAN
nda_required: BOOLEAN
created_at: TIMESTAMP

INDEXES:
- idx_document_company_id
- idx_document_type


1.14 USERS TABLE
───────────────────────────────────────────────────────────────────────────
id: UUID (PK)
email: VARCHAR(255) UNIQUE
password_hash: VARCHAR(255)
first_name: VARCHAR(100)
last_name: VARCHAR(100)
role: ENUM('Admin', 'BD Manager', 'BD Associate', 'Analyst', 'Legal',
           'Finance', 'Executive')
department: VARCHAR(100)
is_active: BOOLEAN
last_login: TIMESTAMP
created_at: TIMESTAMP
updated_at: TIMESTAMP

INDEXES:
- idx_user_email
- idx_user_role


1.15 ACTIVITY_LOG TABLE
───────────────────────────────────────────────────────────────────────────
id: UUID (PK)
company_id: UUID (FK → companies.id)
user_id: UUID (FK → users.id)
activity_type: VARCHAR(100)
activity_description: TEXT
metadata: JSONB
created_at: TIMESTAMP

INDEXES:
- idx_activity_company_id
- idx_activity_user_id
- idx_activity_created_at


================================================================================
                    SECTION 2: API ENDPOINTS SPECIFICATION
================================================================================

2.1 COMPANIES MODULE
───────────────────────────────────────────────────────────────────────────

POST /api/companies
Create new company (from cold/warm reach)
Body: { company_name, website, lead_source, ... }
Response: { company_id, status, message }

GET /api/companies
List all companies with filtering and pagination
Query params: status, lead_score_min, assigned_to, search, page, limit
Response: { companies: [], total, page, limit }

GET /api/companies/:id
Get company details
Response: { company, contacts, products, workflow_stage, ... }

PATCH /api/companies/:id
Update company information
Body: { field: value, ... }
Response: { updated_company }

DELETE /api/companies/:id
Soft delete company
Response: { success: true }

POST /api/companies/:id/assign
Assign company to BD manager
Body: { user_id }
Response: { success: true }


2.2 CONTACTS MODULE
───────────────────────────────────────────────────────────────────────────

POST /api/companies/:company_id/contacts
Create new contact
Body: { full_name, role, email, phone, ... }
Response: { contact_id }

GET /api/companies/:company_id/contacts
List all contacts for a company
Response: { contacts: [] }

PATCH /api/contacts/:id
Update contact information
Body: { field: value }
Response: { updated_contact }

DELETE /api/contacts/:id
Delete contact
Response: { success: true }


2.3 PRODUCTS MODULE
───────────────────────────────────────────────────────────────────────────

POST /api/companies/:company_id/products
Create new product
Body: { product_name, therapeutic_area, modality, ... }
Response: { product_id }

GET /api/products
List all products with filtering
Query params: company_id, development_stage, therapeutic_area
Response: { products: [] }

GET /api/products/:id
Get product details
Response: { product }

PATCH /api/products/:id
Update product information
Body: { field: value }
Response: { updated_product }


2.4 SURVEY 1 MODULE
───────────────────────────────────────────────────────────────────────────

POST /api/companies/:company_id/survey1
Create Survey 1 for company
Response: { survey_id, survey_link }

GET /api/survey1/:id
Get survey (public endpoint for external completion)
Response: { survey_questions, company_name }

POST /api/survey1/:id/submit
Submit Survey 1 responses
Body: { q1: value, q2: value, ... }
Response: { success: true, completion_percentage }

PATCH /api/survey1/:id/partial-save
Save partial survey progress
Body: { q1: value, q2: value }
Response: { saved: true, completion_percentage }

GET /api/companies/:company_id/survey1
Get Survey 1 responses for company
Response: { survey_data }


2.5 SCREENING MODULE
───────────────────────────────────────────────────────────────────────────

POST /api/companies/:company_id/screening
Create screening record
Response: { screening_id }

POST /api/screening/:id/analyze
Trigger AI analysis of survey data
Response: { ai_missing_info, ai_summary, ai_scores }

PATCH /api/screening/:id
Update screening information
Body: { section1: {}, section2: {}, ... }
Response: { updated_screening }

POST /api/screening/:id/recommend
Submit screening recommendation
Body: { recommendation, notes }
Response: { success: true }

GET /api/companies/:company_id/screening
Get screening records for company
Response: { screening_data }


2.6 MEETINGS MODULE
───────────────────────────────────────────────────────────────────────────

POST /api/companies/:company_id/meetings
Schedule new meeting
Body: { meeting_date, meeting_type, attendees, ... }
Response: { meeting_id }

POST /api/meetings/:id/notes
Add meeting notes
Body: { meeting_notes, action_items }
Response: { updated_meeting }

POST /api/meetings/:id/ai-analyze
Trigger AI analysis of meeting notes
Response: { ai_analysis, extracted_action_items }

GET /api/companies/:company_id/meetings
List all meetings for company
Response: { meetings: [] }

PATCH /api/meetings/:id
Update meeting information
Body: { field: value }
Response: { updated_meeting }


2.7 OPPORTUNITY ASSESSMENT MODULE
───────────────────────────────────────────────────────────────────────────

POST /api/companies/:company_id/assessments
Create new assessment
Body: { assessment_type }
Response: { assessment_id }

PATCH /api/assessments/:id
Update assessment scores and notes
Body: { strategic_fit_score, technical_score, ... }
Response: { updated_assessment, overall_score }

POST /api/assessments/:id/gate-decision
Submit gate decision
Body: { gate_decision, gate_decision_notes }
Response: { success: true }

GET /api/companies/:company_id/assessments
Get all assessments for company
Response: { assessments: [] }

GET /api/assessments/funnel-stats
Get funnel statistics (50 → 10 → 1-3)
Response: { data_gathering: 50, quick_assessment: 10, deep_dive: 3 }


2.8 SURVEY 2 MODULE
───────────────────────────────────────────────────────────────────────────

POST /api/companies/:company_id/survey2
Create Survey 2 for company
Response: { survey_id, survey_link }

GET /api/survey2/:id
Get survey (public endpoint)
Response: { survey_questions }

POST /api/survey2/:id/submit
Submit Survey 2 responses
Body: { q1: value, q2: value, ... }
Response: { success: true }

GET /api/companies/:company_id/survey2
Get Survey 2 responses for company
Response: { survey2_data }


2.9 DUE DILIGENCE MODULE
───────────────────────────────────────────────────────────────────────────

POST /api/companies/:company_id/due-diligence
Create DD record
Body: { dd_lead, target_completion_date }
Response: { dd_id }

PATCH /api/due-diligence/:id/category
Update DD category checklist
Body: { category: 'corporate_legal', checklist: {}, risk: 'Low', notes: '' }
Response: { updated_dd }

POST /api/due-diligence/:id/complete
Complete DD process
Body: { recommendation, recommendation_notes, ... }
Response: { success: true }

GET /api/companies/:company_id/due-diligence
Get DD record for company
Response: { dd_data }


2.10 WORKFLOW MODULE
───────────────────────────────────────────────────────────────────────────

POST /api/companies/:company_id/workflow/advance
Move company to next stage
Body: { target_stage, notes }
Response: { success: true, new_stage }

GET /api/companies/:company_id/workflow/history
Get workflow stage history
Response: { stages: [], current_stage }

POST /api/companies/:company_id/decision-gate
Record gate decision
Body: { gate_type, decision, decision_rationale, ... }
Response: { gate_id }


2.11 DOCUMENTS MODULE
───────────────────────────────────────────────────────────────────────────

POST /api/companies/:company_id/documents/upload
Upload document
Body: FormData with file
Response: { document_id, file_path }

GET /api/companies/:company_id/documents
List all documents for company
Response: { documents: [] }

GET /api/documents/:id/download
Download document
Response: File stream

DELETE /api/documents/:id
Delete document
Response: { success: true }


2.12 ANALYTICS & REPORTING MODULE
───────────────────────────────────────────────────────────────────────────

GET /api/analytics/pipeline
Get pipeline overview
Response: { by_stage: {}, by_score: {}, by_assigned: {} }

GET /api/analytics/funnel
Get opportunity funnel data
Response: { screens: 50, quick: 10, deep: 3, contracts: 1 }

GET /api/analytics/conversion-rates
Get conversion rates between stages
Response: { lead_to_screening: 20%, screening_to_dd: 10%, ... }

GET /api/analytics/average-duration
Get average time in each stage
Response: { screening: 14 days, dd: 45 days, ... }


2.13 AI SERVICES MODULE
───────────────────────────────────────────────────────────────────────────

POST /api/ai/analyze-survey
Analyze survey responses
Body: { survey_id }
Response: { missing_info: [], summary: '', scores: {} }

POST /api/ai/analyze-meeting-notes
Analyze meeting notes
Body: { meeting_notes }
Response: { action_items: [], key_points: [], sentiment: '' }

POST /api/ai/extract-document-data
Extract structured data from documents
Body: { document_id }
Response: { extracted_data: {} }

POST /api/ai/competitive-intelligence
Get competitive intelligence
Body: { company_name, therapeutic_area }
Response: { competitors: [], market_trends: [] }


================================================================================
                    SECTION 3: FRONTEND COMPONENTS
================================================================================

3.1 DASHBOARD VIEW
───────────────────────────────────────────────────────────────────────────
Components:
- PipelineOverview (cards showing counts by stage)
- FunnelVisualization (50 → 10 → 1-3 visualization)
- RecentActivity (timeline of recent actions)
- MyAssignedLeads (table of assigned companies)
- ActionItems (pending tasks)
- UpcomingMeetings (calendar integration)

Route: /dashboard


3.2 COMPANIES LIST VIEW
───────────────────────────────────────────────────────────────────────────
Components:
- CompaniesTable (sortable, filterable table)
- FilterSidebar (filter by status, score, assigned, etc.)
- SearchBar
- BulkActions (assign, export)
- CreateCompanyButton

Route: /companies


3.3 COMPANY DETAIL VIEW
───────────────────────────────────────────────────────────────────────────
Components:
- CompanyHeader (name, logo, status badge)
- ContactsList
- ProductsList
- WorkflowTimeline (visual timeline of stages)
- TabNavigation:
  - Overview Tab
  - Survey 1 Tab
  - Screening Tab
  - Meetings Tab
  - Assessment Tab
  - Survey 2 Tab
  - Due Diligence Tab
  - Documents Tab
  - Activity Log Tab

Route: /companies/:id


3.4 SURVEY 1 FORM (External)
───────────────────────────────────────────────────────────────────────────
Components:
- SurveyHeader (HekaBio branding)
- ProgressIndicator (50 questions)
- QuestionSections (collapsible sections)
- AutoSave (saves progress every 30 seconds)
- FileUpload (for attachments)
- SubmitButton

Route: /survey1/:survey_id (public)


3.5 SCREENING WORKFLOW VIEW
───────────────────────────────────────────────────────────────────────────
Components:
- ScreeningForm (7 sections)
- AIAnalysisPanel (shows AI-generated insights)
- MissingInfoChecklist
- RiskAssessmentCards
- RecommendationSelector
- SubmitScreeningButton

Route: /companies/:id/screening


3.6 MEETINGS VIEW
───────────────────────────────────────────────────────────────────────────
Components:
- MeetingsList
- CreateMeetingModal
- MeetingDetailsPanel
- MeetingNotesEditor (rich text)
- ActionItemsTracker
- AIAnalysisTrigger

Route: /companies/:id/meetings


3.7 OPPORTUNITY ASSESSMENT VIEW
───────────────────────────────────────────────────────────────────────────
Components:
- AssessmentTypeSelector (Quick vs Deep Dive)
- ScoringCards (5 dimensions with sliders)
- OverallScoreGauge (0-100 visualization)
- ContractTypesSelector (multi-select)
- GateDecisionPanel
- SubmitAssessmentButton

Route: /companies/:id/assessment


3.8 SURVEY 2 FORM (External)
───────────────────────────────────────────────────────────────────────────
Components:
- SurveyHeader
- ProgressIndicator (30 questions)
- JapanFocusedQuestions
- FinancialTermsInputs
- TimelineSelector
- SubmitButton

Route: /survey2/:survey_id (public)


3.9 DUE DILIGENCE VIEW
───────────────────────────────────────────────────────────────────────────
Components:
- DDCategoryTabs (10 categories)
- ChecklistManager (checkbox list per category)
- RiskLevelSelector
- NotesEditor
- OverallSummaryPanel
- RecommendationForm
- ApprovalWorkflow

Route: /companies/:id/due-diligence


3.10 WORKFLOW KANBAN VIEW
───────────────────────────────────────────────────────────────────────────
Components:
- KanbanBoard (columns for each stage)
- CompanyCard (draggable)
- StageColumns (with count badges)
- FilterBar
- BulkMoveActions

Route: /workflow


3.11 ANALYTICS DASHBOARD
───────────────────────────────────────────────────────────────────────────
Components:
- FunnelChart (50 → 10 → 1-3)
- ConversionRates
- AverageDurationByStage
- PipelineValue
- HeatmapByTherapeuticArea
- TimeToContract

Route: /analytics


3.12 SETTINGS & ADMIN
───────────────────────────────────────────────────────────────────────────
Components:
- UserManagement
- RolePermissions
- EmailTemplates
- AutomationRules
- IntegrationSettings
- AIConfiguration

Route: /settings


================================================================================
                    SECTION 4: WORKFLOW IMPLEMENTATION
================================================================================

4.1 COLD REACH WORKFLOW (Case 1)
───────────────────────────────────────────────────────────────────────────

STEP 1: Lead Creation
→ User creates new company record
→ Lead source: "Cold Reach"
→ Status: "Lead"
→ Workflow stage: "Lead"

STEP 2: Survey 1 Sent
→ System generates Survey 1
→ Sends email to contact with survey link
→ Workflow stage: "Survey Sent"
→ Automation: Send reminder after 3 days, 7 days

STEP 3: Survey Completion
→ Contact completes Survey 1
→ Auto-populate company fields
→ Calculate lead score (0-100)
→ Workflow stage: "Survey Completed"
→ Automation: Notify assigned BD manager

STEP 4: Add to Address Book
→ System creates contact records
→ Status: "Qualified"
→ Trigger: Move to screening if score > 60

STEP 5: Product DB Population
→ Create product record from survey data
→ Link to company


4.2 WARM REACH WORKFLOW (Case 2 - From Address Book)
───────────────────────────────────────────────────────────────────────────

STEP 1: Select from Address Book
→ User selects existing contact
→ Create company record
→ Lead source: "Warm Reach - Address Book"

STEP 2-5: Same as Cold Reach (Survey → Complete → Product DB)


4.3 WARM REACH WORKFLOW (Case 3 - Introduction Deck)
───────────────────────────────────────────────────────────────────────────

STEP 1: Introduction Request
→ User creates company record
→ Lead source: "Warm Reach - Introduction"
→ Request introduction deck

STEP 2: Deck Review
→ Upload introduction deck
→ Manual data entry from deck
→ Create product record

STEP 3: (Optional) Send Survey 1
→ If more info needed, send Survey 1


4.4 SCREENING PROCESS WORKFLOW
───────────────────────────────────────────────────────────────────────────

STEP 1: Trigger Screening
→ Condition: Survey 1 completed
→ Workflow stage: "Screening"
→ Status: "In Screening"

STEP 2: AI Analysis
→ Analyze Survey 1 data
→ Generate missing info list
→ Calculate opportunity score
→ Flag inconsistencies

STEP 3: BD Manager Review
→ Complete 7 screening sections
→ Review AI insights
→ Add manual notes

STEP 4: Schedule Meeting
→ Create meeting record
→ Add to calendar
→ Send invites

STEP 5: Meeting Completion
→ Add meeting notes
→ Trigger AI analysis
→ Extract action items

STEP 6: IPI Daily Assessment
→ AI performs daily assessment
→ Update scores
→ Flag changes

STEP 7: Gate 1 Decision - Monitor Decision
→ Decision options:
  a) NO → Proceed to Business (close as "Declined")
  b) YES → Internal Review Required?
     - NO → Request confidential data → AI Due Diligence
     - YES → NDA → DD for potential → Meeting → Contract


4.5 OPPORTUNITY ASSESSMENT WORKFLOW
───────────────────────────────────────────────────────────────────────────

FUNNEL STAGE 1: Data Gathering/Scoring (50 screens)
→ All companies with completed Survey 1
→ Auto-calculate initial scores
→ Workflow stage: "Data Gathering"

FUNNEL STAGE 2: Quick Assessment (10 assessments)
→ Top 10 scoring companies (or manual selection)
→ BD team performs quick assessment
→ Score across 5 dimensions
→ Workflow stage: "Quick Assessment"
→ Gate Decision: Proceed to Deep Dive?

FUNNEL STAGE 3: NDA/DD/Business Plan (1-3 deep dives)
→ Top 1-3 companies from quick assessment
→ Execute NDA
→ Perform detailed due diligence
→ Develop business plan
→ Workflow stage: "Deep Dive"

FUNNEL STAGE 4: Contract Negotiation
→ Companies that pass DD
→ Identify contract type:
  - Strategic Contract with Originator
    - Product Sales (Reimbursed)
    - Product Sales (Patient Pay)
    - Clinical Development Services
    - PMS Development Services
  - Finders Contract
    - Contract with Distributor
    - Secure Investment
  - MAH/DMAH Services Contract
→ Workflow stage: "Negotiation"
→ Final status: "Contract Signed" or "Declined"


4.6 SURVEY 2 WORKFLOW (Detailed Assessment)
───────────────────────────────────────────────────────────────────────────

TRIGGER: Company moves to "Deep Dive" stage

STEP 1: Generate Survey 2
→ System creates Survey 2 record
→ Send link to partner contact

STEP 2: Partner Completes Survey 2
→ Japan-specific questions
→ Financial terms expectations
→ Timeline preferences

STEP 3: Review Responses
→ BD team reviews Survey 2
→ Identifies alignment/gaps
→ Informs negotiation strategy


4.7 DUE DILIGENCE WORKFLOW
───────────────────────────────────────────────────────────────────────────

TRIGGER: Gate 2 decision = "Proceed to DD"

STEP 1: NDA Execution
→ Upload NDA document
→ Track signature status
→ Workflow stage: "NDA"

STEP 2: Create DD Record
→ Assign DD lead
→ Set target completion date
→ Initialize 10 category checklists

STEP 3: Document Request
→ Generate document request list
→ Track document submissions
→ Upload to document repository

STEP 4: Category-by-Category Review
→ For each of 10 categories:
  - Review documents
  - Complete checklist
  - Assess risk level
  - Document findings

STEP 5: Overall DD Summary
→ Compile key strengths
→ Document key concerns
→ Identify red flags
→ Calculate overall risk rating

STEP 6: Gate 3 Decision
→ Recommendation: Proceed / Proceed with Conditions / Do Not Proceed
→ Approval workflow
→ Decision recorded in decision_gates table

STEP 7: Next Steps
→ If Proceed: Move to "Negotiation"
→ If Conditions: Address conditions
→ If Do Not Proceed: Close as "Declined"


4.8 DECISION GATES WORKFLOW
───────────────────────────────────────────────────────────────────────────

GATE 1: Screening Decision
→ Trigger: Screening completed + meeting notes reviewed
→ Decision: Proceed to Quick Assessment / Request More Info / Decline
→ If Proceed: Move to "Quick Assessment"

GATE 2: Deep Dive Decision
→ Trigger: Quick assessment completed
→ Decision: Proceed to Deep Dive / Hold / Decline
→ If Proceed: Move to "Deep Dive" + trigger NDA

GATE 3: Due Diligence Decision
→ Trigger: DD completed
→ Decision: Proceed to Negotiation / Proceed with Conditions / Do Not Proceed
→ If Proceed: Move to "Negotiation"

GATE 4: Contract Decision
→ Trigger: Negotiation completed
→ Decision: Sign Contract / Continue Negotiation / Walk Away
→ If Sign: Status = "Contract Signed"


================================================================================
                    SECTION 5: AI INTEGRATION POINTS
================================================================================

5.1 SURVEY ANALYSIS AI
───────────────────────────────────────────────────────────────────────────
Function: Analyze Survey 1 responses
Input: Survey 1 JSON data
Output:
  - Missing information list (structured)
  - Data quality score
  - Key highlights summary
  - Inconsistency flags
  - Recommended follow-up questions

Implementation: GPT-4 API with structured prompts


5.2 MEETING NOTES AI
───────────────────────────────────────────────────────────────────────────
Function: Extract insights from meeting notes
Input: Meeting notes (text)
Output:
  - Action items with owners and due dates
  - Key decisions made
  - Concerns raised
  - Next steps
  - Sentiment analysis

Implementation: GPT-4 API + NLP


5.3 SCREENING AI
───────────────────────────────────────────────────────────────────────────
Function: IPI (Investment Potential Index) daily assessment
Input: All company data (survey, meeting notes, external data)
Output:
  - Updated IPI score (0-100)
  - Risk assessment
  - Opportunity assessment
  - Competitive intelligence updates
  - Recommended next actions

Implementation: ML model + GPT-4


5.4 DOCUMENT INTELLIGENCE AI
───────────────────────────────────────────────────────────────────────────
Function: Extract structured data from uploaded documents
Input: PDF documents (patents, clinical reports, financial statements)
Output:
  - Structured data extraction
  - Key findings summary
  - Red flag detection
  - Cross-reference validation

Implementation: Azure Document Intelligence + GPT-4


5.5 COMPETITIVE INTELLIGENCE AI
───────────────────────────────────────────────────────────────────────────
Function: Monitor competitive landscape
Input: Company name, therapeutic area, disease
Output:
  - Competitor list with profiles
  - Recent news and publications
  - Clinical trial updates
  - Market trends
  - Patent landscape changes

Implementation: Web scraping + GPT-4 + scheduled jobs


5.6 EMAIL TRIAGE AI
───────────────────────────────────────────────────────────────────────────
Function: Classify and route incoming emails
Input: Email content
Output:
  - Email category
  - Suggested routing
  - Urgency level
  - Draft response suggestion
  - Auto-link to company record

Implementation: GPT-4 API


5.7 DEAL SUCCESS PREDICTION AI
───────────────────────────────────────────────────────────────────────────
Function: Predict probability of successful partnership
Input: All company data + historical deal data
Output:
  - Success probability (0-100%)
  - Key success factors
  - Key risk factors
  - Comparable deals
  - Estimated timeline to contract

Implementation: ML model (requires training data)
Note: Phase 1 = Basic rule-based scoring, Phase 2 = ML model


================================================================================
                    SECTION 6: AUTOMATION RULES
================================================================================

6.1 SURVEY AUTOMATION
───────────────────────────────────────────────────────────────────────────
RULE 1: Survey Reminder Emails
Trigger: Survey sent AND survey_completion < 100%
Conditions:
  - Day 3 after send: Send reminder email
  - Day 7 after send: Send reminder email
  - Day 14 after send: Escalate to BD manager

RULE 2: Survey Completion Notification
Trigger: Survey completion = 100%
Action:
  - Email BD manager
  - Calculate lead score
  - Update workflow stage to "Survey Completed"


6.2 LEAD SCORING AUTOMATION
───────────────────────────────────────────────────────────────────────────
RULE 3: High Score Flag
Trigger: Lead score > 70
Action:
  - Add "Hot Lead" tag
  - Notify senior BD
  - Move to "Screening" stage
  - Auto-schedule screening task

RULE 4: Low Score Archive
Trigger: Lead score < 30
Action:
  - Add "Low Priority" tag
  - Move to "On Hold" status
  - Notify assigned BD


6.3 WORKFLOW STAGE AUTOMATION
───────────────────────────────────────────────────────────────────────────
RULE 5: Stale Lead Escalation
Trigger: Company in "Screening" stage > 14 days
Action:
  - Escalate to manager
  - Create follow-up task
  - Flag for review

RULE 6: Meeting Follow-up
Trigger: Meeting completed
Action:
  - Create "Add meeting notes" task (if not added)
  - Set reminder for 24 hours

RULE 7: Gate Decision Workflow
Trigger: Gate decision = "No-Go"
Action:
  - Move to "Declined" status
  - Send decline email (if configured)
  - Archive company record


6.4 NDA AUTOMATION
───────────────────────────────────────────────────────────────────────────
RULE 8: NDA Initiation
Trigger: Gate 2 decision = "GO" AND nda_status != "SIGNED"
Action:
  - Create NDA task
  - Assign to legal team
  - Send NDA template to partner

RULE 9: NDA Fully Signed
Trigger: NDA status = "SIGNED"
Action:
  - Grant data room access
  - Trigger DD checklist creation
  - Notify BD and legal teams
  - Update workflow stage to "Due Diligence"


6.5 DUE DILIGENCE AUTOMATION
───────────────────────────────────────────────────────────────────────────
RULE 10: DD Completion Check
Trigger: All 10 DD categories marked as complete
Action:
  - Calculate overall risk rating
  - Notify DD lead
  - Create "Submit DD recommendation" task

RULE 11: DD Approval Workflow
Trigger: DD recommendation submitted
Action:
  - Route to CFO/CEO for approval
  - Create approval task
  - Send summary report


6.6 CONTRACT AUTOMATION
───────────────────────────────────────────────────────────────────────────
RULE 12: High-Value Contract Approval
Trigger: Contract value > $5M
Action:
  - Require CFO approval
  - Add to board agenda
  - Create investor update

RULE 13: Contract Signed
Trigger: Contract status = "SIGNED"
Action:
  - Update status to "Contract Signed"
  - Create project team
  - Initiate kickoff meeting
  - Move to post-contract workflow (Phase 2)


6.7 DATA QUALITY AUTOMATION
───────────────────────────────────────────────────────────────────────────
RULE 14: Incomplete Survey Warning
Trigger: Survey started AND 7 days passed AND completion < 80%
Action:
  - Send reminder email (weekly, max 3)
  - Notify BD manager

RULE 15: Missing Critical Info
Trigger: Survey completed BUT missing critical fields
Action:
  - Flag survey as "Needs Review"
  - Create task for BD to follow up
  - List missing fields


================================================================================
                    SECTION 7: MOCK DATA STRATEGY
================================================================================

7.1 SINGLE ENTRY PHILOSOPHY
───────────────────────────────────────────────────────────────────────────
Create ONE complete example for each entity:
- 1 Company (Example: "AlphaBio Therapeutics")
- 3 Contacts (Management, BD, R&D)
- 1 Product (Example: "AB-101 for Solid Tumors")
- 1 Completed Survey 1
- 1 Screening Record (with AI analysis)
- 2 Meetings (initial + follow-up)
- 1 Quick Assessment
- 1 Survey 2 Response
- 1 Due Diligence Record (partially completed)
- 5 Documents (deck, clinical data, financial, patent, FDA correspondence)


7.2 MOCK COMPANY PROFILE
───────────────────────────────────────────────────────────────────────────
Company Name: AlphaBio Therapeutics Inc.
Headquarters: Boston, MA, USA
Founded: 2018
Employees: 45
Company Type: Biotech/Pharma
Lead Source: Cold Reach
Status: In Deep Dive
Lead Score: 82

Product: AB-101 (Anti-PD1/CTLA4 Bispecific Antibody)
Therapeutic Area: Oncology
Disease Indication: Advanced Solid Tumors
Modality: Biologic/Antibody
Development Stage: Phase II Clinical Trial
Clinical Data:
  - Phase I: 30 patients, ORR 25%, well-tolerated
  - Phase II: 120 patients enrolling, interim results Q3 2026

Regulatory: FDA Fast Track designation
Patents: 3 patent families, coverage in US, EU, JP
Funding: Series B completed ($45M), cash runway 18 months

Japan Interest: High unmet need, seeking co-development partner


7.3 MOCK WORKFLOW PROGRESSION
───────────────────────────────────────────────────────────────────────────
Timeline:
Day 1: Company created (Cold Reach)
Day 2: Survey 1 sent
Day 10: Survey 1 completed (lead score: 82)
Day 12: Assigned to BD Manager (John Smith)
Day 15: Screening initiated, AI analysis completed
Day 18: Initial meeting scheduled
Day 20: Meeting completed, notes added
Day 22: Quick assessment completed (score: 78)
Day 25: Gate 2 decision: Proceed to Deep Dive
Day 26: NDA sent
Day 30: NDA signed, Survey 2 sent
Day 35: Survey 2 completed
Day 37: Due Diligence initiated (target: 45 days)
Day 40: DD in progress (3/10 categories completed) ← CURRENT STATE


7.4 MOCK DATA FILES
───────────────────────────────────────────────────────────────────────────
Create seed data files:
- companies.seed.json
- contacts.seed.json
- products.seed.json
- survey1_responses.seed.json
- screening_records.seed.json
- meetings.seed.json
- assessments.seed.json
- survey2_responses.seed.json
- due_diligence.seed.json
- documents.seed.json
- workflow_stages.seed.json
- decision_gates.seed.json
- users.seed.json


================================================================================
                    SECTION 8: IMPLEMENTATION PHASES
================================================================================

PHASE 1A: FOUNDATION (Weeks 1-2)
───────────────────────────────────────────────────────────────────────────
□ Setup database schema (PostgreSQL)
□ Setup backend API framework (Node.js + Express OR Python + FastAPI)
□ Setup frontend framework (React + TypeScript)
□ Setup authentication (JWT)
□ Setup file storage (AWS S3 or local)
□ Setup email service (SendGrid or similar)
□ Create user management
□ Create mock data seed scripts

Deliverable: Working skeleton with auth


PHASE 1B: COMPANIES & CONTACTS (Weeks 3-4)
───────────────────────────────────────────────────────────────────────────
□ Implement companies CRUD
□ Implement contacts CRUD
□ Implement products CRUD
□ Build companies list view
□ Build company detail view
□ Build address book view
□ Implement search and filtering
□ Implement assignment workflow

Deliverable: Can create and manage companies


PHASE 1C: SURVEY 1 (Weeks 5-6)
───────────────────────────────────────────────────────────────────────────
□ Build Survey 1 data model (50 questions)
□ Create Survey 1 form (public-facing)
□ Implement auto-save functionality
□ Implement file upload for attachments
□ Build survey review view (internal)
□ Implement lead scoring algorithm
□ Build email templates (survey invite, reminders)
□ Implement survey automation rules

Deliverable: Complete Survey 1 flow


PHASE 1D: SCREENING & MEETINGS (Weeks 7-8)
───────────────────────────────────────────────────────────────────────────
□ Build screening data model (7 sections)
□ Create screening form view
□ Integrate AI analysis (GPT-4 for survey analysis)
□ Build AI insights display
□ Implement meetings CRUD
□ Create meeting notes editor
□ Integrate AI for meeting notes analysis
□ Implement action items tracker

Deliverable: Complete screening workflow


PHASE 1E: ASSESSMENTS & GATE DECISIONS (Weeks 9-10)
───────────────────────────────────────────────────────────────────────────
□ Build opportunity assessment model
□ Create assessment form (5 dimensions scoring)
□ Implement overall score calculation
□ Build funnel visualization (50 → 10 → 1-3)
□ Implement gate decision workflow
□ Build decision gates tracking
□ Create workflow stage management
□ Implement workflow automation rules

Deliverable: Complete assessment and gates


PHASE 1F: SURVEY 2 & DUE DILIGENCE (Weeks 11-12)
───────────────────────────────────────────────────────────────────────────
□ Build Survey 2 data model (30 questions)
□ Create Survey 2 form (Japan-focused)
□ Build DD data model (10 categories)
□ Create DD checklist views (10 tabs)
□ Implement DD risk assessment
□ Build DD summary and recommendation
□ Implement NDA tracking
□ Build document repository

Deliverable: Complete DD workflow


PHASE 1G: WORKFLOW VIEWS & AUTOMATION (Weeks 13-14)
───────────────────────────────────────────────────────────────────────────
□ Build Kanban workflow view
□ Build pipeline dashboard
□ Build analytics dashboard
□ Implement workflow automation engine
□ Configure automation rules
□ Build activity log
□ Implement notifications system
□ Create email automation

Deliverable: Complete workflow management


PHASE 1H: TESTING & POLISH (Weeks 15-16)
───────────────────────────────────────────────────────────────────────────
□ End-to-end testing with mock data
□ User acceptance testing
□ Bug fixes
□ Performance optimization
□ UI/UX polish
□ Documentation (user guide)
□ Deployment to staging environment
□ Training sessions

Deliverable: Production-ready Phase 1


================================================================================
                    SECTION 9: TECHNICAL STACK RECOMMENDATIONS
================================================================================

9.1 BACKEND
───────────────────────────────────────────────────────────────────────────
Option A: Node.js Stack
  - Runtime: Node.js 20+
  - Framework: Express.js or NestJS
  - Language: TypeScript
  - ORM: Prisma or TypeORM
  - Validation: Zod or Joi

Option B: Python Stack (RECOMMENDED if heavy AI)
  - Runtime: Python 3.11+
  - Framework: FastAPI
  - ORM: SQLAlchemy or Django ORM
  - Validation: Pydantic


9.2 DATABASE
───────────────────────────────────────────────────────────────────────────
Primary: PostgreSQL 15+ (strong JSONB support)
Alternative: MongoDB (if prefer document model)
Cache: Redis (for sessions and caching)


9.3 FRONTEND
───────────────────────────────────────────────────────────────────────────
Framework: React 18+ with TypeScript
UI Library: Shadcn/ui + Tailwind CSS (modern, customizable)
Alternative: Material-UI or Ant Design
State Management: Zustand or Redux Toolkit
Forms: React Hook Form + Zod
Charts: Recharts or Chart.js
Rich Text Editor: Tiptap or Slate


9.4 AI/ML SERVICES
───────────────────────────────────────────────────────────────────────────
LLM: OpenAI GPT-4 or GPT-4-turbo API
Document Intelligence: Azure Document Intelligence
Vector DB: Pinecone or Weaviate (for future RAG)


9.5 FILE STORAGE
───────────────────────────────────────────────────────────────────────────
Cloud: AWS S3 or Google Cloud Storage
Local Development: Local filesystem


9.6 EMAIL
───────────────────────────────────────────────────────────────────────────
Service: SendGrid or AWS SES
Templates: Handlebars or React Email


9.7 AUTHENTICATION
───────────────────────────────────────────────────────────────────────────
Strategy: JWT tokens
Library: Passport.js (Node) or OAuth libraries (Python)
Optional: Auth0 or Clerk for managed auth


9.8 DEPLOYMENT
───────────────────────────────────────────────────────────────────────────
Backend: Docker + AWS ECS or Railway
Frontend: Vercel or Netlify
Database: AWS RDS PostgreSQL or Supabase
CI/CD: GitHub Actions


================================================================================
                    SECTION 10: DEVELOPMENT PRIORITIES
================================================================================

10.1 MUST-HAVE (Phase 1 Core)
───────────────────────────────────────────────────────────────────────────
✓ Company/Contact/Product management
✓ Survey 1 (complete 50-question form)
✓ Screening workflow with AI analysis
✓ Meeting management with notes
✓ Opportunity assessment (50 → 10 → 1-3 funnel)
✓ Gate decisions
✓ Survey 2 (Japan-focused)
✓ Due Diligence checklist (10 categories)
✓ Workflow stage tracking
✓ Document management
✓ Basic automation (email reminders, notifications)
✓ Dashboard with pipeline overview


10.2 SHOULD-HAVE (Nice to have in Phase 1)
───────────────────────────────────────────────────────────────────────────
○ Kanban workflow view
○ Advanced analytics dashboard
○ AI meeting notes analysis
○ Competitive intelligence
○ Email integration (Gmail/Outlook)
○ Calendar integration
○ Mobile-responsive design
○ Export to Excel/PDF


10.3 COULD-HAVE (Phase 2 candidates)
───────────────────────────────────────────────────────────────────────────
△ Deal success prediction ML model
△ Advanced AI document analysis
△ Automated email triage
△ Real-time collaboration features
△ Advanced reporting builder
△ Mobile app
△ API for external integrations
△ Webhooks


10.4 WON'T-HAVE (Phase 1 - Deferred to Phase 2)
───────────────────────────────────────────────────────────────────────────
✗ ERP/SCM integration
✗ Order processing system
✗ Inventory management
✗ PO/Payment management
✗ Manufacturing integration
✗ Product fulfillment workflows


================================================================================
                    SECTION 11: SUCCESS CRITERIA
================================================================================

PHASE 1 SUCCESS METRICS
───────────────────────────────────────────────────────────────────────────

Functional Completeness:
□ Can create company from all 3 lead sources
□ Can send and complete Survey 1
□ Can perform screening with AI analysis
□ Can schedule and document meetings
□ Can perform opportunity assessment
□ Can make gate decisions
□ Can execute Survey 2
□ Can perform due diligence
□ Can track workflow stages
□ Can upload and manage documents

Automation:
□ Survey reminder emails working
□ Lead scoring calculation working
□ Workflow stage auto-advancement working
□ Notifications working
□ AI analysis triggered correctly

User Experience:
□ Intuitive navigation
□ Fast page loads (< 2 seconds)
□ Mobile-responsive
□ Clear visual hierarchy
□ Helpful error messages

Data Integrity:
□ No data loss
□ Proper audit trail
□ Accurate calculations
□ Correct workflow state transitions


================================================================================
                    SECTION 12: RISK MITIGATION
================================================================================

IDENTIFIED RISKS & MITIGATION STRATEGIES
───────────────────────────────────────────────────────────────────────────

RISK 1: Scope Creep
Mitigation:
  - Strict adherence to Phase 1 scope document
  - Regular scope review meetings
  - "Phase 2" parking lot for new ideas

RISK 2: AI Integration Complexity
Mitigation:
  - Start with simple GPT-4 prompts
  - Iterate based on results
  - Have manual fallback options
  - Budget for API costs

RISK 3: Data Model Changes
Mitigation:
  - Use database migrations from day 1
  - Design for flexibility (JSONB fields for extensibility)
  - Regular data model reviews

RISK 4: Survey Complexity (50 questions)
Mitigation:
  - Auto-save every 30 seconds
  - Allow partial completion
  - Progress indicator
  - Mobile-friendly design

RISK 5: Integration with External Systems
Mitigation:
  - Phase 1: Minimal external integrations
  - Use well-documented APIs
  - Build abstraction layers

RISK 6: Performance with Large Datasets
Mitigation:
  - Proper database indexing
  - Pagination on all lists
  - Lazy loading
  - Database query optimization


================================================================================
                    SECTION 13: NEXT STEPS
================================================================================

IMMEDIATE ACTIONS (This Week)
───────────────────────────────────────────────────────────────────────────
1. Review and approve this development plan
2. Assemble development team
3. Setup development environment
4. Initialize Git repository
5. Setup project management tool (Jira/Linear)
6. Create detailed user stories from this plan
7. Setup CI/CD pipeline
8. Provision development database
9. Setup API keys (OpenAI, email service, etc.)
10. Kickoff meeting with stakeholders


WEEK 1 SPRINT GOALS
───────────────────────────────────────────────────────────────────────────
□ Database schema created and migrated
□ Backend API scaffold with auth
□ Frontend app scaffold with routing
□ User login working
□ Companies CRUD API endpoints
□ Companies list view (basic)
□ Mock data seeded
□ Daily standups scheduled


STAKEHOLDER SIGN-OFF REQUIRED
───────────────────────────────────────────────────────────────────────────
□ Business team approval of workflow
□ Confirmation of Phase 1 scope
□ Approval of technical stack
□ Budget approval for:
  - Development team
  - Infrastructure costs
  - AI API costs (OpenAI)
  - Third-party services (email, storage)
□ Timeline approval (16 weeks)


================================================================================
                    APPENDIX A: TERMINOLOGY
================================================================================

HB: HekaBio
BD: Business Development
PMDA: Pharmaceuticals and Medical Devices Agency (Japan)
NDA: Non-Disclosure Agreement (context: legal agreement, not the regulatory filing)
DD: Due Diligence
IPI: Investment Potential Index
MAH: Marketing Authorization Holder
DMAH: Delegated MAH
PMS: Post-Market Surveillance
ERP: Enterprise Resource Planning
SCM: Supply Chain Management
GMP: Good Manufacturing Practice
QP: Qualified Person
CoA: Certificate of Analysis


================================================================================
                    APPENDIX B: MOCKUP REFERENCE
================================================================================

For UI/UX design reference, review:
1. Salesforce CRM (pipeline views)
2. HubSpot (deal stages, kanban)
3. Notion (forms and databases)
4. Linear (clean UI, fast interactions)
5. Airtable (flexible data views)


================================================================================
                          DOCUMENT END
================================================================================

This development plan is a living document and will be updated as Phase 1
progresses. Regular reviews will ensure alignment with business objectives.

Prepared by: Claude (AI Development Planner)
Date: January 6, 2026
Next Review: Week 4 of implementation
