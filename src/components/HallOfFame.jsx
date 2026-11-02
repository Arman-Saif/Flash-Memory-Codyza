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
  Avatar,
  Chip,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import StarIcon from "@mui/icons-material/Star";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function HallOfFame() {
  const [seasonType, setSeasonType] = useState("monthly");
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchives();
  }, [seasonType]);

  const fetchArchives = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/leaderboard/archives?season_type=${seasonType}`,
      );
      const data = await res.json();
      if (res.ok && data.archives) {
        setArchives(data.archives);
      } else {
        setArchives([]);
      }
    } catch (err) {
      console.error("Failed to fetch archives:", err);
      setArchives([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        py: { xs: 2, md: 4 },
        px: { xs: 2, md: 0 },
      }}
    >
      {/* Header Section */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            mb: 1,
            fontSize: { xs: "2rem", sm: "2.5rem" },
          }}
        >
          Hall of Fame
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Honoring past legendary champions, historic season records, and elite
          memory masters.
        </Typography>
      </Box>

      {/* Hall of Fame Highlights Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid xs={12} sm={4}>
          <Card
            sx={{
              bgcolor: "rgba(59, 130, 246, 0.03)",
              border: "1px solid rgba(59, 130, 246, 0.15)",
              borderRadius: 3,
              textAlign: "center",
              p: 2,
            }}
          >
            <CardContent>
              <EmojiEventsIcon
                sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Monthly Legends
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Top performers crowned at the end of every calendar cycle.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={4}>
          <Card
            sx={{
              bgcolor: "rgba(99, 102, 241, 0.03)",
              border: "1px solid rgba(99, 102, 241, 0.15)",
              borderRadius: 3,
              textAlign: "center",
              p: 2,
            }}
          >
            <CardContent>
              <MilitaryTechIcon
                sx={{ fontSize: 40, color: "secondary.main", mb: 1 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Weekly Elites
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fastest minds dominating weekly sprint challenges.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={4}>
          <Card
            sx={{
              bgcolor: "rgba(245, 158, 11, 0.03)",
              border: "1px solid rgba(245, 158, 11, 0.15)",
              borderRadius: 3,
              textAlign: "center",
              p: 2,
            }}
          >
            <CardContent>
              <StarIcon sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                All-Time Records
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The highest scores ever achieved in Number Flash history.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Season Type Selection Tabs */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 4,
          overflowX: "auto",
        }}
      >
        <Tabs value={seasonType} onChange={(e, val) => setSeasonType(val)}>
          <Tab label="Monthly Archives" value="monthly" />
          <Tab label="Weekly Archives" value="weekly" />
          <Tab label="Seasonal Champions" value="seasonal" />
        </Tabs>
      </Box>

      {/* Archives Table */}
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
              <TableCell sx={{ fontWeight: 700 }}>Season ID / Period</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Champion Player</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Mode
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Winning Score
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{ py: 4, color: "text.secondary" }}
                >
                  Loading historical archives...
                </TableCell>
              </TableRow>
            ) : archives.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{ py: 4, color: "text.secondary" }}
                >
                  No historical archives found for this category yet. Check back
                  soon!
                </TableCell>
              </TableRow>
            ) : (
              archives.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell sx={{ fontWeight: 700, fontFamily: "monospace" }}>
                    {row.season_id || row.period || "Archive # " + (index + 1)}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Avatar
                        src={
                          row.avatar ||
                          `https://i.pravatar.cc/150?u=${row.username}`
                        }
                        sx={{ width: 32, height: 32 }}
                      />
                      <Typography sx={{ fontWeight: 600 }}>
                        {row.username || "Legendary Player"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.mode || "expert"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 800,
                      fontSize: "1.1rem",
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
