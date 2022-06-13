import * as React from "react";
import "./index.css";
import Fab from "@mui/material/Fab";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
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
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import Adduser from "./Adduser";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosInstance from "configs";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import Edituser from "./Edituser";
import EditSubscription from "./EditSubscription";
import { gridSpacing } from "store/constant";
import { GETUSEREDITID, USERLIST } from "store/actions";
import Toast from "Helper/Toast";

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

async function getusertList() {
  const userlist = await axiosInstance.get("/user/getAllUsers");
  return userlist;
}
async function deleteUser(id) {
  const res = await axiosInstance.post(`/user/deleteUser/${id}`);
  return res;
}

function CustomPaginationActionsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openpop, setOpenpop] = React.useState(false);
  const [openEdituserpop, setopenEdituserpop] = React.useState(false);
  const [openEditsubuserpop, setopenEditsubuserpop] = React.useState(false);
  const query = useQuery("getuserlist", getusertList);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const deletemutation = useMutation((id) => deleteUser(id), {
    onSuccess: (data) => {
      Toast({ message: "Deleted User Successfully" });
      query.refetch();
      setAnchorEl(null);
    },
    onError: (data) => {
      Toast({ message: "Something wrong", type: "error" });
    },
    onSettled: () => {
      queryClient.invalidateQueries("userdeleted");
    },
  });

  const rows = query?.data?.data;

  useEffect(() => {
    dispatch({ type: USERLIST, payload: rows });
  }, [rows, dispatch]);

  const Edituserfun = (btnid) => {
    dispatch({ type: GETUSEREDITID, payload: btnid.id });
    handleClose();
    handleClickOpenEdituserpop();
  };

  const Editsubrfun = (btn) => {
    //dispatch(LoginAction.GetuserEditId(btn.id))
    dispatch({ type: GETUSEREDITID, payload: btn.id });
    handleClose();
    setopenEditsubuserpop(true);
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

  const handleClosepop = () => {
    setOpenpop(false);
  };
  const handleCloseEdituserpop = () => {
    setopenEdituserpop(false);
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

  return (
    <>
      {openpop && (
        <Adduser openpop={openpop} handleClosepop={handleClosepop} Listofuser={query}></Adduser>
      )}
      {openEdituserpop && (
        <Edituser
          openEdituserpop={openEdituserpop}
          handleCloseEdituserpop={handleCloseEdituserpop}
          listofuser={query}></Edituser>
      )}

      {openEditsubuserpop && (
        <EditSubscription
          openEdituserpop={openEditsubuserpop}
          handleCloseEdituserpop={() => setopenEditsubuserpop(false)}
          listofuser={query}></EditSubscription>
      )}

      <Grid container spacing={gridSpacing}>
        <Grid container item xs={12} justifyContent={"space-between"} alignContent={"center"}>
          <h1>Users</h1>
          <Fab color="primary" aria-label="add" variant="extended" onClick={handleClickOpenpop}>
            <AddIcon sx={{ mr: 1 }} />
            Add User
          </Fab>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 1000 }} aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>First Name</StyledTableCell>
                  <StyledTableCell>Last Name</StyledTableCell>
                  <StyledTableCell>Email Address</StyledTableCell>
                  <StyledTableCell>Mobile No</StyledTableCell>
                  <StyledTableCell>Subscription Plan</StyledTableCell>
                  <StyledTableCell>Plan Expire</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>

              {rows?.length > 0 && (
                <TableBody>
                  {(rowsPerPage > 0
                    ? rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : rows
                  )?.map((row, i) => {
                    let date = row?.expiryDate ? new Date(row.expiryDate) : null;

                    return (
                      <TableRow key={row?._id}>
                        <TableCell
                          style={{ width: 50 }}
                          sx={{ "&.MuiTableCell-root": { fontWeight: 700 } }}>
                          {row.firstName}
                        </TableCell>
                        <TableCell
                          style={{ width: 50 }}
                          sx={{
                            "&.MuiTableCell-root": {
                              fontWeight: 700,
                            },
                          }}>
                          {row.lastName}
                        </TableCell>
                        <TableCell style={{ width: 100 }}>{row.email}</TableCell>
                        <TableCell style={{ width: 100 }}>{row.mobileNo}</TableCell>
                        <TableCell style={{ width: 70 }}>{row?.plan?.title}</TableCell>
                        <TableCell style={{ width: 70 }}>
                          {date ? date?.toISOString().substring(0, 10) : null}
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

                              <ListItemText>Edit User</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => Deleteuserfun(anchorEl)}>
                              <ListItemIcon>
                                <DeleteIcon fontSize="small" color="error" />
                              </ListItemIcon>
                              <ListItemText>Delete User</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => Editsubrfun(anchorEl)}>
                              <ListItemIcon>
                                <SubscriptionsIcon fontSize="small" color="success" />
                              </ListItemIcon>
                              <ListItemText>Edit Subscription</ListItemText>
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

export default CustomPaginationActionsTable;
