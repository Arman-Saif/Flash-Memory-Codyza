import React from "react";
import { Box, Typography, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { MODES } from "../config/constants";

export default function ModeIntroScreen({
  modeKey,
  localData,
  onReset,
  onStartGame,
  onBack,
}) {
  const mode = MODES[modeKey];
  const lastScore = localData?.lastScore || 0;
  const highScore = localData?.highScore || 0;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", textAlign: "center", py: 8 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, mb: 2, color: mode.color }}
      >
        {mode.name} Mode
      </Typography>
      <Box
        sx={{
          p: 4,
          my: 4,
          borderRadius: 3,
          bgcolor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
          Your last score was {lastScore}. Do you think you can beat this time
          😎
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Local High Score: <strong>{highScore}</strong>
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={onStartGame}
            sx={{
              px: 4,
              fontWeight: "bold",
              bgcolor: mode.color,
              color: "#000",
            }}
          >
            Start Game
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<RefreshIcon />}
            onClick={onReset}
          >
            Reset Score
          </Button>
        </Box>
      </Box>
      <Button
        onClick={onBack}
        sx={{ textTransform: "none", color: "text.secondary" }}
      >
        ← Back to Modes
      </Button>
    </Box>
  );
}
