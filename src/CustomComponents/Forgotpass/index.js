import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link as RouterLink } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFormik } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import * as Yup from "yup";
import { useQueryClient, useMutation } from "react-query";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import axiosInstance from "../../config";

import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";

const theme = createTheme();

function Forgotpass() {
  const queryClient = useQueryClient();

  const [suceessmsg, setsuceessmsg] = useState(false);
  const [errmsg, seterrmsg] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid Email").required("email is required"),
  });

  const postEmail = async () => {
    let res = await axiosInstance.post("/user/forgotPassword", {
      email: values.email,
    });
    return res.data;
  };

  const mutation = useMutation(postEmail, {
    onSuccess: (data) => {
      setsuceessmsg(data.message);
      seterrmsg("");
    },
    onError: (data) => {
      seterrmsg(data.response.data.message || "Something Wrong");
      setsuceessmsg("");
    },
    onSettled: () => {
      queryClient.invalidateQueries("user Signup");
    },
  });

  const sentEmail = () => {
    mutation.mutate();
  };

  const {
    errors,
    values,
    handleBlur,
    handleSubmit,
    handleChange,
    touched,
    dirty,
    isValid,
  } = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: sentEmail,
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <AppBar position="fixed" color="primary">
          <Toolbar>
            <Typography variant="h6">Find Blackilist</Typography>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            marginTop: 11,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <ForwardToInboxOutlinedIcon></ForwardToInboxOutlinedIcon>
          </Avatar>
          <Typography component="h1" variant="h5">
            Forget Password
          </Typography>

          {errmsg && !suceessmsg && (
            <Alert severity="error" variant="filled" sx={{ mt: 2, mb: 2 }}>
              {errmsg}
            </Alert>
          )}
          {suceessmsg && !errmsg && (
            <Alert severity="success" variant="filled" sx={{ mt: 2, mb: 2 }}>
              {suceessmsg}
            </Alert>
          )}

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  error={errors.email && touched.email ? true : false}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{ width: "25rem" }}
                />
              </Grid>

              {errors.email && touched.email ? (
                <Alert
                  variant="string"
                  severity="error"
                  sx={{ color: "#f44336" }}
                >
                  {errors.email}
                </Alert>
              ) : null}
            </Grid>

            <LoadingButton
              sx={{ mt: 3, mb: 2 }}
              disabled={!dirty || !isValid}
              onClick={sentEmail}
              fullWidth
              loading={mutation.isLoading}
              variant="contained"
            >
              Sent Email
            </LoadingButton>

            <Grid container justifyContent="space-between">
              <Grid item>
                <RouterLink
                  to={"/Login"}
                  style={{
                    textDecoration: "none",
                    color: "#1976d2",
                  }}
                >
                  <Typography paragraph>Login</Typography>
                </RouterLink>
              </Grid>
              <Grid item>
                <Typography paragraph>
                  <RouterLink
                    to={"/resetpass"}
                    style={{
                      textDecoration: "none",
                      color: "#1976d2",
                    }}
                  >
                    Reset Password
                  </RouterLink>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Forgotpass;
