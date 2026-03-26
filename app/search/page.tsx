/**
 * Search Page
 * Displays search results for videos
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useVideoStore } from '@/hooks/useVideo';
import VideoGrid from '@/components/VideoGrid';
import { motion } from 'framer-motion';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { searchResults, isLoading, error, searchVideos } = useVideoStore();
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (query) {
      searchVideos(query);
    }
  }, [query]);

  const handleLoadMore = () => {
    if (hasMore) {
      setHasMore(false);
    }
  };

  return (
    <motion.div
      className="search-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Search Header */}
      <div className="search-header">
        <h1>Search Results</h1>
        <p>Results for "{query}"</p>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div className="search-error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p>{error}</p>
        </motion.div>
      )}

      {/* Search Results */}
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
