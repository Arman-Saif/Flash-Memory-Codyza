import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Fade } from "@mui/material";
import { toast } from "react-toastify";
import ReverseStopwatch from "./ReverseStopwatch";
import { MODES } from "../config/constants";
import { submitScore, reportRoundComplete } from "../services/api";

export default function GameArena({
  modeKey,
  region,
  user,
  onGameOver,
  onReturnHome,
}) {
  const mode = MODES[modeKey];
  const [gameState, setGameState] = useState("countdown");
  const [round, setRound] = useState(1);
  const [currentLength, setCurrentLength] = useState(mode.start);
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [countdownNum, setCountdownNum] = useState(3);
  const [score, setScore] = useState(0);

  const [flashTimeLeft, setFlashTimeLeft] = useState(0);
  const [guessTimeLeft, setGuessTimeLeft] = useState(0);
  const [isHidingFlip, setIsHidingFlip] = useState(false);
  const [guessStartTime, setGuessStartTime] = useState(null);

  const getRoundTimers = () => {
    const timeAdd = (round - 1) * mode.incrementTime;
    return {
      memoryTime: mode.baseMemoryTime + timeAdd,
      guessTime: mode.baseGuessTime + timeAdd,
    };
  };

  useEffect(() => {
    if (gameState === "countdown") {
      if (countdownNum > 0) {
        const timer = setTimeout(() => setCountdownNum(countdownNum - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        startRound();
      }
    }
  }, [gameState, countdownNum]);

  useEffect(() => {
    if (gameState === "flash") {
      if (flashTimeLeft > 0) {
        const timer = setTimeout(
          () => setFlashTimeLeft(flashTimeLeft - 1),
          1000,
        );
        return () => clearTimeout(timer);
      } else {
        setIsHidingFlip(true);
        const timer = setTimeout(() => {
          setIsHidingFlip(false);
          const { guessTime } = getRoundTimers();
          setGuessTimeLeft(guessTime);
          setGameState("input");
          setGuessStartTime(Date.now()); // Start timer to track Speed Demon trigger
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState, flashTimeLeft]);

  useEffect(() => {
    if (gameState === "input") {
      if (guessTimeLeft > 0) {
        const timer = setTimeout(
          () => setGuessTimeLeft(guessTimeLeft - 1),
          1000,
        );
        return () => clearTimeout(timer);
      } else {
        toast.error("Time's up! Game Over.");
        handleEndGame(score);
      }
    }
  }, [gameState, guessTimeLeft]);

  const startRound = () => {
    let digits = [];
    for (let i = 0; i < currentLength; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }
    setSequence(digits);
    const { memoryTime } = getRoundTimers();
    setFlashTimeLeft(memoryTime);
    setGameState("flash");
  };

  const handleEndGame = async (finalScore) => {
    setGameState("result");
    onGameOver(finalScore);

    if (user && user.token && finalScore > 0) {
      await submitScore(
        { mode: modeKey, score: finalScore, region },
        user.token,
      );
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const correctStr = sequence.join("");

    if (userInput.trim() === correctStr) {
      const timeTakenSeconds = guessStartTime
        ? (Date.now() - guessStartTime) / 1000
        : 10;
      toast.success("Correct sequence!");

      const nextScore = score + currentLength;
      setScore(nextScore);

      if (user && user.token) {
        reportRoundComplete(
          {
            mode: modeKey,
            score: nextScore,
            roundReached: round,
            timeTakenSeconds,
          },
          user.token,
        );
      }

      setRound(round + 1);
      let nextLen =
        modeKey === "legend"
          ? currentLength + Math.floor(Math.random() * (20 - 7 + 1)) + 7
          : currentLength + mode.step;

      setCurrentLength(nextLen);
      setUserInput("");
      setCountdownNum(3);
      setGameState("countdown");
    } else {
      toast.error("Incorrect sequence! Game Over.");
      handleEndGame(score);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", textAlign: "center", py: 6 }}>
      {gameState === "countdown" && (
        <Fade in={true} timeout={400}>
          <Box>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
              Round {round} (Length: {currentLength})
            </Typography>
            <Typography
              variant="h1"
              sx={{ fontWeight: 900, my: 4, color: mode.color }}
            >
              {countdownNum}
            </Typography>
          </Box>
        </Fade>
      )}

      {gameState === "flash" && (
        <Fade in={true} timeout={400}>
          <Box>
            <ReverseStopwatch
              timeLeft={flashTimeLeft}
              label="Memory Time Remaining"
              color={mode.color}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 2,
                my: 4,
                p: 4,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.04)",
                transform: isHidingFlip
                  ? "rotateX(90deg) scale(0.9)"
                  : "rotateX(0deg) scale(1)",
                transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: isHidingFlip ? 0 : 1,
              }}
            >
              {sequence.map((digit, idx) => (
                <Typography
                  key={idx}
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    color: mode.color,
                    fontFamily: "monospace",
                  }}
                >
                  {digit}
                </Typography>
              ))}
            </Box>
          </Box>
        </Fade>
      )}

      {gameState === "input" && (
        <Fade in={true} timeout={500}>
          <Box component="form" onSubmit={handleVerify}>
            <ReverseStopwatch
              timeLeft={guessTimeLeft}
              label="Time Left To Guess"
              color="#00f2fe"
            />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
              Type what you remember:
            </Typography>

            <TextField
              autoFocus
              fullWidth
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter numbers..."
              slotProps={{
                htmlInput: {
                  style: {
                    textAlign: "center",
                    fontSize: "2rem",
                    letterSpacing: "8px",
                  },
                },
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ py: 1.5 }}
            >
              Submit Answer
            </Button>
          </Box>
        </Fade>
      )}

      {gameState === "result" && (
        <Fade in={true} timeout={400}>
          <Box>
            <Typography
              variant="h4"
              color="error"
              sx={{ fontWeight: 800, mb: 1 }}
            >
              Game Over!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Final Score: <strong>{score}</strong>
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => {
                  setRound(1);
                  setCurrentLength(mode.start);
                  setScore(0);
                  setCountdownNum(3);
                  setGameState("countdown");
                }}
              >
                Play Again
              </Button>
              <Button variant="outlined" onClick={onReturnHome}>
                Starting Page
              </Button>
            </Box>
          </Box>
        </Fade>
      )}
    </Box>
  );
}
