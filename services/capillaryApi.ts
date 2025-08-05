// Capillary API Service
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { authService } from './authService';

const CAPILLARY_API_URL = Constants.expoConfig?.extra?.CAPILLARY_API_URL || 'https://eu.api.capillarytech.com/v1.1';

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
      success?: string;
    };
    customers?: {
      customer: Array<CustomerData & {
        item_status?: {
          success: string;
          code: string;
          message: string;
        };
      }>;
    };
  };
}

export interface CustomerResult {
  customer: CustomerData | null;
  error?: {
    type: 'not_found' | 'api_error' | 'auth_error';
    message: string;
    code?: string | number;
  };
}

class CapillaryApiService {
  private baseURL = CAPILLARY_API_URL;
  
  /**
   * Get auth token from session and handle expiry
   */
  private async getAuthToken(): Promise<string | null> {
    const sessionToken = await authService.getAuthToken();
    if (sessionToken) {
      console.log('🔑 Using session auth token');
      return sessionToken;
    }
    
    console.log('❌ No auth token available - user not authenticated');
    this.handleSessionExpiry();
    return null;
  }

  /**
   * Handle session expiry by redirecting to login
   */
  private handleSessionExpiry(): void {
    console.log('🔐 Session expired - redirecting to login');
    
    // Add a small delay to prevent multiple redirects
    setTimeout(() => {
      router.replace('/screens/LoginScreen');
    }, 100);
  }
  
  /**
   * Clean mobile number for Capillary API (remove +974 prefix)
   */
  private cleanMobileNumber(mobile: string): string {
    // Remove any + sign and spaces
    let cleaned = mobile.replace(/[\s\+\-\(\)]/g, '');
    
    // If number starts with 974, remove it
    if (cleaned.startsWith('974')) {
      cleaned = cleaned.substring(3);
    }
    
    return cleaned;
  }

