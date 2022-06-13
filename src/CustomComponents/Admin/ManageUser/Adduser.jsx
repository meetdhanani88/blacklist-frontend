import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, InputLabel, MenuItem, Select, FormControl, Alert } from "@mui/material";
import axiosInstance from "configs";
import { useMutation, useQueryClient } from "react-query";
import Toast from "../../../Helper/Toast";
import LoadingButton from "@mui/lab/LoadingButton";

const Adduser = ({ openpop, handleClosepop, Listofuser }) => {
  const [plan, setplan] = React.useState(1);
  const [errmsg, seterrmsg] = React.useState(false);
  const queryClient = useQueryClient();

  async function Createuser() {
    let sp;
    if (plan === 1) {
      sp = 12;
    } else if (plan === 2) {
      sp = 6;
    } else if (plan === 3) {
      sp = 3;
    }

    const res = await axiosInstance.post("/user/createUser", {
      firstName: values.firstname,
      lastName: values.lastname,
      email: values.email,
      mobileNo: values.mobileno,
      plan: plan,
      expiryDate: sp,
    });

    return res;
  }
  const mutation = useMutation(Createuser, {
    onSuccess: (data) => {
      Listofuser.refetch();

      setplan(0);
      handleReset();
      handleClosepop();
      Toast({ message: "User Created & Password sent on Email" });
    },
    onError: (data) => {
      seterrmsg(data.response.data.message || "Something Went Wrong");
    },

    onSettled: () => {
      queryClient.invalidateQueries("craeayeuser");
    },
  });

  const handleplanChange = (event) => {
    setplan(event.target.value);
  };

  function handelAdduser() {
    mutation.mutate();
  }

  const validationSchema = Yup.object({
    firstname: Yup.string().required("firstname is required"),
    lastname: Yup.string().required("lastname is required"),
    email: Yup.string().email("Invalid Email").required("email is required"),
    mobileno: Yup.string().min(10, "Minimum Length 10").required("mobile no is require"),
  });

  const { errors, values, handleBlur, handleSubmit, handleChange, touched, isValid, handleReset } =
    useFormik({
      initialValues: {
        firstname: "",
        lastname: "",
        email: "",
        mobileno: "",
      },
      validationSchema,
      onSubmit: handelAdduser,
    });

  return (
    <div>
      <Dialog
        open={openpop}
        onClose={handleClosepop}
        maxWidth="sm"
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description">
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <DialogTitle id="scroll-dialog-title" fontSize={"1rem"}>
            Add New User
          </DialogTitle>

          <DialogContent dividers>
            {errmsg && (
              <Alert severity="error" variant="filled" sx={{ mt: 2, mb: 2 }}>
                {errmsg}
              </Alert>
            )}
            <DialogContentText>Add New user for giving acess to Find-Blacklist.</DialogContentText>

            <TextField
              error={errors.firstname && touched.firstname ? true : false}
              required
              margin="dense"
              id="firstname"
              label="First Name"
              type="text"
              fullWidth
              variant="standard"
              sx={{ maxWidth: 700 }}
              value={values.firstname}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.firstname && touched.firstname ? (
              <Alert variant="string" severity="error" sx={{ color: "#f44336" }}>
                {errors.firstname}
              </Alert>
            ) : null}
            <TextField
              required
              error={errors.lastname && touched.lastname ? true : false}
              margin="dense"
              id="lastname"
              label="Last Name"
              type="text"
              fullWidth
              variant="standard"
              sx={{ maxWidth: 700 }}
              value={values.lastname}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.lastname && touched.lastname ? (
              <Alert variant="string" severity="error" sx={{ color: "#f44336" }}>
                {errors.lastname}
              </Alert>
            ) : null}
            <TextField
              error={errors.email && touched.email ? true : false}
              required
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              sx={{ maxWidth: 700 }}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email ? (
              <Alert variant="string" severity="error" sx={{ color: "#f44336" }}>
                {errors.email}
              </Alert>
            ) : null}

            <TextField
              error={errors.mobileno && touched.mobileno ? true : false}
              required
              margin="dense"
              id="mobileno"
              label="Mobile No"
              type="number"
              fullWidth
              variant="standard"
              sx={{ maxWidth: 700 }}
              value={values.mobileno}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.mobileno && touched.mobileno ? (
              <Alert variant="string" severity="error" sx={{ color: "#f44336" }}>
                {errors.mobileno}
              </Alert>
            ) : null}

            <FormControl size="medium" sx={{ mt: 2, minWidth: 200 }}>
              <InputLabel id="demo-simple-select-label">Subscription Plan</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="subplan"
                label="Subscription Plan"
                value={plan}
                onChange={handleplanChange}>
                <MenuItem value={1}>Premium Plan (1 Year)</MenuItem>
                <MenuItem value={2}>Gold Plan (6 Months)</MenuItem>
                <MenuItem value={3}>Silver Plan (3 Months)</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClosepop}>Cancel</Button>

            <LoadingButton
              loading={mutation.isLoading}
              onClick={handelAdduser}
              disabled={!isValid || values.firstname === ""}>
              Add User
            </LoadingButton>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default Adduser;
