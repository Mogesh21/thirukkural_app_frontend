import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { renderRoutes, publicRoutes, protectedRoutes } from './routes';
import { setInitialState } from './store/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      dispatch(setInitialState({ token: storedToken }));
    }
  }, [dispatch, token]);

  return (
    <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>{renderRoutes(token ? protectedRoutes : publicRoutes)}</BrowserRouter>
  );
};

export default App;
