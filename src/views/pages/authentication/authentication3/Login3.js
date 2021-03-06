import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  CircularProgress,
  Box,
} from "@mui/material";

// project imports
import AuthWrapper1 from "../AuthWrapper1";
import AuthCardWrapper from "../AuthCardWrapper";
import AuthLogin from "../auth-forms/AuthLogin";
import Logo from "ui-component/Logo";

// assets

// ================================|| AUTH3 - LOGIN ||================================ //
const token = localStorage.getItem("token");
const Login = ({ setrole, role, path }) => {
  const nav = useNavigate();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setloading] = useState(true);

  useEffect(() => {
    if (role === 1 && token && path.slice(0, 6) === "/admin") {
      nav(path, { replace: true });
    } else if (role === 2 && token && path.slice(0, 5) === "/user") {
      nav(path, { replace: true });
    } else if (role === 1 && token) {
      nav("/admin", { replace: true });
    } else if (role === 2 && token) {
      nav("/user", { replace: true });
    }
  }, [nav, role, path]);

  useEffect(() => {
    setloading(false);
  }, []);

  return (
    <>
      {loading && (
        <Box sx={{ display: "flex", mt: 15 }} justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <AuthWrapper1>
          <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: "100vh" }}>
            <Grid item xs={12}>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{ minHeight: "calc(100vh - 68px)" }}>
                <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                  <AuthCardWrapper>
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                      <Grid item sx={{ mb: 3 }}>
                        <Link to="#">
                          {/* Find BlackList */}
                          <Logo />
                        </Link>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid
                          container
                          direction={matchDownSM ? "column-reverse" : "row"}
                          alignItems="center"
                          justifyContent="center">
                          <Grid item>
                            <Stack alignItems="center" justifyContent="center" spacing={1}>
                              <Typography
                                color={theme.palette.secondary.main}
                                gutterBottom
                                variant={matchDownSM ? "h3" : "h2"}>
                                Hi, Welcome Back
                              </Typography>
                              <Typography
                                variant="caption"
                                fontSize="16px"
                                textAlign={matchDownSM ? "center" : "inherit"}>
                                Enter your credentials to continue
                              </Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <AuthLogin setrole={setrole} />
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12}>
                        <Grid item container direction="column" alignItems="center" xs={12}>
                          <Typography
                            component={Link}
                            to="/pages/register/register3"
                            variant="subtitle1"
                            sx={{ textDecoration: "none" }}>
                            Don&apos;t have an account?
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </AuthCardWrapper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </AuthWrapper1>
      )}
    </>
  );
};

export default Login;
