"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Play, LogOut } from 'lucide-react';
import Link from 'next/link';
import Logo from '../components/Logo';
import { WhatWeDoSection, PortalsSection, LeaderboardSection, WhySection, TeamSection, FooterSection } from '../components/LandingSections';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

// Small coding symbols
const CODE_SYMBOLS = [
  '{', '}', '<', '>', '/', ';', '(', ')', '[', ']',
  '#', '*', '=', '+', '&', '|', '!', '~', '%', '^',
  '//', '=>', '&&', '||', '!=', '==', '<<', '>>',
  '</', '/>', '{}', '()', '[]',
];

interface CodeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  symbol: string;
  fontSize: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
}

export default function LandingPage() {
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dashboardLink, setDashboardLink] = useState("/login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isStudent = localStorage.getItem('dateforcode_student_setup');
    const isMentor = localStorage.getItem('dateforcode_mentor_profile');
    
    if (isStudent || isMentor) {
      setIsLoggedIn(true);
      const link = isMentor ? "/mentor/dashboard" : "/student/dashboard";
      setDashboardLink(link);
      // Automatically redirect returning users
      window.location.href = link;
    }
  }, []);

  // Black code symbol particles
  useEffect(() => {
    if (!mounted) return;
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: CodeParticle[] = [];
    let lastX = 0, lastY = 0, animId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const spawn = (x: number, y: number) => {
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          symbol: CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)],
          fontSize: Math.random() * 10 + 8,
          life: 0,
          maxLife: Math.random() * 80 + 50,
          rotation: (Math.random() - 0.5) * 60,
          rotationSpeed: (Math.random() - 0.5) * 4,
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      // Only spawn particles on the hero/intro section (first viewport height)
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const mouseAbsoluteY = e.clientY + scrollTop;
      if (mouseAbsoluteY > window.innerHeight) return;

      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      if (Math.sqrt(dx * dx + dy * dy) > 6) {
        spawn(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let i = particles.length;
      while (i--) { if (particles[i].life >= particles[i].maxLife) particles.splice(i, 1); }

      for (const p of particles) {
        p.life++;
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.04; p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = '#000000';
        ctx.font = `bold ${p.fontSize}px 'Space Mono', 'Courier New', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();
      }
      animId = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    loop();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [mounted]);

  // Scroll-driven video popup animation
  useEffect(() => {
    if (!mounted) return;
    const section = videoSectionRef.current;
    const wrapper = videoWrapperRef.current;
    if (!section || !wrapper) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Progress: 0 when section top enters viewport bottom, 1 when section is centered
      const start = windowH;        // section top at viewport bottom
      const end = windowH * 0.3;    // section top near middle
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));

      // Scale: 0.65 → 1.0
      const scale = 0.65 + progress * 0.35;
      // Opacity: 0 → 1
      const opacity = progress;
      // Y offset: 80 → 0
      const translateY = (1 - progress) * 80;
      // Border radius: 40px → 16px
      const radius = 40 - progress * 24;

      wrapper.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      wrapper.style.opacity = `${opacity}`;
      wrapper.style.borderRadius = `${radius}px`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial call
    return () => window.removeEventListener('scroll', onScroll);
  }, [mounted]);

  const WordReveal = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => (
    <div className={`inline-flex flex-wrap justify-center gap-x-[0.35em] ${className}`}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen bg-[#FDFDFD] selection:bg-[#FF4D6D]/20 selection:text-[#FF4D6D]">
      {/* Code Particles Canvas */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9999 }}
      />

      {/* Global Navigation */}
      <nav className="fixed top-0 w-full z-50 py-5 px-8 md:px-12 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto flex items-center">
          <Logo showText={true} className="scale-[0.8] origin-left" />
        </div>
        <div className="pointer-events-auto hidden md:flex items-center gap-10">
          {[{label:'Features',href:'#features'},{label:'Use Cases',href:'#portals'},{label:'About',href:'#team'},{label:'Blog',href:'#leaderboard'}].map((item) => (
            <a key={item.label} href={item.href} className="text-[11px] font-bold uppercase tracking-[0.25em] text-black/40 hover:text-black transition-colors duration-300 relative group">
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#FF4D6D] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>
        <div className="pointer-events-auto flex items-center gap-4">
          {mounted && isLoggedIn ? (
            <button 
              onClick={async () => {
                await signOut(auth);
                localStorage.clear();
                window.location.reload();
              }}
              className="px-8 py-2.5 rounded-full bg-[#FF4D6D] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#FF4D6D]/90 transition-all duration-500 shadow-lg shadow-[#FF4D6D]/20 flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          ) : (
            <Link href="/login" className="px-8 py-2.5 rounded-full bg-black/5 backdrop-blur-md border border-black/10 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-500">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-20 px-6">
        <div className="text-center max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center mb-10"
          >
            <Logo showText={true} className="scale-100" />
          </motion.div>

          <div className="mb-14">
            <WordReveal
              text="Because Every Great Project Needs a Great Partner."
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-serif font-bold leading-[1.15] tracking-tight text-black"
              delay={0.6}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.0 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <Link href={dashboardLink} className="group relative px-10 py-4 bg-black text-white rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3">
              <span className="relative z-10 text-sm font-bold uppercase tracking-[0.2em]">{mounted && isLoggedIn ? "Go to Dashboard" : "Start Matching"}</span>
              <div className="absolute inset-0 bg-[#FF4D6D] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
            <a href="#portals" className="px-8 py-4 rounded-full border border-black/10 text-sm font-bold uppercase tracking-[0.15em] text-black/50 hover:text-black hover:border-black/30 transition-all duration-300 flex items-center gap-3 group">
              Explore use cases
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>

        <div className="absolute inset-0 z-[-1] pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF4D6D]/5 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black/5 rounded-full blur-[100px] animate-pulse" />
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 flex flex-col items-center gap-4 text-black/10"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Initiate Protocol</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* Video Showcase Section — Scroll-driven popup */}
      <section ref={videoSectionRef} className="relative z-10 py-16 md:py-28 px-5 md:px-10 overflow-hidden">
        <div
          ref={videoWrapperRef}
          className="w-full mx-auto overflow-hidden shadow-[0_50px_120px_-20px_rgba(0,0,0,0.3)]"
          style={{ maxWidth: 'calc(100vw - 48px)', opacity: 0, transform: 'scale(0.65) translateY(80px)', borderRadius: '40px', willChange: 'transform, opacity' }}
        >
          <div
            className="relative aspect-video bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] cursor-pointer group"
            onClick={() => {
              if (videoRef.current && videoRef.current.src) {
                if (isPlaying) { videoRef.current.pause(); } else { videoRef.current.play(); }
                setIsPlaying(!isPlaying);
              }
            }}
          >
            {/* Video Element — add your video file to public/ and set src here */}
            <video ref={videoRef} className="w-full h-full object-cover" loop muted playsInline />

            {/* Play Intro — shows on hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex flex-col items-center gap-4 scale-90 group-hover:scale-100 transition-transform duration-300">
                <div className="w-20 h-20 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                  <Play className="w-8 h-8 text-black ml-1" fill="black" />
                </div>
                <span className="text-white text-[11px] font-bold uppercase tracking-[0.35em]">Play Intro</span>
              </div>
            </div>

            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
              <span className="text-white/10 text-[10px] font-bold uppercase tracking-[0.5em]">Demo Video Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      <WhatWeDoSection />
      <PortalsSection />
      <LeaderboardSection />
      <WhySection />
      <TeamSection />
      <FooterSection />
    </main>
  );
}
