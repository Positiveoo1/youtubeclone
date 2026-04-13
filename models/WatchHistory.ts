/**
 * Watch History Model
 * Tracks videos watched by users
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

interface WatchHistoryDocument extends Document {
  userId: mongoose.Types.ObjectId;
  videoId: string;
  watchedAt: Date;
  duration: number;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

const WatchHistorySchema = new Schema<WatchHistoryDocument>(
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
    watchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    duration: {
      type: Number,
      default: 0, // in seconds
    },
    progress: {
      type: Number,
      default: 0, // percentage 0-100
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
WatchHistorySchema.index({ userId: 1, watchedAt: -1 });

const WatchHistoryModel: Model<WatchHistoryDocument> =
  mongoose.models.WatchHistory || mongoose.model('WatchHistory', WatchHistorySchema);

export default WatchHistoryModel;
