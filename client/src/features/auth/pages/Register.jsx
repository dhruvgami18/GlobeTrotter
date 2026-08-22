import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, Phone, MapPin, Globe2, UserPlus, AlertCircle } from 'lucide-react';
import AuthForm from '../components/AuthForm';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
});

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);

    try {
      await registerUser(data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Create Your Account"
      subtitle="Join thousands of travelers crafting memorable global journeys."
      footer={
        <p>
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        {serverError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{serverError}</span>
          </div>
        )}

        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name *"
            placeholder="Alex"
            icon={User}
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name *"
            placeholder="Explorer"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        {/* Email */}
        <Input
          label="Email Address *"
          type="email"
          placeholder="alex@globetrotter.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Password */}
        <Input
          label="Password *"
          type="password"
          placeholder="Minimum 6 characters"
          icon={Lock}
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Phone & City */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 555 0192"
            icon={Phone}
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="City"
            placeholder="Tokyo / New York"
            icon={MapPin}
            error={errors.city?.message}
            {...register('city')}
          />
        </div>

        {/* Country */}
        <Input
          label="Country"
          placeholder="Japan / United States"
          icon={Globe2}
          error={errors.country?.message}
          {...register('country')}
        />

        {/* Additional info / Bio */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Additional Information / Bio
          </label>
          <textarea
            rows={2}
            placeholder="Tell us a little bit about your travel interests..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 resize-none"
            {...register('bio')}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-3"
          isLoading={isLoading}
          icon={UserPlus}
        >
          Create Travel Account
        </Button>
      </form>
    </AuthForm>
  );
}
