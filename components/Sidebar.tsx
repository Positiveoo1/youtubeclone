/**
 * Sidebar Component
 * Navigation sidebar with menu items
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  TrendingUp,
  Music,
  Film,
  Gamepad2,
  Newspaper,
  Trophy,
  Play,
  History,
  Heart,
  Clock,
  Download,
  Menu,
  X,
} from 'lucide-react';
import '../styles/sidebar.css';

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileScreen = window.innerWidth <= 768;
      setIsMobile(isMobileScreen);
      // Start collapsed on mobile
      setIsExpanded(!isMobileScreen);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsExpanded(false);
    }
  }, [pathname, isMobile]);

  const handleLinkClick = () => {
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  const menuItems = [
    { id: 'home', label: 'Home', path: '/', icon: Home },
    { id: 'trending', label: 'Trending', path: '/trending', icon: TrendingUp },
    { id: 'subscriptions', label: 'Subscriptions', path: '/subscriptions', icon: Music },
    { id: 'library', label: 'Library', path: '/library', icon: Play },
  ];

  const browseItems = [
    { id: 'music', label: 'Music', path: '/category/music', icon: Music },
    { id: 'movies', label: 'Movies', path: '/category/movies', icon: Film },
    { id: 'gaming', label: 'Gaming', path: '/category/gaming', icon: Gamepad2 },
    { id: 'news', label: 'News', path: '/category/news', icon: Newspaper },
    { id: 'sports', label: 'Sports', path: '/category/sports', icon: Trophy },
  ];

  const userItems = [
    { id: 'history', label: 'History', path: '/history', icon: History },
    { id: 'liked', label: 'Liked Videos', path: '/liked', icon: Heart },
    { id: 'watchlater', label: 'Watch Later', path: '/watch-later', icon: Clock },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isExpanded && (
        <motion.div
          className="sidebar-overlay"
          onClick={() => setIsExpanded(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Mobile Toggle Button */}
      <motion.button
        className="sidebar-toggle-mobile"
        onClick={() => setIsExpanded(!isExpanded)}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle sidebar"
      >
        {isExpanded ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Sidebar */}
      <motion.aside
        className={`sidebar ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}
        animate={{ x: isExpanded ? 0 : -250 }}
        transition={{ duration: 0.3 }}
      >
        {/* Main Menu */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Menu</h3>
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={`sidebar-item ${isActive(item.path) ? 'sidebar-item-active' : ''}`}
              onClick={handleLinkClick}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {isActive(item.path) && (
                <motion.div
                  className="sidebar-item-indicator"
                  layoutId="sidebar-indicator"
                  initial={false}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="sidebar-divider"></div>

        {/* Browse */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Browse</h3>
          {browseItems.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={`sidebar-item ${isActive(item.path) ? 'sidebar-item-active' : ''}`}
              onClick={handleLinkClick}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="sidebar-divider"></div>

        {/* User Items */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">You</h3>
          {userItems.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={`sidebar-item ${isActive(item.path) ? 'sidebar-item-active' : ''}`}
              onClick={handleLinkClick}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="sidebar-divider"></div>

        {/* Settings */}
        <div className="sidebar-section">
          <Link href="/settings" className="sidebar-item" onClick={handleLinkClick}>
            <span>⚙️</span>
            <span>Settings</span>
          </Link>
          <Link href="/help" className="sidebar-item" onClick={handleLinkClick}>
            <span>❓</span>
            <span>Help</span>
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
