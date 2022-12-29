import { useEffect } from 'react';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import PropTypes from 'prop-types';
import useAxios from '../../utils/useAxios';
import './retailerDashboard.css';
import { useParams } from 'react-router-dom';
import './retailerProductPage.css';
import Card from '@mui/joy/Card';
import AspectRatio from '@mui/joy/AspectRatio';
import '../customer/customerItemDescription.css';
import { Button } from 'react-bootstrap';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const StyledDiv = styled('div')(() => ({
  marginTop: 40,
  marginLeft: 50,
  color: '#fff',
}));

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    color: 'white',
  },
  '& label.Mui-focused': {
    color: '#00AB55',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'green',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#B0B9C2',
    },
    '&:hover fieldset': {
      borderColor: '#000',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00AB55',
    },
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function RetailerProduct() {
  const [value, setValue] = React.useState(0);
  const [product, setProduct] = React.useState({});
  const [issuedItems, setIssuedItems] = React.useState([]);
  const [UnissuedItems, setUnissuedItems] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [owner_phone, setOwnerPhone] = React.useState('');
  const [owner_name, setOwnerName] = React.useState('');
  const [item, setItem] = React.useState('');
  const [openCreateItem, setOpenCreateItem] = React.useState(false);
  const [serial_no, setSerialNo] = React.useState('');
  const params = useParams();
  const api = useAxios();
  let query = useQuery();

  const searchInputHandler = async (e) => {
    const value = e.target.value;

    const items = product.items;
    const issued_items = items.filter((item) => item.is_issued === true);
    const unissued_items = items.filter((item) => item.is_issued === false);
    const search_issued_items = issued_items.filter((item) =>
      item.serial_no.toLowerCase().includes(value.toLowerCase())
    );
    const search_unissued_items = unissued_items.filter((item) =>
      item.serial_no.toLowerCase().includes(value.toLowerCase())
    );
    setIssuedItems(search_issued_items);
    setUnissuedItems(search_unissued_items);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchData = async () => {
    const { data } = await api.get(`/products/${params.id}`);
    setProduct(data);
    // filter for issued items
    const issuedItems = data.items.filter((item) => item.is_issued === true);
    setIssuedItems(issuedItems);
    // filter for unissued items
    const unissuedItems = data.items.filter((item) => item.is_issued === false);
    setUnissuedItems(unissuedItems);
  };

  function UnIssuedItemRows(props) {
    const { items } = props;
    if (items.length === 0) {
      return (
        <React.Fragment>
          <React.Fragment>
            <Grid item xs={10}>
              <Box sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  className="issued-products-body"
                  align="center"
                >
                  NO ITEMS
                </Typography>
              </Box>
            </Grid>
          </React.Fragment>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {UnissuedItems.map((item, index) => {
          return (
            <Grid item xs={10} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  className: 'table_row',
                  color: 'white',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                }}
              >
                <Box sx={{ width: '40%' }}>
                  <Typography>{item.serial_no}</Typography>
                </Box>
                <Box sx={{ width: '20%' }}>
                  <Typography>{product.warranty_period}</Typography>
                </Box>
                <Box
                  sx={{ width: '40%', alignItems: 'center', display: 'flex' }}
                >
                  <Box>
                    <Button
                      className="nav-button"
                      variant="outlined"
                      color="success"
                      onClick={() => {
                        setItem(item.id);
                        setOpen(true);
                      }}
                    >
                      <Typography
                        component="span"
                        level="body1"
                        className="nav-button-text"
                      >
                        Issue to Customer
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </React.Fragment>
    );
  }

  function IssuedItemRows(props) {
    const { items } = props;
    if (items.length === 0) {
      return (
        <React.Fragment>
          <Grid item xs={10}>
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                className="issued-products-body"
                align="center"
              >
                NO ITEMS
              </Typography>
            </Box>
          </Grid>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {items.map((item, index) => {
          return (
            <Grid item xs={10} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  className: 'table_row',
                }}
              >
                <Box sx={{ width: '40%' }}>
                  <Typography>{item.serial_no}</Typography>
                </Box>
                <Box sx={{ width: '20%' }}>
                  <Typography>{product.warranty_period}</Typography>
                </Box>
                <Box sx={{ width: '20%' }}>
                  <Typography>{item.owner}</Typography>
                </Box>
                <Box sx={{ width: '20%' }}>
                  <Box>
                    <Button
                      className="nav-button"
                      variant="outlined"
                      color="success"
                    >
                      <Typography
                        component="span"
                        level="body1"
                        className="nav-button-text"
                      >
                        {item.is_issued ? 'Issued' : 'Unissued'}
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </React.Fragment>
    );
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateItemClose = () => {
    setOpenCreateItem(false);
  };

  const handleIssueUser = async () => {
    console.log('ITEM', item);
    const payload = {
      phno: owner_phone,
      name: owner_name,
      item: item,
    };
    toast.promise(api.post('/orders/', payload), {
      loading: 'Issuing...',
      success: (data) => {
        setOpen(false);
        fetchData();
        return 'Issued Successfully!';
      },
      error: (err) => <b>Failed to issue to a customer</b>,
    });
  };

  const handleCreateItem = async () => {
    const payload = {
      serial_no: serial_no,
      product: product.id,
    };
    toast.promise(api.post('/items/', payload), {
      loading: 'Creating...',
      success: (data) => {
        setOpenCreateItem(false);
        fetchData();
        return 'Item Created Successfully!';
      },
      error: (err) => <b>{err}</b>,
    });
  };

  useEffect(() => {
    fetchData();

    if (query.get('setOpenCreateItem') === 'true') {
      setOpenCreateItem(true);
    }
  }, []); // eslint-disable-line

  return (
    <StyledDiv>
      <Dialog
        open={open}
        className="dialog"
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: '#0a1929',
            color: '#fff',
            border: 0.1,
            borderColor: '#A4A9AF',
            borderStyle: 'solid',
          },
        }}
      >
        <DialogTitle className="dialog-input">Issue to Customer</DialogTitle>
        <DialogContent>
          <DialogContentText className="dialog-input">
            To Issue to User please Enter the customer name and phone number
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="phone"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="standard"
            value={owner_phone}
            className="dialog-input"
            onChange={(e) => setOwnerPhone(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                color: 'white',
              },
              '& label.Mui-focused': {
                color: '#BBDEFB',
              },
              '& label': {
                color: '#B3B3B3',
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: 'white',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#fff',
                },
                '&:hover fieldset': {
                  borderColor: '#000',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fff',
                },
              },
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="Name"
            label="Customer Name"
            type="text"
            fullWidth
            variant="standard"
            className="dialog-input"
            value={owner_name}
            onChange={(e) => setOwnerName(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                color: 'white',
              },
              '& label.Mui-focused': {
                color: '#BBDEFB',
              },
              '& label': {
                color: '#B3B3B3',
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: 'white',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#fff',
                },
                '&:hover fieldset': {
                  borderColor: '#000',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fff',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleIssueUser}>Issue</Button>
        </DialogActions>
      </Dialog>
      {/* Create Item Dialog */}
      <Dialog
        open={openCreateItem}
        className="dialog"
        onClose={handleCreateItemClose}
        PaperProps={{
          style: {
            backgroundColor: '#0a1929',
            color: '#fff',
            border: 0.1,
            borderColor: '#A4A9AF',
            borderStyle: 'solid',
          },
        }}
      >
        <DialogTitle className="dialog-input">Create Item</DialogTitle>
        <DialogContent>
          <DialogContentText className="dialog-input">
            To create Item please Enter the serial number
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="serial_no"
            label="Serial No"
            type="text"
            fullWidth
            variant="standard"
            value={serial_no}
            className="dialog-input"
            onChange={(e) => setSerialNo(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                color: 'white',
              },
              '& label.Mui-focused': {
                color: '#BBDEFB',
              },
              '& label': {
                color: '#B3B3B3',
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: 'white',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#fff',
                },
                '&:hover fieldset': {
                  borderColor: '#000',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fff',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateItemClose}>Cancel</Button>
          <Button onClick={handleCreateItem}>Create</Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Typography className="product_name">{product.name}</Typography>
      </Box>
      <Box
        sx={{
          p: 2,
          margin: 'auto',
          height: '100%',
          width: '90vw',
          flexGrow: 1,
          backgroundColor: 'transparent',
          color: 'white',
        }}
      >
        <Grid container spacing={2}>
          <Card
            variant="outlined"
            sx={{ minWidth: '10%', width: 300, height: 190, mt: 3 }}
          >
            <AspectRatio minHeight="120px" maxHeight="200px">
              <Img src={product.image} alt="product_img" />
            </AspectRatio>
          </Card>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                  component="div"
                  sx={{ fontSize: '1.3rem', color: 'rgb(200, 200, 200)' }}
                >
                  <span className="fields">Category - </span> {product.category}
                </Typography>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                  component="div"
                  sx={{ fontSize: '1.3rem', color: 'rgb(200, 200, 200)' }}
                >
                  <span className="fields">Description - </span>{' '}
                  {product.product_data}
                </Typography>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                  component="div"
                  sx={{ fontSize: '1.3rem', color: 'rgb(200, 200, 200)' }}
                >
                  <span className="fields">Warranty Period - </span>{' '}
                  {product.warranty_period} months
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <div className="mt-3"></div>
      <Box sx={{ width: '100%' }}>
        <Grid
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Grid>
            <Tabs
              textColor="#A4A9AF"
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                label={<span style={{ color: '#A4A9AF' }}>Unissued Items</span>}
                {...a11yProps(0)}
              />
              <Tab
                label={<span style={{ color: '#A4A9AF' }}>Issued Items</span>}
                {...a11yProps(1)}
              />
            </Tabs>
          </Grid>
          <Grid
            columns={{ xs: 12 }}
            sx={{
              marginLeft: { xs: 1, md: 10 },
              width: { xs: '80%', md: '50%' },
            }}
          >
            <StyledTextField
              sx={{ marginTop: { xs: 5, md: 0 } }}
              fullWidth
              textColor="#A4A9AF"
              variant="outlined"
              label="Search"
              onChange={searchInputHandler}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchOutlined sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid columns={2}>
            <Box>
              <Button
                className="nav-button"
                variant="outlined"
                color="success"
                onClick={() => {
                  setOpenCreateItem(true);
                }}
              >
                <Typography
                  component="span"
                  level="body1"
                  className="nav-button-text"
                >
                  Create Item
                </Typography>
              </Button>
            </Box>
          </Grid>
        </Grid>
        <TabPanel value={value} index={0}>
          <Box sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              {/* table headings as box headings */}
              <Grid item xs={10}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 1,
                    color: 'white',
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                  }}
                >
                  <Box sx={{ width: '40%' }}>
                    <Typography>Serial No</Typography>
                  </Box>
                  <Box sx={{ width: '20%' }}>
                    <Typography>Warranty Period</Typography>
                  </Box>
                  <Box sx={{ width: '40%' }}>
                    <Typography>Action</Typography>
                  </Box>
                </Box>
              </Grid>
              {/* table body */}
              <UnIssuedItemRows items={UnissuedItems} />
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              {/* table headings as box headings */}
              <Grid item xs={10}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 1,
                    color: 'white',
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                  }}
                >
                  <Box sx={{ width: '20%' }}>
                    <Typography>Serial No</Typography>
                  </Box>
                  <Box sx={{ width: '30%' }}>
                    <Typography>Warranty Period</Typography>
                  </Box>
                  <Box sx={{ width: '20%' }}>
                    <Typography>Owner</Typography>
                  </Box>
                  <Box sx={{ width: '20%' }}>
                    <Typography>Status</Typography>
                  </Box>
                </Box>
              </Grid>
              {/* table body */}
              <IssuedItemRows items={issuedItems} />
            </Grid>
          </Box>
        </TabPanel>
      </Box>
    </StyledDiv>
  );
}
