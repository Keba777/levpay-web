import apiClient from "../client";

export interface Invoice {
    id: string;
    user_id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'canceled' | 'overdue';
    description: string;
    due_date: string;
    paid_at?: string;
    created_at: string;
}

export interface BillingStats {
    total_invoiced: number;
    total_paid: number;
    total_pending: number;
    invoice_count: number;
}

export const billingAPI = {
    listInvoices: async () => {
        const response = await apiClient.get<Invoice[]>('/billing/invoices');
        return response.data;
    },
    getInvoice: async (id: string) => {
        const response = await apiClient.get<Invoice>(`/billing/invoices/${id}`);
        return response.data;
    },
    payInvoice: async (id: string) => {
        const response = await apiClient.post(`/billing/invoices/${id}/pay`);
        return response.data;
    },
    cancelInvoice: async (id: string) => {
        const response = await apiClient.put(`/billing/invoices/${id}/cancel`);
        return response.data;
    },
    getStats: async () => {
        const response = await apiClient.get<BillingStats>('/billing/stats');
        return response.data;
    }
};
