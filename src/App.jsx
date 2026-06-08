import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import BookingPage from './pages/BookingPage';
import StylesPage from './pages/StylesPage';
import BarberProfilePage from './pages/BarberProfilePage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AiChatPage from './pages/AiChatPage';
import ScrollToTop from './components/layout/ScrollToTop';
import { StepProvider } from './contexts/StepContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

const App = () => {
  return (
    <AuthProvider>
      <StepProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<BookingPage />} />
              <Route path="/stillar" element={<StylesPage />} />
              <Route path="/sartarosh" element={<BarberProfilePage />} />
              <Route path="/profil" element={<ProfilePage />} />
              <Route path="/ai-chat" element={<AiChatPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
            </Route>
          </Routes>
        </Router>
      </StepProvider>
    </AuthProvider>
  );
};

export default App;