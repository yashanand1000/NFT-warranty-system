import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Card from '@mui/joy/Card';
import AspectRatio from '@mui/joy/AspectRatio';
import '../customer/customerItemDescription.css';
import { Button } from '../../components/Button';
import Otpinput from '../../components/otpInput';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import useCustomerAxios from '../../utils/useCustomerAxios';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { WalletContext } from '../../contexts/WalletContext';
import { initializeApp } from 'firebase/app';
import { FRONTEND_BASE_URL, API_BASE_URL, firebaseConfig } from '../../config';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

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

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function CustomerItemDescription() {
  let { id } = useParams();
  const api = useCustomerAxios();
  const { customer } = React.useContext(WalletContext);
  const [captchaRendered, setCaptchaRendered] = useState(false);
  const [item, setItem] = useState([]);
  const [order, setOrder] = useState([]); // eslint-disable-line
  const [itemStatus, setItemStatus] = useState('Loading...');
  const [inputPhoneNumber, setInputPhoneNumber] = useState('');
  const [inputOTP, setInputOTP] = useState('');
  const [number, setNumber] = useState('');
  const [dialogStatusText, setDialogStatusText] = useState('');
  const [open, setOpen] = React.useState(false);
  const [openLink, setOpenLink] = React.useState(false);
  const [openOtp, setOpenOtp] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [button, setButton] = React.useState(true);
  const [isLinkCopied, setIsLinkCopied] = React.useState(false);
  const baseClaimURL = FRONTEND_BASE_URL + '/customer/claim/order/';
  let query = useQuery();

  const getInputData = (input) => {
    const otp =
      input.input1 +
      input.input2 +
      input.input3 +
      input.input4 +
      input.input5 +
      input.input6;
    setInputOTP(otp);
    console.log(otp);
  };

  const handleChange = (event) => {
    setLabel(event.target.value);
    setInputPhoneNumber(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenOtp = () => {
    if (inputPhoneNumber === customer.phno) {
      setDialogStatusText("Product can't be transferred to yourself!");
      setOpen(false);
      setOpenOtp(true);
    } else if (inputPhoneNumber && inputPhoneNumber.length === 10) {
      const phoneNumber = '+91' + customer.phno;
      const appVerifier = window.recaptchaVerifier;

      console.log('sending OTP to ' + phoneNumber);
      setDialogStatusText('Sending OTP to ' + phoneNumber);

      signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          setDialogStatusText('');
          setOpen(false);
          setOpenOtp(true);
        })
        .catch((error) => {
          setOpen(false);
          setOpenOtp(true);
          setDialogStatusText('An error occurred while sending OTP');
          console.log(error);
        });
    } else {
      setDialogStatusText('Invalid phone number given');
      setOpen(false);
      setOpenOtp(true);
    }
  };

  const handleCloseOtp = () => {
    setOpenOtp(false);
  };

  const handleClickOpenLink = async () => {
    if (inputOTP) {
      const code = inputOTP;
      window.confirmationResult
        .confirm(code)
        .then((result) => {
          setDialogStatusText('Loading...');
          createOrder();
        })
        .catch((error) => {
          setDialogStatusText('The OTP entered is incorrect, please try again');
          setOpenOtp(false);
          setOpenLink(true);
        });
    } else {
      setDialogStatusText('Invalid OTP entered');
    }
  };

  const handleClickOpenIssuedLink = async () => {
    setOpenLink(true);
  };

  const handleCloseLink = () => {
    setOpenLink(false);
    setButton(false);
  };

  // eslint-disable-next-line no-unused-vars
  const createOrder = async () => {
    const response = await fetch(API_BASE_URL + '/orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phno: inputPhoneNumber,
        item: item.id,
        from_address: customer.wallet_address,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (response.status === 201) {
      setOrder(data);
      setDialogStatusText('');
      setOpenOtp(false);
      setOpenLink(true);
    } else {
      setDialogStatusText(data[Object.keys(data)[0]]);
    }
  };

  useEffect(() => {
    fetchItem();

    if (!captchaRendered) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          },
        },
        auth
      );
      setCaptchaRendered(true);
    }

    if (query.get('setOpen') === 'true') {
      setOpen(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchNumber = async (order_id) => {
    try {
      console.log(order_id);
      const number_response = await api.get(
        '/orders/get_order/?order_id=' + order_id
      );
      console.log(number_response.data.phno);
      if (number_response.status === 200) {
        setNumber(number_response.data.phno);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchItem = async () => {
    try {
      const response = await api.get('/items/' + id);
      console.log(response.data);
      if (response.status === 200) {
        setItem(response.data);
        if (response.data.order_id) {
          fetchNumber(response.data.order_id);
        }
      }
    } catch (e) {
      setItemStatus('An Error Occurred! please try again later.');
    }
  };

  return (
    <div>
      <div id="recaptcha-container"></div>
      {item.product ? (
        <div>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography className="product_name">
              {item.product.name}
            </Typography>
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
                  <Img src={item.warranty_image} alt="product_img" />
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
                      <span className="fields">Serial Number - </span>{' '}
                      {item.serial_no}
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="subtitle1"
                      component="div"
                      sx={{ fontSize: '1.3rem', color: 'rgb(200, 200, 200)' }}
                    >
                      <span className="fields">Retailer - </span>{' '}
                      {item.product.retailer_name}
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="subtitle1"
                      component="div"
                      sx={{ fontSize: '1.3rem', color: 'rgb(200, 200, 200)' }}
                    >
                      <span className="fields">Description - </span>{' '}
                      {item.product.product_data}
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="subtitle1"
                      component="div"
                      sx={{ fontSize: '1.3rem', color: 'rgb(200, 200, 200)' }}
                    >
                      <span className="fields">Warranty Period - </span>{' '}
                      {item.warranty_period} months
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="subtitle1"
                      component="div"
                      sx={{ fontSize: '1.3rem', color: 'rgb(200, 200, 200)' }}
                    >
                      <span className="fields">Warranty Status - </span> Expires
                      on {item.warranty_end_date}
                    </Typography>
                  </Grid>
                  <Grid item></Grid>
                </Grid>
              </Grid>
            </Grid>

            {item.order_id || !button ? (
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#A4A9AF',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  You have already issued this item to the Mobile Number{' '}
                  <span style={{ marginLeft: '5px', color: '#d9d9d9' }}>
                    {inputPhoneNumber || number}
                  </span>
                  .
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mt: 1,
                    color: '#d9d9d9',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  You can view the unique transfer link
                  <span
                    onClick={handleClickOpenIssuedLink}
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
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 1,
                }}
              >
                <Button
                  className="btns"
                  buttonStyle="btn--primary"
                  buttonSize="btn--large"
                  onClick={handleClickOpen}
                >
                  Transfer
                </Button>
              </Box>
            )}

            {/* <<<<<<<< Mobile Number Input Dialog Box >>>>>>>> */}

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
              <DialogTitle sx={{ margin: 'auto', fontSize: 25 }}>
                Enter the Details
              </DialogTitle>
              <DialogContent sx={{ pb: 0 }}>
                <DialogContentText sx={{ color: '#A4A9AF' }}>
                  Enter the Mobile no. of the person you want to transfer the
                  product to
                </DialogContentText>
                <div>
                  <StyledTextField
                    fullWidth
                    type="tel"
                    size="small"
                    value={inputPhoneNumber}
                    onChange={handleChange}
                    label={label === '' ? ' ' : ' '}
                    InputLabelProps={{ shrink: false }}
                    textcolor="#A4A9AF"
                    variant="outlined"
                    sx={{ color: 'white', mt: 2 }}
                  />
                </div>
              </DialogContent>
              <DialogActions className="dialog-btns">
                <Button onClick={handleClose} className="left-btn">
                  Cancel
                </Button>
                <Button onClick={handleClickOpenOtp} className="right-btn">
                  Get OTP
                </Button>
              </DialogActions>
            </Dialog>

            {/* <<<<<<<< OTP Input Dialog Box >>>>>>>> */}

            <Dialog
              open={openOtp}
              onClose={handleCloseOtp}
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
              <DialogTitle sx={{ margin: 'auto', fontSize: 25 }}>
                {dialogStatusText ? '' : 'Enter OTP'}
              </DialogTitle>
              <DialogContent sx={{ pb: 0 }}>
                <DialogContentText sx={{ color: '#A4A9AF' }}>
                  {dialogStatusText ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography sx={{ fontSize: '1.2rem' }}>
                        {dialogStatusText}
                      </Typography>
                    </Box>
                  ) : (
                    <div>
                      Enter the OTP sent to the Mobile Number ending with{' '}
                      <b>XXXXXX{String(customer.phno).slice(-4)}.</b>
                    </div>
                  )}
                </DialogContentText>
                {!dialogStatusText && <Otpinput getInputData={getInputData} />}
              </DialogContent>
              <DialogActions>
                {dialogStatusText ? (
                  <Button onClick={handleCloseOtp}>Cancel</Button>
                ) : (
                  <Button onClick={handleClickOpenLink}>Transfer</Button>
                )}
              </DialogActions>
            </Dialog>

            {/* <<<<<<<< Transfer Link Display Dialog Box >>>>>>>> */}

            <Dialog
              open={openLink}
              onClose={handleCloseLink}
              className="dialog"
              PaperProps={{
                style: {
                  backgroundColor: '#0a1929',
                  color: '#fff',
                  border: 0.1,
                  borderColor: '#A4A9AF',
                  borderStyle: 'solid',
                  minWidth: '300px',
                },
              }}
            >
              <DialogTitle sx={{ margin: 'auto', fontSize: 25 }}>
                {dialogStatusText ? '' : 'Transfer Link'}
              </DialogTitle>
              <DialogContent sx={{ pb: 0 }}>
                <DialogContentText sx={{ color: '#61c97d' }}>
                  {dialogStatusText ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography sx={{ fontSize: '1.2rem' }}>
                        {dialogStatusText}
                      </Typography>
                    </Box>
                  ) : (
                    <div>
                      The following Transfer link has been sent to the Mobile
                      number '{inputPhoneNumber || number}'.
                    </div>
                  )}
                </DialogContentText>
                {!dialogStatusText && (
                  <div>
                    <StyledTextField
                      fullWidth
                      size="small"
                      value={baseClaimURL + (item.order_id || order.order_id)}
                      readOnly
                      label={label === '' ? ' ' : ' '}
                      InputLabelProps={{ shrink: false }}
                      textColor="#A4A9AF"
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ color: 'white', mt: 2 }}
                    />
                  </div>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseLink}>Close</Button>
                {!dialogStatusText && (
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        baseClaimURL + (item.order_id || order.order_id)
                      );
                      setIsLinkCopied(true);
                      setButton(false);
                    }}
                  >
                    {isLinkCopied ? 'Copied!' : 'Copy!'}
                  </Button>
                )}
              </DialogActions>
            </Dialog>
          </Box>
        </div>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', height: '30vh' }}>
          <Typography
            variant="h5"
            sx={{ position: 'relative', top: '50%', color: '#A4A9AF' }}
          >
            {itemStatus}
          </Typography>
        </Box>
      )}
    </div>
  );
}
