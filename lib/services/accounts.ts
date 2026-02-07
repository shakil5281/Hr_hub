import api from '../api';

export interface CashTransaction {
    id?: number;
    transactionDate: string;
    transactionType: string;
    amount: number;
    paymentMethod: string;
    referenceNumber: string;
    description?: string;
    branch: string;
    createdAt?: string;
}

export interface AccountsSummary {
    totalReceived: number;
    totalExpense: number;
    currentBalance: number;
    branchBalances: {
        branchName: string;
        balance: number;
    }[];
}

export interface BalanceSheet {
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
}

export const accountsService = {
    getTransactions: async (params?: { type?: string; branch?: string; fromDate?: string; toDate?: string }) => {
        const response = await api.get<CashTransaction[]>('/accounts/transactions', { params });
        return response.data;
    },

    receiveCash: async (data: CashTransaction) => {
        const response = await api.post<CashTransaction>('/accounts/receive', data);
        return response.data;
    },

    expenseCash: async (data: CashTransaction) => {
        const response = await api.post<CashTransaction>('/accounts/expense', data);
        return response.data;
    },

    getSummary: async () => {
        const response = await api.get<AccountsSummary>('/accounts/summary');
        return response.data;
    },

    getBalanceSheet: async () => {
        const response = await api.get<BalanceSheet>('/accounts/balance-sheet');
        return response.data;
    },

    updateTransaction: async (id: number, data: CashTransaction) => {
        const response = await api.put(`/accounts/${id}`, data);
        return response.data;
    },

    deleteTransaction: async (id: number) => {
        const response = await api.delete(`/accounts/${id}`);
        return response.data;
    },

    exportExcel: async (params?: { type?: string; branch?: string; fromDate?: string; toDate?: string }) => {
        const response = await api.get('/accounts/export/excel', {
            params,
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Transactions_${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    exportPdf: async (params?: { type?: string; branch?: string; fromDate?: string; toDate?: string }) => {
        const response = await api.get('/accounts/export/pdf', {
            params,
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Transactions_${new Date().toISOString().split('T')[0]}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};
