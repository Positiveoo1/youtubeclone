'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuthStore } from '@/hooks/useAuth';
import '../../styles/auth.css';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await register(username, email, password);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="auth-card">
        <h1>Sign Up</h1>

        {success && (
          <Alert 
            icon={<CheckCircleIcon fontSize="inherit" />}
            severity="success" 
            sx={{ mb: 2, animation: 'slideIn 0.3s ease-in' }}
          >
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!success && (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
              Password must contain: 8+ chars, uppercase, lowercase, number, and special character (!@#$%^&*)
            </p>
            <button type="submit" disabled={isLoading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {isLoading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        )}

        {!success && (
          <p>
            Already have an account? <Link href="/login">Sign In</Link>
          </p>
        )}
      </div>
    </motion.div>
  );
}
