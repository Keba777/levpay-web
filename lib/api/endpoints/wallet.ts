import apiClient from '../client';

export interface WalletResponse {
    id: string;
    user_id: string;
    balance: number;
    currency: string;
    locked: boolean;
    last_updated: string;
}

export interface BalanceResponse {
    balance: number;
    currency: string;
}

export const walletAPI = {
    // Get wallet balance
    getBalance: async (): Promise<BalanceResponse> => {
        const response = await apiClient.get('/wallet/balance');
        return response.data;
    },

    // Get full wallet details
    getWallet: async (): Promise<WalletResponse> => {
        const response = await apiClient.get('/wallet');
        return response.data;
    },

    // Top up wallet
    topUp: async (amount: number, currency: string = 'USD'): Promise<WalletResponse> => {
        const response = await apiClient.post('/wallet/topup', { amount, currency });
        return response.data;
    },

    // Withdraw from wallet
    withdraw: async (amount: number, currency: string = 'USD'): Promise<WalletResponse> => {
        const response = await apiClient.post('/wallet/withdraw', { amount, currency });
        return response.data;
    },

    // Lock wallet
    lock: async (): Promise<{ message: string }> => {
        const response = await apiClient.post('/wallet/lock');
        return response.data;
    },

    // Unlock wallet
    unlock: async (): Promise<{ message: string }> => {
        const response = await apiClient.post('/wallet/unlock');
        return response.data;
    },
};
