/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
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
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TableHead,
  TextField,
  Typography
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

import { AppDispatch } from "../../redux/store";
import { RootState } from "../../redux/store";
import { customerState } from "../../constant";
import { useSnackbar } from "../utils/SnackbarProvider";
import { Data } from "../types";
import { deleteCustomer, putCustomer } from "../../redux/reducer/customerSlice";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

interface Column {
  id: "id" | "email" | "name" | "phone" | "state" | "register_date" | "action";
  label: string;
  minWidth?: number;
  align?: "left";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  {
    id: "email",
    label: "E-mail",
    minWidth: 170,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US")
  },
  {
    id: "name",
    label: "Name",
    minWidth: 110,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US")
  },
  {
    id: "phone",
    label: "Phone",
    minWidth: 130,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US")
  },
  {
    id: "state",
    label: "State",
    minWidth: 100,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US")
  },
  {
    id: "register_date",
    label: "Register Date",
    minWidth: 100,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US")
  },
  {
    id: "action",
    label: "Action",
    minWidth: 90,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US")
  }
];

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4
};

export default function Customers(props: any) {
  const { showSnackbar } = useSnackbar();
  const [rows, setRows] = React.useState<Data[]>(props.rows);
  const customers = useSelector((state: RootState) => state.customer);
  const [open, setOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [isEdit, setIsEdit] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    //-- parse product data once.
  }, [dispatch]);

  useEffect(() => {
    setRows(props.rows);
    //-- parse product data once.
  }, [props.rows]);

  const handleSubmit = (e: any) => {
    try {
      e.preventDefault();
      // dispatch(putCustomer(navigate, { state }, isEdit));
      dispatch(putCustomer(navigate, { state: parseInt(state) }, isEdit));
      handleClose();
      showSnackbar("Operation Successful", "success");
    } catch (error) {
      showSnackbar("Unable to Connect Server", "error");
      console.log(error);
    }
  };

  const handleEdit = (e: any) => {
    try {
      const id = e.currentTarget.getAttribute("data-id");
      setIsEdit(id);
      let data: any;
      for (const proItem of customers.customers) {
        if (proItem._id == id) {
          data = proItem;
          break;
        }
      }
      setOpen(true);
      setState(data!.state);
      setPassword(data!.password);
      console.log(id);
      e.preventDefault();
    } catch (error) {
      showSnackbar("Unable to Connect Server", "error");
      console.log(error);
    }
  };
  const handleDelete = (e: any) => {
    try {
      console.log(e);
      dispatch(deleteCustomer(navigate, deleteId));
      setModalOpen(false);
      showSnackbar("Operation Successful", "success");
    } catch (error) {
      showSnackbar("Unable to Connect Server", "error");
      console.log(error);
    }
  };
  // =========== MUI init ===========
  const theme = createTheme({
    typography: {
      fontSize: 13
    }
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const filterOrders = (e: any) => {
    setRows(
      props.rows.filter(
        (row: any) =>
          row.product.toLowerCase().indexOf(e.target.value.toLowerCase()) != -1
      )
    );
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //-- MUI Modal
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper} className="w-full">
        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
        >
          <Box sx={style}>
            <Typography variant="h6" component="h2">
              Confirm
            </Typography>
            <Divider
              sx={{
                marginBottom: "20px",
                scrollSnapMarginTop: "20px"
              }}
            />
            <Typography
              sx={{
                marginBottom: "20px",
                scrollSnapMarginTop: "20px"
              }}
              component="h2"
            >
              Are you sure deleting this item?
            </Typography>
            <div className="flex flex-row justify-end gap-x-2">
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={handleDelete}
              >
                Yes
              </Button>
              <Button
                variant="contained"
                color="inherit"
                onClick={() => {
                  setModalOpen(false);
                }}
                size="small"
              >
                No
              </Button>
            </div>
          </Box>
        </Modal>
        <Box
          sx={{ padding: "20px", font: "bold black" }}
          className="flex md:flex-row flex-col justify-between border-b-[1px] border-gray"
        >
          <div className="flex flex-col justify-center">
            <p className="text-lg font-semibold">Products</p>
          </div>
          <div className="flex md:flex-row flex-col">
            <div className="flex flex-row">
              <div className="flex flex-col justify-end">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="mr-2 mb-1 text-xl"
                />
              </div>
              <TextField
                variant="standard"
                label="Search Product Here"
                onChange={filterOrders}
              />
            </div>
            <div className="flex flex-col justify-en md:mt-0 mt-4">
              {/* Dialog Start */}
              <Dialog
                open={open}
                onClose={handleClose}
                maxWidth={"sm"}
                fullWidth={true}
                PaperProps={{
                  component: "form",
                  onSubmit: handleSubmit
                }}
              >
                <input name="password" value={password} hidden />
                <DialogTitle>Change Account State</DialogTitle>
                <DialogContent>
                  <Grid container spacing={0} className="gap-x-10">
                    <Grid sm={12}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 220 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Account State *
                        </InputLabel>
                        <Select
                          required
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          label="Customer State"
                          name="state"
                          key="state"
                          defaultValue={"None"}
                          value={state}
                          onChange={(e) => setState(e.target.value as string)}
                        >
                          {customerState.map((item, index) => (
                            <MenuItem value={index}>{item}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={customers.loading}
                  >
                    {customers.loading ? "Submitting..." : "Submit"}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleClose}
                    color="secondary"
                  >
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
              {/* Dialog End */}
            </div>
          </div>
        </Box>
        <Table sx={{ minWidth: 770 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    paddingLeft: "20px",
                    paddingTop: "16px",
                    paddingBottom: "16px"
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: any) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      if (column.id == "action")
                        return (
                          <TableCell key={"Action"} align="left">
                            <IconButton
                              aria-label="delete"
                              size="small"
                              color="success"
                              onClick={handleEdit}
                              data-id={row.id}
                            >
                              <EditIcon fontSize="inherit" />
                            </IconButton>

                            <IconButton
                              aria-label="delete"
                              size="small"
                              color="error"
                              onClick={(e: any) => {
                                setModalOpen(true);
                                setDeleteId(
                                  e.currentTarget.getAttribute("data-id")
                                );
                              }}
                              data-id={row.id}
                            >
                              <DeleteIcon fontSize="inherit" />
                            </IconButton>
                          </TableCell>
                        );
                      else if (column.id == "state")
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            sx={{ paddingLeft: "20px" }}
                          >
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : customerState[value]}
                          </TableCell>
                        );
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          sx={{ paddingLeft: "20px" }}
                        >
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={7}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "rows per page"
                    },
                    native: true
                  }
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
}
