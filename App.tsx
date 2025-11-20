/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Wallet, Globe, Cpu, Network, TrendingUp, Menu, X, Layers, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import PortfolioCard from './components/ArtistCard'; // We are reusing the component file but logic is updated
import AIChat from './components/AIChat';
import { Company } from './types';

// UZ Capital Portfolio
const PORTFOLIO: Company[] = [
  { 
    id: '1', 
    name: 'Nexus Protocol', 
    sector: 'DeFi Infrastructure', 
    stage: 'Series A', 
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop',
    description: 'A cross-chain liquidity aggregator enabling seamless asset transfers between Layer 1 and Layer 2 networks with zero slippage assurance.'
  },
  { 
    id: '2', 
    name: 'EtherScale', 
    sector: 'L2 Scaling', 
    stage: 'Seed', 
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop',
    description: 'ZK-Rollup solution designed for high-frequency trading platforms, reducing gas fees by 99% while inheriting mainnet security.'
  },
  { 
    id: '3', 
    name: 'MetaVault', 
    sector: 'Asset Management', 
    stage: 'Seed', 
    image: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=2832&auto=format&fit=crop',
    description: 'Institutional-grade custody and yield generation platform utilizing AI-driven strategies to optimize returns on dormant crypto assets.'
  },
  { 
    id: '4', 
    name: 'BlockIdentity', 
    sector: 'Digital Identity', 
    stage: 'Series B', 
    image: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=2600&auto=format&fit=crop',
    description: 'Sovereign decentralized identity (DID) protocol allowing users to own their data across Web3 applications without centralized intermediaries.'
  },
  { 
    id: '5', 
    name: 'Zenith Chain', 
    sector: 'Blockchain Infra', 
    stage: 'Incubation', 
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2600&auto=format&fit=crop',
    description: 'Modular blockchain architecture separating consensus, execution, and data availability to power the next generation of dApps.'
  },
  { 
    id: '6', 
    name: 'Cipher Labs', 
    sector: 'Security Auditing', 
    stage: 'Growth', 
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2600&auto=format&fit=crop',
    description: 'AI-powered smart contract auditing firm providing real-time threat monitoring and automated bug bounties for DeFi protocols.'
  },
];

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  const [purchasingIndex, setPurchasingIndex] = useState<number | null>(null);
  const [purchasedIndex, setPurchasedIndex] = useState<number | null>(null);

  // Handle keyboard navigation for company modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCompany) return;
      if (e.key === 'ArrowLeft') navigateCompany('prev');
      if (e.key === 'ArrowRight') navigateCompany('next');
      if (e.key === 'Escape') setSelectedCompany(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCompany]);

  const handleInquiry = (index: number) => {
    setPurchasingIndex(index);
    setTimeout(() => {
      setPurchasingIndex(null);
      setPurchasedIndex(index);
    }, 2000);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navigateCompany = (direction: 'next' | 'prev') => {
    if (!selectedCompany) return;
    const currentIndex = PORTFOLIO.findIndex(c => c.id === selectedCompany.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % PORTFOLIO.length;
    } else {
      nextIndex = (currentIndex - 1 + PORTFOLIO.length) % PORTFOLIO.length;
    }
    setSelectedCompany(PORTFOLIO[nextIndex]);
  };
  
  return (
    <div className="relative min-h-screen text-white selection:bg-[#00f0ff] selection:text-black cursor-auto md:cursor-none overflow-x-hidden">
      <CustomCursor />
      <FluidBackground />
      <AIChat />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6 mix-blend-difference">
        <div className="font-heading text-xl md:text-2xl font-bold tracking-tighter text-white cursor-default z-50 flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-white flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-none transform rotate-45"></div>
            </div>
            UZ CAPITAL
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-xs font-bold tracking-[0.2em] uppercase">
          {['Portfolio', 'Thesis', 'Connect'].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollToSection(item.toLowerCase())}
              className="hover:text-[#00f0ff] transition-colors text-white cursor-pointer bg-transparent border-none"
              data-hover="true"
            >
              {item}
            </button>
          ))}
        </div>
        <button 
          onClick={() => scrollToSection('connect')}
          className="hidden md:inline-block border border-white px-8 py-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300 text-white cursor-pointer bg-transparent"
          data-hover="true"
        >
          Partner With Us
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
           {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#050614]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {['Portfolio', 'Thesis', 'Connect'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-3xl font-heading font-bold text-white hover:text-[#00f0ff] transition-colors uppercase bg-transparent border-none"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('connect')}
              className="mt-8 border border-[#00f0ff] text-[#00f0ff] px-10 py-4 text-sm font-bold tracking-widest uppercase bg-transparent hover:bg-[#00f0ff] hover:text-black transition-colors"
            >
              Partner With Us
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <header className="relative h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div 
          style={{ y, opacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-6xl pb-24 md:pb-20"
        >
           {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-3 md:gap-6 text-[10px] md:text-sm font-mono text-[#00f0ff] tracking-[0.3em] uppercase mb-6 bg-[#00f0ff]/10 border border-[#00f0ff]/20 px-6 py-2 backdrop-blur-sm"
          >
            <span>Asset Management</span>
            <span className="w-1 h-1 bg-white rounded-full"/>
            <span>Incubation</span>
            <span className="w-1 h-1 bg-white rounded-full"/>
            <span>Advisory</span>
          </motion.div>

          {/* Main Title */}
          <div className="relative w-full flex justify-center items-center">
            <GradientText 
              text="UZ CAPITAL" 
              as="h1" 
              className="text-[12vw] md:text-[11vw] leading-[0.9] font-black tracking-tighter text-center" 
            />
          </div>
          
          <motion.div
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
             className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-[#2962ff] to-transparent mt-8 md:mt-12 mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-base md:text-xl font-light max-w-xl mx-auto text-gray-400 leading-relaxed px-4 tracking-wide"
          >
            Architecting the decentralized horizon. We identify, incubate, and scale the protocols defining the next era of the web.
          </motion.p>
        </motion.div>

        {/* MARQUEE - Crypto Ticker Style */}
        <div className="absolute bottom-12 md:bottom-16 left-0 w-full py-3 md:py-4 bg-[#0a0b1e] border-y border-[#2962ff]/30 z-20 overflow-hidden">
          <motion.div 
            className="flex w-fit will-change-transform"
            animate={{ x: "-50%" }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0 items-center">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <span className="text-xl md:text-2xl font-heading font-bold px-8 text-gray-500 flex items-center gap-4">
                      BLOCKCHAIN INFRASTRUCTURE <span className="text-[#00f0ff]">▲</span>
                    </span>
                    <span className="text-xl md:text-2xl font-heading font-bold px-8 text-gray-500 flex items-center gap-4">
                      DECENTRALIZED FINANCE <span className="text-[#00f0ff]">▲</span>
                    </span>
                    <span className="text-xl md:text-2xl font-heading font-bold px-8 text-gray-500 flex items-center gap-4">
                       WEB3 IDENTITY <span className="text-[#00f0ff]">▲</span>
                    </span>
                     <span className="text-xl md:text-2xl font-heading font-bold px-8 text-gray-500 flex items-center gap-4">
                       DIGITAL ASSETS <span className="text-[#00f0ff]">▲</span>
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* PORTFOLIO SECTION */}
      <section id="portfolio" className="relative z-10 py-20 md:py-32">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 px-4 border-l-2 border-[#2962ff] pl-6">
             <h2 className="text-4xl md:text-7xl font-heading font-bold uppercase leading-[0.9] text-white">
              Strategic <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#2962ff]">Portfolio</span>
            </h2>
            <p className="text-gray-400 mt-4 md:mt-0 max-w-md text-sm md:text-base">
              We back founders building fundamental layers of the ownership economy. From seed to scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/10 bg-[#050614]/50 backdrop-blur-sm">
            {PORTFOLIO.map((company) => (
              <PortfolioCard key={company.id} company={company} onClick={() => setSelectedCompany(company)} />
            ))}
          </div>
        </div>
      </section>

      {/* THESIS/EXPERIENCE SECTION */}
      <section id="thesis" className="relative z-10 py-20 md:py-32 bg-[#0a0b1e]/50 backdrop-blur-sm border-t border-white/5 overflow-hidden">
        {/* Decorative blurred circle */}
        <div className="absolute top-1/2 right-[-20%] w-[50vw] h-[50vw] bg-[#2962ff]/10 rounded-full blur-[60px] pointer-events-none will-change-transform" style={{ transform: 'translateZ(0)' }} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <h2 className="text-3xl md:text-6xl font-heading font-bold mb-6 md:mb-8 leading-tight">
                Our <br/> <GradientText text="THESIS" className="text-4xl md:text-7xl" />
              </h2>
              <p className="text-lg text-gray-400 mb-8 md:mb-12 font-light leading-relaxed">
                Web3 is not just a technology shift; it is a financial and societal paradigm shift. UZ Capital operates at the intersection of deep tech and finance to accelerate this transition.
              </p>
              
              <div className="space-y-6 md:space-y-8">
                {[
                  { icon: Network, title: 'Strategic Incubation', desc: 'Hands-on operational support from tokenomics design to go-to-market strategy.' },
                  { icon: TrendingUp, title: 'Asset Management', desc: 'Data-driven yield strategies across decentralized finance protocols.' },
                  { icon: Globe, title: 'Global Ecosystem', desc: 'Bridging the gap between Eastern and Western crypto markets.' },
                ].map((feature, i) => (
                  <div
                    key={i} 
                    className="flex items-start gap-6 group"
                  >
                    <div className="p-4 rounded-none border border-[#2962ff]/30 bg-[#2962ff]/5 group-hover:bg-[#2962ff]/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-[#00f0ff]" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold mb-1 md:mb-2 font-heading text-white">{feature.title}</h4>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 relative h-[400px] md:h-[600px] w-full order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2962ff] to-[#6200ea] rounded-none translate-x-4 translate-y-4 opacity-20" />
              <div className="relative h-full w-full bg-[#050614] border border-white/10 group overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1644088379091-d574269d422f?q=80&w=2893&auto=format&fit=crop" 
                  alt="Data Center" 
                  className="h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[1.5s] grayscale group-hover:grayscale-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050614] via-transparent to-transparent opacity-90" />
                
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                  <div className="text-5xl md:text-7xl font-heading font-bold text-white">
                    $50M+
                  </div>
                  <div className="text-sm md:text-base font-mono tracking-widest uppercase mt-2 text-[#00f0ff]">
                    Assets Under Management
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONNECT/CONTACT SECTION */}
      <section id="connect" className="relative z-10 py-20 md:py-32 px-4 md:px-6 bg-[#050614]/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
             <h2 className="text-5xl md:text-9xl font-heading font-bold opacity-10 text-white select-none">
               PARTNER
             </h2>
             <p className="text-[#2962ff] font-mono uppercase tracking-[0.3em] -mt-4 md:-mt-10 relative z-10 text-sm md:text-base">
               Join the UZ Ecosystem
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Builders', type: 'Incubation', desc: 'Submit your pitch deck for pre-seed/seed funding.', action: 'Submit Pitch', icon: Cpu },
              { name: 'Investors', type: 'Liquidity', desc: 'For LPs interested in our high-yield DeFi funds.', action: 'Request Access', icon: Wallet },
              { name: 'Partners', type: 'Ecosystem', desc: 'Strategic partnerships and protocol integrations.', action: 'Contact Us', icon: Network },
            ].map((tier, i) => {
              const isPurchasing = purchasingIndex === i;
              const isPurchased = purchasedIndex === i;
              const isDisabled = (purchasingIndex !== null) || (purchasedIndex !== null);

              return (
                <motion.div
                  key={i}
                  whileHover={isDisabled ? {} : { y: -10 }}
                  className={`relative p-8 md:p-10 border border-white/10 bg-[#0f1126] flex flex-col min-h-[400px] transition-colors duration-300 group ${isDisabled && !isPurchased ? 'opacity-50 grayscale' : ''}`}
                  data-hover={!isDisabled}
                >
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#2962ff] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex-1">
                    <tier.icon className="w-10 h-10 text-[#2962ff] mb-6" />
                    <h3 className="text-2xl md:text-3xl font-heading font-bold mb-2 text-white">{tier.name}</h3>
                    <div className="text-sm font-mono text-[#00f0ff] mb-8 tracking-widest uppercase">
                      {tier.type}
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      {tier.desc}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => handleInquiry(i)}
                    disabled={isDisabled}
                    className={`w-full py-4 text-sm font-bold uppercase tracking-[0.2em] border transition-all duration-300 mt-8 relative overflow-hidden
                      ${isPurchased 
                        ? 'bg-[#00f0ff] text-black border-[#00f0ff] cursor-default' 
                        : isPurchasing 
                          ? 'bg-white/10 text-white border-white/10 cursor-wait'
                          : isDisabled 
                            ? 'cursor-not-allowed opacity-50 border-white/10' 
                            : 'text-white border-white/20 hover:border-[#00f0ff] hover:text-[#00f0ff] bg-transparent'
                      }`}
                  >
                    <span className="relative z-10">
                      {isPurchasing ? 'Processing...' : isPurchased ? 'Sent' : tier.action}
                    </span>
                  </button>
                  
                  {isPurchased && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] text-center mt-3 text-gray-500 font-mono uppercase"
                    >
                      Inquiry Received
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-12 md:py-16 bg-[#050614]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
             <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 border border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-none transform rotate-45"></div>
                </div>
                <div className="font-heading text-2xl font-bold tracking-tighter text-white">UZ CAPITAL</div>
             </div>
             <div className="flex gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest">
               <span>Tokyo</span> • <span>Singapore</span> • <span>New York</span>
             </div>
             <div className="mt-2 text-xs text-gray-600">
               &copy; 2025 UZ Capital Ventures. All rights reserved.
             </div>
          </div>
          
          <div className="flex gap-8 flex-wrap">
            <a href="https://x.com/GoogleAIStudio" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00f0ff] font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
              Twitter / X
            </a>
            <a href="#" className="text-gray-400 hover:text-[#00f0ff] font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
              LinkedIn
            </a>
            <a href="#" className="text-gray-400 hover:text-[#00f0ff] font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
              Medium
            </a>
          </div>
        </div>
      </footer>

      {/* Company Detail Modal */}
      <AnimatePresence>
        {selectedCompany && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCompany(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-[#0f1126] border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-[#2962ff]/10 group/modal"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCompany(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white hover:bg-[#00f0ff] hover:text-black transition-colors"
                data-hover="true"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={(e) => { e.stopPropagation(); navigateCompany('prev'); }}
                className="absolute left-4 bottom-4 translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 bg-black/50 text-white hover:bg-[#00f0ff] hover:text-black transition-colors border border-white/10 backdrop-blur-sm"
                data-hover="true"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateCompany('next'); }}
                className="absolute right-4 bottom-4 translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 bg-black/50 text-white hover:bg-[#00f0ff] hover:text-black transition-colors border border-white/10 backdrop-blur-sm md:right-8"
                data-hover="true"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedCompany.id}
                    src={selectedCompany.image} 
                    alt={selectedCompany.name} 
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover grayscale"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1126] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-8 pb-24 md:p-12 flex flex-col justify-center relative">
                <motion.div
                  key={selectedCompany.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 text-[#00f0ff] mb-6">
                     <Layers className="w-4 h-4" />
                     <span className="font-mono text-xs tracking-[0.2em] uppercase border border-[#00f0ff]/30 px-2 py-1">{selectedCompany.stage}</span>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-heading font-bold uppercase leading-none mb-2 text-white">
                    {selectedCompany.name}
                  </h3>
                  
                  <p className="text-lg text-gray-400 font-mono tracking-widest uppercase mb-8">
                    {selectedCompany.sector}
                  </p>
                  
                  <div className="h-px w-20 bg-[#2962ff] mb-8" />
                  
                  <p className="text-gray-300 leading-relaxed text-lg font-light mb-8">
                    {selectedCompany.description}
                  </p>
                  
                   <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white hover:text-[#00f0ff] transition-colors group" data-hover="true">
                    View Website <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;