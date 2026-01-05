# localStorage CRUD Implementation Guide

This guide explains how to use the new localStorage-based CRUD system for all entities in Phase 1.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface (React)                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ├─ Dispatches Actions
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Redux Store + Slices                      │
│  (State Management - Synchronous Updates)                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ├─ LocalStorage Middleware (Auto-save)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│               CRUD Service Layer (New)                      │
│  - BaseCRUDService (Generic operations)                    │
│  - CompanyService, ContactService, etc.                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ├─ Reads/Writes
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              LocalStorage Service (New)                     │
│  - Error handling                                           │
│  - Versioning                                               │
│  - Data validation                                          │
└─────────────────────────────────────────────────────────────┘
                      │
                      ▼
              Browser localStorage
```

## Core Services

### 1. LocalStorage Service

Location: `src/services/localStorage.service.ts`

**Features:**
- Namespaced keys (`hekabio_*`)
- Version management
- Error handling
- Import/Export functionality
- Storage size monitoring

**Usage:**
```typescript
import { localStorageService } from '@/services';

// Save data
localStorageService.save(
  { key: 'companies', version: 1 },
  companiesArray
);

// Load data
const companies = localStorageService.load(
  { key: 'companies', version: 1 },
  [] // default value
);

// Remove data
localStorageService.remove('companies');

// Clear all app data
localStorageService.clearAll();
```

### 2. Base CRUD Service

Location: `src/services/baseCRUD.service.ts`

**Features:**
- Generic CRUD operations
- Automatic ID generation
- Timestamp management
- Bulk operations
- Search/filter helpers
- Import/Export

**Base Entity Interface:**
```typescript
interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}
```

## Creating a New CRUD Service

### Step 1: Define Your Entity Type

```typescript
// src/types/company.types.ts
import { BaseEntity } from '@/services';

export interface Company extends BaseEntity {
  name: string;
  nameLocal?: string;
  role: string;
  category: string;
  website?: string;
  phone?: string;
  email?: string;
  // ... other fields
}
```

### Step 2: Create the Service

```typescript
// src/services/company.service.ts
import { BaseCRUDService, StorageConfig } from './baseCRUD.service';
import { Company } from '@/types/company.types';

class CompanyService extends BaseCRUDService<Company> {
  protected storageConfig: StorageConfig = {
    key: 'companies',
    version: 1,
  };

  protected entityName = 'Company';

  // Add custom methods if needed
  searchByName(query: string): Company[] {
    return this.search((company) =>
      company.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  getByRole(role: string): Company[] {
    return this.search((company) => company.role === role);
  }
}

export const companyService = new CompanyService();
```

### Step 3: Update Redux Slice

```typescript
// src/store/slices/addressBookSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { companyService } from '@/services/company.service';
import { Company } from '@/types/company.types';

interface AddressBookState {
  companies: Company[];
  selectedCompanyId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AddressBookState = {
  companies: companyService.getAll(), // Load from localStorage
  selectedCompanyId: null,
  isLoading: false,
  error: null,
};

const addressBookSlice = createSlice({
  name: 'addressBook',
  initialState,
  reducers: {
    // Create
    addCompany: (state, action: PayloadAction<Omit<Company, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newCompany = companyService.create(action.payload);
      state.companies.push(newCompany);
    },

    // Update
    updateCompany: (state, action: PayloadAction<{ id: string; updates: Partial<Company> }>) => {
      const updated = companyService.update(action.payload.id, action.payload.updates);
      if (updated) {
        const index = state.companies.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = updated;
        }
      }
    },

    // Delete
    deleteCompany: (state, action: PayloadAction<string>) => {
      const success = companyService.delete(action.payload);
      if (success) {
        state.companies = state.companies.filter((c) => c.id !== action.payload);
      }
    },

    // Load from storage (on app init)
    loadCompanies: (state) => {
      state.companies = companyService.getAll();
    },

    // Select
    selectCompany: (state, action: PayloadAction<string | null>) => {
      state.selectedCompanyId = action.payload;
    },
  },
});

export const {
  addCompany,
  updateCompany,
  deleteCompany,
  loadCompanies,
  selectCompany,
} = addressBookSlice.actions;

export default addressBookSlice.reducer;
```

### Step 4: Use in Components

```typescript
// src/pages/CompaniesPage.tsx
import { useAppDispatch, useAppSelector } from '@/app/store';
import { addCompany, updateCompany, deleteCompany } from '@/store/slices/addressBookSlice';

function CompaniesPage() {
  const dispatch = useAppDispatch();
  const companies = useAppSelector((state) => state.addressBook.companies);

  const handleCreate = (data: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch(addCompany(data));
  };

  const handleUpdate = (id: string, updates: Partial<Company>) => {
    dispatch(updateCompany({ id, updates }));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteCompany(id));
  };

  // ... component JSX
}
```

## Migration Strategy

### Phase 1: One Entity at a Time

For each entity (Companies, Contacts, Projects, etc.):

1. **Create the service**
   - Extend `BaseCRUDService`
   - Define storage config
   - Add custom methods if needed

2. **Update the Redux slice**
   - Load initial state from service
   - Update actions to use service methods
   - Keep state in sync

3. **Test thoroughly**
   - Create, read, update, delete operations
   - Verify localStorage persistence
   - Test edge cases

4. **Remove mock data**
   - Delete mock data file
   - Remove import from slice

### Phase 2: Cleanup

After all entities are migrated:

1. Delete all files in `src/data/mock*.ts`
2. Remove unused imports
3. Verify all features work correctly
4. Document any breaking changes

## Available CRUD Operations

All services extending `BaseCRUDService` have these methods:

```typescript
// Read
getAll(): T[]
getById(id: string): T | undefined
search(predicate: (item: T) => boolean): T[]
findOne(predicate: (item: T) => boolean): T | undefined
getByIds(ids: string[]): T[]
count(): number
exists(id: string): boolean

// Create
create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T
bulkCreate(items: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]): T[]

// Update
update(id: string, updates: Partial<T>): T | undefined

// Delete
delete(id: string): boolean
bulkDelete(ids: string[]): number
clear(): void

// Utility
seed(data: T[]): void
export(): T[]
import(data: T[], merge?: boolean): void
```

## Best Practices

1. **Always use services for data operations**
   - Don't manipulate localStorage directly
   - Let the service handle IDs, timestamps, and persistence

2. **Keep Redux state in sync**
   - Update both service and Redux state
   - Service is source of truth

3. **Handle errors gracefully**
   - Services log errors to console
   - Check return values (undefined, false) for failures

4. **Use TypeScript**
   - Define proper entity interfaces
   - Extend BaseEntity
   - Type all service methods

5. **Test with real data**
   - Use seed() method for development
   - Test import/export for backups

## Troubleshooting

### Data not persisting?
- Check browser console for localStorage errors
- Verify storage quota not exceeded
- Check if localStorage is available (localStorageService.isAvailable())

### Version mismatch warnings?
- Update version number in StorageConfig
- Old data will be cleared automatically
- Use migration logic if needed

### Performance issues?
- Use search() instead of loading all items
- Implement pagination
- Consider indexing for large datasets

## Next Steps

1. Start with **Address Book** (Companies + Contacts)
2. Then **Projects**
3. Then **Surveys**
4. Continue with remaining entities

Each migration should be tested thoroughly before moving to the next.
