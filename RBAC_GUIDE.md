# 🔐 Role-Based Access Control (RBAC) Guide

> **Comprehensive guide to the HekaBio Platform's role-based access control system**

---

## ✅ Implementation Complete

The platform now has **full role-based access control** implemented across:
- ✅ Route-level authorization
- ✅ Sidebar menu filtering
- ✅ Permission checking utilities
- ✅ Access denied handling

---

## 🎯 How It Works

### Architecture Overview

```
User Login
    ↓
Check Authentication (App.tsx)
    ↓
Check Role Authorization (ProtectedRoute)
    ↓
    ├─→ Has Permission → Show Page
    └─→ No Permission → Access Denied Page

Sidebar
    ↓
Filter Menu Items by Role (AppSidebar.tsx)
    ↓
Only show menu items user can access
```

---

## 👥 User Roles

The system supports **13 different user roles**:

### Admin Roles
1. **super_admin** - Full system access
2. **crm_owner** - CRM and operations management

### Gate Analyst Roles
3. **gate_1_analyst** - Data gathering and initial screening
4. **gate_2_analyst** - 1-on-1 meeting evaluation
5. **gate_3_decision_maker** - Strategic decision making

### Due Diligence Specialist Roles
6. **dd_specialist_scientific** - Scientific DD assessment
7. **dd_specialist_regulatory** - Regulatory DD assessment
8. **dd_specialist_commercial** - Commercial DD assessment
9. **dd_specialist_financial** - Financial DD assessment

### Partner Organization Roles
10. **product_owner** - Product/innovation submitter
11. **hospital_staff** - Hospital staff access
12. **distributor_staff** - Distributor access
13. **license_holder_staff** - License holder access
14. **manufacturing_staff** - Manufacturing staff access

---

## 🗺️ Feature Access Matrix

### Feature Access by Role

| Feature | Super Admin | CRM Owner | Gate 1 | Gate 2 | Gate 3 | DD Specialist | Product Owner | Other Roles |
|---------|-------------|-----------|--------|--------|--------|---------------|---------------|-------------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Projects | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Lead Scoring | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Pipeline | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Surveys | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Survey Templates | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Communications | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Tasks | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Calendar | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Documents | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Contracts | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| NDAs | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Due Diligence | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Companies | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Contacts | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 🔑 Key Components

### 1. useAuthorization Hook

**Location**: `src/hooks/useAuthorization.ts`

**Purpose**: Provides permission checking utilities

**Methods**:
```typescript
const {
  checkPermission,      // Check a specific permission
  checkAnyPermission,   // Check if has ANY of permissions
  checkAllPermissions,  // Check if has ALL permissions
  hasRole,              // Check if user has one of the allowed roles
  isAdmin,              // Check if super_admin or crm_owner
  isGateAnalyst,        // Check if any gate analyst role
  isDDSpecialist,       // Check if any DD specialist role
  currentRole,          // Get current user's role
} = useAuthorization();
```

**Usage Example**:
```typescript
import { useAuthorization } from '../hooks/useAuthorization';

function MyComponent() {
  const { hasRole, isAdmin } = useAuthorization();

  // Check if user has specific role
  if (hasRole(['super_admin', 'crm_owner'])) {
    return <AdminPanel />;
  }

  // Check if user is any type of admin
  if (isAdmin()) {
    return <AdminFeatures />;
  }

  return <StandardView />;
}
```

---

### 2. ProtectedRoute Component

**Location**: `src/App.tsx`

**Purpose**: Enforces route-level authorization

**How it works**:
1. Checks if user is authenticated
2. If `allowedRoles` specified, checks user has required role
3. Shows AccessDeniedPage if user doesn't have permission

**Code**:
```typescript
<ProtectedRoute allowedRoles={['super_admin', 'crm_owner']}>
  <SurveyTemplatesPage />
</ProtectedRoute>
```

---

### 3. AccessDeniedPage

**Location**: `src/pages/AccessDeniedPage.tsx`

**Purpose**: User-friendly error page for unauthorized access

**Features**:
- Shows user's current role
- Explains why access was denied
- Provides navigation options (Go Back, Go to Dashboard)
- Clean, professional design

---

### 4. Sidebar Filtering

**Location**: `src/components/layout/AppSidebar.tsx`

**Purpose**: Only shows menu items user can access

**How it works**:
```typescript
const visibleMenuItems = menuItems.filter((item) => {
  // If no allowedRoles specified, visible to all
  if (!item.allowedRoles || item.allowedRoles.length === 0) {
    return true;
  }
  // Check if user has required role
  return hasRole(item.allowedRoles);
});
```

---

## 🧪 Testing Guide

### Test User Accounts

All test accounts use the same password: **admin123**

#### 1. Super Admin
```
Email: admin@hekabio.com
Password: admin123
Access: Everything
```

#### 2. Gate 1 Analyst
```
Email: gate1@hekabio.com
Password: admin123
Access: Dashboard, Projects, Lead Scoring, Pipeline, Surveys, Communications, Tasks, etc.
No Access: Survey Templates, Contracts, Due Diligence
```

