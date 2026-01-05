================================================================================
                    HEKABIO - CLIENT REQUIREMENTS DOCUMENT
================================================================================

Date: January 5, 2026
Status: Phase 1 Implementation Review
Document Type: Consolidated Requirements & Specifications

================================================================================
                          TABLE OF CONTENTS
================================================================================

1. PROJECT FILTERING & WORKFLOW
2. OPPORTUNITY ASSESSMENT FLOW
3. ADDRESS BOOK STRUCTURE
4. SURVEY 1 - INITIAL DATA COLLECTION
5. SCREENING PROCESS
6. DUE DILIGENCE CHECKLIST
7. SURVEY 2 - DETAILED ASSESSMENT
8. ERP & SCM INTEGRATION
9. PRODUCT LIST MANAGEMENT
10. ORDER FORM SPECIFICATION
11. INVENTORY MANAGEMENT SYSTEM
12. AUTOMATION VS AI STRATEGY


================================================================================
1. PROJECT FILTERING & WORKFLOW
================================================================================

CLIENT FEEDBACK: Business team likes overall feel

WORKFLOW STAGES:
┌─────────────────────────────────────────────────────────────────────────┐
│                         COLD REACH CASES                                 │
└─────────────────────────────────────────────────────────────────────────┘

Case 1: Cold Reach
  → Survey form sent
  → Request to complete Survey task
  → Customer: Originator
  → Survey Result
  → Add it to address book
  → Data → HB Product DB

Case 2: Warm Reach
  → HB Address book
  → Request to complete Survey task
  → Customer: Originator
  → Survey Result
  → Add it to address book
  → Data → HB Product DB

Case 3: Warm Reach
  → Request to send us Introduction task
  → HB Address book
  → Customer: Originator
  → Introduction deck
  → Data → HB Product DB

┌─────────────────────────────────────────────────────────────────────────┐
│                         SCREENING PROCESS                                │
└─────────────────────────────────────────────────────────────────────────┘

Flow:
  → Screening: AI analysis of data
  → Create a list of missing info for the meeting
  → Schedule a meeting and create meeting notes
  → AI analyzes meeting notes, performs at IPI daily assessment
     and create action items and next step
  → Monitor Decision Point:
     ├─ No → Preceed Business
     └─ Yes → Internal review?
            ├─ No → Request for confidential data → AI Due Diligence
            └─ Yes → NDA
                   → DD for potential
                   → Schedule meeting with potential partners
                   → Contract


================================================================================
2. OPPORTUNITY ASSESSMENT FLOW
================================================================================

FROM DATA GATHERING/SCORING (50 screens):

Opportunity Assessment on Partner Tagging/Japan Market Analysis
  ├─ 10 quick assessments
  │
  ├─ NDA/DD/Business Plan (1-3 deep dives)
  │   │
  │   ├─ Strategic Contract with Originator (1-3 agreements per year)
  │   │   ├─ Product Sales (Reimbursed) Contract
  │   │   ├─ Product Sales (Patient Pay) Contract
  │   │   ├─ Clinical Development Services Contract
  │   │   └─ PMS Development Services Contract
  │   │
  │   ├─ Finders Contract
  │   │   ├─ Contract with Distributor
  │   │   └─ Secure Investment Contract
  │   │
  │   └─ MAH/DMAH Services Contract


================================================================================
3. ADDRESS BOOK STRUCTURE
================================================================================

