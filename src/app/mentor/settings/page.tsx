"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Shield, Eye, Download, Bell, Lock, Check, RotateCcw, Save, Search, Mic, LayoutDashboard, Target, Users, Code, Gamepad2, Trophy, Zap, GraduationCap, Settings, Video, Calendar, Swords, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';

const fadeUp = (d=0) => ({ initial:{opacity:0,y:25}, animate:{opacity:1,y:0}, transition:{duration:0.6,delay:d,ease:[0.16,1,0.3,1] as const} });

const SIDEBAR_ITEMS = [
  { label:'Dashboard', icon:LayoutDashboard, href:'/mentor/dashboard' },
  { label:'Settings', icon:Settings, href:'/mentor/settings' },
];

const TABS = [
  { id:'edit-profile', label:'Edit Profile', icon:User },
  { id:'account', label:'Account Management', icon:Shield },
  { id:'notifications', label:'Notifications', icon:Bell },
  { id:'privacy', label:'Privacy and Data', icon:Lock },
];

const SEARCH_ITEMS = [
  {label:'Edit Profile',desc:'Change your avatar, name, title, skills',tab:'edit-profile'},
  {label:'Account Management',desc:'Email, password, account type',tab:'account'},
  {label:'Notifications',desc:'Match alerts, class reminders',tab:'notifications'},
  {label:'Privacy and Data',desc:'Download data, clear history',tab:'privacy'},
];

const SKILLS = [
  'React', 'Node.js', 'Python', 'TypeScript', 'Java', 'C++', 'System Design', 'Algorithms', 'Go', 'Rust', 'AWS', 'Docker'
];

