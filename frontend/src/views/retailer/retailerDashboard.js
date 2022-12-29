import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Collapse,
  InputAdornment,
  Grid,
  TextField,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Typography,
  Paper,
} from '@mui/material';
import useAxios from '../../utils/useAxios';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import AspectRatio from '@mui/joy/AspectRatio';
import IconButton from '@mui/joy/IconButton';
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  SearchOutlined,
} from '@mui/icons-material';
import { createData } from './utils';
import './retailerDashboard.css';
import CardOverflow from '@mui/joy/CardOverflow';
import { useNavigate } from 'react-router-dom';

const StyledDiv = styled('div')(() => ({
  marginTop: 40,
  marginLeft: 50,
  color: '#fff',
}));

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    color: '#fff',
  },
  '& .MuiInputBase-root': {
    color: '#A4A9AF',
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
      borderColor: '#fff',
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

// Table
function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell className="issued-products-body">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell className="issued-products-body" component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell className="issued-products-body" align="center">
          {row.category}
        </TableCell>
        <TableCell className="issued-products-body" align="center">
          {row.created_at}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                className="issued-products-body"
                align="center"
              >
                ITEMS
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell className="issued-products-body" align="center">
                      Date
                    </TableCell>
                    <TableCell className="issued-products-body" align="center">
                      Serial No
                    </TableCell>
                    <TableCell className="issued-products-body" align="center">
                      Customer
                    </TableCell>
                    <TableCell className="issued-products-body" align="center">
                      NFT Address
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell
                        className="issued-products-body"
                        align="center"
                        component="th"
                        scope="row"
                      >
                        {historyRow.date}
                      </TableCell>
                      <TableCell
                        className="issued-products-body"
                        align="center"
                      >
                        {historyRow.serial_no}
                      </TableCell>
                      <TableCell
                        className="issued-products-body"
                        align="center"
                      >
                        {historyRow.customer}
                      </TableCell>
                      <TableCell
                        className="issued-products-body"
                        align="center"
                      >
                        {historyRow.nft_id}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function RetailerDashboard() {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [rows, setRows] = useState([]);
  const [categoryValue, setCategoryValue] = useState(0);
  const [products, setProducts] = useState([]);
  const [productsStatus, setProductsStatus] = useState('No Products');
  // eslint-disable-next-line
  const [searchText, setSearchText] = useState('');
  const api = useAxios();

  const redirectItem = (id) => {
    navigate('/retailer/products/' + id);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const calculateDateDifference = (date) => {
    const now = new Date().getDate();
    const then = new Date(date).getDate();
    const diff = now - then;
    const diffDays = Math.floor(diff);
    return diffDays;
  };

  useEffect(() => {
    fetchProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      console.log(response);
      if (response.status === 200) {
        setProducts(response.data);
        const data = response.data;
        let row_data = [];
        data.map((e) => {
          const product = createData(e);
          row_data.push(product);
          return 0;
        });
        setRows(row_data);
      }
    } catch (e) {
      setProductsStatus('An Error Occurred! please try again later.');
    }
  };

  const fetchProductsByCategory = async (category, categoryIndex) => {
    try {
      const response = await api.get(`/products?category=${category}`);
      if (response.status === 200) {
        setProducts(response.data);
        setCategoryValue(categoryIndex);
      }
    } catch (e) {
      setProductsStatus('An Error Occurred! please try again later.');
    }
  };

  const searchInputHandler = async (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
    try {
      const response = await api.get(`/products?search=${lowerCase}`);
      if (response.status === 200) {
        setProducts(response.data);
        const data = response.data;
        let row_data = [];
        data.map((e) => {
          const product = createData(e);
          row_data.push(product);
          return 0;
        });
        setRows(row_data);
      }
    } catch (e) {
      setProductsStatus('An Error Occurred! please try again later.');
    }
  };

  return (
    <StyledDiv>
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
                label={<span style={{ color: '#A4A9AF' }}>My Products</span>}
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
              marginBottom: 1,
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
        </Grid>
        <TabPanel value={value} index={0}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Tabs
              scrollButtons
              variant="scrollable"
              value={categoryValue}
              onChange={handleChange}
            >
              <Tab
                label="All"
                component={() => (
                  <Button
                    onClick={() => {
                      fetchProducts();
                      setCategoryValue(0);
                    }}
                  >
                    <Avatar
                      sx={{
                        height: 32,
                        width: 32,
                        marginRight: 1,
                      }}
                      variant="square"
                      src="https://static-assets-web.flixcart.com/www/promos/new/20150528-140547-favicon-retina.ico"
                    />
                    <Typography>All</Typography>
                  </Button>
                )}
              />
              <Tab
                label="Mobiles"
                component={() => (
                  <Button onClick={() => fetchProductsByCategory('mobile', 1)}>
                    <Avatar
                      sx={{
                        height: 64,
                        width: 64,
                      }}
                      variant="square"
                      src="https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png"
                    />
                    <Typography>Mobiles</Typography>
                  </Button>
                )}
              />
              <Tab
                label="Laptops"
                component={() => (
                  <Button onClick={() => fetchProductsByCategory('laptop', 2)}>
                    <Avatar
                      sx={{
                        height: 64,
                        width: 64,
                      }}
                      variant="square"
                      src="https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png"
                    />
                    <Typography sx={{ mx: 1 }}>Laptops</Typography>
                  </Button>
                )}
              />
              <Tab
                label="Home"
                component={() => (
                  <Button onClick={() => fetchProductsByCategory('home', 3)}>
                    <Avatar
                      sx={{
                        height: 64,
                        width: 64,
                      }}
                      variant="square"
                      src="https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg"
                    />
                    <Typography sx={{ mx: 1 }}>Home</Typography>
                  </Button>
                )}
              />
              <Tab
                label="Appliances"
                component={() => (
                  <Button
                    onClick={() => fetchProductsByCategory('appliances', 4)}
                  >
                    <Avatar
                      sx={{
                        height: 64,
                        width: 64,
                      }}
                      variant="square"
                      src="https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png"
                    />
                    <Typography sx={{ mx: 1 }}>Appliances</Typography>
                  </Button>
                )}
              />
              <Tab
                label="Gadgets"
                component={() => (
                  <Button onClick={() => fetchProductsByCategory('gadget', 5)}>
                    <Avatar
                      sx={{
                        height: 64,
                        width: 64,
                      }}
                      variant="square"
                      src="https://rukminim1.flixcart.com/image/416/416/ktketu80/motion-controller/s/e/p/quest-2-advanced-all-in-one-vr-headset-128-gb-oculus-original-imag6wfp5kfjfgvf.jpeg?q=70"
                    />
                    <Typography sx={{ mx: 1 }}>Gadgets</Typography>
                  </Button>
                )}
              />
            </Tabs>
          </Box>
          {products.length === 0 ? (
            <Box
              sx={{ display: 'flex', justifyContent: 'center', height: '30vh' }}
            >
              <Typography
                variant="h5"
                sx={{ position: 'relative', top: '50%', color: '#A4A9AF' }}
              >
                {productsStatus}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ width: '100%' }}>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                {Array.from(products).map((product, index) => (
                  <Grid item xs={4} sm={4} md={3} key={index}>
                    <Card
                      variant="outlined"
                      sx={{ minWidth: '10%', width: '100%', mt: 3 }}
                    >
                      <Box
                        onClick={() => {
                          redirectItem(product.id);
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontSize="md"
                            sx={{ alignSelf: 'flex-start' }}
                          >
                            {product.name}
                          </Typography>
                          <Typography variant="caption">
                            Updated{' '}
                            {calculateDateDifference(product.updated_at)}d ago
                          </Typography>
                        </Box>
                        <AspectRatio
                          minHeight="120px"
                          maxHeight="200px"
                          sx={{ my: 2 }}
                        >
                          <img src={product.image} alt="" />
                        </AspectRatio>
                      </Box>
                      <CardOverflow
                        variant="soft"
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 1.5,
                          py: 1.5,
                          px: 'var(--Card-padding)',
                          borderTop: '1px solid',
                          borderColor: 'neutral.outlinedBorder',
                          bgcolor: 'background.level1',
                        }}
                      >
                        <Link
                          to={
                            '/retailer/products/' +
                            product.id +
                            '?setOpenCreateItem=true'
                          }
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            textDecoration: 'none',
                            color: 'white',
                            width: '100%',
                          }}
                        >
                          <Box>
                            <Button
                              variant="solid"
                              size="sm"
                              color="primary"
                              sx={{ ml: 'auto', fontWeight: 600 }}
                            >
                              Add Item
                            </Button>
                          </Box>
                        </Link>
                      </CardOverflow>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TableContainer component={Paper}>
            <Table
              aria-label="collapsible table"
              className="issued-products-table"
            >
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell className="issued-products-head">
                    Product Name
                  </TableCell>
                  <TableCell className="issued-products-head" align="center">
                    Category
                  </TableCell>
                  <TableCell className="issued-products-head" align="center">
                    Created At&nbsp;(g)
                  </TableCell>
                  {/* <TableCell align="center">Carbs&nbsp;(g)</TableCell>
            <TableCell align="center">Protein&nbsp;(g)</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <Row key={row.name} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Box>
    </StyledDiv>
  );
}
