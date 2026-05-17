"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Shield, Eye, Download, Bell, Lock, Check, RotateCcw, Save, Camera, Search, Mic, LayoutDashboard, Target, Users, Code, Gamepad2, Trophy, Zap, GraduationCap, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import AccountTab from './AccountTab';

const fadeUp = (d=0) => ({ initial:{opacity:0,y:25}, animate:{opacity:1,y:0}, transition:{duration:0.6,delay:d,ease:[0.16,1,0.3,1] as const} });

const SIDEBAR_ITEMS = [
  {icon:LayoutDashboard,label:'Dashboard',href:'/student/dashboard'},
  {icon:Target,label:'Skill Assessment',href:'/student/skill-assessment'},
  {icon:Users,label:'Matching',href:'/student/matching-room'},
  {icon:Code,label:'Coding Room',href:'/student/coding-room'},
  {icon:Gamepad2,label:'Gamification',href:'/student/gamification'},
  {icon:Zap,label:'Challenges',href:'/student/challenges'},
  {icon:Trophy,label:'Leaderboard',href:'/student/leaderboard'},
  {icon:GraduationCap,label:'Mentor Guidance',href:'/student/mentor-guidance'},
  {icon:Settings,label:'Settings',href:'/student/settings'},
];

const TABS = [
  { id:'edit-profile', label:'Edit Profile', icon:User },
  { id:'account', label:'Account Management', icon:Shield },
  { id:'visibility', label:'Profile Visibility', icon:Eye },
  { id:'import', label:'Import Content', icon:Download },
  { id:'notifications', label:'Notifications', icon:Bell },
  { id:'privacy', label:'Privacy and Data', icon:Lock },
];

const SEARCH_ITEMS = [
  {label:'Edit Profile',desc:'Change your avatar, username, bio, skills',tab:'edit-profile'},
  {label:'Change Avatar',desc:'Update your profile picture',tab:'edit-profile'},
  {label:'Change Username',desc:'Update your display name',tab:'edit-profile'},
  {label:'Update Bio',desc:'Edit your profile bio',tab:'edit-profile'},
  {label:'Change Skills',desc:'Add or remove your coding skills',tab:'edit-profile'},
  {label:'Account Management',desc:'Email, password, account type',tab:'account'},
  {label:'Change Password',desc:'Update your login password',tab:'account'},
  {label:'Convert Account',desc:'Switch between personal and business',tab:'account'},
  {label:'College Name',desc:'Update your college information',tab:'account'},
  {label:'Year of Study',desc:'Update your current year',tab:'account'},
  {label:'Deactivate Account',desc:'Temporarily hide your profile',tab:'account'},
  {label:'Delete Account',desc:'Permanently delete your account and data',tab:'account'},
  {label:'Profile Visibility',desc:'Private profile, online status',tab:'visibility'},
  {label:'Private Profile',desc:'Hide skills, streaks, HP from others',tab:'visibility'},
  {label:'Online Status',desc:'Show or hide your active status',tab:'visibility'},
  {label:'Activity Sharing',desc:'Share coding stats with partners',tab:'visibility'},
  {label:'Leaderboard Visibility',desc:'Show or hide from leaderboard',tab:'visibility'},
  {label:'Import Content',desc:'Connect GitHub, LeetCode, LinkedIn',tab:'import'},
  {label:'Connect GitHub',desc:'Import repositories and contributions',tab:'import'},
  {label:'Connect LeetCode',desc:'Import problem-solving stats',tab:'import'},
  {label:'Notifications',desc:'Match alerts, challenge invites',tab:'notifications'},
  {label:'Match Notifications',desc:'Get notified when AI finds a partner',tab:'notifications'},
  {label:'Challenge Invites',desc:'Notifications for coding challenges',tab:'notifications'},
  {label:'Privacy and Data',desc:'Download data, clear history',tab:'privacy'},
  {label:'Download Data',desc:'Get a copy of all your data',tab:'privacy'},
  {label:'Clear History',desc:'Remove coding session history',tab:'privacy'},
];

