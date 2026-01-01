import type { ThemeConfig } from 'antd';

/**
 * HekaBio Platform Theme Configuration
 * Primary Brand Color: Teal (#00B8A9)
 * Tagline: "Miracles through Partnership"
 */
const theme: ThemeConfig = {
  token: {
    // Primary brand color - Teal from HekaBio logo
    colorPrimary: '#00B8A9',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    colorLink: '#00B8A9',

    // Typography
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,

    // Spacing & Layout
    borderRadius: 6,
    controlHeight: 36,

    // Colors
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',
  },

  components: {
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 64,
      headerPadding: '0 24px',
      siderBg: '#001529',
      bodyBg: '#f5f5f5',
    },

    Menu: {
      darkItemBg: '#001529',
      darkItemSelectedBg: '#00B8A9',
      darkItemHoverBg: '#006d63',
      darkItemColor: 'rgba(255, 255, 255, 0.85)',
      darkItemSelectedColor: '#ffffff',
    },

    Button: {
      colorPrimary: '#00B8A9',
      colorPrimaryHover: '#00a094',
      colorPrimaryActive: '#008f82',
      primaryShadow: '0 2px 0 rgba(0, 184, 169, 0.1)',
    },

    Card: {
      borderRadius: 8,
      boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
    },

    Table: {
      headerBg: '#fafafa',
      headerColor: 'rgba(0, 0, 0, 0.88)',
      rowHoverBg: '#f5f5f5',
    },

    Badge: {
      colorPrimary: '#00B8A9',
    },

    Tag: {
      defaultBg: '#fafafa',
    },
  },
};

export default theme;
