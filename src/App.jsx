import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import BookingPage from './pages/BookingPage';
import StylesPage from './pages/StylesPage';
import BarberProfilePage from './pages/BarberProfilePage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import { StepProvider } from './contexts/StepContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

const App = () => {
  return (
    <AuthProvider>
      <StepProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<BookingPage />} />
              <Route path="/stillar" element={<StylesPage />} />
              <Route path="/sartarosh" element={<BarberProfilePage />} />
              <Route path="/profil" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </Router>
      </StepProvider>
    </AuthProvider>
  );
};

export default App;