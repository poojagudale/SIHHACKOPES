'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone, Car } from 'lucide-react';
import type { UserRole } from '@/types';

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  vehicleReg?: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] = [
  { value: 'driver', label: 'Driver', description: 'Bus / fleet vehicle operator' },
  { value: 'partner_rider', label: 'Partner Rider', description: 'Partner vehicle operator' },
  { value: 'citizen', label: 'Citizen', description: 'Report urban issues' },
  { value: 'officer', label: 'Officer / Admin', description: 'Monitor and respond to events' },
];

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: { role: 'driver' },
  });

  const selectedRole = watch('role');
  const password = watch('password');

  const onSubmit = async (_data: RegisterFormData) => {
    setIsLoading(true);
    // BACKEND INTEGRATION: POST /api/auth/register
    await new Promise((r) => setTimeout(r, 1400));
    setIsLoading(false);
    toast.success('Account created! Please sign in with your credentials.');
    onSwitchToLogin();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Create account</h2>
        <p className="text-sm text-muted-foreground">Join the UrbanEyeAI network</p>
      </div>

      {/* Full Name */}
      <div className="space-y-1.5">
        <label htmlFor="reg-name" className="block text-sm font-medium text-foreground">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="reg-name"
            type="text"
            placeholder="Rajan Shinde"
            className={`input-field w-full pl-10 pr-4 py-3 ${errors.fullName ? 'border-severity-critical' : ''}`}
            {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Name too short' } })}
          />
        </div>
        {errors.fullName && <p className="text-xs text-severity-critical">{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="reg-email" className="block text-sm font-medium text-foreground">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="reg-email"
            type="email"
            placeholder="rajan.shinde@example.com"
            className={`input-field w-full pl-10 pr-4 py-3 ${errors.email ? 'border-severity-critical' : ''}`}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
        </div>
        {errors.email && <p className="text-xs text-severity-critical">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <label htmlFor="reg-phone" className="block text-sm font-medium text-foreground">Mobile Number</label>
        <p className="text-[11px] text-muted-foreground">Indian mobile number — used for OTP verification</p>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+91</span>
          <input
            id="reg-phone"
            type="tel"
            placeholder="98765 43210"
            className={`input-field w-full pl-16 pr-4 py-3 ${errors.phone ? 'border-severity-critical' : ''}`}
            {...register('phone', {
              required: 'Mobile number is required',
              pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number' },
            })}
          />
        </div>
        {errors.phone && <p className="text-xs text-severity-critical">{errors.phone.message}</p>}
      </div>

      {/* Role */}
      <div className="space-y-1.5">
        <label htmlFor="reg-role" className="block text-sm font-medium text-foreground">Account Role</label>
        <p className="text-[11px] text-muted-foreground">Determines your access level and dashboard view</p>
        <div className="grid grid-cols-2 gap-2">
          {ROLE_OPTIONS.map((opt) => (
            <label
              key={`role-opt-${opt.value}`}
              className={`flex flex-col gap-0.5 p-3 rounded-lg border cursor-pointer transition-all duration-150 ${
                selectedRole === opt.value
                  ? 'border-primary bg-[rgba(0,212,255,0.08)]'
                  : 'border-border bg-input hover:border-border/80'
              }`}
            >
              <input
                type="radio"
                value={opt.value}
                className="sr-only"
                {...register('role', { required: true })}
              />
              <span className={`text-sm font-semibold ${selectedRole === opt.value ? 'text-primary' : 'text-foreground'}`}>
                {opt.label}
              </span>
              <span className="text-[11px] text-muted-foreground">{opt.description}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Vehicle Reg — shown for driver/partner */}
      {(selectedRole === 'driver' || selectedRole === 'partner_rider') && (
        <div className="space-y-1.5">
          <label htmlFor="reg-vehicle" className="block text-sm font-medium text-foreground">Vehicle Registration Number</label>
          <p className="text-[11px] text-muted-foreground">Format: MH09AB1234 — must match RTO records</p>
          <div className="relative">
            <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="reg-vehicle"
              type="text"
              placeholder="MH09AB1234"
              className={`input-field w-full pl-10 pr-4 py-3 uppercase font-mono tracking-widest ${errors.vehicleReg ? 'border-severity-critical' : ''}`}
              {...register('vehicleReg', {
                required: 'Vehicle registration is required for drivers',
                pattern: { value: /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/, message: 'Invalid format. Use MH09AB1234' },
              })}
            />
          </div>
          {errors.vehicleReg && <p className="text-xs text-severity-critical">{errors.vehicleReg.message}</p>}
        </div>
      )}

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="reg-password" className="block text-sm font-medium text-foreground">Password</label>
        <p className="text-[11px] text-muted-foreground">Min 8 characters, include uppercase, number, and symbol</p>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={`input-field w-full pl-10 pr-11 py-3 ${errors.password ? 'border-severity-critical' : ''}`}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters required' },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                message: 'Must include uppercase, number, and symbol',
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-severity-critical">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label htmlFor="reg-confirm" className="block text-sm font-medium text-foreground">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="reg-confirm"
            type="password"
            placeholder="••••••••"
            className={`input-field w-full pl-10 pr-4 py-3 ${errors.confirmPassword ? 'border-severity-critical' : ''}`}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (val) => val === password || 'Passwords do not match',
            })}
          />
        </div>
        {errors.confirmPassword && <p className="text-xs text-severity-critical">{errors.confirmPassword.message}</p>}
      </div>

      {/* Terms */}
      <div className="space-y-1">
        <div className="flex items-start gap-2">
          <input
            id="reg-terms"
            type="checkbox"
            className="w-4 h-4 mt-0.5 rounded border-border bg-input accent-primary flex-shrink-0"
            {...register('termsAccepted', { required: 'You must accept the terms to continue' })}
          />
          <label htmlFor="reg-terms" className="text-sm text-muted-foreground">
            I agree to the{' '}
            <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>{' '}
            and{' '}
            <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>
          </label>
        </div>
        {errors.termsAccepted && <p className="text-xs text-severity-critical ml-6">{errors.termsAccepted.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating account…</span>
          </>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
}