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
    shiftId?: number;
    shiftName?: string;
    groupId?: number;
    groupName?: string;
    floorId?: number;
    floorName?: string;
    status: string;
    joinDate: string;
    profileImageUrl?: string;
    signatureImageUrl?: string;
    email?: string;
    phoneNumber?: string;
    presentAddress?: string;
    presentAddressBn?: string;
    presentDivisionId?: number;
    presentDistrictId?: number;
    presentThanaId?: number;
    presentPostOfficeId?: number;
    presentPostalCode?: string;

    permanentAddress?: string;
    permanentAddressBn?: string;
    permanentDivisionId?: number;
    permanentDistrictId?: number;
    permanentThanaId?: number;
    permanentPostOfficeId?: number;
    permanentPostalCode?: string;

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
    isOTEnabled: boolean;
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
    shiftId?: number;
    groupId?: number;
    floorId?: number;
    status: string;
    joinDate: string;
    email?: string;
    phoneNumber?: string;
    presentAddress?: string;
    presentAddressBn?: string;
    presentDivisionId?: number;
    presentDistrictId?: number;
    presentThanaId?: number;
    presentPostOfficeId?: number;
    presentPostalCode?: string;

    permanentAddress?: string;
    permanentAddressBn?: string;
    permanentDivisionId?: number;
    permanentDistrictId?: number;
    permanentThanaId?: number;
    permanentPostOfficeId?: number;
    permanentPostalCode?: string;
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
    isOTEnabled?: boolean;
}

export interface ManpowerSummary {
    totalEmployees: number;
    activeEmployees: number;
    onLeaveEmployees: number;
    inactiveEmployees: number;
    departmentSummary: SummaryItem[];
    designationSummary: SummaryItem[];
    genderSummary: SummaryItem[];
    statusSummary: SummaryItem[];
}

export interface SummaryItem {
    id: string | number;
    name: string;
    count: number;
    percentage: number;
}

export interface UpdateEmployeeDto extends CreateEmployeeDto {
    isActive: boolean;
    isOTEnabled: boolean;
}

export const employeeService = {
    getEmployees: async (params?: {
        departmentId?: number;
        sectionId?: number;
        designationId?: number;
        lineId?: number;
        shiftId?: number;
        groupId?: number;
        floorId?: number;
        status?: string;
        isActive?: boolean;
        searchTerm?: string;
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

    getManpower: async (params?: {
        departmentId?: number;
        sectionId?: number;
        designationId?: number;
        lineId?: number;
        shiftId?: number;
        groupId?: number;
        floorId?: number;
        status?: string;
        searchTerm?: string;
    }) => {
        const response = await api.get<Employee[]>('/manpower', { params });
        return response.data;
    },

    getManpowerSummary: async () => {
        const response = await api.get<ManpowerSummary>('/manpower/summary');
        return response.data;
    },
};

