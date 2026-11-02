import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RefreshIcon from "@mui/icons-material/Refresh";
import { MODES } from "../config/constants";

export default function ModeIntroScreen({
  modeKey,
  onReset,
  onStartGame,
  onBack,
}) {
  const mode = MODES[modeKey] || MODES.easy;
  const [scores, setScores] = useState({ lastScore: 0, highScore: 0 });

  const storageKey = `numflash_${modeKey}`;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
      setScores({
        lastScore: saved.lastScore || 0,
        highScore: saved.highScore || 0,
      });
    } catch (err) {
      console.error("Failed to load local scores:", err);
    }
  }, [storageKey]);

  const handleResetScore = () => {
    try {
      const fresh = { lastScore: 0, highScore: 0 };
      localStorage.setItem(storageKey, JSON.stringify(fresh));
      setScores(fresh);
    } catch (err) {
      console.error("Failed to reset score in localStorage:", err);
    }

    if (typeof onReset === "function") {
      onReset();
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        py: { xs: 4, md: 8 },
        px: { xs: 2, md: 0 },
      }}
    >
      <Button onClick={onBack} variant="outlined" sx={{ mb: 4 }}>
        ← Back to Modes
      </Button>

      <Paper
        sx={{
          p: { xs: 3, sm: 5 },
          bgcolor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 900, color: mode.color, mb: 1 }}
        >
          {mode.name} Mode
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Prepare to memorize sequences starting at length {mode.start}.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            mb: 4,
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={0.5}
            >
              LAST SCORE
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, fontFamily: "monospace" }}
            >
              {scores.lastScore}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={0.5}
            >
              PERSONAL HIGH SCORE
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                fontFamily: "monospace",
                color: "primary.main",
              }}
            >
              {scores.highScore}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            startIcon={<PlayArrowIcon />}
            onClick={onStartGame}
            sx={{
              py: 1.5,
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1.1rem",
            }}
          >
            Start Challenge
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<RefreshIcon />}
            onClick={handleResetScore}
            sx={{ py: 1.5, textTransform: "none" }}
          >
            Reset Score
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
