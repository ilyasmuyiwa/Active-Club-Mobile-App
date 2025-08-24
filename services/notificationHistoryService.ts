export interface NotificationItem {
  id: number;
  title: string;
  body: string;
  type: 'points_earned' | 'level_up' | 'partner_offer' | 'general';
  points?: number;
  store?: string;
  status: 'sent' | 'failed';
  created_at: string;
  is_read: boolean;
}

export interface NotificationHistoryResponse {
  success: boolean;
  notifications: NotificationItem[];
  total: number;
}

export const notificationHistoryService = {
  async getHistory(mobile: string, limit: number = 20): Promise<NotificationHistoryResponse> {
    try {
      // Ensure phone number has + prefix
      const formattedMobile = mobile.startsWith('+') ? mobile : `+${mobile}`;
      
      const response = await fetch(
        `https://sportscorner.qa/rest/V1/push-notification/history?mobile=${encodeURIComponent(formattedMobile)}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching notification history:', error);
      throw error;
    }
  },

  async markAsRead(notificationId: number, mobile: string): Promise<boolean> {
    try {
      // Ensure phone number has + prefix
      const formattedMobile = mobile.startsWith('+') ? mobile : `+${mobile}`;
      
      const response = await fetch(
        `https://sportscorner.qa/rest/V1/push-notification/read/${notificationId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mobile: formattedMobile }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },
};