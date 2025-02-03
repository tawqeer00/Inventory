import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home/Home";
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Forgot from "./pages/auth/Forgot";
import Reset from "./pages/auth/Reset";
import Dashboard from "./pages/dashboard/Dashboard"
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { getLoginStatus } from "./redux/services/authService"
import { SET_LOGIN } from "./redux/slice/authSlice"
import Sidebar from "./components/sidebar/SideBar";
import Layout from "./components/layout/Layout";
// import SellProduct from "./pages/sellProduct/SellProduct";
import AddProduct from "./pages/addProduct/AddProduct"
import ProductDetail from "./components/product/productDetail/ProductDetail";
import EditProduct from "./pages/editProduct/EditProduct";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import Contact from "./pages/contact/Contact";
import SellProducts from "./components/product/sellProducts/SellProducts";
import CustomerData from "./components/customerData/CustomerData";
import useRedirectLoggedOutUser from "./customHook/useRedirectLoggedOutUser"


axios.defaults.withCredentials = true;

// axios.defaults.baseURL = "https://3430-152-58-112-168.ngrok-free.app"; 

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loginStatus() {
      const status = await getLoginStatus();
      dispatch(SET_LOGIN(status));
    }
    loginStatus();
  }, [dispatch]);

  const ProtectedComponent = ({ children }) => {
    useRedirectLoggedOutUser("/"); 
    return children;
  };

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/resetpassword/:resetToken" element={<Reset />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedComponent>
              <Sidebar>
                <Layout>
                  <Dashboard />
                </Layout>
              </Sidebar>
            </ProtectedComponent>
          }
        />

        <Route
          path="/customer"
          element={
            <ProtectedComponent>
              <Sidebar>
                <Layout>
                  <CustomerData />
                </Layout>
              </Sidebar>
            </ProtectedComponent>
          }
        />

        <Route
          path="/add-product"
          element={
            <ProtectedComponent>
              <Sidebar>
                <Layout>
                  <AddProduct />
                </Layout>
              </Sidebar>
            </ProtectedComponent>
          }
        />

        <Route
          path="/product-detail/:id"
          element={
            <ProtectedComponent>
              <Sidebar>
                <Layout>
                  <ProductDetail />
                </Layout>
              </Sidebar>
            </ProtectedComponent>
          }
        />

        <Route
          path="/edit-product/:id"
          element={
            <ProtectedComponent>
              <Sidebar>
                <Layout>
                  <EditProduct />
                </Layout>
              </Sidebar>
            </ProtectedComponent>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedComponent>
              <Sidebar>
                <Layout>
                  <Profile />
                </Layout>
              </Sidebar>
            </ProtectedComponent>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedComponent>
              <Sidebar>
                <Layout>
                  <EditProfile />
                </Layout>
              </Sidebar>
            </ProtectedComponent>
          }
        />

        <Route
          path="/sell"
          element={
            <ProtectedComponent>
              <Sidebar>
                <Layout>
                  <SellProducts />
                </Layout>
              </Sidebar>
            </ProtectedComponent>
          }
        />

        <Route
          path="/contact-us"
          element={
            <ProtectedComponent>
              <Sidebar>
                <Layout>
                  <Contact />
                </Layout>
              </Sidebar>
            </ProtectedComponent>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;