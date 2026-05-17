"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Code2, Play, Send, Mic, MicOff, Monitor, Users, MessageSquare, ChevronRight, CheckCircle2, XCircle, Trophy, Zap, ArrowRight, X, Shield, Star, RotateCcw, Home, Eye, Bot, UserCheck, Volume2, AlertTriangle, Heart, Sparkles } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getRandomCodingQuestions, CodingQuestion } from '@/data/codingQuestions';
import Logo from '@/components/Logo';

const META: Record<string,{name:string,icon:string,color:string}> = {
  javascript:{name:'JavaScript',icon:'⚡',color:'#D97706'},python:{name:'Python',icon:'🐍',color:'#3776AB'},
  cpp:{name:'C++',icon:'⚙️',color:'#00599C'},typescript:{name:'TypeScript',icon:'🔷',color:'#3178C6'},
  sql:{name:'SQL',icon:'🗄️',color:'#4479A1'},react:{name:'React',icon:'⚛️',color:'#61DAFB'},
  nodejs:{name:'Node.js',icon:'🟢',color:'#339933'},nextjs:{name:'Next.js',icon:'▲',color:'#555'},
};

const MENTORS = [
  {name:'Dr. Priya K.',avatar:'PK',skill:'Full-Stack',status:'online'},
  {name:'Rahul M.',avatar:'RM',skill:'Algorithms',status:'online'},
  {name:'Sneha D.',avatar:'SD',skill:'System Design',status:'busy'},
];

const AI_REPLIES = [
  "Try breaking the problem into smaller parts first.",
  "Have you considered using a hash map for O(1) lookup?",
  "Remember to handle edge cases like empty input!",
  "Think about the time complexity of your approach.",
  "You could use recursion here, but watch for stack overflow.",
  "That's a great approach! Keep going.",
  "Try writing pseudocode before actual code.",
];

type Phase = 'protocols' | 'coding' | 'results';
type Role = 'coder' | 'navigator';
type ChatMsg = {from:string;text:string;time:string};

