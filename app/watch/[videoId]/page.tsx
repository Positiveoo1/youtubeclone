/**
 * Watch Video Page
 * Displays video player with comments and related videos
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Share2, Download } from 'lucide-react';
import apiClient from '@/services/api-client';
import { Comment } from '@/types';
import '../../../styles/watch.css';

interface VideoDetails {
  _id: string;
  videoId: string;
  title: string;
  description: string;
  channelName: string;
  channelAvatar: string;
  viewCount: number;
  likeCount: number;
  uploadDate: Date;
}

export default function WatchPage() {
  const { videoId } = useParams();
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likeStatus, setLikeStatus] = useState<'like' | 'dislike' | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Fetch video details and related data
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // In a real app, you would fetch from your API
        setVideoDetails({
          _id: 'demo_' + videoId,
          videoId: videoId as string,
          title: 'Sample Video Title',
          description: 'This is a sample video description. In production, this would be fetched from the API.',
          channelName: 'Sample Channel',
          channelAvatar: '',
          viewCount: 1500000,
          likeCount: 45000,
          uploadDate: new Date(),
        });

        // Fetch comments
        const commentsResponse = await apiClient.get<{ comments: Comment[] }>('/comments', {
          params: { videoId },
        });
        if (commentsResponse.success && commentsResponse.data) {
          setComments(commentsResponse.data.comments || []);
        }
      } catch (error) {
        console.error('Error fetching video details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (videoId) {
      fetchData();
    }
  }, [videoId]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await apiClient.post<Comment>('/comments', {
        videoId,
        content: newComment,
      });

      if (response.success && response.data) {
        setComments([response.data, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleLike = async (type: 'like' | 'dislike') => {
    try {
      const response = await apiClient.post('/likes', {
        videoId,
        type,
      });

      if (response.success) {
        setLikeStatus(likeStatus === type ? null : type);
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="watch-page">
        <div className="watch-loading">Loading video...</div>
      </div>
    );
  }

  if (!videoDetails) {
    return (
      <div className="watch-page">
        <div className="watch-error">Video not found</div>
      </div>
    );
  }

  return (
    <motion.div
      className="watch-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="watch-container">
        {/* Video Player */}
        <motion.div className="watch-player-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="watch-player">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoDetails.videoId}`}
              title={videoDetails.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>

        {/* Video Info */}
        <motion.div className="watch-info" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="watch-title">{videoDetails.title}</h1>

          <div className="watch-meta">
            <div className="watch-meta-left">
              <div className="watch-channel">
                <div className="watch-channel-avatar" style={{ background: '#ff0000' }} />
                <div>
                  <p className="watch-channel-name">{videoDetails.channelName}</p>
                  <p className="watch-subscriber-count">1.5M subscribers</p>
                </div>
              </div>

              <button className="watch-subscribe-btn">Subscribe</button>
            </div>

            {/* Actions */}
            <div className="watch-actions">
              <motion.button
                className={`watch-action-btn ${likeStatus === 'like' ? 'active' : ''}`}
                onClick={() => handleLike('like')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ThumbsUp size={20} />
                <span>45K</span>
              </motion.button>

              <motion.button
                className={`watch-action-btn ${likeStatus === 'dislike' ? 'active' : ''}`}
                onClick={() => handleLike('dislike')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ThumbsDown size={20} />
              </motion.button>

              <motion.button
                className="watch-action-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={20} />
                <span>Share</span>
              </motion.button>

              <motion.button
                className="watch-action-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={20} />
              </motion.button>
            </div>
          </div>

          {/* Description */}
          <motion.div className="watch-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <details>
              <summary>Show more</summary>
              <p>{videoDetails.description}</p>
            </details>
          </motion.div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          className="watch-comments"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2>Comments</h2>

          {/* New Comment */}
          <div className="watch-comment-form">
            <div className="watch-comment-avatar" style={{ background: '#ff0000' }} />
            <div className="watch-comment-input-wrapper">
              <textarea
                className="watch-comment-input"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="watch-comment-actions">
                <button
                  className="watch-comment-cancel"
                  onClick={() => setNewComment('')}
                >
                  Cancel
                </button>
                <button
                  className="watch-comment-submit"
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                >
                  Comment
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="watch-comments-list">
            {comments.length === 0 ? (
              <p className="watch-no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <motion.div
                  key={String(comment._id)}
                  className="watch-comment"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="watch-comment-avatar" style={{ background: '#ff0000' }} />
                  <div className="watch-comment-content">
                    <p className="watch-comment-header">
                      <strong>{comment.username}</strong>
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </p>
                    <p className="watch-comment-text">{comment.content}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
