import { create } from 'zustand';
import { walletAPI, BalanceResponse } from '../api/endpoints/wallet';
import { transactionAPI, TransactionResponse } from '../api/endpoints/transaction';

interface WalletState {
    balance: number;
    currency: string;
    transactions: TransactionResponse[];
    loading: boolean;
    error: string | null;

    fetchDashboardData: () => Promise<void>;
    topUp: (amount: number) => Promise<void>;
    transfer: (toEmail: string, amount: number, description?: string) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
    balance: 0,
    currency: 'USD',
    transactions: [],
    loading: false,
    error: null,

    fetchDashboardData: async () => {
        set({ loading: true, error: null });
        try {
            const [balanceRes, historyRes] = await Promise.all([
                walletAPI.getBalance(),
                transactionAPI.getHistory({ limit: 5 }),
            ]);
            set({
                balance: balanceRes.balance,
                currency: balanceRes.currency,
                transactions: historyRes.records,
                loading: false
            });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch dashboard data', loading: false });
        }
    },

    topUp: async (amount: number) => {
        set({ loading: true, error: null });
        try {
            await walletAPI.topUp(amount);
            await get().fetchDashboardData();
        } catch (error: any) {
            set({ error: error.message || 'Top up failed', loading: false });
        }
    },

    transfer: async (toEmail: string, amount: number, description?: string) => {
        set({ loading: true, error: null });
        try {
            await transactionAPI.transfer(toEmail, amount, description);
            await get().fetchDashboardData();
        } catch (error: any) {
            set({ error: error.message || 'Transfer failed', loading: false });
        }
    },
}));
