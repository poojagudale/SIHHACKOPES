'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { DEMO_CREDENTIALS } from '@/data/mockData';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  autofillEmail?: string;
  autofillPassword?: string;
}

export default function LoginForm({ autofillEmail, autofillPassword }: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  useEffect(() => {
    if (autofillEmail) setValue('email', autofillEmail);
    if (autofillPassword) setValue('password', autofillPassword);
  }, [autofillEmail, autofillPassword, setValue]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    // BACKEND INTEGRATION: POST /api/auth/login with { email, password }
    await new Promise((r) => setTimeout(r, 1200));

    const cred = DEMO_CREDENTIALS.find(
      (c) => c.email === data.email && c.password === data.password
    );

    if (!cred) {
      setIsLoading(false);
      toast.error('Invalid credentials — use the demo accounts below to sign in');
      return;
    }

    toast.success(`Welcome back! Signed in as ${cred.label}`);
    setTimeout(() => {
      if (cred.role === 'driver' || cred.role === 'citizen' || cred.role === 'partner_rider') {
        router.push('/user-dashboard');
      } else {
        router.push('/admin-dashboard');
      }
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back</h2>
        <p className="text-sm text-muted-foreground">Sign in to your UrbanEyeAI account</p>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="login-email" className="block text-sm font-medium text-foreground">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="officer@urbaneye.ai"
            className={`input-field w-full pl-10 pr-4 py-3 ${errors.email ? 'border-severity-critical' : ''}`}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
            })}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-severity-critical">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="block text-sm font-medium text-foreground">
            Password
          </label>
          <button type="button" className="text-xs text-primary hover:underline">
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            className={`input-field w-full pl-10 pr-11 py-3 ${errors.password ? 'border-severity-critical' : ''}`}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
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
        {errors.password && (
          <p className="text-xs text-severity-critical">{errors.password.message}</p>
        )}
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-2">
        <input
          id="remember-me"
          type="checkbox"
          className="w-4 h-4 rounded border-border bg-input accent-primary"
          {...register('rememberMe')}
        />
        <label htmlFor="remember-me" className="text-sm text-muted-foreground">
          Keep me signed in for 30 days
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Signing in…</span>
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
}