CONTACT FIELDS:
┌─────────────────────────────────────────────────────────────────────────┐
│ Company                                                                  │
│ Management Contact                                                       │
│ Management Email                                                         │
│ BD Contact                                                              │
│ BD Email                                                                │
│ R&D Contact                                                             │
│ Website                                                                 │
│ Focused Therapeutic Area (Oncology, Cardiology, Neurology, etc.)        │
│ Focused Disease Area (Breast Cancer, Diabetes, Alzheimer's)             │
│ Modality (Drug, Device, Diagnostic, Digital Health)                     │
└─────────────────────────────────────────────────────────────────────────┘


================================================================================
4. SURVEY 1 - INITIAL DATA COLLECTION
================================================================================

COMPANY INFORMATION
───────────────────────────────────────────────────────────────────────────
1. Company/Institution Name
2. Headquarters Location
3. Website URL
4. Company Type
   □ Biotech/Pharma
   □ Medical Device
   □ Diagnostics
   □ Digital Health
   □ Academic Institution
   □ Other: _______________

PRIMARY CONTACT INFORMATION
───────────────────────────────────────────────────────────────────────────
5. Full Name
6. Title/Position
7. Email Address
8. Phone Number (with country code)
9. LinkedIn Profile (optional)

PRODUCT/TECHNOLOGY OVERVIEW
───────────────────────────────────────────────────────────────────────────
10. Product/Technology Name
11. Therapeutic Area
    □ Oncology
    □ Cardiology
    □ Neurology
    □ Rare Diseases
    □ Infectious Diseases
    □ Other: _______________

12. Disease Indication(s)
    Specify target disease(s): _______________

13. Modality
    □ Small Molecule Drug
    □ Biologic/Antibody
    □ Gene Therapy
    □ Cell Therapy
    □ Medical Device
    □ Diagnostic
    □ Digital Therapeutic
    □ Other: _______________

14. Stage of Development
    □ Discovery/Preclinical
    □ Phase I Clinical Trial
    □ Phase II Clinical Trial
    □ Phase III Clinical Trial
    □ Approved in Home Country
    □ Approved in Other Markets
    □ Marketed/Commercialized

15. Brief Product Description (max 500 words)
    Describe mechanism of action, key benefits, and differentiation:
    _______________

REGULATORY STATUS
───────────────────────────────────────────────────────────────────────────
16. Has the product received regulatory approval in any country?
    □ Yes → Please specify countries: _______________
    □ No

17. Is the product currently approved in Japan?
    □ Yes
    □ No
    □ Application submitted to PMDA

18. For investigational products, have you received regulatory guidance
    from PMDA or other agencies?
    □ Yes → Please describe: _______________
    □ No

CLINICAL DATA
───────────────────────────────────────────────────────────────────────────
19. Have you completed any clinical trials?
    □ Yes → Number of completed trials: _______________
    □ No

20. Total number of patients enrolled in trials to date: _______________

21. Key Clinical Outcomes/Endpoints Achieved:
    _______________

22. Any notable adverse events or safety concerns?
    □ Yes → Please describe: _______________
    □ No

23. Publication Record
    Number of peer-reviewed publications: _______________
    Key publications (provide links if available): _______________

INTELLECTUAL PROPERTY
───────────────────────────────────────────────────────────────────────────
24. Patent Status
    □ Patents granted
    □ Patents pending
    □ No patents

25. Patent Coverage
    Number of patent families: _______________
    Key markets covered: _______________
    Estimated patent expiration dates: _______________

26. Are there any ongoing IP disputes or challenges?
    □ Yes → Please describe: _______________
    □ No

MANUFACTURING & SUPPLY CHAIN
───────────────────────────────────────────────────────────────────────────
27. Current Manufacturing Status
    □ In-house manufacturing capability
    □ Contract Manufacturing Organization (CMO)
    □ No manufacturing established yet

28. Manufacturing Location(s): _______________

29. GMP Certification Status
    □ GMP certified
    □ In process
    □ Not yet initiated

30. Estimated annual production capacity: _______________

31. Supply chain readiness for Japan market
    □ Ready
    □ Requires setup (estimated timeline: _______________)
    □ Not assessed yet

MARKET & COMMERCIAL
───────────────────────────────────────────────────────────────────────────
32. Current Markets
    Countries where product is currently sold: _______________

33. Estimated global market size for indication: $ _______________

34. Estimated Japan market size: $ _______________

35. Current/Projected Annual Revenue
    Current: $ _______________
    Year 1 projection: $ _______________
    Year 3 projection: $ _______________

36. Pricing Strategy
    Current pricing (if marketed): $ _______________
    Target pricing for Japan: $ _______________

37. Reimbursement Status
    □ Reimbursed in home country
    □ Reimbursed in other markets (specify): _______________
    □ Patient-pay model
    □ Not yet commercialized

JAPAN MARKET INTEREST
───────────────────────────────────────────────────────────────────────────
38. Why are you interested in the Japan market?
    _______________

39. Have you had any previous interactions with Japanese partners?
    □ Yes → Please describe: _______________
    □ No

40. Preferred Partnership Model for Japan
    □ Licensing Agreement
    □ Co-development
    □ Distribution Agreement
    □ Joint Venture
    □ Direct Entry (establish subsidiary)
    □ Open to discussion

41. Timeline for Japan Market Entry
    □ Within 6 months
    □ 6-12 months
    □ 1-2 years
    □ 2+ years
    □ Flexible/Open to partner input

FINANCIAL & INVESTMENT
───────────────────────────────────────────────────────────────────────────
42. Funding Status
    □ Self-funded
    □ Angel/Seed funded
    □ Series A/B/C funded
    □ Public company
    □ Seeking funding

43. Total Funding Raised to Date: $ _______________

44. Key Investors: _______________

45. Current Cash Runway: _______________

46. Are you seeking additional investment from Japanese partners?
    □ Yes → Amount sought: $ _______________
    □ No

ADDITIONAL INFORMATION
───────────────────────────────────────────────────────────────────────────
47. Key Competitors in this space: _______________

48. Competitive Advantages/Differentiators: _______________

49. Key Risks or Challenges: _______________

50. Additional comments or information you'd like to share: _______________

ATTACHMENTS (Optional but Recommended)
───────────────────────────────────────────────────────────────────────────
□ Company Deck/Presentation
□ Product Brochure
□ Clinical Trial Results Summary
□ Regulatory Documents
□ Publications
□ Financial Statements


================================================================================
5. SCREENING PROCESS
================================================================================

SECTION 1: COMPANY OVERVIEW
───────────────────────────────────────────────────────────────────────────
1.1 Company Legal Name
1.2 Year Founded
1.3 Number of Employees
1.4 Leadership Team
    - CEO Name & Background
    - CSO/CTO Name & Background
    - Key Executives

1.5 Corporate Structure
    □ Private
    □ Public (Stock ticker: _______)
    □ Subsidiary of: _______________

1.6 Company Stage
    □ Pre-revenue
    □ Revenue-generating
    □ Profitable

SECTION 2: PRODUCT/TECHNOLOGY DEEP DIVE
───────────────────────────────────────────────────────────────────────────
2.1 Detailed Mechanism of Action
2.2 Target Patient Population
    - Demographics
    - Disease prevalence in Japan
    - Unmet medical need

2.3 Clinical Differentiation
    - How does it compare to standard of care?
    - Competitive advantages
    - Clinical endpoints superiority

2.4 Technology Readiness Level (TRL)
    Scale 1-9: _______________

2.5 Platform vs. Single Product
    □ Platform technology (potential for multiple products)
    □ Single product focus

SECTION 3: REGULATORY PATHWAY
───────────────────────────────────────────────────────────────────────────
3.1 Regulatory Strategy for Japan
    □ Full development in Japan
    □ Bridging study from foreign data
    □ Orphan drug designation pathway
    □ Sakigake (pioneering) designation
    □ Conditional approval pathway

3.2 PMDA Interactions
    Date of last interaction: _______________
    Type: _______________
    Outcome: _______________

3.3 Required Studies for Japan Approval
    - Clinical trials needed
    - Timeline estimate
    - Estimated cost

3.4 Orphan Drug Potential
    Patient population in Japan: _______________
    Eligible for orphan status: □ Yes □ No

SECTION 4: CLINICAL EVIDENCE
───────────────────────────────────────────────────────────────────────────
4.1 Completed Clinical Trials Summary
    Trial Phase | N | Primary Endpoint | Result | P-value
    ─────────────────────────────────────────────────────
    Phase I     |   |                  |        |
    Phase II    |   |                  |        |
    Phase III   |   |                  |        |

4.2 Ongoing Trials
4.3 Planned Trials
4.4 Japanese Patient Inclusion
    Were Japanese patients included in pivotal trials?
    □ Yes → How many: _____
    □ No → Bridging study needed

4.5 Safety Profile
    - Common adverse events
    - Serious adverse events
    - Comparison to comparator

SECTION 5: MARKET ANALYSIS
───────────────────────────────────────────────────────────────────────────
5.1 Japan Market Assessment
    - Target patient population size
    - Epidemiology data
    - Current treatment landscape
    - Key opinion leaders in Japan

5.2 Competitive Landscape in Japan
    Current Players:
    1. _______________
    2. _______________
    3. _______________

5.3 Market Access Considerations
    - MHLW reimbursement strategy
    - Price benchmarking
    - Health Technology Assessment readiness

5.4 Commercial Potential (Japan)
    Year 1 projected sales: _______________
    Year 3 projected sales: _______________
    Peak sales estimate: _______________

SECTION 6: PARTNERSHIP REQUIREMENTS
───────────────────────────────────────────────────────────────────────────
6.1 What partner capabilities are needed?
    □ Regulatory expertise
    □ Clinical development
    □ Manufacturing
    □ Distribution
    □ Marketing
    □ Reimbursement negotiation
    □ Post-marketing surveillance (PMS)

6.2 Investment Requirements
    Upfront payment expectation: $ _______________
    Development milestones: $ _______________
    Commercial milestones: $ _______________
    Royalty expectations: _____%

6.3 Exclusivity Terms
    □ Exclusive rights for Japan
    □ Exclusive for Asia-Pacific
    □ Co-exclusive
    □ Non-exclusive

6.4 Control & Decision Making
    Who controls clinical development in Japan?
    □ Originator
    □ Japanese partner
    □ Joint steering committee

SECTION 7: RISK ASSESSMENT
───────────────────────────────────────────────────────────────────────────
7.1 Technical Risks
    □ Low □ Medium □ High
    Description: _______________

7.2 Regulatory Risks
    □ Low □ Medium □ High
    Description: _______________

7.3 Commercial Risks
    □ Low □ Medium □ High
    Description: _______________

7.4 IP Risks
    □ Low □ Medium □ High
    Description: _______________

7.5 Competitive Risks
    □ Low □ Medium □ High
    Description: _______________

SCREENING RECOMMENDATION
───────────────────────────────────────────────────────────────────────────
□ PROCEED to One-on-One Meeting
□ REQUEST Additional Information (specify): _______________
□ DECLINE (reason): _______________

Screener Name: _______________
Date: _______________


================================================================================
6. DUE DILIGENCE CHECKLIST
================================================================================

CATEGORY 1: CORPORATE & LEGAL
───────────────────────────────────────────────────────────────────────────
□ Certificate of Incorporation
□ Articles of Association/Bylaws
□ Shareholder Registry
□ Board Minutes (last 2 years)
□ Cap Table & Ownership Structure
□ Previous Financing Rounds Documentation
□ Material Contracts (top 10)
□ Litigation History & Pending Cases
□ Insurance Policies
□ Compliance Certifications
□ Export Control Compliance
□ Anti-Corruption/FCPA Compliance

Risk Level: □ Low □ Medium □ High □ Critical
Notes: _______________

CATEGORY 2: INTELLECTUAL PROPERTY
───────────────────────────────────────────────────────────────────────────
□ Complete Patent Portfolio List
□ Patent Filing Dates & Expiration Dates
□ Patent Status by Jurisdiction
□ Freedom-to-Operate Analysis
□ Third-Party IP Licenses (in-licensed)
□ IP Litigation History
□ Trademark Registrations
□ Trade Secret Protections
□ IP Ownership Documentation
□ Inventor Assignment Agreements
□ University/Institution Agreements
□ Patent Prosecution History

Risk Level: □ Low □ Medium □ High □ Critical
Notes: _______________

CATEGORY 3: REGULATORY & CLINICAL
───────────────────────────────────────────────────────────────────────────
□ IND/CTA Submissions
□ FDA/EMA/PMDA Correspondence
□ Clinical Trial Protocols (all phases)
□ Clinical Study Reports (CSRs)
□ Investigator's Brochures
□ Safety Database & SUSAR Reports
□ Data Safety Monitoring Board Reports
□ IRB/Ethics Committee Approvals
□ Informed Consent Forms
□ GCP Audit Reports
□ Manufacturing & Controls (CMC) Data
□ Quality Certifications (GMP, ISO)
□ Regulatory Strategy Documents
□ Breakthrough/Orphan Designations

Risk Level: □ Low □ Medium □ High □ Critical
Notes: _______________

CATEGORY 4: SCIENTIFIC & TECHNICAL
───────────────────────────────────────────────────────────────────────────
□ Preclinical Study Reports
□ Pharmacology Data
□ Toxicology Studies
□ ADME/PK Studies
□ Formulation Development Data
□ Stability Studies
□ Analytical Methods Validation
□ Biomarker Validation
□ Technology Platform Description
□ Manufacturing Process Description
□ Scalability Assessment
□ Technology Transfer Protocols

Risk Level: □ Low □ Medium □ High □ Critical
Notes: _______________

CATEGORY 5: MANUFACTURING & QUALITY
───────────────────────────────────────────────────────────────────────────
□ Manufacturing Site Details
□ CMO Agreements
□ GMP Certificates
□ Batch Records & Release Data
□ Process Validation Reports
□ Supply Chain Map
□ Critical Supplier Agreements
□ Quality Agreements
□ Deviation & CAPA Reports
□ Inspection Reports (FDA/EMA/PMDA)
□ Environmental Monitoring Data
□ Cleaning Validation
□ Reference Standards Sources

Risk Level: □ Low □ Medium □ High □ Critical
Notes: _______________

CATEGORY 6: COMMERCIAL & MARKET
───────────────────────────────────────────────────────────────────────────
□ Market Research Reports
□ Competitor Analysis
□ Pricing Strategy & Models
□ Reimbursement Strategy
□ Key Opinion Leader List
□ Commercial Projections (5-year)
□ Sales & Marketing Plans
□ Distribution Strategy
□ Customer/Patient Journey Maps
□ Market Access Strategy
□ Health Economics Data (HEOR)
□ Budget Impact Models

Risk Level: □ Low □ Medium □ High □ Critical
Notes: _______________

CATEGORY 7: FINANCIAL
───────────────────────────────────────────────────────────────────────────
□ Audited Financial Statements (3 years)
□ Management Accounts (current year)
□ Cash Flow Projections
□ Budget vs Actual Analysis
□ Debt Agreements & Terms
□ Outstanding Liabilities
□ Tax Returns & Compliance
□ R&D Cost Breakdown
□ Burn Rate Analysis
□ Funding History & Sources
□ Investor Rights Agreements
□ Financial Covenants

Risk Level: □ Low □ Medium □ High □ Critical
Notes: _______________

CATEGORY 8: PARTNERSHIPS & COLLABORATIONS
───────────────────────────────────────────────────────────────────────────
□ Existing License Agreements
□ Co-Development Agreements
□ Distribution Agreements
□ Research Collaborations
□ CRO/CMO Contracts
□ Consulting Agreements
□ Key Person Agreements
□ Change of Control Provisions
□ Termination Clauses Review
□ Milestone & Payment Schedules

Risk Level: □ Low □ Medium □ High □ Critical
Notes: _______________

CATEGORY 9: PRODUCT LIABILITY & INSURANCE
───────────────────────────────────────────────────────────────────────────
□ Product Liability Insurance
□ Clinical Trial Insurance
□ Professional Indemnity Insurance
□ Adverse Event Reporting System
□ Product Recall Procedures
□ Risk Management Plan
□ Pharmacovigilance System
□ Post-Market Surveillance Plan

Risk Level: □ Low □ Medium □ High □ Critical
Notes: _______________

CATEGORY 10: HUMAN RESOURCES & KEY PERSONNEL
───────────────────────────────────────────────────────────────────────────
□ Organization Chart
□ Key Employee CVs
□ Employment Agreements (key staff)
□ Non-Compete Agreements
□ Incentive/Stock Option Plans
□ Retention Concerns
□ Scientific Advisory Board
□ Board of Directors Composition
□ Key Person Insurance

Risk Level: □ Low □ Medium □ High □ Critical
Notes: _______________

OVERALL DUE DILIGENCE SUMMARY
───────────────────────────────────────────────────────────────────────────
Total Documents Reviewed: _____
Outstanding Items: _____
Overall Risk Rating: □ Low □ Medium □ High □ Critical

Key Strengths:
1. _______________
2. _______________
3. _______________

Key Concerns:
1. _______________
2. _______________
3. _______________

Red Flags (if any):
_______________

RECOMMENDATION
───────────────────────────────────────────────────────────────────────────
□ PROCEED to Negotiation
□ PROCEED with Conditions (specify): _______________
□ REQUEST Additional Information
□ DO NOT PROCEED

Reviewed By: _______________
Date: _______________
Approved By: _______________
Date: _______________


================================================================================
7. SURVEY 2 - DETAILED ASSESSMENT
================================================================================

JAPAN-SPECIFIC CONSIDERATIONS
───────────────────────────────────────────────────────────────────────────
1. Japanese Language Materials
   Do you have materials translated into Japanese?
   □ Company overview
   □ Product information
   □ Clinical data summaries
   □ None yet

2. Japan Experience
   Does your team have Japan market experience?
   □ Yes - in-house expertise
   □ Yes - advisory board
   □ No - seeking guidance

3. Regulatory Strategy for PMDA
   Have you developed a Japan regulatory strategy?
   □ Complete strategy developed
   □ Draft strategy
   □ Need partner input
   □ Not yet started

4. Japanese Clinical Data Requirements
   Understanding of Japanese-specific requirements:
   □ Fully understood
   □ Partially understood
   □ Need education

5. Pricing & Reimbursement
   Knowledge of NHI system and pricing:
   □ Familiar
   □ Basic understanding
   □ Need expert guidance

CULTURAL & OPERATIONAL FIT
───────────────────────────────────────────────────────────────────────────
6. Communication & Collaboration
   Preferred communication style with Japanese partners:
   □ Frequent updates (weekly)
   □ Regular updates (bi-weekly/monthly)
   □ Milestone-based updates
   □ Flexible based on partner preference

7. Decision-Making Process
   Your internal decision timeline for partnership:
   □ < 3 months
   □ 3-6 months
   □ 6-12 months
   □ > 12 months

8. Cultural Awareness
   Team training on Japanese business culture:
   □ Completed
   □ Planned
   □ Interested
   □ Not considered

9. Travel & Meetings
   Willingness to travel to Japan for meetings:
   □ Regularly (quarterly)
   □ As needed (2-3 times/year)
   □ Occasionally (annually)
   □ Prefer virtual meetings

PARTNERSHIP STRUCTURE PREFERENCES
───────────────────────────────────────────────────────────────────────────
10. Development Responsibilities
    How do you envision development split?
    □ Partner leads Japan development
    □ Joint development
    □ We lead with partner support
    □ Open to discussion

11. Manufacturing Supply
    Manufacturing for Japan market:
    □ We supply from existing facilities
    □ Partner manufactures locally
    □ Tech transfer to partner
    □ To be determined

12. Pharmacovigilance
    Post-market safety monitoring:
    □ We manage globally
    □ Partner manages in Japan
    □ Shared responsibility
    □ To be negotiated

13. Medical Affairs
    Medical/scientific support in Japan:
    □ Partner provides
    □ We provide remotely
    □ Hybrid model
    □ To be determined

COMMERCIAL EXPECTATIONS
───────────────────────────────────────────────────────────────────────────
14. Launch Timeline
    Ideal Japan launch timeframe:
    □ Already launched/ready
    □ Within 1-2 years
    □ 2-3 years
    □ 3-5 years
    □ > 5 years

15. Peak Sales Estimate (Japan)
    Expected annual peak sales:
    □ < ¥1B ($7M)
    □ ¥1-5B ($7-35M)
    □ ¥5-10B ($35-70M)
    □ > ¥10B (> $70M)

16. Market Share Goals
    Target market share in Japan:
    □ < 10%
    □ 10-25%
    □ 25-50%
    □ > 50%
    □ Market leader

FINANCIAL TERMS
───────────────────────────────────────────────────────────────────────────
17. Upfront Payment Range
    Expected upfront payment:
    $ _______________

18. Development Milestones
    Total development milestones:
    $ _______________

19. Commercial Milestones
    Total commercial milestones:
    $ _______________

20. Royalty Rate Range
    Expected royalty rate:
    _____% - _____%

21. Equity Investment
    Are you open to equity investment from partner?
    □ Yes - preferred amount: $ _______________
    □ Maybe - open to discussion
    □ No

TIMELINE & NEXT STEPS
───────────────────────────────────────────────────────────────────────────
22. NDA Timeline
    When can you execute NDA?
    □ Immediately
    □ Within 2 weeks
    □ Within 1 month
    □ After internal review

23. Data Room Access
    When can confidential data be shared?
    □ After NDA execution
    □ After preliminary discussion
    □ After term sheet agreement
    □ To be determined

24. Due Diligence Timeline
    How long for DD process?
    □ 1 month
    □ 2-3 months
    □ 3-6 months
    □ Flexible

25. Decision Makers
    Who needs to approve partnership deal?
    □ CEO only
    □ Board approval required
    □ Investor consent needed
    □ Multiple stakeholders

ADDITIONAL QUESTIONS
───────────────────────────────────────────────────────────────────────────
26. Other Asian Markets
    Are you pursuing other Asian markets simultaneously?
    □ Yes (specify): _______________
    □ No - Japan focus only
    □ Potential future expansion

27. Competing Opportunities
    Are you in discussions with other Japanese partners?
    □ Yes - multiple discussions
    □ Yes - one other discussion
    □ No - exclusive discussion
    □ Prefer not to disclose

28. Success Criteria
    What defines partnership success for you?
    _______________

29. Key Concerns
    What are your biggest concerns about Japan market entry?
    _______________

30. Questions for Us
    What questions do you have for HekaBio?
    _______________


================================================================================
8. ERP & SCM INTEGRATION
================================================================================

PROCESS FLOW: Contract to Delivery
───────────────────────────────────────────────────────────────────────────

STEP 1: CONTRACT SIGNED
  ↓
STEP 2: Account data created
  ↓
STEP 3: Pre-order check with mfg
  ↓
DECISION: MFG approves?
  ├─ No → Agree on schedule and quantity
  └─ Yes ↓

┌─────────────────────────────────────────────────────────────────────────┐
│ DOCUMENTATION MANAGEMENT (Orange Section)                               │
├─────────────────────────────────────────────────────────────────────────┤
│ STEP 4: Transportation Arrangement                                      │
│ STEP 5: AWB, Packaging List, Invoice, Certificate of Analysis,         │
│         Production Record                                               │
│ STEP 6: HB verify data                                                 │
│ STEP 7: Domestic Transportation Company Customs Clearance              │
│ STEP 8: Incoming Inspection                                            │
│ STEP 9: Shipping approval                                              │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ INVENTORY MANAGEMENT (Green Section)                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ STEP 10: Mfg                                                            │
│ STEP 11: Import                                                         │
│ STEP 12: Hospital Use                                                  │
│ STEP 13: Used/Un-used product pick up                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ PO/PAYMENT MANAGEMENT (Blue Section)                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ STEP 14a: PO (Hospital to Distributor)                                 │
│ STEP 14b: PO (Distributor to HB)                                       │
│ STEP 14c: PO (HB to Originator/mfg)                                    │
│ STEP 15: Arrange pick up, shipping fee                                 │
└─────────────────────────────────────────────────────────────────────────┘

KEY STAKEHOLDERS:
  - Originator/Manufacturer
  - HekaBio (HB)
  - Distributor
  - Hospital


================================================================================
9. PRODUCT LIST MANAGEMENT
================================================================================

PRODUCT DATABASE FIELDS
───────────────────────────────────────────────────────────────────────────
□ Product ID (System Generated)
□ Product Name (Commercial)
□ Generic Name
□ Company/Originator
□ Therapeutic Area
□ Disease Indication
□ Modality Type
□ Development Stage
□ Regulatory Status (Japan)
□ Approval Date (if applicable)
□ Patent Expiry Date
□ Pricing (Ex-factory)
□ NHI Reimbursement Code
□ Reimbursement Price
□ Annual Sales (Japan)
□ Market Share
□ Competitors
□ Distribution Channel
□ Storage Conditions
□ Shelf Life
□ Package Size/Configuration
□ Manufacturer Location
□ QP (Qualified Person) Contact
□ Safety Profile Summary
□ Label/IFU Status

PRODUCT LIFECYCLE TRACKING
───────────────────────────────────────────────────────────────────────────
Stage Indicators:
  □ Under Evaluation
  □ In Development (Japan)
  □ Filed with PMDA
  □ Under Review
  □ Approved
  □ Launched
  □ Mature Product
  □ End of Life

Status Updates:
  - Last Review Date: _______________
  - Next Milestone: _______________
  - Owner: _______________


================================================================================
10. ORDER FORM SPECIFICATION
================================================================================

ORDER HEADER
───────────────────────────────────────────────────────────────────────────
Order Number: _______________  (System Generated)
Order Date: _______________
Requested Delivery Date: _______________
Purchase Order Type:
  □ Standard Order
  □ Rush Order
  □ Clinical Trial Supply
  □ Compassionate Use

CUSTOMER INFORMATION
───────────────────────────────────────────────────────────────────────────
Bill To:
  Company Name: _______________
  License Number: _______________
  Address: _______________
  Contact Person: _______________
  Phone: _______________
  Email: _______________

Ship To:
  Facility Name: _______________
  Medical License #: _______________
  Address: _______________
  Contact Person: _______________
  Phone: _______________
  Email: _______________
  Special Delivery Instructions: _______________

PRODUCT DETAILS
───────────────────────────────────────────────────────────────────────────
Line | Product Code | Product Name | Qty | Unit | Unit Price | Total
─────┼──────────────┼──────────────┼─────┼──────┼────────────┼──────
  1  |              |              |     |      |            |
  2  |              |              |     |      |            |
  3  |              |              |     |      |            |
  4  |              |              |     |      |            |
  5  |              |              |     |      |            |

PRICING SUMMARY
───────────────────────────────────────────────────────────────────────────
Subtotal: _______________
Shipping & Handling: _______________
Insurance: _______________
Customs/Duties (if applicable): _______________
Tax: _______________
────────────────────────
TOTAL: _______________

PAYMENT TERMS
───────────────────────────────────────────────────────────────────────────
Payment Method:
  □ Wire Transfer
  □ Letter of Credit
  □ Credit Card
  □ Net 30
  □ Net 60

Bank Details: _______________
Payment Reference: _______________

SHIPPING INFORMATION
───────────────────────────────────────────────────────────────────────────
Shipping Method:
  □ Air Freight (Standard)
  □ Air Freight (Express)
  □ Temperature Controlled (2-8°C)
  □ Temperature Controlled (-20°C)
  □ Temperature Controlled (-80°C)
  □ Dry Ice Shipment

Incoterms:
  □ EXW (Ex Works)
  □ FCA (Free Carrier)
  □ CIP (Carriage and Insurance Paid)
  □ DAP (Delivered at Place)
  □ DDP (Delivered Duty Paid)

Insurance Coverage:
  □ Standard
  □ Enhanced (High Value Goods)
  □ Clinical Trial Materials

REGULATORY DOCUMENTATION REQUIRED
───────────────────────────────────────────────────────────────────────────
□ Commercial Invoice
□ Packing List
□ Certificate of Analysis (CoA)
□ Certificate of Origin
□ Material Safety Data Sheet (MSDS)
□ Import License Copy
□ Temperature Monitoring Records
□ Chain of Custody Documentation
□ Biological/Chemical Safety Certification

SPECIAL REQUIREMENTS
───────────────────────────────────────────────────────────────────────────
□ Clinical Trial Material
□ Investigational Product
□ Requires DEA/Controlled Substance Handling
□ Requires Special Import Permit
□ Cold Chain Required
□ Hazardous Material
□ Live Biological Material

Notes/Special Instructions:
_______________

APPROVAL & AUTHORIZATION
───────────────────────────────────────────────────────────────────────────
Ordered By: _______________
Signature: _______________
Date: _______________

Approved By (Finance): _______________
Signature: _______________
Date: _______________

Approved By (Regulatory): _______________
Signature: _______________
Date: _______________


================================================================================
11. INVENTORY MANAGEMENT SYSTEM
================================================================================

RADIATION SOURCE TRACKING (Example: αDaRT Seeds)
───────────────────────────────────────────────────────────────────────────

Field Definitions:
  - Order# : Purchase order number
  - Event Category: Type of transaction
  - Source Name: Product name
  - Nuclide: Radioactive isotope
  - Quantity (Bq) / 1 Seed: Activity per unit
  - Number of Units: Count
  - Total Quantity (Bq): Total activity
  - Source Number: Serial numbers
  - Date: Transaction date
  - Receiving Facility: Destination
  - Receiving Facility Name: Hospital/clinic name
  - Worker: Person handling
  - Method & Location of Use: Application details
  - Storage Worker: Person responsible for storage
  - Storage Method & Location: Storage details
  - Disposal Worker: Person handling disposal
  - Disposal Method & Location: Disposal details

SAMPLE INVENTORY RECORDS
───────────────────────────────────────────────────────────────────────────
Order#: xxxxx
Event: Received
  Source: αDaRT
  Nuclide: Ra-224
  Quantity: 74 Bq/seed
  Units: 50
  Total: 3700 Bq
  Date: 4/1/2026
  Receiving: JRIA
  Facility: Hospital ①
  Worker: Hospital Taro
  Storage: -
  Disposal: -

Order#: xxxxx
Event: Use
  Source: αDaRT
  Nuclide: Ra-224
  Quantity: 74 Bq/seed
  Units: 50
  Total: 3700 Bq
  Serial #s: ATM-1, 2, 3, ...
  Date: 4/2/2026
  From: JRIA
  Facility: Hospital ①
  Worker: Hospital Taro
  Usage: Radiation therapy, Operating Room 1
  Storage Worker: Hospital Saburo
  Storage: Dedicated container, sealed storage locker
  Disposal: -

Order#: xxxxx
Event: Storage (Retrieved seeds after insertion)
  Source: αDaRT
  Nuclide: Ra-224
  Quantity: 74 Bq/seed
  Units: 45
  Total: 3330 Bq
  Serial #s: ATM-1, 2, 3, ...
  Date Range: 4/16/2026 - 9/15/2026
  From: JRIA
  Facility: Hospital ①
  Storage: Dedicated sealed container

Order#: xxxxx
Event: Storage (Unused seeds)
  Source: αDaRT
  Nuclide: Ra-226
  Quantity: 74 Bq/seed
  Units: 5
  Total: 370 Bq
  Serial #s: ATM-46, 47, 48, ...
  Date Range: 4/2/2026 - 9/15/2026
  From: JRIA
  Facility: Hospital ①
  Storage Worker: Hospital Saburo
  Storage: Unopened packaging, storage locker

Order#: xxxxx
Event: Disposal
  Source: αDaRT
  Nuclide: Ra-226
  Quantity: <1 Bq/seed (decay calculated)
  Units: 50
  Total: <1 Bq
  Serial #s: ATM-1, 2, 3, ...
  Date: 9/16/2026
  From: JRIA
  Facility: Hospital ①
  Disposal Worker: Hospital Shiro
  Disposal Method: 5 months storage, transferred to medical
                   waste contractor
  *Waste contractor receipt attached

KEY INVENTORY OPERATIONS
───────────────────────────────────────────────────────────────────────────
□ Receiving & Inspection
□ Quality Control Check
□ Put-away to Storage
□ Inventory Count (Periodic)
□ Pick for Order
□ Packing & Labeling
□ Shipment Release
□ Return Processing
□ Quarantine Management
□ Expiry Tracking
□ Temperature Monitoring
□ Batch Traceability
□ Serialization Tracking
□ Destruction/Disposal Records


================================================================================
12. AUTOMATION VS AI STRATEGY
================================================================================

BUSINESS PROCESS AUTOMATION OPPORTUNITIES
───────────────────────────────────────────────────────────────────────────

1. RULES-BASED AUTOMATION (No AI Required)
   ─────────────────────────────────────────────────────────────────────
   Trigger: Survey completed
   Action:
     - Auto-create project record
     - Auto-calculate lead score
     - Auto-assign to BD manager
     - Send thank you email
     - Add to CRM pipeline

   Trigger: Lead score > 70
   Action:
     - Flag as "Hot Lead"
     - Notify senior BD
     - Auto-schedule follow-up task
     - Move to screening stage

   Trigger: NDA fully signed
   Action:
     - Update project status
     - Grant data room access
     - Trigger DD checklist creation
     - Notify legal & BD teams

   Trigger: Contract value > $5M
   Action:
     - Require CFO approval
     - Add to board agenda
     - Create investor update

2. AI-ENHANCED AUTOMATION (Machine Learning)
   ─────────────────────────────────────────────────────────────────────
   Application: Survey Response Analysis
     - Extract key data points
     - Categorize therapeutic area
     - Identify missing information
     - Flag inconsistencies
     - Generate summary

   Application: Document Intelligence
     - Extract data from PDFs (patents, clinical reports)
     - Classify document types
     - Identify key sections
     - Create structured data

   Application: Competitive Intelligence
     - Monitor news/publications
     - Track competitor pipelines
     - Identify market trends
     - Alert on relevant updates

   Application: Meeting Notes Processing
     - Transcribe meetings
     - Extract action items
     - Identify key decisions
     - Auto-create follow-up tasks

   Application: Email Triage
     - Classify incoming emails
     - Route to appropriate person
     - Suggest responses
     - Identify urgent items

3. PREDICTIVE ANALYTICS (AI/ML)
   ─────────────────────────────────────────────────────────────────────
   Model: Deal Success Prediction
     Inputs:
       - Company stage
       - Clinical data quality
       - Market size
       - Regulatory pathway
       - Team experience
     Output: Probability of successful partnership (0-100%)

   Model: Timeline Estimation
     Inputs:
       - Product type
       - Development stage
       - Regulatory pathway
     Output: Estimated time to Japan approval

   Model: Valuation Range
     Inputs:
       - Indication
       - Market size
       - Competition
       - Clinical data
     Output: Fair deal value range

4. WORKFLOW AUTOMATION RULES
   ─────────────────────────────────────────────────────────────────────
   IF stage = "DATA_GATHERING" AND survey_completion < 80%
     THEN send_reminder_email(frequency: weekly, max: 3)

   IF stage = "SCREENING" AND days_in_stage > 14
     THEN escalate_to_manager()

   IF gate1_decision = "NO_GO"
     THEN move_to_declined() AND send_decline_email()

   IF gate2_decision = "GO" AND nda_status != "SIGNED"
     THEN create_nda_task() AND assign_to_legal()

   IF dd_completion >= 100%
     THEN notify_negotiation_team() AND schedule_term_sheet_meeting()

   IF contract_signed = true
     THEN create_project_team() AND initiate_kickoff()

5. INTEGRATION POINTS
   ─────────────────────────────────────────────────────────────────────
   System Integrations Needed:
     □ Email (Gmail/Outlook API)
     □ Calendar (Google Calendar/Outlook)
     □ Document Storage (Box/Dropbox/SharePoint)
     □ E-signature (DocuSign/Adobe Sign)
     □ CRM (if external)
     □ Accounting/ERP (for invoicing)
     □ Video Conferencing (Zoom/Teams for meeting notes)

6. HUMAN-IN-THE-LOOP DECISIONS
   ─────────────────────────────────────────────────────────────────────
   Always Require Human Approval:
     □ Gate decisions (Go/No-Go)
     □ Deal valuation
     □ Contract terms
     □ Partner selection
     □ Major milestone payments
     □ Strategic pivots

   AI Can Suggest, Human Decides:
     □ Lead prioritization
     □ Meeting scheduling
     □ Email responses
     □ Task assignments
     □ Follow-up timing

   Fully Automated (No Human):
     □ Data extraction from forms
     □ Score calculation
     □ Status updates
     □ Reminder emails
     □ Report generation


================================================================================
                           DOCUMENT END
================================================================================

NEXT STEPS FOR HEKABIO TEAM:
───────────────────────────────────────────────────────────────────────────
1. Review this requirements document against Phase 1 implementation
2. Identify gaps between requirements and current features
3. Remove any unnecessary routes/buttons not aligned with workflow
4. Prioritize missing features for Phase 2
5. Validate workflow with business stakeholders
6. Update implementation roadmap

NOTES:
───────────────────────────────────────────────────────────────────────────
- Business team feedback: "Like overall feel"
- Focus: Phase 1 alignment only
- Action: Clean up any inconsistencies from multi-session development
- Verify: All routes and buttons serve documented requirements

================================================================================
Document compiled: January 5, 2026
Source: Client requirements gathering session
Status: For technical review and gap analysis
================================================================================
