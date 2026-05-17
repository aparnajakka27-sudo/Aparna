"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Zap, ChevronRight, Star, Clock, Trophy, Target, Code2, Flame } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

const fadeUp = (d=0) => ({ initial:{opacity:0,y:25}, animate:{opacity:1,y:0}, transition:{duration:0.6,delay:d,ease:[0.16,1,0.3,1] as const} });

const SKILLS = [
  { id:'javascript', name:'JavaScript', icon:'⚡', color:'#D97706', desc:'Master the language of the web', questions:25, time:'20 min' },
  { id:'python', name:'Python', icon:'🐍', color:'#3776AB', desc:'Data science, AI & automation', questions:25, time:'20 min' },
  { id:'typescript', name:'TypeScript', icon:'🔷', color:'#3178C6', desc:'Type-safe JavaScript at scale', questions:20, time:'18 min' },
  { id:'react', name:'React', icon:'⚛️', color:'#61DAFB', desc:'Build dynamic user interfaces', questions:25, time:'22 min' },
  { id:'nextjs', name:'Next.js', icon:'▲', color:'#555', desc:'Full-stack React framework', questions:20, time:'18 min' },
  { id:'nodejs', name:'Node.js', icon:'🟢', color:'#339933', desc:'Server-side JavaScript runtime', questions:25, time:'20 min' },
  { id:'java', name:'Java', icon:'☕', color:'#ED8B00', desc:'Enterprise & Android development', questions:30, time:'25 min' },
  { id:'cpp', name:'C++', icon:'⚙️', color:'#00599C', desc:'Systems programming & performance', questions:25, time:'22 min' },
  { id:'html-css', name:'HTML & CSS', icon:'🎨', color:'#E34F26', desc:'Structure & style the web', questions:20, time:'15 min' },
  { id:'sql', name:'SQL', icon:'🗄️', color:'#4479A1', desc:'Query & manage databases', questions:20, time:'18 min' },
  { id:'git', name:'Git & GitHub', icon:'🔀', color:'#F05032', desc:'Version control & collaboration', questions:15, time:'12 min' },
  { id:'rust', name:'Rust', icon:'🦀', color:'#CE422B', desc:'Safe & blazing fast systems code', questions:20, time:'20 min' },
  { id:'go', name:'Go', icon:'🐹', color:'#00ADD8', desc:'Simple, reliable, efficient', questions:20, time:'18 min' },
  { id:'docker', name:'Docker', icon:'🐳', color:'#2496ED', desc:'Containerize your applications', questions:15, time:'15 min' },
  { id:'aws', name:'AWS Cloud', icon:'☁️', color:'#FF9900', desc:'Cloud services & deployment', questions:25, time:'22 min' },
  { id:'flutter', name:'Flutter', icon:'💙', color:'#02569B', desc:'Cross-platform mobile apps', questions:20, time:'18 min' },
];

const FLOATING_CODE = ['{ }','< />','( )','[ ]','=>','&&','||','++','#','@','$','!','**','//','::','let','fn','int','var','if'];

