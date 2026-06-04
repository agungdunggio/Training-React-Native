export const colors = {
  background: '#0B0C10',       // Immersive deep dark space background
  cardBg: '#1F2833',           // Charcoal gray slate for cards & modal panels
  primary: '#00263F',          // Vibrant cinematic cinema red (Netflix/IMDb accent style)
  secondary: '#01B4E4',        // Radiant theater gold for rating stars & tags
  variantSecondary: '#0BB5E0',          // Radiant theater gold for rating stars & tags
  white: '#FFFFFF',            // Crisp primary text / contrast areas
  black: '#000000',            // black
  gray100: '#F5F6F8',          // Soft high-contrast light gray
  gray300: '#C5C6C7',          // Muted text gray
  gray400: '#9CA3AF',          // Medium placeholders gray
  gray600: '#4B5563',          // Deep border/icon gray
  gray800: '#111827',          // Input backdrops dark gray
  border: '#2A2F35',           // Soft border separator colors
  error: '#EF4444',            // Intense warning red
  success: '#10B981',          // Success emerald green
  overlay: 'rgba(0, 0, 0, 0.75)' // Backdrop screen overlay shadow
} as const;

export type ColorType = typeof colors;
