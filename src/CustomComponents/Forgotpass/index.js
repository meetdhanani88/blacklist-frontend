import { Link } from "react-router-dom";

// material-ui

import { Divider, Grid } from "@mui/material";

// project imports

import Logo from "ui-component/Logo";

import AuthCardWrapper from "views/pages/authentication/AuthCardWrapper";
import AuthWrapper1 from "views/pages/authentication/AuthWrapper1";

import Forgotui from "./Forgotui";

// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Forgotpass = ({ setrole }) => {
  return (
    <>
      <AuthWrapper1>
        <Grid
          container
          direction="column"
          justifyContent="flex-end"
          sx={{ minHeight: "100vh" }}
        >
          <Grid item xs={12}>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sx={{ minHeight: "calc(100vh - 68px)" }}
            >
              <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                <AuthCardWrapper>
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item sx={{ mb: 1 }}>
                      <Link to="#">
                        {/* Find BlackList */}
                        <Logo />
                      </Link>
                    </Grid>

                    <Grid item xs={12}>
                      <Forgotui setrole={setrole} />
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
    </>
  );
};

export default Forgotpass;
