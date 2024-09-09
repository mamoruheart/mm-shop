/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import {  Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, InputLabel, MenuItem, Modal, Select, TableHead, TextField, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCloudUpload, faSearch } from '@fortawesome/free-solid-svg-icons';
import { deleteProduct, postProduct, putProduct } from '../../redux/reducer/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useEffect, useState } from 'react';
import { getCategorys } from '../../redux/reducer/categorySlice';
import { actionType } from '../../constant';
import { useSnackbar } from '../utils/SnackbarProvider';
import { Data } from '../types';
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate } from 'react-router-dom';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}


function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

interface Column {
    id: 'id' | 'product' | 'date' | 'price' | 'category' | 'detail' | 'action';
    label: string;
    minWidth?: number;
    align?: 'left';
    format?: (value: number) => string;
  }

const columns: readonly Column[] = [
    {
        id: 'product',
        label: 'Product',
        minWidth: 170,
        align: 'left',
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'date',
        label: 'Added Date',
        minWidth: 110,
        align: 'left',
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'price',
        label: 'Price',
        minWidth: 130,
        align: 'left',
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'detail',
        label: 'Detail',
        minWidth: 100,
        align: 'left',
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'action',
        label: 'Action',
        minWidth: 90,
        align: 'left',
        format: (value: number) => value.toLocaleString('en-US'),
    },
  ];

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

