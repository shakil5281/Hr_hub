import api from '../api';

export interface DailyOTSheet {
    id: number;
    employeeId: number;
    employeeIdCard: string;
    employeeName: string;
    department: string;
    designation: string;
    date: string;
    inTime: string | null;
    outTime: string | null;
    regularHours: number;
    otHours: number;
    remarks: string | null;
}

export interface OTSheetResponse {
    records: DailyOTSheet[];
    totalOTHours: number;
    totalEmployees: number;
}

export interface DailyOTSummary {
    id: number;
    department: string;
    employeeCount: number;
    totalOTHours: number;
    averageOTPerEmployee: number;
    totalRegularHours: number;
}

export interface OTSummaryResponse {
    departmentSummaries: DailyOTSummary[];
    grandTotalOTHours: number;
    totalEmployees: number;
    date: string;
}

export const overtimeService = {
    getDailyOTSheet: async (params: {
        date: string;
        departmentId?: number;
        designationId?: number;
        searchTerm?: string;
    }) => {
        const response = await api.get<OTSheetResponse>('/attendance/daily-ot-sheet', { params });
        return response.data;
    },

    getDailyOTSummary: async (date: string) => {
        const response = await api.get<OTSummaryResponse>('/attendance/daily-ot-summary', { params: { date } });
        return response.data;
    }
};
