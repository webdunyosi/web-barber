import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import BookingPage from './pages/BookingPage';
import StylesPage from './pages/StylesPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<BookingPage />} />
          <Route path="/stillar" element={<StylesPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;