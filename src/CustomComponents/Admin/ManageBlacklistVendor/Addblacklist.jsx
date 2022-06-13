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

const Addblacklist = ({ openpop, handleClosepop, Listofuser, role }) => {
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = React.useState("");

  async function Addblacklist(data) {
    const res = await axiosInstance.post("/vendor/addToBlacklist", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res;
  }

  async function sentreqapi(data) {
    const res = await axiosInstance.post("/vendor/blacklistRequest", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res;
  }

  const addblacklist = useMutation((data) => Addblacklist(data), {
    onSuccess: (data) => {
      Toast({ message: data.data.message });
      Listofuser.refetch();
      handleReset();
      handleClosepop();
    },
    onError: (data) => {
      Toast({
        message: data?.response?.data?.message || "Something Wrong",
        type: "error",
      });
      handleReset();
      handleClosepop();
    },
    onSettled: () => {
      handleReset();
      queryClient.invalidateQueries("added blacklist");
    },
  });

  const sentreq = useMutation((data) => sentreqapi(data), {
    onSuccess: (data) => {
      Toast({ message: data.data.message });

      handleReset();
      handleClosepop();
    },
    onError: (data) => {
      Toast({
        message: data?.response?.data?.message || "Something Wrong",
        type: "error",
      });
      handleReset();
      handleClosepop();
    },
    onSettled: () => {
      queryClient.invalidateQueries("Sent Req");
    },
  });

  function handelAddBlacklist(rol) {
    const finalData = {
      vendorName: values.vendorname,
      address: values.address,
      reason: values.reason,
      image: imageFile,
    };

    if (rol === "admin") {
      addblacklist.mutate(finalData);
    }

    if (rol === "user") {
      sentreq.mutate(finalData);
    }
  }

  const validationSchema = Yup.object({
    vendorname: Yup.string().required("vendorname is required"),
    address: Yup.string().required("address is required"),
    reason: Yup.string().required("reason is required").min(10, "Minimum 10 char Require"),
  });

  const { errors, values, handleBlur, handleSubmit, handleChange, touched, isValid, handleReset } =
    useFormik({
      initialValues: {
        vendorname: "",
        address: "",
        reason: "",
      },
      validationSchema,
      onSubmit: handelAddBlacklist,
    });

  function handleImage(event) {
    let image = event.target.files[0];

    if (image === "" || image === undefined) {
      alert(`Not an image. This file is: ${typeof imageFile}`);
      return;
    }
    setImageFile(image);
  }

  return (
    <div>
      <Dialog
        open={openpop}
        onClose={() => handleClosepop(handleReset)}
        maxWidth="sm"
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description">
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{}}>
          {role === "user" ? (
            <DialogTitle id="scroll-dialog-title">Sent New BlackList Request</DialogTitle>
          ) : (
            <DialogTitle id="scroll-dialog-title" fontSize={"1rem"}>
              Add New Vendor to BlackList
            </DialogTitle>
          )}

          <DialogContent dividers>
            <DialogContentText>
              {role === "user"
                ? "Sent New Request for Blacklisting Vendors "
                : "Add New Vendor to Blacklist."}
            </DialogContentText>

            <TextField
              error={errors.vendorname && touched.vendorname ? true : false}
              required
              margin="dense"
              id="vendorname"
              label="Vendor Name"
              type="text"
              fullWidth
              variant="standard"
              sx={{ maxWidth: 700 }}
              value={values.vendorname}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.vendorname && touched.vendorname ? (
              <Alert variant="string" severity="error" sx={{ color: "#f44336" }}>
                {errors.vendorname}
              </Alert>
            ) : null}
            <TextField
              required
              error={errors.address && touched.address ? true : false}
              margin="dense"
              id="address"
              label="Vendor Address"
              type="text"
              fullWidth
              variant="standard"
              sx={{ maxWidth: 700 }}
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.address && touched.address ? (
              <Alert variant="string" severity="error" sx={{ color: "#f44336" }}>
                {errors.address}
              </Alert>
            ) : null}
            <TextField
              error={errors.reason && touched.reason ? true : false}
              required
              margin="dense"
              id="reason"
              label="Reason For Blacklist"
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

            <Button variant="contained" component="label" sx={{ my: 3 }}>
              Upload Photo Proof
              <input
                type="file"
                hidden
                accept="image/gif, image/jpeg, image/png"
                name="image"
                id="imageFile"
                onChange={handleImage}
              />
            </Button>
            <div>
              {imageFile && (
                <img src={URL.createObjectURL(imageFile)} alt="" style={{ width: "100%" }} />
              )}
            </div>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                handleClosepop(handleReset);
              }}>
              Cancel
            </Button>

            {role === "user" ? (
              <LoadingButton
                loading={Addblacklist.isLoading}
                onClick={() => handelAddBlacklist("user")}
                disabled={!isValid || values.vendorname === ""}>
                Sent Request
              </LoadingButton>
            ) : (
              <LoadingButton
                loading={Addblacklist.isLoading}
                onClick={() => handelAddBlacklist("admin")}
                disabled={!isValid || values.vendorname === ""}>
                Add to Blacklist
              </LoadingButton>
            )}
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default Addblacklist;
