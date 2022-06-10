import { useState } from "react";
//import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  //Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Alert,
  //  useMediaQuery
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router";
// project imports

import AnimateButton from "ui-component/extended/AnimateButton";

import { useQueryClient, useMutation } from "react-query";
import axiosInstance from "configs";

import Toast from "Helper/Toast";
import { LoadingButton } from "@mui/lab";

//import Google from 'assets/images/icons/social-google.svg';

// ============================|| FIREBASE - LOGIN ||============================ //

const Resetui = () => {
  const nav = useNavigate();
  const queryClient = useQueryClient();

  const [suceessmsg, setsuceessmsg] = useState(false);
  const [errmsg, seterrmsg] = useState(false);
  const { code } = useParams();

  const [myval, setmyval] = useState("");

  const theme = useTheme();

  const postlogin = async () => {
    let res = await axiosInstance.post("/user/updatePassword", {
      password: myval.newpassword,
      token: code,
    });
    return res.data;
  };

  const { mutate, isLoading } = useMutation(postlogin, {
    onSuccess: (data) => {
      Toast({ message: `${data.message}` });

      seterrmsg("");
      nav("/login");
    },

    onError: (data) => {
      seterrmsg(data.response.data.message || "Something went Wrong");
      setsuceessmsg("");
    },
    onSettled: () => {
      queryClient.invalidateQueries("password reseted");
    },
  });

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Enter New Password For Reset
            </Typography>
          </Box>
        </Grid>
      </Grid>
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
      <Formik
        initialValues={{
          newpassword: "",
          confirmnewpassword: "",
        }}
        validationSchema={Yup.object().shape({
          newpassword: Yup.string().max(255).required("Password is required"),
          confirmnewpassword: Yup.string()
            .oneOf([Yup.ref("newpassword"), null], "Passwords must match")
            .required("Password is required"),
        })}
        onSubmit={async (values) => {
          setmyval(values);
          mutate(values);
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <FormControl
              fullWidth
              error={Boolean(touched.newpassword && errors.newpassword)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-password-login">
                Enter New Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type="password"
                value={values.newpassword}
                name="newpassword"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                      size="large"
                    ></IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.newpassword && errors.newpassword && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-login"
                >
                  {errors.newpassword}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              fullWidth
              error={Boolean(
                touched.confirmnewpassword && errors.confirmnewpassword
              )}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-password-login">
                Confirm New Password
              </InputLabel>
              <OutlinedInput
                id="confirmnewpassword"
                type="password"
                value={values.confirmnewpassword}
                name="confirmnewpassword"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                      size="large"
                    ></IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.confirmnewpassword && errors.confirmnewpassword && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-login"
                >
                  {errors.confirmnewpassword}
                </FormHelperText>
              )}
            </FormControl>

            <Stack
              direction="row"
              alignItems="flex-end"
              justifyContent="end"
              spacing={1}
            >
              <Typography
                variant="subtitle1"
                color="secondary"
                sx={{ textDecoration: "none", cursor: "pointer" }}
                onClick={() => nav("/Login")}
              >
                Login?
              </Typography>
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <LoadingButton
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  loading={isLoading}
                >
                  Reset Password
                </LoadingButton>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Resetui;
