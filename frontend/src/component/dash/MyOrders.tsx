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
import { TableHead, TextField } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "../../redux/store";
import { RootState } from "../../redux/store";
import { FEE, TITLES } from "../../constant";
import { clearNewOrder } from "../../redux/reducer/orderSlice";
import { getCustomers } from "../../redux/reducer/customerSlice";

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

interface MyData {
  id: string;
  product: string;
  customer: string;
  phone: string;
  date: string;
  mode: string;
  cost: number | string;
  status: string;
}

function createData(
  id: string,
  product: string,
  customer: string,
  phone: string,
  date: string,
  mode: string,
  cost: number | string,
  status: string
): MyData {
  return { id, product, customer, phone, date, mode, cost, status };
}

interface Column {
  id:
    | "id"
    | "product"
    | "date"
    | "mode"
    | "cost"
    | "status"
    | "action"
    | "customer"
    | "phone";
  label: string;
  minWidth?: number;
  align?: "left";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  {
    id: "product",
    label: "Product",
    minWidth: 90,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US")
  },
  {
    id: "customer",
    label: "Customer",
    minWidth: 110,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US")
  },
  {
    id: "phone",
    label: "Phone Number",
    minWidth: 110,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US")
  },
  {
    id: "mode",
    label: "Payment Mode",
    minWidth: 130,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US")
  },
  {
    id: "cost",
    label: "Total Cost",
    minWidth: 80,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US")
  },
  {
    id: "status",
    label: "Status",
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

export default function MyOrders() {
  const theme = createTheme({
    typography: {
      fontSize: 13
    }
  });
  const [rows, setRows] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(0);
  const [searchStr, setSearchStr] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const products = useSelector((state: RootState) => state.product);
  const user = useSelector((state: RootState) => state.auth);
  const orders = useSelector((state: RootState) => state.order);
  const customer = useSelector((state: RootState) => state.customer);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const getProduct = (id: string) => {
    const filteredProduct = products.products.filter((item) => item._id == id);
    return filteredProduct[0];
  };

  const getCustomerFromId = (id: number) => {
    if (user.user?.state == 1) {
      const filteredCustomer = customer.customers.filter(
        (item) => item._id?.toString() == id.toString()
      );
      return filteredCustomer[0];
    } else {
      return user.user;
    }
  };

  useEffect(() => {
    if (user.user?.state == 1) {
      dispatch(getCustomers(navigate));
    }
  }, [dispatch]);

  useEffect(() => {
    const rows: React.SetStateAction<any[] | undefined> = [];
    if (orders.orders.length)
      orders.orders.map((item) => {
        const product = getProduct(item.items[0].product!);
        let totalPrice = 0;
        item.items.map((pitem) => (totalPrice += pitem.amount! * pitem.price!));
        console.log(typeof item.date_added);
        const currCustomer = getCustomerFromId(item.user!);
        if (product)
          rows.push(
            createData(
              `${item._id!}`,
              product.title +
                (product.caliber ? " " + product.caliber + "mm" : "") +
                (item.items.length > 1 ? ` and ${item.items.length} more` : ""),
              currCustomer!.name,
              currCustomer!.phone,
              new Date(item.date_added!).toLocaleDateString("en-US"),
              item.payment!,
              "$ " + totalPrice * (1 + FEE),
              TITLES[item.stepNo!]
            )
          );
      });

    setRows(rows);
  }, [orders.orders, customer]);
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

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper} className="w-full">
        <Box
          sx={{ padding: "20px", font: "bold black" }}
          className="flex sm:flex-row flex-col justify-between border-b-[1px] border-gray"
        >
          <div className="flex flex-col justify-center">
            <p className="text-lg font-semibold">My Orders</p>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col justify-end text-[#818181]">
              <FontAwesomeIcon icon={faSearch} className="mr-2 my-1 text-xl" />
            </div>
            <TextField
              variant="standard"
              label="Search Product & User"
              onChange={(e) => {
                setSearchStr(e.target.value);
              }}
            />
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
            {rows!
              .filter(
                (row: any) =>
                  row.product.toLowerCase().indexOf(searchStr.toLowerCase()) !=
                    -1 ||
                  row.customer.toLowerCase().indexOf(searchStr.toLowerCase()) !=
                    -1
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: any) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];

                      if (column.id == "action") {
                        return (
                          <TableCell key={"Action"} align="left">
                            <IconButton
                              aria-label="delete"
                              size="small"
                              color="success"
                              onClick={() => {
                                dispatch(clearNewOrder());
                                navigate(
                                  `/${
                                    user.user!.state == 1
                                      ? "manage"
                                      : "dashboard"
                                  }/track/${row.id}`
                                );
                              }}
                              data-id={row.id}
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </IconButton>
                          </TableCell>
                        );
                      } else
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
