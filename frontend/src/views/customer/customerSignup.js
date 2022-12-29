import { Button } from '../../components/Button';
import Form from 'react-bootstrap/Form';
import { Card } from 'react-bootstrap';
import { useRef, useContext, useState } from 'react';
import './customerSignup.css';
import { WalletContext } from '../../contexts/WalletContext';
import toast from 'react-hot-toast';

function CustomerSignup() {
  const videoRef = useRef();
  const auth = useContext(WalletContext);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    const data = {
      name: name,
      phone: phone,
    };
    toast.promise(auth.registerOwner(data.name, data.phone), {
      loading: 'Signing Up...',
      success: <b>Registration Successful!!</b>,
      error: (err) => <b>{err}</b>,
    });
  };

  return (
    <div className="customer-signup">
      <video src="/landing-video.mp4" ref={videoRef} autoPlay loop muted />
      <div id="overlay"></div>
      <div className="signup-container container">
        <Card className="signup-card row">
          <Card.Body>
            <Card.Title>
              <h1 className="text-center">One more Step...</h1>
            </Card.Title>
            <Card.Text className="signup-body mt-4">
              <Form>
                <Form.Group controlId="formBasicName">
                  <Form.Label className="mt-3">Name</Form.Label>
                  <Form.Control
                    type="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPhone">
                  <Form.Label className="mt-3">Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                  />
                </Form.Group>
                <div className="row justify-content-center mt-4">
                  <Button
                    buttonStyle="btn--outline"
                    buttonSize="btn--medium"
                    onClick={handleRegister}
                  >
                    Register
                  </Button>
                </div>
              </Form>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default CustomerSignup;
