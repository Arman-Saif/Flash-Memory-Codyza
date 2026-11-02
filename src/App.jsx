import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { darkTheme } from "./config/constants";
import { supabase } from "./config/supabaseClient";
import Header from "./components/Header";
import AuthModal from "./components/AuthModal";
import HomeScreen from "./components/HomeScreen";
import ModeIntroScreen from "./components/ModeIntroScreen";
import GameArena from "./components/GameArena";
import ScoreboardHub from "./components/ScoreboardHub";
import HallOfFame from "./components/HallOfFame";
import UserProfileArea from "./components/UserProfileArea";
import {
  uploadProfilePicture,
  generateProfileSlug,
  syncLocalScoresToServer,
  fetchUserProfileData,
} from "./services/api";

function GameRouteGuard({
  user,
  region,
  activeMode,
  localData,
  onGameOver,
  onReturnHome,
}) {
  const location = useLocation();

  // If user tries to load /game directly without clicking "Start" from the intro/lobby
  if (!location.state || !location.state.fromLobby) {
    return <Navigate to="/" replace />;
  }

  const modeKey = location.state.modeKey || activeMode;

  return (
    <>
      <Helmet>
        <title>Playing Number Flash | Focus Arena</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <GameArena
        modeKey={modeKey}
        region={region}
        user={user}
        onGameOver={onGameOver}
        onReturnHome={onReturnHome}
      />
    </>
  );
}

