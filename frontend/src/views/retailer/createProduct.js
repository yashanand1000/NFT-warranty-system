import './createProduct.css';
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Button } from '../../components/Button';
import TextField from '@mui/material/TextField';
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';
import { FormControl, Input } from '@mui/material';
import { InputAdornment } from '@mui/material';
import { IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import useAxios from '../../utils/useAxios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';

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

export default function CreateProduct() {
  const [label, setLabel] = React.useState(''); // eslint-disable-line
  const [product_name, setProductname] = React.useState('');
  const [product_warranty_period, setProductwarrantyperiod] = React.useState(0);
  const [product_file, setProductfile] = React.useState({});
  const [product_description, setProductdescription] = React.useState('');
  const [category, setCategory] = React.useState('home');
  const [product, setProduct] = React.useState(0); // eslint-disable-line
  const api = useAxios();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const category_choices = [
    { value: 'home', label: 'Home' },
    { value: 'appliances', label: 'Appliances' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'gadget', label: 'Gadget' },
  ];

  const handleProductNameChange = (event) => {
    setProductname(event.target.value);
  };
  const handleProductWarrantyPeriodChange = (event) => {
    setProductwarrantyperiod(event.target.value);
  };
  const handleProductDescriptionChange = (event) => {
    setProductdescription(event.target.value);
  };
  const handleProductFileChange = (event) => {
    setProductfile(event.target.files[0]);
  };
  const handleCreateProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', product_name);
    formData.append('warranty_period', product_warranty_period);
    formData.append('product_data', product_description);
    formData.append('image', product_file);
    formData.append('retailer', user.user_id);
    formData.append('category', category);
    console.log(formData);
    const response = await api.post('/products/', formData);
    if (response.status === 201) {
      setProduct(response.data.id);
      toast.success('Product Created Successfully');
      navigate(`/retailer/products/${response.data.id}`);
    } else {
      toast.error(response.data);
    }
  };
  return (
    <div>
      <div>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography className="product_name">Create Product</Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            margin: 'auto',
            height: '100%',
            width: '100%',
            flexGrow: 1,
            backgroundColor: 'transparent',
            color: 'white',
          }}
        >
          <Box className="profile">
            <Grid item xs>
              <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ margin: 2 }}>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                    component="div"
                    sx={{ fontSize: '1.3rem', color: 'rgb(200, 200, 200)' }}
                  >
                    <span>Product Name</span>
                  </Typography>
                  <div className="text-field">
                    <StyledTextField
                      fullWidth
                      size="small"
                      onChange={handleProductNameChange}
                      label={label === '' ? ' ' : ' '}
                      InputLabelProps={{ shrink: false }}
                      textColor="#A4A9AF"
                      variant="outlined"
                      sx={{ color: 'white' }}
                    />
                  </div>
                </Box>
                <Box
                  sx={{
                    margin: 2,
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
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                    component="div"
                    sx={{ fontSize: '1.3rem', color: 'rgb(200, 200, 200)' }}
                  >
                    <span>Category</span>
                  </Typography>
                  <div className="text-field">
                    <TextField
                      id="outlined-select-currency"
                      select
                      size="small"
                      label={label === '' ? ' ' : ' '}
                      value={category}
                      InputLabelProps={{ shrink: false }}
                      className="dropdown"
                      onChange={(e) => setCategory(e.target.value)}
                      sx={{ color: 'white', border: 'none' }}
                    >
                      {category_choices.map((option) => {
                        return (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </div>
                </Box>
              </Grid>
              <Box sx={{ margin: 2 }}>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                  component="div"
                  sx={{ fontSize: '1.3rem', color: 'rgb(200, 200, 200)' }}
                >
                  <span>Product Data</span>
                </Typography>
                <div sx={{ width: 400 }}>
                  <StyledTextField
                    fullWidth
                    multiline
                    rows={4}
                    size="small"
                    onChange={handleProductDescriptionChange}
                    label={label === '' ? ' ' : ' '}
                    InputLabelProps={{ shrink: false }}
                    textColor="#A4A9AF"
                    variant="outlined"
                    sx={{ color: 'white' }}
                  />
                </div>
              </Box>
              <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ margin: 2 }}>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                    component="div"
                    sx={{ fontSize: '1.3rem', color: 'rgb(200, 200, 200)' }}
                  >
                    <span>Warranty Period</span>
                  </Typography>
                  <div className="text-field">
                    <StyledTextField
                      fullWidth
                      size="small"
                      onChange={handleProductWarrantyPeriodChange}
                      label={label === '' ? ' ' : ' '}
                      InputLabelProps={{ shrink: false }}
                      textColor="#A4A9AF"
                      variant="outlined"
                      sx={{ color: 'white' }}
                    />
                  </div>
                </Box>
                <Box sx={{ margin: 2 }}>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                    component="div"
                    sx={{ fontSize: '1.3rem', color: 'rgb(200, 200, 200)' }}
                  >
                    <span>Product Image</span>
                  </Typography>
                  <div className="text-field">
                    {/* Mui File upload field */}

                    <FormControl
                      variant="outlined"
                      className="upload-field"
                      fullWidth
                    >
                      <Input
                        type="file"
                        id="outlined-adornment-password"
                        className="upload-field"
                        onChange={handleProductFileChange}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton>
                              <PhotoCamera className="upload-field-icon" />
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={70}
                        sx={{ color: 'white' }}
                      />
                    </FormControl>
                  </div>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 3,
            }}
          >
            <Button
              className="btns"
              buttonStyle="btn--primary"
              buttonSize="btn--large"
              buttonText="Create Product"
              onClick={handleCreateProduct}
            >
              Create
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );
}
