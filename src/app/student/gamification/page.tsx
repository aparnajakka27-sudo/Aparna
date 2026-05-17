"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Flame, Star, Target, Medal, Crown, ArrowLeft, Sparkles, Gift, Shield, CheckCircle2, Lock, Heart } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const fadeUp = (d=0) => ({ initial:{opacity:0,y:25}, animate:{opacity:1,y:0}, transition:{duration:0.6,delay:d,ease:[0.16,1,0.3,1] as const} });

const DAILY_CHALLENGES = [
  { id:1, title:'Complete 1 coding session', xp:50, hp:10, icon:'💻', done:false },
  { id:2, title:'Switch roles at least twice', xp:30, hp:5, icon:'🔄', done:false },
  { id:3, title:'Use AI chat 3 times', xp:20, hp:5, icon:'🤖', done:false },
  { id:4, title:'Pass all test cases in Q1', xp:75, hp:15, icon:'✅', done:false },
];

const BADGES = [
  { name:'First Blood', emoji:'🎯', desc:'Complete your first session', tier:'bronze', locked:true },
  { name:'Hot Streak', emoji:'🔥', desc:'3 day coding streak', tier:'silver', locked:true },
  { name:'Code Machine', emoji:'⚙️', desc:'Complete 5 sessions', tier:'silver', locked:true },
  { name:'HP Collector', emoji:'💎', desc:'Earn 100 HP total', tier:'gold', locked:true },
  { name:'Team Spirit', emoji:'🤝', desc:'Match with 3 partners', tier:'bronze', locked:true },
  { name:'Speed Demon', emoji:'⚡', desc:'Finish session in under 15 min', tier:'gold', locked:true },
  { name:'Perfect Score', emoji:'🏆', desc:'Pass all tests in a session', tier:'platinum', locked:true },
  { name:'Navigator Pro', emoji:'🧭', desc:'Spend 10 min as navigator', tier:'silver', locked:true },
];

const TIER_COLORS: Record<string,string> = { bronze:'#CD7F32', silver:'#C0C0C0', gold:'#FFD700', platinum:'#E5E4E2' };

const LEVELS = [
  { level:1, name:'Rookie', minXP:0, color:'#94A3B8' },
  { level:2, name:'Apprentice', minXP:200, color:'#22C55E' },
  { level:3, name:'Developer', minXP:500, color:'#3B82F6' },
  { level:4, name:'Expert', minXP:1000, color:'#A855F7' },
  { level:5, name:'Master', minXP:2000, color:'#F59E0B' },
  { level:6, name:'Legend', minXP:5000, color:'#FF4D6D' },
];

