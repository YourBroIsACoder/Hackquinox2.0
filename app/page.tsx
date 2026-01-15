"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence,useMotionValue,useSpring,useVelocity } from 'framer-motion';
import * as THREE from 'three';
import { 
  Terminal, Code2, Cpu, Globe, Users, Zap, 
  Layers, Ghost, Radio, ChevronDown, Github, Linkedin, Instagram,
  Play, X, Wifi, ShieldAlert, Database, Lock,
  Calendar, Clock, Trophy, Gift, Star, Ticket, ArrowRight, ArrowLeft, Briefcase,MoreHorizontal,PlusCircle,
  Volume2, VolumeX,Award,Medal
} from 'lucide-react';
import { MapPin, Navigation as NavigationIcon } from 'lucide-react';



// --- TYPES ---

interface AudioControllerProps {
  filePath: string;
}

interface Track {
  title: string;
  desc: string;
  image: string;
}

interface TrackCardProps extends Track {
  position: number;
  onClick: () => void;
}

interface TimelineItemProps {
  time: string;
  title: string;
  desc: string;
  align: 'left' | 'right';
}

interface PrizeCardProps {
  rank: number;
  title: string;
  prize: string;
  // removed color prop as we are enforcing theme
  scale?: number;
}

interface PerkItemProps {
  icon: React.ElementType;
  text: string;
  delay: number;
}

interface ClubEntityProps {
  name: string;
  delay: number;
}

interface SectionHeadingProps {
  chapter: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
}

// --- 1. AUDIO SYSTEM ---
class AudioController {
  // 1. Declare properties with types
  ctx: AudioContext | null = null;
  audioElement: HTMLAudioElement | null = null;
  sourceNode: MediaElementAudioSourceNode | null = null;
  gainNode: GainNode | null = null;
  filePath: string;
  isPlaying: boolean = false;
  baseVolume: number = 0.4;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  init() {
    if (this.ctx) return;

    // Handle browser differences (TypeScript safe way)
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.audioElement = new Audio(this.filePath);
    this.audioElement.loop = true;
    this.audioElement.crossOrigin = "anonymous";

    try {
        if (this.ctx && this.audioElement) {
            this.sourceNode = this.ctx.createMediaElementSource(this.audioElement);
            this.gainNode = this.ctx.createGain();
            
            this.sourceNode.connect(this.gainNode);
            this.gainNode.connect(this.ctx.destination);
            this.gainNode.gain.value = 0; 
        }
    } catch (e) {
        console.error("Audio initialization error:", e);
    }
  }

  async play() {
    if (!this.ctx) this.init();
    
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isPlaying) return;

    try {
        if (this.audioElement) {
            await this.audioElement.play();
            this.isPlaying = true;
            this.fadeVolume(this.baseVolume, 3);
        }
    } catch (err) {
        console.warn("Autoplay blocked", err);
    }
  }

  stop() {
    if (!this.isPlaying || !this.ctx || !this.gainNode || !this.audioElement) return;

    this.fadeVolume(0, 2);

    setTimeout(() => {
      if (this.audioElement) {
          this.audioElement.pause();
          this.audioElement.currentTime = 0;
          this.isPlaying = false;
      }
    }, 2000);
  }
  
  toggle() {
      if (this.isPlaying) this.stop();
      else this.play();
  }

  fadeVolume(targetValue: number, duration: number) {
    if (!this.gainNode || !this.ctx) return;
    
    this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(targetValue, this.ctx.currentTime + duration);
  }
}

// Global Audio Instance
const bgMusic = new AudioController('/stranger-things-124008.mp3');


// --- PRELOADER (With Video Background) ---
// --- PRELOADER (With Video Background & Custom Logo) ---
const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false); // Waits for user click
  const [text, setText] = useState("SYSTEM DETECTED");
  
  // Use a ref for the audio so we can control it precisely
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio object once
    audioRef.current = new Audio('/tudum.mp3');
    audioRef.current.volume = 0.6;
  }, []);

  useEffect(() => {
    if (!hasStarted) return; // Don't run progress bar until clicked

    // 1. PLAY SOUND
    if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio failed:", e));
    }

    // 2. START PROGRESS BAR
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 4; 
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, 60);

    // 3. TEXT SEQUENCE
    setText("INITIALIZING PROTOCOL...");
    const t1 = setTimeout(() => setText("BYPASSING FIREWALL..."), 1000);
    const t2 = setTimeout(() => setText("ESTABLISHING UPLINK..."), 2200);
    const t3 = setTimeout(() => {
      setText("WELCOME TO HAWKINS.");
      setTimeout(onComplete, 800); 
    }, 3800);

    return () => {
      clearInterval(timer);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [hasStarted, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(30px)", scale: 1.2 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center font-mono overflow-hidden cursor-pointer"
      // THE MAGIC FIX: User interaction here allows audio to play
      onClick={() => !hasStarted && setHasStarted(true)} 
    >
      {/* --- BACKGROUND VIDEO --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            src="/video2copy.mp4" 
            className="w-full h-full object-cover mix-blend-screen"
          />
          <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 w-full max-w-xl px-6 flex flex-col items-center">
        
        {/* LOGO */}
          {/*
        <motion.div 
            animate={!hasStarted ? { scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] } : { scale: 1, opacity: 0.6 }}
            transition={!hasStarted ? { repeat: Infinity, duration: 3 } : {}}
            className="relative mb-16"
        >
            <img 
                src="/logo-og.PNG" 
                alt="Team Logo"
                className="relative z-10 w-72 h-72 md:w-[30rem] md:h-[30rem] object-contain opacity-60 drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)]"
            />
        </motion.div>*/}

        {/* --- STATE 1: CLICK TO START (Before Click) --- */}
        {!hasStarted ? (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
            >
                <p className="text-red-500 font-bold tracking-[0.3em] text-sm animate-pulse">
                    [ CLICK ANYWHERE TO INITIALIZE ]
                </p>
                {/* Fingerprint or Power Icon decoration */}
                <div className="w-12 h-12 border border-red-500/30 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-red-600/20 rounded-full animate-ping" />
                </div>
            </motion.div>
        ) : (
            /* --- STATE 2: LOADING BAR (After Click) --- */
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full flex flex-col items-center"
            >
                <h1 className="text-red-500 text-lg md:text-2xl font-black tracking-widest mb-6 text-center drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                {text}
                </h1>
                
                <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-red-900/50 relative backdrop-blur-sm">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-red-900 via-red-600 to-red-500 shadow-[0_0_20px_#ef4444]"
                        style={{ width: `${progress}%` }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] animate-[shimmer_1.5s_infinite]" />
                </div>

                <div className="flex justify-between mt-3 text-red-800/70 font-bold text-xs tracking-[0.2em] w-full">
                    <span>SYS.ROOT.ADMIN</span>
                    <span>{Math.floor(progress)}%</span>
                </div>
            </motion.div>
        )}
      </div>
      
      {/* OVERLAYS */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_3px,3px_100%] opacity-40 pointer-events-none z-20" />
    </motion.div>
  );
};
// --- 2. BASIC COMPONENTS ---

const BriefcaseIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

const PerkItem: React.FC<PerkItemProps> = ({ icon: Icon, text, delay }) => (
  <motion.li 
    initial={{ x: -10, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    transition={{ delay }}
    className="flex items-center gap-3 group/item"
  >
    <div className="p-1.5 rounded-sm bg-red-900/30 text-red-400 group-hover/item:bg-red-600 group-hover/item:text-white transition-colors duration-300 border border-red-900/50">
      <Icon size={14} />
    </div>
    <span className="uppercase tracking-wider text-xs md:text-sm text-gray-400 group-hover/item:text-red-200 transition-colors font-mono">
      {text}
    </span>
  </motion.li>
);

const SocialLink = ({ icon: Icon }: { icon: React.ElementType }) => (
  <a href="#" className="text-gray-500 hover:text-red-500 transition-colors duration-300 group relative p-2">
    <Icon size={24} />
    <span className="absolute inset-0 bg-red-600/10 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
  </a>
);

// REVISED CLUB ENTITY: Merged look, removed dark circle
// --- CLUB ENTITY (Holographic Node Style) ---

const FilmGrain = () => (
  <div className="fixed inset-0 z-[60] pointer-events-none opacity-[0.08] mix-blend-overlay"
       style={{ backgroundImage: `url("https://upload.wikimedia.org/wikipedia/commons/7/76/Noise.png")` }}>
  </div>
);

const StoryBridge = ({ text }: { text: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ margin: "-20% 0px -20% 0px" }}
      className="py-32 px-6 max-w-4xl mx-auto flex justify-center text-center"
    >
      <p className="text-2xl md:text-3xl font-serif text-red-100/80 leading-relaxed italic tracking-wide">
        "{text}"
      </p>
    </motion.div>
  );
};

const SectionHeading: React.FC<SectionHeadingProps> = ({ chapter, title, subtitle, align = "center" }) => (
  <div 
    className={`flex flex-col ${
      align === "left" 
        ? "items-start text-left pl-5 md:pl-12" 
        : "items-center text-center"
    } justify-center mb-16 z-10 relative w-full`}
  >
    <motion.span 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="text-red-500 font-tech text-sm tracking-[0.4em] uppercase mb-4"
    >
      {chapter}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-red-600 to-red-900 drop-shadow-[0_0_25px_rgba(229,9,20,0.6)] tracking-widest uppercase"
      style={{ fontFamily: '"Merriweather", serif', WebkitTextStroke: '1px rgba(229,9,20,0.2)' }}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-400 mt-4 font-mono tracking-widest uppercase text-sm"
      >
        <span className="text-red-600 mr-2">//</span>{subtitle}
      </motion.p>
    )}
    <div className={`w-24 h-1 mt-6 shadow-[0_0_20px_#E50914] ${align === "left" ? "bg-gradient-to-r from-red-600 to-transparent" : "mx-auto bg-gradient-to-r from-transparent via-red-600 to-transparent"}`} />
  </div>
);

// --- 3. BACKGROUND SCENE ---

const BackgroundScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  // --- THREE.JS PARTICLE SYSTEM (Unchanged) ---
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#1a0505', 0.02); 
    
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const starPos = new Float32Array(starCount * 3);
    for(let i=0; i<starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 100;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const sporeGeometry = new THREE.BufferGeometry();
    const sporeCount = 1500;
    const sporePos = new Float32Array(sporeCount * 3);
    for(let i=0; i<sporeCount * 3; i++) {
      sporePos[i] = (Math.random() - 0.5) * 30;
      if (i % 3 === 2) sporePos[i] = (Math.random() - 0.5) * 15;
    }
    sporeGeometry.setAttribute('position', new THREE.BufferAttribute(sporePos, 3));
    const sporeMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xE50914, 
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const spores = new THREE.Points(sporeGeometry, sporeMaterial);
    spores.rotation.z = Math.PI / 4;
    scene.add(spores);

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      stars.rotation.y -= 0.0005;
      spores.rotation.x -= 0.001;
      spores.rotation.y -= 0.0008;
      const targetRotX = mouseY * 0.1;
      const targetRotY = mouseX * 0.1;
      spores.rotation.x += 0.05 * (targetRotX - spores.rotation.x);
      spores.rotation.y += 0.05 * (targetRotY - spores.rotation.y);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement);
      starGeometry.dispose();
      starMaterial.dispose();
      sporeGeometry.dispose();
      sporeMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
        
        {/* LAYER 1: STATIC PHOTO (Base) */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-hard-light transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url('https://occ-0-8407-2219.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABU9nCvqLHP6-u6xb9XolIr_dLpbDlja1JeWWRWHMSJerkJWZUvdtyRkctC2RoreaCERA3bel1S0XoT2dumHO3WUsxrfAh0APUwXX.jpg?r=00f')`, 
            filter: 'contrast(1.3) brightness(0.6) sepia(0.5) hue-rotate(-20deg) saturate(1.5)',
            backgroundPosition: '40% center' 
          }}
        />

        {/* LAYER 2: VIDEO OVERLAY (Atmosphere) */}
        <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-50" 
            // mix-blend-screen ensures only the light/red parts show up
        >
            {/* Make sure 'bg.mp4' is in your 'public' folder */}
            <source src="video.mp4" type="video.mp4" />
        </video>

        {/* LAYER 3: VIGNETTE (Darkens edges) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_35%,_#000000_90%)]" />
        
        {/* LAYER 4: THREE.JS PARTICLES (Floating Spores on Top) */}
        <div ref={mountRef} className="absolute inset-0 mix-blend-screen z-10" />
    </div>
  );
};
// --- 4. TERMINAL ---
// --- TERMINAL MODAL (Updated with Scary Vecna Reveal) ---

// --- TERMINAL MODAL (With Google Sheets Integration) ---
// --- TERMINAL MODAL (Build-Safe Version) ---
const TerminalModal = ({ isOpen, onClose }: any) => {
  // CONFIGURATION
  const ROUND_2_UNLOCKED = false; // Set to TRUE to test the form
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby3uVVC5wqvl9b5aUcVYJJLdb7d14YhqMKVlfE3EMnA5fjmEk_XCgnwDMnTuGmoxmVL/exec";

  // STATE
  const [text, setText] = useState('');
  const [stage, setStage] = useState(0); 
  const [teamName, setTeamName] = useState('');
  const [isBreach, setIsBreach] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading State
  
  // REFS
  const typingAudioRef = useRef<HTMLAudioElement | null>(null);
  const lockInAudioRef = useRef<HTMLAudioElement | null>(null);
  const statusAudioRef = useRef<HTMLAudioElement | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [members, setMembers] = useState([
    { name: '', phone: '', email: '' },
    { name: '', phone: '', email: '' },
    { name: '', phone: '', email: '' },
    { name: '', phone: '', email: '' }
  ]);

  const fullText = "> CONNECTING TO FCRIT_SERVER_NODE_1...\n> VERIFYING PARTICIPANT ID...\n> ACCESS GRANTED.\n\nWELCOME TO HACKQUINOX - HACK THE UPSIDE DOWN\nINITIALIZE TEAM PROTOCOLS:";
  const vecnaImageUrl = "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Vecna_%28Stranger_Things%29.jpg/250px-Vecna_%28Stranger_Things%29.jpg";

  // --- FIX: INJECT STYLES SAFELY HERE ---
  useEffect(() => {
    // This runs ONLY in the browser, so 'document' is safe to use
    if (!document.getElementById('terminal-drip-style')) {
        const style = document.createElement('style');
        style.id = 'terminal-drip-style';
        style.textContent = `
          @keyframes drip {
            0% { height: 0; opacity: 0; }
            10% { height: 20%; opacity: 1; }
            100% { height: 100%; opacity: 0.6; }
          }
          .animate-drip { animation: drip 2s infinite ease-in; }
          .animate-scanline { animation: scanline 3s linear infinite; }
          @keyframes scanline {
            0% { top: 0%; }
            100% { top: 100%; }
          }
        `;
        document.head.appendChild(style);
    }
  }, []);

  const scrollToBottom = () => {
    if(bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    if (ROUND_2_UNLOCKED) {
        if (!typingAudioRef.current) {
            typingAudioRef.current = new Audio('/keyboard.mp3'); 
            typingAudioRef.current.loop = true;
            typingAudioRef.current.volume = 0.6; 
        }
        if (!lockInAudioRef.current) {
            lockInAudioRef.current = new Audio('/lock-in.mp3'); 
            lockInAudioRef.current.volume = 1.0;
        }
        if (!statusAudioRef.current) {
            statusAudioRef.current = new Audio('/bg.mp3'); 
            statusAudioRef.current.volume = 0.6; 
        }
    }
  }, [ROUND_2_UNLOCKED]);

  useEffect(() => {
    if (!ROUND_2_UNLOCKED) return;

    if (isOpen && stage === 0) {
      if (typeof bgMusic !== 'undefined') bgMusic.fadeVolume(0.1, 0.5); 
      if (typingAudioRef.current) {
          typingAudioRef.current.currentTime = 0;
          typingAudioRef.current.play().catch(() => {});
      }

      let currentText = '';
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        if (currentIndex < fullText.length) {
          currentText += fullText[currentIndex];
          setText(currentText);
          scrollToBottom();
          currentIndex++;
        } else {
          clearInterval(interval);
          setStage(1);
          scrollToBottom();
          if (typingAudioRef.current) typingAudioRef.current.pause();
          if (typeof bgMusic !== 'undefined') bgMusic.fadeVolume(0.4, 2.0); 
        }
      }, 30); 

      return () => {
        clearInterval(interval);
        if (typingAudioRef.current) typingAudioRef.current.pause();
      };
    } 
    
    // STAGE 2: READY SEQUENCE
    else if (isOpen && stage === 2) {
        const staggerDelay = 800; 
        const initialDelay = 500; 
        const vecnaAppearanceTime = initialDelay + (4 * staggerDelay) + 500; 

        const timers = members.map((_, index) => {
            return setTimeout(() => {
                if (statusAudioRef.current) {
                    statusAudioRef.current.currentTime = 0; 
                    statusAudioRef.current.play().catch(() => {});
                }
                scrollToBottom(); 
            }, initialDelay + (index * staggerDelay));
        });

        const vecnaTimer = setTimeout(() => {
            setIsBreach(true); 
            if (statusAudioRef.current) {
                statusAudioRef.current.pause(); 
                statusAudioRef.current.currentTime = 0;
            }
            setTimeout(() => scrollToBottom(), 100);
        }, vecnaAppearanceTime);

        return () => {
            timers.forEach(t => clearTimeout(t));
            clearTimeout(vecnaTimer);
            setIsBreach(false);
        };
    }

    else if (!isOpen) {
      setText('');
      setStage(0);
      setTeamName('');
      setMembers(Array(4).fill({ name: '', phone: '', email: '' }));
      setIsBreach(false);
      setIsSubmitting(false);
      if (typeof bgMusic !== 'undefined') bgMusic.fadeVolume(0.4, 1.0);
      if (typingAudioRef.current) typingAudioRef.current.pause();
      if (statusAudioRef.current) statusAudioRef.current.pause();
    }
  }, [isOpen, stage, ROUND_2_UNLOCKED]);

  const handleMemberChange = (index: number, field: string, value: string) => {
    const newMembers = [...members];
    // @ts-ignore
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamName, members })
        });

        if (lockInAudioRef.current) {
            lockInAudioRef.current.currentTime = 0;
            lockInAudioRef.current.play();
        }
        setStage(2);
    } catch (error) {
        console.error("Transmission Failed", error);
        alert("Transmission Failed. Check your internet connection.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
      >
        {!ROUND_2_UNLOCKED ? (
            <div className="w-full max-w-5xl bg-black border border-red-800 rounded-3xl p-8 font-mono relative overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)] min-h-[500px] flex flex-col">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none" />
              {/* Uses the animation injected in useEffect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-scanline" />
              
              <div className="flex justify-between items-center mb-12 border-b border-red-900 pb-4 z-10">
                <span className="text-red-500 font-tech tracking-[0.3em] text-xl">FCRIT_GATEWAY // PROTOCOL_SELECT</span>
                <button onClick={onClose} className="text-red-500 hover:text-white"><X size={24}/></button>
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-center justify-center h-full z-10">
                <motion.div 
                   whileHover={{ scale: 1.02, borderColor: '#ef4444' }}
                   className="group relative w-full md:w-1/2 h-80 border border-red-900 bg-red-950/20 rounded-xl p-8 flex flex-col justify-between overflow-hidden cursor-pointer"
                   onClick={() => window.open('https://unstop.com/o/21U5F3u?lb=xQWvaErs&utm_medium=Share&utm_source=floydcar21615&utm_campaign=Online_coding_challenge', '_blank')}
                >
                   <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition-colors" />
                   <div>
                     <div className="flex justify-between items-start mb-4">
                        <h3 className="text-3xl font-benguiat text-white">ROUND 01</h3>
                        <div className="px-3 py-1 bg-green-900/50 border border-green-500 text-green-400 text-xs tracking-widest rounded">ACCESS GRANTED</div>
                     </div>
                     <p className="text-gray-400 text-sm leading-relaxed">
                        The Gateway coordinates have shifted to the Unstop Mainframe for the Initial FIGHT.
                        <br/><span className="text-red-400 mt-2 block"> INITIATE JUMP TO UNSTOP</span>
                     </p>
                   </div>
                   <div className="w-full h-32 bg-black/50 rounded border border-red-900/50 flex items-center justify-center relative overflow-hidden">
                       <Globe className="text-red-500 w-12 h-12 animate-pulse" />
                   </div>
                </motion.div>
                <motion.div className="relative w-full md:w-1/2 h-80 border border-gray-800 bg-black rounded-xl p-8 flex flex-col justify-between overflow-hidden grayscale opacity-75">
                   <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center backdrop-blur-[2px]">
                       <Lock className="text-gray-400 w-16 h-16 mb-4" />
                       <span className="text-gray-400 font-tech tracking-[0.3em] border border-gray-600 px-4 py-2 rounded">CLASSIFIED // LOCKED</span>
                   </div>
                   <div>
                     <div className="flex justify-between items-start mb-4">
                        <h3 className="text-3xl font-benguiat text-gray-500">ROUND 02</h3>
                        <div className="px-3 py-1 bg-gray-900 border border-gray-700 text-gray-500 text-xs tracking-widest rounded">RESTRICTED</div>
                     </div>
                     <p className="text-gray-600 text-sm leading-relaxed">The Main Event. Only qualified squads may enter the Upside Down.</p>
                   </div>
                   <div className="w-full h-32 bg-gray-900/50 rounded border border-gray-800 flex items-center justify-center">
                       <Database className="text-gray-700 w-12 h-12" />
                   </div>
                </motion.div>
              </div>
            </div>
        ) : (
        <motion.div 
            animate={isBreach ? { x: [-10, 10, -10, 10, 0], borderColor: ["#991b1b", "#ef4444", "#991b1b"] } : {}}
            transition={{ duration: 0.4 }}
            className={`w-full max-w-6xl bg-black border ${isBreach ? 'border-red-500 shadow-[0_0_100px_red]' : 'border-red-800 shadow-[0_0_80px_rgba(229,9,20,0.3)]'} rounded-3xl p-6 font-mono relative overflow-hidden h-[90vh] flex flex-col transition-all duration-300`}
        >
          <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url('https://i.pinimg.com/736x/dd/f9/32/ddf932385822e1753776a977f8cc7b5a.jpg')`, filter: 'contrast(1.2) brightness(0.6) sepia(1) hue-rotate(-50deg)', opacity: 0.4 }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20 pointer-events-none z-20" />
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20 animate-scanline pointer-events-none z-20" />

          <div className="flex justify-between items-center mb-6 border-b border-red-900 pb-2 flex-shrink-0 z-30 relative">
            <span className="text-red-500 text-xs tracking-widest">TERMINAL V.2.0 // REG_SYS</span>
            <button onClick={onClose} className="text-red-700 hover:text-red-400 transition-colors bg-red-900/10 p-1 rounded-full"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 custom-scrollbar pr-2">
            {(stage === 0 || stage === 1) && (
              <>
                <div className="text-red-500 whitespace-pre-wrap min-h-[100px] text-sm md:text-base leading-relaxed mb-6">
                  {text}{stage === 0 && <span className="animate-pulse">_</span>}
                </div>
                {stage === 1 && (
                  <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="flex flex-col gap-8 pb-8">
                    <div className="border border-red-800/50 p-6 bg-black/60 rounded-2xl backdrop-blur-md">
                      <h3 className="text-red-400 mb-4 border-b border-red-800 inline-block uppercase tracking-wider font-bold">01. Team Identity</h3>
                      <div className="flex flex-col gap-2">
                        <label className="text-red-600 text-xs font-bold tracking-widest">TEAM DESIGNATION</label>
                        <input required value={teamName} onChange={(e) => setTeamName(e.target.value)} type="text" className="bg-black/50 border border-red-800/60 text-red-300 px-4 py-3 outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(229,9,20,0.3)] w-full font-mono uppercase tracking-widest rounded-xl transition-all" autoFocus placeholder="ENTER TEAM NAME..." />
                      </div>
                    </div>
                    <div className="border border-red-800/50 p-6 bg-black/60 rounded-2xl backdrop-blur-md">
                      <h3 className="text-red-400 mb-4 border-b border-red-800 inline-block uppercase tracking-wider font-bold">02. Squad Allocation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {members.map((member, idx) => (
                          <div key={idx} className="flex flex-col gap-3 p-4 border border-red-900/30 hover:border-red-600/50 transition-colors rounded-xl bg-black/40">
                            <span className="text-red-500 font-bold text-xs bg-red-900/20 w-fit px-2 py-1 rounded">PLAYER 0{idx + 1}</span>
                            <input required placeholder="FULL NAME" value={member.name} onChange={(e) => handleMemberChange(idx, 'name', e.target.value)} className="bg-transparent border-b border-red-900 text-red-300 px-2 py-2 outline-none focus:border-red-500 text-sm placeholder-red-900/50" />
                            <input required placeholder="EMAIL ADDRESS" type="email" value={member.email} onChange={(e) => handleMemberChange(idx, 'email', e.target.value)} className="bg-transparent border-b border-red-900 text-red-300 px-2 py-2 outline-none focus:border-red-500 text-sm placeholder-red-900/50" />
                            <input required placeholder="CONTACT NO." type="tel" value={member.phone} onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)} className="bg-transparent border-b border-red-900 text-red-300 px-2 py-2 outline-none focus:border-red-500 text-sm placeholder-red-900/50" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <button disabled={isSubmitting} type="submit" className="mt-4 bg-red-900/20 border border-red-600 text-red-400 py-4 hover:bg-red-600/30 hover:text-white hover:backdrop-blur-md transition-all duration-300 font-bold tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(229,9,20,0.1)] hover:shadow-[0_0_30px_rgba(229,9,20,0.6)] rounded-xl backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed">
                      {isSubmitting ? 'TRANSMITTING DATA...' : '> INITIATE HACK SEQUENCE'}
                    </button>
                  </motion.form>
                )}
              </>
            )}
            {stage === 2 && (
              <div className="flex flex-col items-center justify-center min-h-full py-10 space-y-6 text-center select-none pb-20">
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md border-b-2 border-red-500 pb-4 mb-4"><h2 className="text-2xl md:text-3xl text-red-400 font-black tracking-widest uppercase">SQUADRON: {teamName}</h2></motion.div>
                 <div className="space-y-4 w-full max-w-lg">
                  {members.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + (i * 0.8), type: 'spring' }} className="flex items-center justify-between border-l-4 border-red-600 bg-red-900/40 backdrop-blur-md p-4 rounded-r-xl">
                      <div className="text-left"><span className="block text-xs text-red-600 tracking-widest font-bold">PLAYER 0{i + 1}</span><span className="text-lg text-red-300 font-bold uppercase">{m.name || 'UNKNOWN'}</span></div>
                      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + (i * 0.8) + 0.2 }} className="text-red-500 font-black tracking-widest bg-red-900/30 px-3 py-1 rounded border border-red-500/30 shadow-[0_0_10px_rgba(229,9,20,0.4)]">READY</motion.div>
                    </motion.div>
                  ))}
                 </div>
                  {isBreach && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.1 }} className="mt-12 p-1 border border-red-900/50 bg-black relative w-full max-w-xl mx-auto">
                        <motion.div animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }} className="absolute -inset-4 bg-red-600/40 blur-xl rounded-full z-0 pointer-events-none" />
                        <div className="relative z-10 bg-black border border-red-600 p-8 overflow-hidden">
                            <motion.div initial={{ x: 0, filter: "brightness(3)" }} animate={{ x: [-5, 5, -2, 2, 0], filter: "brightness(1)" }} transition={{ duration: 0.4 }} className="relative w-56 h-56 md:w-72 md:h-72 mx-auto mb-8 shadow-[0_0_50px_rgba(220,38,38,0.5)] border border-red-500/30">
                                 <div className="w-full h-full relative overflow-hidden bg-black">
                                     <motion.img src={vecnaImageUrl} alt="Vecna" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative z-10 w-full h-full object-cover" style={{ filter: 'grayscale(100%) contrast(1.5) brightness(0.9)' }} />
                                     <div className="absolute inset-0 z-20 bg-red-700 mix-blend-multiply opacity-80 pointer-events-none" />
                                     <div className="absolute inset-0 z-20 bg-red-500 mix-blend-overlay opacity-40 pointer-events-none" />
                                     <motion.div animate={{ x: [-2, 2, 0], opacity: [0, 0.8, 0] }} transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }} className="absolute inset-0 z-40 bg-red-600 mix-blend-screen opacity-50" style={{ backgroundImage: `url('${vecnaImageUrl}')`, backgroundSize: 'cover' }} />
                                 </div>
                            </motion.div>
                            <h3 className="text-red-600 font-black text-3xl md:text-5xl uppercase tracking-widest mb-4 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] font-benguiat leading-none">TARGET LOCKED</h3>
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-red-600 to-transparent mb-4 opacity-50" />
                            <p className="text-red-400 font-mono text-sm tracking-[0.2em] animate-pulse">THREAT LEVEL: OMEGA <br/><span className="text-white">INITIATING CONTAINMENT PROTOCOLS...</span></p>
                        </div>
                      </motion.div>
                  )}
                 <div ref={bottomRef} className="h-4" />
                 <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }} onClick={onClose} className="mt-8 text-red-600 hover:text-red-300 underline underline-offset-4 font-mono text-sm uppercase">[CLOSE TERMINAL]</motion.button>
              </div>
            )}
          </div>
        </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// --- DOMAIN CAROUSEL ---

