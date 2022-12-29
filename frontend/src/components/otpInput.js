import { useState } from 'react';
import '../components/otpInput.css';

export default function Otpinput({ getInputData }) {
  const [otpInput, setOtpInput] = useState({
    input1: '',
    input2: '',
    input3: '',
    input4: '',
    input5: '',
    input6: '',
  });

  const handleSubmit = (event) => {
    const data = new FormData(event.target);
    console.log(data);
    event.preventDefault();
  };

  const inputfocus = (element) => {
    if (element.key === 'Delete' || element.key === 'Backspace') {
      const next = element.target.tabIndex - 2;
      if (next > -1) {
        element.target.form.elements[next].focus();
      }
    } else {
      const next = element.target.tabIndex;
      if (next < 6) {
        element.target.form.elements[next].focus();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="otpContainer">
        <input
          name="otp1"
          type="text"
          autoComplete="off"
          className="otpInput"
          value={otpInput.input1}
          onChange={(e) => {
            setOtpInput({ ...otpInput, input1: e.target.value });
          }}
          tabIndex="1"
          maxLength="1"
          onKeyUp={(e) => {
            inputfocus(e);
          }}
        />
        <input
          name="otp2"
          type="text"
          autoComplete="off"
          className="otpInput"
          value={otpInput.input2}
          onChange={(e) => {
            setOtpInput({ ...otpInput, input2: e.target.value });
          }}
          tabIndex="2"
          maxLength="1"
          onKeyUp={(e) => {
            inputfocus(e);
          }}
        />
        <input
          name="otp3"
          type="text"
          autoComplete="off"
          className="otpInput"
          value={otpInput.input3}
          onChange={(e) => {
            setOtpInput({ ...otpInput, input3: e.target.value });
          }}
          tabIndex="3"
          maxLength="1"
          onKeyUp={(e) => {
            inputfocus(e);
          }}
        />
        <input
          name="otp4"
          type="text"
          autoComplete="off"
          className="otpInput"
          value={otpInput.input4}
          onChange={(e) => {
            setOtpInput({ ...otpInput, input4: e.target.value });
          }}
          tabIndex="4"
          maxLength="1"
          onKeyUp={(e) => {
            inputfocus(e);
          }}
        />
        <input
          name="otp5"
          type="text"
          autoComplete="off"
          className="otpInput"
          value={otpInput.input5}
          onChange={(e) => {
            setOtpInput({ ...otpInput, input5: e.target.value });
          }}
          tabIndex="5"
          maxLength="1"
          onKeyUp={(e) => {
            inputfocus(e);
          }}
        />
        <input
          name="otp6"
          type="text"
          autoComplete="off"
          className="otpInput"
          value={otpInput.input6}
          onChange={(e) => {
            setOtpInput({ ...otpInput, input6: e.target.value });
          }}
          tabIndex="6"
          maxLength="1"
          onKeyUp={(e) => {
            inputfocus(e);
            getInputData(otpInput);
          }}
        />
      </div>
    </form>
  );
}
