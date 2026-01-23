import React, { useState, useEffect } from 'react';
import { User } from '../api/auth';
import { emailAPI, ScheduledEmail, SentEmail, EmailDetail } from '../api/email';
import ComposeModal from '../components/ComposeModal';
import EmailTable from '../components/EmailTable';
import EmailDetailView from '../components/EmailDetailView';
import Button from '../components/ui/Button';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'scheduled' | 'sent'>('scheduled');
  const [scheduledEmails, setScheduledEmails] = useState<ScheduledEmail[]>([]);
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [scheduled, sent] = await Promise.all([
        emailAPI.getScheduledEmails(),
        emailAPI.getSentEmails(),
      ]);

      setScheduledEmails(scheduled.emails);
      setSentEmails(sent.emails);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleComposeSuccess = () => {
    setShowComposeModal(false);
    loadData();
  };

  const handleEmailClick = async (email: ScheduledEmail | SentEmail) => {
    try {
      const detail = await emailAPI.getEmailDetail(email.id);
      setSelectedEmail(detail);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load email details');
    }
  };

  const handleBackToList = () => {
    setSelectedEmail(null);
  };

  // Handle tab switch - if viewing an email, try to find it in the new tab
  const handleTabSwitch = async (newTab: 'scheduled' | 'sent') => {
    if (selectedEmail) {
      // Try to find the same email in the new tab
      let foundEmail: ScheduledEmail | SentEmail | undefined;
      
      if (newTab === 'scheduled') {
        foundEmail = scheduledEmails.find((e: ScheduledEmail) => e.id === selectedEmail.id);
      } else {
        foundEmail = sentEmails.find((e: SentEmail) => e.id === selectedEmail.id);
      }
      
      if (foundEmail) {
        // Email exists in new tab, load its details
        try {
          const detail = await emailAPI.getEmailDetail(foundEmail.id);
          setSelectedEmail(detail);
        } catch (err: any) {
          // If not found, just clear selection
          setSelectedEmail(null);
        }
      } else {
        // Email doesn't exist in new tab, clear selection
        setSelectedEmail(null);
      }
    }
    setActiveTab(newTab);
  };

  // Filter emails based on search query
  const filteredScheduled = scheduledEmails.filter(email =>
    email.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSent = sentEmails.filter(email =>
    email.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="text-2xl font-bold text-gray-900"> Job Scheduler</div>
        </div>

       {/* User Profile */}
<div className="p-6 border-b border-gray-200">
  <div className="flex items-start space-x-3 mb-4">
    {user.avatarUrl ? (
      <img
        src={user.avatarUrl}
        className="w-10 h-10 rounded-full"
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
        <span className="text-gray-600 font-medium">
          {(user.name || user.email)[0].toUpperCase()}
        </span>
      </div>
    )}

    <div className="flex-1 min-w-0">
      {/* NAME — LEFT ALIGNED */}
      <p className="text-sm font-medium text-gray-900 truncate text-left">
        {user.name || 'User'}
      </p>

      {/* EMAIL */}
      <div className="flex items-start">
        <p className="text-xs text-gray-500 truncate text-left">
          {user.email}
        </p>
        <svg
          className="w-4 h-4 text-gray-400 ml-1 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
</div>


        {/* Compose Button */}
        <div className="p-6">
          <Button
            onClick={() => setShowComposeModal(true)}
            className="w-full"
            variant="primary"
          >
            Compose
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            CORE
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleTabSwitch('scheduled')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'scheduled'
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Scheduled
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'scheduled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {scheduledEmails.length}
              </span>
            </button>
            <button
              onClick={() => handleTabSwitch('sent')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'sent'
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Sent
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'sent' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {sentEmails.length}
              </span>
            </button>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-gray-200">
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full"
            size="sm"
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3 ml-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <button
                onClick={loadData}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        {selectedEmail ? (
          <EmailDetailView
            email={selectedEmail}
            type={activeTab}
            onBack={handleBackToList}
          />
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <>
                {activeTab === 'scheduled' && (
                  <EmailTable
                    emails={filteredScheduled}
                    type="scheduled"
                    onRefresh={loadData}
                    onEmailClick={handleEmailClick}
                  />
                )}
                {activeTab === 'sent' && (
                  <EmailTable
                    emails={filteredSent}
                    type="sent"
                    onRefresh={loadData}
                    onEmailClick={handleEmailClick}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Compose Modal */}
      {showComposeModal && (
        <ComposeModal
          onClose={() => setShowComposeModal(false)}
          onSuccess={handleComposeSuccess}
          userEmail={user.email}
        />
      )}
    </div>
  );
};

export default Dashboard;
