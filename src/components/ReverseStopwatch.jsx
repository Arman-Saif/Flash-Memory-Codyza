import React from "react";
import { Box, Typography } from "@mui/material";
import TimerIcon from "@mui/icons-material/Timer";

export default function ReverseStopwatch({ timeLeft, label, color }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.5,
        px: 3,
        py: 1.2,
        borderRadius: 3,
        bgcolor: "rgba(17, 24, 39, 0.9)",
        border: `2px solid ${color}`,
        boxShadow: `0 0 20px ${color}40`,
        mb: 3,
      }}
    >
      <TimerIcon sx={{ color, fontSize: 32 }} />
      <Box sx={{ textAlign: "left" }}>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            display: "block",
            fontSize: "0.75rem",
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "monospace",
            fontWeight: 900,
            color: timeLeft <= 3 ? "#ef4444" : "#fff",
            lineHeight: 1,
          }}
        >
          {timeLeft}s
        </Typography>
      </Box>
    </Box>
  );
}
