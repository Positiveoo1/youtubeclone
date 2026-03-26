'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../../styles/auth.css';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    autoplay: true,
    quality: '720p',
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <motion.div
      className="settings-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <h1>⚙️ Settings</h1>
        <p>Customize your experience</p>
      </div>

      <div className="settings-container">
        <motion.div
          className="settings-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Display</h3>
          <div className="setting-item">
            <label>Dark Mode</label>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
            />
          </div>
        </motion.div>

        <motion.div
          className="settings-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3>Playback</h3>
          <div className="setting-item">
            <label>Autoplay</label>
            <input
              type="checkbox"
              checked={settings.autoplay}
              onChange={(e) => handleSettingChange('autoplay', e.target.checked)}
            />
          </div>
          <div className="setting-item">
            <label>Video Quality</label>
            <select
              value={settings.quality}
              onChange={(e) => handleSettingChange('quality', e.target.value)}
            >
              <option value="480p">480p</option>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
              <option value="4k">4K</option>
            </select>
          </div>
        </motion.div>

        <motion.div
          className="settings-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Notifications</h3>
          <div className="setting-item">
            <label>Enable Notifications</label>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleSettingChange('notifications', e.target.checked)}
            />
          </div>
        </motion.div>
      </div>

      <button className="save-settings-btn">Save Settings</button>
    </motion.div>
  );
}
