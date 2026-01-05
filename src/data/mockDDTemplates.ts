/**
 * Mock DD Templates
 * Pre-built due diligence checklist templates for different industry categories
 */

import type { DDTemplate } from '../types/dd.types';

/**
 * Comprehensive Biotech DD Template
 * 60+ checklist items across all DD sections
 */
export const BIOTECH_DD_TEMPLATE: DDTemplate = {
  id: 'template-biotech-001',
  name: 'Comprehensive Biotech Due Diligence',
  description:
    'Complete due diligence template for biotechnology companies with focus on preclinical and clinical development',
  category: 'BIOTECH',
  isActive: true,
  usageCount: 0,
  createdAt: new Date().toISOString(),
  createdBy: 'system',
  sections: [
    {
      name: 'Technology & R&D Assessment',
      type: 'TECHNOLOGY',
      description: 'Evaluation of scientific foundation, technology platform, and research capabilities',
      items: [
        {
          question: 'Mechanism of Action (MOA) - Is the MOA clearly defined and scientifically validated?',
          description:
            'Assess the biological mechanism, target engagement, and scientific rationale',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['MOA Summary', 'Scientific Publications', 'Target Validation Data'],
        },
        {
          question:
            'Preclinical Data Quality - Are preclinical studies well-designed with appropriate controls?',
          description: 'Review study design, endpoints, statistical power, and reproducibility',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Preclinical Study Reports', 'Animal Model Data', 'PK/PD Studies'],
        },
        {
          question:
            'Target Validation - Is the therapeutic target validated in human disease?',
          description: 'Evidence of target involvement in disease pathology and druggability',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Target Validation Studies', 'Biomarker Data', 'Genetic Evidence'],
        },
        {
          question:
            'Technology Platform - Is the underlying technology platform robust and scalable?',
          description: 'Assess platform capabilities, limitations, and competitive advantages',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Platform Description', 'Technology Validation', 'Scalability Studies'],
        },
        {
          question:
            'Manufacturing Process - Is the manufacturing process defined and GMP-compliant?',
          description: 'Review manufacturing readiness, scale-up potential, and quality control',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Manufacturing SOP', 'CMC Documentation', 'Quality Control Data'],
        },
        {
          question:
            'Formulation Development - Is the drug formulation optimized for clinical use?',
          description: 'Assess formulation stability, delivery method, and patient acceptability',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Formulation Studies', 'Stability Data', 'Delivery Method Analysis'],
        },
        {
          question:
            'Analytical Methods - Are analytical methods validated and suitable for clinical development?',
          description: 'Review assay validation, bioanalytical methods, and quality specifications',
          priority: 'MEDIUM',
          reviewRequired: true,
          requiredDocuments: ['Analytical Method Validation', 'Bioanalytical Reports'],
        },
        {
          question:
            'Research Facilities - Are research facilities adequate and compliant with regulations?',
          description: 'Assess lab infrastructure, equipment, and regulatory compliance',
          priority: 'LOW',
          reviewRequired: false,
        },
      ],
    },
    {
      name: 'Intellectual Property Assessment',
      type: 'IP',
      description: 'Review of patent portfolio, freedom to operate, and IP strategy',
      items: [
        {
          question:
            'Patent Portfolio Strength - Does the company have strong, defensible patent protection?',
          description:
            'Assess patent claims, claim scope, and likelihood of patent grant/validity',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Patent Applications', 'Patent Prosecution History', 'Patent Landscape'],
        },
        {
          question:
            'Patent Expiration Timeline - When do key patents expire and what is the data exclusivity period?',
          description: 'Review patent life, exclusivity periods, and generic competition timeline',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Patent Expiration Analysis', 'Regulatory Exclusivity Assessment'],
        },
        {
          question:
            'Freedom to Operate (FTO) - Has FTO analysis been conducted and are there blocking patents?',
          description: 'Assess third-party patent risks and potential infringement issues',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['FTO Analysis', 'Third-Party Patent Search', 'Legal Opinion'],
        },
        {
          question:
            'Patent Prosecution Status - Are patent applications being actively prosecuted?',
          description: 'Review prosecution strategy, office actions, and examiner responses',
          priority: 'MEDIUM',
          reviewRequired: true,
          requiredDocuments: ['Prosecution Updates', 'Office Actions', 'Examiner Responses'],
        },
        {
          question:
            'Trade Secrets & Know-How - Are trade secrets properly protected and documented?',
          description: 'Assess protection measures, confidentiality agreements, and documentation',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Trade Secret Policy', 'NDAs', 'Know-How Documentation'],
        },
        {
          question:
            'IP Ownership - Does the company have clear ownership of all IP?',
          description: 'Verify IP assignments, employee agreements, and third-party rights',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['IP Assignment Agreements', 'Employee Contracts', 'License Agreements'],
        },
        {
          question:
            'Third-Party Licenses - Are there any in-licensed technologies and what are the terms?',
          description: 'Review license agreements, payment obligations, and restrictions',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['License Agreements', 'Technology Transfer Agreements'],
        },
      ],
    },
    {
      name: 'Regulatory & Clinical Development',
      type: 'REGULATORY',
      description: 'Assessment of regulatory strategy, clinical development plan, and approval pathway',
      items: [
        {
          question:
            'Regulatory Strategy - Is there a clear regulatory pathway and has it been discussed with authorities?',
          description: 'Review regulatory plan, authority interactions, and approval strategy',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: [
            'Regulatory Strategy Document',
            'FDA/EMA Meeting Minutes',
            'Regulatory Guidance',
          ],
        },
        {
          question:
            'IND/CTA Status - Has an IND/CTA been filed and accepted by regulatory authorities?',
          description: 'Verify regulatory submissions, authority responses, and clinical hold status',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['IND/CTA Submission', 'Authority Response Letters', 'Clinical Hold Letters'],
        },
        {
          question:
            'Clinical Development Plan - Is the clinical development plan scientifically sound and feasible?',
          description: 'Assess trial design, endpoints, patient population, and development timeline',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Clinical Development Plan', 'Protocol Synopsis', 'Study Design Rationale'],
        },
        {
          question:
            'Clinical Trial Results - Are Phase I/II trial results positive and support further development?',
          description: 'Review efficacy, safety, pharmacokinetics, and proof-of-concept data',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Clinical Study Reports', 'Efficacy Data', 'Safety Database'],
        },
        {
          question:
            'Safety Profile - Is the safety profile acceptable for the indication and patient population?',
          description: 'Assess adverse events, dose-limiting toxicities, and risk-benefit profile',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Safety Database', 'SAE Reports', 'DSMB Minutes'],
        },
        {
          question:
            'Orphan Drug Designation - Has orphan drug designation been obtained or is it applicable?',
          description: 'Review orphan drug status, benefits, and exclusivity implications',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Orphan Drug Application', 'Designation Letter'],
        },
        {
          question:
            'Fast Track/Breakthrough Designation - Are there opportunities for expedited regulatory pathways?',
          description: 'Assess eligibility for fast track, breakthrough, or priority review',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Designation Applications', 'FDA Guidance Documents'],
        },
        {
          question:
            'Regulatory Compliance - Are clinical trials conducted in compliance with GCP/ICH guidelines?',
          description: 'Review compliance history, inspection findings, and corrective actions',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Audit Reports', 'Inspection Reports', 'CAPA Documents'],
        },
      ],
    },
    {
      name: 'Market & Commercial Assessment',
      type: 'MARKET',
      description: 'Evaluation of market opportunity, competitive landscape, and commercialization strategy',
      items: [
        {
          question:
            'Market Size & Growth - What is the addressable market size and growth potential?',
          description: 'Assess total addressable market, patient population, and market trends',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Market Analysis', 'Epidemiology Reports', 'Market Research'],
        },
        {
          question:
            'Unmet Medical Need - Is there significant unmet medical need in the target indication?',
          description: 'Evaluate current standard of care limitations and patient needs',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Unmet Need Analysis', 'KOL Interviews', 'Patient Surveys'],
        },
        {
          question:
            'Competitive Landscape - Who are the key competitors and what is the competitive positioning?',
          description: 'Assess competing products, clinical programs, and market dynamics',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Competitive Analysis', 'Competitor Pipeline Review', 'Product Comparison'],
        },
        {
          question:
            'Differentiation Strategy - What are the key differentiators versus existing/pipeline products?',
          description: 'Identify competitive advantages, unique selling propositions, and positioning',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Product Positioning', 'Differentiation Analysis', 'Value Proposition'],
        },
        {
          question:
            'Pricing & Reimbursement - What is the expected pricing and reimbursement landscape?',
          description: 'Assess pricing strategy, payer landscape, and reimbursement potential',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Pricing Analysis', 'Payer Research', 'Health Economics Models'],
        },
        {
          question:
            'Key Opinion Leaders (KOLs) - Has the company engaged with key opinion leaders?',
          description: 'Review KOL relationships, advisory boards, and scientific support',
          priority: 'MEDIUM',
          reviewRequired: false,
        },
      ],
    },
    {
      name: 'Team & Management Assessment',
      type: 'TEAM',
      description: 'Evaluation of leadership team, scientific advisors, and organizational capabilities',
      items: [
        {
          question:
            'Management Team Experience - Does the team have relevant drug development experience?',
          description: 'Assess executive track record, therapeutic area expertise, and leadership capabilities',
          priority: 'HIGH',
          reviewRequired: true,
        },
        {
          question:
            'Scientific Advisory Board - Is there a strong scientific advisory board?',
          description: 'Review SAB composition, expertise, and level of engagement',
          priority: 'MEDIUM',
          reviewRequired: false,
        },
        {
          question:
            'Organizational Structure - Is the organization structured appropriately for current stage?',
          description: 'Assess organizational design, reporting lines, and resource allocation',
          priority: 'LOW',
          reviewRequired: false,
        },
        {
          question:
            'Key Person Risk - Are there key person dependencies and succession plans?',
          description: 'Identify critical personnel and assess retention/succession strategies',
          priority: 'MEDIUM',
          reviewRequired: false,
        },
      ],
    },
    {
      name: 'Financial Assessment',
      type: 'FINANCIAL',
      description: 'Review of financial health, funding runway, and capital requirements',
      items: [
        {
          question:
            'Cash Runway - What is the current cash position and runway to key milestones?',
          description: 'Assess cash reserves, burn rate, and funding requirements',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Financial Statements', 'Cash Flow Projections', 'Burn Rate Analysis'],
        },
        {
          question:
            'Capital Requirements - What are the capital requirements to reach next inflection point?',
          description: 'Review funding needs for clinical trials, manufacturing, and operations',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Budget Projections', 'Development Costs', 'Funding Plan'],
        },
        {
          question:
            'Financial Controls - Are financial controls and reporting adequate?',
          description: 'Assess accounting practices, internal controls, and financial reporting',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Audit Reports', 'Financial Controls Documentation'],
        },
        {
          question:
            'Previous Funding History - What is the company funding history and valuation trend?',
          description: 'Review previous fundraising rounds, investors, and valuation progression',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Cap Table', 'Previous Funding Documents', 'Investor List'],
        },
      ],
    },
    {
      name: 'Legal Assessment',
      type: 'LEGAL',
      description: 'Review of legal structure, contracts, and compliance',
      items: [
        {
          question:
            'Corporate Structure - Is the corporate structure clean and appropriate?',
          description: 'Review incorporation documents, subsidiaries, and ownership structure',
          priority: 'MEDIUM',
          reviewRequired: true,
          requiredDocuments: ['Articles of Incorporation', 'Bylaws', 'Cap Table'],
        },
        {
          question:
            'Material Contracts - Are all material contracts in place and favorable?',
          description: 'Review key agreements including partnerships, licenses, and service contracts',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Partnership Agreements', 'Service Contracts', 'Material Agreements'],
        },
        {
          question:
            'Litigation & Disputes - Are there any pending or threatened legal disputes?',
          description: 'Assess litigation history, patent disputes, and potential liabilities',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Litigation Summary', 'Legal Opinions', 'Settlement Agreements'],
        },
        {
          question:
            'Compliance History - Is the company compliant with all applicable regulations?',
          description: 'Review regulatory compliance, employment law compliance, and corporate governance',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Compliance Reports', 'Regulatory Filings', 'Corporate Records'],
        },
      ],
    },
    {
      name: 'Operational Assessment',
      type: 'OPERATIONAL',
      description: 'Evaluation of operational capabilities and infrastructure',
      items: [
        {
          question:
            'CRO/CMO Relationships - Are CRO/CMO partners qualified and contracts in place?',
          description: 'Review outsourcing strategy, vendor capabilities, and contract terms',
          priority: 'HIGH',
          reviewRequired: false,
          requiredDocuments: ['CRO/CMO Contracts', 'Vendor Qualifications', 'Quality Agreements'],
        },
        {
          question:
            'Supply Chain - Is the supply chain robust and secured for clinical/commercial needs?',
          description: 'Assess raw material sourcing, manufacturing capacity, and supply reliability',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Supply Chain Map', 'Supplier Agreements', 'Capacity Analysis'],
        },
        {
          question:
            'Quality Systems - Are quality systems appropriate for development stage?',
          description: 'Review QMS, SOPs, and quality culture',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Quality Manual', 'SOPs', 'Audit Reports'],
        },
      ],
    },
    {
      name: 'Commercial Strategy',
      type: 'COMMERCIAL',
      description: 'Assessment of commercialization plans and go-to-market strategy',
      items: [
        {
          question:
            'Commercialization Strategy - Is there a clear plan for product commercialization?',
          description: 'Review go-to-market strategy, sales channels, and market access plans',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Commercial Strategy', 'Launch Plan', 'Market Access Strategy'],
        },
        {
          question:
            'Partnership Strategy - Is the partnership/licensing strategy clearly defined?',
          description: 'Assess plans for geographic expansion, co-development, or out-licensing',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Partnership Strategy', 'Target Partner Profiles'],
        },
        {
          question:
            'Market Access Strategy - How will the product gain market access and reimbursement?',
          description: 'Review payer engagement strategy, health economics, and access plans',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Market Access Plan', 'Health Economics Analysis', 'Payer Strategy'],
        },
      ],
    },
  ],
};

