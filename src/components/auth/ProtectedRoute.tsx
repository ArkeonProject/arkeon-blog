import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredProduct?: string;
}

export function ProtectedRoute({ children, requiredProduct }: ProtectedRouteProps) {
  const { user, loading, hasAccess } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredProduct && !hasAccess(requiredProduct)) {
    return <Navigate to="/guia-junior" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
