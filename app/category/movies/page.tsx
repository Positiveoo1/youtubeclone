'use client';

import React, { useEffect } from 'react';
import { useVideoStore } from '@/hooks/useVideo';
import VideoGrid from '@/components/VideoGrid';
import { motion } from 'framer-motion';

export default function MoviesCategoryPage() {
  const { searchResults, isLoading, searchVideos } = useVideoStore();

  useEffect(() => {
    searchVideos('movies');
  }, []);

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <h1>🎬 Movies</h1>
        <p>Explore popular movies and trailers</p>
      </div>
      <VideoGrid videos={searchResults} isLoading={isLoading} columns={4} />
    </motion.div>
  );
}
