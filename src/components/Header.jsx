import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import { REGIONS } from "../config/constants";

export default function Header({
  region,
  setRegion,
  user,
  onOpenAuth,
  onOpenProfile,
  onGoHome,
}) {
  const [cardNumber, setCardNumber] = useState(371);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped((prev) => {
        const nextState = !prev;
        if (nextState) setCardNumber(Math.floor(100 + Math.random() * 900));
        return nextState;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#0f172a",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          py: { xs: 1, sm: 0 },
          gap: 1,
        }}
      >
        {/* Brand / Title with Non-Neon 3D Interactive Flipping Number Card */}
        <Box
          onClick={onGoHome}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <FlashOnIcon sx={{ color: "primary.main", fontSize: 28 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* 3D Flip Card for "NUMBER" */}
            <Box sx={{ perspective: "1000px", width: 130, height: 42 }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  textAlign: "center",
                  transition: "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)",
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateX(180deg)" : "rotateX(0deg)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                      color: "#fff",
                      letterSpacing: 1.5,
                    }}
                  >
                    NUMBER
                  </Typography>
                </Box>

                {/*Random Number*/}
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(59, 130, 246, 0.12)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    transform: "rotateX(180deg)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                      color: "primary.main",
                      fontFamily: "monospace",
                      fontSize: "1.4rem",
                    }}
                  >
                    {cardNumber}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Static "FLASH" string */}
            <Typography
              variant="h6"
              sx={{ fontWeight: 900, letterSpacing: 1.5, color: "#fff" }}
            >
              FLASH
            </Typography>
          </Box>
        </Box>

        {/* Controls & User Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: "auto" }}>
          {/* Region Selector */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              sx={{
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.03)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.12)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
                fontSize: "0.85rem",
              }}
            >
              {REGIONS.map((reg) => (
                <MenuItem key={reg} value={reg}>
                  {reg}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* User Auth / Profile Button */}
          {user ? (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<PersonIcon />}
              onClick={onOpenProfile}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              {user.name ? user.name.split(" ")[0] : "Profile"}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<LoginIcon />}
              onClick={onOpenAuth}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
