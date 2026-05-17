"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Code2, Sparkles, Zap, Search, Wifi, Globe, ArrowRight, Shield, Heart, Star, CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';

const SKILL_META: Record<string,{name:string,icon:string,color:string}> = {
  javascript:{name:'JavaScript',icon:'⚡',color:'#D97706'}, python:{name:'Python',icon:'🐍',color:'#3776AB'},
  typescript:{name:'TypeScript',icon:'🔷',color:'#3178C6'}, react:{name:'React',icon:'⚛️',color:'#61DAFB'},
  nextjs:{name:'Next.js',icon:'▲',color:'#555'}, nodejs:{name:'Node.js',icon:'🟢',color:'#339933'},
  java:{name:'Java',icon:'☕',color:'#ED8B00'}, cpp:{name:'C++',icon:'⚙️',color:'#00599C'},
  'html-css':{name:'HTML & CSS',icon:'🎨',color:'#E34F26'}, sql:{name:'SQL',icon:'🗄️',color:'#4479A1'},
  git:{name:'Git',icon:'🔀',color:'#F05032'}, rust:{name:'Rust',icon:'🦀',color:'#CE422B'},
  go:{name:'Go',icon:'🐹',color:'#00ADD8'}, docker:{name:'Docker',icon:'🐳',color:'#2496ED'},
  aws:{name:'AWS',icon:'☁️',color:'#FF9900'}, flutter:{name:'Flutter',icon:'💙',color:'#02569B'},
};

const FAKE_USERS = [
  {name:'Aarav Mehta',avatar:'AM',hp:420,skill:'React Wizard',loc:'Mumbai'},
  {name:'Priya Sharma',avatar:'PS',hp:385,skill:'Full-Stack Dev',loc:'Delhi'},
  {name:'Rohan Verma',avatar:'RV',hp:510,skill:'Backend Pro',loc:'Bangalore'},
  {name:'Ananya Iyer',avatar:'AI',hp:340,skill:'Code Artisan',loc:'Chennai'},
  {name:'Karthik Nair',avatar:'KN',hp:475,skill:'Data Coder',loc:'Hyderabad'},
  {name:'Sneha Reddy',avatar:'SR',hp:395,skill:'DevOps Lead',loc:'Pune'},
  {name:'Vivek Joshi',avatar:'VJ',hp:450,skill:'API Architect',loc:'Kolkata'},
  {name:'Diya Patel',avatar:'DP',hp:360,skill:'UI Engineer',loc:'Ahmedabad'},
  {name:'Arjun Das',avatar:'AD',hp:530,skill:'System Designer',loc:'Jaipur'},
  {name:'Meera Rao',avatar:'MR',hp:410,skill:'Cloud Expert',loc:'Lucknow'},
  {name:'Ishaan Gupta',avatar:'IG',hp:490,skill:'ML Coder',loc:'Noida'},
  {name:'Kavya Singh',avatar:'KS',hp:355,skill:'Web Crafter',loc:'Chandigarh'},
];

type Phase = 'intro' | 'scanning' | 'matched';

