// localStorage-based session management for real backend

export type UserRole = "team" | "organizer";

export interface AuthUser {
    email: string;
    role: UserRole;
    data?: Record<string, unknown>;
    _id?: string;
    teamName?: string;
    organizerName?: string;
}

const SESSION_KEY = "huntSession";
const TEAM_KEY = "huntTeam";

export function setSession(user: AuthUser) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    if (user.role === 'team') {
        localStorage.setItem(TEAM_KEY, JSON.stringify(user));
    }
}

export function logout() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TEAM_KEY);
    // Add any other keys you need cleared
}

export function getSession(): AuthUser | null {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
}