/**
 * Comprehensive Pharma DD Template
 * Focus on late-stage clinical development and commercial readiness
 */
export const PHARMA_DD_TEMPLATE: DDTemplate = {
  id: 'template-pharma-001',
  name: 'Comprehensive Pharma Due Diligence',
  description:
    'Complete due diligence template for pharmaceutical companies with focus on late-stage development and commercialization',
  category: 'PHARMA',
  isActive: true,
  usageCount: 0,
  createdAt: new Date().toISOString(),
  createdBy: 'system',
  sections: [
    {
      name: 'Clinical Development & Data',
      type: 'TECHNOLOGY',
      description: 'Assessment of clinical trial data and development programs',
      items: [
        {
          question:
            'Phase III Trial Design - Are pivotal trials designed to support regulatory approval?',
          description: 'Review primary/secondary endpoints, statistical power, and trial conduct',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Protocol', 'Statistical Analysis Plan', 'Study Design Rationale'],
        },
        {
          question:
            'Efficacy Data Quality - Do Phase III results demonstrate clinically meaningful benefit?',
          description: 'Assess primary endpoint achievement, effect size, and clinical significance',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Clinical Study Report', 'Efficacy Analysis', 'Subgroup Analysis'],
        },
        {
          question:
            'Safety Database Size - Is the safety database adequate for NDA/MAA submission?',
          description: 'Review patient exposure numbers, duration of exposure, and safety follow-up',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Integrated Safety Summary', 'Safety Database', 'Exposure Analysis'],
        },
        {
          question:
            'Long-term Safety - Are there long-term safety extension studies?',
          description: 'Assess long-term safety profile, durability of response, and chronic use safety',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Extension Study Reports', 'Long-term Safety Data', 'Durability Analysis'],
        },
        {
          question:
            'Drug-Drug Interactions - Have drug-drug interaction studies been completed?',
          description: 'Review DDI potential, metabolic pathways, and concomitant medication risks',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['DDI Study Reports', 'Metabolic Pathway Analysis', 'CYP Interaction Data'],
        },
        {
          question:
            'Special Populations - Have studies in special populations been conducted?',
          description: 'Assess studies in pediatrics, geriatrics, renal/hepatic impairment',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Special Population Studies', 'Dosing Recommendations'],
        },
      ],
    },
    {
      name: 'Regulatory Approval Readiness',
      type: 'REGULATORY',
      description: 'Assessment of regulatory submission readiness and approval strategy',
      items: [
        {
          question:
            'NDA/MAA Readiness - Are all modules ready for regulatory submission?',
          description: 'Review CTD/eCTD modules, data completeness, and submission timeline',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['CTD Modules', 'Submission Plan', 'Module Completion Status'],
        },
        {
          question:
            'Labeling Strategy - Has product labeling been drafted and aligned with authorities?',
          description: 'Review proposed label, indication wording, and warnings/precautions',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Draft Label', 'Labeling Discussions', 'Indication Statement'],
        },
        {
          question:
            'REMS/Risk Management - Are risk management plans adequate and acceptable?',
          description: 'Assess REMS requirements, pharmacovigilance plans, and risk minimization',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Risk Management Plan', 'REMS Proposal', 'Pharmacovigilance Plan'],
        },
        {
          question:
            'Post-Marketing Commitments - What are expected post-marketing study requirements?',
          description: 'Review PMR/PMC expectations, pediatric study plans, and long-term follow-up',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['PMC Plan', 'Pediatric Study Plan', 'Post-Approval Commitments'],
        },
        {
          question:
            'Approval Timeline - What is the realistic timeline to approval in major markets?',
          description: 'Assess submission timing, review timelines, and potential approval dates',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Regulatory Timeline', 'Submission Schedule', 'Approval Projections'],
        },
      ],
    },
    {
      name: 'Manufacturing & Supply',
      type: 'OPERATIONAL',
      description: 'Commercial manufacturing readiness and supply chain assessment',
      items: [
        {
          question:
            'Commercial Manufacturing - Is commercial manufacturing validated and at scale?',
          description: 'Assess manufacturing capacity, process validation, and scale-up readiness',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Manufacturing Validation', 'Process Description', 'Capacity Analysis'],
        },
        {
          question:
            'Supply Chain Robustness - Is the supply chain secured for commercial launch?',
          description: 'Review API sourcing, manufacturing sites, and supply contingencies',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Supply Chain Map', 'Supplier Agreements', 'Risk Mitigation Plan'],
        },
        {
          question:
            'Commercial Packaging - Is commercial packaging designed and validated?',
          description: 'Assess packaging design, labeling, and patient-friendly features',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Packaging Design', 'Stability Studies', 'Validation Reports'],
        },
        {
          question:
            'Distribution & Cold Chain - Are distribution and cold chain requirements defined?',
          description: 'Review storage requirements, distribution network, and cold chain capability',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Distribution Plan', 'Cold Chain Validation', 'Storage Guidelines'],
        },
      ],
    },
    {
      name: 'Market Access & Reimbursement',
      type: 'COMMERCIAL',
      description: 'Assessment of market access strategy and payer value proposition',
      items: [
        {
          question:
            'Value Proposition - Is the value proposition compelling for payers and providers?',
          description: 'Review clinical value, economic value, and unmet need addressed',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Value Dossier', 'HTA Submissions', 'Budget Impact Models'],
        },
        {
          question:
            'Health Economics - Are health economics and outcomes research studies completed?',
          description: 'Assess cost-effectiveness, budget impact, and HEOR evidence',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['HEOR Studies', 'Cost-Effectiveness Analysis', 'RWE Plans'],
        },
        {
          question:
            'Pricing Strategy - Is the pricing strategy justified and defensible?',
          description: 'Review pricing rationale, comparator pricing, and willingness-to-pay',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Pricing Analysis', 'Pricing Strategy', 'Value-Based Pricing'],
        },
        {
          question:
            'Payer Engagement - Has payer engagement been initiated?',
          description: 'Review payer advisory boards, early dialogue, and formulary strategy',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Payer Advisory Board Minutes', 'Formulary Strategy'],
        },
      ],
    },
    {
      name: 'Commercial Launch Readiness',
      type: 'COMMERCIAL',
      description: 'Evaluation of commercial preparedness for product launch',
      items: [
        {
          question:
            'Launch Plan - Is there a comprehensive commercial launch plan?',
          description: 'Review launch strategy, tactics, timeline, and resource requirements',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Launch Plan', 'Marketing Strategy', 'Launch Timeline'],
        },
        {
          question:
            'Sales Force Readiness - Is the sales force sized and trained appropriately?',
          description: 'Assess field force structure, territories, and training programs',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Sales Force Plan', 'Training Materials', 'Territory Design'],
        },
        {
          question:
            'Marketing Materials - Are promotional materials developed and approved?',
          description: 'Review promotional strategy, materials, and regulatory approval status',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Promotional Materials', 'MLR Approvals', 'Marketing Plan'],
        },
        {
          question:
            'Launch Forecasts - Are launch forecasts realistic and defensible?',
          description: 'Assess sales projections, market share assumptions, and adoption curves',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Sales Forecasts', 'Market Model', 'Adoption Assumptions'],
        },
      ],
    },
    {
      name: 'Competitive Intelligence',
      type: 'MARKET',
      description: 'Analysis of competitive landscape and positioning',
      items: [
        {
          question:
            'Competitive Clinical Data - How do clinical results compare to competitors?',
          description: 'Assess head-to-head data, indirect comparisons, and relative efficacy',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Competitive Benchmarking', 'Indirect Comparison', 'Network Meta-Analysis'],
        },
        {
          question:
            'Pipeline Competition - What competitive products are in late-stage development?',
          description: 'Review competitive pipeline, expected launch timings, and positioning',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Competitive Pipeline Analysis', 'Launch Timeline Comparison'],
        },
        {
          question:
            'Market Share Projections - What market share is realistically achievable?',
          description: 'Assess peak market share, time to peak, and share evolution',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Market Share Model', 'Competitive Scenario Analysis'],
        },
      ],
    },
  ],
};