const AVATARS = [
  { id:'ninja', img:'https://api.dicebear.com/7.x/bottts/svg?seed=ninja', ring:'#6C5CE7' },
  { id:'astro', img:'https://api.dicebear.com/7.x/bottts/svg?seed=astro', ring:'#FF4D6D' },
  { id:'pixel', img:'https://api.dicebear.com/7.x/bottts/svg?seed=pixel', ring:'#4D79FF' },
  { id:'cyber', img:'https://api.dicebear.com/7.x/bottts/svg?seed=cyber', ring:'#10B981' },
  { id:'nova', img:'https://api.dicebear.com/7.x/bottts/svg?seed=nova', ring:'#F97316' },
  { id:'ghost', img:'https://api.dicebear.com/7.x/bottts/svg?seed=ghost', ring:'#6B7280' },
  { id:'spark', img:'https://api.dicebear.com/7.x/bottts/svg?seed=spark', ring:'#EC4899' },
  { id:'zen', img:'https://api.dicebear.com/7.x/bottts/svg?seed=zen', ring:'#A855F7' },
  { id:'blade', img:'https://api.dicebear.com/7.x/bottts/svg?seed=blade', ring:'#EF4444' },
  { id:'storm', img:'https://api.dicebear.com/7.x/bottts/svg?seed=storm', ring:'#3B82F6' },
  { id:'luna', img:'https://api.dicebear.com/7.x/bottts/svg?seed=luna', ring:'#8B5CF6' },
  { id:'volt', img:'https://api.dicebear.com/7.x/bottts/svg?seed=volt', ring:'#F59E0B' },
  { id:'frost', img:'https://api.dicebear.com/7.x/bottts/svg?seed=frost', ring:'#06B6D4' },
  { id:'blaze', img:'https://api.dicebear.com/7.x/bottts/svg?seed=blaze', ring:'#DC2626' },
  { id:'sage', img:'https://api.dicebear.com/7.x/bottts/svg?seed=sage', ring:'#059669' },
  { id:'echo', img:'https://api.dicebear.com/7.x/bottts/svg?seed=echo', ring:'#7C3AED' },
];

const SKILLS = [
  { name:'JavaScript', color:'#D97706' },{ name:'TypeScript', color:'#3178C6' },
  { name:'Python', color:'#3776AB' },{ name:'React', color:'#61DAFB' },
  { name:'Next.js', color:'#000' },{ name:'Node.js', color:'#339933' },
  { name:'Java', color:'#ED8B00' },{ name:'C++', color:'#00599C' },
  { name:'HTML/CSS', color:'#E34F26' },{ name:'MongoDB', color:'#47A248' },
  { name:'SQL', color:'#4479A1' },{ name:'Git', color:'#F05032' },
  { name:'Docker', color:'#2496ED' },{ name:'AWS', color:'#FF9900' },
  { name:'Flutter', color:'#02569B' },{ name:'Rust', color:'#CE422B' },
  { name:'Go', color:'#00ADD8' },{ name:'Swift', color:'#FA7343' },
];

function Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'edit-profile');
  const [showAvatars, setShowAvatars] = useState(false);
  const [saved, setSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported in this browser'); return; }
    const r = new SR(); r.continuous = false; r.interimResults = false; r.lang = 'en-US';
    r.onresult = (e:any) => { setSearchQuery(e.results[0][0].transcript); setIsListening(false); };
    r.onerror = () => setIsListening(false);
    r.onend = () => setIsListening(false);
    recognitionRef.current = r; r.start(); setIsListening(true);
  };
  const [original, setOriginal] = useState({username:'',avatar:'',skills:[] as string[],bio:''});
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [bio, setBio] = useState('');

  useEffect(() => {
    const s = localStorage.getItem('dateforcode_profile');
    if (s) { const p = JSON.parse(s); setOriginal(p); setUsername(p.username||''); setAvatar(p.avatar||''); setSkills(p.skills||[]); setBio(p.bio||''); }
  }, []);

  const avatarImg = avatar ? `https://api.dicebear.com/7.x/bottts/svg?seed=${avatar}` : 'https://api.dicebear.com/7.x/bottts/svg?seed=default';
  const avData = AVATARS.find(a=>a.id===avatar);
  const filteredResults = searchQuery.trim().length > 0 ? SEARCH_ITEMS.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()) || i.desc.toLowerCase().includes(searchQuery.toLowerCase())) : [];
  const handleSave = () => { const p={username,avatar,skills,bio}; localStorage.setItem('dateforcode_profile',JSON.stringify(p)); setOriginal(p); setSaved(true); setTimeout(()=>setSaved(false),2000); };
  const handleReset = () => { setUsername(original.username); setAvatar(original.avatar); setSkills([...original.skills]); setBio(original.bio); setShowAvatars(false); };
  const toggleSkill = (s:string) => setSkills(p=>p.includes(s)?p.filter(x=>x!==s):p.length<8?[...p,s]:p);

  return (
    <main className="relative min-h-screen bg-[#FAFAFA]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0)',backgroundSize:'32px 32px'}} />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#FF4D6D]/[0.02] rounded-full blur-[120px]" style={{animation:'floatSlow 12s ease-in-out infinite'}} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-[#4D79FF]/[0.02] rounded-full blur-[100px]" style={{animation:'floatSlow 10s ease-in-out infinite 4s'}} />
        <div className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full border border-black/[0.015]" style={{animation:'spin 60s linear infinite'}} />
      </div>

      {/* Top bar with search */}
      <nav className="relative z-20 py-3 px-8 flex items-center border-b border-black/5 bg-white/60 backdrop-blur-xl gap-4">
        <button onClick={()=>router.push('/student/dashboard')} className="flex items-center gap-2 text-black/30 text-xs font-bold uppercase tracking-wider hover:text-black transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />Back
        </button>
        <div className="w-px h-5 bg-black/8" />
        <Logo showText={true} className="scale-[0.8] origin-left" />
        <div className="flex-1 max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search settings..." className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-black/[0.03] border border-transparent text-sm focus:outline-none focus:border-[#FF4D6D]/30 focus:bg-white transition-all placeholder:text-black/20" />
            <button onClick={startVoice} className={`absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isListening?'bg-[#FF4D6D] text-white scale-110':'text-black/20 hover:text-black/50 hover:bg-black/5'}`}><Mic className="w-3.5 h-3.5" /></button>
            {/* Search results dropdown */}
            <AnimatePresence>
              {filteredResults.length > 0 && (
                <motion.div initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-black/8 shadow-xl shadow-black/10 overflow-hidden z-50 max-h-72 overflow-y-auto">
                  {filteredResults.map((item,i) => (
                    <button key={i} onClick={()=>{setActiveTab(item.tab);setSearchQuery('');}} className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#FF4D6D]/5 transition-colors border-b border-black/[0.03] last:border-0">
                      <Search className="w-3.5 h-3.5 text-black/15 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0"><p className="text-sm font-bold text-black/60 truncate">{item.label}</p><p className="text-[10px] text-black/25 truncate">{item.desc}</p></div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex min-h-[calc(100vh-57px)]">
        {/* Icon strip */}
        <div className="w-14 flex-shrink-0 bg-white border-r border-black/5 flex flex-col items-center py-4 gap-1 relative z-30">
          {SIDEBAR_ITEMS.map((n)=>(
            <div key={n.label} className="relative group">
              <button onClick={()=>router.push(n.href)} className="w-10 h-10 rounded-xl flex items-center justify-center text-black/20 hover:text-[#FF4D6D] hover:bg-[#FF4D6D]/5 transition-all">
                <n.icon className="w-4 h-4" />
              </button>
              <div className="fixed ml-[3.5rem] -mt-8 px-3 py-1.5 rounded-lg bg-[#111] text-white text-[11px] font-bold whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 shadow-lg" style={{zIndex:9999}}>
                {n.label}
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#111] rotate-45" />
              </div>
            </div>
          ))}
        </div>

        {/* Settings sidebar */}
        <motion.div {...fadeUp(0.05)} className="w-48 flex-shrink-0 bg-white/30 backdrop-blur-md border-r border-black/5 p-4 relative z-10">
          <h1 className="text-base font-serif font-bold mb-5 px-2">Settings</h1>
          <div className="space-y-0.5">
            {TABS.map((tab,i)=>(
              <motion.button key={tab.id} {...fadeUp(0.1+i*0.03)} onClick={()=>setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-left transition-all duration-300 leading-tight ${activeTab===tab.id?'bg-[#FF4D6D]/8 text-[#FF4D6D]':'text-black/35 hover:text-black hover:bg-black/[0.02]'}`}>
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                <span className="break-words">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab==='edit-profile' && (
              <motion.div key="ep" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.4}}>
                <h2 className="text-xl font-serif font-bold mb-2">Edit Profile</h2>
                <p className="text-sm text-black/35 mb-8">Keep your personal details private. Information you add here is visible to anyone who can view your profile.</p>
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-black/5 p-8 shadow-sm">
                  {/* Photo */}
                  <div className="mb-8">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-black/30 mb-3 block">Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg" style={{border:`3px solid ${avData?.ring||'#ddd'}`}}><img src={avatarImg} alt="" className="w-full h-full" style={{background:'#f5f5f5'}} /></div>
                      <button onClick={()=>setShowAvatars(!showAvatars)} className="px-5 py-2 rounded-xl bg-black/5 text-xs font-bold uppercase tracking-wider text-black/50 hover:bg-black/10 transition-all flex items-center gap-2"><Camera className="w-3.5 h-3.5"/>Change</button>
                    </div>
                    <AnimatePresence>{showAvatars && (
                      <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="overflow-hidden">
                        <div className="grid grid-cols-8 gap-2 mt-4 p-4 bg-black/[0.02] rounded-2xl border border-black/5">
                          {AVATARS.map(av=>(
                            <button key={av.id} onClick={()=>{setAvatar(av.id);setShowAvatars(false);}} className="group relative">
                              <div className="w-12 h-12 rounded-full overflow-hidden group-hover:scale-110 transition-all" style={{border:`2px solid ${avatar===av.id?av.ring:'rgba(0,0,0,0.08)'}`,background:'#f8f8f8'}}><img src={av.img} alt="" className="w-full h-full"/></div>
                              {avatar===av.id && <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF4D6D] flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white"/></div>}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}</AnimatePresence>
                  </div>
                  {/* Username */}
                  <div className="mb-6"><label className="text-[10px] font-bold uppercase tracking-wider text-black/30 mb-2 block">Username</label>
                    <input type="text" value={username} onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,''))} maxLength={20} className="w-full max-w-md px-4 py-3 rounded-xl border border-black/8 text-sm font-mono focus:outline-none focus:border-[#FF4D6D]/40 focus:ring-2 focus:ring-[#FF4D6D]/10 transition-all bg-white/50"/>
                    <p className="text-[10px] text-black/20 mt-1.5">dateforcode.com/@{username}</p>
                  </div>
                  {/* Bio */}
                  <div className="mb-6"><label className="text-[10px] font-bold uppercase tracking-wider text-black/30 mb-2 block">About</label>
                    <textarea value={bio} onChange={e=>setBio(e.target.value)} maxLength={160} rows={3} className="w-full max-w-md px-4 py-3 rounded-xl border border-black/8 text-sm leading-relaxed resize-none focus:outline-none focus:border-[#FF4D6D]/40 focus:ring-2 focus:ring-[#FF4D6D]/10 transition-all bg-white/50" placeholder="Tell others about yourself..."/>
                    <p className="text-[10px] text-black/20 mt-1.5">{bio.length}/160</p>
                  </div>
                  {/* Skills */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3"><label className="text-[10px] font-bold uppercase tracking-wider text-black/30">Skills</label><span className="text-[10px] font-bold" style={{color:skills.length>0?'#FF4D6D':'#999'}}>{skills.length}/8</span></div>
                    <div className="flex flex-wrap gap-2 max-w-lg">
                      {SKILLS.map(sk=>{const a=skills.includes(sk.name);return(
                        <button key={sk.name} onClick={()=>toggleSkill(sk.name)} className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border" style={{borderColor:a?sk.color:'rgba(0,0,0,0.06)',background:a?`${sk.color}10`:'white',color:a?sk.color:'rgba(0,0,0,0.3)'}}>{sk.name}</button>
                      );})}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-black/5">
                    <button onClick={handleReset} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-black/8 text-xs font-bold uppercase tracking-wider text-black/40 hover:text-black transition-all"><RotateCcw className="w-3.5 h-3.5"/>Reset</button>
                    <button onClick={handleSave} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF8FA3] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF4D6D]/15 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"><Save className="w-3.5 h-3.5"/>{saved?'Saved ✓':'Save Changes'}</button>
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab==='account' && <AccountTab />}
            {activeTab==='visibility' && (
              <motion.div key="vis" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.4}}>
                <h2 className="text-xl font-serif font-bold mb-2">Profile Visibility</h2>
                <p className="text-sm text-black/35 mb-8">Manage how your profile can be viewed by other users.</p>
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-black/5 p-8 shadow-sm space-y-6">
                  <div className="pb-5 border-b border-black/5">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-bold text-black/70">Private Profile</p><p className="text-xs text-black/30 mt-1 max-w-md">When your profile is private, only your name is visible. Other users cannot see your skills, streaks, HP score, matches, or coding activity.</p></div>
                      <div className="w-11 h-6 rounded-full cursor-pointer bg-black/10 flex items-center justify-start px-0.5 transition-colors hover:bg-black/15"><div className="w-5 h-5 bg-white rounded-full shadow-sm"/></div>
                    </div>
                  </div>
                  <div className="pb-5 border-b border-black/5">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-bold text-black/70">Show Online Status</p><p className="text-xs text-black/30 mt-1">Let other users know when you are active on the platform.</p></div>
                      <div className="w-11 h-6 rounded-full cursor-pointer bg-[#FF4D6D] flex items-center justify-end px-0.5"><div className="w-5 h-5 bg-white rounded-full shadow-sm"/></div>
                    </div>
                  </div>
                  <div className="pb-5 border-b border-black/5">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-bold text-black/70">Activity Sharing</p><p className="text-xs text-black/30 mt-1">Share your weekly coding stats, streaks, and progress with your coding partners.</p></div>
                      <div className="w-11 h-6 rounded-full cursor-pointer bg-[#FF4D6D] flex items-center justify-end px-0.5"><div className="w-5 h-5 bg-white rounded-full shadow-sm"/></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-bold text-black/70">Show on Leaderboard</p><p className="text-xs text-black/30 mt-1">Display your ranking and HP score on the public leaderboard.</p></div>
                      <div className="w-11 h-6 rounded-full cursor-pointer bg-[#FF4D6D] flex items-center justify-end px-0.5"><div className="w-5 h-5 bg-white rounded-full shadow-sm"/></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab==='import' && (
              <motion.div key="imp" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.4}}>
                <h2 className="text-xl font-serif font-bold mb-2">Import Content</h2><p className="text-sm text-black/35 mb-8">Connect your accounts to import your coding portfolio.</p>
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-black/5 p-6 shadow-sm space-y-3">
                  {[
                    {n:'GitHub',d:'Import repositories and contributions',e:'🐙',color:'#333',url:'https://github.com/login/oauth/authorize'},
                    {n:'LeetCode',d:'Import problem-solving stats',e:'💡',color:'#F89F1B',url:'https://leetcode.com/accounts/login/'},
                    {n:'LinkedIn',d:'Import professional profile data',e:'💼',color:'#0A66C2',url:'https://www.linkedin.com/login'},
                    {n:'Mentor Help',d:'Connect with mentors for real-time guidance',e:'🎓',color:'#8B5CF6',url:'#'},
                  ].map((item,idx)=>(
                    <motion.div key={item.n} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.1+idx*0.08}}
                      className="flex items-center justify-between p-5 rounded-2xl border border-black/5 hover:border-black/10 hover:shadow-md transition-all duration-300 group"
                      style={{background:`linear-gradient(135deg, white, ${item.color}03)`}}>
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform duration-300" style={{background:`${item.color}10`}}>{item.e}</div>
                        <div><p className="text-sm font-bold">{item.n}</p><p className="text-[10px] text-black/30">{item.d}</p></div>
                      </div>
                      <button onClick={()=>{if(item.url!=='#')window.open(item.url,'_blank','width=600,height=700');}} className="px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border hover:scale-105 active:scale-95" style={{borderColor:`${item.color}30`,color:item.color,background:`${item.color}08`}}>Connect</button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {activeTab==='notifications' && (
              <motion.div key="notif" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.4}}>
                <h2 className="text-xl font-serif font-bold mb-2">Notifications</h2><p className="text-sm text-black/35 mb-8">Choose what to be notified about. Turn off to stop receiving notifications.</p>
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-black/5 p-6 shadow-sm space-y-1">
                  {[
                    {l:'Match Found',d:'Get notified when AI finds a compatible coding partner for you',color:'#FF4D6D',emoji:'🤝',def:true},
                    {l:'Challenge Invites',d:'Receive invitations to coding challenges from other users',color:'#F97316',emoji:'⚔️',def:true},
                    {l:'Session Reminders',d:'Reminders for your upcoming coding sessions and deadlines',color:'#4D79FF',emoji:'📅',def:true},
                    {l:'Mentor Help',d:'Notifications when a mentor is available or responds to your request',color:'#8B5CF6',emoji:'🎓',def:true},
                    {l:'Leaderboard Updates',d:'Get notified when your rank changes on the leaderboard',color:'#10B981',emoji:'🏆',def:false},
                    {l:'Game Invites',d:'Receive invites to coding games and puzzle challenges',color:'#EC4899',emoji:'🎮',def:false},
                  ].map((item,idx)=>{
                    const key = `notif_${item.l}`;
                    const stored = typeof window!=='undefined'?localStorage.getItem(key):null;
                    const isOn = stored!==null ? stored==='true' : item.def;
                    return (
                      <motion.div key={item.l} initial={{opacity:0,x:-15}} animate={{opacity:1,x:0}} transition={{delay:0.08+idx*0.06}}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-black/[0.01] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base" style={{background:`${item.color}10`}}>{item.emoji}</div>
                          <div><p className="text-sm font-bold text-black/70">{item.l}</p><p className="text-[10px] text-black/25 max-w-md">{item.d}</p></div>
                        </div>
                        <button onClick={(e)=>{const newVal=!isOn;localStorage.setItem(key,String(newVal));(e.target as HTMLElement).closest('[data-notif]')?.setAttribute('data-on',String(newVal));window.location.reload();}}
                          data-notif data-on={String(isOn)}
                          className={`w-11 h-6 rounded-full cursor-pointer transition-all duration-300 flex items-center px-0.5 ${isOn?'justify-end':'justify-start'}`}
                          style={{background:isOn?item.color:'rgba(0,0,0,0.1)'}}>
                          <div className="w-5 h-5 bg-white rounded-full shadow-md transition-all"/>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
            {activeTab==='privacy' && (
              <motion.div key="priv" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.4}}>
                <h2 className="text-xl font-serif font-bold mb-2">Privacy and Data</h2><p className="text-sm text-black/35 mb-8">Manage your data and privacy preferences.</p>
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-black/5 p-8 shadow-sm space-y-6">
                  {/* Download */}
                  <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="pb-6 border-b border-black/5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#4D79FF]/10 flex items-center justify-center text-lg flex-shrink-0">📥</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-black/70 mb-1">Download your data</p>
                        <p className="text-xs text-black/30 mb-4">Get a PDF copy of all your DateForCode data including HP score, matches, streaks, leaderboard position, coding sessions, and skills.</p>
                        <button onClick={()=>{
                          const p = JSON.parse(localStorage.getItem('dateforcode_profile')||'{}');
                          const a = JSON.parse(localStorage.getItem('dateforcode_account')||'{}');
                          const lines = [
                            'DateForCode — User Data Report',`Generated: ${new Date().toLocaleString()}`,'',
                            '══ Profile ══',`Username: @${p.username||'N/A'}`,`Bio: ${p.bio||'N/A'}`,`Avatar: ${p.avatar||'N/A'}`,`Skills: ${(p.skills||[]).join(', ')||'None'}`,'',
                            '══ Account ══',`Full Name: ${a.fullName||'N/A'}`,`College: ${a.college||'N/A'}`,`Year: ${a.year||'N/A'}`,`Account Type: ${a.isPersonal?'Personal':'Business'}`,'',
                            '══ Stats ══',`HP Score: 0`,`Streak: 0 days`,`Matches: 0`,`Sessions: 0`,`Leaderboard Position: N/A`,'',
                            '══ Achievements ══','First Login: ✓','Profile Setup: ✓','',
                            '— End of Report —'
                          ];
                          const blob = new Blob([lines.join('\n')],{type:'text/plain'});
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a'); link.href=url; link.download='DateForCode_UserData.txt'; link.click();
                          URL.revokeObjectURL(url);
                        }} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4D79FF] to-[#6B8AFF] text-white text-[10px] font-bold uppercase tracking-wider shadow-md shadow-[#4D79FF]/15 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                          <Download className="w-3.5 h-3.5" />Request Download
                        </button>
                      </div>
                    </div>
                  </motion.div>
                  {/* Clear History */}
                  <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-lg flex-shrink-0">🗑️</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-red-500 mb-1">Clear activity history</p>
                        <p className="text-xs text-black/30 mb-4">This will reset all your stats to 0 — HP score, streaks, matches, sessions, and coding activity. Your profile and account will remain intact. This action cannot be undone.</p>
                        <button onClick={()=>{
                          if(confirm('⚠️ Are you sure?\n\nThis will permanently clear:\n• HP Score → 0\n• Streaks → 0\n• Matches → 0\n• Sessions → 0\n• All coding activity history\n\nYour profile and account will remain. This cannot be undone.')){
                            localStorage.removeItem('dateforcode_stats');
                            alert('✓ Activity history cleared. All stats have been reset to 0.');
                          }
                        }} className="px-5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-[10px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-100 hover:border-red-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                          🗑️ Clear History
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

export default function SettingsPage() {
  return (<React.Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#FF4D6D]/20 border-t-[#FF4D6D] rounded-full animate-spin"/></div>}><Content /></React.Suspense>);
}
