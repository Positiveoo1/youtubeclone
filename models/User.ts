/**
 * User Model
 * Stores user account information
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  avatar: string | null;
  bio: string | null;
  verified: boolean;
  subscriberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: 500,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    subscriberCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

const UserModel: Model<UserDocument> = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;
