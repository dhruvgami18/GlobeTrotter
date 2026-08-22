import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/ui/Loading';
import Button from '../components/ui/Button';

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading text="Verifying administrator credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-rose-200 shadow-xl text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Admin Privileges Required
        </h2>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          Your account ({user?.email}) does not have administrative permissions to
          access the platform analytics and user management dashboard.
        </p>
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center">
          <Link to="/dashboard">
            <Button variant="primary" className="flex items-center gap-1.5 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
