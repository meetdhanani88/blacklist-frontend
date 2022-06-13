import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Divider, Grid, useMediaQuery, CircularProgress, Box } from "@mui/material";

// project imports
import Logo from "ui-component/Logo";
import AuthWrapper1 from "views/pages/authentication/AuthWrapper1";
import AuthCardWrapper from "views/pages/authentication/AuthCardWrapper";

import ResetPassui from "./ResetPassui";

// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Resetpass = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setloading] = useState(true);
  const location = useLocation();
  console.log(location);

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
                      <Grid item sx={{ mb: 0 }}>
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
                          justifyContent="center"></Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <ResetPassui location={location}></ResetPassui>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
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

export default Resetpass;
