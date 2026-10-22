import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Chip,
  TextField,
  Stack,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DownloadIcon from "@mui/icons-material/Download";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import VerifiedIcon from "@mui/icons-material/Verified";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import { fetchUserProfileData, updateUserProfile } from "../services/api";

const formatAchievementLabel = (ach) => {
  if (!ach) return "";
  const baseName = ach.achievement_name || "Achievement";
  const mult = Number(ach.multiplier) || 1;
  return mult > 1 ? `${baseName} (${mult}x)` : baseName;
};

function CyberGamerCard({
  user,
  region = "Asia",
  achievements = [],
  streak = 0,
  displayName,
}) {
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 900, letterSpacing: 2, color: "#00f2fe" }}
        >
          Number Flash
        </Typography>
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

      <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 3 }}>
        <Avatar
          src={user?.avatar}
          slotProps={{ htmlImg: { crossOrigin: "anonymous" } }}
          sx={{
            width: 80,
            height: 80,
            border: "3px solid #8b5cf6",
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
          }}
        />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {displayName || "Player"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontFamily: "monospace",
              mt: 0.5,
            }}
          >
            {user?.email || ""}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}
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
              TOP 10 STREAK
            </Typography>
          </Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, fontFamily: "monospace", color: "#f97316" }}
          >
            {streak} Seasons
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
            {streak > 0 ? "ELITE 🏆" : "UNRANKED"}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: "rgba(255, 255, 255, 0.6)",
            display: "block",
            mb: 1.5,
          }}
        >
          UNLOCKED ACHIEVEMENTS
        </Typography>
        {achievements.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.4)", fontStyle: "italic" }}
          >
            No achievements unlocked yet.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {achievements.map((ach, idx) => (
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
                label={formatAchievementLabel(ach)}
                size="small"
                sx={{
                  bgcolor: "rgba(139, 92, 246, 0.1)",
                  color: "#fff",
                  fontWeight: 700,
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
          {user?.accountUrl}
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

export default function UserProfileArea({
  user,
  region,
  onImageUpload,
  onSignOut,
  onBack,
}) {
  const fileInputRef = useRef(null);
  const [dbData, setDbData] = useState({ streak: 0, achievements: [] });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (user?.token) {
      fetchUserProfileData(user.token).then((data) => {
        if (isMounted && data && data.success) {
          setDbData({
            streak: data.streak || 0,
            achievements: data.achievements || [],
          });
          if (data.firstName) setFirstName(data.firstName);
          if (data.lastName) setLastName(data.lastName);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [user, user?.token]);

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!user?.token) return;
    setIsSaving(true);
    await updateUserProfile({ firstName, lastName }, user.token);
    setIsSaving(false);
  };

  const downloadGamerCard = async () => {
    const cardElement = document.getElementById("gamer-card-container");
    if (!cardElement) return;

    try {
      toast.info("Generating your Cyber-ID card...");
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#0a0f1d",
      });
      const imageLink = document.createElement("a");
      const cleanName =
        `${firstName} ${lastName}`.trim() || user?.name || "player";
      imageLink.download = `${cleanName.toLowerCase().replace(/\s+/g, "-")}-gamer-card.png`;
      imageLink.href = canvas.toDataURL("image/png");
      imageLink.click();
      toast.success("Gamer Card downloaded successfully!");
    } catch (err) {
      console.error("Gamer card generation error:", err);
      toast.error("Failed to generate gamer card image.");
    }
  };

  const computedDisplayName =
    `${firstName} ${lastName}`.trim() || user?.name || "Player";

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Player Profile
        </Typography>
        <Button onClick={onBack} variant="outlined">
          ← Back
        </Button>
      </Box>

      <Box
        sx={{
          mb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: 2, alignSelf: "flex-start" }}
        >
          🎮 Shareable Cyber-ID Gamer Card
        </Typography>
        <Box sx={{ mb: 3 }}>
          <CyberGamerCard
            user={user}
            region={region}
            achievements={dbData.achievements}
            streak={dbData.streak}
            displayName={computedDisplayName}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<DownloadIcon />}
          onClick={downloadGamerCard}
          sx={{
            fontWeight: "bold",
            textTransform: "none",
            px: 4,
            py: 1.5,
            borderRadius: 2,
          }}
        >
          Download Gamer Card (PNG)
        </Button>
      </Box>

      <Card
        sx={{
          bgcolor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 3,
          p: 3,
          mb: 4,
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <Box
            sx={{
              position: "relative",
              width: 110,
              height: 110,
              mx: "auto",
              mb: 2,
            }}
          >
            <Avatar
              src={user?.avatar}
              sx={{ width: 110, height: 110, border: "3px solid #00f2fe" }}
            />
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*"
              onChange={onImageUpload}
            />
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "#8b5cf6",
                color: "#fff",
                "&:hover": { bgcolor: "#7c3aed" },
              }}
            >
              <PhotoCameraIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {computedDisplayName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {user?.email}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSaveName}
            sx={{
              mb: 4,
              p: 3,
              bgcolor: "rgba(255,255,255,0.02)",
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, mb: 2, textAlign: "left" }}
            >
              ✏️ Edit Official Database Name
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mb: 2 }}
            >
              <TextField
                fullWidth
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                size="small"
              />
              <TextField
                fullWidth
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                size="small"
              />
            </Stack>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              startIcon={<SaveIcon />}
              disabled={isSaving}
              sx={{ float: "right", textTransform: "none", fontWeight: "bold" }}
            >
              {isSaving ? "Saving..." : "Save Name to Database"}
            </Button>
            <Box sx={{ clear: "both" }} />
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 3, my: 3 }}
          >
            <Box
              sx={{
                textAlign: "center",
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: "rgba(249, 115, 22, 0.1)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  color: "#f97316",
                }}
              >
                <WhatshotIcon />
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {dbData.streak} Seasons
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Top 10 Streak
              </Typography>
            </Box>
          </Box>

          <Box sx={{ my: 3, textAlign: "left" }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, mb: 1, color: "text.secondary" }}
            >
              Unlocked Achievements
            </Typography>
            {dbData.achievements.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                No achievements unlocked yet. Play matches and conquer season
                goals to earn badges!
              </Typography>
            ) : (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {dbData.achievements.map((ach, idx) => (
                  <Chip
                    key={idx}
                    icon={<VerifiedIcon sx={{ fontSize: "16px !important" }} />}
                    label={formatAchievementLabel(ach)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      <Button
        variant="outlined"
        color="error"
        fullWidth
        onClick={onSignOut}
        sx={{ py: 1.2 }}
      >
        Sign Out
      </Button>
    </Box>
  );
}
