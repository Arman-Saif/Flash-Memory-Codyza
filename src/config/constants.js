import { createTheme } from "@mui/material/styles";

export const REGIONS = [
  "All Servers (Mixed)",
  "Asia",
  "North America",
  "Europe",
  "South America",
  "Oceania",
];

export const MODES = {
  easy: {
    name: "Easy",
    start: 3,
    step: 2,
    baseMemoryTime: 4,
    color: "#38bdf8",
  },
  medium: {
    name: "Medium",
    start: 4,
    step: 2,
    baseMemoryTime: 4,
    color: "#818cf8",
  },
  hard: {
    name: "Hard",
    start: 5,
    step: 2,
    baseMemoryTime: 6,
    color: "#34d399",
  },
  expert: {
    name: "Expert",
    start: 6,
    step: 1,
    baseMemoryTime: 9,
    color: "#f472b6",
  },
  legend: {
    name: "Legend",
    start: 8,
    step: 1,
    baseMemoryTime: 9,
    color: "#fbbf24",
  },
};

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0a0f1d",
      paper: "#0f172a",
    },
    primary: {
      main: "#3b82f6",
    },
    secondary: {
      main: "#6366f1",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "html, body, #root": {
          minWidth: "300px",
          overflowX: "auto",
          backgroundColor: "#0a0f1d",
          margin: 0,
          padding: 0,
          width: "100%",
        },
      },
    },
  },
});
