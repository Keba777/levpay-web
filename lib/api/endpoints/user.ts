import apiClient from '../client';

export interface PublicUser {
    id: string;
    first_name: string;
    last_name: string;
    username?: string;
    email: string;
    avatar_url?: string;
}

export interface SearchResponse {
    records: PublicUser[];
    total: number;
}

export interface UpdateUserRequest {
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    username?: string;
    avatar?: File;
}

export interface UpdateSettingsRequest {
    currency?: string;
    language?: string;
    notifications?: boolean;
}

export const userAPI = {
    // Search for users to send money to
    search: async (query: string): Promise<SearchResponse> => {
        const response = await apiClient.get('/users/search', {
            params: { query },
        });
        return response.data;
    },

    // Get current user profile
    getMe: async () => {
        const response = await apiClient.get('/users/me');
        return response.data;
    },

    // Update profile
    updateProfile: async (data: UpdateUserRequest) => {
        const formData = new FormData();
        if (data.first_name) formData.append('first_name', data.first_name);
        if (data.last_name) formData.append('last_name', data.last_name);
        if (data.phone) formData.append('phone', data.phone);
        if (data.address) formData.append('address', data.address);
        if (data.username) formData.append('username', data.username);
        if (data.avatar) formData.append('avatar', data.avatar);

        const response = await apiClient.put('/users/me', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get settings
    getSettings: async () => {
        const response = await apiClient.get('/users/settings');
        return response.data;
    },

    // Update settings
    updateSettings: async (data: UpdateSettingsRequest) => {
        const response = await apiClient.put('/users/settings', data);
        return response.data;
    },
};
