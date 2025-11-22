
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { motion } from 'framer-motion';
import { Company } from '../types';
import { ArrowUpRight, Layers } from 'lucide-react';

interface PortfolioCardProps {
  company: Company; // Renamed from artist
  onClick: () => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ company, onClick }) => {
  // Check if the image is one of the Photoroom logos/cutouts
  const isLogo = company.image.includes('Photoroom');

  return (
    <motion.div
      className="group relative h-[400px] md:h-[500px] w-full overflow-hidden border-b md:border-r border-white/10 bg-black cursor-pointer"
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
    >
      {/* Image Background with Zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img 
          src={company.image} 
          alt={company.name} 
          className={`h-full w-full ${isLogo ? 'object-contain p-8' : 'object-cover'} grayscale will-change-transform`}
          variants={{
            rest: { scale: 1, opacity: 0.4, filter: 'grayscale(100%) blur(2px)' },
            hover: { scale: 1.05, opacity: 0.8, filter: 'grayscale(0%) blur(0px)' }
          }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        />
        <div className="absolute inset-0 bg-[#0a0b1e]/60 group-hover:bg-[#2962ff]/10 transition-colors duration-500" />
      </div>

      {/* Overlay Info */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
           <span className="text-xs font-mono border border-[#00f0ff]/30 text-[#00f0ff] px-3 py-1 rounded-none backdrop-blur-md uppercase tracking-widest">
             {company.stage}
           </span>
           <motion.div
             variants={{
               rest: { opacity: 0, x: 20, y: -20 },
               hover: { opacity: 1, x: 0, y: 0 }
             }}
             className="bg-white text-black p-2 will-change-transform"
           >
             <ArrowUpRight className="w-5 h-5" />
           </motion.div>
        </div>

        <div>
          <div className="overflow-hidden">
            <motion.h3 
              className="font-heading text-2xl md:text-3xl font-bold uppercase text-white will-change-transform"
              variants={{
                rest: { y: 0 },
                hover: { y: -5 }
              }}
              transition={{ duration: 0.4 }}
            >
              {company.name}
            </motion.h3>
          </div>
          
          <motion.div 
            className="flex items-center gap-2 mt-3 will-change-transform"
            variants={{
              rest: { opacity: 0.7, y: 0 },
              hover: { opacity: 1, y: 0 }
            }}
          >
            <Layers className="w-4 h-4 text-[#00f0ff]" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-300">
              {company.sector}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioCard;
