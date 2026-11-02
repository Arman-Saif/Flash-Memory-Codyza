import React from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { MODES } from "../config/constants";

export default function HomeScreen({
  onSelectMode,
  onOpenScoreboard,
  onOpenHallOfFame,
}) {
  return (
    <Box
      sx={{
        py: { xs: 3, md: 6 },
        px: { xs: 2, md: 0 },
        maxWidth: 1000,
        mx: "auto",
      }}
    >
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 900, mb: 1, fontSize: { xs: "2rem", sm: "3rem" } }}
        >
          Test Your Mental Agility
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: 600, mx: "auto" }}
        >
          Memorize flashing number sequences, beat your personal limits, and
          compete globally on the unified live leaderboard.
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<LeaderboardIcon />}
            onClick={onOpenScoreboard}
            sx={{ fontWeight: "bold", textTransform: "none", px: 3 }}
          >
            Global Leaderboard
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<EmojiEventsIcon />}
            onClick={onOpenHallOfFame}
            sx={{ fontWeight: "bold", textTransform: "none", px: 3 }}
          >
            Hall of Fame
          </Button>
        </Box>
      </Box>

      {/* Mode Selection Flex Container (Side-by-side or stacks if it doesn't fit) */}
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
        Select Game Mode
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {Object.entries(MODES).map(([key, mode]) => (
          <Box
            key={key}
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 16px)",
                md: "1 1 calc(33.333% - 24px)",
              },
              maxWidth: { xs: "100%", sm: "calc(50% - 16px)", md: "320px" },
            }}
          >
            <Card
              sx={{
                height: "100%",
                bgcolor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 3,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: "primary.main",
                  bgcolor: "rgba(59, 130, 246, 0.03)",
                },
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: mode.color, mb: 2 }}
                >
                  {mode.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, flexGrow: 1 }}
                >
                  Starting sequence length:{" "}
                  <strong>{mode.start} numbers</strong>. Test your limits with
                  dynamic timing rules.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => onSelectMode(key)}
                  sx={{
                    bgcolor: mode.color,
                    fontWeight: "bold",
                    textTransform: "none",
                    "&:hover": { bgcolor: mode.color, opacity: 0.9 },
                  }}
                >
                  Play {mode.name}
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
