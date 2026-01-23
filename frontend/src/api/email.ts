import api from './client';

export interface EmailScheduleRequest {
  subject: string;
  body: string;
  recipients: string[];
  startTime: string;
  delayBetweenEmailsSeconds: number;
  hourlyLimit: number;
}

export interface CampaignResponse {
  campaign: {
    id: string;
    subject: string;
    recipientCount: number;
    startTime: string;
    status: string;
  };
  message: string;
}

export interface ScheduledEmail {
  id: string;
  recipientEmail: string;
  subject: string;
  body?: string;
  scheduledTime: string;
  status: string;
}

export interface SentEmail {
  id: string;
  recipientEmail: string;
  subject: string;
  body?: string;
  sentTime: string | null;
  status: string;
  error: string | null;
}

export interface EmailDetail extends ScheduledEmail, SentEmail {
  body: string;
}

export interface CampaignStats {
  id: string;
  subject: string;
  status: string;
  totalJobs: number;
  scheduled: number;
  sent: number;
  failed: number;
  retrying: number;
  createdAt: string;
}

export const emailAPI = {
  // Schedule a new email campaign
  scheduleCampaign: async (data: EmailScheduleRequest): Promise<CampaignResponse> => {
    const response = await api.post('/api/emails/schedule', data);
    return response.data;
  },

  // Get scheduled emails
  getScheduledEmails: async (): Promise<{ emails: ScheduledEmail[] }> => {
    const response = await api.get('/api/emails/scheduled');
    return response.data;
  },

  // Get sent/failed emails
  getSentEmails: async (): Promise<{ emails: SentEmail[] }> => {
    const response = await api.get('/api/emails/sent');
    return response.data;
  },

  // Get campaign statistics
  getCampaignStats: async (): Promise<{ campaigns: CampaignStats[] }> => {
    const response = await api.get('/api/emails/stats');
    return response.data;
  },

  // Get single email detail
  getEmailDetail: async (id: string): Promise<EmailDetail> => {
    const response = await api.get(`/api/emails/${id}`);
    return response.data;
  },
};