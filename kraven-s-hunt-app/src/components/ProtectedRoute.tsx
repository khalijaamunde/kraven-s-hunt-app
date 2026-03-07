import { Navigate } from "react-router-dom";
import { getSession } from "@/lib/auth";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRole?: "team" | "organizer";
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
    const session = getSession();

    if (!session) {
        // Not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && session.role !== allowedRole) {
        // Logged in but wrong role, redirect to appropriate dashboard
        return <Navigate to={session.role === "team" ? "/dashboard" : "/organizer"} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
