import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Button from '@mui/joy/Button';
import { Button as CustomButton } from '../../components/Button';
import Card from '@mui/joy/Card';
import AspectRatio from '@mui/joy/AspectRatio';
import Grid from '@mui/material/Grid';
import CardOverflow from '@mui/joy/CardOverflow';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import useCustomerAxios from '../../utils/useCustomerAxios';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { WalletContext } from '../../contexts/WalletContext';
import { BASE_URL } from '../../config';

const StyledDiv = styled('div')(() => ({
  color: '#fff',
}));

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    color: '#fff',
  },
  '& .MuiInputBase-root': {
    color: '#A4A9AF',
  },
  '& label': {
    color: '#fff',
  },
  '& label.Mui-focused': {
    color: '#fff',
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
      borderColor: '#fff',
    },
  },
});

export default function CustomerClaim() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [itemsStatus, setItemsStatus] = useState(
    'Currently there are no transferrable items linked with your mobile number.'
  );
  const [orderStatus, setOrderStatus] = useState('Loading...');
  const api = useCustomerAxios();
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [label, setLabel] = useState('');
  const { customer } = useContext(WalletContext);
  const [inputSerialNumber, setInputSerialNumber] = useState('');

  const handleChange = (event) => {
    setInputSerialNumber(event.target.value);
  };

  const handleClickClaim = async (event) => {
    try {
      const order_response = await api.get(
        '/items/?serial_no=' + inputSerialNumber
      );
      console.log(order_response.data);
      if (order_response.status === 200) {
        if (order_response.data.order_id) {
          redirectItem(order_response.data.order_id);
        } else {
          handleClose();
          setOrderStatus('This item is not being transferred by the owner');
          setOpenError(true);
        }
      }
    } catch (e) {
      console.log('error');
      handleClose();
      setOrderStatus('The Serial number you entered is invalid');
      setOpenError(true);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseError = () => {
    setOpenError(false);
  };

  const redirectItem = (id) => {
    navigate('/customer/claim/order/' + id);
  };

  useEffect(() => {
    fetchItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchItems = async () => {
    try {
      const response = await api.get('/orders/?phno=' + customer.phno);
      console.log(response.data);
      console.log(customer.phno);
      if (response.status === 200) {
        setItems(response.data);
      }
    } catch (e) {
      setItemsStatus('An Error Occurred! please try again later.');
    }
  };

  return (
    <StyledDiv
      sx={{
        display: 'flex',
        justifyContent: 'center',
        paddingX: 5,
      }}
    >
      {items.length === 0 ? (
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontSize: '3rem' }}>
              Claim your Products
            </Typography>
          </Box>
          <Box sx={{ top: '50%', height: '25vh', position: 'relative' }}>
            <Typography
              variant="h5"
              sx={{
                color: '#A4A9AF',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {itemsStatus}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mt: 1,
                color: '#d9d9d9',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              You can claim any product by clicking{' '}
              <span
                onClick={handleClickOpen}
                style={{
                  marginLeft: '5px',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  color: '#61c97d',
                }}
              >
                {' '}
                here
              </span>
              .
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontSize: '3rem' }}>
              Claim your Products
            </Typography>
          </Box>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={4} sm={4} md={3}>
              <Card
                variant="outlined"
                sx={{ minWidth: '10%', width: '100%', mt: 3, pb: 7 }}
                onClick={handleClickOpen}
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
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    Claim Other Product?
                  </Typography>
                </Box>
                <AspectRatio
                  minHeight="120px"
                  maxHeight="200px"
                  sx={{ mt: 4, mb: 0 }}
                >
                  <AddCircleIcon fontSize="large"></AddCircleIcon>
                </AspectRatio>
              </Card>
            </Grid>
            {Array.from(items).map((item, index) => (
              <Grid item xs={4} sm={4} md={3} key={index}>
                <Card
                  variant="outlined"
                  sx={{ minWidth: '10%', width: '100%', mt: 3 }}
                >
                  <Box
                    onClick={() => {
                      redirectItem(item.order_id);
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
                        {item.item_data.product.name}
                      </Typography>
                    </Box>
                    <AspectRatio
                      minHeight="120px"
                      maxHeight="200px"
                      sx={{ my: 2 }}
                    >
                      <img
                        src={BASE_URL + item.item_data.warranty_image}
                        alt="product_img"
                      />
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
                        '/customer/claim/order/' +
                        item.order_id +
                        '?setOpen=true'
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
                          Claim
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

      {/* <<<<<<< Serial Number Input Dialog >>>>>>>> */}

      <Dialog
        open={open}
        onClose={handleClose}
        className="dialog"
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
        <DialogTitle sx={{ margin: 'auto', fontSize: 25 }}>Claim</DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          <DialogContentText sx={{ color: '#A4A9AF' }}>
            Enter the Serial no. of the product you want to claim
          </DialogContentText>
          <div>
            <StyledTextField
              fullWidth
              type="text"
              size="small"
              value={inputSerialNumber}
              onChange={handleChange}
              label={label === '' ? ' ' : ' '}
              InputLabelProps={{ shrink: false }}
              textColor="#A4A9AF"
              variant="outlined"
              sx={{ color: 'white', mt: 2 }}
            />
          </div>
        </DialogContent>
        <DialogActions className="dialog-btns">
          <CustomButton onClick={handleClose} className="left-btn">
            Cancel
          </CustomButton>
          <CustomButton onClick={handleClickClaim} className="right-btn">
            Claim
          </CustomButton>
        </DialogActions>
      </Dialog>

      {/* <<<<<<< End Serial Number Input Dialog >>>>>>>> */}

      {/* <<<<<<< Order Status Dialog >>>>>>>> */}

      <Dialog
        open={openError}
        onClose={handleCloseError}
        className="dialog"
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
        <DialogTitle sx={{ margin: 'auto', fontSize: 25 }}>Error!</DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          <DialogContentText sx={{ color: '#A4A9AF' }}>
            {orderStatus}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialog-btns">
          <CustomButton onClick={handleCloseError} className="left-btn">
            Close
          </CustomButton>
        </DialogActions>
      </Dialog>

      {/* <<<<<<< End Order Status Dialog >>>>>>>> */}
    </StyledDiv>
  );
}
