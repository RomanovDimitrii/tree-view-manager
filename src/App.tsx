import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import MainPage from './pages/MainPage';
import PrivateRoute from './utils/PrivateRoute';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route element={<PrivateRoute />}>
            <Route path="/main" element={<MainPage />} />
          </Route>
          <Route path="*" element={<Auth />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
