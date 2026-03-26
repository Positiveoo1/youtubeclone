'use client';

import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/auth.css';

export default function HelpPage() {
  const faqs = [
    {
      question: 'How do I search for videos?',
      answer: 'Use the search bar at the top to find videos by keyword, channel name, or topic.',
    },
    {
      question: 'How do I create an account?',
      answer: 'Click on the Sign Up button in the top right corner and fill in your details.',
    },
    {
      question: 'How do I like a video?',
      answer: 'Click the thumbs up icon below any video to like it.',
    },
    {
      question: 'How do I save a video to Watch Later?',
      answer: 'Click the bookmark icon below a video to save it for watching later.',
    },
    {
      question: 'How do I manage my subscriptions?',
      answer: 'Go to the Subscriptions page from the sidebar to view all your subscribed channels.',
    },
  ];

  return (
    <motion.div
      className="help-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <h1>❓ Help Center</h1>
        <p>Find answers to common questions</p>
      </div>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="faq-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </motion.div>
        ))}
      </div>

      <div className="help-footer">
        <p>Can't find what you're looking for?</p>
        <p>Contact us at ludlowbecker@gmail.com</p>
      </div>
    </motion.div>
  );
}
