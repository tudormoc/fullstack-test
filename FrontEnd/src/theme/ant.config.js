// Centralized Ant Design theme tokens
// Uses a refined indigo-teal palette with Inter font for a premium, distinctive feel

const sharedTokens = {
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  borderRadius: 10,
  wireframe: false,
  fontSize: 14,
  fontSizeHeading1: 28,
  fontSizeHeading2: 22,
  fontSizeHeading3: 18,
  controlHeight: 38,
  controlHeightSM: 30,
  motion: true
};

export const light = {
  token: {
    ...sharedTokens,
    colorPrimary: '#4f46e5', // Indigo-600: distinctive primary
    colorInfo: '#4f46e5',
    colorSuccess: '#10b981', // Emerald-500
    colorWarning: '#f59e0b', // Amber-500
    colorError: '#ef4444', // Red-500
    colorBgBase: '#fafafa',
    colorBgLayout: '#f3f4f6',
    colorBgContainer: '#ffffff',
    colorBorder: '#e5e7eb',
    colorBorderSecondary: '#f0f0f0',
    colorTextBase: '#1f2937',
    colorTextSecondary: '#6b7280'
  },
  components: {
    Card: {
      borderRadiusLG: 14
    },
    Table: {
      borderRadiusLG: 12
    },
    Button: {
      borderRadius: 8,
      controlHeight: 38,
      primaryShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
    },
    Input: {
      borderRadius: 8
    },
    Select: {
      borderRadius: 8
    },
    Modal: {
      borderRadiusLG: 16
    },
    Menu: {
      itemBorderRadius: 8,
      itemMarginInline: 8
    },
    Tag: {
      borderRadiusSM: 6
    },
    Statistic: {
      titleFontSize: 13
    }
  }
};

export const dark = {
  token: {
    ...sharedTokens,
    colorPrimary: '#818cf8', // Indigo-400: lighter for dark mode contrast
    colorInfo: '#818cf8',
    colorSuccess: '#34d399',
    colorWarning: '#fbbf24',
    colorError: '#f87171',
    colorBgBase: '#0f0f0f',
    colorBgLayout: '#141414',
    colorBgContainer: '#1a1a1a',
    colorBorder: '#2a2a2a',
    colorBorderSecondary: '#222222',
    colorTextBase: '#e5e7eb',
    colorTextSecondary: '#9ca3af'
  },
  components: {
    ...light.components,
    Button: {
      ...light.components.Button,
      primaryShadow: '0 2px 8px rgba(129, 140, 248, 0.2)'
    }
  }
};

export default {};
