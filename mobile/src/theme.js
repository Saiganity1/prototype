// Shared design tokens for the app
export const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  primary: '#2563EB',
  primaryDark: '#1E3A8A',
  accent: '#9333EA',
  text: '#1F2937',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  warning: '#F59E0B',
  success: '#10B981',
  danger: '#DC2626',
  overlay: 'rgba(0,0,0,0.35)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 18,
  pill: 999,
};

export const typography = {
  title: 22,
  subtitle: 16,
  body: 14,
  small: 12,
};

export const shadow = {
  card: {
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
};

export const categories = [
  { key: 'all', label: 'All' },
  { key: 'claimed', label: 'Found' },
  { key: 'electronics', label: 'Electronics' },
  { key: 'documents', label: 'Documents' },
  { key: 'clothing', label: 'Clothing' },
  { key: 'accessories', label: 'Accessories' },
  { key: 'other', label: 'Other' },
];
