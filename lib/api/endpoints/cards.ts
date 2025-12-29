import apiClient from "../client";

export interface PaymentMethod {
    id: string;
    type: 'bank' | 'card' | 'mobile_wallet';
    is_default: boolean;
    verified: boolean;
    last_four_digits?: string;
}

export interface CreatePaymentMethodRequest {
    type: string;
    details: Record<string, any>;
    is_default?: boolean;
}

export const paymentMethodAPI = {
    list: async () => {
        const response = await apiClient.get<PaymentMethod[]>('/payment-methods');
        return response.data;
    },
    add: async (data: CreatePaymentMethodRequest) => {
        const response = await apiClient.post('/payment-methods', data);
        return response.data;
    },
    remove: async (id: string) => {
        const response = await apiClient.delete(`/payment-methods/${id}`);
        return response.data;
    },
    setDefault: async (id: string) => {
        const response = await apiClient.patch(`/payment-methods/${id}/default`);
        return response.data;
    }
};
