import React, { useState } from "react";
import {
  Box,
  Button,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Typography,
} from "@mui/material";
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import { publicRequest } from "../requestMethods";
import { useParams, useNavigate } from "react-router-dom";

export const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErr(null);
    setSuccess(null);

    if (!password) {
      setErr("Enter a password");
      return;
    }

    if (password !== confirmPassword) {
      setErr("Password doesn't match");
      return;
    }

    try {
      const { data } = await publicRequest.post("/auth/resetPassword", { resetToken, password });

      setErr(null);
      setPassword("");
      setConfirmPassword("");

      setSuccess(data);
    } catch (error) {
      setSuccess(null);
      setErr(error?.response?.data?.error || "Server Error");
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        p: 4,
        width: {
          xs: "90%",
          md: "25%",
        },
        borderRadius: "10px",
        bgcolor: "white",
        zIndex: 2,
      }}
    >
      <Box sx={{ display: "flex", width: "100%", px: 1, gap: 2, alignItems: "center" }}>
        <IconButton onClick={() => navigate("/")}>
          <ArrowBack />
        </IconButton>
        <Typography sx={{ flexGrow: 1 }} variant="h5">
          Reset Password
        </Typography>
      </Box>
      {err && (
        <Box sx={{ width: "100%", p: 2, bgcolor: "pink", borderRadius: "10px" }}>
          <Typography>{err}</Typography>
        </Box>
      )}
      {success && (
        <Box sx={{ width: "100%", p: 2, bgcolor: "lightGreen", borderRadius: "10px" }}>
          <Typography>{success}</Typography>
        </Box>
      )}
      <FormControl sx={{ width: "100%" }} variant="filled">
        <InputLabel htmlFor="password">Password</InputLabel>
        <FilledInput
          id="password"
          type={showPass1 ? "text" : "password"}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPass1((prev) => !prev)}
                edge="end"
              >
                {showPass1 ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControl sx={{ width: "100%" }} variant="filled">
        <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
        <FilledInput
          id="confirmPassword"
          type={showPass2 ? "text" : "password"}
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPass2((prev) => !prev)}
                edge="end"
              >
                {showPass2 ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Button
        onClick={handleSubmit}
        sx={{ borderRadius: "25px", textTransform: "capitalize" }}
        variant="contained"
        size="large"
      >
        reset password
      </Button>
    </Box>
  );
};
