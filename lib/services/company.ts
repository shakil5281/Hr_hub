import api from '../api';

export interface Company {
    id: number;
    companyNameEn: string;
    companyNameBn: string;
    address: string;
    phoneNumber: string;
    registrationNo: string;
    industry: string;
    email: string;
    status: string;
    founded: number;
    logoPath?: string;
    authorizeSignaturePath?: string;
}

export interface CreateCompanyDto {
    companyNameEn: string;
    companyNameBn: string;
    address: string;
    phoneNumber: string;
    registrationNo: string;
    industry: string;
    email: string;
    status: string;
    founded: number;
    logo?: File;
    authorizeSignature?: File;
}

export interface AssignCompanyDto {
    userId: string;
    companyIds: number[];
}

export const companyService = {
    getAll: async () => {
        const response = await api.get<Company[]>('/company');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Company>(`/company/${id}`);
        return response.data;
    },

    create: async (data: FormData) => {
        const response = await api.post<Company>('/company', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    update: async (id: number, data: FormData) => {
        const response = await api.put(`/company/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/company/${id}`);
        return response.data;
    },

    assignToUser: async (data: AssignCompanyDto) => {
        const response = await api.post('/usercompany/assign', data);
        return response.data;
    },

    getUserCompanies: async (userId: string) => {
        const response = await api.get<Company[]>(`/usercompany/user-companies/${userId}`);
        return response.data;
    },
};
