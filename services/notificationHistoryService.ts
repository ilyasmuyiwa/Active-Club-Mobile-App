export interface NotificationItem {
  id: number;
  title: string;
  body: string;
  type: 'points_earned' | 'level_up' | 'partner_offer' | 'redemption' | 'general';
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
      const url = `https://sportscorner.qa/rest/V1/push-notification/history?mobile=${encodeURIComponent(mobile)}&limit=${limit}`;
      console.log('🔔 NotificationAPI: Fetching from URL:', url);
      console.log('🔔 NotificationAPI: Mobile number:', mobile);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('🔔 NotificationAPI: Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('🔔 NotificationAPI: Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const responseText = await response.text();
      console.log('🔔 NotificationAPI: Raw response:', responseText);
      
      // Handle malformed response - server returns phone number prefix before JSON
      let cleanResponse = responseText;
      const phonePrefix = `+${mobile.replace('+', '')}`;
      if (responseText.startsWith(phonePrefix)) {
        cleanResponse = responseText.substring(phonePrefix.length);
      }
      
      console.log('🔔 NotificationAPI: Cleaned response:', cleanResponse);
      
      // Parse the cleaned response which should be [success, notifications, total]
      const parsedArray = JSON.parse(cleanResponse);
      
      // Transform to expected format
      const data: NotificationHistoryResponse = {
        success: parsedArray[0] || false,
        notifications: parsedArray[1] || [],
        total: parsedArray[2] || 0
      };
      
      return data;
    } catch (error) {
      console.error('Error fetching notification history:', error);
      throw error;
    }
  },

  async markAsRead(notificationId: number, mobile: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://sportscorner.qa/rest/V1/push-notification/read/${notificationId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mobile }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },
};