import React from "react";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import PersonIcon from "@mui/icons-material/Person";
import { REGIONS } from "../config/constants";

export default function Header({
  region,
  setRegion,
  user,
  onOpenAuth,
  onOpenProfile,
  onGoHome,
}) {
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 3,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
        }}
        onClick={onGoHome}
      >
        <FlashOnIcon sx={{ color: "primary.main", fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1 }}>
          Number Flash
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="region-label">Region</InputLabel>
          <Select
            labelId="region-label"
            value={region}
            label="Region"
            onChange={(e) => setRegion(e.target.value)}
          >
            {REGIONS.map((reg) => (
              <MenuItem key={reg} value={reg}>
                📍 {reg}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {user ? (
          <Button
            variant="outlined"
            color="primary"
            onClick={onOpenProfile}
            startIcon={<PersonIcon />}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            {user.name}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={onOpenAuth}
            sx={{ fontWeight: "bold", textTransform: "none" }}
          >
            Sign In / Sign Up
          </Button>
        )}
      </Box>
    </Box>
  );
}
