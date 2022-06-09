import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";
import axiosInstance from "configs";
import { useMutation, useQueryClient } from "react-query";
import Toast from "../../../Helper/Toast";
import { useSelector } from "react-redux";
import { useLayoutEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { Grid } from "@mui/material";

const EditSubscription = ({
  openEditsubpop,
  handleCloseEditsubpop,
  listofuser,
}) => {
  const [Edituserdata, setEdituserdata] = React.useState({});
  const queryClient = useQueryClient();
  const userlist = useSelector((state) => state.Login.blacklistedvendorlist);
  const userEditId = useSelector(
    (state) => state.Login.blacklistedvendorlistId
  );
  const [option, setoption] = React.useState(1);

  useLayoutEffect(() => {
    const editdata = userlist.filter((item) => item._id === userEditId);
    setEdituserdata(editdata[0]);
  }, [userlist, userEditId]);

  const Addsub = async () => {
    const res = await axiosInstance.post(
      `/vendor/updateCategory/${Edituserdata._id}`,
      {
        category: option,
      }
    );

    return res;
  };

  const Addsubmutation = useMutation(Addsub, {
    onSuccess: (data) => {
      listofuser.refetch();

      Toast({ message: data.data.message });

      handleCloseEditsubpop();
    },
    onError: (data) => {
      Toast({
        message: data?.response?.data?.message || "Something Wrong",
        type: "error",
      });

      handleCloseEditsubpop();
    },
    onSettled: () => {
      queryClient.invalidateQueries("added sub");
    },
  });

  function expSubmit() {
    Addsubmutation.mutate();
  }

  return (
    <div>
      <Dialog
        open={openEditsubpop}
        onClose={handleCloseEditsubpop}
        maxWidth="sm"
        scroll="paper"
        fullWidth
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <Box component="form">
          <DialogTitle id="scroll-dialog-title" fontSize={"1rem"}>
            Edit Category
          </DialogTitle>

          <DialogContent dividers>
            {/* {errmsg && <Alert severity="error" variant='filled' sx={{ mt: 2, mb: 2 }}>{errmsg}</Alert>} */}

            <DialogContentText>Update Blacklist Category</DialogContentText>

            <Grid container direction={"column"}>
              <Grid item>
                <>
                  <p>
                    Vendor Blacklisting Category will be Updated based on
                    selected Value
                  </p>
                </>

                <FormControl size="medium" sx={{ mt: 2, minWidth: 200 }}>
                  <InputLabel id="demo-simple-select-label">
                    Subscription Plan
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="subplan"
                    label="Subscription Plan"
                    value={option}
                    onChange={(e) => setoption(e.target.value)}
                  >
                    <MenuItem value={1}>Blacklisted</MenuItem>
                    <MenuItem value={2}>Highly Cautious</MenuItem>
                    <MenuItem value={3}>Cautious</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseEditsubpop}>Cancel</Button>
            <LoadingButton
              onClick={expSubmit}
              loading={Addsubmutation.isLoading}
            >
              Edit Category
            </LoadingButton>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default EditSubscription;
