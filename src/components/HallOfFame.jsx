import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { fetchHallOfFameArchives } from "../services/api";
import { MODES } from "../config/constants";

export default function HallOfFame() {
  const [seasonType, setSeasonType] = useState("monthly");
  const [modeKey, setModeKey] = useState("expert");
  const [archives, setArchives] = useState([]);

  useEffect(() => {
    loadArchives();
  }, [seasonType, modeKey]);

  const loadArchives = async () => {
    const data = await fetchHallOfFameArchives({
      season_type: seasonType,
      mode: modeKey,
    });
    setArchives(data);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 900, mb: 3, textAlign: "center" }}
      >
        🏆 Hall of Fame Archives
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Tabs
          value={modeKey}
          onChange={(e, val) => setModeKey(val)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {Object.entries(MODES).map(([key, m]) => (
            <Tab key={key} label={m.name} value={key} />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Tabs value={seasonType} onChange={(e, val) => setSeasonType(val)}>
          <Tab label="Monthly Champions" value="monthly" />
          <Tab label="Weekly Champions" value="weekly" />
        </Tabs>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          bgcolor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 3,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Champion</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Region</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Winning Score
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {archives.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{ py: 4, color: "text.secondary" }}
                >
                  No archives found for this period.
                </TableCell>
              </TableRow>
            ) : (
              archives.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: 700 }}>{row.username}</TableCell>
                  <TableCell>{row.region}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: "secondary.main",
                    }}
                  >
                    {row.score}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
