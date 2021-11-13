import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Login } from "./Login";
import { publicRequest } from "../requestMethods";
import { Register } from "./Register";

export const NavBar = ({ setOpen, user, setUser }) => {
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await publicRequest.get("/auth/getUser", {
          headers: {
            token: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUser(data);
      } catch (error) {
        if (error?.response?.data?.errorObj?.message === "jwt expired") {
          localStorage.removeItem("token");
          setUser(null);
        }
        if (error?.response?.data?.errorObj?.name === "JsonWebTokenError") {
          localStorage.removeItem("token");
          setUser(null);
        }
        if (error.response) {
          console.log(error.response.data);
        }
      }
    };
    if (localStorage.getItem("token")) {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("token")]);

  return (
    <AppBar position="static" sx={{ bgcolor: "#f2f2f2" }}>
      <Toolbar>
        <Typography color="text.secondary" sx={{ flexGrow: 1 }} variant="h5">
          PassManager
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {!user ? (
            <>
              <Button
                sx={{ borderRadius: "25px", textTransform: "capitalize" }}
                variant="contained"
                onClick={() => setOpen({ state: true, component: <Login setOpen={setOpen} /> })}
              >
                Login
              </Button>
              <Button
                onClick={() => setOpen({ state: true, component: <Register setOpen={setOpen} /> })}
                sx={{ borderRadius: "25px", textTransform: "capitalize" }}
                variant="contained"
              >
                Register
              </Button>
            </>
          ) : (
            <>
              <Typography color="text.secondary" variant="h6">
                {user.username}
              </Typography>
              <Button
                onClick={() => {
                  localStorage.removeItem("token");
                  setUser(null);
                }}
                sx={{ borderRadius: "25px", textTransform: "capitalize" }}
                variant="contained"
                size="large"
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
