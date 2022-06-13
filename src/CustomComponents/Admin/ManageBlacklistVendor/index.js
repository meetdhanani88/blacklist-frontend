import * as React from "react";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import Fab from "@mui/material/Fab";
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
import DeleteIcon from "@mui/icons-material/Delete";
import { Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ModeEdit from "@mui/icons-material/ModeEdit";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosInstance from "configs";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import Toast from "../../../Helper/Toast";
import Addblacklist from "./Addblacklist";
import EditBlacklistedVendor from "./EditBlacklistedVendor";
import EditSubscription from "./EditSubscription";
import { imgurl } from "configs";
import { SETBLACKLISTEDVENDORLIST, SETBLACKLISTEDVENDOREDITID } from "store/actions";

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

const getblacklistedVendor = async () => {
  const res = await axiosInstance.get("/vendor/listOfBlackListVendor");
  return res;
};

async function deleteUser(id) {
  const res = await axiosInstance.post(`/vendor/removeToBlacklist/${id}`);
  return res;
}
function ManageBlacklistVendor() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openpop, setOpenpop] = React.useState(false);
  const [openEdituserpop, setopenEdituserpop] = React.useState(false);
  const [openEditsubpop, setopenEditsubpop] = React.useState(false);
  const getblacklistedVendorquery = useQuery("getuserlist", getblacklistedVendor);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const deletemutation = useMutation((id) => deleteUser(id), {
    onSuccess: (data) => {
      // Toast({ message: "Deleted User Successfully" })

      Toast({ message: data.data.message });

      getblacklistedVendorquery.refetch();
      setAnchorEl(null);
    },
    onError: (data) => {
      Toast({
        message: data?.response?.data?.message || "Something Wrong",
        type: "error",
      });

      //Toast({ message: "Something wrong", type: "error" })
    },
    onSettled: () => {
      queryClient.invalidateQueries("BlacklistedVendordeleted");
    },
  });

  const rows = getblacklistedVendorquery?.data?.data;

  // const rows = [{

  //     vendorName: "Gopal Locha",
  //     ReasonForAdmin: "Very oily Locha",
  //     Address: "B-788 Satadhar",
  //     date: "Ketan"
  // }, {

  //     vendorName: "Gopal Locha",
  //     ReasonForAdmin: "Very oily Locha",
  //     Address: "B-788 Satadhar",
  //     date: "Ketan"
  // }, {

  //     vendorName: "Gopal Locha",
  //     ReasonForAdmin: "Very oily Locha",
  //     Address: "B-788 Satadhar",
  //     date: "Ketan"
  // }]

  useEffect(() => {
    // dispatch(LoginAction.setblacklistedvendorlist(rows))
    dispatch({ type: SETBLACKLISTEDVENDORLIST, payload: rows });
  }, [rows, dispatch]);

  const Edituserfun = (btnid) => {
    dispatch({ type: SETBLACKLISTEDVENDOREDITID, payload: btnid.id });
    handleClose();
    handleClickOpenEdituserpop();
  };

  const Editsubrfun = (btn) => {
    //  dispatch(LoginAction.setblacklistedvendorEditId(btn.id))
    dispatch({ type: SETBLACKLISTEDVENDOREDITID, payload: btn.id });
    handleClose();
    setopenEditsubpop(true);
  };
  const Deleteuserfun = (btnid) => {
    deletemutation.mutate(btnid.id);
  };

  const handleClickOpenpop = (scrollType) => {
    setOpenpop(true);
  };
  const handleClickOpenEdituserpop = () => {
    setopenEdituserpop(true);
  };

  const handleClosepop = (fn) => {
    if (typeof fn === "function") {
      fn();
    }
    setOpenpop(false);
  };
  const handleCloseEdituserpop = () => {
    setopenEdituserpop(false);
  };
  const handleCloseEditsubpop = () => {
    setopenEditsubpop(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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

  function category(cat) {
    if (cat?._id === 1) {
      return <TableCell style={{ width: 70, color: "#e55350" }}>{cat?.name}</TableCell>;
    } else if (cat?._id === 2) {
      return <TableCell style={{ width: 70, color: "#ed6c02" }}>{cat?.name}</TableCell>;
    } else if (cat?._id === 3) {
      return <TableCell style={{ width: 70, color: "#2e7d32" }}>{cat?.name}</TableCell>;
    } else {
      return <TableCell style={{ width: 70 }}>{cat?.name}</TableCell>;
    }
  }

  return (
    <>
      {openEdituserpop && (
        <EditBlacklistedVendor
          openEdituserpop={openEdituserpop}
          handleCloseEdituserpop={handleCloseEdituserpop}
          listofuser={getblacklistedVendorquery}></EditBlacklistedVendor>
      )}
      {openEditsubpop && (
        <EditSubscription
          openEditsubpop={openEditsubpop}
          handleCloseEditsubpop={handleCloseEditsubpop}
          listofuser={getblacklistedVendorquery}></EditSubscription>
      )}
      {openpop && (
        <Addblacklist
          openpop={openpop}
          handleClosepop={handleClosepop}
          Listofuser={getblacklistedVendorquery}></Addblacklist>
      )}

      <Grid container spacing={gridSpacing}>
        <Grid container item xs={12} justifyContent={"space-between"} alignContent={"center"}>
          <h1>List of Blacklist Vendor</h1>
          <Fab color="primary" aria-label="add" variant="extended" onClick={handleClickOpenpop}>
            <AddIcon sx={{ mr: 1 }} />
            Add New Blacklist
          </Fab>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 1000 }} aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name of Vendor</StyledTableCell>
                  <StyledTableCell>Reason for Black-list</StyledTableCell>
                  <StyledTableCell>Vendor Address</StyledTableCell>
                  <StyledTableCell>Blacklisted Date</StyledTableCell>
                  <StyledTableCell>CATEGORY</StyledTableCell>
                  <StyledTableCell>Photo</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
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
                          style={{ width: 50 }}
                          sx={{
                            "&.MuiTableCell-root": {
                              fontWeight: 700,
                            },
                          }}>
                          {row.vendorName}
                        </TableCell>
                        <TableCell style={{ width: 100 }}>{row.reason}</TableCell>
                        <TableCell style={{ width: 100 }}>{row.address}</TableCell>

                        <TableCell style={{ width: 70 }}>
                          {date ? date?.toISOString().substring(0, 10) : null}
                        </TableCell>
                        {category(row.category)}

                        <TableCell style={{ width: 70 }}>
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
                        <TableCell style={{ width: 70 }}>
                          <IconButton
                            aria-label="edit"
                            id={row._id}
                            aria-controls={open ? "basic-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                            style={{ boxShadow: "none" }}>
                            <MenuIcon color="error" />
                          </IconButton>
                          {/* <p style={{}} ref={rowid}>{row._id}</p> */}
                          <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                              "aria-labelledby": "basic-button",
                            }}
                            sx={{
                              "& .MuiMenu-paper": {
                                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                              },
                            }}>
                            <MenuItem onClick={() => Edituserfun(anchorEl)}>
                              <ListItemIcon>
                                <ModeEdit fontSize="small" color="info" />
                              </ListItemIcon>

                              <ListItemText>Edit Blacklisted Vendor</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => Deleteuserfun(anchorEl)}>
                              <ListItemIcon>
                                <DeleteIcon fontSize="small" color="error" />
                              </ListItemIcon>
                              <ListItemText>Remove From BlackList</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => Editsubrfun(anchorEl)}>
                              <ListItemIcon>
                                <SubscriptionsIcon fontSize="small" color="success" />
                              </ListItemIcon>

                              <ListItemText>Edit Blacklist Status</ListItemText>
                            </MenuItem>
                          </Menu>
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
                    colSpan={6}
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

export default ManageBlacklistVendor;
