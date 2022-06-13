import * as React from "react";

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import { Link } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import TableHead from "@mui/material/TableHead";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { Grid } from "@mui/material";

import { Button } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosInstance from "configs";
import Toast from "../../../Helper/Toast";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Rejectreq from "./Rejectreq";
import { imgurl } from "configs";

import { gridSpacing } from "store/constant";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#2986CE",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page">
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page">
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page">
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const getallReq = async () => {
  const res = await axiosInstance.get("/vendor/getAllRequest");
  return res;
};
const Acceptreq = async (id) => {
  const res = await axiosInstance.post(`/vendor/addReqToBlacklist/${id}`);
  return res;
};
function ManageBlacklistReq() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openpop, setOpenpop] = React.useState(false);
  const [rejectVendorId, setrejectVendorId] = React.useState("");
  const getallReqquery = useQuery("GETREQ", getallReq);
  const queryClient = useQueryClient();

  const AcceptRequest = useMutation((id) => Acceptreq(id), {
    onSuccess: (data) => {
      Toast({ message: "Request Accepted" });
      getallReqquery.refetch();
    },
    onError: (data) => {
      Toast({
        message: data.response.data.message || "Something wrong",
        type: "error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries("userdeleted");
    },
  });

  const rows = getallReqquery?.data?.data;
  // const rows = [{

  //     vendorName: "Gopal Locha",
  //     ReasonForAdmin: "Very oily Locha",
  //     Address: "B-788 Satadhar",
  //     date: "Ketan",
  //     _id: "abcd"
  // }, {

  //     vendorName: "Gopal Locha",
  //     ReasonForAdmin: "Very oily Locha",
  //     Address: "B-788 Satadhar",
  //     date: "Ketan",
  //     _id: "abcdeee"
  // }]

  const handleClickOpenpop = (id) => {
    setrejectVendorId(id);
    setOpenpop(true);
  };

  const handleClosepop = (fn) => {
    if (typeof fn === "function") {
      fn();
    }
    setOpenpop(false);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function acceptpost(id) {
    AcceptRequest.mutate(id);
  }

  return (
    <>
      {openpop && (
        <Rejectreq
          openpop={openpop}
          handleClosepop={handleClosepop}
          rejectVendorId={rejectVendorId}
          Listofuser={getallReqquery}></Rejectreq>
      )}

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} justifyContent={"space-between"} alignContent={"center"}>
          <h1>Requests for Blacklist</h1>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 1000 }} aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name of Vendor</StyledTableCell>
                  <StyledTableCell>Reason for Black-list</StyledTableCell>
                  <StyledTableCell>Vendor Address</StyledTableCell>
                  <StyledTableCell>Request Date</StyledTableCell>
                  <StyledTableCell>Request Sent By</StyledTableCell>
                  <StyledTableCell>Photo</StyledTableCell>
                  <StyledTableCell>Accept</StyledTableCell>
                  <StyledTableCell>Reject</StyledTableCell>
                </TableRow>
              </TableHead>

              {rows?.length > 0 && (
                <TableBody>
                  {(rowsPerPage > 0
                    ? rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : rows
                  )?.map((row, i) => {
                    let date = row?.createdAt ? new Date(row.createdAt) : null;

                    return (
                      <TableRow key={i}>
                        <TableCell
                          style={{ width: 150 }}
                          sx={{
                            "&.MuiTableCell-root": {
                              fontWeight: 700,
                            },
                          }}>
                          {row.vendorName}
                        </TableCell>
                        <TableCell style={{ width: 150 }}>{row.reason}</TableCell>
                        <TableCell style={{ width: 150 }}>{row.address}</TableCell>

                        <TableCell style={{ width: 100 }}>
                          {date ? date?.toISOString().substring(0, 10) : null}
                        </TableCell>
                        <TableCell style={{ width: 150 }}>
                          {row.userId?.firstName + " " + row.userId?.lastName}
                        </TableCell>
                        <TableCell style={{ width: 100 }}>
                          {row.image ? (
                            <Link
                              href={`${imgurl}/${row.image}`}
                              underline="hover"
                              target="_blank"
                              rel="noreferrer">
                              Photo Proof
                            </Link>
                          ) : (
                            <p>No Photo Proof</p>
                          )}
                        </TableCell>

                        <TableCell style={{ width: 10 }} onClick={() => acceptpost(row._id)}>
                          <Button
                            variant="outlined"
                            startIcon={<CheckIcon />}
                            color="success"
                            size="small"
                            fullWidth>
                            Accept
                          </Button>
                        </TableCell>
                        <TableCell
                          style={{ width: 10 }}
                          onClick={() => handleClickOpenpop(row._id)}>
                          <Button
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            color="error"
                            size="small"
                            fullWidth>
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              )}

              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                    colSpan={7}
                    count={rows ? rows?.length : 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}

export default ManageBlacklistReq;
