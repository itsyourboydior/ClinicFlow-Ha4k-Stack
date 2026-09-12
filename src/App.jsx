import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { initData } from './data/store';
import LandingPage from './pages/LandingPage';
import Marketplace from './pages/Marketplace';
import BookingPage from './pages/BookingPage';
import QueueDisplay from './pages/QueueDisplay';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { ErrorBoundary } from './ErrorBoundary';

function App() {
  useEffect(() => {
    initData();
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gjej" element={<Marketplace />} />
          <Route path="/book/:clinicSlug" element={<BookingPage />} />
          <Route path="/queue/:clinicSlug" element={<QueueDisplay />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
