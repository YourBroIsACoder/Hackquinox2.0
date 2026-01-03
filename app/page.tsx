"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { 
  Terminal, Code2, Cpu, Globe, Users, Zap, 
  Layers, Ghost, Radio, ChevronDown, Github, Linkedin, 
  Play, X, Wifi, ShieldAlert, Database, Lock,
  Calendar, Clock, Trophy, Gift, Star, Ticket, ArrowRight, ArrowLeft,Briefcase
} from 'lucide-react';
import { Volume2, VolumeX } from 'lucide-react';

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
      
      {/* Tooltip Effect */}
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/90 text-red-500 text-xs font-tech tracking-widest px-3 py-1 rounded border border-red-900/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {isPlaying ? "MUTE SYSTEM AUDIO" : "ENABLE SYSTEM AUDIO"}
      </span>
    </motion.button>
  );
};

// --- AUDIO SYSTEM (Local File Support) ---
// --- AUDIO SYSTEM (Upgraded) ---
// --- AUDIO SYSTEM (TypeScript Fixed) ---
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

// Usage: Create the instance with your file path
// Ensure 'theme.mp3' is inside your 'public' folder!
const bgMusic = new AudioController('/stranger-things-124008.mp3');

// --- 3D BACKGROUND (Vanilla Three.js) ---
const BackgroundScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#1a0505', 0.02); 
    
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 2. Stars
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

    // 3. Spores
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

    // 4. Interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event) => {
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

    let frameId;
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
    <div className="fixed inset-0 z-0">
        {/* Main Background Image - RESTORED TO ORIGINAL NETFLIX PHOTO */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-hard-light transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url('https://occ-0-8407-2219.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABU9nCvqLHP6-u6xb9XolIr_dLpbDlja1JeWWRWHMSJerkJWZUvdtyRkctC2RoreaCERA3bel1S0XoT2dumHO3WUsxrfAh0APUwXX.jpg?r=00f')`, 
            filter: 'contrast(1.3) brightness(0.6) sepia(0.5) hue-rotate(-20deg) saturate(1.5)' 
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_#000000_90%)]" />
        <div ref={mountRef} className="absolute inset-0 mix-blend-screen" />
    </div>
  );
};

// --- STORY COMPONENTS ---

const FilmGrain = () => (
  <div className="fixed inset-0 z-[60] pointer-events-none opacity-[0.08] mix-blend-overlay"
       style={{ backgroundImage: `url("https://upload.wikimedia.org/wikipedia/commons/7/76/Noise.png")` }}>
  </div>
);

const StoryBridge = ({ text }) => {
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

const SectionHeading = ({ chapter, title, subtitle, align = "center" }) => (
  <div 
    className={`flex flex-col ${
      align === "left" 
        ? "items-start text-left pl-5 md:pl-12" // <--- Added Padding here for left align
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

// --- TERMINAL ---

const TerminalModal = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [stage, setStage] = useState(0); 
  const [teamName, setTeamName] = useState('');
  
  // --- AUDIO REFS ---
  const typingAudioRef = useRef(null);
  const lockInAudioRef = useRef(null);
  const statusAudioRef = useRef(null);

  const [members, setMembers] = useState([
    { name: '', phone: '', email: '' },
    { name: '', phone: '', email: '' },
    { name: '', phone: '', email: '' },
    { name: '', phone: '', email: '' }
  ]);

  const fullText = "> CONNECTING TO FCRIT_SERVER_NODE_1...\n> VERIFYING PARTICIPANT ID...\n> ACCESS GRANTED.\n\nWELCOME TO HACKQUINOX 2.0\nINITIALIZE TEAM PROTOCOLS:";
  
  useEffect(() => {
    // 1. Typing
    if (!typingAudioRef.current) {
        typingAudioRef.current = new Audio('/keyboard.mp3'); 
        typingAudioRef.current.loop = true;
        typingAudioRef.current.volume = 0.6; 
    }
    // 2. Lock-In
    if (!lockInAudioRef.current) {
        lockInAudioRef.current = new Audio('/lock-in.mp3'); 
        lockInAudioRef.current.volume = 1.0;
    }
    // 3. Status/Game Sound
    if (!statusAudioRef.current) {
        statusAudioRef.current = new Audio('/bg.mp3'); 
        statusAudioRef.current.volume = 0.6; 
    }
  }, []);

  useEffect(() => {
    // STAGE 0: TYPING
    if (isOpen && stage === 0) {
      bgMusic.fadeVolume(0.1, 0.5); 
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
          currentIndex++;
        } else {
          clearInterval(interval);
          setStage(1);
          if (typingAudioRef.current) typingAudioRef.current.pause();
          bgMusic.fadeVolume(0.4, 2.0); 
        }
      }, 30); 

      return () => {
        clearInterval(interval);
        if (typingAudioRef.current) typingAudioRef.current.pause();
      };
    } 
    
    // STAGE 2: READY SEQUENCE
    else if (isOpen && stage === 2) {
        const staggerDelay = 200; 
        const initialDelay = 500; 
        const vecnaAppearanceTime = 2000; 

        // Player Sounds
        const timers = members.map((_, index) => {
            return setTimeout(() => {
                if (statusAudioRef.current) {
                    statusAudioRef.current.currentTime = 0; 
                    statusAudioRef.current.play().catch(() => {});
                }
            }, initialDelay + (index * staggerDelay));
        });

        // Force Stop Audio at Vecna Appearance
        const stopTimer = setTimeout(() => {
            if (statusAudioRef.current) {
                statusAudioRef.current.pause();
                statusAudioRef.current.currentTime = 0;
            }
        }, vecnaAppearanceTime);

        return () => {
            timers.forEach(t => clearTimeout(t));
            clearTimeout(stopTimer);
        };
    }

    // RESET
    else if (!isOpen) {
      setText('');
      setStage(0);
      setTeamName('');
      setMembers(Array(4).fill({ name: '', phone: '', email: '' }));
      bgMusic.fadeVolume(0.4, 1.0);
      if (typingAudioRef.current) typingAudioRef.current.pause();
      if (statusAudioRef.current) statusAudioRef.current.pause();
    }
  }, [isOpen, stage]);

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lockInAudioRef.current) {
        lockInAudioRef.current.currentTime = 0;
        lockInAudioRef.current.play();
    }
    setStage(2);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
      >
        <div className="w-full max-w-6xl bg-black border border-red-800 rounded-3xl p-6 font-mono relative overflow-hidden shadow-[0_0_80px_rgba(229,9,20,0.3)] h-[90vh] flex flex-col">
          
          <div 
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ 
              backgroundImage: `url('https://i.pinimg.com/736x/dd/f9/32/ddf932385822e1753776a977f8cc7b5a.jpg')`,
              filter: 'contrast(1.2) brightness(0.6) sepia(1) hue-rotate(-50deg)',
              opacity: 0.4 
            }}
          />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20 pointer-events-none z-20" />
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20 animate-scanline pointer-events-none z-20" />

          <div className="flex justify-between items-center mb-6 border-b border-red-900 pb-2 flex-shrink-0 z-30 relative">
            <span className="text-red-500 text-xs tracking-widest">TERMINAL V.2.0 // REG_SYS</span>
            <button onClick={onClose} className="text-red-700 hover:text-red-400 transition-colors bg-red-900/10 p-1 rounded-full">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 custom-scrollbar pr-2">
            
            {(stage === 0 || stage === 1) && (
              <>
                <div className="text-red-500 whitespace-pre-wrap min-h-[100px] text-sm md:text-base leading-relaxed mb-6">
                  {text}
                  {stage === 0 && <span className="animate-pulse">_</span>}
                </div>

                {stage === 1 && (
                  <motion.form 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-8 pb-8"
                  >
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

                    <button type="submit" className="mt-4 bg-red-900/20 border border-red-600 text-red-400 py-4 hover:bg-red-600/30 hover:text-white hover:backdrop-blur-md transition-all duration-300 font-bold tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(229,9,20,0.1)] hover:shadow-[0_0_30px_rgba(229,9,20,0.6)] rounded-xl backdrop-blur-sm">
                      &gt; INITIATE HACK SEQUENCE
                    </button>
                  </motion.form>
                )}
              </>
            )}

            {stage === 2 && (
              <div className="flex flex-col items-center justify-center min-h-full py-10 space-y-6 text-center select-none">
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md border-b-2 border-red-500 pb-4 mb-4">
                    <h2 className="text-2xl md:text-3xl text-red-400 font-black tracking-widest uppercase">SQUADRON: {teamName}</h2>
                 </motion.div>

                 <div className="space-y-4 w-full max-w-lg">
                  {members.map((m, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (i * 0.2), type: 'spring' }} 
                      className="flex items-center justify-between border-l-4 border-red-600 bg-red-900/40 backdrop-blur-md p-4 rounded-r-xl"
                    >
                      <div className="text-left">
                        <span className="block text-xs text-red-600 tracking-widest font-bold">PLAYER 0{i + 1}</span>
                        <span className="text-lg text-red-300 font-bold uppercase">{m.name || 'UNKNOWN'}</span>
                      </div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + (i * 0.2) + 0.1 }}
                        className="text-red-500 font-black tracking-widest bg-red-900/30 px-3 py-1 rounded border border-red-500/30 shadow-[0_0_10px_rgba(229,9,20,0.4)]"
                      >
                        READY
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
                 
                 {/* --- VECNA DOSSIER SECTION --- */}
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 2.0, type: 'spring' }} 
                   className="mt-12 p-6 border-2 border-red-600 bg-red-950/60 backdrop-blur-lg relative overflow-hidden group rounded-2xl w-full max-w-xl"
                 >
                   <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none" />
                   
                   {/* STRATEGICALLY PLACED IMAGE */}
                   <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-lg overflow-hidden border-2 border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                        {/* Red Overlay Effect */}
                        <div className="absolute inset-0 bg-red-500/30 mix-blend-multiply z-10" />
                        {/* Scanline Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-20 pointer-events-none" />
                        
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Vecna_%28Stranger_Things%29.jpg/250px-Vecna_%28Stranger_Things%29.jpg" 
                            alt="Vecna" 
                            className="object-cover w-full h-full grayscale contrast-125"
                        />
                   </div>

                   <h3 className="text-red-500 font-black text-xl md:text-3xl uppercase tracking-widest mb-2 drop-shadow-lg">
                     ⚠ TARGET LOCKED: VECNA
                   </h3>
                   <p className="text-red-400 font-mono text-sm tracking-wider">
                     THE GATE IS OPEN. SEE YOU ON THE OTHER SIDE.
                   </p>
                 </motion.div>

                 <motion.button 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  onClick={onClose}
                  className="mt-8 text-red-600 hover:text-red-300 underline underline-offset-4 font-mono text-sm uppercase"
                >
                  [CLOSE TERMINAL]
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
// --- DOMAIN CAROUSEL ---

const tracks = [
  { 
    title: "Shadow Tech", 
    desc: "AI/ML solutions to detect anomalies in data streams.", 
    // Image: Red lightning storm (resembling the Mind Flayer/Red Sky)
    image: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=2671&auto=format&fit=crop" 
  }, 
  { 
    title: "Void Comm", 
    desc: "Mesh networking apps for offline communication.", 
    // Image: Dark, reflective black water (resembling Eleven's Void)
    image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2674&auto=format&fit=crop" 
  }, 
  { 
    title: "Mind Block", 
    desc: "Cybersecurity defense against brute-force attacks.", 
    // Image: Retro sci-fi control panel (resembling Hawkins Lab)
    image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2670&auto=format&fit=crop" 
  }, 
  { 
    title: "Hive Data", 
    desc: "Distributed storage for massive paranormal datasets.", 
    // Image: Red organic nerve/root texture (resembling the Hive Mind vines)
    image: "https://images.unsplash.com/photo-1618193139062-2c5bf4f935b7?q=80&w=2670&auto=format&fit=crop" 
  }, 
  { 
    title: "Portal Dev", 
    desc: "Full-stack gateways linking our world to the next.", 
    // Image: Glowing orange/red light in darkness (resembling The Gate)
    image: "https://images.unsplash.com/photo-1542256844-311b7029598a?q=80&w=2669&auto=format&fit=crop" 
  }, 
  { 
    title: "Strange Matter", 
    desc: "Open innovation and hardware to close the gate.", 
    // Image: Spooky blue misty forest (resembling the Upside Down)
    image: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=2755&auto=format&fit=crop" 
  }, 
];

const TrackCard = ({ image, title, desc, position, onClick }) => {
  // Enhanced variants for smoother "Cover Flow" feel
  const variants = {
    center: { x: "0%", scale: 1, zIndex: 50, opacity: 1, filter: "blur(0px) brightness(1)", rotateY: 0 },
    left1: { x: "-50%", scale: 0.8, zIndex: 30, opacity: 0.7, filter: "blur(2px) brightness(0.6)", rotateY: 25 },
    right1: { x: "50%", scale: 0.8, zIndex: 30, opacity: 0.7, filter: "blur(2px) brightness(0.6)", rotateY: -25 },
    left2: { x: "-90%", scale: 0.6, zIndex: 10, opacity: 0.4, filter: "blur(5px) brightness(0.4)", rotateY: 45 },
    right2: { x: "90%", scale: 0.6, zIndex: 10, opacity: 0.4, filter: "blur(5px) brightness(0.4)", rotateY: -45 },
    hidden: { x: "0%", scale: 0.2, zIndex: 0, opacity: 0, filter: "blur(10px) brightness(0)", rotateY: 0 },
  };

  const getVariant = () => {
    if (position === 0) return "center";
    if (position === -1) return "left1";
    if (position === 1) return "right1";
    if (position === -2) return "left2";
    if (position === 2) return "right2";
    return "hidden";
  };

  return (
    <motion.div
      animate={getVariant()}
      variants={variants}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }} // Smooth ease-out-quad
      onClick={onClick}
      className="absolute top-1/2 left-1/2 w-[350px] md:w-[600px] h-[400px] md:h-[450px] -translate-x-1/2 -translate-y-1/2 border border-red-900/50 bg-gray-900 backdrop-blur-md overflow-hidden rounded-2xl flex flex-col shadow-2xl cursor-pointer"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Background Image with Fallback Color */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 bg-gray-900"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-8 gap-4">
        <h3 className="text-3xl md:text-5xl font-bold text-white font-benguiat drop-shadow-[0_4px_8px_rgba(0,0,0,1)] border-b-4 border-red-600 pb-4 inline-block w-fit">
          {title}
        </h3>
        <motion.p 
          animate={{ opacity: position === 0 ? 1 : 0 }}
          className="text-gray-100 font-mono text-sm md:text-lg leading-relaxed bg-black/50 p-4 rounded-lg backdrop-blur-sm border-l-2 border-red-500"
        >
          {desc}
        </motion.p>
      </div>
    </motion.div>
  );
};

const DomainCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tracks.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextTrack = () => setActiveIndex((prev) => (prev + 1) % tracks.length);
  const prevTrack = () => setActiveIndex((prev) => (prev - 1 + tracks.length) % tracks.length);

  // Circular logic to determine position relative to active index
  // Returns integers like -2, -1, 0, 1, 2
  const getPosition = (index) => {
    const len = tracks.length;
    let offset = (index - activeIndex + len) % len;
    if (offset > len / 2) offset -= len;
    return offset;
  };

  return (
    <div 
      className="relative w-full flex flex-col items-center justify-center py-20 overflow-hidden min-h-[700px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 3D Perspective Container */}
      <div className="relative h-[500px] w-full max-w-6xl mx-auto flex items-center justify-center perspective-1000" style={{ perspective: '1000px' }}>
        {tracks.map((track, index) => (
          <TrackCard 
            key={index} 
            {...track} 
            position={getPosition(index)}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-12 mt-12 z-50">
        <button onClick={prevTrack} className="p-4 rounded-full bg-red-950/50 border border-red-600 text-white hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-[0_0_20px_rgba(229,9,20,0.3)]">
          <ArrowLeft size={36} />
        </button>
        <button onClick={nextTrack} className="p-4 rounded-full bg-red-950/50 border border-red-600 text-white hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-[0_0_20px_rgba(229,9,20,0.3)]">
          <ArrowRight size={36} />
        </button>
      </div>
    </div>
  );
};

const TimelineItem = ({ time, title, desc, align }) => (
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
         
         {/* Decorative Glowing Dots */}
         <div className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-black border-2 border-red-600 shadow-[0_0_15px_#E50914] rounded-full hidden md:flex items-center justify-center ${align === 'right' ? '-left-[59px]' : '-right-[59px]'}`}>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
         </div>
      </motion.div>
    </div>
    
    <div className="relative flex flex-col items-center justify-center shrink-0 md:hidden">
      <div className="w-4 h-4 rounded-full bg-red-600 shadow-[0_0_15px_#E50914] z-10" />
    </div>
    
    <div className={`flex-1 text-center ${align === 'right' ? 'md:text-right' : 'md:text-left'}`}>
      {/* --- UPDATED SIZE HERE --- */}
      <span className="font-tech text-4xl md:text-6xl text-white font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 drop-shadow-[0_0_10px_rgba(229,9,20,0.5)]">
        {time}
      </span>
    </div>
  </motion.div>
);

const PrizeCard = ({ rank, title, prize, color, scale = 1 }) => {
  // Map simple color names to specific Tailwind colors for shadows/glows
  const themeColor = color === 'yellow' ? 'text-yellow-400' : (rank === 2 ? 'text-gray-300' : 'text-orange-700');
  const glowColor = color === 'yellow' ? 'rgba(234, 179, 8, 0.6)' : (rank === 2 ? 'rgba(209, 213, 219, 0.4)' : 'rgba(194, 65, 12, 0.5)');
  const borderColor = color === 'yellow' ? 'border-yellow-500/50' : (rank === 2 ? 'border-gray-400/50' : 'border-orange-700/50');

  return (
    <motion.div 
      initial={{ y: 0 }}
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: rank * 0.8 }}
      whileHover={{ scale: scale * 1.05, y: -30 }}
      className={`relative group flex flex-col items-center w-full md:w-1/3 min-h-[500px] rounded-sm transition-all duration-500`}
      style={{ transform: `scale(${scale})`, zIndex: rank === 1 ? 50 : 20 }}
    >
      
      {/* 1. The "Containment Field" Background */}
      <div className={`absolute inset-0 bg-gray-900/90 backdrop-blur-xl border ${borderColor} clip-path-polygon shadow-2xl overflow-hidden`}>
        {/* Grid Texture Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
        
        {/* Massive Rank Watermark */}
        <span className={`absolute -right-4 -bottom-16 text-[12rem] font-black text-white/5 font-serif select-none leading-none z-0 group-hover:text-white/10 transition-colors duration-500`}>
          0{rank}
        </span>

        {/* Top Glowing "Portal" Light */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-red-900/40 to-transparent opacity-50" />
      </div>

      {/* 2. Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-full p-8">
        
        {/* Trophy Section with "Energy Field" */}
        <div className="relative mt-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-0 blur-2xl opacity-40 rounded-full`}
            style={{ backgroundColor: glowColor }}
          />
          <div className="relative z-10 p-6 bg-black/50 border border-white/10 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md group-hover:border-white/30 transition-colors">
            <Trophy size={48} className={`${themeColor} drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`} />
          </div>
        </div>

        {/* Text Details */}
        <div className="text-center mt-6 space-y-2">
            <h3 className="text-2xl font-serif text-gray-300 uppercase tracking-widest">{title}</h3>
            
            {/* Glitchy/Tech Prize Amount */}
            <div className="relative py-2">
                <div className={`text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500 drop-shadow-lg font-mono tracking-tighter`}>
                {prize}
                </div>
                <div className={`absolute -inset-1 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300`} style={{ backgroundColor: glowColor }} />
            </div>
        </div>

        {/* Data/Perks List - Styled as "System Logs" */}
        <div className="w-full mt-8 pt-6 border-t border-dashed border-white/20">
          <ul className="space-y-4 font-mono text-sm text-gray-400">
            <PerkItem icon={Star} text="Certificate of Valor" delay={0.1} />
            <PerkItem icon={Gift} text="Exclusive Swag Kit" delay={0.2} />
            <PerkItem icon={Briefcase} text="Interview Fast-Track" delay={0.3} />
          </ul>
        </div>
      </div>

      {/* 3. The "Scanner" Line Effect on Hover */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-1 bg-white/50 shadow-[0_0_20px_rgba(255,255,255,0.8)] z-50 pointer-events-none opacity-0 group-hover:opacity-100"
        initial={{ y: -10 }}
        whileHover={{ y: 500 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
};

// Helper for animated list items
const PerkItem = ({ icon: Icon, text, delay }) => (
  <motion.li 
    initial={{ x: -10, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    transition={{ delay }}
    className="flex items-center gap-3 group/item"
  >
    <div className="p-1.5 rounded-sm bg-red-900/30 text-red-400 group-hover/item:bg-red-600 group-hover/item:text-white transition-colors duration-300">
      <Icon size={14} />
    </div>
    <span className="uppercase tracking-wider text-xs md:text-sm group-hover/item:text-gray-200 transition-colors">
      {text}
    </span>
  </motion.li>
);



// --- MAIN APPLICATION ---

export default function App() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  useEffect(() => {
    // Inject fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Merriweather:wght@900&family=Share+Tech+Mono&family=Inter:wght@400;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleEnter = () => {
    setAudioEnabled(true);
    bgMusic.play();
  };

  const scrollToTimeline = () => {
    const timelineElement = document.getElementById('timeline-section');
    if (timelineElement) {
      timelineElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#0B0B0B] min-h-screen text-white overflow-x-hidden selection:bg-red-900 selection:text-white relative font-['Inter']">
      
      {/* 1. Global Effects */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .animate-scanline {
          animation: scanline 4s linear infinite;
        }
        .font-benguiat { font-family: 'Merriweather', serif; }
        .font-tech { font-family: 'Share Tech Mono', monospace; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1a0000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #880000; border-radius: 4px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 2. CRT/VHS Overlay + Film Grain */}
      <FilmGrain />
      <div className="fixed inset-0 z-50 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-10" />
      <div className="fixed inset-0 z-50 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)]" /> 

      {/* 3. Background */}
      <BackgroundScene />

      {/* 4. Modals */}
      <TerminalModal isOpen={showTerminal} onClose={() => setShowTerminal(false)} />
      <AnimatePresence>
        {audioEnabled && <MusicToggle />}
      </AnimatePresence>

      {/* 5. Main Content */}
      <main className="relative z-10">
        
        {/* HERO */}
        <section className="h-screen flex flex-col items-center justify-center relative px-4 perspective-1000">
          <motion.div 
            style={{ opacity: heroOpacity, scale: heroScale }} 
            className="text-center z-10 flex flex-col items-center"
          >
            {/* Audio Toggle / Status */}
            {!audioEnabled && (
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-8 text-red-500 font-tech text-xs tracking-widest border border-red-900/50 px-4 py-1 rounded-full uppercase bg-black/50 backdrop-blur-sm"
              >
                ⚠ Warning: Audio Hardware Detection Pending
              </motion.div>
            )}

            <motion.p 
              initial={{ opacity: 0, letterSpacing: '0em' }}
              animate={{ opacity: 1, letterSpacing: '0.3em' }}
              transition={{ duration: 2 }}
              className="text-white font-benguiat mb-2 text-xl md:text-2xl uppercase tracking-widest drop-shadow-md"
            >
              FCRIT VASHI
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-red-500 font-tech mb-6 text-sm uppercase tracking-[0.5em]"
            >
              Presents
            </motion.p>
            
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0, textShadow: "0 0 0px #000" }}
              animate={{ scale: 1, opacity: 1, textShadow: "0 0 30px rgba(229,9,20,0.5)" }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-red-600 to-red-900 font-benguiat uppercase tracking-tight leading-none mb-10 stroke-red-600"
              style={{ WebkitTextStroke: '1px rgba(229,9,20,0.3)' }}
            >
              Hackquinox<br/><span className="text-4xl md:text-7xl">2.0</span>
            </motion.h1>

            {!audioEnabled ? (
               <motion.button 
                onClick={handleEnter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-10 py-5 bg-transparent overflow-hidden rounded-full"
              >
                <div className="absolute inset-0 w-full h-full bg-red-600/10 border border-red-600/50 group-hover:bg-red-600/20 transition-all duration-300 transform skew-x-12" />
                <div className="relative flex items-center gap-3 text-red-500 font-bold tracking-[0.2em] font-tech uppercase group-hover:text-red-400">
                  <Play size={18} className="fill-current" />
                  Enter The Event
                </div>
              </motion.button>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col md:flex-row gap-6 mt-4"
              >
                <button 
                  onClick={() => setShowTerminal(true)}
                  className="px-8 py-4 bg-red-600 text-black font-bold tracking-widest hover:bg-red-500 hover:shadow-[0_0_30px_rgba(229,9,20,0.6)] transition-all duration-300 uppercase font-tech rounded-full"
                >
                  Register Now
                </button>
                <button 
                  onClick={scrollToTimeline}
                  className="px-8 py-4 border border-gray-700 text-gray-400 font-bold tracking-widest hover:border-red-500 hover:text-red-500 transition-all duration-300 uppercase font-tech backdrop-blur-sm rounded-full"
                >
                  View Timeline
                </button>
              </motion.div>
            )}
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-red-500/50"
          >
            <ChevronDown size={32} />
          </motion.div>
        </section>

        {/* NARRATIVE BRIDGE 1 */}
        <StoryBridge text="Strange energy spikes have been detected coming from the Upside Down..." />

        {/* PROBLEM STATEMENTS CAROUSEL */}
        <section className="py-20 w-full relative">
          <SectionHeading chapter="Chapter One" title="The Anomalies" subtitle="Choose your path" align="left" />
          <DomainCarousel />
        </section>

        {/* NARRATIVE BRIDGE 2 */}
        <StoryBridge text="The Gate is opening. Time is running out to save the city..." />

        {/* TIMELINE SECTION */}
        <section id="timeline-section" className="py-20 px-6 w-full relative">
           <SectionHeading chapter="Chapter Two" title="The Plan" subtitle="The Sequence of Events" align="left" />
           
           <div className="relative mt-20 max-w-7xl mx-auto">
              {/* Vertical Line */}
              <div className="absolute top-0 left-1/2 w-1 h-full bg-red-900/30 -translate-x-1/2 hidden md:block">
                 <div className="w-full h-full bg-red-600/50 animate-pulse shadow-[0_0_20px_#E50914]" />
              </div>
              <div className="absolute top-0 left-4 w-0.5 h-full bg-red-900/50 md:hidden" />
              
              <div className="space-y-24 md:space-y-32">
                <TimelineItem time="09:00 AM" title="The Gathering" desc="Opening Ceremony & Problem Statement Reveal" align="left" />
                <TimelineItem time="11:00 AM" title="Hacking Begins" desc="Gateway Opens. Teams start building." align="right" />
                <TimelineItem time="04:00 PM" title="Mentoring Phase 1" desc="Expert guidance from the Upside Down." align="left" />
                <TimelineItem time="09:00 PM" title="Dinner Break" desc="Refuel before the night shift." align="right" />
                <TimelineItem time="08:00 AM" title="Final Submission" desc="Close the gate before it's too late." align="left" />
              </div>
           </div>
        </section>

        {/* NARRATIVE BRIDGE 3 */}
        <StoryBridge text="Only the brave will be rewarded for their efforts in the darkness..." />

        {/* PRIZES SECTION */}
        <section className="py-20 px-6 w-full relative overflow-hidden">
           {/* Background Image: Retro Crew/Friends (Unsplash) */}
           <div 
              className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2670&auto=format&fit=crop')` }}
           />
           <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-transparent to-[#0B0B0B] pointer-events-none" />

           <SectionHeading chapter="Chapter Three" title="Spoils of War" subtitle="Rewards" align="left" />

           <div className="flex flex-col md:flex-row justify-center items-end gap-12 mb-24 w-full relative z-10 max-w-7xl mx-auto">
              <PrizeCard rank={2} title="2nd Place" prize="₹15,000" color="red" scale={0.9} />
              <PrizeCard rank={1} title="1st Place" prize="₹25,000" color="yellow" scale={1.1} />
              <PrizeCard rank={3} title="3rd Place" prize="₹10,000" color="red" scale={0.9} />
           </div>

           <div className="bg-gradient-to-r from-red-900/10 via-red-900/30 to-red-900/10 border-y border-red-900/50 p-12 text-center w-full mx-auto rounded-3xl backdrop-blur-sm relative z-10 max-w-6xl">
              <h3 className="text-3xl font-benguiat text-white mb-8">Participant Goodies</h3>
              <div className="flex flex-wrap justify-center gap-12 text-gray-300 font-tech text-lg tracking-widest uppercase">
                 <div className="flex items-center gap-3"><Ticket className="text-red-500" /> Event T-Shirt</div>
                 <div className="flex items-center gap-3"><Star className="text-red-500" /> Sticker Pack</div>
                 <div className="flex items-center gap-3"><Gift className="text-red-500" /> Digital Certificate</div>
                 <div className="flex items-center gap-3"><Zap className="text-red-500" /> Hosting Credits</div>
              </div>
           </div>
        </section>

        {/* REGISTRATION CTA */}
        <section className="py-32 px-6 w-full relative">
           {/* Background Container with "Villain" aesthetic (Unsplash) */}
           <div className="w-full relative overflow-hidden group rounded-3xl text-center shadow-[0_0_50px_rgba(229,9,20,0.3)] max-w-7xl mx-auto">
              {/* Image Layer */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2537&auto=format&fit=crop')`,
                  filter: 'grayscale(100%) contrast(1.2) brightness(0.5)' // Make it dark/scary
                }}
              />
              {/* Red Overlay Gradient */}
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

        {/* ORGANIZERS FOOTER */}
        <OrganizersFooter />
      </main>
    </div>
    
  );
  
}
// --- FOOTER COMPONENTS ---

// --- FOOTER COMPONENTS (Paste this at the very bottom of your file) ---

const OrganizersFooter = () => {
  return (
    <footer className="relative pt-40 pb-24 overflow-hidden">
      
      {/* --- ATMOSPHERIC GLOW --- */}
      <div className="absolute inset-0 pointer-events-none">
         {/* 1. Deep dark base gradient */}
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-[#0a0000]" />
         
         {/* 2. Massive Red "Pit" Glow rising from the bottom */}
         <div className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[180%] h-[100%] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-red-600/50 via-red-900/20 to-transparent blur-[150px] mix-blend-screen" />
         
         {/* 3. Subtle top rim light */}
         <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-red-900/30 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        
        {/* Stranger Things Logo */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          whileHover={{ opacity: 1, scale: 1.05, filter: "drop-shadow(0 0 20px rgba(220,38,38,0.8))" }}
          className="mb-20 inline-block cursor-pointer transition-all duration-500"
        >
           <img 
             src="https://upload.wikimedia.org/wikipedia/commons/3/38/Stranger_Things_logo.png" 
             alt="Stranger Things" 
             className="h-14 md:h-20 object-contain drop-shadow-[0_0_25px_rgba(220,38,38,0.6)]" 
           />
        </motion.div>

        {/* Section Title */}
        <div className="flex items-center justify-center gap-4 mb-20">
          <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-red-500 shadow-[0_0_10px_#ef4444]" />
          <span className="text-red-400 font-tech tracking-[0.5em] text-base uppercase drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">Orchestrated By</span>
          <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-red-500 shadow-[0_0_10px_#ef4444]" />
        </div>

        {/* 2. Floating Logos */}
        <div className="flex flex-wrap justify-center items-center gap-20 md:gap-40 mb-24">
           <ClubEntity name="CSI-COMPS" delay={0} />
           <ClubEntity name="CSI-IT" delay={1} />
           <ClubEntity name="AIDL" delay={2} />
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-12 mb-16">
          <SocialLink icon={Github} />
          <SocialLink icon={Linkedin} />
          <SocialLink icon={Globe} />
        </div>

        {/* Copyright */}
        <p className="font-mono text-red-500/70 text-sm tracking-[0.2em] uppercase drop-shadow-sm">
          FCRIT VASHI <span className="text-red-600 mx-2">//</span> 2026 <br/> HACKQUINOX 2.0
        </p>
      </div>
    </footer>
  );
};

// --- HELPER COMPONENT 1: CLUB ENTITY ---
const ClubEntity = ({ name, delay }) => (
  <motion.div 
    animate={{ y: [-10, 10, -10] }} 
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay }}
    className="group relative flex flex-col items-center justify-center"
  >
    <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)] opacity-70 group-hover:opacity-100">
       <img 
         src={`https://placehold.co/150x150/000000/FFFFFF/png?text=${name}`} 
         alt={`${name} Logo`} 
         className="w-full h-full object-contain mix-blend-screen" 
       />
    </div>
    <div className="absolute -bottom-8 w-24 h-4 bg-red-600/30 blur-xl rounded-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-x-0 group-hover:scale-x-100" />
    <span className="mt-6 font-benguiat text-gray-500 group-hover:text-red-500 tracking-widest transition-colors duration-300">
      {name}
    </span>
  </motion.div>
);

// --- HELPER COMPONENT 2: SOCIAL LINK ---
const SocialLink = ({ icon: Icon }) => (
  <a href="#" className="text-gray-600 hover:text-white transition-colors duration-300 group relative">
    <Icon size={24} />
    <span className="absolute -inset-2 bg-red-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
  </a>
);
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