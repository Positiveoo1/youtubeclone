'use client';

import React, { useEffect } from 'react';
import { useVideoStore } from '@/hooks/useVideo';
import VideoGrid from '@/components/VideoGrid';
import { motion } from 'framer-motion';

export default function MusicCategoryPage() {
  const { searchResults, isLoading, error, searchVideos } = useVideoStore();
  const [hasMore, setHasMore] = React.useState(true);

  useEffect(() => {
    // Search for music videos
    searchVideos('music');
  }, []);

  const handleLoadMore = () => {
    if (hasMore) {
      setHasMore(false);
    }
  };

  return (
    <motion.div
      className="category-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Category Header */}
      <div className="category-header">
        <h1>🎵 Music</h1>
        <p>Explore the best music videos</p>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div className="category-error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p>{error}</p>
        </motion.div>
      )}

      {/* Videos Grid */}
      <VideoGrid
        videos={searchResults}
        isLoading={isLoading}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        columns={4}
      />
    </motion.div>
  );
}
