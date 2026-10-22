import React from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import InteractiveTitleFlashCard from "./InteractiveTitleFlashCard";
import { MODES } from "../config/constants";

export default function HomeScreen({
  onSelectMode,
  onOpenScoreboard,
  onOpenHallOfFame,
}) {
  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <InteractiveTitleFlashCard />
      <Typography variant="h6" color="text.secondary" sx={{ mt: 1, mb: 5 }}>
        How many numbers can you remember?
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 6 }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<LeaderboardIcon />}
          onClick={onOpenScoreboard}
          sx={{ textTransform: "none", px: 3, borderRadius: 2 }}
        >
          View Scoreboards
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<EmojiEventsIcon />}
          onClick={onOpenHallOfFame}
          sx={{ textTransform: "none", px: 3, borderRadius: 2 }}
        >
          Hall of Fame
        </Button>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {Object.entries(MODES).map(([key, mode]) => (
          <Card
            key={key}
            onClick={() => onSelectMode(key)}
            sx={{
              cursor: "pointer",
              background: "rgba(255,255,255,0.02)",
              border: `1px solid rgba(255,255,255,0.08)`,
              borderRadius: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                borderColor: mode.color,
                boxShadow: `0 8px 30px rgba(0,0,0,0.4)`,
              },
            }}
          >
            <CardContent sx={{ p: 4, textAlign: "left" }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: mode.color,
                  mb: 2,
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {mode.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {key === "legend"
                  ? "Starts with 15 digits, increases randomly (7-20 range)"
                  : `Starts with ${mode.start} numbers, increases by +${mode.step} per round`}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
