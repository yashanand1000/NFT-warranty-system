import { Button } from '../../components/Button';
import Form from 'react-bootstrap/Form';
import { Card } from 'react-bootstrap';
import { useRef, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import './retailerLogin.css';
import { AuthContext } from '../../contexts/AuthContext';

function ReailerConfirmPassword() {
  const videoRef = useRef();
  const location = useLocation();
  const [email, setEmail] = useState(location.state.email); // eslint-disable-line
  const [password, setPassword] = useState('');
  const auth = useContext(AuthContext);

  const handleConfirmPassword = (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };
    auth.confirmPassword(data.email, data.password);
  };

  return (
    <div className="retailer-login">
      <video src="/landing-video.mp4" ref={videoRef} autoPlay loop muted />
      <div id="overlay"></div>
      <Box className="login-container container" sx={{ margin: 20 }}>
        <Card className="login-card row" sx={{ marginTop: 5 }}>
          <Card.Body>
            <Card.Title>
              <h1 className="text-center">Confirm Password</h1>
            </Card.Title>
            <Card.Text className="login-body mt-4">
              <Form>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label className="mt-3">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <div className="row justify-content-center mt-4">
                  <Button
                    buttonStyle="btn--outline"
                    buttonSize="btn--medium"
                    onClick={handleConfirmPassword}
                  >
                    Confirm
                  </Button>
                </div>
              </Form>
            </Card.Text>
          </Card.Body>
        </Card>
      </Box>
    </div>
  );
}

export default ReailerConfirmPassword;
