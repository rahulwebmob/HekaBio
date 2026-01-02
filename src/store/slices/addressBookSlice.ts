/**
 * Address Book Slice
 * Redux state management for companies and contacts
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Company, Contact } from '../../types/addressBook.types';
import { mockCompanies } from '../../data/mockCompanies';
import { mockContacts } from '../../data/mockContacts';

interface AddressBookState {
  companies: Company[];
  contacts: Contact[];
  selectedCompanyId: string | null;
  selectedContactId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AddressBookState = {
  companies: mockCompanies,
  contacts: mockContacts,
  selectedCompanyId: null,
  selectedContactId: null,
  isLoading: false,
  error: null,
};

const addressBookSlice = createSlice({
  name: 'addressBook',
  initialState,
  reducers: {
    // Company Actions
    addCompany: (state, action: PayloadAction<Company>) => {
      state.companies.push(action.payload);
    },
    updateCompany: (state, action: PayloadAction<Company>) => {
      const index = state.companies.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.companies[index] = action.payload;
      }
    },
    deleteCompany: (state, action: PayloadAction<string>) => {
      state.companies = state.companies.filter(c => c.id !== action.payload);
      // Also delete related contacts
      state.contacts = state.contacts.filter(c => c.companyId !== action.payload);
    },
    setSelectedCompany: (state, action: PayloadAction<string | null>) => {
      state.selectedCompanyId = action.payload;
    },

    // Contact Actions
    addContact: (state, action: PayloadAction<Contact>) => {
      state.contacts.push(action.payload);
    },
    updateContact: (state, action: PayloadAction<Contact>) => {
      const index = state.contacts.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
      }
    },
    deleteContact: (state, action: PayloadAction<string>) => {
      state.contacts = state.contacts.filter(c => c.id !== action.payload);
    },
    setSelectedContact: (state, action: PayloadAction<string | null>) => {
      state.selectedContactId = action.payload;
    },

    // Utility Actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addCompany,
  updateCompany,
  deleteCompany,
  setSelectedCompany,
  addContact,
  updateContact,
  deleteContact,
  setSelectedContact,
  setLoading,
  setError,
} = addressBookSlice.actions;

export default addressBookSlice.reducer;
