import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { Box } from "@mui/material";
import axiosInstance from "configs";
import { useMutation, useQueryClient } from "react-query";
import Toast from "../../../Helper/Toast";
import { useSelector } from "react-redux";
import { useLayoutEffect } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FormControl } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Grid } from "@mui/material";

const EditSubscription = ({
  openEdituserpop,
  handleCloseEdituserpop,
  listofuser,
}) => {
  const [Edituserdata, setEdituserdata] = React.useState({});
  const queryClient = useQueryClient();
  const userlist = useSelector((state) => state.Login.userlist);
  const userEditId = useSelector((state) => state.Login.userEditId);

  const [radioval, setradioval] = React.useState("extendExpiry");
  const [date, setdate] = React.useState(null);

  async function Inactiveplan() {
    const res = await axiosInstance.post(
      `/user/userActiveOrInActive/${userEditId}`
    );

    return res;
  }

  useLayoutEffect(() => {
    const editdata = userlist.filter((item) => item._id === userEditId);

    setEdituserdata(editdata[0]);
  }, [userlist, userEditId]);

  const inactivesubmutation = useMutation(Inactiveplan, {
    onSuccess: async (data) => {
      listofuser.refetch();

      Toast({ message: data.data.message });
      handleReset();
      handleCloseEdituserpop();
    },
    onError: (data) => {
      Toast({
        message: data?.response?.data?.message || "something Wrong",
        type: "error",
      });
      handleReset();
      handleCloseEdituserpop();
    },
    onSettled: () => {
      queryClient.invalidateQueries("userInactiveplan");
    },
  });

  const Addsub = async () => {
    const res = await axiosInstance.post(
      `/user/extendExpiryDate/${Edituserdata._id}`,
      {
        expiryDate: date,
      }
    );

    return res;
  };

  const Addsubmutation = useMutation(Addsub, {
    onSuccess: (data) => {
      listofuser.refetch();

      Toast({ message: data.data.message });
      handleReset();
      handleCloseEdituserpop();
    },
    onError: (data) => {
      Toast({
        message: data?.response?.data?.message || "Something Wrong",
        type: "error",
      });
      handleReset();
      handleCloseEdituserpop();
    },
    onSettled: () => {
      queryClient.invalidateQueries("added sub");
    },
  });

  function handelEdiuser() {
    if (values.Subscription_Plan?.length > 0) {
      inactivesubmutation.mutate();
    } else {
      Addsubmutation.mutate();
    }
  }

  function Radiochange(event) {
    setradioval(event.target.value);
  }
  function expSubmit() {
    Addsubmutation.mutate();
  }

  function inactiveSubmit() {
    inactivesubmutation.mutate();
  }

  const { values, handleSubmit, handleReset } = useFormik({
    initialValues: {
      firstname: Edituserdata.firstName,
      lastname: Edituserdata.lastName,
      email: Edituserdata.email,
      mobileno: Edituserdata.MobileNo,
      Subscription_Plan: Edituserdata.Subscription_Plan,
      Expiry_Date: Edituserdata.Expiry_Date,
    },

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
        fullWidth
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description">
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <DialogTitle id="scroll-dialog-title" fontSize={"1rem"}>
            Edit Subscription
          </DialogTitle>

          <DialogContent dividers>
            {/* {errmsg && <Alert severity="error" variant='filled' sx={{ mt: 2, mb: 2 }}>{errmsg}</Alert>} */}

            <DialogContentText>Update User Subscription</DialogContentText>

            <Grid container direction={"column"}>
              <Grid item>
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={radioval}
                    onChange={Radiochange}>
                    <FormControlLabel
                      value="extendExpiry"
                      control={<Radio />}
                      label="Extend Expiry"
                    />
                    <FormControlLabel
                      value="disablePlan"
                      control={<Radio />}
                      label="In-Active User "
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item>
                {radioval === "extendExpiry" ? (
                  <>
                    <p>
                      User current plan expiry will be extended based on
                      selected date
                    </p>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        minDate={new Date()}
                        disablePast
                        label="Expiry Date"
                        value={date}
                        onChange={(newValue) => {
                          setdate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </>
                ) : (
                  <>
                    <p>
                      User will be Inactivated & User won't be able to Login
                    </p>
                    <FormControlLabel
                      disabled
                      checked
                      control={<Checkbox />}
                      label="Inactive User"
                    />
                  </>
                )}
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseEdituserpop}>Cancel</Button>
            {radioval === "extendExpiry" ? (
              <LoadingButton disabled={date === null} onClick={expSubmit}>
                Extend Expiry
              </LoadingButton>
            ) : (
              <LoadingButton
                onClick={inactiveSubmit}
                loading={inactivesubmutation.isLoading}>
                Inactive User
              </LoadingButton>
            )}
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default EditSubscription;
