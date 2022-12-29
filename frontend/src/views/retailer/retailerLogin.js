import { Button } from '../../components/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { useRef, useContext, useState } from 'react';
import './retailerLogin.css';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

function ReailerLogin() {
  const videoRef = useRef();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };
    toast.promise(auth.loginUser(data.email, data.password), {
      loading: 'Logging in...',
      success: <b>Login Successful!</b>,
      error: <b>Something went wrong. Please try again.</b>,
    });
  };

  return (
    <div className="retailer-login">
      <video src="/landing-video.mp4" ref={videoRef} autoPlay loop muted />
      <div id="overlay"></div>
      <div className="login-container container">
        <Card className="login-card row">
          <Card.Body>
            <Card.Title>
              <h1 className="text-center">Retailer Login</h1>
            </Card.Title>
            <Card.Text className="login-body mt-4">
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
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
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                </div>
              </Form>
            </Card.Text>
            <div className="row justify-content-center mt-4">
              <small className="text-center">
                Don't have an account?{' '}
                <Link to="/retailer/signup">Sign Up</Link>
              </small>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default ReailerLogin;
