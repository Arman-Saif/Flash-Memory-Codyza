import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  LinearProgress,
  TextField,
} from "@mui/material";
import { MODES } from "../config/constants";
import { submitScore } from "../services/api";
import { toast } from "react-toastify";

export default function GameArena({
  modeKey,
  region,
  user,
  onGameOver,
  onReturnHome,
}) {
  const modeConfig = MODES[modeKey] || MODES.easy;

  const [round, setRound] = useState(1);
  const [digitLength, setDigitLength] = useState(modeConfig.start);
  const [currentNumber, setCurrentNumber] = useState("");
  const [gameState, setGameState] = useState("memorize");
  const [userInput, setUserInput] = useState("");

  const getRoundTime = () => {
    const stepIncrease = modeKey === "expert" || modeKey === "legend" ? 1 : 2;
    return modeConfig.baseMemoryTime + (round - 1) * stepIncrease;
  };

  const [timeLeft, setTimeLeft] = useState(getRoundTime());
  const [score, setScore] = useState(0);

  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const generateNumber = (length) => {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  };

  useEffect(() => {
    if (gameState === "memorize") {
      const num = generateNumber(digitLength);
      setCurrentNumber(num);
      setUserInput("");

      const roundTime = getRoundTime();
      setTimeLeft(roundTime);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setGameState("recall");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [round, digitLength, gameState, modeKey, modeConfig]);

  useEffect(() => {
    if (gameState === "recall") {
      const recallTime = getRoundTime();
      setTimeLeft(recallTime);

      if (inputRef.current) {
        inputRef.current.focus();
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [gameState]);

  const handleSkipTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState("recall");
  };

  const handleTimeExpired = () => {
    toast.error("Time's up for guessing!");
    handleSubmitAnswer();
  };

  const handleSubmitAnswer = async (e) => {
    if (e) e.preventDefault();
    if (timerRef.current) clearInterval(timerRef.current);

    if (userInput === currentNumber && userInput.length > 0) {
      const pointsTable = {
        easy: 1,
        medium: 1,
        hard: 2,
        expert: 5,
        legend: 5,
      };
      const pointsEarned = pointsTable[modeKey] || 1;
      const newScore = score + pointsEarned;
      setScore(newScore);

      toast.success(
        `Correct! +${pointsEarned} pt${pointsEarned > 1 ? "s" : ""}`,
        { autoClose: 1000 },
      );

      setRound((prev) => prev + 1);

      setDigitLength((prev) => {
        if (modeKey === "expert") {
          const randomIncrease = Math.floor(Math.random() * 6) + 1;
          return prev + randomIncrease;
        } else if (modeKey === "legend") {
          const randomIncrease = Math.floor(Math.random() * 14) + 7;
          return prev + randomIncrease;
        } else {
          return prev + modeConfig.step;
        }
      });

      setGameState("memorize");
    } else {
      setGameState("gameover");

      // Save using standardized numflash_${modeKey} key structure
      const storageKey = `numflash_${modeKey}`;
      const existingData = JSON.parse(localStorage.getItem(storageKey) || "{}");
      const previousHighScore = existingData.highScore || 0;

      const updatedLocal = {
        lastScore: score,
        highScore: Math.max(score, previousHighScore),
      };

      localStorage.setItem(storageKey, JSON.stringify(updatedLocal));

      if (typeof onGameOver === "function") {
        onGameOver(score, modeKey);
      }

      if (user?.token && score > 0) {
        try {
          await submitScore({ mode: modeKey, score, region }, user.token);
        } catch (err) {
          console.error("Failed to submit score:", err);
        }
      }

      toast.error(
        userInput.length === 0
          ? "Time's up! Game Over."
          : "Incorrect! Game Over.",
      );
    }
  };

  const currentTotalTime = getRoundTime();

  return (
    <Box
      sx={{
        maxWidth: "600px",
        mx: "auto",
        mt: { xs: 2, md: 4 },
        p: { xs: 2, md: 4 },
        minWidth: "300px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">
            Mode
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ color: modeConfig.color }}
          >
            {modeConfig.name}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Round
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            {round}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="caption" color="text.secondary">
            Score
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="primary.main"
          >
            {score}
          </Typography>
        </Box>
      </Box>

      {gameState === "memorize" && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid rgba(255, 255, 255, 0.08)",
            position: "relative",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, letterSpacing: 1 }}
          >
            MEMORIZE THE NUMBER
          </Typography>

          <Typography
            variant="h3"
            fontWeight="800"
            sx={{
              letterSpacing: { xs: "6px", sm: "12px" },
              my: 3,
              fontFamily: "monospace",
              color: modeConfig.color,
              wordBreak: "break-all",
            }}
          >
            {currentNumber}
          </Typography>

          <Box sx={{ mt: 3, px: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="caption" color="text.secondary">
                Memorize Time
              </Typography>
              <Typography
                variant="caption"
                fontWeight="bold"
                color="primary.main"
              >
                {timeLeft}s
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(timeLeft / currentTotalTime) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "rgba(255,255,255,0.05)",
              }}
            />
          </Box>

          <Button
            variant="outlined"
            onClick={handleSkipTimer}
            sx={{
              mt: 4,
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              borderColor: "rgba(59, 130, 246, 0.4)",
              color: "text.primary",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "rgba(59, 130, 246, 0.08)",
              },
            }}
          >
            Skip & Guess Now ⚡
          </Button>
        </Paper>
      )}

      {gameState === "recall" && (
        <Paper
          component="form"
          onSubmit={handleSubmitAnswer}
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, letterSpacing: 1 }}
          >
            TYPE THE NUMBER YOU SAW
          </Typography>

          <Box sx={{ mb: 3, px: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="caption" color="text.secondary">
                Guess Time Remaining
              </Typography>
              <Typography
                variant="caption"
                fontWeight="bold"
                color={timeLeft <= 2 ? "#f87171" : "primary.main"}
              >
                {timeLeft}s
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              color={timeLeft <= 2 ? "error" : "primary"}
              value={(timeLeft / currentTotalTime) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "rgba(255,255,255,0.05)",
              }}
            />
          </Box>

          <TextField
            inputRef={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            value={userInput}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              if (val.length <= digitLength) {
                setUserInput(val);
              }
            }}
            placeholder={"_".repeat(digitLength)}
            variant="outlined"
            fullWidth
            sx={{
              mb: 3,
              "& .MuiInputBase-input": {
                textAlign: "center",
                fontFamily: "monospace",
                fontSize: "2rem",
                letterSpacing: "8px",
                fontWeight: "bold",
                color: "#f8fafc",
                py: 2,
              },
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgba(0,0,0,0.3)",
                borderRadius: 2,
                "& fieldset": {
                  borderColor: "rgba(59, 130, 246, 0.4)",
                },
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={userInput.length === 0}
            sx={{
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              bgcolor: "primary.main",
              color: "#fff",
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "none",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Submit Answer (Press Enter ↵)
          </Button>
        </Paper>
      )}

      {gameState === "gameover" && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            color="#f87171"
            gutterBottom
          >
            Game Over
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            The correct number was:
          </Typography>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontFamily: "monospace",
              mb: 3,
              color: "primary.main",
              wordBreak: "break-all",
            }}
          >
            {currentNumber}
          </Typography>

          <Box
            sx={{ p: 2, bgcolor: "rgba(0,0,0,0.2)", borderRadius: 2, mb: 3 }}
          >
            <Typography variant="body2" color="text.secondary">
              Final Score
            </Typography>
            <Typography variant="h4" fontWeight="800" color="#f8fafc">
              {score}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setRound(1);
                setDigitLength(modeConfig.start);
                setScore(0);
                setGameState("memorize");
              }}
              sx={{ textTransform: "none", fontWeight: "bold", px: 3 }}
            >
              Play Again
            </Button>
            <Button
              variant="outlined"
              onClick={onReturnHome}
              sx={{ textTransform: "none", fontWeight: "bold", px: 3 }}
            >
              Main Menu
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