  /**
   * Get customer transactions by mobile number
   */
  async getCustomerTransactionsByMobile(mobile: string): Promise<Transaction[]> {
    try {
      const cleanedMobile = this.cleanMobileNumber(mobile);
      const url = `${this.baseURL}/customer/transactions?mobile=${cleanedMobile}&limit=3`;
      console.log('🔵 Making transactions API call to:', url);
      console.log('🔵 With mobile number:', cleanedMobile);
      
      const authToken = await this.getAuthToken();
      if (!authToken) {
        console.error('🔴 No auth token available - user must login first');
        return [];
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🟡 Transactions response status:', response.status);

      if (!response.ok) {
        console.error('🔴 Transactions API request failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('🔴 Transactions error response body:', errorText);
        
        // Handle 401 authentication errors
        if (response.status === 401) {
          console.log('🔐 401 Authentication error - clearing session and redirecting to login');
          await authService.clearSession();
          this.handleSessionExpiry();
        }
        
        return [];
      }

      const data: TransactionResponse = await response.json();
      console.log('🟢 Transactions API Response received:', JSON.stringify(data, null, 2));
      
      // Check if API returned an error (even with 200 HTTP status)
      if (data.response?.status?.code !== 200) {
        console.error('🔴 Transactions API error:', {
          code: data.response?.status?.code,
          message: data.response?.status?.message,
          success: data.response?.status?.success
        });
        
        if (data.response?.status?.code === 500) {
          console.error('🔴 Server error - customer might not exist or token is invalid');
        }
        
        return [];
      }
      
      if (data.response?.customer?.transactions?.transaction) {
        console.log('✅ Transactions found successfully!');
        return data.response.customer.transactions.transaction;
      }
      
      console.error('🔴 No transactions found in API response');
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
      const cleanedMobile = this.cleanMobileNumber(mobile);
      const url = `${this.baseURL}/customer/transactions?mobile=${cleanedMobile}&limit=${limit}&offset=${offset}`;
      console.log('🔵 Making paginated transactions API call to:', url);
      console.log('🔵 With mobile:', cleanedMobile, 'limit:', limit, 'offset:', offset);
      
      const authToken = await this.getAuthToken();
      if (!authToken) {
        console.error('🔴 No auth token available - user must login first');
        return { transactions: [], hasMore: false, total: 0 };
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🟡 Paginated transactions response status:', response.status);

      if (!response.ok) {
        console.error('🔴 Paginated transactions API request failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('🔴 Paginated transactions error response body:', errorText);
        
        // Handle 401 authentication errors
        if (response.status === 401) {
          console.log('🔐 401 Authentication error - clearing session and redirecting to login');
          await authService.clearSession();
          this.handleSessionExpiry();
        }
        
        return { transactions: [], hasMore: false, total: 0 };
      }

      const data: TransactionResponse = await response.json();
      console.log('🟢 Paginated transactions API Response received');
      
      // Check if API returned an error (even with 200 HTTP status)
      if (data.response?.status?.code !== 200) {
        console.error('🔴 Paginated transactions API error:', {
          code: data.response?.status?.code,
          message: data.response?.status?.message,
          success: data.response?.status?.success
        });
        
        // If it's a 500 error, the customer might not exist or token is invalid
        if (data.response?.status?.code === 500) {
          console.error('🔴 Server error - customer might not exist or token is invalid');
        }
        
        return { transactions: [], hasMore: false, total: 0 };
      }
      
      if (data.response?.customer?.transactions?.transaction) {
        const transactions = data.response.customer.transactions.transaction;
        const total = parseInt(data.response.customer.count as any) || 0;
        const hasMore = (offset + limit) < total;
        
        console.log('✅ Paginated transactions found:', transactions.length, 'hasMore:', hasMore, 'total:', total);
        return { transactions, hasMore, total };
      }
      
      console.error('🔴 No transactions found in API response');
      return { transactions: [], hasMore: false, total: 0 };
    } catch (error) {
      console.error('🔴 Error fetching paginated customer transactions:', error);
      return { transactions: [], hasMore: false, total: 0 };
    }
  }

  /**
   * Get customer details by mobile number
   */
  async getCustomerByMobile(mobile: string, skipRedirectOnError: boolean = false): Promise<CustomerResult> {
    try {
      const cleanedMobile = this.cleanMobileNumber(mobile);
      const url = `${this.baseURL}/customer/get?mobile=${cleanedMobile}`;
      console.log('🔵 Making API call to:', url);
      console.log('🔵 With mobile number:', cleanedMobile);
      
      const authToken = await this.getAuthToken();
      if (!authToken) {
        console.error('🔴 No auth token available - user must login first');
        return {
          customer: null,
          error: {
            type: 'auth_error',
            message: 'No auth token available - user must login first'
          }
        };
      }
      
      console.log('🔵 Authorization token: Present');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🟡 Response status:', response.status);
      console.log('🟡 Response ok:', response.ok);

      if (!response.ok) {
        console.error('🔴 API request failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('🔴 Error response body:', errorText);
        
        // Handle 401 authentication errors
        if (response.status === 401) {
          console.log('🔐 401 Authentication error');
          if (!skipRedirectOnError) {
            console.log('🔐 Clearing session and redirecting to login');
            await authService.clearSession();
            this.handleSessionExpiry();
          } else {
            console.log('🔐 Skipping redirect - this is expected for new user verification');
          }
          
          return {
            customer: null,
            error: {
              type: 'auth_error',
              message: 'Authentication failed',
              code: 401
            }
          };
        }
        
        return {
          customer: null,
          error: {
            type: 'api_error',
            message: `API request failed: ${response.status} ${response.statusText}`,
            code: response.status
          }
        };
      }

      const data: CustomerResponse = await response.json();
      console.log('🟢 API Response received:', JSON.stringify(data, null, 2));
      
      // Check if the response is successful with customer data
      if (data.response?.status?.code === 200 && data.response?.customers?.customer && data.response.customers.customer.length > 0) {
        const customerData = data.response.customers.customer[0];
        
        // Check if customer has item_status indicating not found (code 1012)
        if (customerData.item_status && customerData.item_status.success === 'false' && customerData.item_status.code === '1012') {
          console.log('⚠️ Customer not found (code 1012)');
          return {
            customer: null,
            error: {
              type: 'not_found',
              message: customerData.item_status.message,
              code: '1012'
            }
          };
        }
        
        console.log('✅ Customer found successfully!');
        console.log('✅ Customer data:', customerData);
        return { customer: customerData };
      }
      
      // Handle 500 error - check if it contains specific customer not found info
      if (data.response?.status?.code === 500) {
        // Check if this is a "customer not found" scenario
        if (data.response?.customers?.customer && data.response.customers.customer.length > 0) {
          const customerData = data.response.customers.customer[0];
          if (customerData.item_status && customerData.item_status.code === '1012') {
            console.log('⚠️ Customer not found (500 with code 1012)');
            return {
              customer: null,
              error: {
                type: 'not_found',
                message: customerData.item_status.message,
                code: '1012'
              }
            };
          }
        }
        
        console.log('⚠️ API error (500)');
        return {
          customer: null,
          error: {
            type: 'api_error',
            message: data.response?.status?.message || 'Server error',
            code: 500
          }
        };
      }
      
      // Handle other authentication errors
      if (data.response?.status?.code === 401) {
        console.log('⚠️ Customer not found or authentication error (401)');
        return {
          customer: null,
          error: {
            type: 'auth_error',
            message: data.response?.status?.message || 'Authentication failed',
            code: 401
          }
        };
      }

      console.error('🔴 Unexpected API response:', data);
      return {
        customer: null,
        error: {
          type: 'api_error',
          message: 'Unexpected API response',
          code: data.response?.status?.code
        }
      };
    } catch (error) {
      console.error('🔴 Error fetching customer data:', error);
      console.error('🔴 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
      return {
        customer: null,
        error: {
          type: 'api_error',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
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