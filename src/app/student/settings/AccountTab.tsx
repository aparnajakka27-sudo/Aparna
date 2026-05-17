"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Info, ArrowLeft, X, AlertTriangle } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AccountTab() {
  const router = useRouter();
  const [email] = useState(auth.currentUser?.email || 'Not connected');
  const [showPwModal, setShowPwModal] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isPersonal, setIsPersonal] = useState(false);
  const [showConvertMsg, setShowConvertMsg] = useState(false);
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const d = localStorage.getItem('dateforcode_account');
    if (d) { const p = JSON.parse(d); setIsPersonal(p.isPersonal||false); setCollege(p.college||''); setYear(p.year||''); setFullName(p.fullName||''); }
  }, []);

  const handleSaveAccount = () => {
    localStorage.setItem('dateforcode_account', JSON.stringify({ isPersonal, college, year, fullName }));
  };

  const handleChangePw = async () => {
    setPwError(''); setPwSuccess(false);
    if (newPw.length < 8) { setPwError('Password must be at least 8 characters'); return; }
    try {
      const user = auth.currentUser;
      if (!user || !user.email) { setPwError('No user signed in'); return; }
      const cred = EmailAuthProvider.credential(user.email, oldPw);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPw);
      setPwSuccess(true); setTimeout(() => { setShowPwModal(false); setPwSuccess(false); setOldPw(''); setNewPw(''); }, 1500);
    } catch { setPwError('Old password is incorrect or session expired'); }
  };

  const handleConvert = () => {
    const newVal = !isPersonal;
    setIsPersonal(newVal);
    localStorage.setItem('dateforcode_account', JSON.stringify({ isPersonal: newVal, college, year, fullName }));
    if (newVal) setShowConvertMsg(true);
  };

  const handleDeactivate = async () => { localStorage.setItem('dateforcode_deactivated', 'true'); await signOut(auth); router.push('/'); };
  const handleDeleteAccount = async () => { localStorage.clear(); await signOut(auth); router.push('/'); };

  return (
    <motion.div key="account" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
      <h2 className="text-xl font-serif font-bold mb-2">Account Management</h2>
      <p className="text-sm text-black/35 mb-8">Make changes to your personal information or account type.</p>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-black/5 p-8 shadow-sm space-y-8">
        {/* Email */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-black/30 mb-2 block">Your Account</label>
          <div className="max-w-md">
            <label className="text-[10px] text-black/25 mb-1 block">Email Address</label>
            <input type="text" value={email} readOnly className="w-full px-4 py-3 rounded-xl border border-black/8 text-sm bg-black/[0.02] text-black/50 cursor-not-allowed" />
          </div>
        </div>

        {/* Password */}
        <div className="flex items-center justify-between max-w-md">
          <div><label className="text-[10px] font-bold uppercase tracking-wider text-black/30">Password</label><p className="text-sm text-black/40 mt-1">••••••••</p></div>
          <button onClick={()=>setShowPwModal(true)} className="px-5 py-2 rounded-xl bg-black/5 text-xs font-bold uppercase tracking-wider text-black/50 hover:bg-black/10 hover:text-black transition-all">Change</button>
        </div>

        {/* Convert Account */}
        <div className="pt-4 border-t border-black/5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-black/30 mb-2 block">Convert to {isPersonal ? 'Business' : 'Personal'} Account</label>
          <p className="text-xs text-black/35 mb-3">{isPersonal ? 'Convert back to business account to regain access to matching rooms and mentor guidance.' : 'Convert to a personal account. You will no longer have access to matching rooms and mentor guidance.'}</p>
          <button onClick={handleConvert} className="px-5 py-2 rounded-xl border border-black/8 text-xs font-bold uppercase tracking-wider text-black/50 hover:border-[#FF4D6D]/30 hover:text-[#FF4D6D] transition-all">
            {isPersonal ? 'Convert to Business' : 'Convert Account'}
          </button>
          <AnimatePresence>{showConvertMsg && (
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="mt-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
              <p className="font-bold mb-1">⚠️ You no longer have access to:</p>
              <ul className="list-disc pl-4 space-y-1"><li>Matching Rooms — AI-based partner pairing</li><li>Mentor Guidance — Real-time mentor sessions</li></ul>
              <p className="mt-2 text-amber-500">Convert back to Business account to restore access.</p>
            </motion.div>
          )}</AnimatePresence>
        </div>

        {/* Personal Information */}
        <div className="pt-4 border-t border-black/5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-black/30 mb-4 block">Personal Information</label>
          <div className="space-y-4 max-w-md">
            <div><label className="text-[10px] text-black/25 mb-1 block">Full Name</label><input value={fullName} onChange={e=>setFullName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-black/8 text-sm focus:outline-none focus:border-[#FF4D6D]/40 focus:ring-2 focus:ring-[#FF4D6D]/10 transition-all bg-white/50" placeholder="Enter your full name" /></div>
            <div><label className="text-[10px] text-black/25 mb-1 block">College Name</label><input value={college} onChange={e=>setCollege(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-black/8 text-sm focus:outline-none focus:border-[#FF4D6D]/40 focus:ring-2 focus:ring-[#FF4D6D]/10 transition-all bg-white/50" placeholder="Enter your college name" /></div>
            <div><label className="text-[10px] text-black/25 mb-1 block">Year of Study</label>
              <select value={year} onChange={e=>setYear(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-black/8 text-sm focus:outline-none focus:border-[#FF4D6D]/40 transition-all bg-white/50">
                <option value="">Select year</option><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Graduate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Deactivation & Deletion */}
        <div className="pt-4 border-t border-black/5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-black/30 mb-4 block">Deactivation and Deletion</label>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-black/5">
              <div><p className="text-sm font-bold text-black/60">Deactivate account</p><p className="text-[10px] text-black/25">Temporarily hide your profile. You can reactivate anytime.</p></div>
              <button onClick={()=>setShowDeactivate(true)} className="px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-[10px] font-bold uppercase tracking-wider text-amber-600 hover:bg-amber-100 transition-colors">Deactivate</button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50/30">
              <div><p className="text-sm font-bold text-red-500">Delete your data and account</p><p className="text-[10px] text-black/25">Permanently delete your account. This cannot be undone.</p></div>
              <button onClick={()=>setShowDelete(true)} className="px-4 py-2 rounded-lg bg-red-500 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>

        {/* Reset & Save */}
        <div className="flex items-center gap-3 pt-4 border-t border-black/5">
          <button onClick={()=>{setFullName('');setCollege('');setYear('');}} className="px-6 py-3 rounded-xl border border-black/8 text-xs font-bold uppercase tracking-wider text-black/40 hover:text-black transition-all">Reset</button>
          <button onClick={handleSaveAccount} className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF8FA3] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF4D6D]/15 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">Save Changes</button>
        </div>
      </div>

      {/* ═══ Password Modal ═══ */}
      <AnimatePresence>{showPwModal && (<>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={()=>{setShowPwModal(false);setPwError('');setOldPw('');setNewPw('');}} />
        <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95}} transition={{type:'spring',damping:25}} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 p-8">
          <h3 className="text-xl font-serif font-bold text-center mb-6">Change your password</h3>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1"><label className="text-xs font-bold text-black/50">Old password</label><button className="text-xs text-[#FF4D6D] font-bold hover:underline">Forgot it?</button></div>
              <div className="relative"><input type={showOld?'text':'password'} value={oldPw} onChange={e=>setOldPw(e.target.value)} className="w-full px-4 py-3 pr-12 rounded-xl border border-black/10 text-sm focus:outline-none focus:border-[#FF4D6D]/40 focus:ring-2 focus:ring-[#FF4D6D]/10 transition-all" /><button onClick={()=>setShowOld(!showOld)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/25 hover:text-black/50">{showOld?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button></div>
            </div>
            <div>
              <label className="text-xs font-bold text-black/50 mb-1 block">New password</label>
              <div className="relative"><input type={showNew?'text':'password'} value={newPw} onChange={e=>setNewPw(e.target.value)} className="w-full px-4 py-3 pr-12 rounded-xl border border-black/10 text-sm focus:outline-none focus:border-[#FF4D6D]/40 focus:ring-2 focus:ring-[#FF4D6D]/10 transition-all" /><button onClick={()=>setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/25 hover:text-black/50">{showNew?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button></div>
              <p className="text-[10px] text-black/25 mt-1.5">Use 8 or more letters, numbers and symbols</p>
            </div>
            <button onClick={()=>setShowTips(true)} className="flex items-center gap-1.5 text-xs font-bold text-black/40 hover:text-black transition-colors"><Info className="w-3.5 h-3.5"/>Password tips</button>
            {pwError && <p className="text-xs text-red-500 font-bold">{pwError}</p>}
            {pwSuccess && <p className="text-xs text-green-500 font-bold">✓ Password changed successfully!</p>}
          </div>
          <div className="flex items-center justify-end gap-3 mt-8">
            <button onClick={()=>{setShowPwModal(false);setPwError('');setOldPw('');setNewPw('');}} className="px-6 py-3 rounded-xl bg-black/5 text-xs font-bold uppercase tracking-wider text-black/40 hover:bg-black/10 transition-all">Cancel</button>
            <button onClick={handleChangePw} disabled={!oldPw||!newPw} className="px-6 py-3 rounded-xl bg-black/5 text-xs font-bold uppercase tracking-wider text-black/40 hover:bg-black/10 transition-all disabled:opacity-30">Change Password</button>
          </div>
        </motion.div>
      </>)}</AnimatePresence>

      {/* ═══ Password Tips Modal ═══ */}
      <AnimatePresence>{showTips && (<>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]" onClick={()=>setShowTips(false)} />
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-[60] p-8">
          <h3 className="text-lg font-bold mb-3">Password tips</h3>
          <p className="text-sm text-black/50 mb-4">A strong password helps keep your account safe. Use at least 8 letters, numbers and symbols.</p>
          <p className="text-sm font-bold mb-2">What to avoid</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-black/50 mb-6"><li>Common passwords, words and names</li><li>Recent dates or dates associated with you</li><li>Simple patterns and repeated text</li></ul>
          <button onClick={()=>setShowTips(false)} className="w-full py-3 rounded-xl bg-[#FF4D6D] text-white text-sm font-bold uppercase tracking-wider hover:bg-[#E8456A] transition-colors">Okay</button>
        </motion.div>
      </>)}</AnimatePresence>

      {/* ═══ Deactivate Modal ═══ */}
      <AnimatePresence>{showDeactivate && (<>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={()=>setShowDeactivate(false)} />
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:30}} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 text-center relative">
            <button onClick={()=>setShowDeactivate(false)} className="absolute top-6 left-6 text-black/30 hover:text-black transition-colors"><ArrowLeft className="w-5 h-5"/></button>
            <h2 className="text-2xl font-serif font-bold mb-4">Deactivate your account</h2>
            <p className="text-sm text-black/40 mb-8 max-w-sm mx-auto">Deactivating your account means no one will see your profile and you won&apos;t be linked to any matching rooms or sessions anymore.</p>
            <div className="bg-black/[0.02] rounded-2xl p-6 mb-6 inline-block">
              <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center"><span className="text-sm">👤</span></div><p className="font-bold text-sm">@{JSON.parse(localStorage.getItem('dateforcode_profile')||'{}').username||'user'}</p></div>
              <p className="text-xs text-black/35">You can reactivate your account anytime.<br/>If you want to use DateForCode again, just log in with:</p>
              <p className="text-xs font-bold mt-2">{auth.currentUser?.email}</p>
            </div>
            <div><button onClick={handleDeactivate} className="px-8 py-3 rounded-xl border border-black/10 text-sm font-bold text-black/50 hover:bg-black/5 transition-all">Continue</button></div>
          </div>
        </motion.div>
      </>)}</AnimatePresence>

      {/* ═══ Delete Modal ═══ */}
      <AnimatePresence>{showDelete && (<>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={()=>setShowDelete(false)} />
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:30}} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 text-center relative">
            <button onClick={()=>setShowDelete(false)} className="absolute top-6 left-6 text-black/30 hover:text-black transition-colors"><ArrowLeft className="w-5 h-5"/></button>
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-serif font-bold mb-4 text-red-500">Delete your account</h2>
            <p className="text-sm text-black/40 mb-6 max-w-sm mx-auto">This will permanently delete your account, profile, coding sessions, matches, HP score, streaks — everything that belongs to you will be gone forever.</p>
            <p className="text-xs text-red-400 font-bold mb-8">This action cannot be undone.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={()=>setShowDelete(false)} className="px-6 py-3 rounded-xl border border-black/10 text-xs font-bold uppercase tracking-wider text-black/40 hover:bg-black/5 transition-all">Cancel</button>
              <button onClick={handleDeleteAccount} className="px-6 py-3 rounded-xl bg-red-500 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-600 transition-all">Continue & Delete</button>
            </div>
          </div>
        </motion.div>
      </>)}</AnimatePresence>
    </motion.div>
  );
}
