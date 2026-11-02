import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Avatar,
  Divider,
} from "@mui/material";
import {
  fetchPublicProfileBySlug,
  fetchUserProfileData,
  updateUserProfile,
} from "../services/api";
import { toast } from "react-toastify";
import html2canvas from "html2canvas"; // Used for card downloading

export default function UserProfileArea({
  user,
  region,
  profileSlugToView,
  onImageUpload,
  onSignOut,
  onBack,
}) {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Editable form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const cardRef = useRef(null);

  // Determine whose profile is being loaded
  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setNotFound(false);

      if (profileSlugToView) {
        // Viewing someone else's profile via slug
        try {
          const res = await fetchPublicProfileBySlug(profileSlugToView);
          if (res && res.success && res.profile) {
            setProfileData(res.profile);
          } else {
            setNotFound(true);
          }
        } catch (err) {
          setNotFound(true);
        }
      } else if (user?.token) {
        // Viewing logged-in user's own profile
        try {
          const res = await fetchUserProfileData(user.token);
          if (res && res.success && res.user) {
            setProfileData(res.user);
            const parts = (res.user.name || "").split(" ");
            setFirstName(parts[0] || res.user.first_name || "");
            setLastName(parts.slice(1).join(" ") || res.user.last_name || "");
          } else if (user) {
            // Fallback to active session user object if backend fetch fails
            setProfileData(user);
            const parts = (user.name || "").split(" ");
            setFirstName(parts[0] || "");
            setLastName(parts.slice(1).join(" ") || "");
          } else {
            setNotFound(true);
          }
        } catch (err) {
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }
    loadProfile();
  }, [profileSlugToView, user]);

  // Update browser URL to support /profile/nameslug without crashing single-page app state
  useEffect(() => {
    if (profileSlugToView) {
      window.history.replaceState(null, "", `/profile/${profileSlugToView}`);
    } else {
      window.history.replaceState(null, "", `/profile`);
    }
    return () => {
      window.history.replaceState(null, "", `/`);
    };
  }, [profileSlugToView]);

  // Check if the viewer is the absolute owner of this profile
  const isOwner =
    user &&
    profileData &&
    (user.id === profileData.id || user.email === profileData.email);

  // Handle saving editable details
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.token) return;

    const updatedInfo = { firstName, lastName };
    const res = await updateUserProfile(updatedInfo, user.token);
    if (res && res.success) {
      toast.success("Profile updated successfully!");
      setProfileData((prev) => ({
        ...prev,
        name: `${firstName} ${lastName}`.trim(),
        profileUrl: res.profile?.profileUrl || prev.profileUrl,
      }));
    } else {
      toast.error(res?.error || "Failed to update profile.");
    }
  };

  // Copy Profile Link handler
  const handleCopySlugLink = () => {
    const slug = profileData?.profileUrl;
    if (!slug) return;
    const fullUrl = `${window.location.origin}/profile/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Public profile link copied to clipboard!");
  };

  // Download Gamer Card handler (Strictly restricted to Owner)
  const handleDownloadCard = async () => {
    if (!isOwner) {
      toast.error("You cannot download another user's gamer card!");
      return;
    }
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: "#0f172a",
      });
      const image = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = image;
      a.download = `${profileData?.name || "gamer"}_card.png`;
      a.click();
      toast.success("Gamer card downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download gamer card.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography color="text.secondary">Loading profile...</Typography>
      </Box>
    );
  }

  // 🛑 404 NOT FOUND SCREEN (If account slug doesn't exist)
  if (notFound || !profileData) {
    return (
      <Box
        sx={{
          maxWidth: "500px",
          mx: "auto",
          mt: { xs: 4, md: 8 },
          p: 4,
          textAlign: "center",
          bgcolor: "background.paper",
          borderRadius: 4,
          border: "1px solid rgba(239, 68, 68, 0.2)",
        }}
      >
        <Typography variant="h4" fontWeight="900" color="#f87171" gutterBottom>
          404 - Account Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The player profile or username slug you are looking for does not exist
          or may have been removed.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            ← Return to Home
          </Button>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "700px",
        mx: "auto",
        mt: { xs: 2, md: 4 },
        p: { xs: 2, md: 3 },
        minWidth: "300px",
      }}
    >
      {/* Top Header Navigation */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {profileData?.name
            ? `${profileData.name}'s Profile`
            : "Player Profile"}
        </Typography>
        <Button
          variant="outlined"
          onClick={onBack}
          size="small"
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          ← Back
        </Button>
      </Box>

      {/* GAMER CARD CONTAINER (Captured for Download) */}
      <Box
        ref={cardRef}
        sx={{
          p: 3,
          borderRadius: 4,
          bgcolor: "background.paper",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          boxShadow: "0 0 25px rgba(59, 130, 246, 0.15)",
          textAlign: "center",
          position: "relative",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="caption"
            fontWeight="bold"
            color="primary.main"
            sx={{ letterSpacing: 1 }}
          >
            ⚡ Number Flash
          </Typography>
          <Typography
            variant="caption"
            sx={{
              px: 1.5,
              py: 0.5,
              bgcolor: "rgba(59,130,246,0.1)",
              borderRadius: 1,
              color: "primary.main",
              fontWeight: "bold",
            }}
          >
            📍 {region.toUpperCase()}
          </Typography>
        </Box>

        <Avatar
          src={
            profileData?.avatar ||
            profileData?.avatar_url ||
            "https://i.pravatar.cc/150?img=33"
          }
          alt={profileData?.name}
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            mb: 2,
            border: "2px solid #3b82f6",
          }}
        />

        <Typography variant="h6" fontWeight="bold">
          {profileData?.name || "Player"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {profileData?.email || ""}
        </Typography>

        {/* Stats Row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            my: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: "rgba(0,0,0,0.2)",
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              WIN STREAK
            </Typography>
            <Typography variant="h6" fontWeight="800" color="#fbbf24">
              {profileData?.streak || 0} Days
            </Typography>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: "rgba(0,0,0,0.2)",
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              RANK TIER
            </Typography>
            <Typography variant="h6" fontWeight="800" color="#38bdf8">
              {profileData?.rank || "UNRANKED"}
            </Typography>
          </Paper>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ fontStyle: "italic", mb: 2 }}
        >
          Powered By Codyza
        </Typography>
      </Box>

      {/* DOWNLOAD BUTTON (Visible only to the card owner) */}
      {isOwner ? (
        <Button
          variant="contained"
          fullWidth
          onClick={handleDownloadCard}
          sx={{
            mb: 4,
            py: 1.5,
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Download Gamer Card (PNG) 📥
        </Button>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 4,
            textAlign: "center",
            bgcolor: "rgba(239, 68, 68, 0.05)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="#f87171">
            🔒 You are viewing a public profile. Only the account owner can
            download this Gamer Card.
          </Typography>
        </Paper>
      )}

      {/* EDIT PROFILE & SLUG DISPLAY AREA (Strictly for Owner Account) */}
      {isOwner && (
        <Paper
          component="form"
          onSubmit={handleSaveProfile}
          elevation={0}
          sx={{
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid rgba(255, 255, 255, 0.08)",
            mb: 4,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "primary.main" }}
          >
            ✏️ Edit Profile Details
          </Typography>
          <Divider sx={{ mb: 3, borderColor: "rgba(255,255,255,0.08)" }} />

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="First Name"
              variant="outlined"
              size="small"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              size="small"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Save Profile Details
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={onSignOut}
              sx={{ textTransform: "none", fontWeight: "bold", ml: "auto" }}
            >
              Sign Out
            </Button>
          </Box>
        </Paper>
      )}

      {/* 🚀 PUBLIC SLUG LINK BOX (Visible only to Owner when a slug exists) */}
      {isOwner && profileData?.profileUrl && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: "rgba(59, 130, 246, 0.05)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            borderRadius: 3,
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color="primary.main"
            gutterBottom
          >
            🔗 Your Public Profile Share Link
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Share this link with friends or use it anywhere to show off your
            rank and win streak!
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              bgcolor: "rgba(0,0,0,0.3)",
              p: 1.5,
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.08)",
              overflowX: "auto",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                color: "#38bdf8",
                fontWeight: "bold",
                whiteSpace: "nowrap",
              }}
            >
              {window.location.origin}/profile/{profileData.profileUrl}
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={handleCopySlugLink}
              sx={{
                ml: "auto",
                textTransform: "none",
                fontWeight: "bold",
                minWidth: "90px",
              }}
            >
              Copy Link
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
