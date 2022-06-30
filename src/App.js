import { useContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { UserContext } from './context/userContext';

import Homepage from './pages/homepage';
import Complain from './pages/complain';
import ComplainAdmin from './pages/complainAdmin';
import AddProduct from './pages/addProduct'
import Cart from './pages/cart'
import DetailProduct from './pages/detailProduct'
import ProductAdmin from './pages/productAdmin'
import HomeAuth from './pages/homeauth'
import Profile from './pages/profile'
import TransactionAdmin from './pages/transactionAdmin'
import UpdateProduct from './pages/updateProduct'

import { API, setAuthToken } from './config/api'

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  console.clear();
  console.log(state);

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    if (state.isLogin === false) {
      navigate('/auth');
    } else {
      if (state.user.status === 'admin') {
        navigate('/product-admin');
      } else if (state.user.status === 'customer') {
        navigate('/');
      }
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth');
      if (response.status === 404) {
        return dispatch({
          type: 'AUTH_ERROR',
        });
      }
      let payload = response.data.data.user;
      payload.token = localStorage.token;
      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.token) {
      checkUser();
    }
  }, []);
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route path="/auth" element={<HomeAuth />} />
        <Route path="/update-product/:id" element={<UpdateProduct />} />
        <Route path="/transaction-admin" element={<TransactionAdmin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:id" element={<DetailProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/complain" element={<Complain />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/complain-admin" element={<ComplainAdmin />} />
        <Route path="/product-admin" element={<ProductAdmin />} />
      </Routes>
    </div>
  );
}

export default App;
