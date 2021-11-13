import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { publicRequest } from "../requestMethods";

export const Password = ({ id }) => {
  const [password, setPassword] = useState({});

  useEffect(() => {
    const getPassword = async () => {
      try {
        const { data } = await publicRequest.get(`/password/${id}`, {
          headers: {
            token: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setPassword(data);
      } catch (error) {
        console.log(error);
      }
    };
    getPassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Typography variant="h5">{password.title}</Typography>
      <Typography sx={{ mt: 2 }}>Username: {password.username}</Typography>
      <Typography>Password: {password.password}</Typography>
    </Box>
  );
};
