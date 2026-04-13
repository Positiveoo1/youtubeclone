/**
 * Comment Model
 * Stores comments and replies for videos
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

interface CommentDocument extends Document {
  videoId: string;
  userId: mongoose.Types.ObjectId;
  username: string;
  userAvatar: string | null;
  content: string;
  likes: number;
  replies: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<CommentDocument>(
  {
    videoId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    username: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    likes: {
      type: Number,
      default: 0,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
CommentSchema.index({ videoId: 1 });
CommentSchema.index({ userId: 1 });
CommentSchema.index({ createdAt: -1 });

const CommentModel: Model<CommentDocument> = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

export default CommentModel;
