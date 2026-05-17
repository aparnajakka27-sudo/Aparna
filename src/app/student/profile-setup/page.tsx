"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Check, X, Rocket } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

const fadeUp = (d=0) => ({ initial:{opacity:0,y:30}, animate:{opacity:1,y:0}, transition:{duration:0.7,delay:d,ease:[0.16,1,0.3,1] as const} });

const AVATARS = [
  { id:'ninja', img:'https://api.dicebear.com/7.x/bottts/svg?seed=ninja', ring:'#6C5CE7', label:'Ninja' },
  { id:'astro', img:'https://api.dicebear.com/7.x/bottts/svg?seed=astro', ring:'#FF4D6D', label:'Astro' },
  { id:'pixel', img:'https://api.dicebear.com/7.x/bottts/svg?seed=pixel', ring:'#4D79FF', label:'Pixel' },
  { id:'cyber', img:'https://api.dicebear.com/7.x/bottts/svg?seed=cyber', ring:'#10B981', label:'Cyber' },
  { id:'nova', img:'https://api.dicebear.com/7.x/bottts/svg?seed=nova', ring:'#F97316', label:'Nova' },
  { id:'ghost', img:'https://api.dicebear.com/7.x/bottts/svg?seed=ghost', ring:'#6B7280', label:'Ghost' },
  { id:'spark', img:'https://api.dicebear.com/7.x/bottts/svg?seed=spark', ring:'#EC4899', label:'Spark' },
  { id:'zen', img:'https://api.dicebear.com/7.x/bottts/svg?seed=zen', ring:'#A855F7', label:'Zen' },
  { id:'blade', img:'https://api.dicebear.com/7.x/bottts/svg?seed=blade', ring:'#EF4444', label:'Blade' },
  { id:'storm', img:'https://api.dicebear.com/7.x/bottts/svg?seed=storm', ring:'#3B82F6', label:'Storm' },
  { id:'luna', img:'https://api.dicebear.com/7.x/bottts/svg?seed=luna', ring:'#8B5CF6', label:'Luna' },
  { id:'volt', img:'https://api.dicebear.com/7.x/bottts/svg?seed=volt', ring:'#F59E0B', label:'Volt' },
  { id:'frost', img:'https://api.dicebear.com/7.x/bottts/svg?seed=frost', ring:'#06B6D4', label:'Frost' },
  { id:'blaze', img:'https://api.dicebear.com/7.x/bottts/svg?seed=blaze', ring:'#DC2626', label:'Blaze' },
  { id:'sage', img:'https://api.dicebear.com/7.x/bottts/svg?seed=sage', ring:'#059669', label:'Sage' },
  { id:'echo', img:'https://api.dicebear.com/7.x/bottts/svg?seed=echo', ring:'#7C3AED', label:'Echo' },
];

const SKILLS = [
  { name:'JavaScript', color:'#D97706' }, { name:'TypeScript', color:'#3178C6' },
  { name:'Python', color:'#3776AB' }, { name:'React', color:'#61DAFB' },
  { name:'Next.js', color:'#000' }, { name:'Node.js', color:'#339933' },
  { name:'Java', color:'#ED8B00' }, { name:'C++', color:'#00599C' },
  { name:'HTML/CSS', color:'#E34F26' }, { name:'MongoDB', color:'#47A248' },
  { name:'SQL', color:'#4479A1' }, { name:'Git', color:'#F05032' },
  { name:'Docker', color:'#2496ED' }, { name:'AWS', color:'#FF9900' },
  { name:'Flutter', color:'#02569B' }, { name:'Rust', color:'#CE422B' },
  { name:'Go', color:'#00ADD8' }, { name:'Swift', color:'#FA7343' },
];

const CODE_CHARS = ['</>','{..}','( )','=> ','[ ]','/**/',';','::','&&','||','!=','++'];

