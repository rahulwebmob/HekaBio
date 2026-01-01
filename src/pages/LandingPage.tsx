/**
 * Landing Page - Simple redirect to login
 * Main website is at hekabio.com - this is the APPLICATION platform
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login immediately
    navigate('/login');
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#f5f5f5',
    }}>
      <Spin size="large" tip="Redirecting to HekaBio Platform..." />
    </div>
  );
}
