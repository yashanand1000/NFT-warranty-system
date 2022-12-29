import { useRef, useEffect, useContext, useState } from 'react';
import '../App.css';
import { Button } from '../components/Button';
import './LandingPage.css';
import { WalletContext } from '../contexts/WalletContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function LandingPage() {
  const navigate = useNavigate();
  const videoRef = useRef();
  const [isHovering, setIsHovering] = useState(false);

  const { userWalletAddress, setUserWalletAddress, connectWallet } =
    useContext(WalletContext);

  const redirectCustomer = () => {
    if (userWalletAddress) {
      navigate('/customer/dashboard');
      toast.success('Wallet Connected succesfully!');
    } else {
      connectWallet(setUserWalletAddress);
    }
  };

  useEffect(() => {
    videoRef.current.playbackRate = 0.6;
  });

  return (
    <div className="landing-page">
      <video src="/landing-video.mp4" ref={videoRef} autoPlay loop muted />
      <div id="overlay"></div>
      <div className="hero-container">
        <h1>Prove Your</h1>
        <h2>Digital Ownership</h2>
        <p>What are you waiting for?</p>
        <div className="hero-btns">
          <Button
            className="btns"
            buttonStyle="btn--primary"
            buttonSize="btn--large"
            onClick={redirectCustomer}
          >
            CUSTOMER <i className="fa-solid fa-angle-right"></i>
          </Button>
          <Link
            style={{
              textDecoration: 'none',
              color: isHovering ? 'black' : 'white',
            }}
            to="/retailer/login"
          >
            <Button
              className="btns"
              buttonStyle="btn--outline"
              buttonSize="btn--large"
              onMouseEnter={() => {
                setIsHovering(true);
              }}
              onMouseLeave={() => {
                setIsHovering(false);
              }}
            >
              RETAILER <i className="fa-solid fa-angle-right"></i>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
