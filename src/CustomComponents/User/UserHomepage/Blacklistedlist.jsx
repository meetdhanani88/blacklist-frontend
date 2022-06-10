import { Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import BlacklistedlistItem from "./BlacklistedlistItem";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import axiosInstance from "configs";
import { SETBLACKLISTEDVENDORLIST } from "store/actions";
//import { LoginAction } from '../../../redux/reducersSlice/Loginslice';

const getAllBlacklist = async () => {
  const response = await axiosInstance.get("vendor/ListOfBlackListVendor");
  const data = response.data;
  return data;
};

const Blacklistedlist = () => {
  const { data, isLoading } = useQuery("getcoutry", getAllBlacklist);
  const BlacklistedList = data ? [...data] : [];

  const category = ["Blacklisted", "Highly Cautious", "Cautious"];
  const dispatch = useDispatch();

  useEffect(() => {
    //  dispatch(LoginAction.setblacklistedvendorlist(data))
    dispatch({ type: SETBLACKLISTEDVENDORLIST, payload: data });
  }, [data, dispatch]);

  const color = (cat) => {
    if (cat === "Blacklisted") {
      return { color: "#e55350 ", my: 2 };
    } else if (cat === "Cautious") {
      return { color: "#1565c0", my: 2 };
    } else if (cat === "Highly Cautious") {
      return { color: "#7b1fa2", my: 2 };
    } else {
      return { color: "#e55350 ", my: 2 };
    }
  };

  return (
    <>
      {isLoading && (
        <Box sx={{ display: "flex" }} justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {!isLoading &&
        category.map((cat) => (
          <Grid container key={cat}>
            <Typography
              variant="h4"
              gutterBottom
              component="div"
              color={"InfoText"}
              align="left"
              sx={color(cat)}
            >
              {cat}
            </Typography>

            <Grid container direction="row" spacing={4}>
              {BlacklistedList?.filter(
                (item) => item.category.name === cat
              ).map((listitem, key) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={key}
                  justifyContent="center"
                >
                  <BlacklistedlistItem listitem={listitem} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        ))}
    </>
  );
};

export default Blacklistedlist;
