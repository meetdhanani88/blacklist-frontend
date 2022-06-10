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
import Toast from "Helper/Toast";
import { LoadingButton } from "@mui/lab";

//import Google from 'assets/images/icons/social-google.svg';

// ============================|| FIREBASE - LOGIN ||============================ //

const ResetPassui = () => {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  //const dispatch = useDispatch();
  const [suceessmsg, setsuceessmsg] = useState(false);
  const [errmsg, seterrmsg] = useState(false);

  const [myval, setmyval] = useState("");

  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const postlogin = async () => {
    let res = await axiosInstance.post("/user/resetPassword", {
      email: myval.email,
      password: myval.oldpassword,
      newPassword: myval.newpassword,
    });
    return res.data;
  };

  const { mutate, isLoading } = useMutation(postlogin, {
    onSuccess: (data) => {
      setsuceessmsg(data.message);
      Toast({ message: `${data.message}` });
      Toast({ message: "Login With New Password ", delay: 500 });
      seterrmsg("");
      nav("/login");
    },
    onError: (data) => {
      seterrmsg(data.response.data.message || "Something Wrong");
      setsuceessmsg("");
    },
    onSettled: () => {
      queryClient.invalidateQueries("user reset");
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
            <Typography variant="subtitle1">Reset Your Password</Typography>
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
          oldpassword: "",
          newpassword: "",
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          oldpassword: Yup.string().max(255).required("Password is required"),
          newpassword: Yup.string()
            .oneOf([Yup.ref("newpassword"), null], "Passwords must match")
            .max(255)
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
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput }}
            >
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
                <FormHelperText
                  error
                  id="standard-weight-helper-text-email-login"
                >
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.oldpassword && errors.oldpassword)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-password-login">
                Old Password
              </InputLabel>
              <OutlinedInput
                id="oldpassword"
                type={showPassword ? "text" : "password"}
                value={values.oldpassword}
                name="oldpassword"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.oldpassword && errors.oldpassword && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-login"
                >
                  {errors.oldpassword}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.newpassword && errors.newpassword)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-password-login">
                New Password
              </InputLabel>
              <OutlinedInput
                id="newpassword"
                type={showPassword ? "text" : "password"}
                value={values.newpassword}
                name="newpassword"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="newpassword"
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

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Typography
                variant="subtitle1"
                color="secondary"
                sx={{ textDecoration: "none", cursor: "pointer" }}
                onClick={() => nav("/login")}
              >
                Login?
              </Typography>
              <Typography
                variant="subtitle1"
                color="secondary"
                sx={{ textDecoration: "none", cursor: "pointer" }}
                onClick={() => nav("/forgotpass")}
              >
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

export default ResetPassui;
