import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { PopperUnstyled, ClickAwayListener } from '@mui/base';
import { Button } from '@mui/material';
import {
  Box,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemDecorator,
  Sheet,
  Typography,
} from '@mui/joy';
import {
  AccountCircleOutlined,
  KeyboardArrowDown,
  Person,
  ShoppingCart,
  Logout,
} from '@mui/icons-material';
import { WalletContext } from '../contexts/WalletContext';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

function Navbar(props) {
  const navigate = useNavigate();
  const {
    userWalletAddress,
    setUserWalletAddress,
    connectWallet,
    disconnectWallet,
  } = useContext(WalletContext);
  const { logoutUser } = useContext(AuthContext);
  const [isCustomer, setisCustomer] = useState(false);
  const [isHome, setisHome] = useState(true);
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 768) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  const handleRoute = () => {
    const route = window.location.pathname.split('/')[1];
    const auth_route = window.location.pathname.split('/')[2];
    if (route === 'customer' && auth_route !== 'register') {
      setisHome(false);
      setisCustomer(true);
    } else if (
      auth_route === 'login' ||
      auth_route === 'signup' ||
      auth_route === 'register'
    ) {
      setisHome(true);
      setisCustomer(false);
    } else if (route === '') {
      setisHome(true);
      setisCustomer(false);
    } else {
      setisHome(false);
      setisCustomer(false);
    }
  };

  useEffect(() => {
    handleRoute();
    showButton();
  }, []);

  const redirectCustomer = () => {
    if (userWalletAddress) {
      navigate('/customer/dashboard');
      toast.success('Wallet Connected succesfully!');
    } else {
      connectWallet(setUserWalletAddress);
    }
  };

  const handleLogout = () => {
    if (isCustomer) {
      disconnectWallet();
    } else {
      logoutUser();
    }
  };

  const handleProfileRedirect = () => {
    if (isCustomer) {
      navigate('/customer/profile');
    } else {
      navigate('/retailer/profile');
    }
  };

  const handleNavButtonRedirect = () => {
    if (isCustomer) {
      navigate('/customer/claim');
    } else {
      navigate('/retailer/create');
    }
  };

  window.addEventListener('resize', showButton);

  const LoginMenu = React.forwardRef(
    ({ focusNext, focusPrevious, ...props }, ref) => {
      const [anchorEl, setAnchorEl] = React.useState(null);

      const open = Boolean(anchorEl);
      const id = open ? 'about-popper' : undefined;
      return (
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
          <Box onMouseLeave={() => setAnchorEl(null)}>
            <ListItemButton
              aria-haspopup
              aria-expanded={open ? 'true' : 'false'}
              ref={ref}
              {...props}
              role="menuitem"
              onFocus={(event) => setAnchorEl(event.currentTarget)}
              onMouseEnter={(event) => {
                props.onMouseEnter?.(event);
                setAnchorEl(event.currentTarget);
              }}
              sx={(theme) => ({
                ...(open && theme.variants.plainHover.neutral),
              })}
            >
              Login <KeyboardArrowDown />
            </ListItemButton>
            <PopperUnstyled
              id={id}
              open={open}
              anchorEl={anchorEl}
              disablePortal
              keepMounted
            >
              <Sheet
                variant="outlined"
                sx={{
                  my: 2,
                  boxShadow: 'md',
                  borderRadius: '8px',
                  backgroundColor: '#001E3C',
                }}
              >
                <List
                  role="menu"
                  aria-label="About"
                  sx={{
                    '--List-radius': '8px',
                    '--List-padding': '4px',
                    '--List-divider-gap': '4px',
                    '--List-decorator-width': '32px',
                  }}
                >
                  <ListItem onClick={redirectCustomer} role="none">
                    <ListItemButton
                      role="menuitem"
                      sx={{ backgroundColor: '#071A2F' }}
                    >
                      <ListItemDecorator>
                        <Person />
                      </ListItemDecorator>
                      Customer
                    </ListItemButton>
                  </ListItem>
                  <ListDivider />
                  <Link
                    style={{
                      textDecoration: 'none',
                      color: 'white',
                    }}
                    to="/retailer/login"
                  >
                    <ListItem role="none">
                      <ListItemButton
                        role="menuitem"
                        sx={{ backgroundColor: '#071A2F' }}
                      >
                        <ListItemDecorator>
                          <ShoppingCart />
                        </ListItemDecorator>
                        Retailer
                      </ListItemButton>
                    </ListItem>
                  </Link>
                </List>
              </Sheet>
            </PopperUnstyled>
          </Box>
        </ClickAwayListener>
      );
    }
  );

  const ProfileMenu = React.forwardRef(
    ({ focusNext, focusPrevious, ...props }, ref) => {
      const [anchorEl, setAnchorEl] = React.useState(null);

      const open = Boolean(anchorEl);
      const id = open ? 'about-popper' : undefined;
      return (
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
          <Box onMouseLeave={() => setAnchorEl(null)}>
            <ListItemButton
              aria-haspopup
              aria-expanded={open ? 'true' : 'false'}
              ref={ref}
              {...props}
              role="menuitem"
              onFocus={(event) => setAnchorEl(event.currentTarget)}
              onMouseEnter={(event) => {
                props.onMouseEnter?.(event);
                setAnchorEl(event.currentTarget);
              }}
              sx={(theme) => ({
                ...(open && theme.variants.plainHover.neutral),
              })}
            >
              <AccountCircleOutlined
                className="profile-icon"
                sx={{ fontSize: 45 }}
              />
            </ListItemButton>
            <PopperUnstyled
              id={id}
              open={open}
              anchorEl={anchorEl}
              disablePortal
              keepMounted
            >
              <Sheet
                variant="outlined"
                sx={{
                  my: 2,
                  boxShadow: 'md',
                  borderRadius: '8px',
                  backgroundColor: '#001E3C',
                  width: '120%',
                }}
              >
                <List
                  role="menu"
                  aria-label="About"
                  sx={{
                    '--List-radius': '8px',
                    '--List-padding': '4px',
                    '--List-divider-gap': '4px',
                    '--List-decorator-width': '32px',
                  }}
                >
                  <ListItem role="none" onClick={handleProfileRedirect}>
                    <ListItemButton
                      role="menuitem"
                      sx={{ backgroundColor: '#071A2F' }}
                    >
                      <ListItemDecorator>
                        <Person />
                      </ListItemDecorator>
                      My Profile
                    </ListItemButton>
                  </ListItem>
                  <ListDivider />
                  <ListItem role="none" onClick={handleLogout}>
                    <ListItemButton
                      role="menuitem"
                      sx={{ backgroundColor: '#071A2F' }}
                    >
                      <ListItemDecorator>
                        <Logout />
                      </ListItemDecorator>
                      Logout
                    </ListItemButton>
                  </ListItem>
                </List>
              </Sheet>
            </PopperUnstyled>
          </Box>
        </ClickAwayListener>
      );
    }
  );

  return (
    <>
      <nav
        style={
          isHome
            ? { backdropFilter: 'none', border: 'none' }
            : { backdropFilter: 'blur(20px)' }
        }
        className="navbar"
      >
        <div className="navbar-container">
          {isHome ? (
            <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
              PyDO
              <i className="fa-brands fa-hive"></i>
            </Link>
          ) : (
            <Link
              to={isCustomer ? '/customer/dashboard' : '/retailer/dashboard'}
              className="navbar-logo"
              onClick={closeMobileMenu}
            >
              PyDO
              <i className="fa-brands fa-hive"></i>
            </Link>
          )}
          <ul className="nav-menu">
            {/* <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li> */}
          </ul>

          {props.showNavbarButton == null && !isHome && button && (
            <Box>
              <Button
                className="nav-button"
                variant="outlined"
                color="success"
                onClick={handleNavButtonRedirect}
              >
                <Typography
                  component="span"
                  level="body1"
                  className="nav-button-text"
                >
                  {isCustomer ? 'Claim Product' : 'Create Product'}
                </Typography>
              </Button>
            </Box>
          )}

          {button && (
            <div>
              <Box sx={{ minHeight: 190, color: 'white', marginTop: 15 }}>
                <List
                  role="menubar"
                  row
                  sx={{
                    '--List-radius': '8px',
                    '--List-padding': '4px',
                    '--List-gap': '8px',
                  }}
                >
                  <ListItem role="none">
                    {isHome ? <LoginMenu /> : <ProfileMenu />}
                  </ListItem>
                </List>
              </Box>
            </div>
          )}

          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu-mobile active' : 'nav-menu-mobile'}>
            <li>
              {isHome ? (
                <Link
                  to="/"
                  className="nav-links-mobile"
                  onClick={() => connectWallet(setUserWalletAddress)}
                >
                  Customer Login
                </Link>
              ) : (
                <Box
                  className="nav-links-mobile"
                  onClick={handleProfileRedirect}
                >
                  <Person sx={{ marginRight: 1, marginBottom: 0.5 }} />
                  My Profile
                </Box>
              )}
            </li>

            <li>
              {isHome ? (
                <Link
                  to="/retailer/login"
                  className="nav-links-mobile"
                  onClick={closeMobileMenu}
                >
                  Retailer Login
                </Link>
              ) : (
                <Box className="nav-links-mobile" onClick={handleLogout}>
                  <Logout sx={{ marginRight: 1, marginBottom: 0.5 }} />
                  Logout
                </Box>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
