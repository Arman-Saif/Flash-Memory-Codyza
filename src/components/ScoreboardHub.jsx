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
  Chip,
} from "@mui/material";
import { fetchLeaderboard, fetchUserRank } from "../services/api";
import { MODES } from "../config/constants";

export default function ScoreboardHub({ region, user }) {
  const [tabType, setTabType] = useState("all");
  const [modeKey, setModeKey] = useState("expert");
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStanding, setUserStanding] = useState(null);

  useEffect(() => {
    loadData();
  }, [region, tabType, modeKey]);

  const loadData = async () => {
    const data = await fetchLeaderboard({
      region,
      type: tabType,
      mode: modeKey,
    });
    setLeaderboard(data);

    if (user && user.token) {
      const rankData = await fetchUserRank({
        token: user.token,
        mode: modeKey,
        region,
      });
      setUserStanding(rankData);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 900, mb: 3, textAlign: "center" }}
      >
        Global Leaderboard
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
        <Tabs value={tabType} onChange={(e, val) => setTabType(val)}>
          <Tab label="All-Time" value="all" />
          <Tab label="Weekly" value="weekly" />
          <Tab label="Monthly" value="monthly" />
        </Tabs>
      </Box>

      {userStanding && userStanding.rank && (
        <Paper
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "rgba(0, 242, 254, 0.05)",
            border: "1px solid rgba(0, 242, 254, 0.2)",
            borderRadius: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body1">
            Your Standing in <strong>{region}</strong> ({MODES[modeKey].name}):
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Chip label={`Rank: #${userStanding.rank}`} color="primary" />
            <Chip
              label={`Top ${userStanding.userRank !== undefined && userStanding.userRank !== null ? userStanding.userRank : "--"}%`}
              color="secondary"
              variant="outlined"
            />
          </Box>
        </Paper>
      )}

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
              <TableCell sx={{ fontWeight: 700 }}># Rank</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Player</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Score
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{ py: 4, color: "text.secondary" }}
                >
                  No scores recorded for this filter yet.
                </TableCell>
              </TableRow>
            ) : (
              leaderboard.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: 700 }}>{index + 1}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: "primary.main",
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
