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

import { useQueryClient, useMutation } from "react-query";
import axiosInstance from "configs";
import { LoadingButton } from "@mui/lab";

//import Google from 'assets/images/icons/social-google.svg';

// ============================|| FIREBASE - LOGIN ||============================ //

const Forgotui = () => {
  const nav = useNavigate();
  const queryClient = useQueryClient();

  const [suceessmsg, setsuceessmsg] = useState(false);
  const [errmsg, seterrmsg] = useState(false);

  const [myval, setmyval] = useState("");

  const theme = useTheme();

  const postEmail = async () => {
    let res = await axiosInstance.post("/user/forgotPassword", {
      email: myval.email,
    });
    return res.data;
  };
  const { mutate, isLoading } = useMutation(postEmail, {
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
              Enter Email to Sent Reset Password Link
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
          email: "",
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
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
                Email Address
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
                  Sent Email
                </LoadingButton>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Forgotui;
