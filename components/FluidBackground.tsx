/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const NetworkNodes = () => {
  const nodes = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.5 + 0.1
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute rounded-full bg-[#00f0ff] will-change-[opacity,transform]"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: node.size,
            height: node.size,
            boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
            transform: 'translateZ(0)'
          }}
          initial={{ opacity: node.opacity, scale: 1 }}
          animate={{
            opacity: [node.opacity, node.opacity * 2, node.opacity],
            scale: [1, 1.2, 1],
            y: [0, -20, 0],
          }}
          transition={{
            duration: node.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: node.delay,
          }}
        />
      ))}
    </div>
  );
};

const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#050614] via-[#0a0b1e] to-[#141535]">
      
      <NetworkNodes />

      {/* Blob 1: Electric Blue - Primary Brand Color */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-[#2962ff] rounded-full mix-blend-screen filter blur-[60px] opacity-15 will-change-transform"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Blob 2: Cyan - Highlights */}
      <motion.div
        className="absolute top-[40%] right-[-20%] w-[70vw] h-[60vw] bg-[#00f0ff] rounded-full mix-blend-screen filter blur-[50px] opacity-10 will-change-transform"
        animate={{
          x: [0, -40, 20, 0],
          y: [0, 40, -20, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Blob 3: Deep Violet - Depth */}
      <motion.div
        className="absolute bottom-[-20%] left-[10%] w-[90vw] h-[90vw] bg-[#6200ea] rounded-full mix-blend-screen filter blur-[60px] opacity-15 will-change-transform"
        animate={{
          x: [0, 60, -60, 0],
          y: [0, -40, 40, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Tech Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '50px 50px'
        }}
      />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0a0b1e]/50 to-[#0a0b1e] pointer-events-none" />
    </div>
  );
};

export default FluidBackground;