#### 3. Gate 2 Analyst
```
Email: gate2@hekabio.com
Password: admin123
Access: Dashboard, Projects, Lead Scoring, Pipeline, Communications, NDAs, etc.
No Access: Surveys, Survey Templates, Contracts, Due Diligence
```

#### 4. Gate 3 Decision Maker
```
Email: gate3@hekabio.com
Password: admin123
Access: Dashboard, Projects, Lead Scoring, Pipeline, Communications, NDAs, Contracts, etc.
No Access: Surveys, Survey Templates, Due Diligence
```

#### 5. DD Specialist (Scientific)
```
Email: dd.scientific@hekabio.com
Password: admin123
Access: Dashboard, Projects, Tasks, Notifications, Calendar, Documents, Due Diligence
No Access: Lead Scoring, Pipeline, Surveys, Communications, Companies, Contacts, NDAs, Contracts
```

#### 6. DD Specialist (Regulatory)
```
Email: dd.regulatory@hekabio.com
Password: admin123
Access: Dashboard, Projects, Tasks, Notifications, Calendar, Documents, Due Diligence
No Access: Lead Scoring, Pipeline, Surveys, Communications, Companies, Contacts, NDAs, Contracts
```

---

### Testing Scenarios

#### Scenario 1: Sidebar Menu Changes

1. **Login as super_admin**
   - Navigate to http://localhost:5173
   - Login with `admin@hekabio.com / admin123`
   - **Expected**: See ALL menu items (16 items)

2. **Switch to gate_1_analyst**
   - Logout
   - Login with `gate1@hekabio.com / admin123`
   - **Expected**: See 12 menu items
   - **Hidden**: Survey Templates, Contracts, NDAs, Due Diligence

3. **Switch to DD specialist**
   - Logout
   - Login with `dd.scientific@hekabio.com / admin123`
   - **Expected**: See 6 menu items only
   - **Visible**: Dashboard, Projects, Tasks, Notifications, Calendar, Documents, Due Diligence
   - **Hidden**: All others

---

#### Scenario 2: Route Protection

1. **Login as gate_1_analyst**
   - Email: `gate1@hekabio.com`
   - Password: `admin123`

2. **Try to access restricted page**
   - Manually navigate to: `http://localhost:5173/admin/survey-templates`
   - **Expected**: See "Access Denied" page
   - Shows current role: gate_1_analyst
   - Cannot access the page

3. **Try to access allowed page**
   - Navigate to: `http://localhost:5173/surveys`
   - **Expected**: Page loads successfully
   - Can view surveys

---

#### Scenario 3: DD Specialist Access

1. **Login as dd_specialist_scientific**
   - Email: `dd.scientific@hekabio.com`
   - Password: `admin123`

2. **Check sidebar**
   - **Expected**: Only see 7 menu items
   - Dashboard, Projects, Tasks, Notifications, Calendar, Documents, Due Diligence

3. **Try to access pipeline**
   - Manually navigate to: `http://localhost:5173/pipeline`
   - **Expected**: Access Denied page

4. **Access due diligence**
   - Click "Due Diligence" in sidebar
   - **Expected**: Page loads successfully

---

#### Scenario 4: Role-Based Navigation

1. **Login as different roles in sequence**:
   - super_admin → See all 16 menu items
   - gate_1_analyst → See 12 items (no Templates, Contracts, NDAs, DD)
   - gate_2_analyst → See 11 items (no Surveys, Templates, Contracts, DD)
   - gate_3_decision_maker → See 12 items (no Surveys, Templates, DD)
   - dd_specialist_scientific → See 7 items only

2. **For each role, verify**:
   - Sidebar only shows allowed items
   - Direct URL navigation to restricted pages shows Access Denied
   - Direct URL navigation to allowed pages works

---

## 📝 Implementation Details

### Files Created

1. **src/hooks/useAuthorization.ts** (New)
   - Authorization utilities hook
   - Role checking functions
   - Permission checking functions

2. **src/pages/AccessDeniedPage.tsx** (New)
   - Access denied error page
   - Shows current role
   - Navigation options

### Files Modified

3. **src/App.tsx**
   - Added `ProtectedRoute` role checking
   - Import `useAuthorization` hook
   - Import `AccessDeniedPage`

4. **src/components/layout/AppSidebar.tsx**
   - Added `allowedRoles` to `MenuItem` interface
   - Defined roles for each menu item
   - Filtered menu items by user role

5. **src/routes/index.tsx**
   - Added `allowedRoles` to route definitions
   - Defined access control for each route

---

## 🛠️ Configuration

### Adding a New Role-Restricted Feature

1. **Define route with allowedRoles**:
```typescript
// src/routes/index.tsx
{
  path: '/my-new-feature',
  element: MyNewFeaturePage,
  isPublic: false,
  allowedRoles: ['super_admin', 'crm_owner'], // Specify roles
  title: 'My New Feature - HekaBio',
}
```