// Public SEO-Friendly Profile Wrapper for /profile/:slug
function PublicProfileRouteWrapper({
  user,
  region,
  onImageUpload,
  onSignOut,
  onBack,
}) {
  const { slug } = useParams();

  return (
    <>
      <Helmet>
        <title>{`${slug.replace(/[-_]/g, " ")} | Number Flash Gamer Profile`}</title>
        <meta
          name="description"
          content={`Check out public high scores, rank tiers, and win streaks for ${slug} on Number Flash!`}
        />
      </Helmet>
      <UserProfileArea
        user={user}
        region={region}
        profileSlugToView={slug}
        onImageUpload={onImageUpload}
        onSignOut={onSignOut}
        onBack={onBack}
      />
    </>
  );
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function App() {
  const [user, setUser] = useState(null);
  const [region, setRegion] = useState("Asia");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeMode, setActiveMode] = useState("easy"); // 🛠️ Default changed to "easy"
  const [localData, setLocalData] = useState({ lastScore: 0, highScore: 0 });

  // 🚀 Robust initialization: Checks session directly on load/refresh & syncs exact DB slug
  useEffect(() => {
    async function initSession() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (session && session.user) {
          await handleUserLoginSession(session);
        } else {
          localStorage.removeItem("user_data");
          setUser(null);
        }
      } catch (err) {
        console.error("Session initialization error:", err);
      }
    }

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          await handleUserLoginSession(session);
        } else if (event === "SIGNED_OUT") {
          localStorage.removeItem("user_data");
          setUser(null);
        }
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleUserLoginSession = async (session) => {
    const u = session.user;
    const token = session.access_token;

    let firstName = u.user_metadata?.first_name || u.email.split("@")[0];
    let lastName = u.user_metadata?.last_name || "";
    let fullName = `${firstName} ${lastName}`.trim();
    let slug =
      u.user_metadata?.profile_url || generateProfileSlug(firstName, lastName);

    // 🔍 Fetch authoritative profile data from backend to get the exact DB slug with its suffix
    try {
      const res = await fetchUserProfileData(token);
      if (res && res.success && res.user) {
        slug = res.user.profileUrl || res.user.profile_url || slug;
        fullName = res.user.name || fullName;
      }
    } catch (err) {
      console.error(
        "Could not fetch authoritative backend slug during session load:",
        err,
      );
    }

    const loggedInUser = {
      id: u.id,
      name: fullName,
      email: u.email,
      avatar: u.user_metadata?.avatar_url || "https://i.pravatar.cc/150?img=33",
      token: token,
      profileUrl: slug,
      streak: 0,
      achievements: [],
    };

    // Save state & cache securely in localStorage
    setUser(loggedInUser);
    localStorage.setItem("user_data", JSON.stringify(loggedInUser));

    const allLocalScores = {};
    ["easy", "medium", "hard", "expert", "legend"].forEach((mKey) => {
      const saved = JSON.parse(localStorage.getItem(`numflash_${mKey}`));
      if (saved && saved.highScore > 0) {
        allLocalScores[mKey] = saved.highScore;
      }
    });

    if (Object.keys(allLocalScores).length > 0) {
      await syncLocalScoresToServer(allLocalScores, token);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user_data");
    setUser(null);
    window.location.href = "/";
    toast.info("Signed out.");
  };

  const handleResetScore = () => {
    const fresh = { lastScore: 0, highScore: 0 };
    localStorage.setItem(`numflash_${activeMode}`, JSON.stringify(fresh));
    setLocalData(fresh);
    toast.info("Scores reset for this mode.");
  };

  const handleGameOver = (score) => {
    const newHigh = Math.max(score, localData.highScore);
    const updatedLocal = { lastScore: score, highScore: newHigh };
    localStorage.setItem(
      `numflash_${activeMode}`,
      JSON.stringify(updatedLocal),
    );
    setLocalData(updatedLocal);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64Data = await uploadProfilePicture(file, user?.token);
    if (base64Data && user) {
      const updatedUser = { ...user, avatar: base64Data };
      setUser(updatedUser);
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
    }
  };

  return (
    <HelmetProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ToastContainer position="bottom-right" theme="dark" />

        <Router>
          {/* Root Layout Wrapper enforcing 300px min width floor */}
          <Box
            sx={{
              minWidth: "300px",
              width: "100%",
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Navigation / Header Bar */}
            <Header
              region={region}
              setRegion={setRegion}
              user={user}
              onOpenAuth={() => setAuthModalOpen(true)}
              onOpenProfile={() => {
                window.location.href = user?.profileUrl
                  ? `/profile/${user.profileUrl}`
                  : "/profile";
              }}
              onGoHome={() => (window.location.href = "/")}
            />

            {/* Main Content Container with Route Switcher */}
            <Container
              maxWidth="lg"
              sx={{ py: { xs: 2, md: 3 }, minWidth: "300px", flexGrow: 1 }}
            >
              <Routes>
                {/* HOME ROUTE */}
                <Route
                  path="/"
                  element={
                    <>
                      <Helmet>
                        <title>
                          Number Flash | Global Leaderboard & Brain Speed Test
                        </title>
                        <meta
                          name="description"
                          content="Test your number memory speed, compete on global regional leaderboards, and climb rank tiers in Number Flash!"
                        />
                        <meta
                          property="og:title"
                          content="Number Flash | Brain Speed Test"
                        />
                        <meta
                          property="og:description"
                          content="Test your memory speed and climb global regional leaderboards!"
                        />
                        <meta property="og:type" content="website" />
                      </Helmet>

                      <HomeScreen
                        onSelectMode={(modeKey) => {
                          setActiveMode(modeKey);
                          const saved = JSON.parse(
                            localStorage.getItem(`numflash_${modeKey}`),
                          ) || {
                            lastScore: 0,
                            highScore: 0,
                          };
                          setLocalData(saved);
                          window.location.href = `/intro/${modeKey}`;
                        }}
                        onOpenScoreboard={() =>
                          (window.location.href = "/scoreboard")
                        }
                        onOpenHallOfFame={() =>
                          (window.location.href = "/halloffame")
                        }
                      />
                    </>
                  }
                />

                {/* MODE INTRO SCREEN ROUTE */}
                <Route
                  path="/intro/:modeKey"
                  element={
                    <>
                      <Helmet>
                        <title>Mode Rules & Info | Number Flash</title>
                      </Helmet>
                      <ModeIntroScreenContent
                        activeMode={activeMode}
                        localData={localData}
                        onReset={handleResetScore}
                        onBack={() => (window.location.href = "/")}
                      />
                    </>
                  }
                />

                {/* RESTRICTED GAME ARENA ROUTE */}
                <Route
                  path="/game"
                  element={
                    <GameRouteGuard
                      user={user}
                      region={region}
                      activeMode={activeMode}
                      localData={localData}
                      onGameOver={handleGameOver}
                      onReturnHome={() => (window.location.href = "/")}
                    />
                  }
                />

                {/* SCOREBOARD HUB ROUTE */}
                <Route
                  path="/scoreboard"
                  element={
                    <>
                      <Helmet>
                        <title>Global Leaderboards | Number Flash</title>
                        <meta
                          name="description"
                          content="Check live regional rankings, weekly seasons, and top memory champions on Number Flash."
                        />
                      </Helmet>
                      <ScoreboardHub
                        region={region}
                        user={user}
                        onSelectPublicProfile={(slug) => {
                          window.location.href = `/profile/${slug}`;
                        }}
                      />
                    </>
                  }
                />

                {/* HALL OF FAME ROUTE */}
                <Route
                  path="/halloffame"
                  element={
                    <>
                      <Helmet>
                        <title>Global Leaderboards | Number Flash</title>
                        <meta
                          name="description"
                          content="Check live regional rankings, weekly seasons, and top memory champions on Number Flash."
                        />
                      </Helmet>
                      <HallOfFame />
                    </>
                  }
                />

                {/* PUBLIC PROFILE ROUTE VIA SLUG */}
                <Route
                  path="/profile/:slug"
                  element={
                    <PublicProfileRouteWrapper
                      user={user}
                      region={region}
                      onImageUpload={handleImageUpload}
                      onSignOut={handleSignOut}
                      onBack={() => (window.location.href = "/")}
                    />
                  }
                />

                {/* LOGGED-IN USER PRIVATE PROFILE ROUTE */}
                <Route
                  path="/profile"
                  element={
                    <>
                      <Helmet>
                        <title>My Player Profile | Number Flash</title>
                        <meta name="robots" content="noindex, nofollow" />
                      </Helmet>
                      <UserProfileArea
                        user={user}
                        region={region}
                        profileSlugToView={null}
                        onImageUpload={handleImageUpload}
                        onSignOut={handleSignOut}
                        onBack={() => (window.location.href = "/")}
                      />
                    </>
                  }
                />

                {/* 404 CATCH-ALL ROUTE */}
                <Route
                  path="*"
                  element={
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Helmet>
                        <title>404 Page Not Found | Number Flash</title>
                      </Helmet>
                      <Typography variant="h5" color="error" gutterBottom>
                        404 - Page Not Found
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        The page or player profile you requested does not exist.
                      </Typography>
                      <Box
                        component="a"
                        href="/"
                        sx={{
                          color: "primary.main",
                          fontWeight: "bold",
                          textDecoration: "none",
                        }}
                      >
                        ← Return to Home
                      </Box>
                    </Box>
                  }
                />
              </Routes>
            </Container>

            {/* Powered By Codyza Footer */}
            <Box
              component="footer"
              sx={{
                py: 2.5,
                textAlign: "center",
                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                bgcolor: "background.paper",
                mt: "auto",
                minWidth: "300px",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.85rem" }}
              >
                Powered By{" "}
                <Box
                  component="a"
                  href="https://codyza.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                    fontSize: "1rem",
                    "&:hover": {
                      color: "primary.main",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Codyza
                </Box>
              </Typography>
            </Box>
          </Box>

          {/* Authentication Modal Dialog */}
          <AuthModal
            open={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onAuthSuccess={(userData) => {
              setUser(userData);
              localStorage.setItem("user_data", JSON.stringify(userData));
              setAuthModalOpen(false);
            }}
          />
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

// Helper wrapper component to hook URL params for Mode Intro view
function ModeIntroScreenContent({ activeMode, localData, onReset, onBack }) {
  const { modeKey } = useParams();
  const currentMode = modeKey || activeMode;
  const navigate = useNavigate();

  return (
    <ModeIntroScreen
      modeKey={currentMode}
      localData={localData}
      onReset={onReset}
      onStartGame={() => {
        navigate("/game", { state: { fromLobby: true, modeKey: currentMode } });
      }}
      onBack={onBack}
    />
  );
}
