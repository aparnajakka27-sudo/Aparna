"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Target, Users, Code, Gamepad2, Trophy, Bell, Settings, 
  ChevronRight, Zap, Flame, ArrowRight, CheckCircle2, Circle, Lock,
  TrendingUp, Calendar, Heart, LogOut, X, GitBranch, Swords, BookOpen, GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const fadeUp = (d=0) => ({ initial:{opacity:0,y:25}, animate:{opacity:1,y:0}, transition:{duration:0.6,delay:d,ease:[0.16,1,0.3,1] as const} });

// Progress helper
function getProgress() {
  if (typeof window === 'undefined') return {skillDone:false,matchDone:false,codeDone:false,hp:0,streak:0,matches:0,sessions:0,lastDate:''};
  try {
    const d = JSON.parse(localStorage.getItem('dateforcode_progress')||'{}');
    return {skillDone:!!d.skillDone,matchDone:!!d.matchDone,codeDone:!!d.codeDone,hp:d.hp||0,streak:d.streak||0,matches:d.matches||0,sessions:d.sessions||0,lastDate:d.lastDate||''};
  } catch { return {skillDone:false,matchDone:false,codeDone:false,hp:0,streak:0,matches:0,sessions:0,lastDate:''}; }
}

const SKILLS_COLORS: Record<string,string> = {
  'JavaScript':'#D97706','TypeScript':'#3178C6','Python':'#3776AB','React':'#61DAFB',
  'Next.js':'#000','Node.js':'#339933','Java':'#ED8B00','C++':'#00599C',
  'HTML/CSS':'#E34F26','MongoDB':'#47A248','SQL':'#4479A1','Git':'#F05032',
  'Docker':'#2496ED','AWS':'#FF9900','Flutter':'#02569B','Rust':'#CE422B',
  'Go':'#00ADD8','Swift':'#FA7343',
};

