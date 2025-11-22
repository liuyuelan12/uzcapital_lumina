
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef } from 'react';

const Hero3DObject: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Configuration
    const particleCount = 100;
    const baseSpeed = 0.001;

    // Initialize particles on a sphere (Fibonacci Sphere)
    const particles: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      
      particles.push({
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi),
      });
    }

    let angleX = 0;
    let angleY = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      // Set actual canvas size to match screen pixels
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      // Normalize coordinate system to CSS pixels
      ctx.scale(dpr, dpr);
      
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
    };

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.35;

      angleY += baseSpeed;
      angleX += baseSpeed * 0.5;

      const projectedParticles = particles.map((p) => {
        // 1. Rotate
        // Rotate around Y
        let x = p.x * Math.cos(angleY) - p.z * Math.sin(angleY);
        let z = p.x * Math.sin(angleY) + p.z * Math.cos(angleY);
        
        // Rotate around X
        let y = p.y * Math.cos(angleX) - z * Math.sin(angleX);
        z = p.y * Math.sin(angleX) + z * Math.cos(angleX);

        // 2. Project
        // Simple perspective projection
        const perspective = 800;
        const scale = perspective / (perspective + z * radius); // z * radius to give depth
        
        return {
          x: cx + x * radius * scale,
          y: cy + y * radius * scale,
          z: z * radius,
          scale: scale,
          // Alpha based on depth (z) for fading effect
          alpha: (z + 1) / 2 // Normalized roughly 0 to 1
        };
      });

      // Draw Connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedParticles.length; i++) {
        const p1 = projectedParticles[i];
        // Optimization: only check a subset or use spatial partition? 
        // For N=100, N^2 is 10000, fine for modern JS.
        for (let j = i + 1; j < projectedParticles.length; j++) {
          const p2 = projectedParticles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Dynamic connection distance based on radius
          const maxDist = radius * 0.5;

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * p1.alpha * p2.alpha * 0.5;
            if (opacity > 0.05) {
              ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`; // Brand Cyan
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw Particles
      projectedParticles.forEach((p) => {
        const size = 1.5 * p.scale;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-50"
      style={{ zIndex: 0 }}
    />
  );
};

export default Hero3DObject;
