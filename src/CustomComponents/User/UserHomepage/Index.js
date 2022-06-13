import { Paper } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { Container, createTheme, Grid } from "@mui/material";
import React, { useState } from "react";
import Blacklistedlist from "./Blacklistedlist";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import "./index.css";
import Addblacklist from "../../Admin/ManageBlacklistVendor/Addblacklist";

// const pages = ['Users', 'Blacklisted Vendor', 'Blacklist Request'];
const settings = ["Profile", "Logout"];

const theme = createTheme({
  typography: {
    fontFamily: "Nunito Sans",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 800,
    fontSize: 14,
  },
  palette: {
    mode: "light",
  },
});

const UserHomepage = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openpop, setopenpop] = useState(false);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (setting) => {
    if (setting === "Logout") {
      localStorage.removeItem("token");
      navigate("/login");
    }
    setAnchorElUser(null);
  };

  function handleClosepop() {
    setopenpop(false);
  }

  return (
    <ThemeProvider theme={theme}>
      {openpop && (
        <Addblacklist
          openpop={openpop}
          handleClosepop={handleClosepop}
          role={"user"}></Addblacklist>
      )}
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 3,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".03rem",
                color: "inherit",
                textDecoration: "none",
                flexGrow: 1,
              }}>
              Find Blacklist
            </Typography>

            {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}

            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".03rem",
                color: "inherit",
                textDecoration: "none",
              }}>
              Find Blacklist
            </Typography>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}>
                {settings.map((setting, i) => (
                  <MenuItem
                    key={i}
                    onClick={() => handleCloseUserMenu(setting)}
                    sx={{ color: "#1976d2" }}>
                    <Typography textAlign="center" fontSize={18}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Paper
        style={{
          height: "100%",
          minHeight: "100vh",
          border: 0,
          boxShadow: "none",
        }}>
        <Container style={{ marginTop: "40px" }}>
          <Grid container spacing={1} justifyContent="flex-end">
            <Fab
              color="primary"
              aria-label="add"
              variant="extended"
              onClick={() => setopenpop(true)}>
              <AddIcon sx={{ mr: 1 }} />
              Request For Blacklist
            </Fab>
          </Grid>

          <div style={{ marginTop: "20px" }}>
            <Blacklistedlist />
          </div>
        </Container>
      </Paper>
    </ThemeProvider>
  );
};

export default UserHomepage;
