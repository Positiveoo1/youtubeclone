'use client';

import React, { useEffect } from 'react';
import { useVideoStore } from '@/hooks/useVideo';
import VideoGrid from '@/components/VideoGrid';
import { motion } from 'framer-motion';

export default function SportsCategoryPage() {
  const { searchResults, isLoading, searchVideos } = useVideoStore();

  useEffect(() => {
    searchVideos('sports');
  }, []);

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <h1>⚽ Sports</h1>
        <p>Sports highlights and live events</p>
      </div>
      <VideoGrid videos={searchResults} isLoading={isLoading} columns={4} />
    </motion.div>
  );
}