export default function Products( props: any ) {

  const {showSnackbar} = useSnackbar();
  
  const [files, setFiles] = useState<File[]>(props.rows);

  const [rows, setRows] = React.useState<Data[]>(props.rows);

  const products = useSelector((state:RootState) => state.product)

  const navigate = useNavigate();

  const category = useSelector((state: RootState) => state.category)

  const dispatch = useDispatch();
  //modal 
  const [open, setOpen] = React.useState(false);

  const [modalOpen, setModalOpen] = React.useState(false);

  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState<string>('');
  const [caliber, setCaliber] = useState<number | ''>('');
  const [barrelLength, setBarrelLength] = useState<number | ''>('');
  const [overAllLength, setOverAllLength] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [magazineCapacity, setMagazineCapacity] = useState<number | ''>('');
  const [stockType, setStockType] = useState<string>('');
  const [categoryValue, setCategoryValue] = useState<string>('');
  const [actionTypeValue, setActionTypeValue] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string>('');

  useEffect(() => {
    dispatch(getCategorys(navigate));
    //parse product data once.    
  },[dispatch]) 

  useEffect(() => {
    setRows(props.rows)
    //parse product data once.

  }, [props.rows]) 

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault(); 
      const formData = new FormData(e.target);
      formData.append('images',  images.length !== 0 ? images.join('|') : '');
      console.log(images)
      if (files.length === 0 && images.length === 0) {
        showSnackbar('Please select at least one image.', 'warning');
        return;
      }
      console.log('isedit', '"' + isEdit.toString() + '"', !isEdit);
      if(!isEdit)
        dispatch(postProduct(navigate,formData));
      dispatch(putProduct(navigate, formData, isEdit));
      handleClose();
    } catch (error) {
      showSnackbar('Unable to Connect Server', 'error');
      console.log(error)
    }
  }  

  const handleFileChange = (e  : React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    }
  };

  const handleEdit = (e) => {
    
    try {
      const id = e.currentTarget.getAttribute('data-id');
      setIsEdit(id);
      let data;
      for(const proItem of products.products){
        if( proItem._id == id ){
          data = proItem;
          break;
        }
      }
      setOpen(true);

      console.log(id)
      setName(data!.title);
      setPrice(data!.price);
      setDescription(data!.description);
      setCaliber(data!.caliber);
      setBarrelLength(data!.barrelLength);
      setOverAllLength(data!.overAllLength);
      setWeight(data!.weight);
      setMagazineCapacity(data!.magazineCapacity);
      setStockType(data!.stockType);
      setCategoryValue(data!.category._id!);
      setActionTypeValue(data!.actionType);
      setImages(data!.images)
      setFiles([]);
      e.preventDefault(); 
    } catch (error) {
      showSnackbar('Unable to Connect Server', 'error');
      console.log(error)
    }
  }
  const handleDelete = (e) => {
    try {
      dispatch(deleteProduct(navigate, deleteId));
      setModalOpen(false);
    } catch (error) {
      showSnackbar('Unable to Connect Server', 'error');
      console.log(error)
    }
  }
  // =========== MUI init ===========
  const theme = createTheme({
      typography:{
          fontSize:13
      }
      
    })
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const filterOrders = (e: any) => {
    setRows(props.rows.filter((row:any) => 
                    row.product.toLowerCase().indexOf(e.target.value.toLowerCase()) != -1
                    || row.detail.toLowerCase().indexOf(e.target.value.toLowerCase()) != -1)
            )
  }

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // MUI Modal

  const handleClickOpen = () => {
    setIsEdit('');
    setOpen(true);
  };

  const handleClose = () => {
    setIsEdit('');
    setOpen(false);
    setName('');
    setPrice('');
    setDescription('');
    setCaliber('');
    setBarrelLength('');
    setOverAllLength('');
    setWeight('');
    setMagazineCapacity('');
    setStockType('');
    setCategoryValue('');
    setActionTypeValue('');
    setImages([]);
    setFiles([]);
  };

  // MUI Modal end

  return (
    <ThemeProvider theme={theme}>
      
        <TableContainer component={Paper} className='w-full'>
          <Modal
            open={modalOpen}
            onClose={() => {setModalOpen(false)}}
          >
            <Box sx={style}>
              <Typography variant="h6" component="h2">
                Confirm
              </Typography>
              <Divider sx={{
                marginBottom:'20px',
                scrollSnapMarginTop:'20px'
              }}/>
              <Typography sx={{
                marginBottom:'20px',
                scrollSnapMarginTop:'20px'
              }} component="h2">
                Are you sure deleting this item?
              </Typography>
              <div className='flex flex-row justify-end gap-x-2'>
                <Button 
                  variant='contained'
                  color='success'
                  size='small'
                  onClick={handleDelete}
                >
                  Yes
                </Button>
                <Button
                  variant='contained'
                  color='inherit'
                  onClick={() => {setModalOpen(false)}}
                  size='small'
                  >
                  No
                </Button>
              </div>
              
            </Box>
          </Modal>
        <Box sx={{padding:'20px', font:'bold black'}} className='flex md:flex-row flex-col justify-between border-b-[1px] border-gray'>
            <div className='flex flex-col justify-center'>
                <p className='text-lg font-semibold'>Products</p>
            </div>
            <div className='flex md:flex-row flex-col'>
                <div className='flex flex-row'>
                  <div className='flex flex-col justify-end'>
                      <FontAwesomeIcon icon={faSearch} className="mr-2 mb-1 text-xl"/>
                  </div>
                  <TextField 
                      variant='standard'
                      label='Search Product Here'
                      onChange={filterOrders}
                  />
                </div>
                <div className='flex flex-col justify-end w-36 md:ml-7 md:mt-0 mt-4'>
                  <Button 
                    variant='contained'
                    color='success'
                    onClick={handleClickOpen}
                  >
                    <FontAwesomeIcon icon={faCirclePlus} className='mr-2'/> Add new
                  </Button>
                  {/* Dialog Start */}
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    maxWidth={'sm'}
                    fullWidth={true}
                    PaperProps={{
                      component: 'form',
                      onSubmit: handleSubmit
                    }}
                  >
                      <DialogTitle>New Product</DialogTitle>
                      <DialogContent>

                        <Grid container spacing={0} className='gap-x-10'>
                          <Grid sm={5}>
                            <TextField
                              autoFocus
                              required
                              margin="dense"
                              id="name"
                              name="name"
                              label="Name"
                              variant='standard'
                              size='small'
                              value={name}
                              fullWidth
                              onChange={(e) => setName(e.target.value)}
                            />
                          </Grid>
                          
                          <Grid sm={2}>
                            <TextField
                              required
                              margin="dense"
                              id="price"
                              name="price"
                              label="Price"
                              type='number'
                              inputProps={{step: 'any'}}
                              value={price}
                              fullWidth
                              variant="standard"
                              onChange={(e) => setPrice(+e.target.value)}
                            />
                          </Grid>
                          <Grid sm={3} className='flex flex-col justify-end'>
                            <Button
                              component="label"
                              role={undefined}
                              variant="outlined"
                              fullWidth
                              color='warning'
                              tabIndex={-1}
                              startIcon={<FontAwesomeIcon icon={faCloudUpload} />}
                            >
                              {files.length == 0 ? '' : files.length} images 
                              <input 
                                hidden 
                                type="file"
                                name="files"
                                multiple
                                onChange={handleFileChange}
                                />
                            </Button>
                          </Grid>
                        </Grid>
                        <Grid container spacing={0} className='gap-x-10'>
                          <Grid sm={12}>
                            <TextField
                              margin="dense"
                              id="description"
                              name="description"
                              label="Description"
                              fullWidth
                              value={description}
                              required
                              variant="standard"
                              onChange={(e) => setDescription(e.target.value)}
                            />
                          </Grid>
                          
                        </Grid>
                        <Grid container spacing={0} className='gap-x-10'>
                          <Grid sm={3}>
                            <TextField
                              
                              margin="dense"
                              id="caliber"
                              name="caliber"
                              label="Caliber (mm)"
                              fullWidth
                              type='number'
                              inputProps={{step: 'any'}}
                              variant="standard"
                              value={caliber}
                              onChange={(e) => setCaliber(+e.target.value)}
                            />
                          </Grid>
                          <Grid sm={3}>
                            <TextField
                              
                              margin="dense"
                              id="barrelLength"
                              name="barrelLength"
                              label="BarrelLength (mm)"
                              fullWidth
                              type='number'
                              inputProps={{step: 'any'}}
                              variant="standard"
                              value={barrelLength}
                              onChange={(e) => setBarrelLength(+e.target.value)}
                            />
                          </Grid>
                          <Grid sm={4}>
                            <TextField
                              
                              margin="dense"
                              id="overAllLength"
                              name="overAllLength"
                              label="OverAllLength (mm)"
                              type='number'
                              inputProps={{step: 'any'}}
                              fullWidth
                              variant="standard"
                              value={overAllLength}
                              onChange={(e) => setOverAllLength(+e.target.value)}
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={0} className='gap-x-10'>
                          <Grid sm={3}>
                            <TextField
                              
                              margin="dense"
                              id="weight"
                              name="weight"
                              label="Weight (Kg)"
                              fullWidth
                              type='number'
                              inputProps={{step: 'any'}}
                              variant="standard"
                              value={weight}
                              onChange={(e) => setWeight(+e.target.value)}
                            />
                          </Grid>
                          <Grid sm={3}>
                            <TextField
                              
                              margin="dense"
                              id="magazineCapacity"
                              name="magazineCapacity"
                              label="MagazineCapacity"
                              fullWidth
                              type='number'
                              inputProps={{step: 'any'}}
                              variant="standard"
                              value={magazineCapacity}
                              onChange={(e) => setMagazineCapacity(+e.target.value)}
                            />
                          </Grid>
                          <Grid sm={4}>
                            <TextField
                              margin="dense"
                              id="stockType"
                              name="stockType"
                              label="StockType"
                              fullWidth
                              variant="standard"
                              value={stockType}
                              onChange={(e) => setStockType(e.target.value)}
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={0} className='gap-x-10 mt-3'>
                          <Grid sm={3} >
                          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-standard-label">Category *</InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              label="Category"
                              name='category'
                              required
                              key='category'
                              value={categoryValue}
                              onChange={(e) => setCategoryValue(e.target.value as string)}

                            >
                              {category.categorys.map((item) => (
                                <MenuItem value={item._id}>{item.title}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          </Grid>
                          <Grid sm={3}>
                          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-standard-label">ActionType *</InputLabel>
                            <Select
                              required
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              label="ActionType"
                              name='actionType'
                              key='actiontype'
                              defaultValue={'None'}
                              value={actionTypeValue}
                              onChange={(e) => setActionTypeValue(e.target.value as string)}
                            >
                              {actionType.map((item) => (
                                <MenuItem value={item}>{item}</MenuItem>
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
                          disabled={products.loading}
                      >
                          {products.loading ? 'Submitting...' : 'Submit'}
                      </Button>
                        <Button variant='contained' onClick={handleClose} color='secondary'>Close</Button>
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
                    sx={{ paddingLeft: '20px', paddingTop:'16px', paddingBottom:'16px'}}
                    >
                    {column.label}
                    </TableCell>
                ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row:any) => {
                    return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                        {columns.map((column) => {
                        const value = row[column.id];
                        if(column.id == 'action')
                            return(
                                <TableCell key={'Action'} align='left'>
                                  <IconButton aria-label="delete" size="small" color='success' onClick={handleEdit} data-id={row.id}>
                                    <EditIcon fontSize="inherit"  />
                                  </IconButton>

                                  <IconButton 
                                    aria-label="delete" 
                                    size="small" color='error'  
                                    onClick={(e) => {
                                      setModalOpen(true);      
                                      setDeleteId( e.currentTarget.getAttribute('data-id') ); 
                                    }} 
                                    data-id={row.id}>
                                    <DeleteIcon fontSize="inherit" />
                                  </IconButton>
                                  
                                </TableCell>
                            );
                        return (
                            <TableCell key={column.id} align={column.align} sx={{ paddingLeft: '20px', }}>
                            {column.format && typeof value === 'number'
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
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={7}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                    select: {
                    inputProps: {
                        'aria-label': 'rows per page',
                    },
                    native: true,
                    },
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