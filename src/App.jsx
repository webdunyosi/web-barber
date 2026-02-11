import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import HairStylesPage from './pages/HairStylesPage';
import VideosPage from './pages/VideosPage';
import BarberInfoPage from './pages/BarberInfoPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="styles" element={<HairStylesPage />} />
          <Route path="videos" element={<VideosPage />} />
          <Route path="about" element={<BarberInfoPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;