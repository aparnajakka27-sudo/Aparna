"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { auth, googleProvider, githubProvider } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';

const GithubIcon = ({className="w-5 h-5"}:{className?:string}) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>;
const GoogleIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;

const fadeUp = (d=0) => ({ initial:{opacity:0,y:30}, animate:{opacity:1,y:0}, transition:{duration:0.7,delay:d,ease:[0.16,1,0.3,1] as const} });
const CODE_CHARS = ['{','}','<','>','/',';','(',')','=','+','#','*'];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') || 'student').trim();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  React.useEffect(() => {
    if (localStorage.getItem('dateforcode_student_setup')) {
      router.push('/student/dashboard');
    } else if (localStorage.getItem('dateforcode_mentor_profile')) {
      router.push('/mentor/dashboard');
    }
  }, [router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isRegister) {
        if (password !== confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (fullName) await updateProfile(cred.user, { displayName: fullName });
        router.push(`/${role}/profile-setup`);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push(`/${role}/dashboard`);
      }
    } catch (err: unknown) {
      const e = err as { code?: string };
      switch (e.code) {
        case 'auth/user-not-found': setError('No account found with this email'); break;
        case 'auth/wrong-password': setError('Incorrect password'); break;
        case 'auth/email-already-in-use': setError('Email is already registered'); break;
        case 'auth/invalid-email': setError('Invalid email address'); break;
        case 'auth/invalid-credential': setError('Invalid email or password'); break;
        default: setError('Authentication failed. Please try again.');
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => { setError(''); setLoading(true); try { const result = await signInWithPopup(auth, googleProvider); const isNew = result.user.metadata.creationTime === result.user.metadata.lastSignInTime; router.push(isNew ? `/${role}/profile-setup` : `/${role}/dashboard`); } catch { setError('Google sign-in failed.'); } setLoading(false); };
  const handleGithub = async () => { setError(''); setLoading(true); try { const result = await signInWithPopup(auth, githubProvider); const isNew = result.user.metadata.creationTime === result.user.metadata.lastSignInTime; router.push(isNew ? `/${role}/profile-setup` : `/${role}/dashboard`); } catch { setError('GitHub sign-in failed.'); } setLoading(false); };

  return (
    <main className="relative min-h-screen bg-[#FDFDFD] overflow-hidden selection:bg-[#FF4D6D]/20">
      {/* Animated floating code symbols */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {CODE_CHARS.map((c,i) => (
          <div key={i} className="absolute text-black/[0.03] font-mono font-bold select-none" style={{
            fontSize:`${18+i*5}px`, left:`${5+i*8}%`, top:`${10+((i*29)%75)}%`,
            animation:`floatSlow ${7+i*1.5}s ease-in-out infinite ${i*0.5}s`
          }}>{c}</div>
        ))}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF4D6D]/4 rounded-full blur-[150px]" style={{animation:'floatSlow 10s ease-in-out infinite'}} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4D79FF]/4 rounded-full blur-[150px]" style={{animation:'floatSlow 12s ease-in-out infinite 3s'}} />
      </div>

      {/* Nav */}
      <nav className="relative z-20 py-5 px-8 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo showText={true} className="scale-[0.8] origin-left" />
          </Link>
        </div>
        <Link href="/" className="flex items-center gap-2 text-black/30 text-xs font-bold uppercase tracking-wider hover:text-black transition-colors duration-300 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back
        </Link>
      </nav>

      {/* Card */}
      <div className="relative z-10 flex items-center justify-center px-6 pt-2 pb-20">
        <motion.div {...fadeUp(0.1)} className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 p-10 relative overflow-hidden shadow-2xl shadow-black/[0.06]">
            {/* Animated top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF4D6D] via-[#4D79FF] to-[#FF4D6D]" style={{backgroundSize:'200% 100%',animation:'gradientShift 4s ease infinite'}} />
            {/* Corner glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FF4D6D]/8 rounded-full blur-[60px]" style={{animation:'floatSlow 6s ease-in-out infinite'}} />

            {/* Icon with pulse */}
            <motion.div {...fadeUp(0.2)} className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF4D6D] to-[#FF8FA3] flex items-center justify-center shadow-lg" style={{boxShadow:'0 8px 30px rgba(255,77,109,0.3)'}}>
                  {isRegister ? <User className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
                </div>
                <div className="absolute -inset-2 rounded-2xl bg-[#FF4D6D]/10 blur-xl" style={{animation:'pulseGlow 3s ease infinite'}} />
              </div>
            </motion.div>

            <motion.h2 {...fadeUp(0.25)} className="text-2xl font-serif font-bold text-center mb-2">
              {isRegister ? 'Create Account' : 'Welcome'}
            </motion.h2>
            <motion.p {...fadeUp(0.3)} className="text-center text-black/35 text-sm mb-8">
              {isRegister
                ? `Join DateForCode as a ${role === 'mentor' ? 'Mentor' : 'Student'}`
                : 'Where great code gets written together.'}
            </motion.p>

            {/* Error */}
            {error && (
              <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-xs text-center font-medium">
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailAuth}>
              <div className="space-y-4 mb-6">
                {isRegister && (
                  <motion.div {...fadeUp(0.35)}>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-black/35 mb-2 block">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/15 group-focus-within:text-[#FF4D6D] transition-colors duration-300" />
                      <input type="text" value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Your full name" required className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-black/8 text-sm focus:outline-none focus:border-[#FF4D6D]/40 focus:ring-2 focus:ring-[#FF4D6D]/10 transition-all duration-300 bg-white/50 placeholder:text-black/20" />
                    </div>
                  </motion.div>
                )}

                <motion.div {...fadeUp(isRegister ? 0.4 : 0.35)}>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/35 mb-2 block">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/15 group-focus-within:text-[#FF4D6D] transition-colors duration-300" />
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-black/8 text-sm focus:outline-none focus:border-[#FF4D6D]/40 focus:ring-2 focus:ring-[#FF4D6D]/10 transition-all duration-300 bg-white/50 placeholder:text-black/20" />
                  </div>
                </motion.div>

                <motion.div {...fadeUp(isRegister ? 0.45 : 0.4)}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-black/35">Password</label>
                    {!isRegister && <button type="button" className="text-[10px] font-bold text-[#FF4D6D] hover:text-[#FF4D6D]/70 transition-colors">Forgot password?</button>}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/15 group-focus-within:text-[#FF4D6D] transition-colors duration-300" />
                    <input type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-black/8 text-sm focus:outline-none focus:border-[#FF4D6D]/40 focus:ring-2 focus:ring-[#FF4D6D]/10 transition-all duration-300 bg-white/50 placeholder:text-black/20" />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/15 hover:text-black/40 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                {isRegister && (
                  <motion.div {...fadeUp(0.5)}>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-black/35 mb-2 block">Confirm Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/15 group-focus-within:text-[#FF4D6D] transition-colors duration-300" />
                      <input type={showConfirmPassword?'text':'password'} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="••••••••" required className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-black/8 text-sm focus:outline-none focus:border-[#FF4D6D]/40 focus:ring-2 focus:ring-[#FF4D6D]/10 transition-all duration-300 bg-white/50 placeholder:text-black/20" />
                      <button type="button" onClick={()=>setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/15 hover:text-black/40 transition-colors">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Submit button */}
              <motion.button {...fadeUp(isRegister ? 0.55 : 0.45)} type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-[#FF4D6D]/20 hover:shadow-xl hover:shadow-[#FF4D6D]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 relative overflow-hidden group">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Please wait...</> : isRegister ? 'Create Account' : 'Sign In'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B8A] to-[#FF4D6D] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div {...fadeUp(isRegister ? 0.6 : 0.5)} className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-black/8" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">or continue with</span>
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-black/8" />
            </motion.div>

            {/* Social buttons */}
            <motion.div {...fadeUp(isRegister ? 0.65 : 0.55)} className="grid grid-cols-2 gap-3">
              <button onClick={handleGoogle} disabled={loading} className="flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border border-black/8 text-sm font-medium hover:bg-black/[0.02] hover:border-black/15 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 group">
                <GoogleIcon />
                <span className="text-black/60 group-hover:text-black transition-colors">Google</span>
              </button>
              <button onClick={handleGithub} disabled={loading} className="flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border border-black/8 text-sm font-medium hover:bg-black/[0.02] hover:border-black/15 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 group">
                <GithubIcon className="w-5 h-5 text-black/60 group-hover:text-black transition-colors" />
                <span className="text-black/60 group-hover:text-black transition-colors">GitHub</span>
              </button>
            </motion.div>

            {/* Toggle */}
            <motion.p {...fadeUp(isRegister ? 0.7 : 0.6)} className="text-center text-sm text-black/35 mt-8">
              {isRegister ? 'Already have an account? ' : 'First time here? '}
              <button onClick={()=>{setIsRegister(!isRegister);setError('');}} className="text-[#FF4D6D] font-bold hover:text-[#FF4D6D]/70 transition-colors underline underline-offset-2 decoration-[#FF4D6D]/30 hover:decoration-[#FF4D6D]">
                {isRegister ? 'Sign In' : 'Register your account'}
              </button>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF4D6D]/20 border-t-[#FF4D6D] rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </React.Suspense>
  );
}
