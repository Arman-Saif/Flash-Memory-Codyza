import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0a0f1d", paper: "#111827" },
    primary: { main: "#00f2fe" },
    secondary: { main: "#8b5cf6" },
    success: { main: "#10b981" },
    warning: { main: "#f59e0b" },
    error: { main: "#ef4444" },
  },
  typography: { fontFamily: '"Roboto", "Inter", sans-serif' },
});

export const MODES = {
  easy: {
    name: "Easy",
    start: 3,
    step: 1,
    color: "#10b981",
    baseGuessTime: 10,
    baseMemoryTime: 6,
    incrementTime: 2,
  },
  medium: {
    name: "Medium",
    start: 4,
    step: 2,
    color: "#00f2fe",
    baseGuessTime: 12,
    baseMemoryTime: 6,
    incrementTime: 2,
  },
  hard: {
    name: "Hard",
    start: 6,
    step: 3,
    color: "#f59e0b",
    baseGuessTime: 15,
    baseMemoryTime: 15,
    incrementTime: 2,
  },
  expert: {
    name: "Expert",
    start: 10,
    step: 5,
    color: "#ef4444",
    baseGuessTime: 30,
    baseMemoryTime: 30,
    incrementTime: 6,
  },
  legend: {
    name: "Legend",
    start: 15,
    step: "random",
    color: "#8b5cf6",
    baseGuessTime: 50,
    baseMemoryTime: 50,
    incrementTime: 6,
  },
};

export const REGIONS = [
  "Asia",
  "Europe",
  "North America",
  "South America",
  "All Servers (Mixed)",
];
