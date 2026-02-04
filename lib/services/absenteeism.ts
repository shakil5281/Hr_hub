import api from '../api';

export interface AbsenteeismRecord {
    id: number;
    employeeId: number;
    employeeIdCard: string;
    employeeName: string;
    department: string;
    designation: string;
    date: string;
    status: string;
    consecutiveDays: number;
    remarks: string | null;
}

export interface AbsenteeismSummary {
    totalAbsent: number;
    absentWithoutLeave: number;
    onLeave: number;
    criticalCases: number;
}

export interface AbsenteeismResponse {
    summary: AbsenteeismSummary;
    records: AbsenteeismRecord[];
}

export const absenteeismService = {
    getAbsenteeismRecords: async (params: {
        fromDate: string;
        toDate: string;
        departmentId?: number;
        designationId?: number;
        searchTerm?: string;
    }) => {
        const response = await api.get<AbsenteeismResponse>('/attendance/absenteeism-records', { params });
        return response.data;
    }
};
