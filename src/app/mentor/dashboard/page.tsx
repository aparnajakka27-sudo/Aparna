"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Video, Calendar, Swords, FileCheck, TrendingUp, Star, 
  Target, BarChart3, Clock, Briefcase, Bell, Settings, LogOut, Code2, AlertCircle, Play, ChevronRight, MessageSquare, Award, BookOpen, Zap,
  Search, CheckCircle2, Shield, Edit3, Plus, X, UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const fadeUp = (d=0) => ({ initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, transition:{duration:0.6,delay:d,ease:[0.16,1,0.3,1] as const} });

// Mock Data for Tabs
const MOCK_LIVE_SESSIONS = [
  {id:1, students:'Rahul M. (Solo)', stack:'Python', time:'12:45', status:'help_requested', avatar1:'RM', avatar2:null, topic:'Binary Search Trees'},
  {id:2, students:'Arjun P. & Sneha G.', stack:'React', time:'24:10', status:'coding', avatar1:'AP', avatar2:'SG', topic:'Building a Chess Board'},
  {id:3, students:'Kiran N. & Priya S.', stack:'System Design', time:'45:00', status:'reviewing', avatar1:'KN', avatar2:'PS', topic:'Rate Limiter'},
];

const MOCK_STUDENTS = [
  {id:'s1', name:'Arjun P.', avatar:'AP', hp:2450, matches:12, level:5, topSkill:'React'},
  {id:'s2', name:'Sneha G.', avatar:'SG', hp:2100, matches:8, level:4, topSkill:'Node.js'},
  {id:'s3', name:'Rahul M.', avatar:'RM', hp:1850, matches:5, level:3, topSkill:'Python'},
  {id:'s4', name:'Kiran N.', avatar:'KN', hp:3200, matches:20, level:7, topSkill:'System Design'},
  {id:'s5', name:'Priya S.', avatar:'PS', hp:2900, matches:15, level:6, topSkill:'C++'},
];

