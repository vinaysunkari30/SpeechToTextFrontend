import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import './index.css'

import LoginPage from './Components/LoginPage/index.jsx'
import SignInPage from './Components/SignInPage/index.jsx'
import Home from './Components/Home/index.jsx'
import ProtectedRoute from "./Components/ProtectedRoute/index.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <>
  <BrowserRouter>
    <Routes>
      <Route exact path='/login' element={<LoginPage/>}/>
      <Route exact path='/sign-in' element={<SignInPage/>}/>
      <Route exact path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
    </Routes>
  </BrowserRouter>
  <ToastContainer position="top-center" autoClose={2000} />
  </>
)

export default App