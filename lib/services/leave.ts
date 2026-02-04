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
    applyLeave: async (data: any) => {
        const response = await api.post("/Leave/apply", data);
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
    }
};
