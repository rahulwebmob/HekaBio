/**
 * Address Book Page
 * Unified view of Companies and Contacts
 */

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconBuilding, IconUser, IconDownload, IconUpload } from '@tabler/icons-react';
import { AppLayout } from '../components/layout';
import { Button } from '../components/ui';
import CompaniesTab from '../components/features/addressBook/CompaniesTab';
import ContactsTab from '../components/features/addressBook/ContactsTab';

type TabType = 'companies' | 'contacts';

export default function AddressBookPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('companies');

  // Get tab from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab') as TabType;
    if (tab === 'contacts' || tab === 'companies') {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Update URL when tab changes
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    navigate(`/address-book?tab=${tab}`, { replace: true });
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export', activeTab);
  };

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log('Import', activeTab);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Address Book</h1>
            <p className="text-gray-600 mt-1">
              Manage your company and contact relationships
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              leftIcon={<IconDownload size={18} />}
              onClick={handleExport}
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              leftIcon={<IconUpload size={18} />}
              onClick={handleImport}
            >
              Import CSV
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('companies')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === 'companies'
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <IconBuilding size={20} />
                <span>Companies</span>
              </div>
            </button>
            <button
              onClick={() => handleTabChange('contacts')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === 'contacts'
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <IconUser size={20} />
                <span>Contacts</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'companies' && <CompaniesTab />}
          {activeTab === 'contacts' && <ContactsTab />}
        </div>
      </div>
    </AppLayout>
  );
}
