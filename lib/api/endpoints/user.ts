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
    updateProfile: async (data: any) => {
        const response = await apiClient.put('/users/me', data);
        return response.data;
    },
};
