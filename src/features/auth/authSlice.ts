/**
 * Authentication Slice
 * Handles user authentication state with mock data
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, UserRole, LoginCredentials } from '../../types/auth.types';

// Mock Users Database
export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'admin@hekabio.com',
    firstName: 'Admin',
    lastName: 'User',
    fullName: 'Admin User',
    role: 'super_admin' as UserRole,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    organization: 'HekaBio',
    department: 'Administration',
  },
  {
    id: 'user-2',
    email: 'crm@hekabio.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    fullName: 'Sarah Johnson',
    role: 'crm_owner' as UserRole,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    organization: 'HekaBio',
    department: 'CRM & Operations',
  },
  {
    id: 'user-3',
    email: 'gate1@hekabio.com',
    firstName: 'Michael',
    lastName: 'Chen',
    fullName: 'Michael Chen',
    role: 'gate_1_analyst' as UserRole,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    organization: 'HekaBio',
    department: 'Business Development',
  },
  {
    id: 'user-4',
    email: 'gate2@hekabio.com',
    firstName: 'Emily',
    lastName: 'Tanaka',
    fullName: 'Emily Tanaka',
    role: 'gate_2_analyst' as UserRole,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    organization: 'HekaBio',
    department: 'Strategic Partnerships',
  },
  {
    id: 'user-5',
    email: 'gate3@hekabio.com',
    firstName: 'David',
    lastName: 'Williams',
    fullName: 'David Williams',
    role: 'gate_3_decision_maker' as UserRole,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    organization: 'HekaBio',
    department: 'Executive',
  },
  {
    id: 'user-6',
    email: 'dd.scientific@hekabio.com',
    firstName: 'Dr. Lisa',
    lastName: 'Kumar',
    fullName: 'Dr. Lisa Kumar',
    role: 'dd_specialist_scientific' as UserRole,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    organization: 'HekaBio',
    department: 'Scientific Affairs',
  },
  {
    id: 'user-7',
    email: 'dd.regulatory@hekabio.com',
    firstName: 'James',
    lastName: 'Martinez',
    fullName: 'James Martinez',
    role: 'dd_specialist_regulatory' as UserRole,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    organization: 'HekaBio',
    department: 'Regulatory Affairs',
  },
  {
    id: 'user-8',
    email: 'product.owner@innovatemed.com',
    firstName: 'Jennifer',
    lastName: 'Lee',
    fullName: 'Jennifer Lee',
    role: 'product_owner' as UserRole,
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    organization: 'InnovateMed Technologies',
    department: 'Product Development',
  },
  {
    id: 'user-9',
    email: 'hospital@tokyo-medical.jp',
    firstName: 'Dr. Yuki',
    lastName: 'Nakamura',
    fullName: 'Dr. Yuki Nakamura',
    role: 'hospital_staff' as UserRole,
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    organization: 'Tokyo Medical Center',
    department: 'Procurement',
  },
  {
    id: 'user-10',
    email: 'distributor@medlogistics.jp',
    firstName: 'Kenji',
    lastName: 'Sato',
    fullName: 'Kenji Sato',
    role: 'distributor_staff' as UserRole,
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    organization: 'MedLogistics Japan',
    department: 'Operations',
  },
  {
    id: 'user-11',
    email: 'hekabio.ops@hekabio.com',
    firstName: 'Anna',
    lastName: 'Yamamoto',
    fullName: 'Anna Yamamoto',
    role: 'license_holder_staff' as UserRole,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    organization: 'HekaBio',
    department: 'Operations & Logistics',
  },
  {
    id: 'user-12',
    email: 'manufacturer@globalmed.com',
    firstName: 'Robert',
    lastName: 'Anderson',
    fullName: 'Robert Anderson',
    role: 'manufacturing_staff' as UserRole,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    organization: 'GlobalMed Manufacturing',
    department: 'Production',
  },
];

// Initial State
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Find user by email
      const user = MOCK_USERS.find((u) => u.email === credentials.email);

      if (!user) {
        return rejectWithValue('Invalid email or password');
      }

      // In a real app, verify password hash
      // For mock, accept any password for demo purposes
      if (credentials.password.length < 3) {
        return rejectWithValue('Invalid email or password');
      }

      // Generate mock token
      const token = `mock-jwt-token-${user.id}-${Date.now()}`;

      // Update last login
      const updatedUser: User = {
        ...user,
        lastLoginAt: new Date().toISOString(),
      };

      return { user: updatedUser, token };
    } catch (error) {
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));
  // Clear any session storage
  localStorage.removeItem('hekabio_token');
  localStorage.removeItem('hekabio_user');
  return;
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Manual login (for quick demo role switching)
    loginAsRole: (state, action: PayloadAction<UserRole>) => {
      const user = MOCK_USERS.find((u) => u.role === action.payload);
      if (user) {
        state.user = user;
        state.token = `mock-token-${user.id}`;
        state.isAuthenticated = true;
        state.error = null;
      }
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Restore session from localStorage
    restoreSession: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        // Persist to localStorage
        localStorage.setItem('hekabio_token', action.payload.token);
        localStorage.setItem('hekabio_user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { loginAsRole, clearError, restoreSession } = authSlice.actions;
export default authSlice.reducer;