export default function MentorSettings() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'edit-profile');
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

  const [original, setOriginal] = useState({name:'',title:'',avatar:'👨‍🏫',skillsKnown:[] as string[],skillsGuide:[] as string[]});
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [avatar, setAvatar] = useState('👨‍🏫');
  const [skillsKnown, setSkillsKnown] = useState<string[]>([]);
  const [skillsGuide, setSkillsGuide] = useState<string[]>([]);

  useEffect(() => {
    const s = localStorage.getItem('dateforcode_mentor_profile');
    if (s) { 
      const p = JSON.parse(s); 
      setOriginal(p); 
      setName(p.name||''); 
      setTitle(p.title||''); 
      setAvatar(p.avatar||'👨‍🏫'); 
      setSkillsKnown(p.skillsKnown||[]); 
      setSkillsGuide(p.skillsGuide||[]);
    } else {
      router.push('/mentor/profile-setup');
    }
  }, [router]);

  const filteredResults = searchQuery.trim().length > 0 ? SEARCH_ITEMS.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()) || i.desc.toLowerCase().includes(searchQuery.toLowerCase())) : [];
  
  const handleSave = () => { 
    const p = { ...original, name, title, avatar, skillsKnown, skillsGuide }; 
    localStorage.setItem('dateforcode_mentor_profile',JSON.stringify(p)); 
    setOriginal(p); 
    setSaved(true); 
    setTimeout(()=>setSaved(false),2000); 
  };
  
  const handleReset = () => { 
    setName(original.name); 
    setTitle(original.title); 
    setAvatar(original.avatar); 
    setSkillsKnown([...original.skillsKnown]); 
    setSkillsGuide([...original.skillsGuide]);
  };

  const toggleSkill = (s:string, type: 'known' | 'guide') => {
    if (type === 'known') {
      setSkillsKnown(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);
    } else {
      setSkillsGuide(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#FAFAFA]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0)',backgroundSize:'32px 32px'}} />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#FF4D6D]/[0.02] rounded-full blur-[120px]" style={{animation:'floatSlow 12s ease-in-out infinite'}} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-[#4D79FF]/[0.02] rounded-full blur-[100px]" style={{animation:'floatSlow 10s ease-in-out infinite 4s'}} />
      </div>

      {/* Top bar with search */}
      <nav className="relative z-20 py-3 px-8 flex items-center border-b border-black/5 bg-white/60 backdrop-blur-xl gap-4">
        <button onClick={()=>router.push('/mentor/dashboard')} className="flex items-center gap-2 text-black/30 text-xs font-bold uppercase tracking-wider hover:text-black transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />Back
        </button>
        <div className="w-px h-5 bg-black/8" />
        <Link href="/" className="flex items-center gap-2">
            <Logo showText={true} className="scale-[0.55] origin-left" />
        </Link>
        <div className="flex-1 max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search mentor settings..." className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-black/[0.03] border border-transparent text-sm focus:outline-none focus:border-[#FF4D6D]/30 focus:bg-white transition-all placeholder:text-black/20" />
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
              <button onClick={()=>router.push(n.href)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${n.label==='Settings' ? 'bg-[#FF4D6D]/10 text-[#FF4D6D]' : 'text-black/20 hover:text-[#FF4D6D] hover:bg-[#FF4D6D]/5'}`}>
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
                <p className="text-sm text-black/35 mb-8">Keep your mentor details updated. Information you add here is visible to students looking for guidance.</p>
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-black/5 p-8 shadow-sm">
                  {/* Avatar & Basic Info */}
                  <div className="mb-8">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-black/30 mb-3 block">Avatar & Name</label>
                    <div className="flex items-center gap-6">
                      <div className="relative group">
                        <div className="w-20 h-20 rounded-2xl bg-white border border-black/5 shadow-md flex items-center justify-center text-4xl cursor-pointer hover:border-[#FF4D6D]/30 transition-colors">
                          {avatar}
                        </div>
                        <input type="text" value={avatar} onChange={e=>setAvatar(e.target.value)} maxLength={2} className="absolute inset-0 opacity-0 cursor-pointer" title="Click to change emoji" />
                      </div>
                      <div className="flex-1 max-w-md space-y-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-black/30 mb-1 block">Full Name</label>
                          <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-black/8 text-sm font-bold focus:outline-none focus:border-[#FF4D6D]/40 focus:ring-2 focus:ring-[#FF4D6D]/10 transition-all bg-white/50"/>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-black/30 mb-1 block">Professional Title</label>
                          <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Senior Architect @ Google" className="w-full px-4 py-3 rounded-xl border border-black/8 text-sm font-bold focus:outline-none focus:border-[#FF4D6D]/40 focus:ring-2 focus:ring-[#FF4D6D]/10 transition-all bg-white/50"/>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Skills Known */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3"><label className="text-[10px] font-bold uppercase tracking-wider text-black/30">Skills You Know</label></div>
                    <div className="flex flex-wrap gap-2 max-w-2xl">
                      {SKILLS.map(sk=>{const a=skillsKnown.includes(sk);return(
                        <button key={sk} onClick={()=>toggleSkill(sk, 'known')} className="px-4 py-2 rounded-xl text-xs font-bold transition-all border" style={{borderColor:a?'#4D79FF':'rgba(0,0,0,0.06)',background:a?'#4D79FF10':'white',color:a?'#4D79FF':'rgba(0,0,0,0.3)'}}>{sk}</button>
                      );})}
                    </div>
                  </div>

                  {/* Skills Guide */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3"><label className="text-[10px] font-bold uppercase tracking-wider text-black/30">Skills You Will Mentor In</label></div>
                    <div className="flex flex-wrap gap-2 max-w-2xl">
                      {SKILLS.map(sk=>{const a=skillsGuide.includes(sk);return(
                        <button key={sk} onClick={()=>toggleSkill(sk, 'guide')} className="px-4 py-2 rounded-xl text-xs font-bold transition-all border" style={{borderColor:a?'#FF4D6D':'rgba(0,0,0,0.06)',background:a?'#FF4D6D10':'white',color:a?'#FF4D6D':'rgba(0,0,0,0.3)'}}>{sk}</button>
                      );})}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-black/5">
                    <button onClick={handleReset} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-black/8 text-xs font-bold uppercase tracking-wider text-black/40 hover:text-black transition-all"><RotateCcw className="w-3.5 h-3.5"/>Reset</button>
                    <button onClick={handleSave} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#FF4D6D] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF4D6D]/15 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"><Save className="w-3.5 h-3.5"/>{saved?'Saved ✓':'Save Changes'}</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab !== 'edit-profile' && (
               <motion.div key="other" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="flex items-center justify-center h-full text-black/30 text-sm">
                 This section is currently under construction.
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
