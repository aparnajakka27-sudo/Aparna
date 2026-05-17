"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, ChevronRight, ChevronLeft, Trophy, RotateCcw, Sparkles, Zap, Target, Home, AlertTriangle, Eye, EyeOff, ShieldCheck, X } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { getRandomQuestions, PASS_MARK, TOTAL_QUESTIONS } from '@/data/questions';

const SKILL_META: Record<string,{name:string,icon:string,color:string}> = {
  javascript:{name:'JavaScript',icon:'⚡',color:'#D97706'}, python:{name:'Python',icon:'🐍',color:'#3776AB'},
  typescript:{name:'TypeScript',icon:'🔷',color:'#3178C6'}, react:{name:'React',icon:'⚛️',color:'#61DAFB'},
  nextjs:{name:'Next.js',icon:'▲',color:'#555'}, nodejs:{name:'Node.js',icon:'🟢',color:'#339933'},
  java:{name:'Java',icon:'☕',color:'#ED8B00'}, cpp:{name:'C++',icon:'⚙️',color:'#00599C'},
  'html-css':{name:'HTML & CSS',icon:'🎨',color:'#E34F26'}, sql:{name:'SQL',icon:'🗄️',color:'#4479A1'},
  git:{name:'Git & GitHub',icon:'🔀',color:'#F05032'}, rust:{name:'Rust',icon:'🦀',color:'#CE422B'},
  go:{name:'Go',icon:'🐹',color:'#00ADD8'}, docker:{name:'Docker',icon:'🐳',color:'#2496ED'},
  aws:{name:'AWS Cloud',icon:'☁️',color:'#FF9900'}, flutter:{name:'Flutter',icon:'💙',color:'#02569B'},
};
type Question = {id:number,q:string,options:string[],answer:number};

