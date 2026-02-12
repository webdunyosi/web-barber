import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import BookingPage from './pages/BookingPage';
import StylesPage from './pages/StylesPage';
import { StepProvider } from './contexts/StepContext.jsx';

const App = () => {
  return (
    <StepProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<BookingPage />} />
            <Route path="/stillar" element={<StylesPage />} />
          </Route>
        </Routes>
      </Router>
    </StepProvider>
  );
};

export default App;