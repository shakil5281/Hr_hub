import api from "../api";

export interface MonthlySalarySheet {
    id: number;
    employeeId: number;
    employeeIdCard: string;
    employeeName: string;
    department: string;
    designation: string;
    year: number;
    month: number;
    monthName: string;
    grossSalary: number;
    basicSalary: number;
    totalDays: number;
    presentDays: number;
    absentDays: number;
    leaveDays: number;
    holidays: number;
    weekendDays: number;
    otHours: number;
    otAmount: number;
    attendanceBonus: number;
    otherAllowances: number;
    totalEarning: number;
    totalDeduction: number;
    netPayable: number;
    status: string;
}

export interface DailySalarySheet {
    id: number;
    employeeId: number;
    employeeIdCard: string;
    employeeName: string;
    department: string;
    designation: string;
    date: string;
    grossSalary: number;
    perDaySalary: number;
    attendanceStatus: string;
    otHours: number;
    otAmount: number;
    totalEarning: number;
    deduction: number;
    netPayable: number;
}

export interface SalarySummary {
    totalGrossSalary: number;
    totalOTAmount: number;
    totalDeductions: number;
    totalNetPayable: number;
    totalEmployees: number;
    departmentSummaries: {
        departmentName: string;
        totalAmount: number;
        employeeCount: number;
    }[];
}

export interface Payslip extends MonthlySalarySheet {
    joinedDate: string;
    bankAccountNo: string;
    paymentMethod: string;
    arrears: number;
    taxDeduction: number;
    pfContribution: number;
}

export interface AdvanceSalary {
    id: number;
    employeeId: number;
    employeeIdCard: string;
    employeeName: string;
    amount: number;
    requestDate: string;
    repaymentMonth: number;
    repaymentYear: number;
    status: string;
    remarks: string;
}

export interface SalaryIncrement {
    id: number;
    employeeId: number;
    employeeIdCard: string;
    employeeName: string;
    previousGrossSalary: number;
    incrementAmount: number;
    newGrossSalary: number;
    effectiveDate: string;
    incrementType: string;
    isApplied: boolean;
}

export interface Bonus {
    id: number;
    employeeId: number;
    employeeIdCard: string;
    employeeName: string;
    bonusType: string;
    amount: number;
    year: number;
    month: number;
    status: string;
}

export const payrollService = {
    getMonthlySheet: async (params: { year: number; month: number; departmentId?: number; searchTerm?: string }) => {
        const response = await api.get<MonthlySalarySheet[]>("/Payroll/monthly-sheet", { params });
        return response.data;
    },
    getDailySheet: async (params: { date: string; departmentId?: number; searchTerm?: string }) => {
        const response = await api.get<DailySalarySheet[]>("/Payroll/daily-sheet", { params });
        return response.data;
    },
    getSummary: async (year: number, month: number) => {
        const response = await api.get<SalarySummary>("/Payroll/summary", { params: { year, month } });
        return response.data;
    },
    getPayslip: async (id: number) => {
        const response = await api.get<Payslip>(`/Payroll/payslip/${id}`);
        return response.data;
    },
    processSalary: async (data: { year: number; month: number; departmentId?: number; employeeId?: number }) => {
        const response = await api.post("/Payroll/process", data);
        return response.data;
    },
    getAdvanceSalaries: async (params: { month?: number; year?: number }) => {
        const response = await api.get<AdvanceSalary[]>("/Payroll/advance-salary", { params });
        return response.data;
    },
    createAdvanceSalary: async (data: any) => {
        const response = await api.post("/Payroll/advance-salary", data);
        return response.data;
    },
    getIncrements: async () => {
        const response = await api.get<SalaryIncrement[]>("/Payroll/increments");
        return response.data;
    },
    createIncrement: async (data: any) => {
        const response = await api.post("/Payroll/increment", data);
        return response.data;
    },
    exportPaySlips: async (params: { year: number; month: number; departmentId?: number; searchTerm?: string }) => {
        const response = await api.get("/Payroll/export-monthly-sheet", {
            params,
            responseType: "blob"
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Salary_Sheet_${params.month}_${params.year}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
    getBonuses: async (params: { year: number; month?: number }) => {
        const response = await api.get<Bonus[]>("/Payroll/bonuses", { params });
        return response.data;
    },
    createBonus: async (data: any) => {
        const response = await api.post("/Payroll/bonus", data);
        return response.data;
    }
};