// --- DOMAIN CONFIGURATION ---
const tracks = [
  { 
    title: "Housing Justice & Urban Belonging", 
    domain: "Sanctuary Protocol",
    desc: "Rebuild Hawkins. Create safe havens and sustainable housing solutions to protect citizens from the creeping Upside Down.", 
    // Image: The creepy Creel House (Housing theme)
    image: "house.jpg",
  ps1: "Develop a privacy-first, offline-capable PWA ('Sanctuary Protocol') to bridge the critical disconnect between urban temporary housing resources and displaced individuals. The platform must aggregate fragmented shelter data into a 'Smart Discovery Interface,' offering frictionless, verified matching based on specific needs (gender, accessibility, pets) without mandatory login. Crucially, the system must function in low-connectivity 'Dead Zones' via optimized data caching (<50KB) and include an emergency protocol for one-tap location sharing to ensure rapid access during crisis situations.",
    ps2: "Engineer a decentralized, anonymous reporting ecosystem to expose systemic housing abuses and protect the tenant community. The platform must leverage NLP to automatically classify threats (Safety, Harassment, Maintenance) and generate real-time 'Risk Heatmaps' of problematic neighborhoods. By aggregating verified grievances into transparent Landlord Profiles, the system will empower tenants to identify repeat offenders before signing leases, preventing future exploitation through data-driven collective intelligence."},
  { 
    title: "Fintech & Financial Inclusion", 
    domain: "Starcourt Economy",
    desc: "Fund the resistance. Build secure, accessible financial systems to allocate resources for the war against Vecna.", 
    // Image: Starcourt Mall Neon (Commerce/Finance theme)
    image: "mall.jpg" ,
    ps1: "Construct a modular AI-driven financial advisory council designed to democratize personalized wealth management for India's youth. The system must deploy four specialized agents—Budget, Savings, Debt, and Investment—to analyze user profiles and synthesize holistic, actionable financial roadmaps. By simulating 'Current' vs. 'Optimized' financial trajectories, the platform will replace expensive human consultation with data-driven strategies, empowering users to combat lifestyle inflation and build long-term economic resilience.",
    ps2: "Develop an AI-powered sentiment validation engine to democratize institutional-grade market analysis for retail investors. The system must aggregate and decode high-volume social signals and news for NIFTY 50 companies, using NLP to quantify 'hype' versus genuine market sentiment. Crucially, the platform must backtest these sentiment scores against historical price data, providing a verifiable 'Signal Correlation' dashboard that proves the strategy's win rate over speculative guesswork."
    
  }, 
  { 
    title: "AgriTech & Sustainability", 
    domain: "Blight Defense",
    desc: "Stop the rot. Develop agricultural tech to save the pumpkin patches and food supply from the toxicity of the shadow dimension.", 
    // Image: The rotting pumpkin patch / vines (Agriculture theme)
    image: "pumpkin.jpg" ,
    ps1: "Engineer an offline-first computer vision diagnostic tool to safeguard the livelihoods of India's marginal farmers. The platform must deploy a lightweight AI model (<50MB) capable of detecting crop diseases from leaf images with high accuracy, even in low-connectivity environments. By offering instant, multilingual treatment protocols and minimizing reliance on expensive expert consultations, the system aims to arrest crop yield losses and curb excessive pesticide usage.",
    ps2: "Engineer a mobile-first 'Citizen Science' sentinel system to combat the $423 billion threat of biological invasion. The platform must deploy a lightweight computer vision model to instantly distinguish between harmful invasive species (e.g., Lantana) and native flora, even in offline 'Dead Zones'. By crowdsourcing geotagged sightings into a real-time 'Bio-Invasion Heatmap', the system empowers the public to act as environmental guardians, enabling early detection and rapid response to ecological threats."
  }, 
  { 
    title: "EdTech & Skill Development", 
    domain: "Cerebro Initiative",
    desc: "Train the party. Use radio towers and digital platforms to share knowledge and upskill the next generation of monster hunters.", 
    // Image: Dustin's Cerebro / Radio Tower (Communication/Learning theme)
    image: "cerebro.jpg" ,
    ps1: "Architect an adaptive, domain-specific upskilling ecosystem to bridge the employability gap for engineering students beyond standard DSA. The platform must offer hands-on, adaptive challenges in emerging fields like AI/ML, IoT, and Cybersecurity, providing real-time feedback and 'Skill Gap Analysis'. By generating actionable mastery dashboards for both students and Placement Officers, the system enables targeted interventions that align academic training with industry demands.",
    ps2: "Develop an AI-powered cognitive bridge to democratize access to complex academic knowledge. The platform must ingest dense lecture materials and instantly transmute them into structured, plain-language summaries with auto-generated glossaries and assessment quizzes. By offering a 'Dual-View' interface that toggles between original and simplified text, the system reduces cognitive load for diverse learners, ensuring equitable comprehension without diluting the core curriculum."
  }, 
  { 
   title: "Environment & Sustainability", 
    domain: "Terraform Protocol",
    desc: "Heal the decay. Engineer bio-solutions to filter toxic spores and restore the ecological balance of our dimension.", 
    // Image: The Upside Down with floating spores (Environment theme)
    image: "ulta.jpg" ,
    ps1: "Engineer a cognitive-first web assistant to de-clutter the digital experience for neurodiverse users (ADHD, Dyslexia, Autism). The tool must act as a 'Visual Noise Filter,' dynamically stripping ads, sidebars, and repetitive navigation to present a 'Simplify Mode' or 'Focus Mode' overlay. By leveraging DOM analysis to isolate essential content and extract instant summaries, the system drastically reduces cognitive load, enabling users to complete critical tasks without distraction.",
    ps2: "Engineer an explainable AI document assistant to demystify complex legal and financial texts for vulnerable users. The platform must ingest documents and provide plain-language answers to critical queries, explicitly highlighting the source evidence to eliminate the 'Black Box' problem. By auto-extracting key obligations, dates, and risks into a transparent 5-point summary, the system empowers users to sign agreements with full comprehension and zero ambiguity."
  }, 
  { 
    title: "Open Innovation", 
    domain: "Project Nina",
    desc: "Unlock human potential. Push the boundaries of science and psychic phenomena to close the gate for good.", 
    // Image: Eleven in the Sensory Deprivation Tank / The Void (Innovation theme)
    image: "eleven.webp" ,
    ps1: "Acknowledging that radical innovation often defies categorization, this track challenges teams to identify and neutralize unique, real-world friction points outside standard domains. Whether leveraging AI, Cybersecurity, IoT, or Systems Engineering, the objective is to architect an original, feasible solution driven by personal insight. Teams must deliver a functional, demo-ready prototype that addresses a clearly defined pain point, prioritizing tangible impact and creative engineering over theoretical concepts.", // Special flag
    
  }, 
];
// --- UPGRADED "RIFT" CARD ---
// --- FIXED FLIP CARD (Original Width Restored) ---
const TrackCard = ({ image, title, domain, ps1, ps2, position, onClick }: any) => {
  const isActive = position === 0;
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPs2, setShowPs2] = useState(false); 

  useEffect(() => {
    if (!isActive) {
        setIsFlipped(false);
        setShowPs2(false);
    }
  }, [isActive, title]);

  const isOpenInnovation = title === "Open Innovation";

  const variants = {
    

    center: { x: "0%", scale: 1, zIndex: 50, opacity: 1, rotateY: 0, filter: "brightness(1) blur(0px)" },

    left1: { x: "-50%", scale: 0.85, zIndex: 30, opacity: 0.6, rotateY: 25, filter: "brightness(0.5) blur(2px)" },

    right1: { x: "50%", scale: 0.85, zIndex: 30, opacity: 0.6, rotateY: -25, filter: "brightness(0.5) blur(2px)" },

    left2: { x: "-90%", scale: 0.7, zIndex: 10, opacity: 0.3, rotateY: 45, filter: "brightness(0.2) blur(5px)" },

    right2: { x: "90%", scale: 0.7, zIndex: 10, opacity: 0.3, rotateY: -45, filter: "brightness(0.2) blur(5px)" },

    hidden: { x: "0%", scale: 0.5, zIndex: 0, opacity: 0 },

 
  };

  const getVariant = () => {
    if (position === 0) return "center";
    if (position === -1) return "left1";
    if (position === 1) return "right1";
    return "hidden";
  };

  return (
    <motion.div
      animate={getVariant()}
      variants={variants}
      transition={{ duration: 0.6, ease: "circOut" }}
      // --- RESTORED ORIGINAL WIDTH & HEIGHT HERE ---
      className={`absolute top-1/2 left-1/2 w-[340px] md:w-[600px] h-[450px] md:h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-xl cursor-pointer perspective-1000`}
    >
      {/* FLIP CONTAINER */}
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        //transition={{ duration: 0.6, animationDirection: "normal" }}
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        onClick={(e) => {
             if(isActive) {
                 // @ts-ignore
                 if(e.target.tagName !== 'BUTTON') setIsFlipped(!isFlipped);
             } else {
                 onClick(); 
             }
        }}
      >
        {/* === FRONT FACE === */}
        <div 
            className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden border-2 border-gray-800 bg-black"
            style={{ backfaceVisibility: 'hidden' }}
        >
             <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                    backgroundImage: `url(${image})`,
                    filter: isActive ? 'grayscale(0%) contrast(1.1)' : 'grayscale(100%) contrast(1.5) brightness(0.5)'
                }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
             
             {isActive && !isFlipped && (
                 <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50 shadow-[0_0_15px_red] animate-[scanline_3s_linear_infinite]" />
             )}

             <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col gap-2">
                 <div className="bg-red-900/80 text-red-200 text-xs font-tech w-fit px-2 py-1 rounded border border-red-500/50 backdrop-blur-md">
                    {domain}
                 </div>
                 <h3 className="text-4xl md:text-5xl font-black font-benguiat text-white uppercase drop-shadow-lg leading-none">
                    {title}
                 </h3>
                 {isActive && (
                    <div className="mt-4 flex items-center gap-2 text-red-400 font-mono text-xs animate-pulse">
                        <span>CLICK TO DECLASSIFY FILE</span>
                        <ArrowRight size={14} />
                    </div>
                 )}
             </div>
        </div>

        {/* === BACK FACE === */}
        <div 
            className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden border-2 border-red-600 bg-black p-8 flex flex-col"
            style={{ 
                backfaceVisibility: 'hidden', 
                transform: 'rotateY(180deg)',
                backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')"
            }}
        >
            <div className="absolute inset-0 bg-red-900/10 pointer-events-none" />
            
            <div className="flex justify-between items-center border-b border-red-800 pb-4 mb-4 z-10">
                <span className="text-red-500 font-tech tracking-[0.3em] text-xs uppercase">TOP SECRET // {domain}</span>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]" />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pr-2">
                 <h3 className="text-2xl font-benguiat text-white mb-6 uppercase">{title}</h3>

                 {!isOpenInnovation && (
                    <div className="flex w-full mb-6 border border-red-900 rounded overflow-hidden">
                        <button 
                           onClick={() => setShowPs2(false)}
                           className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-all ${!showPs2 ? 'bg-red-600 text-white' : 'bg-black text-red-500 hover:bg-red-900/20'}`}
                        >
                           Problem Statement 1
                        </button>
                        <div className="w-px bg-red-900" />
                        <button 
                           onClick={() => setShowPs2(true)}
                           className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-all ${showPs2 ? 'bg-red-600 text-white' : 'bg-black text-red-500 hover:bg-red-900/20'}`}
                        >
                           Problem Statement 2
                        </button>
                    </div>
                 )}

                 <div className="bg-black/50 border border-red-900/50 p-6 rounded text-gray-300 font-mono text-sm md:text-base leading-relaxed">
                     {isOpenInnovation ? (
                        <div className="text-center py-8">
                            
                            <p className="text-red-400 font-bold tracking-widest mb-4">PROTOCOL: UNRESTRICTED</p>
                            <p>Identifying constraints... NONE FOUND.</p>
                            <p className="mt-4 text-white">Innovate without boundaries.</p>
                        </div>
                     ) : (
                        <motion.div
                           key={showPs2 ? 'ps2' : 'ps1'}
                           initial={{ opacity: 0, x: 10 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ duration: 0.3 }}
                        >
                            <span className="text-red-500 font-bold block mb-2 text-xs tracking-widest">
                                {showPs2 ? ">> SECONDARY OBJECTIVE:" : ">> PRIMARY OBJECTIVE:"}
                            </span>
                            {showPs2 ? ps2 : ps1}
                        </motion.div>
                     )}
                 </div>
                 <p className="text-gray-300 font-tech text-sm leading-relaxed">
  {domain.abstract} {/* Your existing abstract text */}
  
  <span className="block mt-4 text-red-500/80 border-t border-red-900/30 pt-3 italic">
    [!] SYSTEM NOTE: Data truncated. Decrypt full mission brief and 
    technical specs at the 
    <a 
      href="https://unstop.com/o/21U5F3u?lb=xQWvaErs&utm_medium=Share&utm_source=floydcar21615&utm_campaign=Online_coding_challenge" 
      target="_blank" 
      className="ml-1 underline decoration-red-600 underline-offset-4 hover:text-red-400"
    >
      UNSTOP TERMINAL &gt;_
    </a>
  </span>
