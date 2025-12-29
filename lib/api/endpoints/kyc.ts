import apiClient from '../client';

export type KYCStatus = 'not_started' | 'pending' | 'approved' | 'rejected';

export interface KYCDocument {
    id: string;
    user_id: string;
    type: string;
    file_path: string;
    status: KYCStatus;
    notes?: string;
    uploaded_at: string;
}

export interface KYCStatusResponse {
    overall_status: KYCStatus;
    documents: KYCDocument[];
}

export const kycAPI = {
    // Get current KYC status and documents
    getStatus: async (): Promise<KYCStatusResponse> => {
        const response = await apiClient.get('/kyc/status');
        return response.data;
    },

    // Upload a KYC document
    uploadDocument: async (type: string, file: File): Promise<any> => {
        const formData = new FormData();
        formData.append('type', type);
        formData.append('document', file);

        const response = await apiClient.post('/kyc/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