/**
 * Comprehensive Medtech DD Template
 * Focus on device development, regulatory pathways, and clinical evidence
 */
export const MEDTECH_DD_TEMPLATE: DDTemplate = {
  id: 'template-medtech-001',
  name: 'Comprehensive Medtech Due Diligence',
  description:
    'Complete due diligence template for medical device companies with focus on regulatory clearance and clinical validation',
  category: 'MEDTECH',
  isActive: true,
  usageCount: 0,
  createdAt: new Date().toISOString(),
  createdBy: 'system',
  sections: [
    {
      name: 'Device Technology & Design',
      type: 'TECHNOLOGY',
      description: 'Assessment of device design, functionality, and performance',
      items: [
        {
          question:
            'Device Classification - What is the device FDA/MDR classification and risk level?',
          description: 'Review regulatory classification (Class I/II/III), risk class, and pathway',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Classification Determination', 'Regulatory Strategy', 'Predicate Analysis'],
        },
        {
          question:
            'Intended Use - Is the intended use clearly defined and clinically validated?',
          description: 'Assess indications for use, patient population, and clinical rationale',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Intended Use Statement', 'Indications for Use', 'Clinical Rationale'],
        },
        {
          question:
            'Device Design - Is the device design optimized for clinical performance and usability?',
          description: 'Review design specifications, ergonomics, and user interface',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Design Specifications', 'Usability Studies', 'Human Factors Reports'],
        },
        {
          question:
            'Bench Testing - Has comprehensive bench testing demonstrated device performance?',
          description: 'Assess mechanical testing, durability, biocompatibility, and performance specs',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Bench Test Reports', 'Performance Specifications', 'Test Protocols'],
        },
        {
          question:
            'Sterilization & Packaging - Is sterilization method validated and packaging adequate?',
          description: 'Review sterilization validation, shelf life, and packaging integrity',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Sterilization Validation', 'Package Validation', 'Shelf Life Studies'],
        },
        {
          question:
            'Software Verification & Validation - Is device software validated per IEC 62304?',
          description: 'Assess software development lifecycle, V&V testing, and cybersecurity',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Software V&V Reports', 'Cybersecurity Assessment', 'Software Documentation'],
        },
      ],
    },
    {
      name: 'Clinical Evidence',
      type: 'REGULATORY',
      description: 'Review of clinical data supporting safety and effectiveness',
      items: [
        {
          question:
            'Clinical Study Results - Do clinical studies demonstrate safety and effectiveness?',
          description: 'Review pivotal study results, endpoints, and clinical significance',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Clinical Study Reports', 'Statistical Analysis', 'Clinical Protocol'],
        },
        {
          question:
            'Real-World Evidence - Is there real-world evidence supporting clinical performance?',
          description: 'Assess registry data, post-market studies, and real-world outcomes',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Registry Data', 'Post-Market Studies', 'Real-World Evidence'],
        },
        {
          question:
            'Adverse Events - What is the adverse event profile and how does it compare to alternatives?',
          description: 'Review AE rates, serious AEs, and comparative safety',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Safety Analysis', 'AE Database', 'Comparative Safety Data'],
        },
        {
          question:
            'User Training Requirements - What training is required for safe and effective use?',
          description: 'Assess training needs, certification requirements, and learning curve',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Training Materials', 'Instructions for Use', 'Training Requirements'],
        },
      ],
    },
    {
      name: 'Regulatory Pathway',
      type: 'REGULATORY',
      description: 'Assessment of regulatory strategy and approval pathway',
      items: [
        {
          question:
            '510(k)/PMA Strategy - What is the regulatory pathway and predicate device?',
          description: 'Review 510(k) vs PMA strategy, predicate device, and substantial equivalence',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['510(k)/PMA Strategy', 'Predicate Device Comparison', 'Regulatory Plan'],
        },
        {
          question:
            'Quality System - Is the QMS compliant with ISO 13485 and FDA QSR?',
          description: 'Assess quality system maturity, compliance, and certification status',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['ISO 13485 Certificate', 'Quality Manual', 'QMS Documentation'],
        },
        {
          question:
            'Design Controls - Are design controls implemented per 21 CFR 820.30?',
          description: 'Review design history file, design controls, and V&V documentation',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Design History File', 'Design Controls', 'V&V Documentation'],
        },
        {
          question:
            'EU MDR Compliance - Is the device compliant with EU MDR requirements?',
          description: 'Assess MDR readiness, notified body engagement, and CE marking status',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['MDR Gap Analysis', 'Technical Documentation', 'Notified Body Certification'],
        },
        {
          question:
            'Post-Market Surveillance - Is there a post-market surveillance plan?',
          description: 'Review PMS plan, complaint handling, and vigilance reporting',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['PMS Plan', 'Complaint Procedure', 'Vigilance Reports'],
        },
      ],
    },
    {
      name: 'Manufacturing & Quality',
      type: 'OPERATIONAL',
      description: 'Assessment of manufacturing capabilities and quality systems',
      items: [
        {
          question:
            'Manufacturing Scalability - Can manufacturing scale to meet commercial demand?',
          description: 'Assess production capacity, scalability, and capital requirements',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Manufacturing Plan', 'Capacity Analysis', 'Scale-up Study'],
        },
        {
          question:
            'Supply Chain - Is the supply chain qualified and reliable?',
          description: 'Review component suppliers, critical suppliers, and supply agreements',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Supplier List', 'Supplier Qualifications', 'Supply Agreements'],
        },
        {
          question:
            'Process Validation - Is the manufacturing process validated?',
          description: 'Assess process validation status, IQ/OQ/PQ, and validation protocols',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Process Validation', 'IQ/OQ/PQ Reports', 'Validation Master Plan'],
        },
      ],
    },
    {
      name: 'IP & Freedom to Operate',
      type: 'IP',
      description: 'Review of intellectual property and FTO analysis',
      items: [
        {
          question:
            'Patent Portfolio - Does the company have strong patent protection?',
          description: 'Assess patent coverage, claim scope, and patent strength',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Patent Portfolio', 'Patent Landscape', 'Claim Charts'],
        },
        {
          question:
            'FTO Analysis - Has comprehensive FTO analysis been completed?',
          description: 'Review third-party patents, infringement risk, and mitigation strategies',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['FTO Analysis', 'Patent Search', 'Legal Opinion'],
        },
        {
          question:
            'Design-Around Options - Are there design-around options if FTO issues arise?',
          description: 'Assess flexibility to modify design to avoid infringement',
          priority: 'MEDIUM',
          reviewRequired: false,
        },
      ],
    },
    {
      name: 'Commercial Strategy',
      type: 'COMMERCIAL',
      description: 'Assessment of commercialization strategy and market access',
      items: [
        {
          question:
            'Reimbursement Strategy - Is there a clear reimbursement pathway?',
          description: 'Review coding strategy, payment rates, and payer coverage',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Reimbursement Strategy', 'Coding Analysis', 'Coverage Policy'],
        },
        {
          question:
            'Health Economics - Are there health economics studies supporting value?',
          description: 'Assess cost-effectiveness, budget impact, and economic value',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Health Economics Studies', 'Budget Impact Model', 'Value Proposition'],
        },
        {
          question:
            'Sales Channels - What are the planned sales channels and distribution strategy?',
          description: 'Review direct vs distributor sales, key accounts, and channel strategy',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Distribution Strategy', 'Channel Plan', 'Sales Forecast'],
        },
        {
          question:
            'Key Account Strategy - Are key accounts identified and engaged?',
          description: 'Assess KOL relationships, key accounts, and adoption strategy',
          priority: 'MEDIUM',
          reviewRequired: false,
        },
      ],
    },
  ],
};

