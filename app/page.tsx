/**
 * Home Page
 * Main landing page with featured and trending videos
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useVideoStore } from '@/hooks/useVideo';
import VideoGrid from '@/components/VideoGrid';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function HomePage() {
  const { trendingVideos, isLoading, error, fetchTrendingVideos } = useVideoStore();
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchTrendingVideos();
  }, []);

  const handleLoadMore = () => {
    if (hasMore) {
      // In a real app, you would paginate here
      setHasMore(false);
    }
  };

  return (
    <motion.div
      className="home-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section className="home-hero" variants={itemVariants}>
        <div className="hero-content">
          <h1>Welcome to YouTube Clone 2026</h1>
          <p>Discover unlimited videos, channels, and playlists</p>
        </div>
      </motion.section>

      {/* Error Message */}
      {error && (
        <motion.div className="home-error-message" variants={itemVariants}>
          <p>{error}</p>
        </motion.div>
      )}

      {/* Trending Videos Section */}
      <motion.section className="home-section" variants={itemVariants}>
        <div className="home-section-header">
          <h2>Trending Videos</h2>
          <p>Check out what's trending right now</p>
        </div>

        <VideoGrid
          videos={trendingVideos}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          columns={4}
        />
      </motion.section>
    </motion.div>
  );
}
