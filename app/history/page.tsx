/**
 * History Page
 * Display user's watch history
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/hooks/useAuth';
import apiClient from '@/services/api-client';
import { motion } from 'framer-motion';
import { Trash2, Play } from 'lucide-react';

interface HistoryItem {
  _id: string;
  videoId: string;
  watchedAt: Date;
  duration: number;
  progress: number;
}

export default function HistoryPage() {
  const { isAuthenticated } = useAuthStore();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setError('Please login to view watch history');
      setIsLoading(false);
      return;
    }

    fetchHistory();
  }, [isAuthenticated]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/history');

      if (response.success && response.data) {
        setHistory(response.data.history || []);
      } else {
        setError('Failed to load watch history');
      }
    } catch (err: any) {
      setError('Error loading watch history');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (confirm('Are you sure? This cannot be undone.')) {
      // Implementation for clearing all history
      setHistory([]);
    }
  };

  const handleDeleteItem = (historyId: string) => {
    // Implementation for deleting single item
    setHistory(history.filter((item) => item._id !== historyId));
  };

  if (!isAuthenticated) {
    return (
      <motion.div
        className="history-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="history-empty">
          <p>Please login to view your watch history</p>
          <Link href="/login" className="link-button">
            Login
          </Link>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        className="history-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="history-loading">Loading watch history...</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="history-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="history-header">
        <h1>Watch History</h1>
        {history.length > 0 && (
          <button className="history-clear-btn" onClick={handleClearHistory}>
            Clear All
          </button>
        )}
      </div>

      {/* Error */}
      {error && <div className="history-error">{error}</div>}

      {/* Empty State */}
      {history.length === 0 ? (
        <motion.div
          className="history-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>Your watch history is empty</p>
          <Link href="/" className="link-button">
            Browse Videos
          </Link>
        </motion.div>
      ) : (
        /* History List */
        <motion.div
          className="history-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {history.map((item, index) => (
            <motion.div
              key={item._id}
              className="history-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/watch/${item.videoId}`} className="history-item-link">
                <div className="history-item-icon">
                  <Play size={20} />
                </div>
                <div className="history-item-info">
                  <p className="history-item-video">Video #{item.videoId}</p>
                  <p className="history-item-date">
                    {new Date(item.watchedAt).toLocaleDateString()}
                  </p>
                  <div className="history-progress-bar">
                    <div
                      className="history-progress-fill"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </Link>
              <button
                className="history-delete-btn"
                onClick={() => handleDeleteItem(item._id)}
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