/**
 * Diagnostic DD Template
 * Focus on analytical validation, clinical utility, and lab operations
 */
export const DIAGNOSTIC_DD_TEMPLATE: DDTemplate = {
  id: 'template-diagnostic-001',
  name: 'Comprehensive Diagnostic Due Diligence',
  description:
    'Complete due diligence template for diagnostic test companies with focus on analytical/clinical validation and reimbursement',
  category: 'DIAGNOSTIC',
  isActive: true,
  usageCount: 0,
  createdAt: new Date().toISOString(),
  createdBy: 'system',
  sections: [
    {
      name: 'Test Technology & Performance',
      type: 'TECHNOLOGY',
      description: 'Assessment of test methodology and analytical performance',
      items: [
        {
          question:
            'Test Methodology - Is the test methodology scientifically sound and validated?',
          description: 'Review assay principle, technology platform, and scientific basis',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Test Description', 'Scientific Validation', 'Technology Assessment'],
        },
        {
          question:
            'Analytical Validation - Has analytical validation demonstrated adequate performance?',
          description: 'Assess accuracy, precision, sensitivity, specificity, and reproducibility',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: [
            'Analytical Validation Study',
            'Precision Studies',
            'Accuracy Studies',
          ],
        },
        {
          question:
            'Limit of Detection - Is the LOD appropriate for clinical application?',
          description: 'Review LOD/LOQ determination and clinical relevance',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['LOD/LOQ Studies', 'Clinical Relevance Analysis'],
        },
        {
          question:
            'Clinical Validation - Does clinical validation demonstrate clinical validity?',
          description: 'Assess clinical sensitivity, specificity, PPV, NPV in intended use population',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Clinical Validation Study', 'ROC Analysis', 'Clinical Performance'],
        },
        {
          question:
            'Clinical Utility - Is there evidence of clinical utility and impact on patient management?',
          description: 'Review evidence that test impacts clinical decisions and patient outcomes',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Clinical Utility Studies', 'Treatment Algorithm', 'Outcomes Data'],
        },
      ],
    },
    {
      name: 'Regulatory Strategy',
      type: 'REGULATORY',
      description: 'Review of regulatory pathway and compliance',
      items: [
        {
          question:
            'Regulatory Classification - Is the test LDT, IVD, or RUO?',
          description: 'Clarify regulatory status and applicable requirements',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Regulatory Classification', 'Regulatory Strategy'],
        },
        {
          question:
            'CLIA Certification - Is the lab CLIA-certified at appropriate complexity level?',
          description: 'Review CLIA certification, CAP accreditation, and inspection history',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['CLIA Certificate', 'CAP Accreditation', 'Inspection Reports'],
        },
        {
          question:
            'FDA Clearance/Approval - Is FDA clearance or approval required and what is the pathway?',
          description: 'Assess 510(k), PMA, or De Novo pathway if applicable',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['FDA Strategy', 'Predicate Analysis', 'Regulatory Plan'],
        },
      ],
    },
    {
      name: 'Laboratory Operations',
      type: 'OPERATIONAL',
      description: 'Assessment of lab capabilities and operations',
      items: [
        {
          question:
            'Lab Capacity - Does lab capacity support commercial volume projections?',
          description: 'Assess throughput, equipment, and staffing capacity',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Capacity Analysis', 'Volume Projections', 'Throughput Data'],
        },
        {
          question:
            'Quality Management System - Is QMS robust and compliant?',
          description: 'Review quality policies, procedures, and compliance records',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Quality Manual', 'SOPs', 'PT Results', 'Audit Reports'],
        },
        {
          question:
            'Turnaround Time - Is TAT competitive and meeting customer expectations?',
          description: 'Assess specimen processing workflow and TAT performance',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['TAT Analysis', 'Workflow Description', 'Performance Metrics'],
        },
      ],
    },
    {
      name: 'Reimbursement & Market Access',
      type: 'COMMERCIAL',
      description: 'Assessment of reimbursement strategy and coverage',
      items: [
        {
          question:
            'Reimbursement Pathway - Is there a clear path to reimbursement?',
          description: 'Review coding strategy (CPT, PLA), payment rates, and coverage policies',
          priority: 'CRITICAL',
          reviewRequired: true,
          requiredDocuments: ['Reimbursement Strategy', 'CPT Code', 'LCD/NCD Analysis'],
        },
        {
          question:
            'Health Economics - Does health economics support test value?',
          description: 'Assess cost-effectiveness, budget impact, and economic value proposition',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: [
            'Health Economics Studies',
            'Budget Impact Analysis',
            'Value Proposition',
          ],
        },
        {
          question:
            'Payer Coverage - What is the status of payer coverage decisions?',
          description: 'Review coverage policies, prior authorizations, and medical necessity',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Coverage Policies', 'Payer Contracts', 'Medical Necessity Criteria'],
        },
      ],
    },
    {
      name: 'Commercial Strategy',
      type: 'COMMERCIAL',
      description: 'Assessment of go-to-market strategy',
      items: [
        {
          question:
            'Target Market - Is the target market well-defined and accessible?',
          description: 'Review target physicians, specialties, and testing volume projections',
          priority: 'HIGH',
          reviewRequired: true,
          requiredDocuments: ['Market Analysis', 'Target Segmentation', 'Volume Projections'],
        },
        {
          question:
            'Sales Strategy - What is the sales and marketing strategy?',
          description: 'Assess sales channels, marketing approach, and customer acquisition',
          priority: 'MEDIUM',
          reviewRequired: false,
          requiredDocuments: ['Sales Strategy', 'Marketing Plan', 'Customer Acquisition Plan'],
        },
        {
          question:
            'Clinical Guidelines - Is the test referenced in clinical guidelines?',
          description: 'Review guideline inclusion, KOL support, and standard of care positioning',
          priority: 'HIGH',
          reviewRequired: false,
          requiredDocuments: ['Guideline Analysis', 'KOL Support Letters', 'Positioning Strategy'],
        },
      ],
    },
  ],
};

