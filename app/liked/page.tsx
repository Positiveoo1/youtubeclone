'use client';

import React, { useEffect } from 'react';
import { useVideoStore } from '@/hooks/useVideo';
import VideoGrid from '@/components/VideoGrid';
import { motion } from 'framer-motion';

export default function LikedPage() {
  const { videos, isLoading, searchVideos } = useVideoStore();

  useEffect(() => {
    searchVideos('liked');
  }, []);

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <h1>👍 Liked Videos</h1>
        <p>Videos you've liked</p>
      </div>
      <VideoGrid videos={videos} isLoading={isLoading} columns={4} />
    </motion.div>
  );
}
