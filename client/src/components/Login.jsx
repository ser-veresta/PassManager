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
import { Register } from "./Register";
import { ForgotPassword } from "./ForgotPassword";
import { publicRequest } from "../requestMethods";

export const Login = ({ setOpen }) => {
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErr(null);

    if (!username) {
      setErr("Enter a username");
      return;
    }

    if (!password) {
      setErr("Enter a username");
      return;
    }

    try {
      const { data } = await publicRequest.post("/auth/login", { username, password });

      setErr(null);
      setUsername("");
      setPassword("");

      localStorage.setItem("token", data);

      setOpen({ state: false, component: null });
    } catch (error) {
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
        width: "25%",
        borderRadius: "10px",
        bgcolor: "white",
        zIndex: 2,
      }}
    >
      <Typography variant="h5">Login</Typography>
      {err && (
        <Box sx={{ width: "100%", p: 2, bgcolor: "pink", borderRadius: "10px" }}>
          <Typography>{err}</Typography>
        </Box>
      )}
      <TextField
        fullWidth
        variant="filled"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <FormControl sx={{ width: "100%" }} variant="filled">
        <InputLabel htmlFor="password">Password</InputLabel>
        <FilledInput
          id="password"
          type={showPass ? "text" : "password"}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPass((prev) => !prev)}
                edge="end"
              >
                {showPass ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "start", width: "100%" }}>
        <Link
          sx={{ cursor: "pointer" }}
          onClick={() => setOpen({ state: true, component: <Register setOpen={setOpen} /> })}
        >
          Dont have an account?
        </Link>
        <Link
          sx={{ cursor: "pointer" }}
          onClick={() => setOpen({ state: true, component: <ForgotPassword setOpen={setOpen} /> })}
        >
          Forgot Password?
        </Link>
      </Box>
      <Button
        onClick={handleSubmit}
        sx={{ borderRadius: "25px", textTransform: "capitalize" }}
        variant="contained"
        size="large"
      >
        Login
      </Button>
    </Box>
  );
};
