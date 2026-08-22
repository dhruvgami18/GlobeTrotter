import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, KeyRound, Sparkles } from 'lucide-react';
import AuthForm from '../components/AuthForm';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <AuthForm
      title="Reset Your Password"
      subtitle="Enter the email associated with your GlobeTrotter account."
      footer={
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </Link>
      }
    >
      {isSubmitted ? (
        <div className="text-center space-y-4 py-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Reset Instructions Generated
            </h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              If an account with <strong className="text-slate-800">{email}</strong> exists, password reset instructions have been generated.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1 font-bold text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Demo Notice</span>
            </div>
            <p>
              In this local demo environment, you can log in directly with the demo credentials: <code className="bg-slate-200 px-1 rounded">demo@globetrotter.com</code> / <code className="bg-slate-200 px-1 rounded">demo123</code>.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/login">
              <Button variant="primary" className="w-full">
                Return to Sign In
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            icon={KeyRound}
          >
            Send Reset Instructions
          </Button>
        </form>
      )}
    </AuthForm>
  );
}
