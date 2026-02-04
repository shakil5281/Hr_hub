import api from '../api';

export interface JobCardRecord {
    date: string;
    day: string;
    status: string;
    inTime: string | null;
    outTime: string | null;
    lateMinutes: number;
    earlyMinutes: number;
    otHours: number;
    totalHours: number;
    remarks: string | null;
}

export interface JobCardSummary {
    presentDays: number;
    absentDays: number;
    weekendDays: number;
    holidayDays: number;
    totalOTHours: number;
    totalLateMinutes: number;
    totalEarlyMinutes: number;
}

export interface EmployeeJobCard {
    employeeId: number;
    employeeIdCard: string;
    employeeName: string;
    department: string;
    designation: string;
    section: string;
    joiningDate: string | null;
    grade: string | null;
    shift: string | null;
}

export interface JobCardResponse {
    employee: EmployeeJobCard;
    summary: JobCardSummary;
    attendanceRecords: JobCardRecord[];
    fromDate: string;
    toDate: string;
}

export const jobCardService = {
    getJobCard: async (params: {
        employeeId: number;
        fromDate: string;
        toDate: string;
    }) => {
        const response = await api.get<JobCardResponse>('/attendance/job-card', { params });
        return response.data;
    }
};