/**
 * General DD Template
 * Simplified template for initial assessments
 */
export const GENERAL_DD_TEMPLATE: DDTemplate = {
  id: 'template-general-001',
  name: 'General Due Diligence',
  description: 'Simplified due diligence template for initial assessments across any healthcare sector',
  category: 'GENERAL',
  isActive: true,
  usageCount: 0,
  createdAt: new Date().toISOString(),
  createdBy: 'system',
  sections: [
    {
      name: 'Technology Overview',
      type: 'TECHNOLOGY',
      description: 'High-level technology assessment',
      items: [
        {
          question: 'Technology Description - Describe the core technology/product',
          description: 'Provide overview of technology, mechanism, and key features',
          priority: 'HIGH',
          reviewRequired: true,
        },
        {
          question: 'Development Stage - What is the current development stage?',
          description: 'Assess development progress, milestones achieved, and next steps',
          priority: 'HIGH',
          reviewRequired: true,
        },
        {
          question: 'Key Data/Results - Summarize key supporting data or study results',
          description: 'Review preclinical, clinical, or performance data',
          priority: 'HIGH',
          reviewRequired: true,
        },
      ],
    },
    {
      name: 'Market Opportunity',
      type: 'MARKET',
      description: 'Market assessment',
      items: [
        {
          question: 'Market Size - What is the target market size and opportunity?',
          description: 'Assess addressable market, patient population, and growth potential',
          priority: 'HIGH',
          reviewRequired: true,
        },
        {
          question: 'Competition - Who are the key competitors?',
          description: 'Identify competitive products and positioning',
          priority: 'MEDIUM',
          reviewRequired: false,
        },
      ],
    },
    {
      name: 'Intellectual Property',
      type: 'IP',
      description: 'IP overview',
      items: [
        {
          question: 'Patent Protection - Describe patent protection status',
          description: 'Review key patents, filing status, and coverage',
          priority: 'HIGH',
          reviewRequired: true,
        },
      ],
    },
    {
      name: 'Team',
      type: 'TEAM',
      description: 'Team assessment',
      items: [
        {
          question: 'Management Team - Assess management team experience',
          description: 'Review executive backgrounds and track records',
          priority: 'MEDIUM',
          reviewRequired: false,
        },
      ],
    },
    {
      name: 'Financials',
      type: 'FINANCIAL',
      description: 'Financial overview',
      items: [
        {
          question: 'Funding Status - What is the current funding status and runway?',
          description: 'Review cash position, burn rate, and funding needs',
          priority: 'HIGH',
          reviewRequired: true,
        },
      ],
    },
  ],
};

// Export all templates as array
export const DD_TEMPLATES: DDTemplate[] = [
  BIOTECH_DD_TEMPLATE,
  PHARMA_DD_TEMPLATE,
  MEDTECH_DD_TEMPLATE,
  DIAGNOSTIC_DD_TEMPLATE,
  GENERAL_DD_TEMPLATE,
];
