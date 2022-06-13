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
import { useNavigate } from "react-router";
// project imports

import AnimateButton from "ui-component/extended/AnimateButton";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useQueryClient, useMutation } from "react-query";
import axiosInstance from "configs";
import { useDispatch } from "react-redux";
import { LOGIN } from "store/actions";
import Toast from "Helper/Toast";
import { LoadingButton } from "@mui/lab";

//import Google from 'assets/images/icons/social-google.svg';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ setrole }) => {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  //const dispatch = useDispatch();
  const [suceessmsg, setsuceessmsg] = useState(false);
  const [errmsg, seterrmsg] = useState(false);
  const [load, setload] = useState(true);

  const [myval, setmyval] = useState("");
  const dispatch = useDispatch();

  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const postlogin = async (values) => {
    let res = await axiosInstance.post("/user/SignIn", values);
    return res.data;
  };

  const { mutate, isLoading } = useMutation((values) => postlogin(values), {
    onSuccess: (data) => {
      dispatch({ type: LOGIN, payload: data.user });
      localStorage.setItem("token", data.token);

      setsuceessmsg(data.message);
      seterrmsg("");

      if (data.user._id === 1) {
        Toast({ message: `${data.message}` || "Success" });

        setrole(1);
        nav("/admin", { replace: true });
      }

      if (data.user._id === 2) {
        setrole(2);

        if (myval.password.slice(0, 5) === "A@p#1") {
          Toast({ message: "Reset Your Password" });
          nav("/resetpass", {
            state: {
              pass: myval.password,
              email: myval.email,
            },
            replace: true,
          });
        } else {
          Toast({ message: "Login Successfully" });
          nav("/user", {
            state: {
              pass: myval.password,
              email: myval.email,
            },
            replace: true,
          });
        }
      }
    },
    onError: (data) => {
      if (data.code === "ERR_NETWORK") {
        seterrmsg("No Network");
        setload(false);
      }
      seterrmsg(data.response.data.message || "Something Wrong");
      setsuceessmsg("");
    },
    onSettled: () => {
      queryClient.invalidateQueries("user Login");
    },
  });

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Sign in with Email address</Typography>
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
          email: "",
          password: "",
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={async (values) => {
          setmyval(values);
          mutate(values);
        }}>
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">
                Email Address / Username
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address / Username"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Typography
                variant="subtitle1"
                color="secondary"
                sx={{ textDecoration: "none", cursor: "pointer" }}
                onClick={() => nav("/resetpass")}>
                Reset Password?
              </Typography>
              <Typography
                variant="subtitle1"
                color="secondary"
                sx={{ textDecoration: "none", cursor: "pointer" }}
                onClick={() => nav("/forgotpass")}>
                Forgot Password?
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
                  loading={load && isLoading}>
                  Sign in
                </LoadingButton>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