export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  React.useEffect(() => {
    if (localStorage.getItem('dateforcode_student_setup')) {
      router.push('/student/dashboard');
    }
  }, [router]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s=>s!==skill) : prev.length < 8 ? [...prev, skill] : prev);
  };

  const canProceed = () => {
    if (step === 0) return username.trim().length >= 3;
    if (step === 1) return selectedAvatar !== '';
    if (step === 2) return selectedSkills.length >= 1;
    return true;
  };

  const handleFinish = () => {
    const profile = { username, avatar: selectedAvatar, skills: selectedSkills, bio };
    localStorage.setItem('dateforcode_profile', JSON.stringify(profile));
    localStorage.setItem('dateforcode_student_setup', 'true');
    setShowPreview(true);
  };

  const avatarData = AVATARS.find(a=>a.id===selectedAvatar);

  const steps = [
    { title: "What should we call you?", sub: "Choose a unique username for your coding journey" },
    { title: "Pick your avatar", sub: "Express your coding personality — choose your bot" },
    { title: "What's in your toolbox?", sub: "Select the technologies you know (max 8)" },
    { title: "Tell us about yourself", sub: "A quick bio so your partner knows who they're coding with" },
  ];

  return (
    <main className="relative min-h-screen bg-[#FDFDFD] overflow-hidden selection:bg-[#FF4D6D]/20">
      {/* Animated grid background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)',
          backgroundSize:'40px 40px'
        }} />
        {CODE_CHARS.map((c,i) => (
          <div key={i} className="absolute text-black/[0.03] font-mono font-bold select-none" style={{
            fontSize:`${16+i*4}px`, left:`${3+i*8}%`, top:`${5+((i*27)%80)}%`,
            animation:`floatSlow ${6+i*1.2}s ease-in-out infinite ${i*0.5}s`
          }}>{c}</div>
        ))}
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#FF4D6D]/[0.03] rounded-full blur-[150px]" style={{animation:'floatSlow 10s ease-in-out infinite'}} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#4D79FF]/[0.03] rounded-full blur-[120px]" style={{animation:'floatSlow 12s ease-in-out infinite 3s'}} />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-[#A855F7]/[0.03] rounded-full blur-[100px]" style={{animation:'floatSlow 8s ease-in-out infinite 5s'}} />
        <div className="absolute bottom-1/3 left-0 w-[300px] h-[300px] bg-[#10B981]/[0.03] rounded-full blur-[80px]" style={{animation:'floatSlow 9s ease-in-out infinite 2s'}} />
        {/* Animated rings */}
        <div className="absolute top-1/4 right-1/4 w-60 h-60 rounded-full border border-black/[0.02]" style={{animation:'spin 60s linear infinite'}} />
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full border border-black/[0.02]" style={{animation:'spin 45s linear infinite reverse'}} />
      </div>

      {/* Nav */}
      <nav className="relative z-20 py-5 px-8 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo showText={true} className="scale-[0.8] origin-left" />
        </div>
        <button onClick={()=> step > 0 ? setStep(step-1) : router.back()} className="flex items-center gap-2 text-black/30 text-xs font-bold uppercase tracking-wider hover:text-black transition-colors duration-300 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back
        </button>
      </nav>

      {/* Progress bar */}
      <div className="relative z-10 max-w-xl mx-auto px-6 mb-8">
        <div className="flex items-center gap-2">
          {[0,1,2,3].map(i => (
            <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-black/5">
              <motion.div
                initial={{width:0}}
                animate={{width: i <= step ? '100%' : '0%'}}
                transition={{duration:0.5,ease:[0.16,1,0.3,1]}}
                className="h-full rounded-full"
                style={{background: i <= step ? 'linear-gradient(90deg,#FF4D6D,#FF8FA3)' : 'transparent'}}
              />
            </div>
          ))}
        </div>
        <p className="text-[10px] text-black/25 font-bold uppercase tracking-wider mt-2 text-right">Step {step+1} of 4</p>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-xl mx-auto px-6 pb-20">
        <motion.div key={step} initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{duration:0.5,ease:[0.16,1,0.3,1]}}>
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF4D6D]/8 text-[#FF4D6D] text-[10px] font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-3 h-3" /> Profile Setup
            </motion.div>
            <motion.h1 {...fadeUp(0.05)} className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-3">{steps[step].title}</motion.h1>
            <motion.p {...fadeUp(0.1)} className="text-black/35 text-sm">{steps[step].sub}</motion.p>
          </div>

          {/* Step 0: Username */}
          {step === 0 && (
            <motion.div {...fadeUp(0.15)} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 p-8 shadow-xl shadow-black/[0.04]">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-black/20 group-focus-within:text-[#FF4D6D] transition-colors">@</div>
                <input
                  type="text" value={username} onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,''))}
                  placeholder="your_username" maxLength={20} autoFocus
                  className="w-full pl-12 pr-4 py-5 rounded-2xl border-2 border-black/8 text-lg font-mono focus:outline-none focus:border-[#FF4D6D]/40 focus:ring-4 focus:ring-[#FF4D6D]/10 transition-all duration-300 bg-transparent placeholder:text-black/15"
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-[10px] text-black/25 font-medium">Only lowercase, numbers, and underscores</p>
                <p className="text-[10px] font-bold" style={{color: username.length >= 3 ? '#10B981' : '#999'}}>{username.length}/20</p>
              </div>
              {username.length >= 3 && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#FF4D6D]/5 to-[#4D79FF]/5 border border-[#FF4D6D]/10">
                  <p className="text-sm text-black/50">Your profile will appear as <span className="font-bold text-[#FF4D6D]">@{username}</span></p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 1: Avatar */}
          {step === 1 && (
            <motion.div {...fadeUp(0.15)} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 p-8 shadow-xl shadow-black/[0.04]">
              <div className="grid grid-cols-4 gap-3 md:gap-4">
                {AVATARS.map((av,idx) => (
                  <motion.button key={av.id} initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} transition={{duration:0.3,delay:idx*0.03}}
                    onClick={()=>setSelectedAvatar(av.id)}
                    className="group relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300"
                    style={{
                      borderColor: selectedAvatar===av.id ? av.ring : 'rgba(0,0,0,0.04)',
                      background: selectedAvatar===av.id ? `${av.ring}08` : 'transparent',
                      transform: selectedAvatar===av.id ? 'scale(1.06)' : 'scale(1)',
                    }}
                  >
                    {selectedAvatar===av.id && (
                      <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center shadow-lg z-10" style={{background:av.ring}}>
                        <Check className="w-2.5 h-2.5 text-white" />
                      </motion.div>
                    )}
                    <div className="relative">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden group-hover:scale-110 transition-all duration-300" style={{border:`3px solid ${selectedAvatar===av.id ? av.ring : 'rgba(0,0,0,0.08)'}`, background:'#f8f8f8'}}>
                        <img src={av.img} alt={av.label} className="w-full h-full" />
                      </div>
                      {selectedAvatar===av.id && <div className="absolute -inset-1 rounded-full blur-md opacity-30" style={{background:av.ring,animation:'pulseGlow 2s ease infinite'}} />}
                    </div>
                    <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider" style={{color: selectedAvatar===av.id ? av.ring : 'rgba(0,0,0,0.25)'}}>{av.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Skills */}
          {step === 2 && (
            <motion.div {...fadeUp(0.15)} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 p-8 shadow-xl shadow-black/[0.04]">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] font-bold uppercase tracking-wider text-black/30">Select your skills</p>
                <p className="text-[10px] font-bold" style={{color: selectedSkills.length > 0 ? '#FF4D6D' : '#999'}}>{selectedSkills.length}/8 selected</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {SKILLS.map((skill,idx) => {
                  const active = selectedSkills.includes(skill.name);
                  return (
                    <motion.button key={skill.name} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.3,delay:idx*0.02}}
                      onClick={()=>toggleSkill(skill.name)}
                      className="relative px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border-2 overflow-hidden"
                      style={{
                        borderColor: active ? skill.color : 'rgba(0,0,0,0.06)',
                        background: active ? `${skill.color}10` : 'white',
                        color: active ? skill.color : 'rgba(0,0,0,0.35)',
                        transform: active ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      {active && (
                        <motion.div initial={{width:0}} animate={{width:'100%'}} className="absolute bottom-0 left-0 h-0.5" style={{background:skill.color}} />
                      )}
                      {skill.name}
                    </motion.button>
                  );
                })}
              </div>
              {selectedSkills.length > 0 && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-6 flex flex-wrap gap-2">
                  {selectedSkills.map(s => {
                    const sk = SKILLS.find(x=>x.name===s);
                    return <span key={s} className="px-3 py-1 rounded-lg text-[10px] font-bold text-white" style={{background:sk?.color||'#000'}}>{s}</span>;
                  })}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 3: Bio */}
          {step === 3 && (
            <motion.div {...fadeUp(0.15)} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 p-8 shadow-xl shadow-black/[0.04]">
              <div className="relative">
                <textarea
                  value={bio} onChange={e=>setBio(e.target.value)} maxLength={160}
                  placeholder="I'm a passionate developer who loves building things that matter. Looking for a coding partner to grow with..."
                  rows={5}
                  className="w-full p-5 rounded-2xl border-2 border-black/8 text-sm leading-relaxed resize-none focus:outline-none focus:border-[#FF4D6D]/40 focus:ring-4 focus:ring-[#FF4D6D]/10 transition-all duration-300 bg-transparent placeholder:text-black/15"
                />
                <p className="text-[10px] font-bold text-black/20 text-right mt-2">{bio.length}/160</p>
              </div>
            </motion.div>
          )}

          {/* Navigation buttons */}
          <motion.div {...fadeUp(0.25)} className="flex items-center justify-between mt-8">
            <button onClick={()=> step > 0 && setStep(step-1)} className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 group ${step===0?'opacity-0 pointer-events-none':'text-black/30 hover:text-black'}`}>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Previous
            </button>

            {step < 3 ? (
              <button onClick={()=>canProceed() && setStep(step+1)} disabled={!canProceed()}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#FF8FA3] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF4D6D]/20 hover:shadow-xl hover:shadow-[#FF4D6D]/30 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:shadow-lg group">
                Continue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            ) : (
              <button onClick={handleFinish}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#10B981]/20 hover:shadow-xl hover:shadow-[#10B981]/30 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 group">
                <Sparkles className="w-4 h-4" />
                Launch Profile
              </button>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* ═══ Profile Preview Popup ═══ */}
      <AnimatePresence>
        {showPreview && (
          <>
            {/* Backdrop */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={()=>setShowPreview(false)} />
            
            {/* Panel slides from right */}
            <motion.div
              initial={{x:'100%',opacity:0}} animate={{x:0,opacity:1}} exit={{x:'100%',opacity:0}}
              transition={{type:'spring',damping:30,stiffness:300}}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-8">
                {/* Close */}
                <button onClick={()=>setShowPreview(false)} className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors">
                  <X className="w-5 h-5 text-black/40" />
                </button>

                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#10B981] mb-2">🎉 Profile Created!</p>
                  <h2 className="text-2xl font-serif font-bold mb-8">You&apos;re All Set</h2>
                </motion.div>

                {/* Profile Card */}
                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
                  className="rounded-3xl bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] text-white p-8 relative overflow-hidden mb-8"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF4D6D]/10 rounded-full blur-[60px]" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#4D79FF]/10 rounded-full blur-[50px]" />
                  <div className="absolute inset-0 noise-bg" />

                  <div className="relative flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="relative mb-5">
                      <div className="w-24 h-24 rounded-full overflow-hidden shadow-2xl" style={{border:`4px solid ${avatarData?.ring || '#666'}`,boxShadow:`0 0 30px ${avatarData?.ring || '#666'}40`}}>
                        <img src={avatarData?.img || ''} alt="avatar" className="w-full h-full" style={{background:'#1a1a2e'}} />
                      </div>
                      <div className="absolute -inset-2 rounded-full blur-lg opacity-20" style={{background:avatarData?.ring,animation:'pulseGlow 3s ease infinite'}} />
                    </div>

                    {/* Username */}
                    <h3 className="text-xl font-bold mb-1">@{username}</h3>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-4">{avatarData?.label || 'Coder'}</p>

                    {/* Bio */}
                    {bio && <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">{bio}</p>}

                    {/* Skills */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {selectedSkills.map(s => {
                        const sk = SKILLS.find(x=>x.name===s);
                        return (
                          <span key={s} className="px-3 py-1 rounded-lg text-[10px] font-bold" style={{background:`${sk?.color||'#666'}20`,color:sk?.color||'#fff',border:`1px solid ${sk?.color||'#666'}30`}}>
                            {s}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>

                {/* Stats preview */}
                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4}} className="grid grid-cols-3 gap-3 mb-8">
                  {[{label:'HP Score',val:'0',icon:'⚡'},{label:'Matches',val:'0',icon:'🤝'},{label:'Rank',val:'—',icon:'🏆'}].map((s,i)=>(
                    <div key={i} className="bg-black/[0.02] rounded-2xl p-4 text-center">
                      <p className="text-lg mb-1">{s.icon}</p>
                      <p className="text-lg font-bold">{s.val}</p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-black/30">{s.label}</p>
                    </div>
                  ))}
                </motion.div>

                {/* CTA */}
                <motion.button initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
                  onClick={()=>router.push('/student/dashboard')}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-[#FF4D6D]/20 hover:shadow-xl hover:shadow-[#FF4D6D]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group"
                >
                  <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  Go to Dashboard
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
