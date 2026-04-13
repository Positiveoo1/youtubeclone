/**
 * Video Model
 * Stores video metadata from API
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { Video, MongooseDocument } from '@/types';

interface VideoDocument extends MongooseDocument<Video>, Document {}

const VideoSchema = new Schema<VideoDocument>(
  {
    videoId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      maxlength: 5000,
      default: '',
    },
    thumbnail: {
      type: String,
      required: true,
    },
    channelId: {
      type: String,
      required: true,
    },
    channelName: {
      type: String,
      required: true,
    },
    channelAvatar: {
      type: String,
      default: null,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    uploadDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      default: 'General',
    },
    isHD: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
VideoSchema.index({ videoId: 1 });
VideoSchema.index({ channelId: 1 });
VideoSchema.index({ uploadDate: -1 });
VideoSchema.index({ viewCount: -1 });

const VideoModel: Model<VideoDocument> = mongoose.models.Video || mongoose.model('Video', VideoSchema);

export default VideoModel;
