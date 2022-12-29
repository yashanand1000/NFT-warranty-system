import { Button } from '../../components/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { useRef, useContext, useState } from 'react';
import './retailerSignup.css';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

function RetailerSignup() {
  const videoRef = useRef();
  const auth = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
      password2: password2,
      first_name: first_name,
      last_name: last_name,
    };
    toast.promise(
      auth.registerUser(
        data.first_name,
        data.last_name,
        data.email,
        data.password,
        data.password2
      ),
      {
        loading: 'Signing Up...',
        success: <b>Registration Successful!!</b>,
        error: (err) => <b>{err}</b>,
      }
    );
  };

  return (
    <div className="retailer-signup">
      <video src="/landing-video.mp4" ref={videoRef} autoPlay loop muted />
      <div id="overlay"></div>
      <div className="signup-container container">
        <Card className="signup-card row">
          <Card.Body>
            <Card.Title>
              <h1 className="text-center">Retailer Signup</h1>
            </Card.Title>
            <Card.Text className="signup-body mt-4">
              <Form>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group controlId="formBasicName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group controlId="formBasicName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </div>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label className="mt-3">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label className="mt-3">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword2">
                  <Form.Label className="mt-3">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password2}
                    onChange={(e) => {
                      setPassword2(e.target.value);
                    }}
                  />
                </Form.Group>
                <div className="row justify-content-center mt-4">
                  <Button
                    buttonStyle="btn--outline"
                    buttonSize="btn--medium"
                    onClick={handleSignup}
                  >
                    Sign Up
                  </Button>
                </div>
              </Form>
            </Card.Text>
            <div className="row justify-content-center mt-4">
              <small className="text-center">
                Already have an account? <Link to="/retailer/login">Login</Link>
              </small>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default RetailerSignup;
