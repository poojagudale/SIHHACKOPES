'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import DemoCredentialsBox from './DemoCredentialsBox';
import { Zap, Shield, Map, Activity } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import ThemeToggle from '@/components/ThemeToggle';


type AuthMode = 'login' | 'register';

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [autofillEmail, setAutofillEmail] = useState('');
  const [autofillPassword, setAutofillPassword] = useState('');

  const handleAutofill = (email: string, password: string) => {
    setAutofillEmail(email);
    setAutofillPassword(password);
    setMode('login');
  };

  const STATS = [
    { label: 'Events Detected Today', value: '1,284', icon: Activity },
    { label: 'Active Vehicles', value: '47', icon: Map },
    { label: 'Cases Resolved', value: '93%', icon: Shield },
    { label: 'Cities Covered', value: '3', icon: Zap },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] bg-gradient-to-br from-[#070B14] via-[#0A0E1A] to-[#0D1628] relative overflow-hidden flex-col justify-between p-12">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] blob-primary opacity-40" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px]" style={{ background: 'radial-gradient(circle at center, rgba(255,107,53,0.08), transparent 70%)', filter: 'blur(40px)' }} />
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <AppLogo size={44} />
            <div>
              <span className="text-xl font-bold text-foreground">
                UrbanEye<span className="text-primary">AI</span>
              </span>
              <p className="text-[11px] text-muted-foreground tracking-wider uppercase mt-0.5">Urban Intelligence Platform</p>
            </div>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-5">
            Every vehicle<br />
            <span className="text-primary">sees the city</span><br />
            for you.
          </h1>
          <p className="text-base text-muted-foreground max-w-md leading-relaxed">
            AI-powered sensing across public transport and fleet vehicles — detecting road defects, traffic violations, and safety events in real time across Kolhapur, Pune, and Mumbai.
          </p>
        </div>

        {/* Live stats */}
        <div className="relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot inline-block" />
            Live Platform Stats
          </p>
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={`stat-${stat.label}`}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-[11px] text-muted-foreground">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground font-tabular">{stat.value}</p>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground mt-6">
            Trusted by Kolhapur Municipal Corporation · MSRTC · Pune Smart City Mission
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 overflow-y-auto scrollbar-thin">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <AppLogo size={36} />
          <span className="text-lg font-bold text-foreground">
            UrbanEye<span className="text-primary">AI</span>
          </span>
        </div>

        <div className="w-full max-w-md">
          {/* Tab switcher */}
          <div className="flex bg-muted rounded-xl p-1 mb-8">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === 'login' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === 'register' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          {mode === 'login' ? (
            <LoginForm
              autofillEmail={autofillEmail}
              autofillPassword={autofillPassword}
            />
          ) : (
            <RegisterForm onSwitchToLogin={() => setMode('login')} />
          )}

          {/* Demo credentials */}
          <DemoCredentialsBox onAutofill={handleAutofill} />
        </div>
      </div>
    </div>
  );
}