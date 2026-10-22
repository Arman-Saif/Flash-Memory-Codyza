import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

export default function InteractiveTitleFlashCard() {
  const [cardNumber, setCardNumber] = useState(371);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped((prev) => {
        const nextState = !prev;
        if (nextState) setCardNumber(Math.floor(100 + Math.random() * 900));
        return nextState;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        my: 2,
        userSelect: "none",
      }}
    >
      <Box sx={{ perspective: "1000px", width: 180, height: 60 }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            textAlign: "center",
            transition: "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)",
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateX(180deg)" : "rotateX(0deg)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
              boxShadow: "0 8px 25px rgba(0, 242, 254, 0.4)",
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 900, color: "#0a0f1d", letterSpacing: 2 }}
            >
              NUMBER
            </Typography>
          </Box>

          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
              transform: "rotateX(180deg)",
              boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)",
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 900, color: "#fff", fontFamily: "monospace" }}
            >
              {cardNumber}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography
        variant="h3"
        sx={{ fontWeight: 900, letterSpacing: 2, color: "#fff" }}
      >
        FLASH
      </Typography>
    </Box>
  );
}