export default function CodingRoom() {
  const router = useRouter();
  const sp = useSearchParams();
  const stack = sp.get('skill') || 'javascript';
  const partnerName = sp.get('partner') || 'Aarav Mehta';
  const partnerAvatar = sp.get('avatar') || 'AM';
  const m = META[stack] || META.javascript;

  const [phase, setPhase] = useState<Phase>('protocols');
  const [questions, setQuestions] = useState<CodingQuestion[]>([]);
  const [activeQ, setActiveQ] = useState(0);
  const [code, setCode] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30*60);
  const [role, setRole] = useState<Role>('coder');
  const [roleSwaps, setRoleSwaps] = useState(0);
  const [micOn, setMicOn] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showMentor, setShowMentor] = useState(false);
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([{from:'bot',text:'Welcome! I\'m your AI assistant. Ask me anything about the problem.',time:'now'}]);
  const [chatInput, setChatInput] = useState('');
  const [testResults, setTestResults] = useState<(boolean|null)[][]>([]);
  const [partnerReady, setPartnerReady] = useState(false);
  const [myReady, setMyReady] = useState(false);
  const [feedback, setFeedback] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  useEffect(() => {
    const qs = getRandomCodingQuestions(stack, 2);
    setQuestions(qs);
    setCode(qs.map(q => q.starter));
    setTestResults(qs.map(q => q.testCases.map(() => null)));
  }, [stack]);

  useEffect(() => {
    if (phase !== 'coding') return;
    const t = setInterval(() => {
      setTimeLeft(p => { if (p <= 1) { clearInterval(t); finishSession(); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'coding') return;
    (async()=>{try{await document.documentElement.requestFullscreen();}catch(_){}})();
    const block = () => window.history.pushState(null,'',window.location.href);
    window.history.pushState(null,'',window.location.href);
    window.addEventListener('popstate', block);
    const blockKeys = (e:KeyboardEvent) => {
      if (e.key==='Escape'||e.key==='F11'||e.key==='F5'||e.key==='F12') { e.preventDefault(); e.stopPropagation(); }
      if ((e.ctrlKey||e.metaKey) && ['w','t','n','r','l','q'].includes(e.key.toLowerCase())) { e.preventDefault(); e.stopPropagation(); }
      if (e.altKey && (e.key==='Tab'||e.key==='F4')) { e.preventDefault(); e.stopPropagation(); }
    };
    window.addEventListener('keydown', blockKeys, true);
    const blockCtxMenu = (e:MouseEvent) => e.preventDefault();
    window.addEventListener('contextmenu', blockCtxMenu);
    const onBlur = () => { try { window.focus(); } catch(_){} };
    window.addEventListener('blur', onBlur);
    return () => { window.removeEventListener('popstate',block); window.removeEventListener('keydown',blockKeys,true); window.removeEventListener('contextmenu',blockCtxMenu); window.removeEventListener('blur',onBlur); };
  }, [phase]);

  const finishSession = useCallback(() => {
    setPhase('results');
    (async()=>{try{if(document.fullscreenElement) await document.exitFullscreen();}catch(_){}})();
    // Save progress
    try {
      const p = JSON.parse(localStorage.getItem('dateforcode_progress')||'{}');
      p.codeDone = true;
      p.sessions = (p.sessions||0) + 1;
      // Calculate HP from test results
      const allTests = testResults.flat();
      const passedCount = allTests.filter(t => t === true).length;
      const earnedHp = passedCount * 15 + roleSwaps * 5;
      p.hp = (p.hp||0) + earnedHp;
      const today = new Date().toISOString().split('T')[0];
      if (p.lastDate !== today) { p.streak = (p.streak||0) + 1; p.lastDate = today; }
      localStorage.setItem('dateforcode_progress', JSON.stringify(p));
    } catch(_) {}
  }, [testResults, roleSwaps]);

  const runTests = () => {
    const res = [...testResults];
    res[activeQ] = questions[activeQ].testCases.map(() => Math.random() > 0.3);
    setTestResults(res);
  };

  const toggleRole = () => { setRole(r => r === 'coder' ? 'navigator' : 'coder'); setRoleSwaps(s => s + 1); };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const now = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    setChatMsgs(p => [...p, {from:'you',text:chatInput,time:now}]);
    setChatInput('');
    setTimeout(() => {
      setChatMsgs(p => [...p, {from:'bot',text:AI_REPLIES[Math.floor(Math.random()*AI_REPLIES.length)],time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}]);
    }, 1200);
  };

  useEffect(() => { if (!myReady) return; const t = setTimeout(() => setPartnerReady(true), 3000); return () => clearTimeout(t); }, [myReady]);
  useEffect(() => { if (myReady && partnerReady) finishSession(); }, [myReady, partnerReady, finishSession]);

  const mins = Math.floor(timeLeft/60), secs = timeLeft%60;
  const totalTests = testResults.flat();
  const passed = totalTests.filter(t => t === true).length;
  const failed = totalTests.filter(t => t === false).length;
  const hp = passed * 15 + roleSwaps * 5;

  if (questions.length === 0) return <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center"><div className="w-8 h-8 border-2 border-black/10 border-t-black/40 rounded-full animate-spin"/></div>;

  return (
    <main className="fixed inset-0 bg-[#F8F9FC] z-[9999] flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ═══ PROTOCOLS ═══ */}
        {phase === 'protocols' && (
          <motion.div key="proto" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 flex items-center justify-center p-8">
            <motion.div initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} className="max-w-lg w-full">
              <div className="bg-white rounded-2xl border border-black/5 p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{background:`${m.color}12`}}>{m.icon}</div>
                  <div>
                    <h2 className="text-xl font-black text-[#111]">{m.name} Coding Room</h2>
                    <p className="text-[10px] text-black/25 uppercase tracking-widest font-bold">Pair Programming Session</p>
                  </div>
                </div>
                <div className="space-y-2.5 mb-6">
                  {[
                    {icon:Clock,text:'30 minutes to solve 2 coding challenges',hl:false},
                    {icon:Users,text:`Your partner: ${partnerName}`,hl:false},
                    {icon:Code2,text:'Switch roles: Coder ↔ Navigator anytime',hl:false},
                    {icon:Mic,text:'Use mic & screen share to collaborate',hl:false},
                    {icon:Bot,text:'AI Chat Bot available for quick help',hl:false},
                    {icon:UserCheck,text:'Request a live mentor for guidance',hl:false},
                    {icon:Shield,text:'Both partners must click Submit to finish',hl:false},
                    {icon:Trophy,text:'HP: +15 per test case passed, +5 per role swap',hl:true},
                    {icon:X,text:'No going back once you enter. Full focus mode.',hl:false},
                  ].map((r,i) => (
                    <motion.div key={i} initial={{opacity:0,x:-15}} animate={{opacity:1,x:0}} transition={{delay:0.1+i*0.06}}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${r.hl?'bg-amber-50 border-amber-200':'bg-black/[0.01] border-black/5'}`}>
                      <r.icon className="w-4 h-4 flex-shrink-0" style={{color:r.hl?'#F59E0B':m.color}} />
                      <span className={`text-xs font-medium ${r.hl?'text-amber-600 font-bold':'text-black/40'}`}>{r.text}</span>
                    </motion.div>
                  ))}
                </div>
                <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>setPhase('coding')}
                  className="w-full py-3.5 rounded-xl text-white text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                  style={{background:`linear-gradient(135deg,${m.color},${m.color}CC)`,boxShadow:`0 8px 25px ${m.color}25`}}>
                  <Code2 className="w-4 h-4"/>Enter Terminal<ArrowRight className="w-4 h-4"/>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ═══ CODING TERMINAL ═══ */}
        {phase === 'coding' && (
          <motion.div key="code" initial={{opacity:0}} animate={{opacity:1}} className="flex-1 flex flex-col">
            {/* Top bar */}
            <div className="bg-white border-b border-black/8 px-5 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <Logo size={26}/>
                <div className="w-px h-5 bg-black/10"/>
                <span className="text-xl">{m.icon}</span>
                <span className="text-sm font-extrabold text-[#111]">{m.name}</span>
                <div className="w-px h-5 bg-black/10"/>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider" style={{background:`${role==='coder'?m.color:'#8B5CF6'}15`,color:role==='coder'?m.color:'#8B5CF6',border:`1px solid ${role==='coder'?m.color:'#8B5CF6'}25`}}>
                  {role==='coder'?<Code2 className="w-3.5 h-3.5"/>:<Eye className="w-3.5 h-3.5"/>}{role}
                </div>
                <button onClick={toggleRole} className="px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border border-black/8 text-black/35 hover:text-black/60 hover:bg-black/[0.02] transition-all"><RotateCcw className="w-3 h-3 inline mr-1"/>Switch Role</button>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-black/[0.02] border border-black/5">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black" style={{background:`${m.color}15`,color:m.color}}>{partnerAvatar}</div>
                  <span className="text-xs font-bold text-[#333]">{partnerName}</span>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                </div>
                <div className="w-px h-5 bg-black/8"/>
                <button onClick={()=>setMicOn(!micOn)} className={`p-2.5 rounded-xl border transition-all ${micOn?'bg-green-50 border-green-300 text-green-600 shadow-sm':'bg-white border-black/8 text-black/25 hover:text-black/40'}`} title={micOn?'Mute':'Unmute'}>
                  {micOn?<Mic className="w-4 h-4"/>:<MicOff className="w-4 h-4"/>}
                </button>
                <button onClick={()=>setScreenShare(!screenShare)} className={`p-2.5 rounded-xl border transition-all ${screenShare?'bg-blue-50 border-blue-300 text-blue-600 shadow-sm':'bg-white border-black/8 text-black/25 hover:text-black/40'}`} title="Screen Share">
                  <Monitor className="w-4 h-4"/>
                </button>
                <button onClick={()=>{setShowChat(!showChat);setShowMentor(false);}} className={`p-2.5 rounded-xl border transition-all ${showChat?'bg-purple-50 border-purple-300 text-purple-600 shadow-sm':'bg-white border-black/8 text-black/25 hover:text-black/40'}`} title="AI Chat">
                  <MessageSquare className="w-4 h-4"/>
                </button>
                <button onClick={()=>{setShowMentor(!showMentor);setShowChat(false);}} className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-600 hover:bg-amber-100 transition-all shadow-sm" title="Ask Mentor">
                  <UserCheck className="w-4 h-4"/>
                </button>
                <div className="w-px h-5 bg-black/8"/>
                <div className={`px-4 py-2 rounded-xl font-mono text-base font-extrabold border ${timeLeft<60?'bg-red-50 border-red-300 text-red-600 animate-pulse shadow-sm':timeLeft<300?'bg-amber-50 border-amber-200 text-amber-600':'bg-white border-black/8 text-[#222]'}`}>
                  <Clock className="w-3.5 h-3.5 inline mr-1.5"/>{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
                </div>
                <button onClick={()=>setShowEndConfirm(true)} className="px-4 py-2 rounded-xl bg-red-50 border border-red-300 text-red-600 text-xs font-extrabold uppercase tracking-wider hover:bg-red-100 transition-all">
                  <X className="w-3.5 h-3.5 inline mr-1"/>End
                </button>
              </div>
            </div>

            {/* End Test Confirm Modal */}
            <AnimatePresence>
              {showEndConfirm && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="bg-white rounded-2xl border border-black/5 shadow-2xl p-8 max-w-sm w-full mx-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-4"><AlertTriangle className="w-7 h-7 text-red-500"/></div>
                    <h3 className="text-lg font-black text-center text-[#111] mb-2">End Session?</h3>
                    <p className="text-xs text-center text-black/30 mb-6">Your progress will be saved. Both you and your partner will exit the coding room.</p>
                    <div className="flex gap-3">
                      <button onClick={()=>setShowEndConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-black/8 text-xs font-bold text-black/30 hover:text-black">Cancel</button>
                      <button onClick={()=>{setShowEndConfirm(false);finishSession();}} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600">End Session</button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 flex overflow-hidden">
              {/* LEFT — Question + Tests */}
              <div className="w-[360px] bg-white border-r border-black/5 flex flex-col flex-shrink-0">
                <div className="flex border-b border-black/5 px-2 pt-2">
                  {questions.map((_,i)=>(
                    <button key={i} onClick={()=>setActiveQ(i)} className={`px-4 py-2 text-xs font-bold rounded-t-lg ${i===activeQ?'bg-[#F8F9FC] text-[#111] border-t border-x border-black/5':'text-black/25 hover:text-black/40'}`}>Q{i+1}</button>
                  ))}
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-[#F8F9FC]">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md" style={{background:`${m.color}12`,color:m.color}}>{questions[activeQ]?.difficulty}</span>
                  <h3 className="text-base font-bold mt-3 mb-2 text-[#111]">{questions[activeQ]?.title}</h3>
                  <p className="text-xs text-black/35 leading-relaxed mb-4">{questions[activeQ]?.desc}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-black/15 mb-2">Test Cases</p>
                  <div className="space-y-2">
                    {questions[activeQ]?.testCases.map((tc,i)=>{
                      const r = testResults[activeQ]?.[i];
                      return (
                        <div key={i} className={`rounded-xl border p-3 text-[11px] font-mono ${r===true?'bg-green-50 border-green-200':r===false?'bg-red-50 border-red-200':'bg-white border-black/5'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-black/20 text-[9px] font-sans font-bold">Test {i+1}</span>
                            {r!==null && (r?<CheckCircle2 className="w-3 h-3 text-green-500"/>:<XCircle className="w-3 h-3 text-red-500"/>)}
                          </div>
                          <p className="text-black/40">Input: <span className="text-black/60">{tc.input}</span></p>
                          <p className="text-black/40">Expected: <span className="text-green-600">{tc.expected}</span></p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-3 border-t border-black/5 space-y-2 bg-white">
                  <button onClick={runTests} className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-600 hover:bg-green-100">
                    <Play className="w-3.5 h-3.5"/>Run Tests
                  </button>
                  <button onClick={()=>setMyReady(true)} disabled={myReady}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border ${myReady?'bg-amber-50 border-amber-200 text-amber-600':'border-black/8 text-black/30 hover:text-black/50'}`}>
                    <Shield className="w-3.5 h-3.5"/>{myReady?(partnerReady?'Both Ready!':'Waiting for partner...'):'Submit Code'}
                  </button>
                </div>
              </div>

              {/* CENTER — Code Editor */}
              <div className="flex-1 flex flex-col bg-[#1E1E2E]">
                <div className="bg-[#181825] px-4 py-2 flex items-center justify-between border-b border-white/5">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">solution.{stack==='cpp'?'cpp':stack==='python'?'py':stack==='sql'?'sql':'ts'}</span>
                  <span className="text-[9px] text-white/15 font-mono">{code[activeQ]?.split('\n').length || 0} lines</span>
                </div>
                <div className="flex-1 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#181825] border-r border-white/5 flex flex-col items-center pt-2 text-[10px] font-mono text-white/15 overflow-hidden">
                    {(code[activeQ]||'').split('\n').map((_,i)=><div key={i} className="h-[21px] flex items-center">{i+1}</div>)}
                  </div>
                  <textarea value={code[activeQ]||''} onChange={e=>{const c=[...code];c[activeQ]=e.target.value;setCode(c);}}
                    className="w-full h-full pl-12 pr-4 py-2 bg-transparent text-sm font-mono text-[#CDD6F4] resize-none outline-none leading-[21px] caret-[#89B4FA]"
                    spellCheck={false} style={{tabSize:2}}/>
                </div>
              </div>

              {/* RIGHT — Chat / Mentor */}
              <AnimatePresence>
                {(showChat||showMentor) && (
                  <motion.div initial={{width:0,opacity:0}} animate={{width:280,opacity:1}} exit={{width:0,opacity:0}}
                    className="bg-white border-l border-black/5 flex flex-col overflow-hidden flex-shrink-0">
                    <div className="flex border-b border-black/5">
                      <button onClick={()=>{setShowChat(true);setShowMentor(false);}} className={`flex-1 py-2.5 text-[10px] font-bold uppercase ${showChat?'text-purple-600 bg-purple-50':'text-black/25'}`}>
                        <Bot className="w-3 h-3 inline mr-1"/>Chat
                      </button>
                      <button onClick={()=>{setShowMentor(true);setShowChat(false);}} className={`flex-1 py-2.5 text-[10px] font-bold uppercase ${showMentor?'text-amber-600 bg-amber-50':'text-black/25'}`}>
                        <UserCheck className="w-3 h-3 inline mr-1"/>Mentor
                      </button>
                    </div>
                    {showChat && (<>
                      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#F8F9FC]">
                        {chatMsgs.map((msg,i)=>(
                          <div key={i} className={`flex ${msg.from==='you'?'justify-end':'justify-start'}`}>
                            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[11px] ${msg.from==='you'?'bg-blue-100 text-blue-800':'bg-white border border-black/5 text-black/50'}`}>
                              {msg.from==='bot'&&<Bot className="w-3 h-3 inline mr-1 text-green-500"/>}{msg.text}
                              <span className="block text-[8px] text-black/15 mt-0.5">{msg.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-2 border-t border-black/5 flex gap-2">
                        <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendChat()}
                          placeholder="Ask AI..." className="flex-1 bg-[#F8F9FC] rounded-lg px-3 py-2 text-xs text-[#111] outline-none border border-black/5 placeholder:text-black/15"/>
                        <button onClick={sendChat} className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-500"><Send className="w-3.5 h-3.5"/></button>
                      </div>
                    </>)}
                    {showMentor && (
                      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#F8F9FC]">
                        <p className="text-[9px] text-black/15 font-bold uppercase tracking-wider mb-2">Available Mentors</p>
                        {MENTORS.map((mt,i)=>(
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-black/5">
                            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[10px] font-black text-amber-500">{mt.avatar}</div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-[#222]">{mt.name}</p>
                              <p className="text-[9px] text-black/20">{mt.skill}</p>
                            </div>
                            <button className={`px-3 py-1.5 rounded-lg text-[9px] font-bold border ${mt.status==='online'?'bg-green-50 border-green-200 text-green-600':'bg-black/[0.02] border-black/5 text-black/15'}`}>
                              {mt.status==='online'?'Request':'Busy'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ═══ RESULTS ═══ */}
        {phase === 'results' && (
          <motion.div key="results" initial={{opacity:0}} animate={{opacity:1}} className="flex-1 overflow-y-auto p-8 bg-[#F8F9FC] relative">
            {/* Celebration confetti */}
            {Array.from({length:30}).map((_,i)=>(
              <motion.div key={i} className="absolute rounded-full pointer-events-none" initial={{opacity:0,scale:0,y:0}}
                animate={{opacity:[0,1,0],y:-150-Math.random()*200,x:(Math.random()-0.5)*500,scale:[0,1,0],rotate:Math.random()*360}}
                transition={{duration:2.5,delay:i*0.05}}
                style={{width:6+Math.random()*8,height:6+Math.random()*8,left:'50%',top:'30%',
                  background:['#10B981','#3B82F6','#8B5CF6','#F59E0B','#EC4899','#FF4D6D',m.color][i%7]}}/>
            ))}

            <div className="max-w-2xl mx-auto text-center relative z-10">
              {/* Pair Avatars */}
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="flex items-center justify-center gap-4 mb-6">
                <motion.div initial={{x:-80,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:0.6,ease:[0.16,1,0.3,1]}} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF4D6D] to-[#FF758C] flex items-center justify-center text-white text-sm font-black shadow-lg">You</div>
                </motion.div>
                <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.4,type:'spring'}} className="w-12 h-12 rounded-full bg-green-50 border-2 border-green-300 flex items-center justify-center shadow">
                  <Heart className="w-5 h-5 text-green-500"/>
                </motion.div>
                <motion.div initial={{x:80,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:0.6,ease:[0.16,1,0.3,1]}} className="text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-sm font-black shadow-lg" style={{background:`linear-gradient(135deg,${m.color},${m.color}CC)`,color:'white'}}>{partnerAvatar}</div>
                </motion.div>
              </motion.div>

              <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.3,type:'spring'}}>
                <Sparkles className="w-8 h-8 mx-auto text-amber-400 mb-2"/>
              </motion.div>
              <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-emerald-400 to-teal-400 mb-1">Session Complete!</h2>
              <p className="text-sm text-black/30 mb-8">Amazing teamwork with <span className="font-bold text-black/50">{partnerName}</span>!</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[{icon:CheckCircle2,val:passed,label:'Tests Passed',c:'#10B981'},{icon:XCircle,val:failed,label:'Tests Failed',c:'#EF4444'},
                  {icon:RotateCcw,val:roleSwaps,label:'Role Swaps',c:'#8B5CF6'},{icon:Trophy,val:`+${hp}`,label:'HP Earned',c:'#F59E0B'}].map((s,i)=>(
                  <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4+i*0.1}}
                    className="rounded-2xl p-5 text-center bg-white border-2 shadow-md" style={{borderColor:`${s.c}20`}}>
                    <s.icon className="w-6 h-6 mx-auto mb-2" style={{color:s.c}}/>
                    <motion.p initial={{scale:0}} animate={{scale:1}} transition={{delay:0.6+i*0.1,type:'spring'}} className="text-2xl font-black" style={{color:s.c}}>{s.val}</motion.p>
                    <p className="text-[9px] text-black/25 uppercase font-bold tracking-wider mt-1">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Session Summary Card */}
              <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.8}} className="bg-white rounded-2xl border border-black/5 shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{background:`${m.color}12`}}>{m.icon}</div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#222]">{m.name} Session</p>
                      <p className="text-[9px] text-black/20">Pair Programming</p>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-[10px] font-bold text-green-600">Completed ✓</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl p-3 bg-[#F8F9FC]">
                    <p className="text-lg font-black text-[#222]">{30-mins}</p>
                    <p className="text-[8px] text-black/20 uppercase font-bold">Min Used</p>
                  </div>
                  <div className="rounded-xl p-3 bg-[#F8F9FC]">
                    <p className="text-lg font-black text-[#222]">{questions.length}</p>
                    <p className="text-[8px] text-black/20 uppercase font-bold">Questions</p>
                  </div>
                  <div className="rounded-xl p-3 bg-[#F8F9FC]">
                    <p className="text-lg font-black text-[#222]">{code.reduce((a,c)=>a+c.split('\n').length,0)}</p>
                    <p className="text-[8px] text-black/20 uppercase font-bold">Lines Written</p>
                  </div>
                </div>
              </motion.div>

              {/* Feedback */}
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1}} className="bg-white rounded-2xl border border-black/5 p-6 mb-6 shadow-sm">
                <p className="text-sm font-bold text-[#222] mb-1">How was this session?</p>
                <p className="text-[10px] text-black/20 mb-4">Your feedback helps us improve the experience</p>
                <div className="flex gap-3 justify-center mb-2">
                  {[1,2,3,4,5].map(s=>(
                    <motion.button key={s} whileHover={{scale:1.15}} whileTap={{scale:0.9}} onClick={()=>setFeedback(s)}>
                      <Star className="w-9 h-9" fill={s<=feedback?'#F59E0B':'none'} color={s<=feedback?'#F59E0B':'rgba(0,0,0,0.08)'} strokeWidth={1.5}/>
                    </motion.button>
                  ))}
                </div>
                {feedback>0 && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-xs text-amber-500 font-bold">{['','Poor','Fair','Good','Great','Amazing!'][feedback]}</motion.p>}
              </motion.div>

              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:1.2}} className="flex gap-3 justify-center">
                <motion.button whileHover={{scale:1.03}} onClick={()=>router.push('/student/dashboard')} className="flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-black/8 text-xs font-extrabold text-black/35 hover:text-black uppercase tracking-wider">
                  <Home className="w-4 h-4"/>Dashboard
                </motion.button>
                <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>router.push('/student/skill-assessment')}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-white text-sm font-extrabold uppercase tracking-wider shadow-xl"
                  style={{background:`linear-gradient(135deg,${m.color},${m.color}CC)`,boxShadow:`0 10px 30px ${m.color}25`}}>
                  <Sparkles className="w-4 h-4"/>New Session<ArrowRight className="w-4 h-4"/>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
