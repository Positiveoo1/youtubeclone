'use client';

import React, { useEffect } from 'react';
import { useVideoStore } from '@/hooks/useVideo';
import VideoGrid from '@/components/VideoGrid';
import { motion } from 'framer-motion';

export default function SubscriptionsPage() {
  const { videos, isLoading, searchVideos } = useVideoStore();

  useEffect(() => {
    searchVideos('subscriptions');
  }, []);

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <h1>📺 Subscriptions</h1>
        <p>Videos from channels you subscribe to</p>
      </div>
      <VideoGrid videos={videos} isLoading={isLoading} columns={4} />
    </motion.div>
  );
}
