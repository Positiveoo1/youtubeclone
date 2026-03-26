/**
 * Video Card Component
 * Displays individual video with thumbnail, title, channel info
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Video } from '@/types';
import { motion } from 'framer-motion';
import { Eye, Heart, MessageCircle } from 'lucide-react';
import '../styles/video-card.css';

interface VideoCardProps {
  video: Video;
  onClick?: () => void;
}

/**
 * Format view count to readable format (1.2M, 500K, etc.)
 */
const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

/**
 * Format date to relative time (2 days ago, etc.)
 */
const formatDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffMs / 604800000);
  const diffMonths = Math.floor(diffMs / 2592000000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMs / 31536000000)}y ago`;
};

export default function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <motion.div
      className="video-card"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <Link href={`/watch/${video.videoId}`}>
        <div className="video-card-thumbnail">
          <div className="video-thumbnail-image">
            {video.thumbnail ? (
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="thumbnail-img"
              />
            ) : (
              <div className="thumbnail-placeholder">No Image</div>
            )}
          </div>

          {/* Video Duration Badge */}
          {video.duration && (
            <div className="video-duration">
              {Math.floor(video.duration / 60)}:
              {String(video.duration % 60).padStart(2, '0')}
            </div>
          )}

          {/* HD Badge */}
          {video.isHD && <div className="video-hd-badge">HD</div>}

          {/* Hover Overlay */}
          <motion.div
            className="video-card-overlay"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <div className="video-card-stats">
              <div className="stat">
                <Eye size={14} />
                <span>{formatCount(video.viewCount)}</span>
              </div>
              <div className="stat">
                <Heart size={14} />
                <span>{formatCount(video.likeCount)}</span>
              </div>
              <div className="stat">
                <MessageCircle size={14} />
                <span>{formatCount(video.commentCount)}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Video Info */}
        <div className="video-card-info">
          <div className="video-card-channel-avatar">
            {video.channelAvatar ? (
              <Image
                src={video.channelAvatar}
                alt={video.channelName}
                width={40}
                height={40}
                className="channel-avatar-img"
              />
            ) : (
              <div className="channel-avatar-placeholder">{video.channelName.charAt(0)}</div>
            )}
          </div>

          <div className="video-card-details">
            <h3 className="video-card-title" title={video.title}>
              {video.title}
            </h3>

            <p className="video-card-channel">{video.channelName}</p>

            <div className="video-card-meta">
              <span>{formatCount(video.viewCount)} views</span>
              <span>•</span>
              <span>{formatDate(video.uploadDate)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