export default function GamificationPage() {
  const [hp, setHp] = useState(0);
  const [xp, setXp] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [matches, setMatches] = useState(0);
  const [badges, setBadges] = useState(BADGES);
  const [dailies, setDailies] = useState(DAILY_CHALLENGES);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('dateforcode_progress')||'{}');
      const h = p.hp||0, s = p.sessions||0, st = p.streak||0, m = p.matches||0;
      const x = s * 50 + h * 2;
      setHp(h); setXp(x); setSessions(s); setStreak(st); setMatches(m);
      // Unlock badges based on progress
      const updated = BADGES.map(b => {
        let unlocked = false;
        if (b.name==='First Blood' && s >= 1) unlocked = true;
        if (b.name==='Hot Streak' && st >= 3) unlocked = true;
        if (b.name==='Code Machine' && s >= 5) unlocked = true;
        if (b.name==='HP Collector' && h >= 100) unlocked = true;
        if (b.name==='Team Spirit' && m >= 3) unlocked = true;
        return {...b, locked: !unlocked};
      });
      setBadges(updated);
      // Update dailies
      const ud = DAILY_CHALLENGES.map(d => {
        if (d.id === 1 && s >= 1) return {...d, done: true};
        return d;
      });
      setDailies(ud);
    } catch(_) {}
  }, []);

  const currentLevel = [...LEVELS].reverse().find(l => xp >= l.minXP) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.minXP > xp);
  const levelProgress = nextLevel ? Math.min(100, ((xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100) : 100;
  const unlockedCount = badges.filter(b => !b.locked).length;

  return (
    <div className="min-h-screen bg-[#F8F9FC] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.015) 1px, transparent 0)',backgroundSize:'32px 32px'}} />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-[#FF4D6D]/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* Top Bar */}
      <motion.header {...fadeUp(0)} className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-black/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/student/dashboard" className="flex items-center gap-2 text-black/30 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4"/><span className="text-xs font-bold">Dashboard</span>
          </Link>
          <div className="w-px h-5 bg-black/8"/>
          <Link href="/" className="flex items-center gap-2">
            <Logo showText={false} className="scale-[0.5]"/>
            <span className="text-sm font-serif font-bold text-[#222]">Date<span className="text-[#FF4D6D]">for</span>Code</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white border border-black/5 shadow-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500"/><span className="text-sm font-extrabold">{xp.toLocaleString()} XP</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white border border-black/5 shadow-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FF4D6D]"/><span className="text-sm font-extrabold">{hp} HP</span>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-10">
        {/* Level Card */}
        <motion.div {...fadeUp(0.1)} className="bg-white rounded-2xl border border-black/5 shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg" style={{background:`linear-gradient(135deg,${currentLevel.color},${currentLevel.color}CC)`,color:'white',boxShadow:`0 8px 25px ${currentLevel.color}25`}}>
                <Crown className="w-8 h-8"/>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-black/20">Current Level</p>
                <h2 className="text-2xl font-black text-[#111]">Level {currentLevel.level} — {currentLevel.name}</h2>
              </div>
            </div>
            {nextLevel && (
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-widest text-black/20">Next Level</p>
                <p className="text-sm font-bold" style={{color:nextLevel.color}}>Level {nextLevel.level} — {nextLevel.name}</p>
                <p className="text-[10px] text-black/25">{nextLevel.minXP - xp} XP to go</p>
              </div>
            )}
          </div>
          <div className="h-3 rounded-full bg-black/[0.04] overflow-hidden">
            <motion.div initial={{width:0}} animate={{width:`${levelProgress}%`}} transition={{duration:1.2,ease:[0.16,1,0.3,1]}}
              className="h-full rounded-full" style={{background:`linear-gradient(90deg,${currentLevel.color},${currentLevel.color}AA)`}}/>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[9px] font-bold text-black/20">{xp} XP</span>
            <span className="text-[9px] font-bold text-black/20">{nextLevel?.minXP || 'MAX'} XP</span>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div {...fadeUp(0.2)} className="grid grid-cols-4 gap-4 mb-8">
          {[{icon:Zap,val:`${hp} HP`,label:'Honor Points',c:'#FF4D6D'},{icon:Flame,val:`${streak} days`,label:'Streak',c:'#F97316'},{icon:Heart,val:matches,label:'Matches',c:'#EC4899'},{icon:Target,val:sessions,label:'Sessions',c:'#4D79FF'}].map((s,i)=>(
            <motion.div key={s.label} {...fadeUp(0.25+i*0.05)} className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${s.c}10`}}>
                  <s.icon className="w-5 h-5" style={{color:s.c}}/>
                </div>
                <div>
                  <p className="text-xl font-black text-[#222]">{s.val}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-black/25">{s.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Daily Challenges */}
          <motion.div {...fadeUp(0.3)} className="lg:col-span-3 bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-5 rounded-full bg-[#F59E0B]"/>
              <h3 className="font-bold text-sm">Daily Challenges</h3>
              <span className="text-[9px] font-bold text-black/15 ml-auto">{dailies.filter(d=>d.done).length}/{dailies.length} completed</span>
            </div>
            <p className="text-[10px] text-black/25 ml-3 mb-4">Reset every 24 hours</p>
            <div className="space-y-3">
              {dailies.map((d,i) => (
                <motion.div key={d.id} {...fadeUp(0.35+i*0.05)} className={`flex items-center gap-4 p-4 rounded-xl border ${d.done?'bg-green-50 border-green-200':'bg-black/[0.01] border-black/5'}`}>
                  <span className="text-xl">{d.icon}</span>
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${d.done?'text-green-600 line-through':'text-[#222]'}`}>{d.title}</p>
                    <p className="text-[9px] text-black/20">{d.xp} XP + {d.hp} HP</p>
                  </div>
                  {d.done ? <CheckCircle2 className="w-5 h-5 text-green-500"/> : <div className="w-5 h-5 rounded-full border-2 border-black/10"/>}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Streak Calendar Mini */}
          <motion.div {...fadeUp(0.4)} className="lg:col-span-2 bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-5 rounded-full bg-[#F97316]"/>
              <h3 className="font-bold text-sm">Streak Calendar</h3>
            </div>
            <p className="text-[10px] text-black/25 ml-3 mb-4">Keep your streak alive!</p>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {Array.from({length:28}).map((_,i) => {
                const isStreak = i >= (28 - streak) && i < 28;
                const isToday = i === 27;
                return (
                  <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-[8px] font-bold ${isToday?'ring-2 ring-[#F97316] ring-offset-1':''} ${isStreak?'bg-orange-100 text-orange-500':'bg-black/[0.02] text-black/10'}`}>
                    {i+1}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-orange-50 border border-orange-200">
              <Flame className="w-5 h-5 text-orange-500"/>
              <span className="text-sm font-extrabold text-orange-600">{streak} Day Streak!</span>
            </div>
          </motion.div>
        </div>

        {/* Badges */}
        <motion.div {...fadeUp(0.5)} className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 rounded-full bg-[#8B5CF6]"/>
            <h3 className="font-bold text-sm">Badges & Achievements</h3>
            <span className="text-[9px] font-bold text-black/15 ml-auto">{unlockedCount} / {badges.length} earned</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((b,i) => (
              <motion.div key={b.name} {...fadeUp(0.55+i*0.04)}
                className={`p-5 rounded-2xl border-2 text-center transition-all ${b.locked?'border-black/5 opacity-35 grayscale':'shadow-sm'}`}
                style={b.locked?{}:{borderColor:`${TIER_COLORS[b.tier]}40`,background:`${TIER_COLORS[b.tier]}05`}}>
                <span className="text-3xl block mb-2">{b.emoji}</span>
                <p className="text-xs font-bold text-[#222] mb-1">{b.name}</p>
                <p className="text-[9px] text-black/25 mb-2">{b.desc}</p>
                {!b.locked ? (
                  <span className="text-[8px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-md" style={{background:`${TIER_COLORS[b.tier]}15`,color:TIER_COLORS[b.tier]}}>{b.tier}</span>
                ) : (
                  <Lock className="w-3 h-3 text-black/15 mx-auto"/>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
