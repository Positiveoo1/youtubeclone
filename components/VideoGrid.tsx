/**
 * Video Grid Component
 * Displays grid of videos with infinite scroll
 */

'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { Video } from '@/types';
import VideoCard from '@/components/VideoCard';
import VideoSkeleton from '@/components/VideoSkeleton';
import { motion } from 'framer-motion';
import '../styles/video-grid.css';

interface VideoGridProps {
  videos: Video[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  columns?: number;
}

export default function VideoGrid({
  videos,
  isLoading = false,
  onLoadMore,
  hasMore = true,
  columns = 4,
}: VideoGridProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  // Infinite scroll using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && onLoadMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <div className="video-grid-container">
      <motion.div
        className={`video-grid video-grid-${columns}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Video Cards */}
        {videos.map((video, index) => (
          <motion.div 
            key={`${video._id}-${index}`}
            variants={itemVariants}
          >
            <VideoCard video={video} />
          </motion.div>
        ))}

        {/* Loading Skeletons */}
        {isLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <motion.div key={`skeleton-${index}`} variants={itemVariants}>
              <VideoSkeleton />
            </motion.div>
          ))}
      </motion.div>

      {/* Infinite Scroll Observer */}
      <div ref={observerTarget} className="video-grid-observer" />

      {/* No Results */}
      {!isLoading && videos.length === 0 && (
        <motion.div
          className="video-grid-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="empty-state">
            <h2>No videos found</h2>
            <p>Try adjusting your search or filters</p>
          </div>
        </motion.div>
      )}

      {/* End of Results */}
      {!hasMore && videos.length > 0 && (
        <motion.div
          className="video-grid-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>No more videos to load</p>
        </motion.div>
      )}
    </div>
  );
}
