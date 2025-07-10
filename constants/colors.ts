export interface ColorScheme {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  lightGray: string;
  darkGray: string;
  black: string;
  white: string;
}

export const lightColors: ColorScheme = {
  primary: "#4A6FA5",
  secondary: "#B4D4FF",
  background: "#F5F7FA",
  card: "#FFFFFF",
  text: "#333333",
  border: "#E1E5EA",
  notification: "#FF4757",
  success: "#28C76F",
  error: "#EA5455",
  warning: "#FF9F43",
  info: "#00CFE8",
  lightGray: "#F0F2F5",
  darkGray: "#6E7A8A",
  black: "#000000",
  white: "#FFFFFF",
};

export const darkColors: ColorScheme = {
  primary: "#6B8DD6",
  secondary: "#3A4A6B",
  background: "#0F1419",
  card: "#1A1F2E",
  text: "#E8E9EA",
  border: "#2A2F3E",
  notification: "#FF6B7A",
  success: "#4AE54A",
  error: "#FF6B6B",
  warning: "#FFB347",
  info: "#4ECDC4",
  lightGray: "#2A2F3E",
  darkGray: "#8B949E",
  black: "#000000",
  white: "#FFFFFF",
};

// Legacy export for backward compatibility
export const colors = lightColors;