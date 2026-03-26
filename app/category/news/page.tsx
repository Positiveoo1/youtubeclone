'use client';

import React, { useEffect } from 'react';
import { useVideoStore } from '@/hooks/useVideo';
import VideoGrid from '@/components/VideoGrid';
import { motion } from 'framer-motion';

export default function NewsCategoryPage() {
  const { searchResults, isLoading, searchVideos } = useVideoStore();

  useEffect(() => {
    searchVideos('news');
  }, []);

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <h1>📰 News</h1>
        <p>Latest news and updates</p>
      </div>
      <VideoGrid videos={searchResults} isLoading={isLoading} columns={4} />
    </motion.div>
  );
}
