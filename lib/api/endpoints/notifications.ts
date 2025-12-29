import apiClient from "../client";

export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    created_at: string;
}

export const notificationAPI = {
    list: async () => {
        const response = await apiClient.get<Notification[]>('/notifications');
        return response.data;
    },
    markAsRead: async (id: string) => {
        const response = await apiClient.put(`/notifications/${id}/read`);
        return response.data;
    },
    getUnreadCount: async () => {
        const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
        return response.data;
    }
};
