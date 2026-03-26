'use client';

import React, { useEffect } from 'react';
import { useVideoStore } from '@/hooks/useVideo';
import VideoGrid from '@/components/VideoGrid';
import { motion } from 'framer-motion';

export default function LibraryPage() {
  const { videos, isLoading, searchVideos } = useVideoStore();

  useEffect(() => {
    searchVideos('library');
  }, []);

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <h1>📚 Your Library</h1>
        <p>Your saved videos and playlists</p>
      </div>
      <VideoGrid videos={videos} isLoading={isLoading} columns={4} />
    </motion.div>
  );
}