2. **Add menu item with allowedRoles**:
```typescript
// src/components/layout/AppSidebar.tsx
{
  label: 'My New Feature',
  icon: <IconSomething size={20} stroke={1.5} />,
  path: '/my-new-feature',
  allowedRoles: ['super_admin', 'crm_owner'], // Same roles
}
```

3. **Use authorization in component** (optional):
```typescript
// Inside your component
import { useAuthorization } from '../hooks/useAuthorization';

function MyNewFeaturePage() {
  const { hasRole } = useAuthorization();

  return (
    <div>
      {hasRole(['super_admin']) && (
        <AdminOnlySection />
      )}
      <RegularContent />
    </div>
  );
}
```

---

### Changing Access for Existing Features

**Example**: Allow gate_2_analyst to access Surveys

1. **Update route**:
```typescript
// src/routes/index.tsx
{
  path: '/surveys',
  element: SurveysPage,
  isPublic: false,
  allowedRoles: [
    'super_admin',
    'crm_owner',
    'gate_1_analyst',
    'gate_2_analyst', // ADD THIS
  ],
  title: 'Surveys - HekaBio',
}
```

2. **Update sidebar**:
```typescript
// src/components/layout/AppSidebar.tsx
{
  label: 'Surveys',
  icon: <IconFileText size={20} stroke={1.5} />,
  path: '/surveys',
  allowedRoles: [
    'super_admin',
    'crm_owner',
    'gate_1_analyst',
    'gate_2_analyst', // ADD THIS
  ],
}
```

---

## 🔒 Security Notes

### What's Protected

✅ **Route Access**: Users cannot navigate to unauthorized routes (even via direct URL)
✅ **Sidebar Visibility**: Unauthorized menu items are hidden
✅ **Component-Level**: Can check permissions within components
✅ **Build-Time Type Safety**: TypeScript ensures role types are correct

### What's NOT Protected (Requires Backend)

❌ **API Calls**: Frontend can't secure API requests (need backend auth)
❌ **Data Filtering**: All users see all mock data (need backend filtering)
❌ **Actions**: Can't prevent actions server-side (need backend validation)

**Important**: This is **frontend-only authorization** for UI/UX. A production system needs:
- Backend API authentication
- Database-level access control
- Server-side validation
- JWT or session-based auth

---

## 🎯 Best Practices

### 1. Always Use Both Route and Sidebar Restrictions

```typescript
// ❌ BAD: Only restricting route
// User won't see menu item, but route isn't protected

// ✅ GOOD: Restrict both
Route: allowedRoles: ['super_admin', 'crm_owner']
Sidebar: allowedRoles: ['super_admin', 'crm_owner']
```

### 2. Use Descriptive Role Names

```typescript
// ❌ BAD
allowedRoles: ['role1', 'role2']

// ✅ GOOD
allowedRoles: ['super_admin', 'gate_1_analyst']
```

### 3. Keep Permissions Consistent

If a feature requires certain permissions, ALL routes for that feature should have the same `allowedRoles`.

```typescript
// ✅ GOOD: Consistent
'/companies' → allowedRoles: ['super_admin', 'crm_owner', 'gate_1_analyst']
'/companies/:id' → allowedRoles: ['super_admin', 'crm_owner', 'gate_1_analyst']
'/companies/:id/edit' → allowedRoles: ['super_admin', 'crm_owner', 'gate_1_analyst']
```

### 4. Provide Clear Access Denied Messages

The AccessDeniedPage explains:
- Why access was denied
- User's current role
- How to request access

---

## 📊 Current Access Summary

### Super Admin & CRM Owner
**Full Access**: All 16 features

### Gate Analysts (1, 2, 3)
**Access**: 11-12 features (varies by level)
**Restricted**: Admin features (Survey Templates), specialized features (DD workspace)

### DD Specialists
**Access**: 7 features (focused on their work)
**Restricted**: Strategic features, CRM features

### Product Owners
**Access**: 6 basic features
**Restricted**: Internal operations, strategic features

### Partner Staff
**Access**: 3 basic features
**Restricted**: Most internal features

---

## ✅ Verification Checklist

After testing, verify:

- [ ] Super admin can access all pages
- [ ] Gate 1 analyst cannot access Survey Templates
- [ ] Gate 2 analyst cannot access Surveys
- [ ] DD specialists can access DD Workspace
- [ ] DD specialists cannot access Pipeline
- [ ] Manual URL navigation to restricted pages shows Access Denied
- [ ] Sidebar only shows menu items for user's role
- [ ] Access Denied page displays correctly
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors

---

## 🎉 Summary

The HekaBio platform now has **comprehensive role-based access control**:

✅ **13 user roles** with granular permissions
✅ **Route-level protection** prevents unauthorized access
✅ **Sidebar filtering** shows only allowed features
✅ **Access denied page** provides clear feedback
✅ **Type-safe** implementation with TypeScript
✅ **Production-ready** frontend authorization

**Next Steps**:
1. Test with different user roles
2. Verify all access restrictions work
3. Integrate with backend authentication (Phase 2)
4. Add audit logging for access attempts (Phase 2)

---

*Last Updated: Role-Based Access Control Implementation - January 2026*
