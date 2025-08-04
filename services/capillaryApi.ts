// Capillary API Service
const CAPILLARY_API_URL = 'https://eu.api.capillarytech.com/v1.1';
const CAPILLARY_ACCESS_TOKEN = 'dGJnYWRtaW46MTBhY2QxM2RlNmViMmM1NTZjMGM5Y2ViMTA0YTk5ZGM=';

export interface Transaction {
  id: string;
  number: string;
  type: 'REGULAR' | 'RETURN';
  amount: string;
  gross_amount: string;
  billing_time: string;
  store: string;
  store_code: string;
  points: {
    issued: string;
    redeemed: string;
    returned: string;
    expired: string;
  };
}

export interface TransactionResponse {
  response: {
    status: {
      success: string;
      code: number;
      message: string;
    };
    customer: {
      firstname: string;
      lastname: string;
      mobile: string;
      count?: string;
      transactions: {
        transaction: Transaction[];
      };
    };
  };
}

export interface CustomerData {
  id?: string;
  firstname?: string;
  lastname?: string;
  mobile?: string;
  email?: string;
  current_slab?: string;
  loyalty_points?: number;
  lifetime_points?: number;
  lifetime_purchases?: number;
  custom_fields?: {
    field?: Array<{
      name: string;
      value: string;
    }>;
  };
  extended_fields?: {
    field?: Array<{
      name: string;
      value: string;
    }>;
  };
}

export interface CustomerResponse {
  response: {
    status: {
      code: number;
      message?: string;
    };
    customers?: {
      customer: CustomerData[];
    };
  };
}

class CapillaryApiService {
  private baseURL = CAPILLARY_API_URL;
  private authToken = CAPILLARY_ACCESS_TOKEN;

