/**
 * Trending Page
 * Display trending videos
 */

'use client';

import React, { useEffect } from 'react';
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

export default function TrendingPage() {
  const { trendingVideos, isLoading, error, cursor, fetchTrendingVideos, loadMoreTrendingVideos } = useVideoStore();
  const hasMore = cursor !== null && cursor !== undefined;

  useEffect(() => {
    fetchTrendingVideos();
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      loadMoreTrendingVideos();
    }
  };

  return (
    <motion.div
      className="trending-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.section className="trending-header" variants={itemVariants}>
        <div className="trending-content">
          <h1>🔥 Trending Now</h1>
          <p>Most watched videos from around the world</p>
        </div>
      </motion.section>

      {/* Filters */}
      <motion.section className="trending-filters" variants={itemVariants}>
        <div className="filter-group">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">Music</button>
          <button className="filter-btn">Gaming</button>
          <button className="filter-btn">News</button>
          <button className="filter-btn">Sports</button>
        </div>
      </motion.section>

      {/* Error Message */}
      {error && (
        <motion.div className="trending-error-message" variants={itemVariants}>
          <p>{error}</p>
        </motion.div>
      )}

      {/* Videos Grid */}
      <VideoGrid
        videos={trendingVideos}
        isLoading={isLoading}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        columns={4}
      />
    </motion.div>
  );
}
