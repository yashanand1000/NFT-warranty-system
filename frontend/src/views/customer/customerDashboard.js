import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import AspectRatio from '@mui/joy/AspectRatio';
import Grid from '@mui/material/Grid';
import CardOverflow from '@mui/joy/CardOverflow';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useCustomerAxios from '../../utils/useCustomerAxios';

const StyledDiv = styled('div')(() => ({
  color: '#fff',
}));

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [itemsStatus, setItemsStatus] = useState('No Items');
  const api = useCustomerAxios();

  const redirectItem = (id) => {
    navigate('/customer/item/' + id);
  };

  useEffect(() => {
    fetchItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchItems = async () => {
    try {
      const response = await api.get('/items');
      console.log(response.data);
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
            <Typography sx={{ fontSize: '3rem' }}>My Products</Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{
              position: 'relative',
              top: '50%',
              color: '#A4A9AF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '25vh',
            }}
          >
            {itemsStatus}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontSize: '3rem' }}>My Products</Typography>
          </Box>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {Array.from(items).map((item, index) => (
              <Grid item xs={4} sm={4} md={3} key={index}>
                <Card
                  variant="outlined"
                  sx={{ minWidth: '10%', width: '100%', mt: 3 }}
                >
                  <Box
                    onClick={() => {
                      redirectItem(item.id);
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
                        {item.product.name}
                      </Typography>
                    </Box>
                    <AspectRatio
                      minHeight="120px"
                      maxHeight="200px"
                      sx={{ my: 2 }}
                    >
                      <img src={item.warranty_image} alt="product_img" />
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
                    {item.order_id ? (
                      <Link
                        to={'/customer/item/' + item.id}
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
                            sx={{
                              ml: 'auto',
                              fontWeight: 600,
                              fontSize: '1.2rem',
                            }}
                          >
                            Issued!
                          </Button>
                        </Box>
                      </Link>
                    ) : (
                      <Link
                        to={'/customer/item/' + item.id + '?setOpen=true'}
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
                            sx={{
                              ml: 'auto',
                              fontWeight: 600,
                              fontSize: '1.2rem',
                            }}
                          >
                            Transfer
                          </Button>
                        </Box>
                      </Link>
                    )}
                  </CardOverflow>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </StyledDiv>
  );
}
