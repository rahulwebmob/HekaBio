# HekaBio Platform

> Enterprise BioPharma Partnership Management System

A comprehensive platform for managing biotech/pharma partnerships from initial survey submission through due diligence to contract execution.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The application will be available at `http://localhost:5173`

## 📋 Default Login Credentials

```
Email: admin@hekabio.com
Password: admin123
```

**Available Roles:**
- Super Admin
- BD Manager
- CRM Owner
- Data Analyst
- Product Owner

## ✨ Key Features

### 🔬 **Project Management**
- Complete project lifecycle tracking
- Advanced filtering (stage, score, tags, Japan interest)
- Stage workflow visualization
- 30+ mock projects with realistic data

### 🎯 **Multi-Gate Vetting Process**
- **Gate 1**: Data Gathering assessment
- **Gate 2**: 1-on-1 Meeting evaluation
- **Gate 3**: Senior strategic decision
- Complete audit trail with history

### 📊 **Lead Scoring Engine**
- Automatic score calculation (0-100)
- 6 scoring factors with weights
- Hot/Warm/Cold thresholds

### 🇯🇵 **Japan Market Screening**
- Dedicated screening workspace
- 7 comprehensive sections
- Market fit assessment (HIGH/MEDIUM/LOW)

### 📝 **NDA Management**
- Full lifecycle management (DRAFT → FULLY_SIGNED)
- Multiple NDA types (Mutual, One-Way)
- Signatory tracking with progress indicators

### 🔍 **Due Diligence Workspace**
- Structured DD with customizable sections
- Risk assessment (LOW → CRITICAL)
- Progress monitoring

### 📄 **Contract Management**
- Contract record tracking
- Status management
- Project linkage

### 📧 **Communications & Tasks**
- Email composer
- Task management with priorities
- Calendar with events
- Notifications system

## 🏗️ Technology Stack

- **Frontend**: React 18.3 + TypeScript 5+
- **Build Tool**: Vite 5+
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Tabler Icons

## 📈 Implementation Status

**~70% Complete (Phase 1)**

### ✅ Fully Implemented
- Project management and pipeline
- Multi-gate vetting workflow
- Lead scoring and Japan screening
- NDA management
- DD workspace
- Contract tracking

### ⚠️ Partially Implemented
- Email system
- Task automation
- Notification center

See [FINAL_SUMMARY.md](./FINAL_SUMMARY.md) for detailed status.

## 📝 Key Concepts

### Stage Workflow
1. DATA_GATHERING → 2. SCREENING → 3. ONE_ON_ONE → 4. SENIOR_DECISION → 5. NDA → 6. DUE_DILIGENCE → 7. NEGOTIATION → 8. CONTRACT

### Gate Review Process
- **Gate 1**: Data completeness (≥80% survey completion)
- **Gate 2**: 1-on-1 evaluation (score ≥50)
- **Gate 3**: Strategic decision (score ≥70)

### Scoring Model
Total Score: 0-100 based on 6 factors

## 📚 Documentation

- [FINAL_SUMMARY.md](./FINAL_SUMMARY.md) - Comprehensive summary
- [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) - Detailed status
- [GRANULAR_PHASES.md](./GRANULAR_PHASES.md) - Development plan

---

**Built for HekaBio Partnership Management**
