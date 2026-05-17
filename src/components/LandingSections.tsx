"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Cpu, Terminal, Shield, Users, GraduationCap, Zap, Target, Heart, Code, Gamepad2, Swords, Star, Award, TrendingUp } from 'lucide-react';
import Logo from './Logo';

const fadeUp = (d=0) => ({ initial:{opacity:0,y:50,filter:'blur(6px)'}, whileInView:{opacity:1,y:0,filter:'blur(0px)'}, viewport:{once:false,margin:"-80px"}, transition:{duration:0.9,delay:d,ease:[0.16,1,0.3,1] as const} });

function Counter({value,suffix=""}:{value:number,suffix?:string}) {
  const [count,setCount]=useState(0); const ref=useRef<HTMLSpanElement>(null); const inView=useInView(ref,{once:true});
  useEffect(()=>{if(!inView)return;let s=0;const t=setInterval(()=>{s+=1;setCount(s);if(s>=value)clearInterval(t);},40);return()=>clearInterval(t);},[inView,value]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function FloatingSymbols() {
  const syms = ['{','</>','()','#','λ','∞','⟨⟩','[]'];
  return <div className="absolute inset-0 overflow-hidden pointer-events-none">{syms.map((s,i)=>(
    <div key={i} className="absolute text-black/[0.04] font-mono font-bold select-none" style={{
      fontSize:`${20+i*8}px`, left:`${10+i*11}%`, top:`${5+((i*37)%80)}%`,
      animation:`floatSlow ${8+i*2}s ease-in-out infinite ${i*0.7}s`
    }}>{s}</div>
  ))}</div>;
}

export function WhatWeDoSection() {
  return (
    <section id="features" className="relative z-10 bg-white py-32 px-8 border-t border-black/5 overflow-hidden scroll-mt-20">
      <FloatingSymbols />
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#FF4D6D]/5 rounded-full blur-[80px]" style={{animation:'floatSlow 8s ease-in-out infinite'}} />
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-[#4D79FF]/5 rounded-full blur-[80px]" style={{animation:'floatSlow 10s ease-in-out infinite 2s'}} />
      <div className="max-w-6xl mx-auto relative">
        <motion.p {...fadeUp()} className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#FF4D6D] text-center mb-6">What We Do</motion.p>
        <motion.h2 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-serif font-bold text-center mb-8 tracking-tight shimmer-text">The Platform That Pairs You<br/>With Your Perfect Coding Partner</motion.h2>
        <motion.p {...fadeUp(0.2)} className="text-center text-black/40 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-20">
          DateForCode is an AI-powered platform that matches students with compatible coding partners based on skill level, tech stack, and collaboration style.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {icon:Cpu,title:"Smart Matching",desc:"Our AI analyzes your skills and coding style to find the most compatible partner.",color:"#FF4D6D",bg:"from-[#FF4D6D] to-[#FF8FA3]"},
            {icon:Terminal,title:"Live Coding Rooms",desc:"Real-time collaborative environments. Write, debug, and ship code together.",color:"#4D79FF",bg:"from-[#4D79FF] to-[#06B6D4]"},
            {icon:Shield,title:"Mentor Oversight",desc:"Mentors monitor sessions and ensure every pairing leads to real growth.",color:"#A855F7",bg:"from-[#A855F7] to-[#EC4899]"}
          ].map((f,i)=>(
            <motion.div key={i} {...fadeUp(i*0.15)} className="group text-center p-10 rounded-3xl bg-white border border-black/5 relative overflow-hidden cursor-default" style={{transition:'all 0.5s cubic-bezier(0.16,1,0.3,1)'}} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-12px) scale(1.02)';e.currentTarget.style.boxShadow='0 30px 60px -12px rgba(0,0,0,0.12)';}} onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{background:`radial-gradient(circle at 50% 0%, ${f.color}08 0%, transparent 70%)`}} />
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.bg} flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`} style={{boxShadow:`0 8px 30px ${f.color}30`}}>
                <f.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4 relative">{f.title}</h3>
              <p className="text-black/40 text-sm leading-relaxed">{f.desc}</p>
              <div className="mt-6 w-8 h-[2px] mx-auto rounded-full transition-all duration-500 group-hover:w-16" style={{background:f.color}} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PortalsSection() {
  return (
    <section id="portals" className="relative z-10 py-32 px-8 overflow-hidden scroll-mt-20" style={{background:'linear-gradient(180deg,#FAFAFA 0%,#F0F0F5 100%)'}}>
      <div className="absolute inset-0 noise-bg" />
      <div className="max-w-6xl mx-auto relative">
        <motion.p {...fadeUp()} className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#FF4D6D] text-center mb-6">Two Sides, One Mission</motion.p>
        <motion.h2 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-serif font-bold text-center mb-6 tracking-tight">Student & Mentor Portals</motion.h2>
        <motion.p {...fadeUp(0.15)} className="text-center text-black/30 text-sm max-w-xl mx-auto mb-20">Choose your path. Both lead to growth.</motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[{
            icon:GraduationCap, title:"Student Portal", gradient:"from-[#FF4D6D] to-[#FF6B8A]", shadow:"#FF4D6D",
            desc:"Your launchpad for growth. Get matched, enter coding rooms, compete in battles, earn HP, and climb the leaderboard.",
            items:['AI-powered partner matching','Real-time collaborative coding','Skill assessments & battles','HP score tracking & rewards'],
            ItemIcon:Zap, accentBg:"#FF4D6D"
          },{
            icon:Users, title:"Mentor Portal", gradient:"from-[#1a1a2e] to-[#333]", shadow:"#000",
            desc:"Guide the next generation. Monitor sessions, review code quality, provide feedback, and shape future developers.",
            items:['Live session monitoring dashboard','Code review & feedback tools','Student progress analytics','Structured mentorship protocols'],
            ItemIcon:Target, accentBg:"#333"
          }].map((p,idx)=>(
            <motion.div key={idx} {...fadeUp(idx*0.2)} className="group bg-white rounded-3xl p-10 md:p-12 border border-black/5 relative overflow-hidden" style={{transition:'all 0.6s cubic-bezier(0.16,1,0.3,1)'}} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-8px)';e.currentTarget.style.boxShadow=`0 30px 60px -15px ${p.shadow}20`;}} onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{background:`${p.accentBg}10`}} />
              <div className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-all duration-500" style={{background:`linear-gradient(90deg,transparent,${p.accentBg},transparent)`}} />
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <p.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-serif font-bold mb-4">{p.title}</h3>
              <p className="text-black/40 text-sm leading-relaxed mb-8">{p.desc}</p>
              <ul className="space-y-3">
                {p.items.map((item,i)=>(
                  <motion.li key={i} {...fadeUp(0.3+i*0.1)} className="flex items-center gap-3 text-sm text-black/50 group/li">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300" style={{background:`${p.accentBg}10`}}>
                      <p.ItemIcon className="w-3 h-3" style={{color:p.accentBg}} />
                    </div>
                    <span className="group-hover/li:translate-x-1 transition-transform duration-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LeaderboardSection() {
  return (
    <section id="leaderboard" className="relative z-10 bg-white py-32 px-8 border-t border-black/5 overflow-hidden scroll-mt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[200px]" style={{background:'radial-gradient(circle,rgba(255,77,109,0.06) 0%,transparent 70%)'}} />
      <FloatingSymbols />
      <div className="max-w-6xl mx-auto relative">
        <motion.div {...fadeUp()} className="flex items-center justify-center gap-3 mb-6">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#FF4D6D]/30" />
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#FF4D6D]">Compete & Rise</p>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#FF4D6D]/30" />
        </motion.div>
        <motion.h2 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-serif font-bold text-center mb-8 tracking-tight">The Global Leaderboard</motion.h2>
        <motion.p {...fadeUp(0.15)} className="text-center text-black/40 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-16">
          Every action earns HP (Honor Points). The highest HP rises to the top. Compete, grow, and get recognized.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {icon:Code,label:"Coding Matches",sub:"Participate & Earn",gradient:"from-[#FF4D6D] to-[#FF8FA3]"},
            {icon:Gamepad2,label:"Games & Battles",sub:"Compete & Win",gradient:"from-[#4D79FF] to-[#06B6D4]"},
            {icon:Swords,label:"Pair Sessions",sub:"Collaborate & Grow",gradient:"from-[#A855F7] to-[#EC4899]"}
          ].map((c,i)=>(
            <motion.div key={i} {...fadeUp(i*0.15)} className="group rounded-3xl p-8 text-center bg-white border border-black/5 relative overflow-hidden" style={{transition:'all 0.5s cubic-bezier(0.16,1,0.3,1)'}} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-10px) scale(1.03)';e.currentTarget.style.boxShadow='0 30px 60px -12px rgba(0,0,0,0.12)';}} onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-b from-[#FF4D6D]/[0.04] to-transparent pointer-events-none" />
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}>
                <c.icon className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-serif font-bold mb-1">{c.label}</h4>
              <p className="text-black/30 text-xs uppercase tracking-wider mb-5">{c.sub}</p>
              <div className="text-5xl font-black font-serif text-[#FF4D6D]" style={{animation:'countPulse 3s ease-in-out infinite'}}>
                +<Counter value={5} /> HP
              </div>
              <p className="text-black/25 text-xs mt-2 font-medium">per participation</p>
              <div className="mt-6 flex justify-center gap-1">
                {[...Array(5)].map((_,j)=><div key={j} className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] opacity-20 group-hover:opacity-60 transition-opacity duration-500" style={{transitionDelay:`${j*100}ms`}} />)}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(0.3)} className="relative rounded-3xl p-10 md:p-14 text-white overflow-hidden" style={{background:'linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 50%,#0a0a1a 100%)'}}>
          <div className="absolute top-0 right-0 w-60 h-60 bg-[#FF4D6D]/10 rounded-full blur-[80px]" style={{animation:'floatSlow 6s ease-in-out infinite'}} />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#4D79FF]/10 rounded-full blur-[60px]" style={{animation:'floatSlow 8s ease-in-out infinite 3s'}} />
          <div className="absolute inset-0 noise-bg" />
          <div className="flex flex-col md:flex-row items-center gap-8 relative">
            <div className="w-20 h-20 rounded-full bg-[#FF4D6D]/20 flex items-center justify-center flex-shrink-0 relative">
              <TrendingUp className="w-10 h-10 text-[#FF4D6D]" />
              <div className="absolute inset-0 rounded-full border-2 border-[#FF4D6D]/20" style={{animation:'pulseGlow 3s ease infinite'}} />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold mb-3">How HP Works</h3>
              <p className="text-white/50 text-sm leading-relaxed">Earn <span className="text-[#FF4D6D] font-bold text-lg">5 HP</span> just for participating. Extra HP from performance — winning, clean code, helping teammates. The more you engage, the higher you climb.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function WhySection() {
  return (
    <section id="why" className="relative z-10 py-32 px-8 overflow-hidden scroll-mt-20" style={{background:'linear-gradient(180deg,#FAFAFA 0%,#F5F0FF 50%,#FAFAFA 100%)'}}>
      <div className="absolute inset-0 noise-bg" />
      <div className="max-w-6xl mx-auto relative">
        <motion.p {...fadeUp()} className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#FF4D6D] text-center mb-6">Why DateForCode?</motion.p>
        <motion.h2 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-serif font-bold text-center mb-20 tracking-tight">What Makes Us <span className="text-[#FF4D6D]">Different</span></motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {icon:Heart,title:"No More Solo Coding",desc:"Get paired with someone who complements your skills and pushes you to grow.",gradient:"from-[#FF4D6D] to-[#FF8FA3]",glow:"#FF4D6D"},
            {icon:Star,title:"Gamified Learning",desc:"Earn HP, unlock achievements, climb leaderboards. Learning has never been this fun.",gradient:"from-[#FFD700] to-[#FFA500]",glow:"#FFD700"},
            {icon:Award,title:"Real Mentorship",desc:"Guided by mentors who ensure you're learning, not just copying code.",gradient:"from-[#4D79FF] to-[#06B6D4]",glow:"#4D79FF"},
            {icon:Zap,title:"Built for Action",desc:"Real coding rooms, real problems, real projects with a real partner.",gradient:"from-[#A855F7] to-[#EC4899]",glow:"#A855F7"}
          ].map((item,i)=>(
            <motion.div key={i} {...fadeUp(i*0.12)} className="group flex gap-6 p-8 bg-white rounded-3xl border border-black/5 relative overflow-hidden" style={{transition:'all 0.5s cubic-bezier(0.16,1,0.3,1)'}} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px) scale(1.01)';e.currentTarget.style.boxShadow=`0 25px 50px -12px ${item.glow}15`;}} onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{background:`${item.glow}08`}} />
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`} style={{boxShadow:`0 8px 25px ${item.glow}25`}}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold mb-2">{item.title}</h3>
                <p className="text-black/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TeamSection() {
  return (
    <section id="team" className="relative z-10 bg-white py-32 px-8 border-t border-black/5 overflow-hidden scroll-mt-20">
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-[#FF4D6D]/5 rounded-full blur-[100px]" style={{animation:'floatSlow 12s ease-in-out infinite'}} />
      <div className="absolute bottom-10 right-1/4 w-60 h-60 bg-[#4D79FF]/5 rounded-full blur-[80px]" style={{animation:'floatSlow 10s ease-in-out infinite 4s'}} />
      <div className="max-w-5xl mx-auto text-center relative">
        <motion.p {...fadeUp()} className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#FF4D6D] mb-6">The Team</motion.p>
        <motion.h2 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-serif font-bold mb-8 tracking-tight">Who Built This</motion.h2>
        <motion.p {...fadeUp(0.15)} className="text-black/40 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-20">
          Built by two passionate developers who believe coding is better together.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {img:"/founder1.jpg",name:"Aparna",role:"Co-Founder & Developer",color:"#FF4D6D",bio:"Passionate about building tools that bring developers together. Loves React, design systems, and late-night coding sessions."},
            {img:"/founder2.jpg",name:"Aishwarya",role:"Co-Founder & Developer",color:"#4D79FF",bio:"Full-stack engineer with a vision to make pair programming accessible to every student worldwide."}
          ].map((f,i)=>(
            <motion.div key={i} {...fadeUp(i*0.2)} className="group bg-white rounded-3xl border border-black/5 overflow-hidden relative" style={{transition:'all 0.6s cubic-bezier(0.16,1,0.3,1)'}} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-8px)';e.currentTarget.style.boxShadow=`0 30px 60px -15px ${f.color}20`;}} onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
              <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-all duration-500" style={{background:`linear-gradient(90deg,transparent,${f.color},transparent)`}} />
              <div className="h-96 overflow-hidden relative">
                <img src={f.img} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{objectPosition:'center 25%'}} />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>
              <div className="p-8 pt-4">
                <h3 className="text-2xl font-serif font-bold mb-1">{f.name}</h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{color:f.color}}>{f.role}</p>
                <p className="text-black/40 text-sm leading-relaxed">{f.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FooterSection() {
  return (
    <footer className="relative z-10 overflow-hidden text-white py-20 px-8" style={{background:'linear-gradient(180deg,#0a0a0a 0%,#000 100%)'}}>
      <div className="absolute inset-0 noise-bg" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#FF4D6D]/30 to-transparent" />
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8 relative">
        <div className="flex items-center gap-3"><Logo showText={false} className="scale-[0.7] brightness-0 invert" /><span className="text-xl font-serif font-bold tracking-tight">DateForCode</span></div>
        <p className="text-white/20 text-xs font-bold uppercase tracking-[0.4em] text-center">Because every great project needs a great partner.</p>
        <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <p className="text-white/10 text-xs">© 2026 DateForCode. All rights reserved.</p>
      </div>
    </footer>
  );
}
