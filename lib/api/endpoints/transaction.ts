import apiClient from '../client';

export interface TransactionResponse {
    id: string;
    from_user_id: string;
    to_user_id?: string;
    amount: number;
    currency: string;
    type: 'transfer' | 'payment' | 'topup' | 'withdrawal';
    status: 'pending' | 'completed' | 'failed' | 'reversed';
    description?: string;
    fee: number;
    created_at: string;
}

export interface HistoryParams {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
}

export interface PaginationResponse<T> {
    records: T[];
    total: number;
    page: number;
    limit: number;
}

export const transactionAPI = {
    // Get transaction history
    getHistory: async (params?: HistoryParams): Promise<PaginationResponse<TransactionResponse>> => {
        const response = await apiClient.get('/transaction/history', { params });
        return response.data;
    },

    // Get transaction details
    getDetails: async (id: string): Promise<TransactionResponse> => {
        const response = await apiClient.get(`/transaction/${id}`);
        return response.data;
    },

    // Transfer money
    transfer: async (toEmail: string, amount: number, description?: string): Promise<TransactionResponse> => {
        const response = await apiClient.post('/transaction/transfer', {
            to_email: toEmail,
            amount,
            description,
        });
        return response.data;
    },

    // Make a payment
    payment: async (merchantId: string, amount: number, description?: string): Promise<TransactionResponse> => {
        const response = await apiClient.post('/transaction/payment', {
            merchant_id: merchantId,
            amount,
            description,
        });
        return response.data;
    },
};
