import React, { useState } from "react";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { Register } from "./Register";
import { publicRequest } from "../requestMethods";

export const ForgotPassword = ({ setOpen }) => {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErr(null);
    setSuccess(null);

    if (!email) {
      setErr("Enter a email");
      return;
    }

    try {
      const { data } = await publicRequest.post("/auth/forgotPassword", { email });

      setErr(null);
      setEmail("");

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
      <Typography variant="h5">Forgot Password</Typography>
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
      <TextField fullWidth variant="filled" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "start", width: "100%" }}>
        <Link
          sx={{ cursor: "pointer" }}
          onClick={() => setOpen({ state: true, component: <Register setOpen={setOpen} /> })}
        >
          Dont have an account?
        </Link>
      </Box>
      <Button
        onClick={handleSubmit}
        sx={{ borderRadius: "25px", textTransform: "capitalize" }}
        variant="contained"
        size="large"
      >
        Send Email
      </Button>
    </Box>
  );
};
