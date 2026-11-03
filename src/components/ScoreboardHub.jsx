import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Avatar,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ShareIcon from "@mui/icons-material/Share";
import { MODES } from "../config/constants";
import { getLeaderboard, getUserRank } from "../services/api";
import { toast } from "react-toastify";

export default function ScoreboardHub({ region, user, onSelectPublicProfile }) {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState("easy");
  const [leaderboardType, setLeaderboardType] = useState("all"); // 'all', 'weekly', 'monthly', 'seasonal'
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [seasonStartedAt, setSeasonStartedAt] = useState(null);
  const [seasonEndsAt, setSeasonEndsAt] = useState(null);
  const [userRankData, setUserRankData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData();
  }, [selectedMode, leaderboardType, region]);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      const res = await getLeaderboard({
        mode: selectedMode,
        type: leaderboardType,
        region,
        limit: 100,
      });

      if (res && res.success) {
        setLeaderboardData(res.leaderboard || []);
        setSeasonStartedAt(res.seasonStartedAt || null);
        setSeasonEndsAt(res.seasonEndsAt || null);
      } else {
        setLeaderboardData([]);
        setSeasonStartedAt(null);
        setSeasonEndsAt(null);
      }

      if (user && user.token) {
        const rankRes = await getUserRank(user.token, region, selectedMode);
        if (rankRes && rankRes.success) {
          setUserRankData(rankRes);
        }
      }
    } catch (err) {
      console.error("Error loading leaderboard:", err);
      toast.error("Failed to load leaderboard scores.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyProfileLink = (profileUrl, e) => {
    e.stopPropagation(); // Prevents row click navigation when clicking the share button
    const fullUrl = `${window.location.origin}/profile/${profileUrl}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Public profile link copied to clipboard!");
  };

  const handleRowClick = (profileUrl) => {
    if (!profileUrl) return;
    // Route cleanly using React Router or fallback callback
    if (onSelectPublicProfile) {
      onSelectPublicProfile(profileUrl);
    } else {
      navigate(`/profile/${profileUrl}`);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 950,
        mx: "auto",
        py: { xs: 2, md: 4 },
        px: { xs: 1.5, md: 0 },
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            mb: 1,
            fontSize: { xs: "2rem", sm: "2.5rem" },
          }}
        >
          Global Leaderboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Live rankings across all regions and game modes.
        </Typography>
      </Box>

      {/* Mode Selection Tabs */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
          overflowX: "auto",
        }}
      >
        <Tabs
          value={selectedMode}
          onChange={(e, val) => setSelectedMode(val)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {Object.entries(MODES).map(([key, mode]) => (
            <Tab
              key={key}
              label={mode.name}
              value={key}
              sx={{ fontWeight: "bold" }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Timeline Filter Tabs (All-Time, Weekly, Monthly, Seasonal) */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Tabs
          value={leaderboardType}
          onChange={(e, val) => setLeaderboardType(val)}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="All-Time" value="all" />
          <Tab label="Weekly" value="weekly" />
          <Tab label="Monthly" value="monthly" />
          <Tab label="Seasonal" value="seasonal" />
        </Tabs>
      </Box>

      {/* Season Timer / Date Range Banner (Only renders when NOT 'all' time) */}
      {leaderboardType !== "all" && seasonStartedAt && seasonEndsAt && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "rgba(59, 130, 246, 0.08)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            borderRadius: 3,
            p: 2,
            mb: 4,
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Season Start:{" "}
            <strong>{new Date(seasonStartedAt).toLocaleDateString()}</strong>
          </Typography>
          <Chip
            label={`Active ${leaderboardType.toUpperCase()} Season`}
            color="primary"
            size="small"
            variant="outlined"
            sx={{ fontWeight: "bold" }}
          />
          <Typography variant="body2" color="text.secondary">
            Season Ends:{" "}
            <strong>{new Date(seasonEndsAt).toLocaleDateString()}</strong>
          </Typography>
        </Box>
      )}

      {/* Active User Current Standing Card */}
      {user && userRankData && (
        <Box
          sx={{
            bgcolor: "rgba(99, 102, 241, 0.08)",
            border: "1px solid rgba(99, 102, 241, 0.25)",
            borderRadius: 3,
            p: 2.5,
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            cursor: user.profileUrl ? "pointer" : "default",
          }}
          onClick={() => user.profileUrl && handleRowClick(user.profileUrl)}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar src={user.avatar} sx={{ width: 44, height: 44 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                {user.name} (Your Current Rank)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Region: {region} | High Score: {userRankData.score || 0}
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={<EmojiEventsIcon />}
            label={
              userRankData.rank ? `#${userRankData.rank} Global` : "Unranked"
            }
            color="secondary"
            sx={{ fontWeight: "bold", fontSize: "0.95rem", py: 2, px: 1 }}
          />
        </Box>
      )}

      {/* Leaderboard Table */}
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
              <TableCell sx={{ fontWeight: 700, width: "80px" }}>
                Rank
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Player</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Server
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Score
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Share
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : leaderboardData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ py: 5, color: "text.secondary" }}
                >
                  No high scores recorded for this filter yet. Be the first to
                  set a record!
                </TableCell>
              </TableRow>
            ) : (
              leaderboardData.map((row, idx) => {
                const rank = idx + 1;
                return (
                  <TableRow
                    key={row.userId || idx}
                    hover
                    onClick={() => handleRowClick(row.profileUrl)}
                    sx={{
                      cursor: row.profileUrl ? "pointer" : "default",
                      bgcolor:
                        user && user.id === row.userId
                          ? "rgba(59, 130, 246, 0.12)"
                          : "transparent",
                    }}
                  >
                    <TableCell
                      sx={{ fontWeight: 800, fontFamily: "monospace" }}
                    >
                      {rank === 1
                        ? "🥇"
                        : rank === 2
                          ? "🥈"
                          : rank === 3
                            ? "🥉"
                            : `#${rank}`}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <Avatar
                          src={row.avatar}
                          sx={{ width: 34, height: 34 }}
                        />
                        <Box>
                          <Typography
                            sx={{ fontWeight: 700, fontSize: "0.95rem" }}
                          >
                            {row.username}
                          </Typography>
                          {row.streak > 0 && (
                            <Typography variant="caption" color="warning.main">
                              🔥 {row.streak} Season Streak
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.region}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: 900,
                        fontSize: "1.1rem",
                        color: "primary.main",
                      }}
                    >
                      {row.score}
                    </TableCell>
                    <TableCell align="right">
                      {row.profileUrl && (
                        <Button
                          size="small"
                          onClick={(e) =>
                            handleCopyProfileLink(row.profileUrl, e)
                          }
                          sx={{ minWidth: "auto", p: 0.8 }}
                        >
                          <ShareIcon fontSize="small" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
