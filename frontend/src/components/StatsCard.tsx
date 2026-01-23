import React from 'react';
import { CampaignStats } from '../api/email';

interface StatsCardProps {
  campaign: CampaignStats;
}

const StatsCard: React.FC<StatsCardProps> = ({ campaign }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      scheduled: 'bg-yellow-100 text-yellow-800',
      running: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const progressPercentage = campaign.totalJobs > 0
    ? Math.round(((campaign.sent + campaign.failed) / campaign.totalJobs) * 100)
    : 0;

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {campaign.subject}
            </p>
            <p className="text-sm text-gray-500">
              Created {formatDate(campaign.createdAt)}
            </p>
          </div>
          <div className="flex-shrink-0">
            {getStatusBadge(campaign.status)}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">{campaign.totalJobs}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600">{campaign.sent}</div>
            <div className="text-xs text-gray-500">Sent</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-medium text-yellow-600">{campaign.scheduled}</div>
            <div className="text-xs text-gray-500">Scheduled</div>
          </div>
          <div>
            <div className="text-lg font-medium text-red-600">{campaign.failed}</div>
            <div className="text-xs text-gray-500">Failed</div>
          </div>
          <div>
            <div className="text-lg font-medium text-orange-600">{campaign.retrying}</div>
            <div className="text-xs text-gray-500">Retrying</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;