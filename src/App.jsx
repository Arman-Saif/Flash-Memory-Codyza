import React, { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline, Container } from "@mui/material";
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
import { uploadProfilePicture } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [region, setRegion] = useState("Asia");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const [activeMode, setActiveMode] = useState("expert");
  const [localData, setLocalData] = useState({ lastScore: 0, highScore: 0 });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const u = session.user;
        const fullName = u.user_metadata?.first_name
          ? `${u.user_metadata.first_name} ${u.user_metadata.last_name || ""}`.trim()
          : u.email.split("@")[0];
        const profileSlug = fullName.toLowerCase().replace(/\s+/g, "-");

        setUser({
          id: u.id,
          name: fullName,
          email: u.email,
          avatar:
            u.user_metadata?.avatar_url || "https://i.pravatar.cc/150?img=33",
          token: session.access_token,
          streak: 0,
          achievements: [],
        });
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") setUser(null);
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleSelectMode = (modeKey) => {
    setActiveMode(modeKey);
    const saved = JSON.parse(localStorage.getItem(`numflash_${modeKey}`)) || {
      lastScore: 0,
      highScore: 0,
    };
    setLocalData(saved);
    setCurrentView("intro");
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

    // 🏆 DYNAMIC ACHIEVEMENTS & STREAK LOGIC
    if (user) {
      setUser((prevUser) => {
        if (!prevUser) return null;

        const newAchievements = new Set(prevUser.achievements || []);

        // Unlock badges based on performance
        if (score >= 10) newAchievements.add("Speed Demon");
        if (score >= 25) newAchievements.add("Flash Memory Master");
        if (activeMode === "expert" && score > 0)
          newAchievements.add("Expert Survivor");
        if (activeMode === "legend" && score > 0)
          newAchievements.add("Legendary Mind");

        // Increment streak for active play
        const updatedStreak = (prevUser.streak || 0) + 1;

        return {
          ...prevUser,
          streak: updatedStreak,
          achievements: Array.from(newAchievements),
        };
      });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64Data = await uploadProfilePicture(file, user?.token);
    if (base64Data && user) {
      setUser((prev) => ({ ...prev, avatar: base64Data }));
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ToastContainer position="bottom-right" theme="dark" />

      <Header
        region={region}
        setRegion={setRegion}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setCurrentView("profile")}
        onGoHome={() => setCurrentView("home")}
      />

      <Container maxWidth="lg">
        {currentView === "home" && (
          <HomeScreen
            onSelectMode={handleSelectMode}
            onOpenScoreboard={() => setCurrentView("scoreboard")}
            onOpenHallOfFame={() => setCurrentView("halloffame")}
          />
        )}

        {currentView === "intro" && (
          <ModeIntroScreen
            modeKey={activeMode}
            localData={localData}
            onReset={handleResetScore}
            onStartGame={() => setCurrentView("game")}
            onBack={() => setCurrentView("home")}
          />
        )}

        {currentView === "game" && (
          <GameArena
            modeKey={activeMode}
            region={region}
            user={user}
            onGameOver={handleGameOver}
            onReturnHome={() => setCurrentView("home")}
          />
        )}

        {currentView === "scoreboard" && (
          <ScoreboardHub region={region} user={user} />
        )}

        {currentView === "halloffame" && <HallOfFame />}

        {currentView === "profile" && user && (
          <UserProfileArea
            user={user}
            region={region}
            onImageUpload={handleImageUpload}
            onSignOut={async () => {
              await supabase.auth.signOut();
              setUser(null);
              setCurrentView("home");
              toast.info("Signed out.");
            }}
            onBack={() => setCurrentView("home")}
          />
        )}
      </Container>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(userData) => setUser(userData)}
      />
    </ThemeProvider>
  );
}
