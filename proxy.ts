import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define which routes are public (don't require login)
const PUBLIC_PATHS = ['/login', '/register', '/forgot-password']

// Define route protection rules (RBAC)
// path: The URL prefix to protect
// roles: Array of roles that are allowed to access this path
// Note: SuperAdmin and Admin have full access to everything (checked in hasRole logic)
const roleRules = [
    // Administrator - SuperAdmin and Admin only
    { path: '/management/administrator', roles: ['SuperAdmin', 'Admin'] },

    // HR Specific
    { path: '/management/human-resource', roles: ['SuperAdmin', 'Admin', 'HR', 'Management', 'HR Officer'] },
    { path: '/management/attendance', roles: ['SuperAdmin', 'Admin', 'HR', 'Management', 'HR Officer'] },
    { path: '/management/leave', roles: ['SuperAdmin', 'Admin', 'HR', 'Management', 'HR Officer'] },

    // Base Management Access (Dashboard etc) - allows all management staff
    { path: '/management', roles: ['SuperAdmin', 'Admin', 'HR', 'Management', 'HR Officer', 'IT Officer'] },

    // Other Modules - Only SuperAdmin, Admin, and specific module users
    { path: '/production', roles: ['SuperAdmin', 'Admin', 'Production', 'ProductionManager'] },
    { path: '/accounts', roles: ['SuperAdmin', 'Admin', 'Accounts', 'Accountant', 'Account Officer'] },
    { path: '/store', roles: ['SuperAdmin', 'Admin', 'Store', 'StoreKeeper'] },
    { path: '/merchandising', roles: ['SuperAdmin', 'Admin', 'Merchandising', 'Merchandiser'] },
    { path: '/cutting', roles: ['SuperAdmin', 'Admin', 'Cutting'] },
]

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('token')?.value

    // Check if the current path is public
    const isPublicPath = PUBLIC_PATHS.some(path =>
        pathname === path || pathname.startsWith(`${path}/`)
    )

    // 1. If user is logged in and trying to access a public page (like /login), redirect to home
    if (token && isPublicPath) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // 2. If user is NOT logged in and trying to access a protected page
    if (!token && !isPublicPath) {
        // Exclude specific internal paths just in case, though matcher handles most
        const isNextInternal = pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')

        if (!isNextInternal && pathname !== '/favicon.ico') {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            url.searchParams.set('returnUrl', pathname)
            return NextResponse.redirect(url)
        }
    }

    // 3. RBAC Check (only if logged in and accessing a possibly restricted area)
    if (token && !isPublicPath) {
        // Sort rules by path length (descending) so we match more specific paths first
        const sortedRules = roleRules.sort((a, b) => b.path.length - a.path.length)
        const matchedRule = sortedRules.find(rule => pathname.startsWith(rule.path))

        if (matchedRule) {
            try {
                // Decode JWT payload to check roles without verifying signature (backend verifies data)
                const base64Url = token.split('.')[1]
                if (!base64Url) throw new Error("Invalid token")

                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
                const jsonPayload = atob(base64)
                const payload = JSON.parse(jsonPayload)

                // Role claim key from ASP.NET Identity
                const roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                const userRoles = payload[roleKey] || payload["role"] || []

                // Normalize to array
                const roles: string[] = Array.isArray(userRoles) ? userRoles : [userRoles]

                // SuperAdmin and Admin have full access to everything
                const hasRole = roles.some((r: string) => matchedRule.roles.includes(r) || r === 'SuperAdmin' || r === 'Admin')

                if (!hasRole) {
                    // Rewrite to unauthorized page
                    const url = request.nextUrl.clone()
                    url.pathname = '/unauthorized'
                    return NextResponse.rewrite(url)
                }

            } catch (e) {
                console.error("Proxy token parse error:", e)
                const url = request.nextUrl.clone()
                url.pathname = '/login'
                return NextResponse.redirect(url)
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        // Apply proxy to all paths except static files and internal Next.js routes
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
