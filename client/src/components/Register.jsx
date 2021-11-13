import React, { useState } from "react";
import {
  Box,
  Button,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Login } from "./Login";
import { publicRequest } from "../requestMethods";

export const Register = ({ setOpen }) => {
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErr(null);
    setSuccess(null);

    if (!username) {
      setErr("Enter a username");
      return;
    }

    if (!email) {
      setErr("Enter a email");
      return;
    }

    if (!password) {
      setErr("Enter a password");
      return;
    }

    if (password !== confirmPassword) {
      setErr("Password doesn't match");
      return;
    }

    try {
      const { data } = await publicRequest.post("/auth/register", { username, email, password });

      setErr(null);
      setUsername("");
      setEmail("");
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
          xs: "80%",
          md: "25%",
        },
        borderRadius: "10px",
        bgcolor: "white",
        zIndex: 2,
      }}
    >
      <Typography variant="h5">Sign Up</Typography>
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
      <TextField
        fullWidth
        variant="filled"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField fullWidth variant="filled" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "start", width: "100%" }}>
        <Link
          sx={{ cursor: "pointer" }}
          onClick={() => setOpen({ state: true, component: <Login setOpen={setOpen} /> })}
        >
          Already have and account?
        </Link>
      </Box>
      <Button
        onClick={handleSubmit}
        sx={{ borderRadius: "25px", textTransform: "capitalize" }}
        variant="contained"
        size="large"
      >
        Sign Up
      </Button>
    </Box>
  );
};
