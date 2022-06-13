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
import LoadingButton from "@mui/lab/LoadingButton";

const Rejectreq = ({ openpop, handleClosepop, Listofuser, rejectVendorId }) => {
  const [errmsg, seterrmsg] = React.useState(false);
  const queryClient = useQueryClient();

  async function Rejectvendor() {
    const res = await axiosInstance.post(`/vendor/rejectRequest/${rejectVendorId}`, {
      reason: values.reason,
    });

    return res;
  }
  const mutation = useMutation(Rejectvendor, {
    onSuccess: (data) => {
      Listofuser.refetch();

      handleReset();
      handleClosepop();
      Toast({ message: "Request Rejected" });
    },
    onError: (data) => {
      seterrmsg(data.response.data.message || "Something Went Wrong");
    },
    onSettled: () => {
      queryClient.invalidateQueries("Rejected");
    },
  });

  function handelRejectvendor() {
    mutation.mutate();
  }

  const validationSchema = Yup.object({
    reason: Yup.string().min(10, "Minimum Length 10").required("Reason is require"),
  });

  const { errors, values, handleBlur, handleSubmit, handleChange, touched, isValid, handleReset } =
    useFormik({
      initialValues: {
        reason: "",
      },
      validationSchema,
      onSubmit: handelRejectvendor,
    });

  return (
    <div>
      <Dialog
        open={openpop}
        onClose={handleClosepop}
        maxWidth="sm"
        scroll="paper"
        fullWidth
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description">
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <DialogTitle id="scroll-dialog-title" fontSize={"1rem"}>
            Reason For Rejection
          </DialogTitle>

          <DialogContent dividers>
            {errmsg && (
              <Alert severity="error" variant="filled" sx={{ mt: 2, mb: 2 }}>
                {errmsg}
              </Alert>
            )}
            <DialogContentText>Give Reason for Rejecting request of Blacklist.</DialogContentText>

            <TextField
              error={errors.reason && touched.reason ? true : false}
              required
              margin="dense"
              id="reason"
              label="Reason"
              type="text"
              fullWidth
              variant="standard"
              sx={{ maxWidth: 700 }}
              value={values.reason}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.reason && touched.reason ? (
              <Alert variant="string" severity="error" sx={{ color: "#f44336" }}>
                {errors.reason}
              </Alert>
            ) : null}
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClosepop}>Cancel</Button>
            <LoadingButton
              loading={mutation.isLoading}
              onClick={handelRejectvendor}
              disabled={!isValid || values.reason === ""}>
              Reject Request
            </LoadingButton>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default Rejectreq;
