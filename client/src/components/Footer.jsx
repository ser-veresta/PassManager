import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

export const Footer = () => {
  return (
    <AppBar sx={{ mt: 10, bgcolor: "#f2f2f2" }} position="static">
      <Toolbar sx={{ height: "104px" }}>
        <Typography color="text.secondary" sx={{ flexGrow: 1 }} align="center" variant="h5">
          © PassManager 2021
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
