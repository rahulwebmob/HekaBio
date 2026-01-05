/**
 * Address Book Slice
 * Redux state management for companies and contacts
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Company, Contact } from '../../types/addressBook.types';
import { companyService } from '../../services/company.service';
import { contactService } from '../../services/contact.service';

interface AddressBookState {
  companies: Company[];
  contacts: Contact[];
  selectedCompanyId: string | null;
  selectedContactId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AddressBookState = {
  companies: companyService.getAll(),
  contacts: contactService.getAll(),
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
    addCompany: (
      state,
      action: PayloadAction<Omit<Company, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      const newCompany = companyService.create(action.payload);
      state.companies.push(newCompany);
    },

    updateCompany: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Company> }>
    ) => {
      const updated = companyService.update(action.payload.id, action.payload.updates);
      if (updated) {
        const index = state.companies.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = updated;
        }
      }
    },

    deleteCompany: (state, action: PayloadAction<string>) => {
      const success = companyService.delete(action.payload);
      if (success) {
        state.companies = state.companies.filter((c) => c.id !== action.payload);
        // Also delete related contacts
        const deletedCount = contactService.deleteByCompanyId(action.payload);
        if (deletedCount > 0) {
          state.contacts = contactService.getAll();
        }
      }
    },

    setSelectedCompany: (state, action: PayloadAction<string | null>) => {
      state.selectedCompanyId = action.payload;
    },

    // Contact Actions
    addContact: (
      state,
      action: PayloadAction<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      const newContact = contactService.create(action.payload);
      state.contacts.push(newContact);
    },

    updateContact: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Contact> }>
    ) => {
      const updated = contactService.update(action.payload.id, action.payload.updates);
      if (updated) {
        const index = state.contacts.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = updated;
        }
      }
    },

    deleteContact: (state, action: PayloadAction<string>) => {
      const success = contactService.delete(action.payload);
      if (success) {
        state.contacts = state.contacts.filter((c) => c.id !== action.payload);
      }
    },

    setSelectedContact: (state, action: PayloadAction<string | null>) => {
      state.selectedContactId = action.payload;
    },

    setPrimaryContact: (
      state,
      action: PayloadAction<{ contactId: string; companyId: string }>
    ) => {
      const updated = contactService.setPrimaryContact(
        action.payload.contactId,
        action.payload.companyId
      );
      if (updated) {
        // Reload all contacts to reflect primary contact changes
        state.contacts = contactService.getAll();
      }
    },

    // Load from storage (useful for refreshing state)
    loadCompanies: (state) => {
      state.companies = companyService.getAll();
    },

    loadContacts: (state) => {
      state.contacts = contactService.getAll();
    },

    // Utility Actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Clear all data (for testing/reset)
    clearAll: (state) => {
      companyService.clear();
      contactService.clear();
      state.companies = [];
      state.contacts = [];
      state.selectedCompanyId = null;
      state.selectedContactId = null;
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
  setPrimaryContact,
  loadCompanies,
  loadContacts,
  setLoading,
  setError,
  clearAll,
} = addressBookSlice.actions;

export default addressBookSlice.reducer;
