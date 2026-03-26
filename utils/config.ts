/**
 * Routing Configuration
 * API route handlers configuration for Next.js
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

// Route configurations
export const routeHandlers = {
  // Auth routes
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    me: '/api/auth/me',
  },

  // Video routes
  videos: {
    trending: '/api/videos/trending',
    search: '/api/videos/search',
    related: (videoId: string) => `/api/videos/${videoId}/related`,
  },

  // Comment routes
  comments: '/api/comments',
  comment: (commentId: string) => `/api/comments/${commentId}`,

  // Like routes
  likes: '/api/likes',

  // History routes
  history: '/api/history',
};

export default config;
