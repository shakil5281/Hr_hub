import api from '../api';

export interface Department {
    id: number;
    nameEn: string;
    nameBn?: string;
    companyId: number;
    companyName?: string;
}

export interface Section {
    id: number;
    nameEn: string;
    nameBn?: string;
    departmentId: number;
    departmentName?: string;
}

export interface Designation {
    id: number;
    nameEn: string;
    nameBn?: string;
    nightBill: number;
    holidayBill: number;
    attendanceBonus: number;
    sectionId: number;
    sectionName?: string;
}

export interface Line {
    id: number;
    nameEn: string;
    nameBn?: string;
    sectionId: number;
    sectionName?: string;
}

export interface Shift {
    id: number;
    nameEn: string;
    nameBn?: string;
    inTime: string;
    outTime: string;
    lateLimit: number;
}

export interface Group {
    id: number;
    nameEn: string;
    nameBn?: string;
}

export interface Floor {
    id: number;
    nameEn: string;
    nameBn?: string;
}

export const organogramService = {
    // Departments
    getDepartments: async (companyId?: number) => {
        const response = await api.get<Department[]>('/organogram/departments', {
            params: { companyId }
        });
        return response.data;
    },
    createDepartment: async (data: { nameEn: string; nameBn?: string; companyId: number }) => {
        const response = await api.post<Department>('/organogram/departments', data);
        return response.data;
    },
    updateDepartment: async (id: number, data: { nameEn: string; nameBn?: string; companyId: number }) => {
        const response = await api.put(`/organogram/departments/${id}`, data);
        return response.data;
    },
    deleteDepartment: async (id: number) => {
        const response = await api.delete(`/organogram/departments/${id}`);
        return response.data;
    },

    // Sections
    getSections: async (departmentId?: number) => {
        const response = await api.get<Section[]>('/organogram/sections', {
            params: { departmentId }
        });
        return response.data;
    },
    createSection: async (data: { nameEn: string; nameBn?: string; departmentId: number }) => {
        const response = await api.post<Section>('/organogram/sections', data);
        return response.data;
    },
    updateSection: async (id: number, data: { nameEn: string; nameBn?: string; departmentId: number }) => {
        const response = await api.put(`/organogram/sections/${id}`, data);
        return response.data;
    },
    deleteSection: async (id: number) => {
        const response = await api.delete(`/organogram/sections/${id}`);
        return response.data;
    },

    // Designations
    getDesignations: async (sectionId?: number) => {
        const response = await api.get<Designation[]>('/organogram/designations', {
            params: { sectionId }
        });
        return response.data;
    },
    createDesignation: async (data: { nameEn: string; nameBn?: string; sectionId: number; nightBill: number; holidayBill: number; attendanceBonus: number }) => {
        const response = await api.post<Designation>('/organogram/designations', data);
        return response.data;
    },
    updateDesignation: async (id: number, data: { nameEn: string; nameBn?: string; sectionId: number; nightBill: number; holidayBill: number; attendanceBonus: number }) => {
        const response = await api.put(`/organogram/designations/${id}`, data);
        return response.data;
    },
    deleteDesignation: async (id: number) => {
        const response = await api.delete(`/organogram/designations/${id}`);
        return response.data;
    },

    // Lines
    getLines: async (sectionId?: number) => {
        const response = await api.get<Line[]>('/organogram/lines', {
            params: { sectionId }
        });
        return response.data;
    },
    createLine: async (data: { nameEn: string; nameBn?: string; sectionId: number }) => {
        const response = await api.post<Line>('/organogram/lines', data);
        return response.data;
    },
    updateLine: async (id: number, data: { nameEn: string; nameBn?: string; sectionId: number }) => {
        const response = await api.put(`/organogram/lines/${id}`, data);
        return response.data;
    },
    deleteLine: async (id: number) => {
        const response = await api.delete(`/organogram/lines/${id}`);
        return response.data;
    },

    // Shifts
    getShifts: async () => {
        const response = await api.get<Shift[]>('/shift');
        return response.data;
    },
    getShift: async (id: number) => {
        const response = await api.get<Shift>(`/shift/${id}`);
        return response.data;
    },
    createShift: async (data: { nameEn: string; nameBn?: string; inTime: string; outTime: string; lateLimit: number }) => {
        const response = await api.post<Shift>('/shift', data);
        return response.data;
    },
    updateShift: async (id: number, data: { nameEn: string; nameBn?: string; inTime: string; outTime: string; lateLimit: number }) => {
        const response = await api.put(`/shift/${id}`, data);
        return response.data;
    },
    deleteShift: async (id: number) => {
        const response = await api.delete(`/shift/${id}`);
        return response.data;
    },

    // Groups
    getGroups: async () => {
        const response = await api.get<Group[]>('/organogram/groups');
        return response.data;
    },

    // Floors
    getFloors: async () => {
        const response = await api.get<Floor[]>('/organogram/floors');
        return response.data;
    },

    // Import/Export
    downloadTemplate: async () => {
        const response = await api.get('/organogram/export-template', {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Organogram_Template.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    importFromExcel: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<ImportResult>('/organogram/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

export interface ImportResult {
    totalRows: number;
    successCount: number;
    errorCount: number;
    warningCount: number;
    updatedCount: number;
    createdCount: number;
    errors: ImportError[];
    warnings: ImportWarning[];
}

export interface ImportError {
    rowNumber: number;
    field: string;
    message: string;
}

export interface ImportWarning {
    rowNumber: number;
    message: string;
}
