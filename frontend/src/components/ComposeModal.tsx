import React, { useState } from 'react';
import { emailAPI, EmailScheduleRequest } from '../api/email';
import Button from './ui/Button';
import Textarea from './ui/Textarea';

interface ComposeModalProps {
  onClose: () => void;
  onSuccess: () => void;
  userEmail: string;
}

const ComposeModal: React.FC<ComposeModalProps> = ({ onClose, onSuccess, userEmail }) => {
  const [formData, setFormData] = useState<EmailScheduleRequest>({
    subject: '',
    body: '',
    recipients: [],
    startTime: '',
    delayBetweenEmailsSeconds: 60,
    hourlyLimit: 100,
  });
  const [recipientsText, setRecipientsText] = useState('');
  const [recipientTags, setRecipientTags] = useState<string[]>([]);
  const [showSendLater, setShowSendLater] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{ success: boolean; message: string; count: number } | null>(null);

  // Parse recipients from text input
  const parseRecipients = (text: string) => {
    const emails = text
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    // Remove duplicates using Array.from for compatibility
    return Array.from(new Set(emails));
  };

  // Parse CSV/TXT file content
  const parseFileContent = (text: string, fileName: string): string[] => {
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length === 0) return [];

    // Detect if it's a CSV file (by extension or content)
    const isCSV = fileName.toLowerCase().endsWith('.csv');
    
    // Try to detect delimiter
    const firstLine = lines[0];
    let delimiter = ',';
    if (isCSV) {
      // Check for common CSV delimiters
      if (firstLine.includes(';')) delimiter = ';';
      else if (firstLine.includes('\t')) delimiter = '\t';
      else if (firstLine.includes(',')) delimiter = ',';
    }

    const emails: string[] = [];
    
    lines.forEach((line, index) => {
      // Skip header row if it doesn't look like an email
      if (index === 0 && isCSV && !line.includes('@')) {
        return; // Skip header
      }

      // Split by delimiter or whitespace
      const parts = isCSV ? line.split(delimiter) : [line];
      
      parts.forEach(part => {
        const trimmed = part.trim().replace(/^["']|["']$/g, ''); // Remove quotes
        // Check if it's a valid email
        if (trimmed && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
          emails.push(trimmed);
        }
      });
    });

    // Remove duplicates
    return Array.from(new Set(emails));
  };

  // Handle recipient input
  const handleRecipientInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecipientsText(value);

    // Auto-parse when comma or newline is entered
    if (value.includes(',') || value.includes('\n')) {
      const parsed = parseRecipients(value);
      setRecipientTags(parsed);
      setRecipientsText('');
    }
  };

  // Handle recipient key press
  const handleRecipientKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && recipientsText.trim()) {
      const parsed = parseRecipients(recipientsText);
      if (parsed.length > 0) {
        setRecipientTags([...recipientTags, ...parsed]);
        setRecipientsText('');
      }
    }
  };

  // Remove recipient tag
  const removeRecipient = (index: number) => {
    setRecipientTags(recipientTags.filter((_, i) => i !== index));
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Handle CSV/TXT upload for recipients
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type by extension
    const fileName = file.name.toLowerCase();
    const isValidFile = fileName.endsWith('.csv') || fileName.endsWith('.txt');
    
    if (!isValidFile) {
      setUploadStatus({
        success: false,
        message: 'Please upload a CSV or TXT file',
        count: 0
      });
      // Clear the input
      e.target.value = '';
      setTimeout(() => setUploadStatus(null), 3000);
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus({
        success: false,
        message: 'File size must be less than 5MB',
        count: 0
      });
      e.target.value = '';
      setTimeout(() => setUploadStatus(null), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        
        // Parse the file content
        const parsed = parseFileContent(text, file.name);
        
        if (parsed.length === 0) {
          setUploadStatus({
            success: false,
            message: 'No valid email addresses found in the file',
            count: 0
          });
          setTimeout(() => setUploadStatus(null), 3000);
          return;
        }

        // Filter out duplicates with existing recipients
        const newEmails = parsed.filter(email => !recipientTags.includes(email));
        const duplicates = parsed.length - newEmails.length;

        // Add new emails to recipient tags
        setRecipientTags([...recipientTags, ...newEmails]);

        // Show success message
        let message = `Successfully imported ${newEmails.length} email${newEmails.length !== 1 ? 's' : ''}`;
        if (duplicates > 0) {
          message += ` (${duplicates} duplicate${duplicates !== 1 ? 's' : ''} skipped)`;
        }
        
        setUploadStatus({
          success: true,
          message,
          count: newEmails.length
        });

        // Clear status after 3 seconds
        setTimeout(() => setUploadStatus(null), 3000);
      } catch (error) {
        setUploadStatus({
          success: false,
          message: 'Error reading file. Please check the file format.',
          count: 0
        });
        setTimeout(() => setUploadStatus(null), 3000);
      }
    };

    reader.onerror = () => {
      setUploadStatus({
        success: false,
        message: 'Error reading file',
        count: 0
      });
      setTimeout(() => setUploadStatus(null), 3000);
    };

    reader.readAsText(file);
    
    // Clear the input to allow re-uploading the same file
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // Combine existing tags with any remaining text
      const allRecipients = [
        ...recipientTags,
        ...parseRecipients(recipientsText)
      ];

      if (allRecipients.length === 0) {
        throw new Error('Please enter at least one valid email address');
      }

      if (!formData.startTime) {
        throw new Error('Please select a start time');
      }

      const submitData = {
        ...formData,
        recipients: allRecipients,
      };

      const response = await emailAPI.scheduleCampaign(submitData);
      
      // Success - close modal and refresh data
      console.log('Campaign scheduled successfully:', response);
      onSuccess();
      onClose(); // Also explicitly close the modal
    } catch (err: any) {
      console.error('Failed to schedule campaign:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to schedule campaign. Please try again.';
      setError(errorMessage);
      setLoading(false); // Stop loading on error
    }
  };

  const handleInputChange = (field: keyof EmailScheduleRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Format datetime-local value
  const getDateTimeLocalValue = () => {
    if (!formData.startTime) return '';
    const date = new Date(formData.startTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const date = new Date(value);
      handleInputChange('startTime', date.toISOString());
    } else {
      handleInputChange('startTime', '');
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Compose New Email</h1>
        </div>
        <div className="flex items-center space-x-3">
          <label className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative cursor-pointer">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            {attachments.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center">
                {attachments.length}
              </span>
            )}
          </label>
          <button
            onClick={() => setShowSendLater(!showSendLater)}
            className={`p-2 rounded-lg transition-colors ${
              showSendLater ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e as any);
            }}
            disabled={loading}
            className="px-6"
            type="button"
          >
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Scheduling...
              </span>
            ) : (
              'Send Later'
            )}
          </Button>
        </div>
      </header>

      {/* Send Later Popup */}
      {showSendLater && (
        <div className="absolute top-16 right-6 bg-white border border-gray-200 rounded-lg shadow-xl w-80 z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Send Later</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Pick date & time</label>
                <input
                  type="datetime-local"
                  value={getDateTimeLocalValue()}
                  onChange={handleDateTimeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(9, 0, 0, 0);
                    handleInputChange('startTime', tomorrow.toISOString());
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Tomorrow
                </button>
                <button
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(10, 0, 0, 0);
                    handleInputChange('startTime', tomorrow.toISOString());
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Tomorrow, 10:00 AM
                </button>
                <button
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(11, 0, 0, 0);
                    handleInputChange('startTime', tomorrow.toISOString());
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Tomorrow, 11:00 AM
                </button>
                <button
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(15, 0, 0, 0);
                    handleInputChange('startTime', tomorrow.toISOString());
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Tomorrow, 3:00 PM
                </button>
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => setShowSendLater(false)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Cancel
                </button>
                <Button
                  onClick={() => setShowSendLater(false)}
                  size="sm"
                  className="px-4"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-4xl mx-auto px-6 py-4 space-y-4 text-left">
      {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* From Field */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">From</label>
            <div className="relative">
              <input
                type="email"
                value={userEmail}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 pr-8 text-left"
              />
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* To Field */}
          <div className="text-left">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700 text-left">To</label>
              <div className="group relative">
                <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="absolute right-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <p className="font-semibold mb-1">Upload List Format:</p>
                  <p className="mb-1">• CSV: One email per line or comma-separated</p>
                  <p className="mb-1">• TXT: One email per line</p>
                  <p>• Headers are automatically skipped</p>
                </div>
              </div>
            </div>
            <div className="border border-gray-300 rounded-lg px-3 py-2 min-h-[42px] flex flex-wrap items-center gap-2 bg-white focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent">
              {recipientTags.map((email, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => removeRecipient(index)}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={recipientsText}
                onChange={handleRecipientInput}
                onKeyPress={handleRecipientKeyPress}
                placeholder={recipientTags.length === 0 ? "recipient@example.com" : ""}
                className="flex-1 min-w-[200px] outline-none bg-transparent"
              />
              <label className="text-sm text-green-600 hover:text-green-700 font-medium cursor-pointer flex items-center ml-auto whitespace-nowrap">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload List
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleCSVUpload}
                  className="hidden"
                />
              </label>
            </div>
            {/* Upload Status Message */}
            {uploadStatus && (
              <div className={`mt-2 px-3 py-2 rounded-lg text-sm ${
                uploadStatus.success 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <div className="flex items-center">
                  {uploadStatus.success ? (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span>{uploadStatus.message}</span>
                </div>
              </div>
            )}
            {/* Recipient Count */}
            {recipientTags.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                {recipientTags.length} recipient{recipientTags.length !== 1 ? 's' : ''} added
              </div>
            )}
          </div>

          {/* Subject Field */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Subject</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Subject"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-left"
            />
          </div>

          {/* Delay and Hourly Limit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Delay between 2 emails
              </label>
              <input
                type="number"
                min="2"
                max="3600"
                required
                value={formData.delayBetweenEmailsSeconds}
                onChange={(e) => handleInputChange('delayBetweenEmailsSeconds', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-left"
                placeholder="00"
              />
            </div>
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Hourly Limit
              </label>
              <input
                type="number"
                min="1"
                max="500"
                required
                value={formData.hourlyLimit}
                onChange={(e) => handleInputChange('hourlyLimit', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-left"
                placeholder="00"
              />
            </div>
          </div>

          {/* Attachments Display */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Attachments</label>
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Body */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Type Your Reply...</label>
            <Textarea
              required
              rows={12}
              value={formData.body}
              onChange={(e) => handleInputChange('body', e.target.value)}
              placeholder="Type Your Reply..."
              className="resize-none text-left"
            />
            
            {/* Formatting Toolbar */}
            <div className="mt-2 flex items-center space-x-1 p-2 bg-gray-50 rounded-lg border border-gray-200">
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Undo">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Redo">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                </svg>
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Font Size">
                <span className="text-xs">Tt</span>
                <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Bold">
                <span className="font-bold text-sm">B</span>
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Italic">
                <span className="italic text-sm">I</span>
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Underline">
                <span className="underline text-sm">U</span>
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Align Left">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18" />
                </svg>
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Align Center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M6 14h12" />
                </svg>
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Align Right">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M9 14h12" />
                </svg>
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Numbered List">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Bullet List">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13m-13 6h13M3 6h.01M3 12h.01M3 18h.01" />
                </svg>
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Link">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Quote">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Code">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ComposeModal;
