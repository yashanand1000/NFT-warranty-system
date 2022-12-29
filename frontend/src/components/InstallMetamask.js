import { styled } from '@mui/material/styles';

const StyledDiv = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 40,
  marginLeft: 50,
  color: '#fff',
}));

export default function InstallMetamask() {
  return (
    <div>
      <StyledDiv className="installMetamask">
        <div className="installMetamask__container">
          <div className="installMetamask__container__title">
            <h1>Install Metamask</h1>
          </div>
          <div className="installMetamask__container__text">
            <p>
              To use this app, you need to install Metamask.
              <br />
              <br />
              <a href="https://metamask.io/">
                <span>Download Metamask</span>
              </a>
            </p>
          </div>
        </div>
      </StyledDiv>
    </div>
  );
}
