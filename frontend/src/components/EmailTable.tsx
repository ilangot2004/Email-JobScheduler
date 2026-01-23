import React from 'react';
import { ScheduledEmail, SentEmail } from '../api/email';

interface EmailTableProps {
  emails: ScheduledEmail[] | SentEmail[];
  type: 'scheduled' | 'sent';
  onRefresh: () => void;
  onEmailClick: (email: ScheduledEmail | SentEmail) => void;
}

const EmailTable: React.FC<EmailTableProps> = ({
  emails,
  type,
  onRefresh,
  onEmailClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[date.getDay()];
    const h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${day} ${hour}:${m}:${s} ${ampm}`;
  };

  const getPreviewText = (email: ScheduledEmail | SentEmail) => {
    if (!email.body) return '';
    const text = email.body.replace(/<[^>]*>/g, '').trim();
    return text.length > 120 ? text.slice(0, 120) + '…' : text;
  };

  if (emails.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-lg">
        <p className="text-sm text-gray-500 mb-3">No emails found</p>
        <button
          onClick={onRefresh}
          className="text-green-600 text-sm font-medium"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white divide-y divide-gray-100">
      {emails.map((email) => {
        const sentEmail = email as SentEmail;

        return (
          <div
            key={email.id}
            onClick={() => onEmailClick(email)}
            className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
          >
            {/* GRID LAYOUT */}
            <div className="grid grid-cols-[120px_180px_300px_1fr_40px] gap-3 items-center">

              {/* TO */}
              <div className="text-sm font-medium text-gray-900 truncate text-left">
                To: {email.recipientEmail.split('@')[0]}
              </div>

              {/* TIME / STATUS (FIXED SPACE ALWAYS) - CENTERED */}
              <div className="text-xs flex justify-center">
                {type === 'scheduled' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                    {formatDate((email as ScheduledEmail).scheduledTime)}
                  </span>
                )}

                {type === 'sent' && (
                  sentEmail.status === 'FAILED' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                      Failed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      Send
                    </span>
                  )
                )}
              </div>

              {/* SUBJECT */}
              <div className="text-sm font-medium text-gray-900 truncate text-left">
                {email.subject}
              </div>

              {/* PREVIEW */}
              <div className="text-sm text-gray-500 truncate text-left">
                {getPreviewText(email)}
              </div>

              {/* STAR */}
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1 hover:bg-gray-100 rounded flex justify-end ml-auto"
              >
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 9.101c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EmailTable;
