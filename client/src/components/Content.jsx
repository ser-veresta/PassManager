import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Container,
  TextField,
  Paper,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { publicRequest } from "../requestMethods";
import { Password } from "./Password";

export const Content = ({ setOpen }) => {
  const [userPasswords, setUserPasswords] = useState([]);
  const [id, setId] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);
  const [token, setToken] = useState(null);

  const getPasswords = async () => {
    setErr(null);

    try {
      const { data } = await publicRequest.get("/password", {
        headers: {
          token: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUserPasswords(data);
    } catch (error) {
      setErr(error?.response?.data?.error || "Server Error");
    }
  };

  useEffect(() => {
    window.addEventListener("storage", () => setToken(localStorage.getItem("token")));
    localStorage.getItem("token") && getPasswords();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErr(null);
    setSuccess(null);

    if (!title) {
      setErr("Enter a title");
      return;
    }

    if (!password) {
      setErr("Enter a password");
      return;
    }

    if (!username) {
      setErr("Enter a username");
      return;
    }

    try {
      const { data } = await publicRequest.post(
        id ? `/password/${id}` : "/password/addPassword",
        {
          title,
          password,
          username,
        },
        {
          headers: {
            token: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess(data);
      setErr(null);
      setId(null);
      setTitle("");
      setPassword("");
      setUsername("");

      getPasswords();
    } catch (error) {
      setSuccess(null);

      setErr(error?.response?.data?.error || "Server Error");
    }
  };

  const handleDelete = async (id) => {
    setErr(null);
    setSuccess(null);

    try {
      const { data } = await publicRequest.delete(`/password/${id}`, {
        headers: {
          token: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccess(data);
      setErr(null);

      getPasswords();
    } catch (error) {
      setSuccess(null);

      setErr(error?.response?.data?.error || "Server Error");
    }
  };

  const handleEdit = async (id) => {
    setErr(null);

    if (!id) {
      setErr("no id selected");
      return;
    }

    setId(id);

    try {
      const { data } = await publicRequest.get(`/password/${id}`, {
        headers: {
          token: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPassword(data.password);
      setUsername(data.username);
      setTitle(data.title);

      setErr(null);
    } catch (error) {
      setId(null);
      setErr(error?.response?.data?.error || "Server Error");
    }
  };

  if (!localStorage.getItem("token")) {
    return (
      <Container>
        <Typography sx={{ height: "60vh", mt: 5 }} variant="h4">
          Login or Register to Manage Passwords
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container>
        <Grid sx={{ mt: 4 }} container item xs={12} md={8} spacing={2}>
          {userPasswords.length ? (
            userPasswords.map((item) => (
              <Grid key={item.id} item md={4}>
                <Card sx={{ p: 2, bgcolor: "#f2f2f2" }}>
                  <CardContent>
                    <Typography variant="h6">{item.title}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      onClick={() => setOpen({ state: true, component: <Password id={item.id} /> })}
                      sx={{ borderRadius: "25px", textTransform: "capitalize" }}
                      variant="contained"
                      size="small"
                    >
                      show details
                    </Button>
                    <IconButton
                      onClick={() => {
                        handleEdit(item.id);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleDelete(item.id);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h4">You have no passwords to show. ADD some passwords</Typography>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Paper
              onSubmit={handleSubmit}
              autoComplete="off"
              noValidate
              component="form"
              sx={{
                p: 5,
                display: "flex",
                flexDirection: "column",
                gap: 5,
                alignItems: "center",
                width: "90%",
                mt: 8,
                bgcolor: "#f2f2f2",
              }}
            >
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
                label="Username,Ex. test"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Password,Ex. Password123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Title,Ex. Facebook"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Button
                type="submit"
                sx={{ borderRadius: "25px", textTransform: "capitalize" }}
                variant="contained"
                size="large"
              >
                {id ? "Edit Password" : "Add Password"}
              </Button>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