export default function MatchingRoom() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skillId = searchParams.get('skill') || 'javascript';
  const meta = SKILL_META[skillId] || SKILL_META.javascript;

  const [phase, setPhase] = useState<Phase>('intro');
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedUsers, setScannedUsers] = useState<typeof FAKE_USERS>([]);
  const [matchedUser, setMatchedUser] = useState<typeof FAKE_USERS[0]|null>(null);
  const [onlineCount, setOnlineCount] = useState(67);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => { setOnlineCount(Math.floor(Math.random()*80)+40); }, []);

  // Scanning phase
  useEffect(() => {
    if (phase !== 'scanning') return;
    const shuffled = [...FAKE_USERS].sort(() => Math.random() - 0.5);
    let idx = 0;
    let userIdx = 0;
    const scanTimer = setInterval(() => {
      idx++;
      setScanProgress(Math.min((idx / 30) * 100, 100));
      if (idx % 4 === 0 && userIdx < 8) {
        const user = shuffled[userIdx % shuffled.length];
        userIdx++;
        setScannedUsers(prev => [...prev, user]);
      }
      if (idx >= 30) {
        clearInterval(scanTimer);
        const match = shuffled[Math.floor(Math.random() * 4)];
        setMatchedUser(match);
        setTimeout(() => setPhase('matched'), 1000);
      }
    }, 180);
    return () => clearInterval(scanTimer);
  }, [phase]);

  const startScanning = () => {
    setScannedUsers([]);
    setScanProgress(0);
    setPhase('scanning');
  };

  return (
    <main className="fixed inset-0 bg-[#F8F9FC] z-[9999] overflow-hidden flex flex-col">
      {/* ═══ CREATIVE BACKGROUND ═══ */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{backgroundImage:`linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,backgroundSize:'60px 60px'}} />
        {/* Mesh gradient orbs — BOLD */}
        <motion.div className="absolute w-[600px] h-[600px] rounded-full blur-[120px]" animate={{x:[0,60,-40,0],y:[0,-50,40,0]}} transition={{duration:12,repeat:Infinity,ease:'easeInOut'}} style={{background:`${meta.color}22`,left:'-8%',top:'-12%'}} />
        <motion.div className="absolute w-[500px] h-[500px] rounded-full blur-[110px]" animate={{x:[0,-50,30,0],y:[0,40,-50,0]}} transition={{duration:15,repeat:Infinity,ease:'easeInOut'}} style={{background:'#FF4D6D18',right:'-3%',top:'25%'}} />
        <motion.div className="absolute w-[450px] h-[450px] rounded-full blur-[100px]" animate={{x:[0,40,-30,0],y:[0,-30,50,0]}} transition={{duration:10,repeat:Infinity,ease:'easeInOut'}} style={{background:'#8B5CF620',left:'35%',bottom:'-8%'}} />
        <motion.div className="absolute w-[350px] h-[350px] rounded-full blur-[90px]" animate={{scale:[1,1.3,1],x:[0,20,-20,0]}} transition={{duration:8,repeat:Infinity,ease:'easeInOut'}} style={{background:'#10B98115',right:'15%',top:'5%'}} />
        {/* Corner glow accents */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px]" style={{background:`radial-gradient(circle at 0% 0%, ${meta.color}15 0%, transparent 50%)`}} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px]" style={{background:'radial-gradient(circle at 100% 100%, #FF4D6D12 0%, transparent 50%)'}} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px]" style={{background:'radial-gradient(circle at 100% 0%, #8B5CF610 0%, transparent 50%)'}} />
        {/* Floating code symbols — VISIBLE */}
        {['{','}','</>','( )','[ ]','&&','||','fn','>>','::','=>','#'].map((s,i)=>(
          <motion.div key={i} className="absolute font-mono font-bold select-none" animate={{y:[0,-20,0],opacity:[0.06,0.14,0.06],rotate:[0,5,-5,0]}} transition={{duration:4+i*0.5,repeat:Infinity,ease:'easeInOut',delay:i*0.3}}
            style={{fontSize:16+i*3,left:`${5+i*8}%`,top:`${8+(i*29)%80}%`,color:'#000'}}>{s}</motion.div>
        ))}
        {/* Animated diagonal lines */}
        <svg className="absolute inset-0 w-full h-full">
          {[0,1,2,3].map(i=>(
            <motion.line key={i} x1={`${10+i*25}%`} y1="0%" x2={`${30+i*20}%`} y2="100%" stroke={meta.color} strokeWidth="1" strokeDasharray="8 12"
              animate={{opacity:[0,0.1,0],strokeDashoffset:[0,-40]}} transition={{duration:4,delay:i*1,repeat:Infinity}} />
          ))}
          {[0,1,2].map(i=>(
            <motion.line key={`h${i}`} x1="0%" y1={`${25+i*25}%`} x2="100%" y2={`${30+i*20}%`} stroke="#FF4D6D" strokeWidth="0.5" strokeDasharray="6 10"
              animate={{opacity:[0,0.06,0],strokeDashoffset:[0,-30]}} transition={{duration:6,delay:i*2,repeat:Infinity}} />
          ))}
        </svg>
        {/* Bottom gradient border */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{background:`linear-gradient(90deg, ${meta.color}40, #FF4D6D40, #8B5CF640, ${meta.color}40)`}} />
      </div>

      {/* Top bar */}
      <div className="relative z-30 bg-white/80 backdrop-blur-xl border-b border-black/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={28} />
          <div className="w-px h-6 bg-black/8" />
          <p className="text-sm font-extrabold text-[#111]">Matching Room</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-green-600">{onlineCount} Online</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-black/8">
            <span className="text-sm">{meta.icon}</span>
            <span className="text-xs font-bold text-black/40">{meta.name}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 relative z-20 flex items-center justify-center p-8">
        <AnimatePresence mode="wait">

          {/* ═══ PHASE 1: INTRO ═══ */}
          {phase === 'intro' && (
            <motion.div key="intro" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,y:-30}} className="text-center max-w-2xl">
              {/* Floating connection lines */}
              <div className="relative w-40 h-40 mx-auto mb-8">
                <motion.div className="absolute inset-0 rounded-full border-2 border-dashed" style={{borderColor:`${meta.color}20`}}
                  animate={{rotate:360}} transition={{duration:20,repeat:Infinity,ease:'linear'}} />
                <motion.div className="absolute inset-4 rounded-full border-[1.5px] border-dashed" style={{borderColor:`${meta.color}15`}}
                  animate={{rotate:-360}} transition={{duration:15,repeat:Infinity,ease:'linear'}} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div animate={{scale:[1,1.1,1]}} transition={{duration:2,repeat:Infinity}}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl bg-white shadow-xl border" style={{borderColor:`${meta.color}20`}}>
                    <Users className="w-10 h-10" style={{color:meta.color}} />
                  </motion.div>
                </div>
                {/* Orbiting dots */}
                {[0,1,2,3].map(i=>(
                  <motion.div key={i} className="absolute w-3 h-3 rounded-full" style={{background:meta.color}}
                    animate={{rotate:360}} transition={{duration:4+i,repeat:Infinity,ease:'linear',delay:i*0.8}}
                    initial={{x:0,y:0}}
                    >
                    <div className="absolute" style={{left:60+i*4,top:0,width:8,height:8,borderRadius:'50%',background:meta.color}} />
                  </motion.div>
                ))}
              </div>

              {/* Animated headline */}
              <div className="overflow-hidden mb-3">
                <motion.p initial={{y:40,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.2,duration:0.8,ease:[0.16,1,0.3,1]}}
                  className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-black/20 mb-4">DateForCode • Matching Engine</motion.p>
              </div>
              <div className="overflow-hidden mb-2">
                <motion.h1 initial={{y:60,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.4,duration:0.9,ease:[0.16,1,0.3,1]}}
                  className="text-5xl font-black text-[#111] leading-tight">From <span className="bg-clip-text text-transparent" style={{backgroundImage:`linear-gradient(135deg,${meta.color},${meta.color}CC)`}}>Solo Coding</span></motion.h1>
              </div>
              <div className="overflow-hidden mb-6">
                <motion.h1 initial={{y:60,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.6,duration:0.9,ease:[0.16,1,0.3,1]}}
                  className="text-5xl font-black text-[#111] leading-tight">to <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF4D6D] to-[#FF758C]">Smart Collaboration</span></motion.h1>
              </div>
              <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.9}}
                className="text-sm text-black/30 max-w-md mx-auto mb-10 font-medium leading-relaxed">
                Our intelligent matching engine pairs you with the perfect coding partner based on your skill, style, and stack. Ready to find your code companion?
              </motion.p>

              {/* Feature pills */}
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.1}} className="flex items-center justify-center gap-3 mb-10 flex-wrap">
                {[{icon:Shield,text:'Skill-Based Match'},{icon:Zap,text:'Instant Pairing'},{icon:Globe,text:'Real-Time'},{icon:Heart,text:'Smart Compatibility'}].map((f,i)=>(
                  <motion.div key={f.text} initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} transition={{delay:1.2+i*0.1}}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/5 shadow-sm">
                    <f.icon className="w-3.5 h-3.5 text-black/20" />
                    <span className="text-[10px] font-bold text-black/35">{f.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.4}}>
                <motion.button whileHover={{scale:1.05,boxShadow:`0 15px 40px ${meta.color}30`}} whileTap={{scale:0.97}}
                  onClick={startScanning}
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-white text-sm font-extrabold uppercase tracking-wider shadow-xl"
                  style={{background:`linear-gradient(135deg,${meta.color},${meta.color}DD)`,boxShadow:`0 10px 30px ${meta.color}25`}}>
                  <Search className="w-5 h-5" />Continue Matching
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* ═══ PHASE 2: SCANNING — Left/Right Groups ═══ */}
          {phase === 'scanning' && (
            <motion.div key="scanning" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full max-w-4xl">
              <h2 className="text-2xl font-black text-[#111] text-center mb-1">Searching for your partner...</h2>
              <p className="text-xs text-black/25 text-center font-medium mb-8">Analyzing {meta.name} skill compatibility</p>

              <div className="flex items-center gap-4">
                {/* LEFT — You + your group */}
                <div className="flex-1 flex flex-col items-center">
                  <p className="text-[9px] font-extrabold uppercase tracking-widest text-black/20 mb-3">Your Side</p>
                  <div className="space-y-2 w-full max-w-[200px]">
                    {/* You — highlighted */}
                    <motion.div animate={{scale:[1,1.03,1],boxShadow:[`0 0 0 0px ${meta.color}00`,`0 0 0 4px ${meta.color}25`,`0 0 0 0px ${meta.color}00`]}}
                      transition={{duration:1.5,repeat:Infinity}}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white border-2 shadow-md" style={{borderColor:meta.color}}>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4D6D] to-[#FF758C] flex items-center justify-center text-white text-xs font-black shadow">You</div>
                      <div className="text-left"><p className="text-xs font-bold text-[#111]">You</p><p className="text-[9px] text-black/25">Ready to pair</p></div>
                    </motion.div>
                    {/* Other users on your side */}
                    {FAKE_USERS.slice(0,4).map((u,i)=>(
                      <motion.div key={`l${i}`} initial={{opacity:0,x:-30}} animate={{opacity:0.5,x:0}} transition={{delay:0.3+i*0.15}}
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-white/60 border border-black/5">
                        <div className="w-8 h-8 rounded-lg bg-black/[0.03] flex items-center justify-center text-[9px] font-bold text-black/20">{u.avatar}</div>
                        <div className="text-left"><p className="text-[10px] font-medium text-black/25">{u.name}</p></div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CENTER — Scanning indicator */}
                <div className="flex flex-col items-center gap-4 px-4">
                  <div className="relative w-20 h-20">
                    <motion.div className="absolute inset-0 rounded-full border-2 border-dashed" style={{borderColor:`${meta.color}30`}} animate={{rotate:360}} transition={{duration:3,repeat:Infinity,ease:'linear'}} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div animate={{scale:[1,1.2,1]}} transition={{duration:1,repeat:Infinity}} className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-lg border" style={{borderColor:`${meta.color}20`}}>
                        <Search className="w-5 h-5" style={{color:meta.color}} />
                      </motion.div>
                    </div>
                  </div>
                  {/* Progress */}
                  <div className="w-24">
                    <div className="h-1.5 rounded-full bg-black/[0.04] overflow-hidden">
                      <motion.div className="h-full rounded-full" animate={{width:`${scanProgress}%`}} style={{background:`linear-gradient(90deg,${meta.color},#FF4D6D)`}} />
                    </div>
                    <p className="text-[9px] font-bold text-center mt-1" style={{color:meta.color}}>{Math.round(scanProgress)}%</p>
                  </div>
                  {/* Pulsing dots */}
                  <div className="flex gap-1.5">
                    {[0,1,2].map(i=><motion.div key={i} className="w-2 h-2 rounded-full" style={{background:meta.color}} animate={{scale:[0.5,1.2,0.5],opacity:[0.3,1,0.3]}} transition={{duration:0.8,delay:i*0.2,repeat:Infinity}} />)}
                  </div>
                </div>

                {/* RIGHT — Candidates scrolling */}
                <div className="flex-1 flex flex-col items-center">
                  <p className="text-[9px] font-extrabold uppercase tracking-widest text-black/20 mb-3">Candidates</p>
                  <div className="space-y-2 w-full max-w-[200px]">
                    <AnimatePresence mode="popLayout">
                      {scannedUsers.slice(-5).map((u,i)=>(
                        <motion.div key={u.name+i} initial={{opacity:0,x:30,scale:0.9}} animate={{opacity:i===scannedUsers.slice(-5).length-1?1:0.4,x:0,scale:1}} exit={{opacity:0,x:-20}}
                          transition={{duration:0.3}}
                          className="flex items-center gap-3 p-2.5 rounded-lg border" style={{background:i===scannedUsers.slice(-5).length-1?'white':'rgba(255,255,255,0.5)',borderColor:i===scannedUsers.slice(-5).length-1?`${meta.color}30`:'rgba(0,0,0,0.04)'}}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-black" style={{background:i===scannedUsers.slice(-5).length-1?`${meta.color}12`:'rgba(0,0,0,0.03)',color:i===scannedUsers.slice(-5).length-1?meta.color:'rgba(0,0,0,0.2)'}}>{u.avatar}</div>
                          <div className="text-left flex-1">
                            <p className="text-[10px] font-bold" style={{color:i===scannedUsers.slice(-5).length-1?'#222':'rgba(0,0,0,0.25)'}}>{u.name}</p>
                            <p className="text-[8px] text-black/20">{u.skill}</p>
                          </div>
                          {i===scannedUsers.slice(-5).length-1 && <motion.div animate={{opacity:[0,1,0]}} transition={{duration:1,repeat:Infinity}} className="w-2 h-2 rounded-full bg-green-400" />}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ PHASE 3: MATCHED — Slide to center ═══ */}
          {phase === 'matched' && matchedUser && (
            <motion.div key="matched" initial={{opacity:0}} animate={{opacity:1}} className="w-full max-w-3xl">
              {/* Confetti */}
              {Array.from({length:25}).map((_,i)=>(
                <motion.div key={i} className="absolute rounded-full" initial={{opacity:0,scale:0}}
                  animate={{opacity:[0,1,0],y:[0,-80-Math.random()*100],x:(Math.random()-0.5)*400,scale:[0,1.2,0]}}
                  transition={{duration:2,delay:0.3+i*0.06}}
                  style={{width:5+Math.random()*7,height:5+Math.random()*7,left:'50%',top:'45%',
                    background:['#10B981','#3B82F6','#8B5CF6','#F59E0B','#EC4899','#FF4D6D',meta.color][i%7]}} />
              ))}

              <motion.h2 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="text-3xl font-black text-center bg-clip-text text-transparent bg-gradient-to-r from-[#10B981] to-[#34D399] mb-2">
                Match Found!
              </motion.h2>
              <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} className="text-xs text-black/25 text-center font-medium mb-10">
                Perfect {meta.name} coding partner identified
              </motion.p>

              {/* THE PAIRING ANIMATION */}
              <div className="flex items-center justify-center gap-0 mb-8">
                {/* You — slides in from left */}
                <motion.div initial={{x:-200,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:0.8,ease:[0.16,1,0.3,1]}}
                  className="flex flex-col items-center">
                  {/* Faded group behind */}
                  <div className="relative">
                    <div className="absolute -left-3 -top-1 w-12 h-12 rounded-xl bg-black/[0.03] -z-10 rotate-[-8deg]" />
                    <div className="absolute -left-5 top-1 w-10 h-10 rounded-xl bg-black/[0.02] -z-20 rotate-[-15deg]" />
                    <motion.div animate={{boxShadow:[`0 0 0 0px ${meta.color}00`,`0 0 0 6px ${meta.color}15`,`0 0 0 0px ${meta.color}00`]}} transition={{duration:2,repeat:Infinity}}
                      className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF4D6D] to-[#FF758C] flex items-center justify-center text-white text-xl font-black shadow-xl relative z-10">
                      You
                    </motion.div>
                  </div>
                  <p className="text-sm font-bold text-[#222] mt-3">You</p>
                  <p className="text-[9px] text-black/20 font-medium">{meta.name} Verified</p>
                </motion.div>

                {/* Connection beam in center */}
                <motion.div initial={{scaleX:0,opacity:0}} animate={{scaleX:1,opacity:1}} transition={{delay:0.6,duration:0.6}}
                  className="flex items-center gap-0 mx-2 origin-center">
                  <div className="w-8 h-[2px] rounded-full" style={{background:`linear-gradient(90deg, #FF4D6D, transparent)`}} />
                  <div className="flex items-center gap-1 px-3">
                    {[0,1,2,3,4].map(i=><motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{background:i<2?'#FF4D6D':i>2?meta.color:'#10B981'}} animate={{scale:[0.4,1.3,0.4],opacity:[0.2,1,0.2]}} transition={{duration:0.6,delay:i*0.1,repeat:Infinity}} />)}
                  </div>
                  <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:1,type:'spring'}}
                    className="w-10 h-10 rounded-full bg-green-50 border-2 border-green-300 flex items-center justify-center shadow-lg">
                    <Heart className="w-5 h-5 text-green-500" />
                  </motion.div>
                  <div className="flex items-center gap-1 px-3">
                    {[0,1,2,3,4].map(i=><motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{background:i<2?'#10B981':i>2?meta.color:meta.color}} animate={{scale:[0.4,1.3,0.4],opacity:[0.2,1,0.2]}} transition={{duration:0.6,delay:i*0.1,repeat:Infinity}} />)}
                  </div>
                  <div className="w-8 h-[2px] rounded-full" style={{background:`linear-gradient(90deg, transparent, ${meta.color})`}} />
                </motion.div>

                {/* Partner — slides in from right */}
                <motion.div initial={{x:200,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:0.8,ease:[0.16,1,0.3,1]}}
                  className="flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute -right-3 -top-1 w-12 h-12 rounded-xl bg-black/[0.03] -z-10 rotate-[8deg]" />
                    <div className="absolute -right-5 top-1 w-10 h-10 rounded-xl bg-black/[0.02] -z-20 rotate-[15deg]" />
                    <motion.div animate={{boxShadow:[`0 0 0 0px ${meta.color}00`,`0 0 0 6px ${meta.color}15`,`0 0 0 0px ${meta.color}00`]}} transition={{duration:2,repeat:Infinity,delay:0.5}}
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-xl font-black shadow-xl relative z-10" style={{background:`linear-gradient(135deg,${meta.color},${meta.color}CC)`,color:'white'}}>
                      {matchedUser.avatar}
                    </motion.div>
                  </div>
                  <p className="text-sm font-bold text-[#222] mt-3">{matchedUser.name}</p>
                  <p className="text-[9px] text-black/20 font-medium">{matchedUser.skill}</p>
                </motion.div>
              </div>

              {/* Partner info card */}
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.2}}
                className="bg-white rounded-2xl border border-black/5 shadow-lg p-6 max-w-md mx-auto mb-6">
                <div className="grid grid-cols-3 gap-3">
                  {[{label:'Skill',val:matchedUser.skill,icon:Code2,c:meta.color},{label:'HP',val:matchedUser.hp.toString(),icon:Zap,c:'#F59E0B'},{label:'Location',val:matchedUser.loc,icon:Globe,c:'#6366F1'}].map(s=>(
                    <div key={s.label} className="rounded-xl p-3 text-center border" style={{background:`${s.c}06`,borderColor:`${s.c}12`}}>
                      <s.icon className="w-4 h-4 mx-auto mb-1" style={{color:s.c}} />
                      <p className="text-xs font-bold text-[#222]">{s.val}</p>
                      <p className="text-[8px] text-black/20 uppercase font-bold tracking-wider">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:1.5}} className="flex items-center gap-3 justify-center">
                <button onClick={()=>router.push('/student/dashboard')} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-black/8 text-xs font-extrabold uppercase tracking-wider text-black/30 hover:text-black transition-all">Later</button>
                <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.97}}
                  onClick={()=>{
                    try{const p=JSON.parse(localStorage.getItem('dateforcode_progress')||'{}');p.matchDone=true;p.matches=(p.matches||0)+1;localStorage.setItem('dateforcode_progress',JSON.stringify(p));}catch(_){}
                    router.push(`/student/coding-room?skill=${skillId}&partner=${encodeURIComponent(matchedUser.name)}&avatar=${matchedUser.avatar}`);
                  }}
                  className="flex items-center gap-3 px-8 py-3.5 rounded-xl text-white text-sm font-extrabold uppercase tracking-wider shadow-xl"
                  style={{background:`linear-gradient(135deg,${meta.color},${meta.color}DD)`,boxShadow:`0 10px 30px ${meta.color}30`}}>
                  <Code2 className="w-4 h-4" />Enter Coding Room<ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
