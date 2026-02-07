import api from "../api";

export interface LeaveType {
    id: number;
    name: string;
    code: string;
    yearlyLimit: number;
    isCarryForward: boolean;
    description?: string;
}

export interface LeaveApplication {
    id: number;
    employeeId: number;
    employeeIdCard: string;
    employeeName: string;
    department: string;
    designation: string;
    leaveTypeId: number;
    leaveTypeName: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: string;
    appliedDate: string;
    remarks?: string;
    attachmentUrl?: string;
}

export interface LeaveBalance {
    leaveTypeId: number;
    leaveTypeName: string;
    totalAllocated: number;
    totalTaken: number;
    balance: number;
}

export const leaveService = {
    getLeaveTypes: async () => {
        const response = await api.get<LeaveType[]>("/Leave/types");
        return response.data;
    },
    getApplications: async (params: { employeeId?: number; status?: string } = {}) => {
        const response = await api.get<LeaveApplication[]>("/Leave/applications", { params });
        return response.data;
    },
    getApplication: async (id: number) => {
        const response = await api.get<LeaveApplication>(`/Leave/applications/${id}`);
        return response.data;
    },
    applyLeave: async (data: any) => {
        const response = await api.post("/Leave/apply", data);
        return response.data;
    },
    updateLeave: async (id: number, data: any) => {
        const response = await api.put(`/Leave/${id}`, data);
        return response.data;
    },
    deleteLeave: async (id: number) => {
        const response = await api.delete(`/Leave/${id}`);
        return response.data;
    },
    actionLeave: async (data: { id: number; status: string; remarks?: string }) => {
        const response = await api.post("/Leave/action", data);
        return response.data;
    },
    getBalance: async (employeeId: number) => {
        const response = await api.get<LeaveBalance[]>(`/Leave/balance/${employeeId}`);
        return response.data;
    },
    getMonthlyReport: async (params: { year: number; month: number }) => {
        const response = await api.get<any[]>("/Leave/monthly-report", { params });
        return response.data;
    },
    exportExcel: async () => {
        const response = await api.get("/Leave/export/excel", {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Leave_Applications.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
    exportPdf: async (id: number) => {
        const response = await api.get(`/Leave/export/pdf/${id}`, {
            responseType: 'blob'
        });
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Leave_Application_${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },
    exportWord: async (id: number) => {
        const response = await api.get(`/Leave/export/word/${id}`, {
            responseType: 'blob'
        });
        const blob = new Blob([response.data], { type: 'application/msword' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Leave_Application_${id}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
};
