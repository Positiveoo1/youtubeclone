/**
 * Navbar Component
 * Top navigation bar with search, logo, and user menu
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuth';
import { useVideoStore } from '@/hooks/useVideo';
import { motion } from 'framer-motion';
import {
  Search,
  Menu,
  Bell,
  User,
  LogOut,
  Settings,
  Home,
  History,
  ThumbsUp,
} from 'lucide-react';
import '../styles/navbar.css';

interface NavbarProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

export default function Navbar({ isDarkMode, setIsDarkMode }: NavbarProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { searchVideos } = useVideoStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchVideos(searchQuery);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setShowUserMenu(false);
  };

  return (
    <nav className={`navbar ${isDarkMode ? 'navbar-dark' : 'navbar-light'}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <span className="logo-icon">▶</span>
          <span className="logo-text">YouTube</span>
        </Link>

        {/* Search Bar */}
        <form className="navbar-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search videos, channels, playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="navbar-search-btn">
            <Search size={20} />
          </button>
        </form>

        {/* Right Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <motion.button
                className="navbar-action-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell size={20} />
              </motion.button>

              {/* User Menu */}
              <div className="navbar-user-menu">
                <motion.button
                  className="navbar-user-btn"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <User size={20} />
                </motion.button>

                {showUserMenu && (
                  <motion.div
                    className="navbar-dropdown-menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="navbar-dropdown-header">
                      <p className="navbar-dropdown-name">{user?.username}</p>
                      <p className="navbar-dropdown-email">{user?.email}</p>
                    </div>

                    <div className="navbar-dropdown-divider"></div>

                    <Link href="/channel" className="navbar-dropdown-item">
                      <User size={16} />
                      <span>My Channel</span>
                    </Link>

                    <Link href="/history" className="navbar-dropdown-item">
                      <History size={16} />
                      <span>Watch History</span>
                    </Link>

                    <Link href="/liked" className="navbar-dropdown-item">
                      <ThumbsUp size={16} />
                      <span>Liked Videos</span>
                    </Link>

                    <Link href="/settings" className="navbar-dropdown-item">
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>

                    <div className="navbar-dropdown-divider"></div>

                    <button
                      className="navbar-dropdown-item navbar-logout"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="navbar-action-link">
                Login
              </Link>
              <Link href="/register" className="navbar-action-link navbar-action-link-primary">
                Sign Up
              </Link>
            </>
          )}

          {/* Dark Mode Toggle */}
          <motion.button
            className="navbar-action-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