export default function SkillAssessment() {
  const router = useRouter();
  const [hoveredSkill, setHoveredSkill] = useState<string|null>(null);
  const [selectedSkill, setSelectedSkill] = useState<typeof SKILLS[0]|null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = SKILLS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchFilter.toLowerCase());
    if (category === 'all') return matchSearch;
    if (category === 'web') return matchSearch && ['javascript','typescript','react','nextjs','html-css','nodejs'].includes(s.id);
    if (category === 'systems') return matchSearch && ['cpp','rust','go','java'].includes(s.id);
    if (category === 'devops') return matchSearch && ['docker','aws','git','sql'].includes(s.id);
    if (category === 'mobile') return matchSearch && ['flutter','react'].includes(s.id);
    return matchSearch;
  });

  return (
    <main className="relative min-h-screen bg-[#FAFAFA]">
      {/* ══ Animated Background ══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0)',backgroundSize:'32px 32px'}} />
        {/* Color blobs */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#FF4D6D]/[0.04] blur-[100px]" style={{animation:'floatBlob1 16s ease-in-out infinite'}} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#4D79FF]/[0.04] blur-[100px]" style={{animation:'floatBlob2 14s ease-in-out infinite 2s'}} />
        <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] rounded-full bg-[#8B5CF6]/[0.03] blur-[120px]" style={{animation:'floatBlob1 18s ease-in-out infinite 5s'}} />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-[#10B981]/[0.03] blur-[100px]" style={{animation:'floatBlob2 12s ease-in-out infinite 3s'}} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-[#F97316]/[0.025] blur-[80px]" style={{animation:'floatBlob1 20s ease-in-out infinite 8s'}} />
        {/* Spinning rings */}
        <div className="absolute top-[20%] left-[15%] w-48 h-48 rounded-full border border-[#FF4D6D]/[0.04]" style={{animation:'spin 50s linear infinite'}} />
        <div className="absolute bottom-[25%] right-[10%] w-64 h-64 rounded-full border border-[#4D79FF]/[0.04] border-dashed" style={{animation:'spin 70s linear infinite reverse'}} />
        <div className="absolute top-[60%] left-[60%] w-36 h-36 rounded-full border border-[#8B5CF6]/[0.04]" style={{animation:'spin 40s linear infinite'}} />
        {/* Floating code symbols */}
        {FLOATING_CODE.map((sym,i)=>(
          <div key={i} className="absolute font-mono select-none" 
            style={{left:`${3+((i*53)%92)}%`,top:`${2+((i*37)%90)}%`,fontSize:`${10+((i*5)%14)}px`,color:`rgba(0,0,0,${0.02+((i*3)%5)*0.005})`,animation:`floatCode ${6+i*1.5}s ease-in-out infinite ${i*0.7}s`}}>
            {sym}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-20 py-5 px-8 flex items-center justify-between border-b border-black/5 bg-white/60 backdrop-blur-xl">
        <button onClick={()=>router.push('/student/dashboard')} className="flex items-center gap-2 text-black/30 text-xs font-bold uppercase tracking-wider hover:text-black transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />Back
        </button>
        <Logo showText={true} className="scale-[0.8] origin-left" />
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        {/* Hero */}
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:0.1,type:'spring',stiffness:200}}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF4D6D]/8 to-[#4D79FF]/8 border border-[#FF4D6D]/15 text-[10px] font-bold uppercase tracking-wider text-[#FF4D6D] mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />Skill Assessment Arena<Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight text-[#111]">
            Choose Your <span className="bg-gradient-to-r from-[#FF4D6D] via-[#FF8FA3] to-[#4D79FF] bg-clip-text text-transparent">Battleground</span>
          </h1>
          <p className="text-black/30 text-sm max-w-md mx-auto leading-relaxed">
            Select a skill to assess your expertise. Complete the challenge to unlock your coding level and get matched with the right partner.
          </p>
        </motion.div>

        {/* Category filter pills */}
        <motion.div {...fadeUp(0.1)} className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {[{id:'all',label:'All Skills',emoji:'🌟'},{id:'web',label:'Web Dev',emoji:'🌐'},{id:'systems',label:'Systems',emoji:'⚙️'},{id:'devops',label:'DevOps',emoji:'🚀'},{id:'mobile',label:'Mobile',emoji:'📱'}].map(cat=>(
            <motion.button key={cat.id} whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={()=>setCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border backdrop-blur-sm ${category===cat.id?'bg-[#FF4D6D]/10 border-[#FF4D6D]/25 text-[#FF4D6D] shadow-md shadow-[#FF4D6D]/10':'bg-white/60 border-black/5 text-black/25 hover:text-black/50 hover:border-black/10 hover:shadow-sm'}`}>
              <span className="mr-1.5">{cat.emoji}</span>{cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div {...fadeUp(0.15)} className="max-w-md mx-auto mb-10">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF4D6D]/20 via-[#4D79FF]/20 to-[#8B5CF6]/20 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-500" />
            <input value={searchFilter} onChange={e=>setSearchFilter(e.target.value)} placeholder="🔍  Search skills..." className="relative w-full px-5 py-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-black/8 text-sm text-[#222] placeholder:text-black/20 focus:outline-none focus:border-[#FF4D6D]/30 transition-all shadow-sm" />
          </div>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((skill,idx)=>(
            <motion.button key={skill.id}
              initial={{opacity:0,y:30,scale:0.95}} animate={{opacity:1,y:0,scale:1}} transition={{delay:0.05+idx*0.04,duration:0.5,ease:[0.16,1,0.3,1]}}
              onMouseEnter={()=>setHoveredSkill(skill.id)} onMouseLeave={()=>setHoveredSkill(null)}
              onClick={()=>setSelectedSkill(skill)}
              whileHover={{y:-6}} whileTap={{scale:0.97}}
              className="group relative text-left p-5 rounded-2xl bg-white/80 backdrop-blur-md overflow-hidden transition-all duration-500"
              style={{border:hoveredSkill===skill.id?`1.5px solid ${skill.color}40`:'1.5px solid rgba(0,0,0,0.05)',boxShadow:hoveredSkill===skill.id?`0 20px 40px -10px ${skill.color}15, 0 0 0 1px ${skill.color}10`:'0 1px 3px rgba(0,0,0,0.03)'}}>
              
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-500" style={{background:hoveredSkill===skill.id?`linear-gradient(90deg, transparent, ${skill.color}, transparent)`:'transparent'}} />
              
              {/* Card glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{background:`radial-gradient(ellipse at 50% 0%, ${skill.color}08, transparent 70%)`}} />
              
              {/* Corner sparkle */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Sparkles className="w-3 h-3" style={{color:`${skill.color}60`}} />
              </div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" 
                    style={{background:`${skill.color}10`,border:`1.5px solid ${skill.color}15`,boxShadow:hoveredSkill===skill.id?`0 6px 20px ${skill.color}15`:'none'}}>
                    {skill.icon}
                  </div>
                  <ChevronRight className="w-4 h-4 text-black/10 group-hover:translate-x-1 transition-all" style={{color:hoveredSkill===skill.id?`${skill.color}60`:'rgba(0,0,0,0.1)'}} />
                </div>
                <h3 className="text-sm font-bold mb-1 text-[#222] transition-colors">{skill.name}</h3>
                <p className="text-[11px] text-black/25 mb-4 leading-relaxed group-hover:text-black/35 transition-colors">{skill.desc}</p>
                <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-wider transition-colors" style={{color:hoveredSkill===skill.id?`${skill.color}80`:'rgba(0,0,0,0.12)'}}>
                  <span className="flex items-center gap-1"><Code2 className="w-3 h-3"/>10Q</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>15 min</span>
                  <span className="flex items-center gap-1"><Target className="w-3 h-3"/>7 to pass</span>
                </div>
                {/* Progress bar */}
                <div className="mt-4 h-1.5 rounded-full bg-black/[0.03] overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{background:`linear-gradient(90deg, ${skill.color}, ${skill.color}90)`}} initial={{width:0}} animate={{width:hoveredSkill===skill.id?'100%':'0%'}} transition={{duration:0.6}} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {filtered.length===0 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-20">
            <p className="text-black/25 text-sm">No skills match your search. Try another keyword.</p>
          </motion.div>
        )}
      </div>

      {/* ══ Skill Detail Modal ══ */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={()=>setSelectedSkill(null)}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <motion.div initial={{scale:0.85,opacity:0,y:40}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.95,opacity:0,y:20}} transition={{type:'spring',damping:22,stiffness:280}}
              onClick={e=>e.stopPropagation()}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
              style={{border:`1.5px solid ${selectedSkill.color}20`}}>
              
              {/* Top gradient accent */}
              <div className="h-1.5" style={{background:`linear-gradient(90deg, ${selectedSkill.color}, ${selectedSkill.color}60, ${selectedSkill.color})`}} />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[120px] rounded-full" style={{background:`radial-gradient(ellipse, ${selectedSkill.color}10, transparent 70%)`}} />
              
              <div className="relative p-8">
                <div className="flex items-center gap-5 mb-6">
                  <motion.div initial={{rotate:-10,scale:0.8}} animate={{rotate:0,scale:1}} transition={{type:'spring',stiffness:200}}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{background:`${selectedSkill.color}10`,border:`2px solid ${selectedSkill.color}25`,boxShadow:`0 8px 25px ${selectedSkill.color}15`}}>
                    {selectedSkill.icon}
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-[#111]">{selectedSkill.name}</h2>
                    <p className="text-xs text-black/30 mt-1">{selectedSkill.desc}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    {icon:Code2,val:'10',label:'Questions'},
                    {icon:Clock,val:'15 min',label:'Duration'},
                    {icon:Trophy,val:'+50',label:'HP Reward'},
                  ].map((s,i)=>(
                    <motion.div key={s.label} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.1+i*0.08}}
                      className="rounded-xl p-4 text-center border transition-all hover:shadow-sm" style={{background:`${selectedSkill.color}05`,borderColor:`${selectedSkill.color}12`}}>
                      <s.icon className="w-5 h-5 mx-auto mb-2" style={{color:`${selectedSkill.color}60`}} />
                      <p className="text-lg font-bold text-[#222]">{s.val}</p>
                      <p className="text-[9px] text-black/25 uppercase tracking-wider font-bold">{s.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Pass requirement badge */}
                <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.35}}
                  className="flex items-center justify-center gap-3 py-3 px-5 rounded-xl mb-6 border border-dashed" style={{borderColor:`${selectedSkill.color}25`,background:`${selectedSkill.color}04`}}>
                  <Target className="w-4 h-4" style={{color:selectedSkill.color}} />
                  <p className="text-xs font-bold" style={{color:selectedSkill.color}}>Score 7 out of 10 to pass & unlock Matching Room</p>
                </motion.div>

                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
                  className="rounded-2xl p-5 mb-6 border" style={{background:`${selectedSkill.color}03`,borderColor:`${selectedSkill.color}10`}}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-black/25 mb-3 flex items-center gap-2"><Target className="w-3.5 h-3.5"/>What to expect</p>
                  <ul className="space-y-2.5 text-xs text-black/40">
                    {['10 random MCQ questions from a pool of 50','You need 7 correct answers to pass','If you fail, you can reattempt unlimited times','Instant results with detailed score breakdown'].map((t,i)=>(
                      <li key={i} className="flex items-start gap-2"><Flame className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{color:selectedSkill.color}} />{t}</li>
                    ))}
                    <li className="flex items-start gap-2"><Star className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{color:selectedSkill.color}} />Pass to earn HP and enter the Matching Room</li>
                  </ul>
                </motion.div>

                <div className="flex items-center gap-3">
                  <button onClick={()=>setSelectedSkill(null)} className="flex-1 py-3.5 rounded-xl border border-black/8 text-xs font-bold uppercase tracking-wider text-black/30 hover:text-black hover:border-black/15 transition-all">Cancel</button>
                  <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                    onClick={()=>router.push(`/student/skill-assessment/${selectedSkill.id}`)}
                    className="flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2"
                    style={{background:`linear-gradient(135deg, ${selectedSkill.color}, ${selectedSkill.color}BB)`,boxShadow:`0 8px 30px ${selectedSkill.color}30`}}>
                    <Zap className="w-4 h-4" />Start Assessment
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes floatBlob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-40px) scale(1.05)} 66%{transform:translate(-20px,20px) scale(0.95)} }
        @keyframes floatBlob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-25px,35px) scale(1.08)} 66%{transform:translate(35px,-25px) scale(0.92)} }
        @keyframes floatCode { 0%,100%{transform:translateY(0) rotate(0deg)} 25%{transform:translateY(-12px) rotate(3deg)} 50%{transform:translateY(-5px) rotate(-2deg)} 75%{transform:translateY(-18px) rotate(1deg)} }
      `}</style>
    </main>
  );
}
