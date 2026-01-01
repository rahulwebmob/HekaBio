/**
 * Dashboard Page
 * Main dashboard after login (placeholder for now)
 */

import { Button, Card, Col, Row, Statistic, Typography } from 'antd';
import {
  ProjectOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleLabels } from '../types/auth.types';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <div style={{
        background: '#ffffff',
        padding: '20px 50px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src="/logo.png" alt="HekaBio" style={{ height: 40 }} />
          <Title level={4} style={{ margin: 0 }}>
            HekaBio Platform
          </Title>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <Text strong>{user?.fullName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {user?.role && RoleLabels[user.role]}
            </Text>
          </div>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '40px 50px' }}>
        <Title level={2}>
          Welcome, {user?.firstName}! 👋
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Your role: <strong>{user?.role && RoleLabels[user.role]}</strong>
        </Text>

        <div style={{ marginTop: 32 }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Projects"
                  value={42}
                  prefix={<ProjectOutlined />}
                  valueStyle={{ color: 'var(--color-primary)' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Active Pipeline"
                  value={28}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Completed"
                  value={12}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Pending Review"
                  value={8}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
          </Row>
        </div>

        <Card style={{ marginTop: 32 }}>
          <Title level={4}>🎉 Foundation Setup Complete!</Title>
          <Text>
            The HekaBio platform foundation is now ready. We have successfully set up:
          </Text>
          <ul style={{ marginTop: 16, fontSize: 15 }}>
            <li>✅ React 18 + TypeScript + Vite</li>
            <li>✅ Ant Design UI Library with custom teal theme</li>
            <li>✅ Redux Toolkit state management</li>
            <li>✅ React Router with protected routes</li>
            <li>✅ Mock authentication with 12 user roles</li>
            <li>✅ TypeScript type definitions for all entities</li>
            <li>✅ Landing page and login flow</li>
          </ul>
          <div style={{ marginTop: 24, padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
            <Text strong>📋 Next Steps - Phase 0.2:</Text>
            <ul style={{ marginTop: 8 }}>
              <li>Create AppLayout with Header, Sidebar, and navigation</li>
              <li>Build Address Book module (companies & contacts)</li>
              <li>Build Project management module</li>
              <li>Build Survey system</li>
              <li>...and 20+ more modules from the granular plan!</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
