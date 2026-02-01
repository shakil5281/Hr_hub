"use client"

import * as React from "react"
import { authService, User, LoginResponse } from "@/lib/services/auth"
import { useRouter } from "next/navigation"
import { FullScreenLoading } from "@/components/loading-state"

interface LoginCredentials {
    username: string;
    password: string;
    rememberMe?: boolean;
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (credentials: LoginCredentials) => Promise<LoginResponse>
    logout: () => void
    hasRole: (role: string) => boolean
    hasPermission: (permission: string) => boolean
    hasAnyRole: (roles: string[]) => boolean
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [initializing, setInitializing] = React.useState(true)
    const router = useRouter()

    React.useEffect(() => {
        const initAuth = async () => {
            // Only run on client-side
            if (typeof window === 'undefined') {
                setLoading(false);
                setInitializing(false);
                return;
            }

            if (authService.isAuthenticated()) {
                try {
                    // Fetch fresh profile data from server
                    const profile = await authService.getProfile();
                    if (profile && profile.roles && profile.roles.length > 0) {
                        // Only set user when we have complete data with roles
                        setUser(profile);
                        // Update localStorage with fresh data
                        localStorage.setItem('user', JSON.stringify({
                            username: profile.username,
                            fullName: profile.fullName,
                            roles: profile.roles
                        }));

                        // Add delay to ensure data is fully propagated
                        await new Promise(resolve => setTimeout(resolve, 800));
                    } else {
                        // No valid profile, clear auth
                        authService.logout();
                    }
                } catch (error) {
                    console.error("Failed to fetch profile", error);
                    // If token is invalid, logout
                    if ((error as any)?.response?.status === 401) {
                        authService.logout();
                    }
                }
            }

            setLoading(false)
            setInitializing(false)
        }
        initAuth()
    }, [])

    const login = async (credentials: LoginCredentials) => {
        const response = await authService.login(credentials)

        // Only show full-screen loading if login is successful
        if (response.success) {
            setInitializing(true) // Show loading screen during successful login
            setLoading(true)

            // Fetch full profile after login to populate roles/permissions
            try {
                const profile = await authService.getProfile();
                if (profile && profile.roles && profile.roles.length > 0) {
                    setUser(profile);
                    // Add delay to ensure UI updates properly
                    await new Promise(resolve => setTimeout(resolve, 800));
                } else {
                    // Fallback to basic info from login response
                    setUser({
                        username: response.username,
                        fullName: response.fullName,
                        roles: response.roles || []
                    } as User);
                }
            } catch (e) {
                console.error("Failed to fetch profile after login", e);
                // Fallback to basic info
                setUser({
                    username: response.username,
                    fullName: response.fullName,
                    roles: response.roles || []
                } as User);
            }

            setLoading(false)
            setInitializing(false)
        }

        return response
    }

    const logout = () => {
        authService.logout()
        setUser(null)
    }

    const hasRole = (role: string) => {
        if (!user || !user.roles) return false
        // SuperAdmin and Admin bypass - full access to all modules
        if (user.roles.includes("SuperAdmin") || user.roles.includes("Admin")) return true
        return user.roles.includes(role)
    }

    const hasAnyRole = (roles: string[]) => {
        if (!user || !user.roles) return false
        // SuperAdmin and Admin bypass - full access to all modules
        if (user.roles.includes("SuperAdmin") || user.roles.includes("Admin")) return true
        return roles.some(role => user.roles.includes(role))
    }

    const hasPermission = (permission: string) => {
        if (!user) return false
        // SuperAdmin and Admin bypass - full access to all permissions
        if (hasRole("SuperAdmin") || hasRole("Admin")) return true
        // TODO: Implement permission check if permissions are separated from roles
        return false
    }

    // Show full-screen loading during initialization
    if (initializing) {
        return <FullScreenLoading message="Initializing your workspace..." />
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, hasRole, hasPermission, hasAnyRole }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = React.useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
