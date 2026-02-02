import api from '../api';

export interface Country {
    id: number;
    nameEn: string;
    nameBn?: string;
}

export interface Division {
    id: number;
    nameEn: string;
    nameBn?: string;
    countryId: number;
    countryName?: string;
}

export interface District {
    id: number;
    nameEn: string;
    nameBn?: string;
    divisionId: number;
    divisionName?: string;
}

export interface Thana {
    id: number;
    nameEn: string;
    nameBn?: string;
    districtId: number;
    districtName?: string;
}

export interface PostOffice {
    id: number;
    nameEn: string;
    nameBn?: string;
    code: string;
    districtId: number;
    districtName?: string;
}

export const addressService = {
    // Countries
    getCountries: async () => {
        const response = await api.get<Country[]>('/address/countries');
        return response.data;
    },
    createCountry: async (data: { nameEn: string; nameBn?: string }) => {
        const response = await api.post<Country>('/address/countries', data);
        return response.data;
    },
    updateCountry: async (id: number, data: { nameEn: string; nameBn?: string }) => {
        const response = await api.put(`/address/countries/${id}`, data);
        return response.data;
    },
    deleteCountry: async (id: number) => {
        const response = await api.delete(`/address/countries/${id}`);
        return response.data;
    },

    // Divisions
    getDivisions: async (countryId?: number) => {
        const response = await api.get<Division[]>('/address/divisions', {
            params: { countryId }
        });
        return response.data;
    },
    createDivision: async (data: { nameEn: string; nameBn?: string; countryId: number }) => {
        const response = await api.post<Division>('/address/divisions', data);
        return response.data;
    },
    updateDivision: async (id: number, data: { nameEn: string; nameBn?: string; countryId: number }) => {
        const response = await api.put(`/address/divisions/${id}`, data);
        return response.data;
    },
    deleteDivision: async (id: number) => {
        const response = await api.delete(`/address/divisions/${id}`);
        return response.data;
    },

    // Districts
    getDistricts: async (divisionId?: number) => {
        const response = await api.get<District[]>('/address/districts', {
            params: { divisionId }
        });
        return response.data;
    },
    createDistrict: async (data: { nameEn: string; nameBn?: string; divisionId: number }) => {
        const response = await api.post<District>('/address/districts', data);
        return response.data;
    },
    updateDistrict: async (id: number, data: { nameEn: string; nameBn?: string; divisionId: number }) => {
        const response = await api.put(`/address/districts/${id}`, data);
        return response.data;
    },
    deleteDistrict: async (id: number) => {
        const response = await api.delete(`/address/districts/${id}`);
        return response.data;
    },

    // Thanas
    getThanas: async (districtId?: number) => {
        const response = await api.get<Thana[]>('/address/thanas', {
            params: { districtId }
        });
        return response.data;
    },
    createThana: async (data: { nameEn: string; nameBn?: string; districtId: number }) => {
        const response = await api.post<Thana>('/address/thanas', data);
        return response.data;
    },
    updateThana: async (id: number, data: { nameEn: string; nameBn?: string; districtId: number }) => {
        const response = await api.put(`/address/thanas/${id}`, data);
        return response.data;
    },
    deleteThana: async (id: number) => {
        const response = await api.delete(`/address/thanas/${id}`);
        return response.data;
    },

    // Post Offices
    getPostOffices: async (districtId?: number) => {
        const response = await api.get<PostOffice[]>('/address/postoffices', {
            params: { districtId }
        });
        return response.data;
    },
    createPostOffice: async (data: { nameEn: string; nameBn?: string; code: string; districtId: number }) => {
        const response = await api.post<PostOffice>('/address/postoffices', data);
        return response.data;
    },
    updatePostOffice: async (id: number, data: { nameEn: string; nameBn?: string; code: string; districtId: number }) => {
        const response = await api.put(`/address/postoffices/${id}`, data);
        return response.data;
    },
    deletePostOffice: async (id: number) => {
        const response = await api.delete(`/address/postoffices/${id}`);
        return response.data;
    },

    // Excel Import/Export
    exportTemplate: async () => {
        const response = await api.get('/address/export-template', {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Address_Template.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    },
    exportDemo: async () => {
        const response = await api.get('/address/export-demo', {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Address_Demo_Data.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    },
    importExcel: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/address/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
};

