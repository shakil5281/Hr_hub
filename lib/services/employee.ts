import api from '../api';

export interface Employee {
    id: number;
    employeeId: string;
    fullNameEn: string;
    fullNameBn?: string;
    nid?: string;
    proximity?: string;
    dateOfBirth?: string;
    gender?: string;
    religion?: string;
    departmentId: number;
    departmentName?: string;
    sectionId?: number;
    sectionName?: string;
    designationId: number;
    designationName?: string;
    lineId?: number;
    lineName?: string;
    status: string;
    joinDate: string;
    profileImageUrl?: string;
    signatureImageUrl?: string;
    email?: string;
    phoneNumber?: string;
    presentAddress?: string;
    permanentAddress?: string;

    // Family Information
    fatherNameEn?: string;
    fatherNameBn?: string;
    motherNameEn?: string;
    motherNameBn?: string;
    maritalStatus?: string;
    spouseNameEn?: string;
    spouseNameBn?: string;
    spouseOccupation?: string;
    spouseContact?: string;

    // Salary Information
    basicSalary?: number;
    houseRent?: number;
    medicalAllowance?: number;
    conveyance?: number;
    foodAllowance?: number;
    otherAllowance?: number;
    grossSalary?: number;

    // Account Information
    bankName?: string;
    bankBranchName?: string;
    bankAccountNo?: string;
    bankRoutingNo?: string;
    bankAccountType?: string;

    // Emergency Contact Info
    emergencyContactName?: string;
    emergencyContactRelation?: string;
    emergencyContactPhone?: string;
    emergencyContactAddress?: string;

    isActive: boolean;
    createdAt: string;
}

export interface CreateEmployeeDto {
    employeeId?: string;
    fullNameEn: string;
    fullNameBn?: string;
    nid?: string;
    proximity?: string;
    dateOfBirth?: string;
    gender?: string;
    religion?: string;
    departmentId: number;
    sectionId?: number;
    designationId: number;
    lineId?: number;
    status: string;
    joinDate: string;
    email?: string;
    phoneNumber?: string;
    presentAddress?: string;
    permanentAddress?: string;
    profileImageUrl?: string;
    signatureImageUrl?: string;

    // Family Information
    fatherNameEn?: string;
    fatherNameBn?: string;
    motherNameEn?: string;
    motherNameBn?: string;
    maritalStatus?: string;
    spouseNameEn?: string;
    spouseNameBn?: string;
    spouseOccupation?: string;
    spouseContact?: string;

    // Salary Information
    basicSalary?: number;
    houseRent?: number;
    medicalAllowance?: number;
    conveyance?: number;
    foodAllowance?: number;
    otherAllowance?: number;
    grossSalary?: number;

    // Account Information
    bankName?: string;
    bankBranchName?: string;
    bankAccountNo?: string;
    bankRoutingNo?: string;
    bankAccountType?: string;

    // Emergency Contact Info
    emergencyContactName?: string;
    emergencyContactRelation?: string;
    emergencyContactPhone?: string;
    emergencyContactAddress?: string;
}

export interface UpdateEmployeeDto extends CreateEmployeeDto {
    isActive: boolean;
}

export const employeeService = {
    getEmployees: async (params?: {
        departmentId?: number;
        designationId?: number;
        status?: string;
        isActive?: boolean;
    }) => {
        const response = await api.get<Employee[]>('/employee', { params });
        return response.data;
    },

    getEmployee: async (id: number) => {
        const response = await api.get<Employee>(`/employee/${id}`);
        return response.data;
    },

    createEmployee: async (data: CreateEmployeeDto) => {
        const response = await api.post<Employee>('/employee', data);
        return response.data;
    },

    updateEmployee: async (id: number, data: UpdateEmployeeDto) => {
        const response = await api.put(`/employee/${id}`, data);
        return response.data;
    },

    deleteEmployee: async (id: number) => {
        const response = await api.delete(`/employee/${id}`);
        return response.data;
    },

    searchEmployees: async (query: string) => {
        const response = await api.get<Employee[]>('/employee/search', {
            params: { query }
        });
        return response.data;
    },

    exportTemplate: async () => {
        const response = await api.get('/employee/export-template', {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Employee_Template.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },

    exportDemo: async () => {
        const response = await api.get('/employee/export-demo', {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Employee_Demo_Data.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },

    importExcel: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/employee/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    uploadImage: async (file: File, type: 'profile' | 'signature' = 'profile') => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<{ url: string }>(`/employee/upload-image?type=${type}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
};

