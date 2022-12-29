import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import { Toaster } from 'react-hot-toast';
import LandingPage from './views/LandingPage';
import CustomerDashboard from './views/customer/customerDashboard';
import RetailerLogin from './views/retailer/retailerLogin';
import RetailerDashboard from './views/retailer/retailerDashboard';
import RetailerSignup from './views/retailer/retailerSignup';
import RetailerConfirmPassword from './views/retailer/retailerConfirmPassword';
import CustomerSignup from './views/customer/customerSignup';
import CustomerProtectedRoute from './utils/customerProtected';
import CustomerItemDescription from './views/customer/customerItemDescription';
import RetailerProtectedRoute from './utils/retailerProtected';
import RetailerProduct from './views/retailer/retailerProductPage';
import CustomerProfile from './views/customer/customerProfile';
import RetailerProfile from './views/retailer/retailerProfile';
import CustomerClaim from './views/customer/claimProducts';
import CreateProduct from './views/retailer/createProduct';
import ClaimItemDescription from './views/customer/claimItemDescription';

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <WalletProvider>
            <Routes>
              <Route
                path="/"
                exact
                element={
                  <div>
                    <Navbar />
                    <LandingPage />
                  </div>
                }
              />
              <Route
                path="/customer/register"
                element={
                  <div>
                    <Navbar showNavbarButton={false} />
                    <CustomerSignup />
                  </div>
                }
              />
              <Route
                path="/customer/profile"
                element={
                  <div>
                    <CustomerProtectedRoute>
                      <Navbar />
                      <CustomerProfile />
                    </CustomerProtectedRoute>
                  </div>
                }
              />
              <Route
                path="/customer/dashboard"
                element={
                  <div>
                    <CustomerProtectedRoute>
                      <Navbar />
                      <CustomerDashboard />
                    </CustomerProtectedRoute>
                  </div>
                }
              />
              <Route
                path="/customer/claim"
                element={
                  <div>
                    <CustomerProtectedRoute>
                      <Navbar showNavbarButton={false} />
                      <CustomerClaim />
                    </CustomerProtectedRoute>
                  </div>
                }
              />
              <Route
                path="/customer/item/:id"
                element={
                  <div>
                    <CustomerProtectedRoute>
                      <Navbar />
                      <CustomerItemDescription />
                    </CustomerProtectedRoute>
                  </div>
                }
              />
              <Route
                path="/customer/claim/order/:order_id"
                element={
                  <div>
                    <Navbar />
                    <ClaimItemDescription />
                  </div>
                }
              />
              <Route
                path="/retailer/dashboard"
                element={
                  <div>
                    <RetailerProtectedRoute>
                      <Navbar />
                      <RetailerDashboard />
                    </RetailerProtectedRoute>
                  </div>
                }
              />
              <Route
                path="/retailer/profile"
                element={
                  <div>
                    <RetailerProtectedRoute>
                      <Navbar />
                      <RetailerProfile />
                    </RetailerProtectedRoute>
                  </div>
                }
              />
              <Route
                path="/retailer/login"
                element={
                  <div>
                    <Navbar />
                    <RetailerLogin />
                  </div>
                }
              />
              <Route
                path="/retailer/signup"
                element={
                  <div>
                    <Navbar />
                    <RetailerSignup />
                  </div>
                }
              />
              <Route
                path="/retailer/confirmPassword"
                element={
                  <div>
                    <RetailerConfirmPassword />
                  </div>
                }
              />
              <Route
                path="/retailer/products/:id"
                element={
                  <div>
                    <Navbar />
                    <RetailerProduct />
                  </div>
                }
              />
              <Route
                path="/retailer/create/"
                element={
                  <div>
                    <Navbar />
                    <CreateProduct />
                  </div>
                }
              />
            </Routes>
            <Toaster />
          </WalletProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