export default function MentorDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mentorRequests, setMentorRequests] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('dateforcode_mentor_profile');
    if (saved) setProfile(JSON.parse(saved));
    else router.push('/mentor/profile-setup');

    // Poll for incoming student requests
    const interval = setInterval(() => {
      const reqs = JSON.parse(localStorage.getItem('dateforcode_mentor_requests') || '[]');
      setMentorRequests(reqs.filter((r:any) => r.status === 'pending'));
    }, 1500);
    return () => clearInterval(interval);
  }, [router]);

  const handleRequestAction = (id: string, action: 'accepted'|'declined') => {
    const reqs = JSON.parse(localStorage.getItem('dateforcode_mentor_requests') || '[]');
    const updated = reqs.map((r:any) => r.id === id ? { ...r, status: action } : r);
    localStorage.setItem('dateforcode_mentor_requests', JSON.stringify(updated));
    if (action === 'accepted') {
      router.push('/mentor/live-session?req=' + id);
    }
  };

  const SIDEBAR_ITEMS = [
    { label:'Dashboard', icon:LayoutDashboard },
    { label:'Live Sessions', icon:Video },
    { label:'Classes & Batches', icon:Calendar },
    { label:'Challenges', icon:Swords },
    { label:'Analytics & Reports', icon:TrendingUp },
    { label:'Advanced Tools', icon:Target },
  ];

  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]"><div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin"/></div>;

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] overflow-hidden font-sans">
      {/* ═══ Sidebar ═══ */}
      <motion.aside initial={{x:-300}} animate={{x:0}} transition={{duration:0.6,ease:[0.16,1,0.3,1]}} className="w-[280px] bg-[#FDFDFD] border-r border-black/5 flex flex-col relative z-20">
        <div className="p-8 pb-6 flex flex-col gap-1 items-start">
          <Logo showText={true} className="scale-[0.8] origin-left" />
          <div className="text-[10px] font-black uppercase tracking-widest text-[#FF4D6D] ml-1">Mentor Portal</div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item, i) => {
            const isActive = activeTab === item.label;
            return (
              <button key={item.label} onClick={()=>setActiveTab(item.label)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-black transition-all duration-300 group ${isActive ? 'bg-[#FF4D6D] text-white shadow-lg shadow-[#FF4D6D]/20' : 'text-black/40 hover:text-black hover:bg-black/[0.02]'}`}>
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-black/30 group-hover:text-[#FF4D6D] transition-colors'}`} />
                  {item.label}
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="h-[1px] bg-black/5 mb-4" />
          <button onClick={async()=>{await signOut(auth);localStorage.clear();router.push('/');}} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 bg-red-50 border border-red-100 hover:text-red-600 hover:bg-red-100 hover:border-red-200 transition-all duration-300 group">
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Logout
          </button>
        </div>
      </motion.aside>

      {/* ═══ Main Content ═══ */}
      <div className="flex-1 overflow-y-auto relative z-10 bg-[#FAFAFA]">
        {/* Background aesthetic */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.015) 1px, transparent 0)',backgroundSize:'32px 32px'}} />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#4D79FF]/[0.02] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FF4D6D]/[0.02] rounded-full blur-[100px]" />
        </div>

        <motion.header {...fadeUp(0)} className="sticky top-0 z-20 bg-white/60 backdrop-blur-xl border-b border-black/5 px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-[#111]">{activeTab}</h2>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl bg-black/[0.03] flex items-center justify-center hover:bg-black/[0.06] transition-colors relative">
              <Bell className="w-4 h-4 text-black/40" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF4D6D] rounded-full" />
            </button>
            <button className="w-9 h-9 rounded-xl bg-black/[0.03] flex items-center justify-center hover:bg-black/[0.06] transition-colors">
              <Settings className="w-4 h-4 text-black/40" />
            </button>
            <div onClick={()=>setShowProfileModal(true)} className="flex items-center gap-3 pl-3 border-l border-black/8 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-right">
                <p className="text-xs font-bold text-[#111]">{profile.name}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#FF4D6D]">{profile.title}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 flex items-center justify-center text-lg shadow-sm">
                {profile.avatar}
              </div>
            </div>
          </div>
        </motion.header>

        <main className="p-8 max-w-7xl mx-auto relative z-10">
          {/* TAB: Dashboard */}
          {activeTab === 'Dashboard' && (
            <>
              {/* Top Alert: Incoming Requests */}
              <AnimatePresence>
                {mentorRequests.length > 0 && (
                  <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="mb-8 p-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-xl shadow-cyan-500/10 border border-cyan-400 gap-4">
                    <div className="flex items-center gap-4 text-white">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse"><UserCheck className="w-6 h-6"/></div>
                      <div>
                        <h3 className="text-sm font-black mb-0.5">{mentorRequests.length} Student(s) Requesting Your Guidance</h3>
                        <p className="text-xs text-cyan-100 font-medium">{mentorRequests[0].studentName} wants to connect with you for a live coding session.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={()=>handleRequestAction(mentorRequests[0].id, 'declined')} className="px-6 py-3 bg-white/10 text-white text-xs font-black rounded-xl hover:bg-white/20 transition-all shadow-md">Decline</button>
                      <button onClick={()=>handleRequestAction(mentorRequests[0].id, 'accepted')} className="px-6 py-3 bg-white text-cyan-600 text-xs font-black rounded-xl hover:bg-cyan-50 transition-all shadow-md transform hover:scale-105 active:scale-95">Accept & Join</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Top Alert: Student Interventions */}
              <motion.div {...fadeUp(0.1)} className="mb-8 p-5 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl flex items-center justify-between shadow-xl shadow-red-500/10 border border-red-400">
                <div className="flex items-center gap-4 text-white">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse"><AlertCircle className="w-6 h-6"/></div>
                  <div>
                    <h3 className="text-sm font-black mb-0.5">Students Requesting Live Intervention</h3>
                    <p className="text-xs text-red-100 font-medium">Rahul M. is stuck in a coding room and requested mentor guidance.</p>
                  </div>
                </div>
                <button onClick={()=>setActiveTab('Live Sessions')} className="px-6 py-3 bg-white text-red-600 text-xs font-black rounded-xl hover:bg-red-50 transition-all shadow-md transform hover:scale-105 active:scale-95">Go to Live Sessions</button>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                {[
                  {label:'Assigned Students',val:'42',icon:Users,color:'#4D79FF',bg:'bg-blue-50'},
                  {label:'Live Sessions Monitored',val:'18',icon:Video,color:'#10B981',bg:'bg-green-50'},
                  {label:'Submissions Evaluated',val:'156',icon:FileCheck,color:'#8B5CF6',bg:'bg-purple-50'},
                  {label:'Average Rating',val:'4.9',icon:Star,color:'#F59E0B',bg:'bg-amber-50'},
                ].map((s,i) => (
                  <motion.div key={s.label} {...fadeUp(0.15+i*0.05)} whileHover={{y:-5,boxShadow:'0 10px 40px rgba(0,0,0,0.04)'}} className="bg-white p-6 rounded-3xl border border-black/5 relative overflow-hidden group transition-all duration-300">
                    <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                      <s.icon className="w-6 h-6" style={{color:s.color}}/>
                    </div>
                    <h4 className="text-3xl font-black text-[#111] mb-1">{s.val}</h4>
                    <p className="text-[10px] font-bold text-black/30 uppercase tracking-wider">{s.label}</p>
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity" style={{backgroundImage:`linear-gradient(to bottom right, transparent, ${s.color})`}}/>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Active Coding Sessions Preview */}
                  <motion.div {...fadeUp(0.3)} className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 overflow-hidden relative">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-base font-black text-[#111] flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Active Coding Sessions
                      </h3>
                      <button onClick={()=>setActiveTab('Live Sessions')} className="text-[10px] font-bold uppercase tracking-wider text-[#FF4D6D] hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                      {MOCK_LIVE_SESSIONS.slice(0,2).map((session, i) => (
                        <div key={session.id} className="flex items-center justify-between p-4 rounded-2xl border border-black/5 hover:bg-black/[0.01] transition-all">
                          <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-blue-700">{session.avatar1}</div>
                              {session.avatar2 && <div className="w-8 h-8 rounded-lg bg-pink-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-pink-700">{session.avatar2}</div>}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#222] mb-0.5">{session.students}</p>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${session.status==='help_requested'?'bg-red-50 text-red-600':session.status==='reviewing'?'bg-amber-50 text-amber-600':'bg-green-50 text-green-600'}`}>
                                  {session.status.replace('_',' ')}
                                </span>
                                <span className="text-[9px] font-bold text-black/30">{session.stack} • {session.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
                <div className="space-y-6">
                  {/* Advanced AI Tools */}
                  <motion.div {...fadeUp(0.35)} className="bg-gradient-to-br from-[#E0F2FE] to-[#BAE6FD] rounded-3xl p-6 shadow-sm border border-sky-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl" />
                    <div className="w-10 h-10 rounded-xl bg-white text-sky-500 flex items-center justify-center mb-4 shadow-sm"><Zap className="w-5 h-5"/></div>
                    <h3 className="text-sm font-black text-[#111] mb-2">Weak-Skill Detection</h3>
                    <p className="text-xs text-sky-800 font-medium leading-relaxed mb-5">AI identified that 35% of your assigned students are struggling with <strong className="text-sky-900 black">Dynamic Programming</strong>.</p>
                    <button onClick={()=>setActiveTab('Advanced Tools')} className="w-full py-3 bg-white text-sky-600 text-xs font-black rounded-xl hover:bg-sky-50 transition-colors shadow-sm">View Insights</button>
                  </motion.div>
                </div>
              </div>
            </>
          )}

          {/* TAB: Live Sessions */}
          {activeTab === 'Live Sessions' && (
            <motion.div {...fadeUp(0.1)} className="space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-[#111] mb-2">Live Coding Sessions</h2>
                    <p className="text-sm text-black/40">Monitor and intervene in active student coding rooms.</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 border border-green-100 text-green-700 text-xs font-black">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> {MOCK_LIVE_SESSIONS.length} Active Rooms
                  </div>
                </div>

                {MOCK_LIVE_SESSIONS.length === 0 ? (
                  <div className="py-20 text-center">
                    <Video className="w-12 h-12 mx-auto text-black/10 mb-4"/>
                    <p className="text-lg font-black text-black/40">No students are currently live.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MOCK_LIVE_SESSIONS.map((session, i) => (
                      <motion.div key={session.id} {...fadeUp(0.2+i*0.1)} className={`p-6 rounded-2xl border-2 transition-all group ${session.status==='help_requested'?'bg-red-50/50 border-red-200':'bg-white border-black/5 hover:border-black/10'}`}>
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex gap-3">
                            <div className="flex -space-x-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-700 shadow-sm">{session.avatar1}</div>
                              {session.avatar2 && <div className="w-10 h-10 rounded-xl bg-pink-100 border-2 border-white flex items-center justify-center text-xs font-bold text-pink-700 shadow-sm">{session.avatar2}</div>}
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-[#111]">{session.students}</h4>
                              <p className="text-[10px] font-bold text-black/40">{session.topic}</p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${session.status==='help_requested'?'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30':session.status==='reviewing'?'bg-amber-100 text-amber-700':'bg-green-100 text-green-700'}`}>
                            {session.status.replace('_',' ')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-black/5 pt-4">
                          <div className="flex gap-3">
                            <span className="text-[10px] font-bold text-black/40 bg-black/[0.03] px-2 py-1 rounded-md">{session.stack}</span>
                            <span className="text-[10px] font-bold text-black/40 bg-black/[0.03] px-2 py-1 rounded-md"><Clock className="w-3 h-3 inline mr-1"/>{session.time}</span>
                          </div>
                          {session.status === 'help_requested' ? (
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-[10px] font-black hover:bg-red-700 transition-colors shadow-md">
                              <MessageSquare className="w-3.5 h-3.5"/> Intervene
                            </button>
                          ) : (
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-[10px] font-black hover:bg-black/80 transition-colors">
                              <Play className="w-3.5 h-3.5"/> Join Silently
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB: Classes & Batches */}
          {activeTab === 'Classes & Batches' && (
            <motion.div {...fadeUp(0.1)} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-black text-[#111]">Classes & Batches</h2>
                  <p className="text-sm text-black/40">Manage your upcoming group lectures and batches.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF4D6D] text-white text-xs font-black shadow-lg shadow-[#FF4D6D]/20 hover:scale-105 transition-transform"><Plus className="w-4 h-4"/> Schedule Class</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {title:'System Design Fundamentals',date:'Today',time:'4:00 PM',students:24,type:'Live Class',color:'text-blue-500',bg:'bg-blue-50'},
                  {title:'React Hooks Deep Dive',date:'Tomorrow',time:'10:00 AM',students:15,type:'Batch Session',color:'text-pink-500',bg:'bg-pink-50'},
                  {title:'DSA Mock Interviews',date:'Friday',time:'2:00 PM',students:8,type:'Interactive',color:'text-amber-500',bg:'bg-amber-50'},
                ].map((c, i) => (
                  <motion.div key={i} {...fadeUp(0.2+i*0.1)} className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm group hover:border-black/10 transition-all">
                    <div className={`w-12 h-12 rounded-2xl ${c.bg} flex items-center justify-center mb-4 text-xs font-black uppercase ${c.color}`}>{c.date==='Today'?'TDA':c.date==='Tomorrow'?'TMR':'FRI'}</div>
                    <h3 className="text-base font-black text-[#111] mb-1">{c.title}</h3>
                    <p className="text-[10px] font-bold text-black/40 mb-4">{c.type} • {c.students} Students Enrolled</p>
                    <div className="flex items-center justify-between pt-4 border-t border-black/5">
                      <span className="text-[10px] font-black text-[#FF4D6D]">{c.date} • {c.time}</span>
                      <button className="text-[10px] font-bold text-black/30 group-hover:text-black">Manage</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB: Challenges */}
          {activeTab === 'Challenges' && (
            <motion.div {...fadeUp(0.1)} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-black text-[#111]">Coding Challenges</h2>
                  <p className="text-sm text-black/40">Create and deploy custom coding battles for students.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white text-xs font-black shadow-lg hover:scale-105 transition-transform"><Plus className="w-4 h-4"/> Create Challenge</button>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {title:'Weekend Hackathon: API Builder',participants:45,status:'Active',difficulty:'Hard'},
                    {title:'Daily Byte: Array Manipulation',participants:120,status:'Completed',difficulty:'Easy'},
                    {title:'Algorithms Speed Run',participants:0,status:'Draft',difficulty:'Medium'},
                  ].map((ch, i) => (
                    <div key={i} className="p-5 rounded-2xl border border-black/5 flex items-center justify-between hover:bg-black/[0.01] transition-colors">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-[#F8F9FC] border border-black/5 flex items-center justify-center text-black/40"><Swords className="w-5 h-5"/></div>
                        <div>
                          <h4 className="text-sm font-black text-[#111]">{ch.title}</h4>
                          <p className="text-[10px] font-bold text-black/40">{ch.participants} Participants • {ch.difficulty}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${ch.status==='Active'?'bg-green-100 text-green-700':ch.status==='Completed'?'bg-black/[0.05] text-black/50':'bg-amber-100 text-amber-700'}`}>{ch.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: Analytics & Reports */}
          {activeTab === 'Analytics & Reports' && (
            <motion.div {...fadeUp(0.1)} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-black text-[#111]">Student Analytics</h2>
                  <p className="text-sm text-black/40">Track progress, scores, and match history of all assigned students.</p>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30"/>
                  <input type="text" placeholder="Search students..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-black/5 text-xs font-bold focus:border-[#FF4D6D] focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition-all"/>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/[0.02] border-b border-black/5">
                      <th className="p-4 text-[10px] font-black text-black/40 uppercase tracking-wider">Student</th>
                      <th className="p-4 text-[10px] font-black text-black/40 uppercase tracking-wider">Level & HP</th>
                      <th className="p-4 text-[10px] font-black text-black/40 uppercase tracking-wider">Top Skill</th>
                      <th className="p-4 text-[10px] font-black text-black/40 uppercase tracking-wider">Total Matches</th>
                      <th className="p-4 text-[10px] font-black text-black/40 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_STUDENTS.map(student => (
                      <tr key={student.id} className="border-b border-black/5 hover:bg-black/[0.01] transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-black/[0.04] border border-black/5 flex items-center justify-center text-[10px] font-black text-[#111]">{student.avatar}</div>
                          <span className="text-sm font-black text-[#111]">{student.name}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-[#FF4D6D]">Lvl {student.level}</span>
                            <span className="text-[10px] font-bold text-black/40">{student.hp} HP</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded bg-black/[0.03] text-[10px] font-black text-black/60">{student.topSkill}</span>
                        </td>
                        <td className="p-4 text-sm font-black text-[#111]">{student.matches}</td>
                        <td className="p-4 text-right">
                          <button className="text-[10px] font-black text-[#4D79FF] hover:underline">View Profile</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB: Advanced Tools */}
          {activeTab === 'Advanced Tools' && (
            <motion.div {...fadeUp(0.1)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center mb-6"><Target className="w-6 h-6 text-sky-500"/></div>
                  <h3 className="text-xl font-black text-[#111] mb-2">Weak-Skill Detection Engine</h3>
                  <p className="text-xs text-black/40 mb-6 leading-relaxed">Our AI analyzes thousands of student submissions to automatically flag knowledge gaps across your entire cohort before they become issues.</p>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/50 flex items-center justify-between">
                      <span className="text-xs font-black text-sky-900">Dynamic Programming</span>
                      <span className="text-[10px] font-black text-red-500 bg-red-100 px-2 py-0.5 rounded">35% Failure Rate</span>
                    </div>
                    <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/50 flex items-center justify-between">
                      <span className="text-xs font-black text-sky-900">Graph Traversal</span>
                      <span className="text-[10px] font-black text-orange-500 bg-orange-100 px-2 py-0.5 rounded">22% Failure Rate</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-6"><Briefcase className="w-6 h-6 text-purple-500"/></div>
                  <h3 className="text-xl font-black text-[#111] mb-2">Placement Prep Mode</h3>
                  <p className="text-xs text-black/40 mb-6 leading-relaxed">Toggle strict environments mimicking real-world FAANG interviews. Disables AI chat and enforces strict time limits for selected students.</p>
                  <button className="w-full py-3 rounded-xl bg-purple-600 text-white text-xs font-black shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-colors">Enable Placement Mode</button>
                </div>

                <div className="bg-gradient-to-r from-[#111] to-[#333] rounded-3xl p-8 shadow-xl text-white">
                  <h3 className="text-xl font-black mb-2">Broadcast Announcement</h3>
                  <p className="text-xs text-white/50 mb-4">Send a push notification to all your assigned students instantly.</p>
                  <input type="text" placeholder="Type your message..." className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-xs font-bold text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 mb-3"/>
                  <button className="w-full py-3 rounded-xl bg-white text-black text-xs font-black hover:bg-white/90 transition-colors">Send Broadcast</button>
                </div>
              </div>
            </motion.div>
          )}

        </main>
      </div>

      {/* Mentor Profile Modal */}
      <AnimatePresence>
        {showProfileModal && profile && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={()=>setShowProfileModal(false)}/>
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
              <div className="bg-white rounded-3xl shadow-2xl border border-black/5 max-w-md w-full pointer-events-auto overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-[#FF4D6D] to-[#4D79FF] relative">
                  <button onClick={()=>setShowProfileModal(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors"><X className="w-4 h-4"/></button>
                </div>
                <div className="px-8 pb-8 relative">
                  <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center text-4xl -mt-12 mb-4 border border-black/5">{profile.avatar}</div>
                  <h2 className="text-2xl font-black text-[#111] mb-1">{profile.name}</h2>
                  <p className="text-xs font-black text-[#FF4D6D] mb-6">{profile.title}</p>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black uppercase text-black/30 tracking-wider mb-3">Known Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.skillsKnown?.map((s:string) => (
                          <span key={s} className="px-3 py-1.5 rounded-lg bg-black/[0.03] text-[10px] font-black text-black/60 border border-black/5">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-black/30 tracking-wider mb-3">Guiding In</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.skillsGuide?.map((s:string) => (
                          <span key={s} className="px-3 py-1.5 rounded-lg bg-[#FF4D6D]/10 text-[10px] font-black text-[#FF4D6D] border border-[#FF4D6D]/20">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 space-y-3">
                    <button onClick={()=>{setShowProfileModal(false);router.push('/mentor/settings');}} className="w-full py-3 rounded-2xl border border-black/10 text-xs font-black uppercase tracking-widest text-[#111] hover:bg-black/[0.02] transition-colors">
                      Edit Profile
                    </button>
                    <button onClick={async()=>{await signOut(auth);localStorage.clear();router.push('/');}} className="w-full py-3 rounded-2xl bg-red-50 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-colors">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
