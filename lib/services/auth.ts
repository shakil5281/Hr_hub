import api from '../api';

export interface LoginResponse {
    token: string;
    refreshToken: string;
    success: boolean;
    message: string;
    username: string;
    fullName: string;
    roles: string[];
}

export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    isActive: boolean;
    roles: string[];
}

export interface RoleDetails {
    id: string;
    name: string;
    userCount: number;
}

export interface PermissionDto {
    roleName: string;
    permissions: string[];
}

export interface UpdatePermissionDto {
    roleName: string;
    permissions: string[];
}

export interface UserProfileUpdateDto {
    fullName: string;
    email: string;
}

interface LoginCredentials {
    username: string;
    password: string;
    rememberMe?: boolean;
}

export const authService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.success) {
            // Store token in cookies for Middleware access
            document.cookie = `token=${response.data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify({
                username: response.data.username,
                fullName: response.data.fullName,
                roles: response.data.roles
            }));
        }
        return response.data;
    },

    async getUsers(): Promise<User[]> {
        const response = await api.get('/users');
        return response.data;
    },

    async createUser(userData: Partial<User> & { password: string; username: string }): Promise<{ success: boolean; message: string }> {
        const response = await api.post('/users', userData);
        return response.data;
    },

    async getRoles(): Promise<RoleDetails[]> {
        const response = await api.get('/users/roles');
        return response.data;
    },

    async createRole(roleName: string): Promise<{ success: boolean; message: string }> {
        const response = await api.post('/users/roles', { roleName });
        return response.data;
    },

    async assignRole(userId: string, roleName: string): Promise<{ success: boolean; message: string }> {
        const response = await api.post(`/users/${userId}/assign-role`, {
            userId,
            roleName
        });
        return response.data;
    },

    async removeRole(userId: string, roleName: string): Promise<{ success: boolean; message: string }> {
        const response = await api.post(`/users/${userId}/remove-role`, {
            userId,
            roleName
        });
        return response.data;
    },

    async getAllPermissions(): Promise<string[]> {
        const response = await api.get('/permissions/all');
        return response.data;
    },

    async getRolePermissions(roleName: string): Promise<PermissionDto> {
        const response = await api.get(`/permissions/${roleName}`);
        return response.data;
    },

    async updateRolePermissions(data: UpdatePermissionDto): Promise<{ success: boolean; message: string }> {
        const response = await api.post('/permissions/update', data);
        return response.data;
    },

    async updateUser(userId: string, data: Partial<User>): Promise<{ success: boolean; message: string }> {
        const response = await api.put(`/users/${userId}`, data);
        return response.data;
    },

    async updateProfile(data: UserProfileUpdateDto): Promise<{ success: boolean; message: string }> {
        const response = await api.put('/auth/profile', data);
        return response.data;
    },

    async getProfile(): Promise<User> {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    },

    logout: () => {
        // Clear cookie
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    getCurrentUser: () => {
        if (typeof window === 'undefined') return null;
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('token');
    }
};
