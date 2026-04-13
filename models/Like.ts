/**
 * Like Model
 * Tracks user likes and dislikes on videos
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { Like, MongooseDocument } from '@/types';

interface LikeDocument extends MongooseDocument<Like>, Document {}

const LikeSchema = new Schema<LikeDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    videoId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['like', 'dislike'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Composite index for unique like/dislike per user per video
LikeSchema.index({ userId: 1, videoId: 1 }, { unique: true });

const LikeModel: Model<LikeDocument> = mongoose.models.Like || mongoose.model('Like', LikeSchema);

export default LikeModel;
