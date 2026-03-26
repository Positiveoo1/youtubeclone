/**
 * Video Skeleton Component
 * Loading skeleton for video cards
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import '../styles/skeleton.css';

export default function VideoSkeleton() {
  const shimmer = {
    animate: {
      backgroundPosition: ['200% 0%', '-200% 0%'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  return (
    <motion.div className="skeleton-card" variants={shimmer} animate="animate">
      <div className="skeleton-thumbnail"></div>
      <div className="skeleton-info">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-content">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-channel"></div>
          <div className="skeleton-line skeleton-meta"></div>
        </div>
      </div>
    </motion.div>
  );
}
