import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PackageDetail from './pages/PackageDetail';
import BookingForm from './pages/BookingForm';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import { BookingProvider } from './contexts/BookingContext';

function App() {
  return (
    <BookingProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/package/:id" element={<PackageDetail />} />
            <Route path="/booking" element={<BookingForm />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<PaymentSuccess />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}

export default App;