export default function TestPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params.skillId as string;
  const meta = SKILL_META[skillId] || {name:'Assessment',icon:'📝',color:'#FF4D6D'};

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number|null)[]>([]);
  const [selectedOption, setSelectedOption] = useState<number|null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Load questions
  useEffect(() => {
    const qs = getRandomQuestions(skillId, TOTAL_QUESTIONS);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
  }, [skillId]);

  // Fullscreen + navigation lock
  useEffect(() => {
    if (questions.length === 0 || isFinished) return;
    // Request fullscreen safely — browsers require user gesture, so catch silently
    (async () => { try { await document.documentElement.requestFullscreen(); } catch(_) { /* requires user gesture — handled via click */ } })();
    const blockBack = (e: PopStateEvent) => { window.history.pushState(null,'',window.location.href); };
    window.history.pushState(null,'',window.location.href);
    window.addEventListener('popstate', blockBack);
    const blockKeys = (e: KeyboardEvent) => { if(e.key==='Escape'||e.key==='F11'||(e.altKey&&e.key==='F4')) e.preventDefault(); };
    window.addEventListener('keydown', blockKeys);
    const blockBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', blockBeforeUnload);
    return () => { window.removeEventListener('popstate', blockBack); window.removeEventListener('keydown', blockKeys); window.removeEventListener('beforeunload', blockBeforeUnload); };
  }, [questions.length, isFinished]);

  // Timer
  useEffect(() => {
    if (isFinished || questions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { clearInterval(timer); finishTest(); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, questions.length]);

  const selectOption = (oi: number) => { if (!isFinished) setSelectedOption(oi); };
  const confirmAndNext = () => {
    if (selectedOption === null && answers[currentQ] === null) return;
    const a = [...answers]; if (selectedOption !== null) a[currentQ] = selectedOption; setAnswers(a);
    setSelectedOption(null);
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
  };
  const goToPrev = () => { if (currentQ > 0) { setCurrentQ(currentQ - 1); setSelectedOption(answers[currentQ - 1]); } };
  const goToQ = (i: number) => { setCurrentQ(i); setSelectedOption(answers[i]); };

  const finishTest = useCallback(() => {
    // Save current selection before finishing
    setAnswers(prev => {
      const a = [...prev];
      return a;
    });
    setIsFinished(true);
    (async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); } catch(_) {} })();
  }, []);

  const handleSubmit = () => {
    if (selectedOption !== null) { const a = [...answers]; a[currentQ] = selectedOption; setAnswers(a); }
    finishTest();
  };

  const score = answers.reduce((acc, ans, i) => (ans !== null && questions[i] && ans === questions[i].answer ? acc + 1 : acc), 0);
  const attempted = answers.filter(a => a !== null).length;
  const wrong = attempted - score;
  const passed = score >= PASS_MARK;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const active = selectedOption ?? answers[currentQ];

  if (questions.length === 0) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#FF4D6D]/20 border-t-[#FF4D6D] rounded-full animate-spin"/></div>;

  return (
    <main className="fixed inset-0 bg-[#F5F5F7] z-[9999] flex flex-col overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.015) 1px, transparent 0)',backgroundSize:'28px 28px'}} />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px]" style={{background:`${meta.color}06`}} />
      </div>

      {/* ═══ TOP BAR (hidden after submit) ═══ */}
      {!isFinished && (<>
      <div className="relative z-20 bg-white border-b border-black/5 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold" style={{background:`${meta.color}12`}}>{meta.icon}</div>
          <div>
            <p className="text-base font-extrabold text-[#111]">{meta.name} Assessment</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-black/25">Q {currentQ+1} of {TOTAL_QUESTIONS} • Need {PASS_MARK} to pass</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-extrabold font-mono ${timeLeft<60?'bg-red-50 border-red-200 text-red-500 animate-pulse':'bg-white border-black/8 text-[#222]'}`}>
            <Clock className="w-4 h-4" />{mins.toString().padStart(2,'0')}:{secs.toString().padStart(2,'0')}
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-white border border-black/8 text-sm font-bold text-black/40">
            {attempted}/{TOTAL_QUESTIONS}
          </div>
          <button onClick={()=>setShowEndConfirm(true)} className="px-5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-500 text-xs font-extrabold uppercase tracking-wider hover:bg-red-100 transition-all flex items-center gap-2">
            <X className="w-3.5 h-3.5"/>End Test
          </button>
        </div>
      </div>
      <div className="h-1 bg-black/[0.03] flex-shrink-0">
        <motion.div className="h-full" style={{background:`linear-gradient(90deg, ${meta.color}, ${meta.color}80)`}} animate={{width:`${((currentQ+1)/TOTAL_QUESTIONS)*100}%`}} transition={{duration:0.3}} />
      </div>
      </>)}

      {/* ═══ MAIN CONTENT ═══ */}
      {!isFinished ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Question Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              <motion.div key={currentQ} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.25}} className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl border-[1.5px] p-8 shadow-sm mb-6" style={{borderColor:`${meta.color}18`}}>
                  <span className="inline-block px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest mb-5" style={{background:`${meta.color}10`,color:meta.color}}>Question {currentQ+1}</span>
                  <h2 className="text-xl font-extrabold text-[#111] leading-relaxed">{questions[currentQ].q}</h2>
                </div>
                <div className="space-y-3 mb-8">
                  {questions[currentQ].options.map((opt, oi) => {
                    const isSel = active === oi;
                    return (
                      <motion.button key={oi} whileTap={{scale:0.98}} onClick={()=>selectOption(oi)}
                        className="w-full text-left p-5 rounded-xl border-[1.5px] transition-all duration-200 flex items-center gap-4"
                        style={{borderColor:isSel?`${meta.color}50`:'rgba(0,0,0,0.06)', background:isSel?`${meta.color}06`:'white', boxShadow:isSel?`0 4px 15px ${meta.color}10`:'none'}}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-extrabold border-[1.5px] flex-shrink-0"
                          style={{borderColor:isSel?meta.color:'rgba(0,0,0,0.08)', background:isSel?meta.color:'rgba(0,0,0,0.02)', color:isSel?'white':'rgba(0,0,0,0.3)'}}>
                          {String.fromCharCode(65+oi)}
                        </div>
                        <span className="text-sm font-bold" style={{color:isSel?'#111':'rgba(0,0,0,0.5)'}}>{opt}</span>
                      </motion.button>
                    );
                  })}
                </div>
                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button onClick={goToPrev} disabled={currentQ===0} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-black/8 text-xs font-extrabold uppercase tracking-wider text-black/30 hover:text-black disabled:opacity-20 transition-all">
                    <ChevronLeft className="w-4 h-4"/>Previous
                  </button>
                  <div className="flex items-center gap-3">
                    {currentQ === questions.length - 1 ? (
                      <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={handleSubmit}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wider text-white shadow-lg"
                        style={{background:`linear-gradient(135deg, #10B981, #34D399)`,boxShadow:'0 8px 25px rgba(16,185,129,0.25)'}}>
                        <ShieldCheck className="w-4 h-4"/>Submit Test
                      </motion.button>
                    ) : (
                      <button onClick={confirmAndNext}
                        className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wider text-white transition-all"
                        style={{background:meta.color}}>
                        Next<ChevronRight className="w-4 h-4"/>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ═══ RIGHT SIDEBAR — Question Grid ═══ */}
          <div className="w-64 bg-white border-l border-black/5 p-5 flex flex-col flex-shrink-0 overflow-y-auto">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-black/25 mb-4">Questions</p>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {questions.map((_,i)=>(
                <button key={i} onClick={()=>goToQ(i)}
                  className="w-9 h-9 rounded-lg text-xs font-extrabold flex items-center justify-center transition-all border-[1.5px]"
                  style={{
                    background: i===currentQ ? `${meta.color}15` : answers[i]!==null ? `${meta.color}08` : 'white',
                    borderColor: i===currentQ ? `${meta.color}50` : answers[i]!==null ? `${meta.color}20` : 'rgba(0,0,0,0.06)',
                    color: i===currentQ ? meta.color : answers[i]!==null ? `${meta.color}` : 'rgba(0,0,0,0.2)',
                  }}>{i+1}</button>
              ))}
            </div>
            <div className="space-y-2 mt-auto">
              <div className="flex items-center gap-2 text-[10px] font-bold text-black/25"><div className="w-3 h-3 rounded border-[1.5px]" style={{borderColor:`${meta.color}50`,background:`${meta.color}15`}}/> Current</div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-black/25"><div className="w-3 h-3 rounded border-[1.5px]" style={{borderColor:`${meta.color}20`,background:`${meta.color}08`}}/> Answered</div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-black/25"><div className="w-3 h-3 rounded border-[1.5px] border-black/6 bg-white"/> Not answered</div>
            </div>
            <div className="mt-6 pt-4 border-t border-black/5">
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleSubmit}
                className="w-full py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white flex items-center justify-center gap-2"
                style={{background:'linear-gradient(135deg, #10B981, #34D399)'}}>
                <ShieldCheck className="w-4 h-4"/>Submit
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        /* ═══ RESULTS — CREATIVE ═══ */
        <div className="flex-1 overflow-y-auto relative">
          {/* Floating confetti / particles */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
            {passed && Array.from({length:30}).map((_,i)=>(
              <motion.div key={i} className="absolute rounded-full" initial={{opacity:0,y:-20,x:Math.random()*100+'vw'}}
                animate={{opacity:[0,1,1,0],y:['0vh','100vh'],rotate:[0,360*(Math.random()>0.5?1:-1)]}}
                transition={{duration:2.5+Math.random()*2,delay:Math.random()*1.5,repeat:1}}
                style={{left:`${Math.random()*100}%`,width:6+Math.random()*8,height:6+Math.random()*8,
                  background:['#10B981','#34D399','#6EE7B7','#F59E0B','#3B82F6','#8B5CF6','#EC4899',meta.color][i%8]}} />
            ))}
            {!passed && Array.from({length:15}).map((_,i)=>(
              <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-red-300/30" initial={{opacity:0}}
                animate={{opacity:[0,0.5,0],y:[0,80],x:[0,(Math.random()-0.5)*40]}}
                transition={{duration:3,delay:i*0.2,repeat:Infinity}}
                style={{left:`${10+i*6}%`,top:`${20+Math.random()*40}%`}} />
            ))}
          </div>

          {/* Hero gradient section */}
          <div className="relative z-20 pt-6 pb-10 px-8" style={{background:passed?'linear-gradient(180deg,#ECFDF5 0%,#F5F5F7 100%)':'linear-gradient(180deg,#FEF2F2 0%,#F5F5F7 100%)'}}>
            <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className="max-w-xl mx-auto text-center">
              {/* Icon with glow */}
              <motion.div initial={{scale:0,rotate:-180}} animate={{scale:1,rotate:0}} transition={{delay:0.15,type:'spring',stiffness:200}}>
                <div className="relative w-24 h-24 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-3xl blur-xl" style={{background:passed?'#10B98130':'#EF444420'}} />
                  <div className="relative w-full h-full rounded-3xl flex items-center justify-center text-5xl bg-white shadow-xl border"
                    style={{borderColor:passed?'#10B98120':'#EF444420'}}>{passed?'🏆':'💪'}</div>
                </div>
              </motion.div>
              <motion.h2 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.25}}
                className="text-4xl font-black mb-2 bg-clip-text text-transparent" style={{backgroundImage:passed?'linear-gradient(135deg,#059669,#10B981,#34D399)':'linear-gradient(135deg,#DC2626,#EF4444,#F87171)'}}>
                {passed?'Assessment Cleared!':'Almost There!'}
              </motion.h2>
              <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.35}} className="text-sm text-black/35 font-medium max-w-sm mx-auto">
                {passed?`Outstanding! You scored ${score}/${TOTAL_QUESTIONS} in ${meta.name}. You've unlocked the Matching Room!`:`You scored ${score}/${TOTAL_QUESTIONS}. You need ${PASS_MARK} correct to unlock. Give it another shot!`}
              </motion.p>
            </motion.div>
          </div>

          <div className="relative z-20 px-8 pb-10 -mt-2">
            <div className="max-w-2xl mx-auto">
              {/* Score ring + stats row */}
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
                className="bg-white rounded-3xl border border-black/5 shadow-lg p-8 mb-5">
                <div className="flex items-center gap-8">
                  {/* Big score ring */}
                  <div className="relative w-36 h-36 flex-shrink-0">
                    <div className="absolute inset-2 rounded-full blur-lg" style={{background:passed?'#10B98115':'#EF444410'}} />
                    <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="6"/>
                      <circle cx="60" cy="60" r="44" fill="none" stroke="rgba(0,0,0,0.02)" strokeWidth="2"/>
                      <motion.circle cx="60" cy="60" r="52" fill="none" strokeWidth="6" strokeLinecap="round"
                        stroke={`url(#scoreGrad)`} strokeDasharray={`${2*Math.PI*52}`}
                        initial={{strokeDashoffset:2*Math.PI*52}} animate={{strokeDashoffset:2*Math.PI*52-(score/TOTAL_QUESTIONS)*2*Math.PI*52}}
                        transition={{delay:0.5,duration:1.5,ease:[0.16,1,0.3,1]}} />
                      <defs><linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={passed?'#059669':'#DC2626'}/><stop offset="100%" stopColor={passed?'#34D399':'#F87171'}/>
                      </linearGradient></defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                      <motion.span initial={{opacity:0,scale:0.5}} animate={{opacity:1,scale:1}} transition={{delay:0.8,type:'spring'}}
                        className="text-4xl font-black" style={{color:passed?'#059669':'#EF4444'}}>{score}</motion.span>
                      <span className="text-[10px] text-black/20 font-bold">out of {TOTAL_QUESTIONS}</span>
                      <span className="text-[9px] font-bold mt-0.5 px-2 py-0.5 rounded-full" style={{background:passed?'#10B98112':'#EF444410',color:passed?'#059669':'#EF4444'}}>
                        {Math.round((score/TOTAL_QUESTIONS)*100)}%
                      </span>
                    </div>
                  </div>
                  {/* Stats grid */}
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    {[{icon:Target,val:attempted,label:'Attempted',c:'#6366F1',bg:'#EEF2FF'},{icon:CheckCircle2,val:score,label:'Correct',c:'#10B981',bg:'#ECFDF5'},
                      {icon:XCircle,val:wrong,label:'Wrong',c:'#EF4444',bg:'#FEF2F2'},{icon:Trophy,val:`+${score*5}`,label:'HP Earned',c:'#F59E0B',bg:'#FFFBEB'}].map((s,i)=>(
                      <motion.div key={s.label} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.4+i*0.1}}
                        className="rounded-2xl p-4 flex items-center gap-3 border" style={{background:s.bg,borderColor:`${s.c}15`}}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${s.c}15`}}>
                          <s.icon className="w-5 h-5" style={{color:s.c}} />
                        </div>
                        <div>
                          <p className="text-lg font-black leading-none" style={{color:s.c}}>{s.val}</p>
                          <p className="text-[9px] text-black/30 uppercase font-bold tracking-wider mt-0.5">{s.label}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.6}}
                className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {passed ? (<>
                    <button onClick={()=>router.push('/student/dashboard')} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-black/8 text-xs font-extrabold uppercase tracking-wider text-black/30 hover:text-black hover:border-black/15 transition-all"><Home className="w-4 h-4"/>Dashboard</button>
                    <motion.button whileHover={{scale:1.04,boxShadow:'0 12px 35px rgba(16,185,129,0.35)'}} whileTap={{scale:0.97}}
                      onClick={()=>{
                        try{const p=JSON.parse(localStorage.getItem('dateforcode_progress')||'{}');p.skillDone=true;const today=new Date().toISOString().split('T')[0];if(p.lastDate!==today){p.streak=(p.streak||0)+1;p.lastDate=today;}localStorage.setItem('dateforcode_progress',JSON.stringify(p));}catch(_){}
                        router.push(`/student/matching-room?skill=${skillId}`);
                      }}
                      className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-white text-sm font-extrabold uppercase tracking-wider shadow-lg"
                      style={{background:'linear-gradient(135deg,#059669,#10B981,#34D399)',boxShadow:'0 8px 25px rgba(16,185,129,0.25)'}}>
                      <Sparkles className="w-4 h-4"/>Enter Matching Room
                    </motion.button>
                  </>) : (<>
                    <button onClick={()=>router.push('/student/skill-assessment')} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-black/8 text-xs font-extrabold uppercase tracking-wider text-black/30 hover:text-black transition-all"><Home className="w-4 h-4"/>Back</button>
                    <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.97}} onClick={()=>window.location.reload()}
                      className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-white text-sm font-extrabold uppercase tracking-wider shadow-lg"
                      style={{background:`linear-gradient(135deg,${meta.color},${meta.color}CC)`,boxShadow:`0 8px 25px ${meta.color}25`}}>
                      <RotateCcw className="w-4 h-4"/>Reattempt Now
                    </motion.button>
                  </>)}
                </div>
                <button onClick={()=>setShowReview(!showReview)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-black/8 text-xs font-bold text-black/30 hover:text-black transition-all">
                  {showReview?<EyeOff className="w-3.5 h-3.5"/>:<Eye className="w-3.5 h-3.5"/>}{showReview?'Hide Review':'Review Answers'}
                </button>
              </motion.div>

              {/* ═══ QUESTION REVIEW ═══ */}
              <AnimatePresence>
                {showReview && (
                  <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="space-y-3 pb-8">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-black/20 mb-2 flex items-center gap-2"><Eye className="w-3.5 h-3.5"/>Question Review</p>
                    {questions.map((q,i) => {
                      const userAns = answers[i]; const isCorrect = userAns === q.answer; const notAttempted = userAns === null;
                      const borderC = notAttempted?'rgba(0,0,0,0.05)':isCorrect?'#10B98125':'#EF444425';
                      return (
                        <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
                          className="bg-white rounded-2xl border-[1.5px] p-5 shadow-sm" style={{borderColor:borderC}}>
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black"
                              style={{background:notAttempted?'rgba(0,0,0,0.04)':isCorrect?'#ECFDF5':'#FEF2F2',color:notAttempted?'rgba(0,0,0,0.2)':isCorrect?'#059669':'#DC2626'}}>
                              {notAttempted?'—':isCorrect?'✓':'✗'}
                            </div>
                            <div className="flex-1">
                              <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md mr-2"
                                style={{background:notAttempted?'rgba(0,0,0,0.03)':isCorrect?'#ECFDF5':'#FEF2F2',color:notAttempted?'rgba(0,0,0,0.2)':isCorrect?'#059669':'#DC2626'}}>
                                Q{i+1} • {notAttempted?'Skipped':isCorrect?'Correct':'Wrong'}
                              </span>
                              <p className="text-sm font-bold text-[#111] leading-relaxed mt-2">{q.q}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 ml-11">
                            {q.options.map((opt,oi)=>{
                              const isUserPick = userAns===oi; const isRight = q.answer===oi;
                              let bg='rgba(0,0,0,0.015)',border='rgba(0,0,0,0.04)',clr='rgba(0,0,0,0.35)';
                              if(isRight){bg='#ECFDF5';border='#10B98130';clr='#059669';}
                              if(isUserPick&&!isRight){bg='#FEF2F2';border='#EF444430';clr='#DC2626';}
                              return <div key={oi} className="px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2" style={{background:bg,borderColor:border,color:clr}}>
                                <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{background:isRight?'#10B98115':isUserPick&&!isRight?'#EF444415':'rgba(0,0,0,0.04)'}}>{String.fromCharCode(65+oi)}</span>
                                <span className="flex-1">{opt}</span>
                                {isRight&&<CheckCircle2 className="w-3.5 h-3.5 ml-auto flex-shrink-0"/>}
                                {isUserPick&&!isRight&&<XCircle className="w-3.5 h-3.5 ml-auto flex-shrink-0"/>}
                              </div>;
                            })}
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* ═══ END TEST CONFIRM MODAL ═══ */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[99999] flex items-center justify-center" onClick={()=>setShowEndConfirm(false)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"/>
            <motion.div initial={{scale:0.9,y:20}} animate={{scale:1,y:0}} exit={{scale:0.95}} onClick={e=>e.stopPropagation()} className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-black/5 text-center">
              <div className="w-14 h-14 mx-auto rounded-xl bg-red-50 flex items-center justify-center mb-4"><AlertTriangle className="w-7 h-7 text-red-500"/></div>
              <h3 className="text-lg font-extrabold text-[#111] mb-2">End Test?</h3>
              <p className="text-xs text-black/30 mb-1 font-medium">You've answered {attempted} of {TOTAL_QUESTIONS} questions.</p>
              <p className="text-xs text-black/30 mb-6 font-medium">Unanswered questions will be marked wrong.</p>
              <div className="flex gap-3">
                <button onClick={()=>setShowEndConfirm(false)} className="flex-1 py-3 rounded-xl border border-black/8 text-xs font-extrabold uppercase text-black/30 hover:text-black transition-all">Continue Test</button>
                <button onClick={()=>{setShowEndConfirm(false);handleSubmit();}} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs font-extrabold uppercase shadow-lg hover:bg-red-600 transition-all">End Now</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