export default function StudentDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<{username:string,avatar:string,skills:string[],bio:string}|null>(null);
  const [hpCount, setHpCount] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [progress, setProgress] = useState(getProgress());
  const [showProfile, setShowProfile] = useState(false);
  const [lockModal, setLockModal] = useState<{show:boolean,title:string,msg:string,action?:string,href?:string}>({show:false,title:'',msg:''});
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('dateforcode_profile');
    if (saved) setProfile(JSON.parse(saved));
    const p = getProgress();
    setProgress(p);
    // Check streak
    const today = new Date().toISOString().split('T')[0];
    if (p.lastDate && p.lastDate !== today) {
      const last = new Date(p.lastDate), now = new Date(today);
      const diff = Math.floor((now.getTime()-last.getTime())/(1000*60*60*24));
      if (diff > 1) { p.streak = 0; localStorage.setItem('dateforcode_progress', JSON.stringify(p)); }
    }
    // Animate counters
    const hpTarget = p.hp, streakTarget = p.streak;
    let hp = 0, streak = 0;
    const interval = setInterval(() => {
      if (hp < hpTarget) { hp += Math.ceil((hpTarget-hp)/10); setHpCount(Math.min(hp,hpTarget)); }
      if (streak < streakTarget) { streak += 1; setStreakCount(streak); }
      setMatchCount(p.matches); setSessionCount(p.sessions);
      if (hp >= hpTarget && streak >= streakTarget) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Load notifications
  useEffect(() => {
    try {
      const n = JSON.parse(localStorage.getItem('dateforcode_notifications')||'[]');
      setNotifications(n);
    } catch(_){}
  }, []);

  const SIDEBAR_ITEMS = [
    { label:'Dashboard', icon:LayoutDashboard, href:'/student/dashboard', active:true },
    { label:'Skill Assessment', icon:Target, href:'/student/skill-assessment' },
    { label:'Matching', icon:Users, href:progress.skillDone?'/student/matching-room':'#', locked:!progress.skillDone },
    { label:'Coding Room', icon:Code, href:progress.matchDone?'/student/coding-room':'#', locked:!progress.matchDone },
    { label:'Gamification', icon:Gamepad2, href:'/student/gamification' },
    { label:'Challenges', icon:Zap, href:'/student/challenges' },
    { label:'Leaderboard', icon:Trophy, href:'/student/leaderboard' },
    { label:'Mentor Guidance', icon:GraduationCap, href:'/student/mentor-guidance' },
  ];

  const MATCHING_STEPS = [
    { step:1, title:'Skill Assessment', desc:'Test your coding skills across different domains to find your level.', icon:Target, status:progress.skillDone?'done':'ready' as string, color:'#FF4D6D', href:'/student/skill-assessment' },
    { step:2, title:'Matching Room', desc:'Our AI pairs you with compatible partners based on skill & style.', icon:Users, status:progress.matchDone?'done':progress.skillDone?'ready':'locked' as string, color:'#4D79FF', href:'/student/matching-room' },
    { step:3, title:'Coding Room', desc:'Pair up with your partner and start coding together in real-time.', icon:Code, status:progress.codeDone?'done':progress.matchDone?'ready':'locked' as string, color:'#10B981', href:'/student/coding-room' },
  ];

  const avatarImg = profile?.avatar ? `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.avatar}` : 'https://api.dicebear.com/7.x/bottts/svg?seed=default';

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] overflow-hidden">
      {/* ═══ Animated Background ═══ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0)',backgroundSize:'32px 32px'}} />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#FF4D6D]/[0.02] rounded-full blur-[120px]" style={{animation:'floatSlow 12s ease-in-out infinite'}} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-[#4D79FF]/[0.02] rounded-full blur-[100px]" style={{animation:'floatSlow 10s ease-in-out infinite 4s'}} />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-[#10B981]/[0.02] rounded-full blur-[80px]" style={{animation:'floatSlow 8s ease-in-out infinite 2s'}} />
        <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full border border-black/[0.015]" style={{animation:'spin 80s linear infinite'}} />
        <div className="absolute bottom-1/3 right-1/3 w-32 h-32 rounded-full border border-black/[0.015]" style={{animation:'spin 60s linear infinite reverse'}} />
      </div>

      {/* ═══ Sidebar ═══ */}
      <motion.aside initial={{x:-60,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:0.6}} className="w-64 bg-white/80 backdrop-blur-xl border-r border-black/5 flex flex-col relative z-10 flex-shrink-0">
        <div className="p-6 pb-4 flex items-center">
          <Logo showText={true} className="scale-[0.8] origin-left" />
        </div>

        <div className="px-4 mb-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-black/20 px-3">Menu</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {SIDEBAR_ITEMS.map((item,i) => (
            <motion.a key={item.label} href={(item as any).locked?'#':item.href} {...fadeUp(0.1+i*0.05)}
              onClick={e=>{
                if((item as any).locked){
                  e.preventDefault();
                  if(item.label==='Matching') setLockModal({show:true,title:'Matching Room Locked',msg:'You need to complete a Skill Assessment first before entering the Matching Room. Choose a stack and pass the test!',action:'Go to Skill Assessment',href:'/student/skill-assessment'});
                  else if(item.label==='Coding Room') setLockModal({show:true,title:'Coding Room Locked',msg:'Complete a Skill Assessment and find a partner in the Matching Room first. Or you can code solo in Challenges!',action:'Code by Yourself',href:'/student/challenges'});
                }
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-all duration-300 group ${item.active ? 'bg-[#FF4D6D]/8 text-[#FF4D6D]' : (item as any).locked ? 'text-black/15 cursor-not-allowed' : 'text-black/40 hover:text-black hover:bg-black/[0.02]'}`}>
              {(item as any).locked ? <Lock className="w-4 h-4 text-black/10" /> : <item.icon className={`w-4 h-4 ${item.active ? 'text-[#FF4D6D]' : 'text-black/25 group-hover:text-black/50'} transition-colors`} />}
              {item.label}
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />}
              {(item as any).locked && <Lock className="w-3 h-3 text-black/10 ml-auto" />}
            </motion.a>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 mt-auto">
          <div className="h-[1px] bg-black/5 mb-4" />
          <button onClick={async()=>{await signOut(auth);localStorage.clear();router.push('/');}} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 bg-red-50 border border-red-100 hover:text-red-600 hover:bg-red-100 hover:border-red-200 transition-all duration-300 group">
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* ═══ Main Content ═══ */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {/* Top bar */}
        <motion.header {...fadeUp(0)} className="sticky top-0 z-20 bg-white/60 backdrop-blur-xl border-b border-black/5 px-8 py-4 flex items-center justify-between">
          <div />
          <p className="text-[14px] font-black uppercase tracking-[0.6em] text-[#FF4D6D] font-mono absolute left-1/2 -translate-x-1/2 drop-shadow-sm">Match. Connect. Code.</p>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={()=>setShowNotifs(!showNotifs)} className="w-9 h-9 rounded-xl bg-black/[0.03] flex items-center justify-center hover:bg-black/[0.06] transition-colors relative">
                <Bell className="w-4 h-4 text-black/40" />
                {notifications.filter(n=>n.status==='pending').length > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#FF4D6D] text-white text-[8px] font-bold flex items-center justify-center">{notifications.filter(n=>n.status==='pending').length}</span>}
              </button>
              {/* Notifications Panel */}
              <AnimatePresence>
                {showNotifs && (
                  <motion.div initial={{opacity:0,y:10,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:10,scale:0.95}}
                    className="absolute right-0 top-12 w-80 bg-white rounded-2xl border border-black/5 shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-black/5 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111]">Notifications</span>
                      <button onClick={()=>setShowNotifs(false)}><X className="w-3.5 h-3.5 text-black/20"/></button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center"><p className="text-xs text-black/20">No notifications yet</p></div>
                      ) : notifications.map((n:any,i:number) => (
                        <div key={n.id||i} className="px-4 py-3 border-b border-black/[0.03] hover:bg-black/[0.01]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#FF4D6D]/10 flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-[#FF4D6D]"/>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-bold text-[#222] truncate"><span className="text-[#FF4D6D]">{n.from}</span> wants to pair with you!</p>
                              <p className="text-[9px] text-black/20">Pair request • Coding Challenge</p>
                            </div>
                          </div>
                          {n.status==='pending' ? (
                            <div className="flex gap-2 mt-2 ml-11">
                              <button onClick={()=>{ const updated = notifications.map((x:any)=>x.id===n.id?{...x,status:'accepted'}:x); setNotifications(updated); localStorage.setItem('dateforcode_notifications',JSON.stringify(updated)); router.push('/student/challenges'); }}
                                className="px-3 py-1.5 rounded-lg bg-[#FF4D6D] text-white text-[9px] font-bold">Accept</button>
                              <button onClick={()=>{ const updated = notifications.map((x:any)=>x.id===n.id?{...x,status:'declined'}:x); setNotifications(updated); localStorage.setItem('dateforcode_notifications',JSON.stringify(updated)); }}
                                className="px-3 py-1.5 rounded-lg border border-black/8 text-black/30 text-[9px] font-bold">Decline</button>
                            </div>
                          ) : (
                            <p className={`text-[9px] font-bold mt-1 ml-11 ${n.status==='accepted'?'text-green-500':'text-black/15'}`}>{n.status==='accepted'?'✓ Accepted':'✗ Declined'}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button onClick={()=>router.push('/student/settings')} className="w-9 h-9 rounded-xl bg-black/[0.03] flex items-center justify-center hover:bg-black/[0.06] transition-colors">
              <Settings className="w-4 h-4 text-black/40" />
            </button>
            <button onClick={()=>setShowProfile(true)} className="flex items-center gap-3 pl-3 border-l border-black/8 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="text-right">
                <p className="text-xs font-bold">{profile?.username || 'User'}</p>
                <p className="text-[9px] text-black/30 font-bold uppercase">Level 1</p>
              </div>
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#FF4D6D]/20">
                <img src={avatarImg} alt="avatar" className="w-full h-full" style={{background:'#f5f5f5'}} />
              </div>
            </button>
          </div>
        </motion.header>

        <div className="p-8">
          {/* ═══ Matching Steps Flow ═══ */}
          <motion.div {...fadeUp(0.1)} className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 rounded-full bg-[#FF4D6D]" />
              <h2 className="text-2xl font-serif font-bold">Your Matching Journey</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MATCHING_STEPS.map((s,i) => (
                <motion.div key={s.step} {...fadeUp(0.15+i*0.1)}
                  className="group relative bg-white/80 backdrop-blur-md rounded-2xl border border-black/5 p-6 overflow-hidden"
                  style={{transition:'all 0.5s cubic-bezier(0.16,1,0.3,1)'}}
                  onMouseEnter={e=>{if(s.status==='ready'){e.currentTarget.style.transform='translateY(-6px)';e.currentTarget.style.boxShadow=`0 20px 40px -10px ${s.color}15`;}}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{background:s.status==='ready'?s.color:'rgba(0,0,0,0.05)'}} />
                  
                  {/* Step connector */}
                  {i < 2 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ChevronRight className="w-5 h-5 text-black/10" />
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300`}
                        style={{
                          background: s.status==='ready' ? `${s.color}10` : 'rgba(0,0,0,0.03)',
                          border: `2px solid ${s.status==='ready' ? `${s.color}30` : 'rgba(0,0,0,0.05)'}`,
                        }}>
                        <s.icon className="w-5 h-5" style={{color: s.status==='ready' ? s.color : 'rgba(0,0,0,0.15)'}} />
                      </div>
                      {s.status==='ready' && <div className="absolute -inset-1 rounded-xl blur-md opacity-20" style={{background:s.color,animation:'pulseGlow 3s ease infinite'}} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider" style={{color: s.status==='ready' ? s.color : 'rgba(0,0,0,0.2)'}}>Step {s.step}</span>
                        {s.status==='ready' ? <Circle className="w-3 h-3 text-[#FF4D6D]" /> : s.status==='done' ? <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> : <Lock className="w-3 h-3 text-black/15" />}
                      </div>
                      <h3 className="font-bold text-base mb-1" style={{color: s.status==='locked' ? 'rgba(0,0,0,0.25)' : '#222'}}>{s.title}</h3>
                      <p className="text-[13px] text-black/35 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>

                  {s.status==='ready' && (
                    <motion.button initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
                      onClick={()=>router.push((s as any).href||'/student/skill-assessment')}
                      className="mt-4 w-full py-3 rounded-xl text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 group/btn hover:scale-[1.02] active:scale-[0.98]"
                      style={{background:`${s.color}10`,color:s.color,border:`1px solid ${s.color}20`}}
                    >
                      {s.step===1?'Start Assessment':s.step===2?'Find Partner':'Enter Room'}
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </motion.button>
                  )}
                  {s.status==='done' && (
                    <div className="mt-4 w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-600">
                      <CheckCircle2 className="w-3 h-3"/>Completed
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ═══ Stats Row ═══ */}
          <motion.div {...fadeUp(0.3)} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label:'HP Score', value:hpCount, icon:Zap, color:'#FF4D6D', suffix:' HP', glow:true },
              { label:'Day Streak', value:streakCount, icon:Flame, color:'#F97316', suffix:' days', glow:false },
              { label:'Matches', value:matchCount, icon:Heart, color:'#EC4899', suffix:'', glow:false },
              { label:'Sessions', value:sessionCount, icon:Code, color:'#4D79FF', suffix:'', glow:false },
            ].map((stat,i) => (
              <motion.div key={stat.label} {...fadeUp(0.35+i*0.05)}
                className="group bg-white/80 backdrop-blur-md rounded-2xl border border-black/5 p-5 relative overflow-hidden"
                style={{transition:'all 0.4s ease'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor=`${stat.color}20`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor='rgba(0,0,0,0.05)';}}
              >
                {stat.glow && <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{background:`${stat.color}10`}} />}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${stat.color}10`}}>
                    <stat.icon className="w-5 h-5" style={{color:stat.color}} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{color:'#222'}}>{stat.value}{stat.suffix}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-black/25">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ═══ Two Column: Weekly Activity + Skill Progress ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
            {/* Weekly Activity */}
            <motion.div {...fadeUp(0.4)} className="lg:col-span-3 bg-white/80 backdrop-blur-md rounded-2xl border border-black/5 p-6 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-5 rounded-full bg-[#FF4D6D]" />
                <h3 className="font-bold text-sm">Weekly Coding Activity</h3>
              </div>
              <p className="text-[10px] text-black/25 ml-3 mb-6">Sessions completed in the last 7 days</p>
              <div className="flex items-end gap-3 h-40">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day,i) => {
                  const todayIdx = new Date().getDay();
                  const adjustedIdx = todayIdx === 0 ? 6 : todayIdx - 1;
                  const hasSession = progress.sessions > 0;
                  const heights = [0,0,0,0,0,0,0];
                  if (hasSession) { heights[adjustedIdx] = Math.min(90, 30 + progress.sessions * 15); }
                  if (progress.streak > 1 && adjustedIdx > 0) { const streakBars = [25,40,55,35,50,45]; for(let j=Math.max(0,adjustedIdx-progress.streak+1);j<adjustedIdx;j++) heights[j]=streakBars[j%6]; }
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{height:0}} animate={{height:`${heights[i]}%`}}
                        transition={{duration:0.8,delay:0.5+i*0.08,ease:[0.16,1,0.3,1]}}
                        className="w-full rounded-xl min-h-[4px]"
                        style={{background: heights[i] > 0 ? 'linear-gradient(180deg,#FF4D6D,#FF8FA3)' : 'rgba(0,0,0,0.04)'}}
                      />
                      <span className={`text-[9px] font-bold ${i===adjustedIdx?'text-[#FF4D6D]':'text-black/20'}`}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Skill Progress */}
            <motion.div {...fadeUp(0.45)} className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl border border-black/5 p-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-5 rounded-full bg-[#4D79FF]" />
                <h3 className="font-bold text-sm">Skill Progress</h3>
              </div>
              <p className="text-[10px] text-black/25 ml-3 mb-6">Mastery in your chosen stack</p>
              <div className="space-y-5">
                {(profile?.skills || ['JavaScript','Python','React']).slice(0,4).map((skill,i) => {
                  const pct = progress.codeDone ? Math.min(95, 15 + progress.sessions * 10 + i * 5) : 0;
                  return (
                    <div key={skill}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-black/50">{skill}</span>
                        <span className="text-[10px] font-bold text-[#FF4D6D]">{pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-black/[0.04] overflow-hidden">
                        <motion.div
                          initial={{width:0}} animate={{width:`${pct}%`}}
                          transition={{duration:1,delay:0.6+i*0.1,ease:[0.16,1,0.3,1]}}
                          className="h-full rounded-full bg-gradient-to-r from-[#FF4D6D] to-[#FF8FA3]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* ═══ Achievements Row ═══ */}
          <motion.div {...fadeUp(0.5)} className="bg-white/80 backdrop-blur-md rounded-2xl border border-black/5 p-6 mb-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 rounded-full bg-[#F59E0B]" />
              <h3 className="font-bold text-sm">Achievements</h3>
              <span className="text-[9px] font-bold text-black/20 ml-auto">{[progress.matchDone,progress.streak>=3,progress.codeDone,progress.matchDone,progress.hp>=50,progress.hp>=100].filter(Boolean).length} / 6 unlocked</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[
                {emoji:'🎯',name:'First Match',locked:!progress.matchDone},
                {emoji:'🔥',name:'3 Day Streak',locked:progress.streak<3},
                {emoji:'⚡',name:'Speed Coder',locked:!progress.codeDone},
                {emoji:'🤝',name:'Team Player',locked:!progress.matchDone},
                {emoji:'🏆',name:'50 HP',locked:progress.hp<50},
                {emoji:'💎',name:'100 HP',locked:progress.hp<100},
              ].map((ach,i) => (
                <motion.div key={ach.name} {...fadeUp(0.55+i*0.03)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${ach.locked ? 'border-black/5 opacity-40 grayscale' : 'border-[#F59E0B]/20 bg-[#F59E0B]/5'}`}
                >
                  <span className="text-2xl">{ach.emoji}</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-black/30 text-center">{ach.name}</span>
                  {!ach.locked && <CheckCircle2 className="w-3 h-3 text-[#F59E0B]"/>}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ═══ Explore & Build ═══ */}
          <motion.div {...fadeUp(0.55)} className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 rounded-full bg-[#10B981]" />
              <h2 className="text-xl font-serif font-bold">Explore & Build</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {title:'Play Games',desc:'Challenge your partner to live coding games and puzzles. Earn HP and climb the ranks together.',icon:Gamepad2,color:'#8B5CF6',bg:'from-[#8B5CF6] to-[#A78BFA]',emoji:'🎮',href:'/student/gamification'},
                {title:'Coding Challenges',desc:'Participate in timed coding battles with your partner. Solve problems, compete, and grow.',icon:Swords,color:'#F97316',bg:'from-[#F97316] to-[#FB923C]',emoji:'⚔️',href:'/student/challenges'},
                {title:'Mentor-Guided Coding',desc:'Code on your own with real-time guidance from experienced mentors who review and assist.',icon:BookOpen,color:'#06B6D4',bg:'from-[#06B6D4] to-[#22D3EE]',emoji:'📚',href:'/student/mentor-guidance'},
                {title:'Build & Push to GitHub',desc:'Build real projects with your partner and push them directly to GitHub. Ship code that matters.',icon:GitBranch,color:'#10B981',bg:'from-[#10B981] to-[#34D399]',emoji:'🚀',href:'#'},
              ].map((card,i) => (
                <motion.div key={card.title} {...fadeUp(0.6+i*0.05)}
                  onClick={()=>{if(card.href!=='#')router.push(card.href);}}
                  className="group bg-white/80 backdrop-blur-md rounded-2xl border border-black/5 p-6 relative overflow-hidden cursor-pointer"
                  style={{transition:'all 0.5s cubic-bezier(0.16,1,0.3,1)'}}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)';e.currentTarget.style.boxShadow=`0 20px 40px -10px ${card.color}18`;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{background:`linear-gradient(90deg,transparent,${card.color},transparent)`}} />
                  <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{background:`${card.color}08`}} />
                  <div className="relative flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.bg} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 flex-shrink-0`} style={{boxShadow:`0 8px 20px ${card.color}25`}}>
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm">{card.title}</h3>
                        <span className="text-base">{card.emoji}</span>
                      </div>
                      <p className="text-[11px] text-black/35 leading-relaxed">{card.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-black/10 flex-shrink-0 mt-1 group-hover:translate-x-1 group-hover:text-black/30 transition-all duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
 
          {/* ═══ Quick Actions ═══ */}
          <motion.div {...fadeUp(0.7)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {title:'Start Assessment',desc:'Test your skills now',icon:Target,color:'#FF4D6D',bg:'from-[#FF4D6D] to-[#FF8FA3]',href:'/student/skill-assessment'},
              {title:'View Leaderboard',desc:'See where you rank',icon:TrendingUp,color:'#4D79FF',bg:'from-[#4D79FF] to-[#6B8AFF]',href:'/student/leaderboard'},
              {title:'Daily Challenge',desc:'Earn bonus HP points',icon:Calendar,color:'#10B981',bg:'from-[#10B981] to-[#34D399]',href:'/student/challenges'},
            ].map((action,i) => (
              <motion.button key={action.title} {...fadeUp(0.75+i*0.05)} onClick={()=>router.push(action.href)}
                className="group bg-white/80 backdrop-blur-md rounded-2xl border border-black/5 p-5 text-left relative overflow-hidden"
                style={{transition:'all 0.4s ease'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow=`0 15px 30px -8px ${action.color}15`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background:`linear-gradient(90deg,transparent,${action.color},transparent)`}} />
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.bg} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{action.title}</h4>
                    <p className="text-[10px] text-black/30">{action.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-black/15 ml-auto group-hover:translate-x-1 group-hover:text-black/40 transition-all" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
 
      {/* ═══ Profile Slide Panel ═══ */}
      <AnimatePresence>
        {showProfile && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={()=>setShowProfile(false)} />
            <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',damping:30,stiffness:300}} className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl overflow-y-auto">
              <div className="p-8">
                <button onClick={()=>setShowProfile(false)} className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"><X className="w-5 h-5 text-black/40" /></button>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF4D6D] mb-2">Your Profile</p>
                <h2 className="text-xl font-serif font-bold mb-8">Profile Overview</h2>
 
                {/* Avatar + Name */}
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#FF4D6D]/20 shadow-xl" style={{boxShadow:'0 0 30px rgba(255,77,109,0.15)'}}>
                      <img src={avatarImg} alt="avatar" className="w-full h-full" style={{background:'#f5f5f5'}} />
                    </div>
                    <div className="absolute -inset-2 rounded-full blur-lg bg-[#FF4D6D]/5" style={{animation:'pulseGlow 3s ease infinite'}} />
                  </div>
                  <h3 className="text-lg font-bold">@{profile?.username || 'user'}</h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-black/25 mt-1">Level 1 • Student</p>
                  {profile?.bio && <p className="text-xs text-black/40 mt-3 leading-relaxed max-w-xs">{profile.bio}</p>}
                </div>
 
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[{label:'HP Score',val:`${hpCount} HP`,icon:'⚡',color:'#FF4D6D'},{label:'Streak',val:`${streakCount} days`,icon:'🔥',color:'#F97316'},{label:'Matches',val:`${matchCount}`,icon:'🤝',color:'#EC4899'},{label:'Sessions',val:`${sessionCount}`,icon:'💻',color:'#4D79FF'}].map(s=>(
                    <div key={s.label} className="p-4 rounded-2xl border border-black/5 bg-black/[0.01]">
                      <p className="text-lg mb-1">{s.icon}</p>
                      <p className="text-base font-bold">{s.val}</p>
                      <p className="text-[8px] font-bold uppercase tracking-wider text-black/25">{s.label}</p>
                    </div>
                  ))}
                </div>
 
                {/* Skills */}
                <div className="mb-8">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-black/30 mb-3">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {(profile?.skills || []).map(s=>(
                      <span key={s} className="px-3 py-1.5 rounded-lg text-[10px] font-bold" style={{background:`${SKILLS_COLORS[s]||'#666'}12`,color:SKILLS_COLORS[s]||'#666',border:`1px solid ${SKILLS_COLORS[s]||'#666'}25`}}>{s}</span>
                    ))}
                  </div>
                </div>
 
                {/* Actions */}
                <button onClick={()=>{setShowProfile(false);router.push('/student/settings?tab=edit-profile');}} className="w-full py-3 rounded-xl border border-black/8 text-xs font-bold uppercase tracking-wider text-black/40 hover:text-black hover:border-black/20 transition-all mb-3 text-center">Edit Profile</button>
                <button onClick={async()=>{await signOut(auth);localStorage.clear();router.push('/');}} className="w-full py-3 rounded-xl bg-red-50 border border-red-100 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-600 hover:bg-red-100 transition-all text-center">Logout</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
 
      {/* Lock Modal */}
      <AnimatePresence>
        {lockModal.show && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]" onClick={()=>setLockModal({show:false,title:'',msg:''})} />
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}} className="fixed inset-0 z-[61] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-black/5 shadow-2xl p-8 max-w-md w-full">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
                  <Lock className="w-7 h-7 text-amber-500"/>
                </div>
                <h3 className="text-lg font-black text-center text-[#111] mb-2">{lockModal.title}</h3>
                <p className="text-xs text-center text-black/35 leading-relaxed mb-6">{lockModal.msg}</p>
                <div className="flex gap-3">
                  <button onClick={()=>setLockModal({show:false,title:'',msg:''})} className="flex-1 py-3 rounded-xl border border-black/8 text-xs font-bold text-black/30 hover:text-black transition-all">Close</button>
                  {lockModal.action && lockModal.href && (
                    <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>{setLockModal({show:false,title:'',msg:''});router.push(lockModal.href!);}}
                      className="flex-1 py-3 rounded-xl bg-[#FF4D6D] text-white text-xs font-bold hover:bg-[#e04060] transition-all">
                      {lockModal.action}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
