/**
 * Login Page
 * Authentication page with role switcher for demo
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Select, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../../hooks/useAuth';
import { UserRole, RoleLabels } from '../../../types/auth.types';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, switchRole, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const result = await login(values);

      if (result.meta.requestStatus === 'fulfilled') {
        message.success('Login successful!');
        navigate('/dashboard');
      } else {
        message.error('Invalid email or password');
      }
    } catch (error) {
      message.error('Login failed. Please try again.');
    }
  };

  const handleRoleSwitch = () => {
    if (selectedRole) {
      switchRole(selectedRole);
      message.success(`Logged in as ${RoleLabels[selectedRole]}`);
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url(/login-bg.avif)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#f0f2f5',
      padding: '24px',
      overflow: 'auto',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        margin: '0 auto',
      }}>
        <Card
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <img
              src="/logo.png"
              alt="HekaBio Logo"
              style={{ height: 60, marginBottom: 16 }}
            />
            <Title level={3} style={{ margin: 0, color: 'var(--color-primary)' }}>
              Welcome to HekaBio
            </Title>
            <Paragraph type="secondary">
              Healthcare Innovation Management Platform
            </Paragraph>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                style={{ height: 44 }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <Divider>OR</Divider>

          <div style={{ marginTop: 24 }}>
            <Text strong style={{ display: 'block', marginBottom: 12 }}>
              Quick Demo Login (Select Role):
            </Text>
            <Select
              style={{ width: '100%', marginBottom: 16 }}
              placeholder="Select a role to demo"
              size="large"
              value={selectedRole}
              onChange={setSelectedRole}
            >
              <Option value={UserRole.SUPER_ADMIN}>{RoleLabels[UserRole.SUPER_ADMIN]}</Option>
              <Option value={UserRole.CRM_OWNER}>{RoleLabels[UserRole.CRM_OWNER]}</Option>
              <Option value={UserRole.GATE_1_ANALYST}>{RoleLabels[UserRole.GATE_1_ANALYST]}</Option>
              <Option value={UserRole.GATE_2_ANALYST}>{RoleLabels[UserRole.GATE_2_ANALYST]}</Option>
              <Option value={UserRole.GATE_3_DECISION_MAKER}>{RoleLabels[UserRole.GATE_3_DECISION_MAKER]}</Option>
              <Option value={UserRole.DD_SPECIALIST_SCIENTIFIC}>{RoleLabels[UserRole.DD_SPECIALIST_SCIENTIFIC]}</Option>
              <Option value={UserRole.PRODUCT_OWNER}>{RoleLabels[UserRole.PRODUCT_OWNER]}</Option>
              <Option value={UserRole.HOSPITAL_STAFF}>{RoleLabels[UserRole.HOSPITAL_STAFF]}</Option>
              <Option value={UserRole.DISTRIBUTOR_STAFF}>{RoleLabels[UserRole.DISTRIBUTOR_STAFF]}</Option>
              <Option value={UserRole.LICENSE_HOLDER_STAFF}>{RoleLabels[UserRole.LICENSE_HOLDER_STAFF]}</Option>
              <Option value={UserRole.MANUFACTURING_STAFF}>{RoleLabels[UserRole.MANUFACTURING_STAFF]}</Option>
            </Select>
            <Button
              block
              size="large"
              disabled={!selectedRole}
              onClick={handleRoleSwitch}
              style={{ height: 44 }}
            >
              Login as Selected Role
            </Button>
          </div>

          <Divider />

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Demo Accounts: Any email from mock users with password length ≥ 3
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Example: crm@hekabio.com / password
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}
