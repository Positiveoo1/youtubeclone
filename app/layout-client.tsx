'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const { checkAuth } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    checkAuth();
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    // Apply theme to html and body elements
    if (isMounted) {
      const htmlElement = document.documentElement;
      const bodyElement = document.body;
      
      if (isDarkMode) {
        htmlElement.classList.remove('light');
        htmlElement.classList.add('dark');
        bodyElement.classList.remove('light');
        bodyElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        htmlElement.classList.remove('dark');
        htmlElement.classList.add('light');
        bodyElement.classList.remove('dark');
        bodyElement.classList.add('light');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [isDarkMode, isMounted]);

  if (!isMounted) return null;

  return (
    <div className={`layout-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="layout-container">
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <div className="layout-main">
          <Sidebar />
          <main className="layout-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
