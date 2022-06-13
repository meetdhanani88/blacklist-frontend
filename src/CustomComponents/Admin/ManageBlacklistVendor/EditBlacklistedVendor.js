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
import { Box, Alert } from "@mui/material";
import axiosInstance from "configs";
import { useMutation, useQueryClient } from "react-query";
import Toast from "../../../Helper/Toast";
import { useSelector } from "react-redux";
import { useLayoutEffect } from "react";

const EditBlacklistedVendor = ({ openEdituserpop, handleCloseEdituserpop, listofuser }) => {
  const [Edituserdata, setEdituserdata] = React.useState({});
  const [errmsg, seterrmsg] = React.useState(false);
  const queryClient = useQueryClient();
  const userlist = useSelector((state) => state.Login.blacklistedvendorlist);
  const userEditId = useSelector((state) => state.Login.blacklistedvendorlistId);

  useLayoutEffect(() => {
    const editdata = userlist.filter((item) => item._id === userEditId);
    setEdituserdata(editdata[0]);
  }, [userlist, userEditId]);

  async function EditCreateduser() {
    const res = await axiosInstance.post(`/vendor/updateVendor/${Edituserdata._id}`, {
      vendorName: values.vendorName,
      reason: values.reason,
      address: values.address,
    });

    return res;
  }
  const mutation = useMutation(EditCreateduser, {
    onSuccess: (data) => {
      listofuser.refetch();
      handleReset();
      handleCloseEdituserpop();
      Toast({ message: "Details Edited Successfully" });
    },
    onError: (data) => {
      seterrmsg(data.response.data.message || "Something Went Wrong");
    },
    onSettled: () => {
      queryClient.invalidateQueries("Blacklisted Vendor Edited");
    },
  });

  function handelEdiuser() {
    mutation.mutate();
  }

  const validationSchema = Yup.object({
    vendorName: Yup.string().required("vendorName is required"),
    address: Yup.string().required("address is required"),
    reason: Yup.string().min(10, "Minimum Length 10").required("reason is require"),
  });

  const { errors, values, handleBlur, handleSubmit, handleChange, touched, isValid, handleReset } =
    useFormik({
      initialValues: {
        vendorName: Edituserdata?.vendorName,
        reason: Edituserdata?.reason,
        address: Edituserdata?.address,
      },
      validationSchema,
      onSubmit: handelEdiuser,
      enableReinitialize: true,
    });

  return (
    <div>
      <Dialog
        open={openEdituserpop}
        onClose={handleCloseEdituserpop}
        maxWidth="sm"
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description">
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <DialogTitle id="scroll-dialog-title" fontSize={"1rem"}>
            Edit Blacklisted-Vendor
          </DialogTitle>

          <DialogContent dividers>
            {errmsg && (
              <Alert severity="error" variant="filled" sx={{ mt: 2, mb: 2 }}>
                {errmsg}
              </Alert>
            )}
            <DialogContentText>Edit Blacklisted-Vendor Details</DialogContentText>

            <TextField
              error={errors.vendorName && touched.vendorName ? true : false}
              required
              margin="dense"
              id="vendorName"
              label="Vendor Name"
              type="text"
              fullWidth
              variant="standard"
              sx={{ maxWidth: 700 }}
              value={values.vendorName || ""}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.vendorName && touched.vendorName ? (
              <Alert variant="string" severity="error" sx={{ color: "#f44336" }}>
                {errors.vendorName}
              </Alert>
            ) : null}
            <TextField
              required
              error={errors.reason && touched.reason ? true : false}
              margin="dense"
              id="reason"
              label="Reason of Blacklist"
              type="text"
              fullWidth
              variant="standard"
              sx={{ maxWidth: 700 }}
              value={values.reason || ""}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.reason && touched.reason ? (
              <Alert variant="string" severity="error" sx={{ color: "#f44336" }}>
                {errors.reason}
              </Alert>
            ) : null}

            <TextField
              error={errors.address && touched.address ? true : false}
              required
              margin="dense"
              id="address"
              label="Address Of Vendor "
              type="text"
              fullWidth
              variant="standard"
              sx={{ maxWidth: 700 }}
              value={values.address || ""}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.address && touched.address ? (
              <Alert variant="string" severity="error" sx={{ color: "#f44336" }}>
                {errors.address}
              </Alert>
            ) : null}
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseEdituserpop}>Cancel</Button>
            <Button onClick={handelEdiuser} disabled={!isValid || values.vendorName === ""}>
              Edit Details
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default EditBlacklistedVendor;
