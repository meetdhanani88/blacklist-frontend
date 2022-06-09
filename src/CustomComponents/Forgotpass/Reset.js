import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
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

import Toast from "../../Helper/Toast";

const theme = createTheme();

function Reset() {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { code } = useParams();

  const [suceessmsg, setsuceessmsg] = useState(false);
  const [errmsg, seterrmsg] = useState(false);

  //password validation
  const lowercaseRegEx = /(?=.*[a-z])/;
  const uppercaseRegEx = /(?=.*[A-Z])/;
  const numericRegEx = /(?=.*[0-9])/;
  const lengthRegEx = /(?=.{6,})/;

  const validationSchema = Yup.object({
    newpassword: Yup.string()
      .matches(
        lowercaseRegEx,
        "Must contain one lowercase alphabetical character!"
      )
      .matches(
        uppercaseRegEx,
        "Must contain one uppercase alphabetical character!"
      )
      .matches(numericRegEx, "Must contain one numeric character!")
      .matches(lengthRegEx, "Must contain 6 characters!")
      .required("Required!"),

    confirmnewpassword: Yup.string()
      .oneOf([Yup.ref("newpassword"), null], "Passwords must match")
      .matches(
        lowercaseRegEx,
        "Must contain one lowercase alphabetical character!"
      )
      .matches(
        uppercaseRegEx,
        "Must contain one uppercase alphabetical character!"
      )
      .matches(numericRegEx, "Must contain one numeric character!")
      .matches(lengthRegEx, "Must contain 6 characters!")
      .required("Required!"),
  });

  const postlogin = async () => {
    let res = await axiosInstance.post("/user/updatePassword", {
      password: values.newpassword,
      token: code,
    });
    return res.data;
  };

  const { mutate, isLoading } = useMutation(postlogin, {
    onSuccess: (data) => {
      Toast({ message: `${data.message}` });

      seterrmsg("");
      navigate("/login");
    },

    onError: (data) => {
      seterrmsg(data.response.data.message || "Something went Wrong");
      setsuceessmsg("");
    },
    onSettled: () => {
      queryClient.invalidateQueries("password reseted");
    },
  });

  const handelReset = () => {
    mutate();
  };

  const {
    errors,
    values,
    handleBlur,
    handleSubmit,
    handleChange,
    touched,
    isValid,
  } = useFormik({
    initialValues: {
      newpassword: "",
      confirmnewpassword: "",
    },
    validationSchema,
    onSubmit: handelReset,
    enableReinitialize: true,
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
            <LockResetRoundedIcon></LockResetRoundedIcon>
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
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
                  type="password"
                  error={
                    errors.newpassword && touched.newpassword ? true : false
                  }
                  required
                  fullWidth
                  id="newpassword"
                  label="Enter Your New Password"
                  name="newpassword"
                  autoComplete="newpassword"
                  value={values.newpassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              {errors.newpassword && touched.newpassword ? (
                <Alert
                  variant="string"
                  severity="error"
                  sx={{ color: "#f44336" }}
                >
                  {errors.newpassword}
                </Alert>
              ) : null}

              <Grid item xs={12}>
                <TextField
                  type="password"
                  error={
                    errors.confirmnewpassword && touched.confirmnewpassword
                      ? true
                      : false
                  }
                  required
                  fullWidth
                  id="confirmnewpassword"
                  label="Confirm Your New Password"
                  name="confirmnewpassword"
                  autoComplete="confirmnewpassword"
                  value={values.confirmnewpassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              {errors.confirmnewpassword && touched.confirmnewpassword ? (
                <Alert
                  variant="string"
                  severity="error"
                  sx={{ color: "#f44336" }}
                >
                  {errors.confirmnewpassword}
                </Alert>
              ) : null}
            </Grid>

            <LoadingButton
              sx={{ mt: 3, mb: 2 }}
              disabled={!isValid}
              onClick={handelReset}
              fullWidth
              loading={isLoading}
              variant="contained"
            >
              Reset Password
            </LoadingButton>

            <Grid container justifyContent="space-between">
              <Grid item>
                <RouterLink
                  to={"/forgotpass"}
                  style={{
                    textDecoration: "none",
                    color: "#1976d2",
                  }}
                >
                  <Typography paragraph>Forgot password</Typography>
                </RouterLink>
              </Grid>

              <Grid item>
                <Typography paragraph>
                  <RouterLink
                    to={"/Login"}
                    style={{
                      textDecoration: "none",
                      color: "#1976d2",
                    }}
                  >
                    Login
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

export default Reset;
