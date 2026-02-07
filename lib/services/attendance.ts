import api from '../api';

export interface AttendanceRecord {
    id: number;
    employeeId: number;
    employeeIdCard: string;
    employeeName: string;
    department: string;
    designation: string;
    shift: string;
    date: string;
    inTime: string | null;
    outTime: string | null;
    status: string;
    otHours: number;
}

export interface AttendanceSummary {
    totalHeadcount: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    leaveCount: number;
    attendanceRate: number;
}

export interface DepartmentDailySummary {
    id: number;
    departmentId: number;
    departmentName: string;
    totalEmployees: number;
    present: number;
    absent: number;
    late: number;
    onLeave: number;
    attendanceRate: number;
}

export interface SectionDailySummary {
    id: number;
    sectionId: number;
    sectionName: string;
    totalEmployees: number;
    present: number;
    absent: number;
    late: number;
    onLeave: number;
    attendanceRate: number;
}

export interface DesignationDailySummary {
    id: number;
    designationId: number;
    designationName: string;
    totalEmployees: number;
    present: number;
    absent: number;
    late: number;
    onLeave: number;
    attendanceRate: number;
}

export interface LineDailySummary {
    id: number;
    lineId: number;
    lineName: string;
    totalEmployees: number;
    present: number;
    absent: number;
    late: number;
    onLeave: number;
    attendanceRate: number;
}

export interface GroupDailySummary {
    id: number;
    groupId: number;
    groupName: string;
    totalEmployees: number;
    present: number;
    absent: number;
    late: number;
    onLeave: number;
    attendanceRate: number;
}

export interface DeptSectionDailySummary {
    id: string;
    departmentId: number;
    departmentName: string;
    sectionId: number;
    sectionName: string;
    totalEmployees: number;
    present: number;
    absent: number;
    late: number;
    onLeave: number;
    attendanceRate: number;
}

export interface DailySummaryResponse {
    overallSummary: AttendanceSummary;
    departmentSummaries: DepartmentDailySummary[];
    sectionSummaries: SectionDailySummary[];
    deptSectionSummaries: DeptSectionDailySummary[];
    designationSummaries: DesignationDailySummary[];
    lineSummaries: LineDailySummary[];
    groupSummaries: GroupDailySummary[];
}

export const attendanceService = {
    getDailyReport: async (params: {
        date: string;
        departmentId?: number;
        status?: string;
        searchTerm?: string;
    }) => {
        const response = await api.get<AttendanceRecord[]>('/attendance/daily-report', { params });
        return response.data;
    },

    getSummary: async (date: string) => {
        const response = await api.get<AttendanceSummary>('/attendance/summary', { params: { date } });
        return response.data;
    },

    getDailySummary: async (params: {
        date: string;
        departmentId?: number;
    }) => {
        const response = await api.get<DailySummaryResponse>('/attendance/daily-summary', { params });
        return response.data;
    },

    seedMock: async (date: string) => {
        const response = await api.post('/attendance/seed-mock', null, { params: { date } });
        return response.data;
    },

    processDailyData: async (data: {
        date?: string;
        startDate?: string;
        endDate?: string;
    }) => {
        const response = await api.post<{ message: string }>('/attendanceSync/process-daily', data);
        return response.data;
    },

    syncData: async (params: {
        dbPath?: string;
        startDate?: string;
        endDate?: string;
    }) => {
        const response = await api.post<{ message: string; count: number }>('/attendanceSync/sync', params);
        return response.data;
    },

    exportDailyReportExcel: async (params: {
        date: string;
        departmentId?: number;
        status?: string;
        searchTerm?: string;
    }) => {
        const response = await api.get('/attendance/daily-report/export/excel', {
            params,
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `DailyAttendanceReport_${params.date}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    exportDailyReportPdf: async (params: {
        date: string;
        departmentId?: number;
        status?: string;
        searchTerm?: string;
    }) => {
        const response = await api.get('/attendance/daily-report/export/pdf', {
            params,
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `DailyAttendanceReport_${params.date}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    exportDailySummaryExcel: async (params: {
        date: string;
        departmentId?: number;
    }) => {
        const response = await api.get('/attendance/daily-summary/export/excel', {
            params,
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `DailyAttendanceSummary_${params.date}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    exportDailySummaryPdf: async (params: {
        date: string;
        departmentId?: number;
    }) => {
        const response = await api.get('/attendance/daily-summary/export/pdf', {
            params,
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `DailyAttendanceSummary_${params.date}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    bulkManualEntry: async (data: {
        employeeIds: number[];
        date: string | Date;
        inTime?: string;
        outTime?: string;
        reason: string;
        status: string;
    }) => {
        const response = await api.post('/attendance/bulk-manual-entry', data);
        return response.data;
    },

    createManualEntry: async (data: {
        employeeId: number;
        date: string | Date;
        inTime?: string;
        outTime?: string;
        reason: string;
        status: string;
    }) => {
        // We can reuse bulk-manual-entry with single ID
        const response = await api.post('/attendance/bulk-manual-entry', {
            employeeIds: [data.employeeId],
            date: data.date,
            inTime: data.inTime,
            outTime: data.outTime,
            reason: data.reason,
            status: data.status
        });
        return response.data;
    },

    deleteAttendance: async (data: {
        employeeIds?: number[];
        fromDate: string;
        toDate: string;
        departmentId?: number;
        sectionId?: number;
    }) => {
        const response = await api.post('/attendance/delete-attendance', data);
        return response.data;
    }
};