</p>
            </div>
            

            <button 
                onClick={() => setIsFlipped(false)}
                className="mt-4 w-full py-3 border border-red-800 text-red-500 hover:bg-red-900/20 hover:text-white transition-colors font-tech uppercase tracking-widest text-xs z-10"
            >
                [ CLOSE FILE ]
            </button>
        </div>

      </motion.div>
    </motion.div>
  );
};

// --- 3. DOMAIN CAROUSEL (Unchanged Logic, just passes new props) ---
const DomainCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tracks.length);
    }, 5000); // Increased time slightly for reading
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextTrack = () => setActiveIndex((prev) => (prev + 1) % tracks.length);
  const prevTrack = () => setActiveIndex((prev) => (prev - 1 + tracks.length) % tracks.length);

  const getPosition = (index: number) => {
    const len = tracks.length;
    let offset = (index - activeIndex + len) % len;
    if (offset > len / 2) offset -= len;
    return offset;
  };

  return (
    <div 
      className="relative w-full flex flex-col items-center justify-center py-24 overflow-hidden min-h-[900px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Radar */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-red-900/20 rounded-full z-0 pointer-events-none">
         <div className="absolute inset-0 border border-red-900/10 rounded-full scale-75" />
         <div className="absolute inset-0 border border-red-900/5 rounded-full scale-50" />
      </div>

      {/* 3D Container */}
      <div className="relative h-[600px] w-full max-w-7xl mx-auto flex items-center justify-center perspective-1000 z-10">
        {tracks.map((track, index) => (
          <TrackCard 
            key={index} 
            {...track} 
            position={getPosition(index)}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-12 mt-4 z-50">
        <button onClick={prevTrack} className="group p-4 rounded-full bg-black border border-red-900 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-110 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
          <ArrowLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        
        <div className="flex gap-3">
            {tracks.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-8 bg-red-500 shadow-[0_0_10px_red]' : 'w-2 bg-gray-800'}`} />
            ))}
        </div>

        <button onClick={nextTrack} className="group p-4 rounded-full bg-black border border-red-900 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-110 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
          <ArrowRight size={32} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
const TimelineItem: React.FC<TimelineItemProps> = ({ time, title, desc, align }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true, margin: "-100px" }}
    className={`flex flex-col md:flex-row items-center gap-12 w-full ${align === 'right' ? 'md:flex-row-reverse' : ''}`}
  >
    <div className="flex-1 w-full group">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className={`p-8 border border-red-900/50 bg-black/70 relative rounded-2xl md:max-w-xl backdrop-blur-sm hover:border-red-500 transition-colors ${align === 'right' ? 'md:text-left md:mr-auto' : 'md:text-right md:ml-auto'} group-hover:shadow-[0_0_30px_rgba(229,9,20,0.2)]`}
      >
         <h3 className="text-3xl font-bold text-red-500 font-benguiat tracking-wide group-hover:text-red-400 transition-colors">{title}</h3>
         <p className="text-gray-300 text-lg mt-3 font-mono">{desc}</p>
         
         <div className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-black border-2 border-red-600 shadow-[0_0_15px_#E50914] rounded-full hidden md:flex items-center justify-center ${align === 'right' ? '-left-[59px]' : '-right-[59px]'}`}>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
         </div>
      </motion.div>
    </div>
    
    <div className="relative flex flex-col items-center justify-center shrink-0 md:hidden">
      <div className="w-4 h-4 rounded-full bg-red-600 shadow-[0_0_15px_#E50914] z-10" />
    </div>
    
    <div className={`flex-1 text-center ${align === 'right' ? 'md:text-right' : 'md:text-left'}`}>
      <span className="font-tech text-4xl md:text-6xl text-white font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 drop-shadow-[0_0_10px_rgba(229,9,20,0.5)]">
        {time}
      </span>
    </div>
  </motion.div>
);

const PrizeCard = ({ rank, title, prize, color, scale = 1, className = '' }: any) => {
  const PRIZES = {
  1: [
    { icon: Trophy, text: "Certificate of Valor", delay: 0.1 },
    { icon: Star, text: "Exclusive Swag Kit", delay: 0.2 },
    { icon: Gift, text: "Event T-SHIRT", delay: 0.3 },
  ],
  2: [
  { icon: Trophy, text: "Certificate of Valor", delay: 0.1 },
    { icon: Star, text: "Exclusive Swag Kit", delay: 0.2 },
  ],
  3: [
      { icon: Trophy, text: "Certificate of Valor", delay: 0.1 },
    { icon: Star, text: "Exclusive Swag Kit", delay: 0.2 },
  ],
};

  // Define colors based on rank
  const isGold = color === 'yellow';
  const isSilver = rank === 2;
  
  // Dynamic glow colors
  const mainColor = isGold ? '#fbbf24' : isSilver ? '#94a3b8' : '#c2410c'; // Yellow / Slate / Orange
  const glowShadow = `0 0 40px ${isGold ? 'rgba(251,191,36,0.4)' : isSilver ? 'rgba(148,163,184,0.3)' : 'rgba(194,65,12,0.4)'}`;

  return (
    <motion.div 
      initial={{ y: 0 }}
      animate={{ y: [0, -15, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: rank * 0.8 }}
      whileHover={{ scale: scale * 1.05, y: -25, zIndex: 100 }}
      className={`
  relative group flex flex-col items-center
  w-full md:w-1/3 min-h-[550px]
  rounded-xl transition-all duration-500
  perspective-1000
  ${className}
`}

      style={{ transform: `scale(${scale})`, zIndex: rank === 1 ? 50 : 20 }}
    >
      
      {/* 1. The "Plasma" Background Border */}
      <div className="absolute -inset-[2px] bg-gradient-to-b from-gray-800 to-black rounded-xl z-0 overflow-hidden">
         {/* Rotating Light Beam */}
         <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_340deg,var(--tw-gradient-to)_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ '--tw-gradient-to': mainColor } as any}
         />
      </div>

      {/* 2. Main Card Body */}
      <div 
        className="absolute inset-[1px] bg-black/90 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 group-hover:border-transparent transition-colors z-10"
        style={{ boxShadow: "inset 0 0 40px rgba(0,0,0,0.8)" }}
      >
        {/* Grid & Noise Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none" />
        
        {/* Massive Rank Watermark (Pulsing) */}
        <motion.span 
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -right-6 -bottom-12 text-[14rem] font-black text-white font-serif select-none leading-none z-0"
          style={{ color: mainColor, filter: 'blur(2px)' }}
        >
          0{rank}
        </motion.span>

        {/* Top Glowing "Portal" Light */}
        <div 
            className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
            style={{ background: `linear-gradient(to bottom, ${mainColor}33, transparent)` }}
        />
      </div>

      {/* 3. Content Container */}
      <div className="relative z-20 flex flex-col items-center justify-between w-full h-full p-8 pt-12">
        
        {/* Floating Trophy */}
        <div className="relative">
          <motion.div 
            animate={{ 
                boxShadow: [
                    `0 0 20px ${mainColor}00`, 
                    `0 0 50px ${mainColor}66`, 
                    `0 0 20px ${mainColor}00`
                ] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative z-10 p-6 bg-black/40 border border-white/10 rounded-full backdrop-blur-md"
            style={{ borderColor: `${mainColor}44` }}
          >
            <Trophy size={56} style={{ color: mainColor, filter: `drop-shadow(0 0 10px ${mainColor})` }} />
          </motion.div>
        </div>

        {/* Text Details */}
        <div className="text-center mt-8 space-y-4">
            <h3 className="text-2xl font-serif text-gray-300 uppercase tracking-[0.2em] border-b border-white/10 pb-2">{title}</h3>
            
            {/* Glowing Prize Text */}
            <div className="relative py-2 group-hover:scale-110 transition-transform duration-300">
                <div 
                    className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl font-mono tracking-tighter"
                    style={{ textShadow: glowShadow }}
                >
                {prize}
                </div>
            </div>
        </div>
        

       <div className="w-full mt-10">
  <ul className="space-y-4 font-mono text-sm text-gray-400">
    {/* Select the array based on rank, or fallback to an empty array */}
    {(PRIZES[rank] || []).map((perk, index) => (
      <PerkItem 
        key={index}
        icon={perk.icon} 
        text={perk.text} 
        delay={perk.delay} 
      />
    ))}
  </ul>
</div>
      </div>
    </motion.div>
  );
};

// --- FOOTER COMPONENTS (UPDATED WITH SOCIAL LINKS) ---

// =========================================
// UPDATED FOOTER & CLUB COMPONENTS
// =========================================

// 1. THE ORGANIZERS FOOTER CONTAINER
const OrganizersFooter = () => {
  // --- CONFIGURATION AREA: EDIT YOUR CLUB DETAILS HERE ---
  const clubData = [
    {
      id: 1,
      name: "CSI-COMPS",
      // REPLACE with actual image URL (e.g., from imgur, or your public folder like '/logos/csi-comps.png')
      logoSrc: "1.jpg", 
      instaLink: "https://www.instagram.com/csifcrit/", // REPLACE with actual link
      linkedinLink: "https://www.linkedin.com/company/csi-computer-fcrit/", // REPLACE with actual link
    },
    {
      id: 2,
      name: "CSI-IT",
      logoSrc: "2.jpg", // REPLACE
      instaLink: "https://www.instagram.com/csiitfcrit/", // REPLACE
      linkedinLink: "https://www.linkedin.com/company/csi-it-fcrit/", // REPLACE
    },
    {
      id: 3,
      name: "AIDL",
      logoSrc: "3.jpg", // REPLACE
      instaLink: "https://www.instagram.com/aidl_fcrit/", // REPLACE
      linkedinLink: "https://www.linkedin.com/company/artificial-intelligence-and-deep-learning-club-fcrit", // REPLACE
    },
  ];
  // -------------------------------------------------------

  return (
    <footer className="relative pt-48 pb-24 overflow-hidden" id="footer-section">
      
      {/* Background Atmos Glow */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/90 to-[#0a0000]" />
         <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[150%] h-[80%] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-red-700/40 via-red-950/40 to-transparent blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        
       
         <div className="flex items-center justify-center gap-4 mb-20 relative z-10">
          <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-red-600 shadow-[0_0_10px_#ef4444]" />
          <span className="text-red-400 font-tech tracking-[0.5em] text-base uppercase drop-shadow-md">Orchestrated By</span>
          <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-red-600 shadow-[0_0_10px_#ef4444]" />
        </div>
        {/* CLUBS GRID (Dynamic Rendering) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-12 max-w-6xl mx-auto mb-32 items-start">
           {clubData.map((club, index) => (
             <ClubEntity 
                key={club.id}
                name={club.name}
                logoSrc={club.logoSrc} // Passing unique logo
                insta={club.instaLink} // Passing unique insta
                linkedin={club.linkedinLink} // Passing unique linkedin
                delay={index} 
             />
           ))}
        </div>

       {/* --- NEW SECTION: LOCATION INTEL (Address & Map) --- */}
        <div className="max-w-5xl mx-auto mb-32 border-t border-red-900/30 pt-16">
            <h4 className="text-red-500 font-tech text-sm tracking-[0.4em] uppercase mb-12 flex items-center justify-center gap-4">
                <span className="w-12 h-[1px] bg-red-800" />
                Target Coordinates
                <span className="w-12 h-[1px] bg-red-800" />
            </h4>

            <div className="flex flex-col md:flex-row items-stretch gap-8 bg-black/40 border border-red-900/30 rounded-2xl overflow-hidden backdrop-blur-md relative group">
                
                {/* LEFT: Address Details */}
                <div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col justify-center text-left border-b md:border-b-0 md:border-r border-red-900/30 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-red-900/20 rounded-lg text-red-500 animate-pulse">
                            <MapPin size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-benguiat text-gray-200 mb-2">FCRIT Vashi</h3>
                            <p className="font-tech text-red-500/80 text-sm tracking-wider uppercase">Operational Base</p>
                        </div>
                    </div>

                    <p className="text-gray-400 font-mono text-sm leading-relaxed mb-8">
                        Agnel Technical Education Complex,<br/>
                        Sector 9A, Vashi,<br/>
                        Navi Mumbai, Maharashtra 400703
                    </p>

                    <a 
                        href="https://maps.app.goo.gl/8dbQhkFJnoByz5EQ9" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-red-400 hover:text-white font-tech uppercase tracking-widest text-sm transition-colors group/link"
                    >
                        <NavigationIcon size={16} className="group-hover/link:translate-x-1 transition-transform" />
                        Initiate Navigation
                    </a>
                </div>

                {/* RIGHT: Tactical Map (Dark Mode) */}
                <div className="w-full md:w-2/3 h-64 md:h-auto relative overflow-hidden bg-[#1a1a1a]">
                    {/* Scanner Effect */}
                    <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(transparent_2px,#000_3px)] bg-[length:100%_4px] opacity-20" />
                    <motion.div 
                        animate={{ top: ['-100%', '200%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-24 bg-red-500/10 blur-xl z-20 pointer-events-none border-b border-red-500/20"
                    />

                    {/* Google Map Iframe (FCRIT Vashi) */}
                    {/* FILTER TRICK: grayscale + invert makes the light map look dark/hacker style */}
                    {/* Google Map Iframe (FCRIT Vashi) */}
                    <iframe 
    src="https://maps.google.com/maps?q=Fr.+Conceicao+Rodrigues+Institute+of+Technology&t=&z=15&ie=UTF8&iwloc=&output=embed"
    width="100%" 
    height="100%" 
    style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(1.2) brightness(0.8)' }} 
    allowFullScreen 
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="FCRIT Map"
    className="absolute inset-0 opacity-80 hover:opacity-100 transition-opacity duration-500"
></iframe>
                </div>
            </div>
        </div>

        {/* Copyright */}
        <p className="font-mono text-red-500/50 text-xs tracking-[0.3em] uppercase">
          FCRIT VASHI <span className="text-red-600 mx-2">//</span> 2026
        </p>
      </div>
    </footer>
  );
};

// 2. THE INDIVIDUAL CLUB CARD (Holographic Node Style - Full Color)
// 2. THE INDIVIDUAL CLUB CARD (Rounded & Smooth)
const ClubEntity = ({ name, logoSrc, insta, linkedin, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.2, duration: 1, ease: "circOut" }}
    viewport={{ once: true }}
    className="group relative flex flex-col items-center"
  >
    {/* 1. LEVITATING LOGO (Now with Rounded Corners) */}
    <motion.div 
        animate={{ y: [-6, 6, -6] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5 }}
        className="relative z-20 w-36 h-36 md:w-44 md:h-44 flex items-center justify-center mb-8"
    >
       {/* Ambient Back Glow */}
       <div className="absolute inset-0 bg-red-600/5 blur-[40px] rounded-full group-hover:bg-red-600/20 transition-all duration-500" />
       
       {/* THE LOGO IMAGE (Rounded Corners Added) */}
       <img 
         src={logoSrc} 
         alt={`${name} Logo`} 
         className="w-full h-full object-contain rounded-3xl filter brightness-110 transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]" 
       />
    </motion.div>

    {/* 2. THE ENTITY NAME */}
    <h4 className="relative text-2xl font-benguiat text-gray-300 mb-6 tracking-widest uppercase group-hover:text-red-500 transition-colors duration-300">
        {name}
        {/* Underline Laser */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 group-hover:w-3/4 h-[2px] bg-red-600/50 group-hover:bg-red-600 shadow-[0_0_10px_red] transition-all duration-500 ease-out" />
    </h4>

    {/* 3. SOCIAL NODES */}
    <div className="flex items-center gap-5 mt-2">
        {/* Instagram Node */}
        <SocialNode icon={Instagram} link={insta} delay={0} />

        {/* Vertical Divider Line */}
        <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-red-900/50 to-transparent group-hover:via-red-500 transition-colors duration-500" />

        {/* LinkedIn Node */}
        <SocialNode icon={Linkedin} link={linkedin} delay={0.1} />
    </div>

  </motion.div>
);

// Helper Component: PERFECT CIRCLES
const SocialNode = ({ icon: Icon, link, delay }: any) => (
  <a 
      href={link} 
      target="_blank" 
      rel="noreferrer"
      // Added 'w-12 h-12 flex items-center justify-center rounded-full' to force a perfect circle
      className="relative group/icon w-12 h-12 flex items-center justify-center rounded-full border border-red-900/30 bg-black/40 backdrop-blur-sm transition-all duration-300 hover:border-red-500 hover:bg-red-950 hover:scale-110 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]"
  >
      {/* Ping animation on hover */}
      <div className="absolute inset-0 rounded-full border border-red-500/0 group-hover/icon:border-red-500/50 animate-ping opacity-0 group-hover/icon:opacity-50" style={{ animationDelay: `${delay}s` }} />
      <Icon size={20} className="text-gray-500 group-hover/icon:text-white transition-colors duration-300" />
  </a>
);

// --- UPDATED CLUB ENTITY CARD ---

const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  const handleToggle = () => {
    bgMusic.toggle();
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className="fixed bottom-6 right-6 z-[100] p-4 bg-black/60 backdrop-blur-md border border-red-600/50 rounded-full text-red-500 hover:bg-red-900/40 hover:text-white hover:shadow-[0_0_20px_#E50914] transition-all duration-300 group"
    >
      {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/90 text-red-500 text-xs font-tech tracking-widest px-3 py-1 rounded border border-red-900/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {isPlaying ? "MUTE SYSTEM AUDIO" : "ENABLE SYSTEM AUDIO"}
      </span>
    </motion.button>
  );
};
// --- NEW COMPONENT: VOLUME ALERT ---
const VolumeAlert = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, delay: 1 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-4 px-6 py-3 bg-red-900/80 backdrop-blur-md border border-red-500 rounded-full shadow-[0_0_20px_red]"
    >
      <div className="relative">
        <Volume2 className="text-white w-6 h-6 animate-pulse" />
        <div className="absolute inset-0 bg-white/50 blur-lg rounded-full animate-ping" />
      </div>
      <span className="text-white font-tech tracking-widest text-sm uppercase">
        Incoming Transmission // Increase Volume
      </span>
    </motion.div>
  );
};

// --- NEW COMPONENT: HOLOGRAPHIC NAVBAR ---
// --- NEW COMPONENT: SLIDING NAVBAR (Fixed Logic) ---
// --- NEW COMPONENT: STEALTH GLASS NAVBAR ---
const NavbarOverlay = ({ isOpen, onClose, onOpenTerminal }: any) => {
  const navItems = [
    { label: "About", id: "about-section" },
    { label: "Timeline", id: "timeline-section" },
    { label: "Domains", id: "domains-section" },
    { label: "Prizes", id: "prizes-section" },
  // { label: "Sponsors", id: "sponsors-section" },
    { label: "Contact", id: "footer-section" },
  ];

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

 return (
    <AnimatePresence>
        {isOpen && (
            <motion.div 
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }} 
              className="fixed top-0 left-0 right-0 z-[120] h-20 md:h-24"
            >
              {/* 1. GLASS BACKGROUND */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-md shadow-[inset_0_0_30px_rgba(220,38,38,0.2)]" />
              
              {/* 2. LASER SCANNER */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-red-900/30 overflow-hidden">
                  <motion.div 
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-red-500 to-transparent box-shadow-[0_0_15px_#ef4444]"
                  />
              </div>

              {/* 3. BORDER GLOW */}
              <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-red-600/20 blur-[2px]"
              />

              {/* CONTENT CONTAINER */}
              <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center justify-between z-10">
                  
                  {/* --- LEFT: LOGO + TEXT --- */}
                  <div 
                    className="flex items-center gap-3 cursor-pointer group" 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                      {/* Logo Image */}
                      <img 
                        src="/logo-cropped.PNG" 
                        alt="Logo" 
                        // Adjusted size to fit nicely in navbar. 
                        // w-12 is standard, but you can change back to w-40 if your logo is very wide.
                        className="w-16 w-16 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300" 
                      />

                      {/* Text Name */}
                      <span className="text-white/90 font-benguiat text-xl tracking-widest group-hover:text-red-500 transition-colors duration-300 drop-shadow-md pt-1">
                        HackQuinox
                      </span>
                  </div>

                  {/* --- CENTER: DESKTOP LINKS --- */}
                  <div className="hidden md:flex gap-10">
                      {navItems.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleScroll(item.id)}
                          className="relative text-gray-300/80 hover:text-white font-tech uppercase tracking-[0.2em] text-sm transition-all hover:scale-105 group"
                        >
                          {item.label}
                          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-red-500 transition-all duration-300 group-hover:w-full box-shadow-[0_0_8px_red]" />
                        </button>
                      ))}
                  </div>

                  {/* --- RIGHT: SPACER (Balances the layout) --- */}
                  <div className="w-20 hidden md:block" /> 
                  
              </div>
              
              {/* MOBILE MENU */}
              <div className="md:hidden flex overflow-x-auto gap-6 px-6 pb-2 scrollbar-hide absolute bottom-0 translate-y-full left-0 right-0 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm pt-2">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleScroll(item.id)}
                      className="text-gray-400 hover:text-red-500 font-tech uppercase tracking-widest text-xs whitespace-nowrap pb-2"
                    >
                      {item.label}
                    </button>
                  ))}
              </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};

// --- NEW COMPONENT: SPONSORS SECTION ---
{/*
const SponsorsSection = () => {
    return (
        <section id="sponsors-section" className="py-20 w-full relative">
            <SectionHeading chapter="Chapter Four" title="The Benefactors" subtitle="Our Sponsors" align="center" />
            
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center opacity-80">
                
                {[1, 2, 3, 4].map((i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ scale: 1.1, filter: "brightness(1.5) drop-shadow(0 0 10px red)" }}
                        className="w-32 h-32 md:w-48 md:h-32 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300"
                    >
                        <span className="font-tech text-gray-500">SPONSOR 0{i}</span>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
*/}
// --- NEW COMPONENT: ABOUT US ---
const AboutSection = () => (
    <div id="about-section" className="max-w-3xl mx-auto text-center px-6 mt-20 mb-32 relative z-20">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-8 border-l-2 border-r-2 border-red-900/50 bg-black/40 backdrop-blur-sm"
        >
            <h3 className="text-red-500 font-tech mb-4 tracking-widest uppercase">Mission Briefing</h3>
            <p className="text-gray-300 font-mono text-lg md:text-xl leading-relaxed">
                Hackquinox is a 10-hour hackathon where the brightest minds converge to close the gate. 
                We are looking for innovators, coders, and dreamers to build solutions that defy reality. 
                The Upside Down is leaking—will you answer the call?
            </p>
        </motion.div>
    </div>
);

// --- MAIN APP EXPORT ---
export default function App() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  // 1. ADD THIS NEW STATE FOR NAVBAR
    const [loading, setLoading] = useState(true); // Added loading state
  const [showNavbar, setShowNavbar] = useState(false); 
  // Add this inside your App component
const [isButtonVisible, setIsButtonVisible] = useState(true);
  
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Merriweather:wght@900&family=Share+Tech+Mono&family=Inter:wght@400;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

 const handleEnter = () => {
    // 1. Fade out the button
    setIsButtonVisible(false);

    // 2. Play Audio
    setAudioEnabled(true);
    if (typeof bgMusic !== 'undefined') bgMusic.play();
    
    // 3. Open the actual Navbar Overlay
    setShowNavbar(true); 
  };

  const scrollToTimeline = () => {
    const timelineElement = document.getElementById('timeline-section');
    if (timelineElement) {
      timelineElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#0B0B0B] min-h-screen text-white overflow-x-hidden selection:bg-red-900 selection:text-white relative font-['Inter']">
      
      <style>{`
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        .animate-scanline { animation: scanline 4s linear infinite; }
        .font-benguiat { font-family: 'Merriweather', serif; }
        .font-tech { font-family: 'Share Tech Mono', monospace; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1a0000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #880000; border-radius: 4px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      {/* Global Effects */}
      <UpsideDownCursor />
      <FilmGrain />
      <div className="fixed inset-0 z-50 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" /> 
      <BackgroundScene />

      {/* 3. NAVBAR OVERLAY (Controlled by showNavbar state) */}
      <NavbarOverlay 
          isOpen={showNavbar} 
          onClose={() => setShowNavbar(false)} 
          onOpenTerminal={() => setShowTerminal(true)}
      />

      {/* Modals */}
      <TerminalModal isOpen={showTerminal} onClose={() => setShowTerminal(false)} />
      
      <AnimatePresence>
        {audioEnabled && <VolumeAlert />}
      </AnimatePresence>

      <AnimatePresence>
        {audioEnabled && <MusicToggle />}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="h-screen flex flex-col items-center justify-center relative px-4 perspective-1000 overflow-hidden">
  
  {/* --- ANIMATED TEXT CONTAINER (Fades and Scales on Scroll) --- */}
  <motion.div 
    style={{ opacity: heroOpacity, scale: heroScale }} 
    className="text-center z-10 flex flex-col items-center"
  >
    {!audioEnabled && (
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mb-8 text-red-500 font-tech text-xs tracking-widest border border-red-900/50 px-4 py-1 rounded-full uppercase bg-black/50 backdrop-blur-sm"
      >
        ⚠ Warning: Increase Volume for Full Experience ⚠
      </motion.div>
    )}

    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, letterSpacing: '0.3em' }} transition={{ duration: 2 }} className="text-white font-benguiat mb-2 text-xl md:text-2xl uppercase tracking-widest drop-shadow-md">
      FCRIT VASHI
    </motion.p>
    
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-red-500 font-tech mb-6 text-sm uppercase tracking-[0.5em]">
      Presents
    </motion.p>
    
    <motion.h1 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, textShadow: "0 0 30px rgba(229,9,20,0.5)" }}
      transition={{ duration: 1.5, ease: "circOut" }}
      className="text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-red-600 to-red-900 font-benguiat uppercase tracking-tight leading-none mb-10 stroke-red-600"
      style={{ WebkitTextStroke: '1px rgba(229,9,20,0.3)' }}
    >
      Hackquinox<br/>
      <span className="text-lg md:text-3xl tracking-[0.3em] block mt-6 text-red-500 font-bold opacity-80">
        HACK THE UPSIDE DOWN
      </span>
    </motion.h1>

    {/* --- POWERED BY UNSTOP --- */}
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8, duration: 1 }}
      className="flex flex-col items-center gap-3 mb-12 relative z-20"
    >
      <span className="text-red-500/60 font-tech text-xs tracking-[0.4em] uppercase">
          Powered By
      </span>
      <a 
        href="https://unstop.com" 
        target="_blank" 
        rel="noreferrer"
        className="group relative hover:scale-105 transition-transform duration-300"
      >
          <div className="absolute inset-0 bg-blue-500/40 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img 
            src="Unstop.png" 
            alt="Unstop" 
            className="h-10 md:h-14 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
          />
      </a>
    </motion.div>
  </motion.div>

  {/* --- THE BUTTON (Placed OUTSIDE the scaling div to prevent shifting) --- */}
  <div className="relative z-30 mt-4">
    <AnimatePresence>
      {isButtonVisible && (
        <motion.button 
          key="start-btn"
          onClick={handleEnter}
          
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          
          // Disappears only when clicked
          exit={{ 
              opacity: 0, 
              scale: 1.5, 
              filter: "blur(20px)", 
              transition: { duration: 0.8, ease: "easeOut" } 
          }}

          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          
          className="group relative px-10 py-5 bg-transparent overflow-hidden rounded-full cursor-pointer"
        >
          <div className="absolute inset-0 w-full h-full bg-red-600/10 border border-red-600/50 group-hover:bg-red-600/20 transition-all duration-300 transform skew-x-12" />
          <div className="relative flex items-center gap-3 text-red-500 font-bold tracking-[0.2em] font-tech uppercase group-hover:text-red-400">
            <Play size={18} className="fill-current" />
            Enter The Event
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  </div>
  
  {/* --- SCROLL INDICATOR --- */}
  <motion.div 
    style={{ opacity: heroOpacity }}
    animate={{ y: [0, 10, 0] }} 
    transition={{ repeat: Infinity, duration: 2 }} 
    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-red-500/50"
  >
    <ChevronDown size={56} />
  </motion.div>
</section>

        {audioEnabled && <AboutSection />}
        
        <StoryBridge text="Strange energy spikes have been detected coming from the Upside Down..." />
        
        <section id="domains-section" className="py-20 w-full relative">
          <SectionHeading chapter="Chapter One" title="The Anomalies" subtitle="Choose your path" align="left" />
          <DomainCarousel />
        </section>

        <StoryBridge text="The Gate is opening. Time is running out to save the city..." />

        <section id="timeline-section" className="py-20 px-6 w-full relative">
           <SectionHeading chapter="Chapter Two" title="The Plan" subtitle="The Sequence of Events" align="left" />
           <div className="relative mt-20 max-w-7xl mx-auto">
              <div className="absolute top-0 left-1/2 w-1 h-full bg-red-900/30 -translate-x-1/2 hidden md:block">
                 <div className="w-full h-full bg-red-600/50 animate-pulse shadow-[0_0_20px_#E50914]" />
              </div>
              <div className="absolute top-0 left-4 w-0.5 h-full bg-red-900/50 md:hidden" />
             <div className="space-y-24 md:space-y-32">
                <TimelineItem 
                    time="15TH JAN" 
                    title="The Portal Opens" 
                    desc="Registration Begins. Gather your party." 
                    align="left" 
                />
                <TimelineItem 
                    time="25TH JAN" 
                    title="Gate Seals" 
                    desc="Registration Closes. No new entries allowed." 
                    align="right" 
                />
                <TimelineItem 
                    time="1ST FEB" 
                    title="The Chosen Few" 
                    desc="Round 1 Results Announced. Who will enter the Upside Down?" 
                    align="left" 
                />
               {/* 1. THE HACKATHON (Top 20 Teams) */}
                <TimelineItem 
                    time="6TH FEB" 
                    title="Operation: Close The Gate" 
                    desc="The Top 20 Squads descend into the arena. 10 hours to engineer the ultimate weapon and seal the breach." 
                    align="right" 
                />

                {/* 2. THE FINAL 8 (Presentations) */}
                <TimelineItem 
                    time="7TH FEB" 
                    title="The Final Stand" 
                    desc="Only the elite 8 survive the night. Present your defense strategy to the High Council." 
                    align="left" 
                />
              </div>
           </div>
        </section>

        <StoryBridge text="Only the brave will be rewarded for their efforts in the darkness..." />

       {/* --- FIXED PRIZES SECTION --- */}
         <section id="prizes-section" className="py-20 px-6 w-full relative overflow-hidden">
           {/* Background Image */}
          
           <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-transparent to-[#0B0B0B] pointer-events-none" />

           <SectionHeading chapter="Chapter Three" title="Spoils of War" subtitle="Rewards" align="left" />

           <div className="flex flex-col md:flex-row justify-center items-end gap-12 mb-24 w-full relative z-10 max-w-7xl mx-auto pt-10">

  <PrizeCard
    rank={2}
    title="2nd Place"
    prize="₹15,000"
    color="silver"
    scale={0.9}
    className="order-2 md:order-1"
  />

  <PrizeCard
    rank={1}
    title="1st Place"
    prize="₹25,000"
    color="yellow"
    scale={1.1}
    className="order-1 md:order-2"
  />

  <PrizeCard
    rank={3}
    title="3rd Place"
    prize="₹10,000"
    color="bronze"
    scale={0.9}
    className="order-3 md:order-3"
  />

</div>


           <div className="bg-gradient-to-r from-red-900/10 via-red-900/30 to-red-900/10 border-y border-red-900/50 p-12 text-center w-full mx-auto rounded-3xl backdrop-blur-sm relative z-10 max-w-6xl">
              <h3 className="text-3xl font-benguiat text-white mb-8">Participant Goodies</h3>
              <div className="flex flex-wrap justify-center gap-12 text-gray-300 font-tech text-lg tracking-widest uppercase">
                 
                 <div className="flex items-center gap-3"><Star className="text-red-500" /> Sticker Pack</div>
  <div className="flex items-center gap-3"><Gift className="text-red-500" /> Digital Certificate</div>
  <div className="flex items-center gap-3"><Zap className="text-red-500" /> Hosting Credits</div>
  <div className="flex items-center gap-3"><Ticket className="text-red-500" /> Snacks</div>
  {/* The "Much More" item */}
  <div className="flex items-center gap-3 font-medium">
  <PlusCircle className="text-red-500" /> & many more!
</div>
              </div>
           </div>
        </section>
        

        <section className="py-32 px-6 w-full relative">
           <div className="w-full relative overflow-hidden group rounded-3xl text-center shadow-[0_0_50px_rgba(229,9,20,0.3)] max-w-7xl mx-auto">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2537&auto=format&fit=crop')`,
                  filter: 'grayscale(100%) contrast(1.2) brightness(0.5)' 
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-black/80 mix-blend-multiply" />
              
              <div className="relative z-10 p-12 md:p-24 flex flex-col items-center">
                <h2 className="text-5xl md:text-7xl font-benguiat text-white mb-8 drop-shadow-lg">Face The Unknown</h2>
                <p className="text-gray-300 font-mono mb-12 text-xl max-w-3xl mx-auto">
                  The gate to the Upside Down is opening. Do you have what it takes to defeat Vecna? 
                  Secure your spot in the Hackquinox before the clock strikes twelve.
                </p>
                <button 
                  onClick={() => setShowTerminal(true)}
                  className="px-16 py-6 bg-red-600/20 backdrop-blur-md text-white font-bold font-tech text-2xl tracking-widest uppercase hover:bg-white hover:text-red-900 transition-all shadow-[0_0_30px_#E50914] rounded-full border border-red-500 transform hover:scale-105"
                >
                  Join The Party
                </button>
              </div>
           </div>
        </section>
       {/* <SponsorsSection /> */}

        <div id="footer-section">
            <OrganizersFooter />
        </div>
        
      </main>
    </div>
  );
}
// --- CUSTOM CURSOR COMPONENT ---
// --- UNIQUE "HAWKINS APERTURE" CURSOR ---
const springConfig = {
  damping: 30,
  stiffness: 500,
  mass: 0.6,
};

const UpsideDownCursor = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const velocityX = useVelocity(springX);
  const velocityY = useVelocity(springY);

  // Rotation based on movement speed
  const dynamicRotate = useTransform(
    [velocityX, velocityY],
    ([vx, vy]: any) => {
      const speed = Math.hypot(vx as number, vy as number);
      return Math.min(speed / 45, 18);
    }
  );

  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device has a mouse
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsMobile(!mediaQuery.matches);

    // If it's a touch device, don't even add listeners
    if (!mediaQuery.matches) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const detectHover = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      setHovering(
        Boolean(target.closest("button, a, input, .cursor-pointer"))
      );
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", detectHover);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", detectHover);
    };
  }, [visible, x, y]);

  // Completely kill rendering on mobile or before first movement
  if (isMobile || !visible) return null;

  return (
    <div className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block">
      
      {/* CORE DOT */}
      <motion.div
        className="absolute w-2 h-2 bg-red-500 rounded-full shadow-[0_0_15px_#ff0000]"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* OUTER APERTURE */}
      <motion.div
        className="absolute"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          rotate: dynamicRotate,
        }}
      >
        <motion.div
          animate={{
            scale: hovering ? 1.3 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="relative w-12 h-12"
        >
          {/* SPINNING ARC 1 (Outer) */}
          <motion.div
            className={`absolute inset-0 rounded-full border-t-2 ${
              hovering
                ? "border-white shadow-[0_0_15px_white]"
                : "border-red-600"
            }`}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: hovering ? 0.8 : 4,
              ease: "linear",
            }}
          />

          {/* SPINNING ARC 2 (Inner) */}
          <motion.div
            className={`absolute inset-2 rounded-full border-r-2 ${
              hovering ? "border-white" : "border-red-900"
            }`}
            animate={{ rotate: -360 }}
            transition={{
              repeat: Infinity,
              duration: hovering ? 1.2 : 6,
              ease: "linear",
            }}
          />

          {/* TARGET CROSSHAIR */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: hovering ? 1 : 0,
              scale: hovering ? 1 : 0.5,
            }}
            className="absolute inset-0"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-white" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-white" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-2 bg-white" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-2 bg-white" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};


/*
  // --- INSTALLATION COMMANDS ---
  
  // 1. Core Dependencies (Animations, 3D, Icons):
  // npm install framer-motion three lucide-react

  // 2. Tailwind CSS (Styling):
  // npm install -D tailwindcss postcss autoprefixer
  // npx tailwindcss init -p

  // 3. Start Server:
  // npm run dev
*/