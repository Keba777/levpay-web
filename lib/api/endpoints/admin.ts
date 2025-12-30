import apiClient from "../client";

export interface AdminUser {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    username?: string;
    avatar_url?: string;
    phone?: string;
    is_active: boolean;
    kyc_status: string;
    created_at: string;
}

export interface SystemStats {
    total_users: number;
    total_wallets: number;
    kyc_pending: number;
}

export interface TransactionStats {
    total_volume: number;
    transaction_count: number;
}

export interface AdminDashboardResponse {
    system: SystemStats;
    transaction: TransactionStats;
}

export interface AuditLog {
    id: string;
    user_id: string;
    action: string;
    entity: string;
    entity_id: string;
    details: string;
    ip_address: string;
    created_at: string;
}

export interface ListResponse<T> {
    records: T[];
    total: number;
    page: number;
    limit: number;
}

export const adminAPI = {
    getDashboard: async () => {
        const response = await apiClient.get<AdminDashboardResponse>('/admin/dashboard');
        return response.data;
    },
    listUsers: async (page: number = 1, limit: number = 10, search: string = "") => {
        const response = await apiClient.get<ListResponse<AdminUser>>('/admin/users', {
            params: { page, limit, search }
        });
        return response.data;
    },
    updateUserStatus: async (userId: string, isActive: boolean) => {
        const response = await apiClient.patch(`/admin/users/${userId}/status`, {
            is_active: isActive
        });
        return response.data;
    },
    getAuditLogs: async (page: number = 1, limit: number = 10) => {
        const response = await apiClient.get<ListResponse<AuditLog>>('/admin/audit-logs', {
            params: { page, limit }
        });
        return response.data;
    }
};
