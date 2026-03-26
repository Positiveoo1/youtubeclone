'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Box, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuthStore } from '@/hooks/useAuth';
import '../../styles/auth.css';

export default function LoginPage() {
  const router = useRouter();
  const { login, user: storeUser, isLoading: storeLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await login(email, password);
      setSuccess('Login successful! Redirecting...');
      
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
        <h1>Sign In</h1>
        
        {success && (
          <Alert 
            icon={<CheckCircleIcon fontSize="inherit" />}
            severity="success" 
            sx={{ mb: 2, animation: 'slideIn 0.3s ease-in' }}
          >
            {success}
          </Alert>
        )}

        {success && storeUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              padding: '16px',
              marginBottom: '16px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <p style={{ margin: '8px 0', fontWeight: 'bold' }}>Welcome back!</p>
            {storeUser.avatar && (
              <img 
                src={storeUser.avatar} 
                alt={storeUser.username}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  marginBottom: '8px'
                }}
              />
            )}
            <p style={{ margin: '8px 0' }}><strong>{storeUser.username}</strong></p>
            <p style={{ margin: '8px 0', color: '#666' }}>{storeUser.email}</p>
          </motion.div>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!success && (
          <form onSubmit={handleLogin}>
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
            <button type="submit" disabled={isLoading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {isLoading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        )}

        {!success && (
          <p>
            Don't have an account? <Link href="/register">Sign Up</Link>
          </p>
        )}
      </div>
    </motion.div>
  );
}
