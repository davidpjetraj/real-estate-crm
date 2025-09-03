import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0f1115",
      paper: "#151821",
    },
    text: {
      primary: "#e5e7eb",
      secondary: "#9ca3af",
    },
    primary: {
      main: "#60a5fa", // light blue
    },
    secondary: {
      main: "#3b82f6", // blue
    },
    divider: "#23262f",
  },
  shape: {
    borderRadius: 12,
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
    },
    primary: {
      main: "#3b82f6", // blue
    },
    secondary: {
      main: "#60a5fa", // light blue
    },
    divider: "#e5e7eb",
  },
  shape: {
    borderRadius: 12,
  },
});
