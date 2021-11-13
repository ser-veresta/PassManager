import { Backdrop, CssBaseline, Modal, Box } from "@mui/material";
import { useState } from "react";
import { Content } from "./components/Content";
import { Footer } from "./components/Footer";
import { NavBar } from "./components/NavBar";
import { ResetPassword } from "./components/ResetPassword";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [open, setOpen] = useState({ state: false, component: null });
  const [user, setUser] = useState(null);
  return (
    <>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <NavBar setOpen={setOpen} user={user} setUser={setUser} />
                <Content setOpen={setOpen} />
                <Footer />
                <Modal
                  open={open.state}
                  onClose={() => setOpen({ state: false, component: null })}
                  BackdropComponent={Backdrop}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                    {open.component}
                  </Box>
                </Modal>
              </>
            }
          ></Route>
          <Route
            path="/resetPassword/:resetToken"
            element={
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                <ResetPassword />
              </Box>
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
