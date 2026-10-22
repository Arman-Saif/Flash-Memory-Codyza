import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import { supabase } from "../config/supabaseClient";

export default function AuthModal({ open, onClose, onAuthSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please fill in email and password.");
      return;
    }
    if (isSignup && (!firstName || !lastName)) {
      toast.error("Please enter your First and Last Name.");
      return;
    }

    try {
      let authResponse;

      if (isSignup) {
        authResponse = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });
      } else {
        authResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      if (authResponse.error) throw authResponse.error;

      const session = authResponse.data.session;
      const user = authResponse.data.user;

      if (!session) {
        toast.info("Session active. Welcome!");
        onClose();
        return;
      }

      const fullName = isSignup
        ? `${firstName} ${lastName}`
        : user.user_metadata?.first_name
          ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`.trim()
          : email.split("@")[0];

      const profileSlug = fullName.toLowerCase().replace(/\s+/g, "-");

      onAuthSuccess({
        id: user.id,
        name: fullName,
        email: user.email,
        avatar:
          user.user_metadata?.avatar_url || "https://i.pravatar.cc/150?img=33",
        token: session.access_token,
        streak: 0,
        achievements: [],
      });

      toast.success(
        isSignup ? "Account created successfully!" : "Signed in successfully!",
      );
      onClose();
    } catch (err) {
      toast.error(err.message || "Authentication failed.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isSignup ? "Create Player Account" : "Sign In to Number Flash"}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          {isSignup && (
            <>
              <TextField
                label="First Name"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                label="Last Name"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </>
          )}
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="auth-password-input">Password</InputLabel>
            <OutlinedInput
              id="auth-password-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{ py: 1.2, fontWeight: "bold" }}
          >
            {isSignup ? "Complete Registration" : "Sign In"}
          </Button>
          <Button
            size="small"
            onClick={() => setIsSignup(!isSignup)}
            sx={{ textTransform: "none" }}
          >
            {isSignup
              ? "Already registered? Sign In"
              : "Need an account? Sign Up"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