  /**
   * Get customer transactions by mobile number
   */
  async getCustomerTransactionsByMobile(mobile: string): Promise<Transaction[]> {
    try {
      const url = `${this.baseURL}/customer/transactions?mobile=${mobile}&limit=3`;
      console.log('🔵 Making transactions API call to:', url);
      console.log('🔵 With mobile number:', mobile);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${this.authToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🟡 Transactions response status:', response.status);

      if (!response.ok) {
        console.error('🔴 Transactions API request failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('🔴 Transactions error response body:', errorText);
        return [];
      }

      const data: TransactionResponse = await response.json();
      console.log('🟢 Transactions API Response received:', JSON.stringify(data, null, 2));
      
      if (data.response?.status?.code === 200 && data.response?.customer?.transactions?.transaction) {
        console.log('✅ Transactions found successfully!');
        return data.response.customer.transactions.transaction;
      }
      
      console.error('🔴 Unexpected transactions API response:', data);
      return [];
    } catch (error) {
      console.error('🔴 Error fetching customer transactions:', error);
      return [];
    }
  }

  /**
   * Get customer transactions with pagination for Activities Screen
   */
  async getCustomerTransactionsPaginated(
    mobile: string, 
    limit: number = 10, 
    offset: number = 0
  ): Promise<{ transactions: Transaction[]; hasMore: boolean; total: number }> {
    try {
      const url = `${this.baseURL}/customer/transactions?mobile=${mobile}&limit=${limit}&offset=${offset}`;
      console.log('🔵 Making paginated transactions API call to:', url);
      console.log('🔵 With mobile:', mobile, 'limit:', limit, 'offset:', offset);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${this.authToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🟡 Paginated transactions response status:', response.status);

      if (!response.ok) {
        console.error('🔴 Paginated transactions API request failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('🔴 Paginated transactions error response body:', errorText);
        return { transactions: [], hasMore: false, total: 0 };
      }

      const data: TransactionResponse = await response.json();
      console.log('🟢 Paginated transactions API Response received');
      
      if (data.response?.status?.code === 200 && data.response?.customer?.transactions?.transaction) {
        const transactions = data.response.customer.transactions.transaction;
        const total = parseInt(data.response.customer.count as any) || 0;
        const hasMore = (offset + limit) < total;
        
        console.log('✅ Paginated transactions found:', transactions.length, 'hasMore:', hasMore, 'total:', total);
        return { transactions, hasMore, total };
      }
      
      console.error('🔴 Unexpected paginated transactions API response:', data);
      return { transactions: [], hasMore: false, total: 0 };
    } catch (error) {
      console.error('🔴 Error fetching paginated customer transactions:', error);
      return { transactions: [], hasMore: false, total: 0 };
    }
  }

  /**
   * Get customer details by mobile number
   */
  async getCustomerByMobile(mobile: string): Promise<CustomerData | null> {
    try {
      const url = `${this.baseURL}/customer/get?mobile=${mobile}`;
      console.log('🔵 Making API call to:', url);
      console.log('🔵 With mobile number:', mobile);
      console.log('🔵 Authorization token:', this.authToken ? 'Present' : 'Missing');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${this.authToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🟡 Response status:', response.status);
      console.log('🟡 Response ok:', response.ok);
      console.log('🟡 Response headers:', response.headers);

      if (!response.ok) {
        console.error('🔴 API request failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('🔴 Error response body:', errorText);
        return null;
      }

      const data: CustomerResponse = await response.json();
      console.log('🟢 API Response received:', JSON.stringify(data, null, 2));
      
      // Check if the response is successful
      if (data.response?.status?.code === 200 && data.response?.customers?.customer?.length > 0) {
        console.log('✅ Customer found successfully!');
        console.log('✅ Customer data:', data.response.customers.customer[0]);
        return data.response.customers.customer[0];
      }
      
      // Customer not found or other error
      if (data.response?.status?.code === 500) {
        console.log('⚠️ Customer not found (500 error)');
        return null;
      }

      console.error('🔴 Unexpected API response:', data);
      return null;
    } catch (error) {
      console.error('🔴 Error fetching customer data:', error);
      console.error('🔴 Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      return null;
    }
  }

  /**
   * Get customer tier information
   */
  getCustomerTier(customer: CustomerData): string {
    return customer.current_slab || 'ActiveGo';
  }

  /**
   * Get customer points
   */
  getCustomerPoints(customer: CustomerData): number {
    return customer.loyalty_points || 0;
  }

  /**
   * Get customer full name
   */
  getCustomerFullName(customer: CustomerData): string {
    const firstName = customer.firstname || '';
    const lastName = customer.lastname || '';
    return `${firstName} ${lastName}`.trim() || 'Active Club Member';
  }

  /**
   * Get custom field value by name
   */
  getCustomField(customer: CustomerData, fieldName: string): string {
    if (!customer.custom_fields?.field) return '';
    
    const field = customer.custom_fields.field.find(f => f.name === fieldName);
    return field?.value || '';
  }

  /**
   * Get extended field value by name
   */
  getExtendedField(customer: CustomerData, fieldName: string): string {
    if (!customer.extended_fields?.field) return '';
    
    const field = customer.extended_fields.field.find(f => f.name === fieldName);
    return field?.value || '';
  }

  /**
   * Calculate points progress based on tier
   */
  calculateProgress(points: number, tier: string): { percentage: number; nextTarget: number } {
    const tierTargets = {
      'ActiveGo': 15000,
      'ActiveFit': 25000,
      'ActivePro': 50000,
    };

    let nextTarget = tierTargets.ActiveFit; // Default to ActiveFit target
    
    if (tier === 'ActiveGo') {
      nextTarget = tierTargets.ActiveFit;
    } else if (tier === 'ActiveFit') {
      nextTarget = tierTargets.ActivePro;
    } else if (tier === 'ActivePro') {
      nextTarget = tierTargets.ActivePro;
    }

    const percentage = Math.min((points / nextTarget) * 100, 100);
    
    return { percentage, nextTarget };
  }

  /**
   * Get tier-specific reward amount (placeholder calculation)
   */
  calculateRewardAmount(points: number): number {
    // Minimum 300 points = 10 QR, so 1 point = 0.033 QR approximately
    return Math.floor((points / 300) * 10);
  }

  /**
   * Convert API transactions to activity format for HomeScreen
   */
  convertTransactionsToActivities(transactions: Transaction[]): Array<{
    id: string;
    type: 'earned' | 'spent';
    venue: string;
    points: string;
    pointsAdded?: string;
    pointsDeducted?: string;
    date: string;
    transactionNumber: string;
  }> {
    return transactions.map((transaction) => {
      const date = new Date(transaction.billing_time);
      const isToday = this.isToday(date);
      const formattedDate = isToday ? 'TODAY' : this.formatDate(date);
      
      // Use store name directly from API or fallback to store code mapping
      const storeName = transaction.store || this.getStoreName(transaction.store_code);
      
      // Determine if points were earned or spent
      const pointsEarned = parseFloat(transaction.points.issued) || 0;
      const pointsSpent = parseFloat(transaction.points.redeemed) || 0;
      const isEarned = transaction.type === 'REGULAR' && pointsEarned > 0;
      const isReturn = transaction.type === 'RETURN';
      
      // Use actual transaction amount (not gross_amount)
      const amount = parseFloat(transaction.amount) || parseFloat(transaction.gross_amount) || 0;
      
      return {
        id: transaction.id,
        type: (isReturn || pointsSpent > pointsEarned) ? 'spent' as const : 'earned' as const,
        venue: `At ${storeName}`,
        points: amount.toFixed(2),
        ...(isEarned && !isReturn ? {
          pointsAdded: `${Math.round(pointsEarned)} pts`
        } : {
          pointsDeducted: `${Math.round(pointsSpent || pointsEarned)} pts`
        }),
        date: formattedDate,
        transactionNumber: transaction.number,
      };
    });
  }

  /**
   * Convert API transactions to activity format for Activities Screen
   */
  convertTransactionsToActivitiesScreen(transactions: Transaction[]): Array<{
    id: string;
    type: 'earned' | 'spent';
    venue: string;
    amount: string;
    points: string;
    date: string;
    transactionNumber: string;
    icon: string;
    isToday?: boolean;
  }> {
    const activities: Array<{
      id: string;
      type: 'earned' | 'spent';
      venue: string;
      amount: string;
      points: string;
      date: string;
      transactionNumber: string;
      icon: string;
      isToday?: boolean;
    }> = [];

    transactions.forEach((transaction) => {
      const date = new Date(transaction.billing_time);
      const isToday = this.isToday(date);
      const formattedDate = isToday ? 'TODAY' : this.formatDate(date);
      
      // Use store name directly from API or fallback to store code mapping
      const storeName = transaction.store || this.getStoreName(transaction.store_code);
      
      // Get points values
      const pointsEarned = parseFloat(transaction.points.issued) || 0;
      const pointsSpent = parseFloat(transaction.points.redeemed) || 0;
      const isReturn = transaction.type === 'RETURN';
      
      // Use actual transaction amount (not gross_amount)
      const amount = parseFloat(transaction.amount) || parseFloat(transaction.gross_amount) || 0;
      
      // Create base activity object
      const baseActivity = {
        venue: `At ${storeName}`,
        amount: amount.toFixed(2),
        date: formattedDate,
        transactionNumber: transaction.number,
        icon: 'sc' as const,
        isToday: isToday,
      };

      // If both points issued and redeemed exist, create two entries
      if (pointsEarned > 0 && pointsSpent > 0) {
        // First entry: Points earned
        activities.push({
          ...baseActivity,
          id: `${transaction.id}_earned`,
          type: 'earned' as const,
          points: `+ ${Math.round(pointsEarned)} pts`,
        });
        
        // Second entry: Points spent
        activities.push({
          ...baseActivity,
          id: `${transaction.id}_spent`,
          type: 'spent' as const,
          points: `- ${Math.round(pointsSpent)} pts`,
        });
      }
      // If only points earned
      else if (pointsEarned > 0) {
        activities.push({
          ...baseActivity,
          id: transaction.id,
          type: isReturn ? 'spent' as const : 'earned' as const,
          points: isReturn ? `- ${Math.round(pointsEarned)} pts` : `+ ${Math.round(pointsEarned)} pts`,
        });
      }
      // If only points spent/redeemed
      else if (pointsSpent > 0) {
        activities.push({
          ...baseActivity,
          id: transaction.id,
          type: 'spent' as const,
          points: `- ${Math.round(pointsSpent)} pts`,
        });
      }
      // Fallback for transactions with no points
      else {
        activities.push({
          ...baseActivity,
          id: transaction.id,
          type: isReturn ? 'spent' as const : 'earned' as const,
          points: isReturn ? '- 0 pts' : '+ 0 pts',
        });
      }
    });

    return activities;
  }

  /**
   * Check if date is today
   */
  private isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  /**
   * Format date for display
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Get friendly store name from store code
   */
  private getStoreName(storeCode: string): string {
    const storeMapping: { [key: string]: string } = {
      'prod.tbg.s13': 'New Sports Corner Salwa',
      'prod.tbg.s13.1': 'New Sports Corner Salwa', 
      'prod.tbg.s02': 'Sports Corner Markhiya',
      'prod.tbg.s02.1': 'Sports Corner Markhiya',
      'prod.tbg.ecom.sports_corner': 'Ecom Sports Corner',
      'prod.tbg.ecom.sports_corner.1': 'Ecom Sports Corner',
      'tbg.mobile.prod': 'Mobile App',
      'tbgprodmobile': 'Mobile App'
    };
    
    return storeMapping[storeCode] || 'Sports Corner Store';
  }
}

export const capillaryApi = new CapillaryApiService();