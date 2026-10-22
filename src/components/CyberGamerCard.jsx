import React from "react";
import { Box, Typography, Avatar, Chip } from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import VerifiedIcon from "@mui/icons-material/Verified";
import FlashOnIcon from "@mui/icons-material/FlashOn";

export default function CyberGamerCard({ user, region = "Asia" }) {
  const currentStreak = user.streak ?? 0;
  const userAchievements = user.achievements || [];

  return (
    <Box
      id="gamer-card-container"
      sx={{
        width: 450,
        p: 4,
        background: "linear-gradient(135deg, #0a0f1d 0%, #111827 100%)",
        border: "2px solid #00f2fe",
        borderRadius: 4,
        boxShadow: "0 0 40px rgba(0, 242, 254, 0.25)",
        color: "#fff",
        fontFamily: '"Roboto", "Inter", sans-serif',
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 150,
          height: 150,
          bgcolor: "rgba(139, 92, 246, 0.15)",
          borderRadius: "50%",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FlashOnIcon sx={{ color: "#00f2fe", fontSize: 22 }} />
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 900, letterSpacing: 2, color: "#00f2fe" }}
          >
            Number Flash
          </Typography>
        </Box>
        <Chip
          label={`📍 ${region.toUpperCase()}`}
          size="small"
          sx={{
            bgcolor: "rgba(0, 242, 254, 0.1)",
            color: "#00f2fe",
            fontWeight: 700,
            border: "1px solid rgba(0, 242, 254, 0.3)",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2.5,
          mb: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Avatar
          src={user.avatar}
          sx={{
            width: 80,
            height: 80,
            border: "3px solid #8b5cf6",
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
          }}
        />
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 900, letterSpacing: 0.5, lineHeight: 1.2 }}
          >
            {user.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontFamily: "monospace",
              mt: 0.5,
            }}
          >
            {user.email}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          mb: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "#f97316",
              mb: 0.5,
            }}
          >
            <WhatshotIcon fontSize="small" />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              WIN STREAK
            </Typography>
          </Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, fontFamily: "monospace", color: "#f97316" }}
          >
            {currentStreak} Days
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: "rgba(255, 255, 255, 0.6)",
              display: "block",
              mb: 0.5,
            }}
          >
            RANK TIER
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: 900, fontFamily: "monospace", color: "#00f2fe" }}
          >
            {currentStreak > 0 ? "ELITE 🏆" : "UNRANKED"}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 3, position: "relative", zIndex: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: "rgba(255, 255, 255, 0.6)",
            display: "block",
            mb: 1.5,
          }}
        >
          FEATURED ACHIEVEMENTS
        </Typography>
        {userAchievements.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.4)", fontStyle: "italic" }}
          >
            No achievements unlocked yet. Play games to earn badges!
          </Typography>
        ) : (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {userAchievements.map((ach, idx) => (
              <Chip
                key={idx}
                icon={
                  <VerifiedIcon
                    sx={{
                      fontSize: "14px !important",
                      color: "#8b5cf6 !important",
                    }}
                  />
                }
                label={ach}
                size="small"
                sx={{
                  bgcolor: "rgba(139, 92, 246, 0.1)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          pt: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontFamily: "monospace",
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "0.7rem",
          }}
        >
          {user.accountUrl}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 900,
            color: "rgba(255, 255, 255, 0.3)",
            fontSize: "0.7rem",
            letterSpacing: 1,
          }}
        >
          POWERED BY CODYZA
        </Typography>
      </Box>
    </Box>
  );
}
