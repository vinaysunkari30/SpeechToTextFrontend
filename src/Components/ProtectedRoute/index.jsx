import { useNavigate } from 'react-router-dom';
import {useEffect} from 'react';
import Cookies from 'js-cookie';

const ProtectedRoute = ({children}) => {
  const navigate = useNavigate()

  useEffect(()=>{
    const token = Cookies.get('token')
      if (!token) {
        navigate('/login');
        return;
      }
  },[navigate])
  return children;
}

export default ProtectedRoute
